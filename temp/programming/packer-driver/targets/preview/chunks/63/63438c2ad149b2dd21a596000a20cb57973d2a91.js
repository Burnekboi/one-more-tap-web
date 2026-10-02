System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, Music, _crd, SR;

  /** Mixes one oscillator voice into a mono PCM buffer (naive wavetable synth). */
  function addTone(buf, start, dur, f0, f1, wave, vol) {
    var i0 = Math.floor(start * SR);
    var i1 = Math.min(buf.length, Math.floor((start + dur) * SR));
    if (i1 <= i0) return;
    var phase = 0;
    var twoPi = 2 * Math.PI;
    var n = i1 - i0;

    for (var i = i0; i < i1; i++) {
      var t = (i - i0) / n;
      var f = f0 + (f1 - f0) * t;
      phase += twoPi * f / SR;
      var env = Math.pow(1 - t, 1.4);
      var v = 0;
      if (wave === 'sine') v = Math.sin(phase);else if (wave === 'square') v = phase % twoPi < Math.PI ? 1 : -1;else if (wave === 'triangle') v = 2 / Math.PI * Math.asin(Math.sin(phase));else if (wave === 'saw') v = 2 * (phase / twoPi % 1) - 1;else v = Math.random() * 2 - 1;
      buf[i] += v * vol * env;
    }
  }

  function encodeWav(samples, sampleRate) {
    var n = samples.length;
    var buffer = new ArrayBuffer(44 + n * 2);
    var view = new DataView(buffer);

    var put = (o, s) => {
      for (var i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i));
    };

    put(0, 'RIFF');
    view.setUint32(4, 36 + n * 2, true);
    put(8, 'WAVE');
    put(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    put(36, 'data');
    view.setUint32(40, n * 2, true);
    var o = 44;

    for (var i = 0; i < n; i++) {
      var s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      o += 2;
    }

    return buffer;
  }

  _export("Music", void 0);

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "ae095Idg3RCmqQBaoDyR2c0", "Music", undefined);
      /**
       * Synthetic Audio Engine — zero external audio assets.
       *
       * Two backends:
       *  - TikTok Mini Game: synthesizes 16-bit PCM WAV files at runtime into
       *    tt.env.USER_DATA_PATH and plays them with tt.createInnerAudioContext()
       *    (the guaranteed-to-work native audio path on ByteDance/TikTok runtimes).
       *  - Browser Preview: plays the same synthesized PCM through WebAudio
       *    AudioBufferSourceNode loops/bursts.
       *
       * A short chiptune loop is synthesized for the dashboard (menu) BGM and is
       * intentionally silent during gameplay — only the SFX below play in-game.
       */


      SR = 22050;

      _export("Music", Music = class Music {
        static getPcm(name) {
          if (!this.pcmCache[name]) {
            switch (name) {
              case 'tap':
                this.pcmCache[name] = this.buildTap();
                break;

              case 'combo':
                this.pcmCache[name] = this.buildCombo();
                break;

              case 'perfect':
                this.pcmCache[name] = this.buildPerfect();
                break;

              case 'miss':
                this.pcmCache[name] = this.buildMiss();
                break;

              case 'milestone':
                this.pcmCache[name] = this.buildMilestone();
                break;

              case 'fanfare':
                this.pcmCache[name] = this.buildFanfare();
                break;

              case 'bgm':
                this.pcmCache[name] = this.buildBgm();
                break;
            }
          }

          return this.pcmCache[name];
        }

        static isTikTok() {
          return typeof tt !== 'undefined' && typeof tt.createInnerAudioContext === 'function' && typeof tt.getFileSystemManager === 'function';
        } // ---------------------------------------------------------------------------
        // TikTok backend (InnerAudioContext + runtime WAV files)
        // ---------------------------------------------------------------------------


        static ensureTTSetup() {
          if (this.ttFiles) return;

          try {
            var fs = tt.getFileSystemManager();
            var base = tt.env && tt.env.USER_DATA_PATH ? tt.env.USER_DATA_PATH : '';
            if (!base || !fs.writeFileSync) return;
            var names = ['tap', 'combo', 'perfect', 'miss', 'milestone', 'fanfare', 'bgm'];
            this.ttFiles = {};

            for (var name of names) {
              var path = base + "/omt_" + name + ".wav";
              var pcm = this.getPcm(name);
              if (!pcm) continue;
              fs.writeFileSync(path, encodeWav(pcm, SR), 'binary');
              this.ttFiles[name] = path;
            }

            console.log("[Music] TikTok audio files ready (" + names.length + ")");
          } catch (e) {
            console.warn('[Music] TikTok audio setup failed, falling back to WebAudio', e);
            this.ttFiles = null;
          }
        }

        static playTTSfx(name, rate) {
          if (rate === void 0) {
            rate = 1;
          }

          this.ensureTTSetup();
          var path = this.ttFiles && this.ttFiles[name];
          if (!path) return;
          var pool = this.ttSfxPool[name];

          if (!pool) {
            pool = [];

            for (var i = 0; i < 3; i++) {
              var _a = tt.createInnerAudioContext();

              _a.src = path;
              _a.loop = false;
              _a.volume = this.muted ? 0 : 1;
              _a.playbackRate = 1;
              pool.push(_a);
            }

            this.ttSfxPool[name] = pool;
          }

          var idx = this.ttSfxIdx[name] || 0;
          this.ttSfxIdx[name] = (idx + 1) % pool.length;
          var a = pool[idx];

          try {
            a.playbackRate = rate;
            a.volume = this.muted ? 0 : 1;
            a.stop();
            a.play();
          } catch (e) {}
        }

        static startTTBgm() {
          this.ensureTTSetup();
          var path = this.ttFiles && this.ttFiles.bgm;
          if (!path) return;

          if (this.ttBgm) {
            try {
              this.ttBgm.volume = 1;
              this.ttBgm.play();
            } catch (e) {}

            return;
          }

          try {
            var a = tt.createInnerAudioContext();
            a.src = path;
            a.loop = true;
            a.volume = 1;
            a.play();
            this.ttBgm = a;
          } catch (e) {}
        }

        static stopTTBgm() {
          if (!this.ttBgm) return;

          try {
            this.ttBgm.pause();
          } catch (e) {}
        } // ---------------------------------------------------------------------------
        // Web backend (AudioBufferSourceNode playback of the same PCM)
        // ---------------------------------------------------------------------------


        static ensureWeb() {
          if (this.ctx) return;
          var AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);

          if (AC) {
            try {
              this.ctx = new AC();
            } catch (e) {}
          }

          if (this.ctx && this.ctx.resume) {
            try {
              this.ctx.resume();
            } catch (e) {}
          }
        }

        static getAudioBuffer(name) {
          if (!this.ctx) return null;

          if (!this.audioBuffers[name]) {
            var pcm = this.getPcm(name);
            if (!pcm) return null;
            var buf = this.ctx.createBuffer(1, pcm.length, SR);
            buf.getChannelData(0).set(pcm);
            this.audioBuffers[name] = buf;
          }

          return this.audioBuffers[name];
        }

        static playWebSfx(name, rate) {
          if (rate === void 0) {
            rate = 1;
          }

          this.ensureWeb();
          if (!this.ctx) return;

          try {
            var buf = this.getAudioBuffer(name);
            if (!buf) return;
            var src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.playbackRate.value = rate;
            src.connect(this.ctx.destination);
            src.start();
          } catch (e) {}
        }

        static startWebBgm() {
          this.ensureWeb();
          if (!this.ctx) return;

          try {
            if (this.webBgmSource) {
              try {
                this.webBgmSource.start(0);
              } catch (e) {}

              return;
            }

            var buf = this.getAudioBuffer('bgm');
            if (!buf) return;
            var src = this.ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true;
            src.connect(this.ctx.destination);
            src.start();
            this.webBgmSource = src;
          } catch (e) {}
        }

        static stopWebBgm() {
          if (!this.webBgmSource) return;

          try {
            this.webBgmSource.stop();
          } catch (e) {}

          this.webBgmSource = null;
        } // ---------------------------------------------------------------------------
        // Public API
        // ---------------------------------------------------------------------------

        /** Call on a user gesture so audio unlock happens within the tap. */


        static unlock() {
          if (this.isTikTok()) this.ensureTTSetup();else this.ensureWeb();
        }

        static setMuted(muted) {
          this.muted = muted;

          if (muted) {
            this.stopMenuMusic();
          } else if (this.bgmWanted) {
            this.startMenuMusic();
          }
        }

        static isMuted() {
          return this.muted;
        }

        static startMenuMusic() {
          this.bgmWanted = true;
          if (this.muted) return;
          if (this.isTikTok()) this.startTTBgm();else this.startWebBgm();
        }

        static stopMenuMusic() {
          this.bgmWanted = false;
          if (this.isTikTok()) this.stopTTBgm();else this.stopWebBgm();
        }

        static playTap() {
          if (this.muted) return;
          if (this.isTikTok()) this.playTTSfx('tap');else this.playWebSfx('tap');
        }

        static playCombo(combo) {
          if (this.muted) return;
          var rate = Math.min(2, 1 + (combo || 0) * 0.015);
          if (this.isTikTok()) this.playTTSfx('combo', rate);else this.playWebSfx('combo', rate);
        }

        static playPerfect() {
          if (this.muted) return;
          if (this.isTikTok()) this.playTTSfx('perfect');else this.playWebSfx('perfect');
        }

        static playMiss() {
          if (this.muted) return;
          if (this.isTikTok()) this.playTTSfx('miss');else this.playWebSfx('miss');
        }

        static playMilestone() {
          if (this.muted) return;
          if (this.isTikTok()) this.playTTSfx('milestone');else this.playWebSfx('milestone');
        }

        static playVictoryFanfare() {
          if (this.muted) return;
          if (this.isTikTok()) this.playTTSfx('fanfare');else this.playWebSfx('fanfare');
        } // ---------------------------------------------------------------------------
        // PCM synthesis recipes
        // ---------------------------------------------------------------------------


        static buildTap() {
          var b = new Float32Array(Math.ceil(SR * 0.09));
          addTone(b, 0, 0.07, 600, 900, 'sine', 0.32);
          addTone(b, 0, 0.05, 1200, 1500, 'sine', 0.12);
          return b;
        }

        static buildCombo() {
          var b = new Float32Array(Math.ceil(SR * 0.13));
          addTone(b, 0, 0.1, 440, 660, 'triangle', 0.32);
          addTone(b, 0, 0.08, 880, 990, 'sine', 0.1);
          return b;
        }

        static buildPerfect() {
          var b = new Float32Array(Math.ceil(SR * 0.2));
          addTone(b, 0, 0.09, 800, 800, 'triangle', 0.3);
          addTone(b, 0.05, 0.11, 1200, 1200, 'triangle', 0.3);
          addTone(b, 0.02, 0.08, 1600, 1600, 'sine', 0.1);
          return b;
        }

        static buildMiss() {
          var b = new Float32Array(Math.ceil(SR * 0.24));
          addTone(b, 0, 0.2, 220, 110, 'saw', 0.28);
          addTone(b, 0, 0.16, 110, 82, 'sine', 0.22);
          return b;
        }

        static buildMilestone() {
          var b = new Float32Array(Math.ceil(SR * 0.6));
          var notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((f, idx) => {
            addTone(b, idx * 0.07, 0.13, f, f, 'sine', 0.24);
            addTone(b, idx * 0.07, 0.09, f * 2, f * 2, 'sine', 0.08);
          });
          return b;
        }

        static buildFanfare() {
          var b = new Float32Array(Math.ceil(SR * 1.0)); // "Pop!" noise burst

          addTone(b, 0, 0.15, 0, 0, 'noise', 0.4); // Ascending fanfare

          var notes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          notes.forEach((f, i) => {
            addTone(b, 0.08 + i * 0.09, 0.3, f, f, i === notes.length - 1 ? 'triangle' : 'saw', 0.26);
          }); // Sparkle shimmer on top

          addTone(b, 0.5, 0.22, 1568, 1568, 'sine', 0.1);
          addTone(b, 0.56, 0.2, 2093, 2093, 'sine', 0.1);
          return b;
        }
        /** ~8s upbeat chiptune loop for the dashboard (Am F C G, 118 BPM). */


        static buildBgm() {
          var beat = 60 / 118;
          var bars = 4;
          var dur = bars * 4 * beat;
          var b = new Float32Array(Math.ceil(SR * dur));
          var chords = [{
            root: 110,
            tones: [220, 261.63, 329.63]
          }, {
            root: 87.31,
            tones: [174.61, 220, 261.63]
          }, {
            root: 130.81,
            tones: [261.63, 329.63, 392]
          }, {
            root: 98,
            tones: [196, 246.94, 293.66]
          }];

          for (var bar = 0; bar < bars; bar++) {
            var ch = chords[bar];

            for (var bi = 0; bi < 4; bi++) {
              var t = (bar * 4 + bi) * beat;
              addTone(b, t, 0.12, 160, 50, 'sine', 0.32); // kick

              addTone(b, t, beat * 0.8, ch.root, ch.root, 'triangle', 0.3); // bass

              addTone(b, t + beat / 2, 0.045, 0, 0, 'noise', 0.06); // hat offbeat

              for (var s = 0; s < 2; s++) {
                var at = t + s * beat / 2;
                var toneIdx = (bi * 2 + s) % ch.tones.length;
                addTone(b, at, 0.12, ch.tones[toneIdx] * 2, ch.tones[toneIdx] * 2, 'square', 0.08); // arp
              }
            }
          }

          for (var i = 0; i < b.length; i++) {
            b[i] = Math.max(-1, Math.min(1, b[i]));
          }

          return b;
        }

      });

      Music.muted = false;
      // ---- shared synthesized PCM cache ----
      Music.pcmCache = {};
      Music.ttFiles = null;
      Music.ttSfxPool = {};
      Music.ttSfxIdx = {};
      Music.ttBgm = null;
      Music.bgmWanted = false;
      Music.ctx = null;
      Music.webBgmSource = null;
      Music.audioBuffers = {};

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=63438c2ad149b2dd21a596000a20cb57973d2a91.js.map