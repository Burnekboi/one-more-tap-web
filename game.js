/**
 * ONE MORE TAP - TikTok Mini Game / ByteDance Native Canvas Engine
 * Version: 1.0.0
 * 
 * Works natively in:
 * 1. ByteDance Developer Tools (字节跳动开发者工具 / TikTok Mini Game runtime)
 * 2. Mobile TikTok Mini Game Client (iOS / Android)
 * 3. Standard Web Browsers & HTML5 Canvas
 */

(function () {
  // Initialize ByteDance Mini Game or Web Environment
  var isTikTok = typeof tt !== 'undefined';
  var canvasObj = null;
  var ctx = null;

  if (isTikTok && typeof tt.createCanvas === 'function') {
    canvasObj = tt.createCanvas();
  } else if (typeof document !== 'undefined') {
    canvasObj = document.getElementById('gameCanvas') || document.querySelector('canvas');
    if (!canvasObj) {
      canvasObj = document.createElement('canvas');
      canvasObj.id = 'gameCanvas';
      document.body.appendChild(canvasObj);
    }
  }

  if (!canvasObj) {
    console.error('[OneMoreTap] Failed to initialize canvas');
    return;
  }

  ctx = canvasObj.getContext('2d');

  // Screen & Viewport setup
  var width = 360;
  var height = 640;
  var dpr = 1;

  function resize() {
    if (isTikTok && typeof tt.getSystemInfoSync === 'function') {
      var sys = tt.getSystemInfoSync();
      width = sys.windowWidth || 360;
      height = sys.windowHeight || 640;
      dpr = sys.pixelRatio || 1;
    } else if (typeof window !== 'undefined') {
      width = window.innerWidth || 360;
      height = window.innerHeight || 640;
      dpr = window.devicePixelRatio || 1;
    }

    canvasObj.width = width * dpr;
    canvasObj.height = height * dpr;
    if (canvasObj.style) {
      canvasObj.style.width = width + 'px';
      canvasObj.style.height = height + 'px';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resize);
  }

  // --- AUDIO SYNTHESIZER ---
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && typeof AudioContext !== 'undefined') {
      audioCtx = new AudioContext();
    } else if (!audioCtx && typeof webkitAudioContext !== 'undefined') {
      audioCtx = new webkitAudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal) {
    try {
      var actx = getAudioContext();
      if (!actx) return;
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(gainVal || 0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + duration);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (e) {
      // Ignore audio failure
    }
  }

  var sound = {
    tap: function () { playTone(587.33, 'triangle', 0.08, 0.2); },
    perfect: function () {
      playTone(523.25, 'sine', 0.1, 0.2);
      setTimeout(function () { playTone(659.25, 'sine', 0.15, 0.2); }, 60);
      setTimeout(function () { playTone(783.99, 'sine', 0.2, 0.2); }, 120);
    },
    miss: function () { playTone(146.83, 'sawtooth', 0.25, 0.3); },
    tick: function () { playTone(880, 'sine', 0.03, 0.05); }
  };

  // --- PERSISTENCE ---
  var STORAGE_KEY = 'ONEMORETAP_SAVE_V1';
  var playerData = {
    bestScoreWeird: 0,
    bestScoreCrazy: 0,
    weirdModeCleared: false,
    totalTaps: 0,
    highestCombo: 0,
    totalRuns: 0
  };

  function loadSave() {
    try {
      var raw = null;
      if (isTikTok && typeof tt.getStorageSync === 'function') {
        raw = tt.getStorageSync(STORAGE_KEY);
      } else if (typeof localStorage !== 'undefined') {
        raw = localStorage.getItem(STORAGE_KEY);
      }
      if (raw) {
        var parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        playerData = Object.assign(playerData, parsed);
      }
    } catch (e) {}
  }

  function writeSave() {
    try {
      var str = JSON.stringify(playerData);
      if (isTikTok && typeof tt.setStorageSync === 'function') {
        tt.setStorageSync(STORAGE_KEY, str);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, str);
      }
    } catch (e) {}
  }

  loadSave();

  // --- GAME STATE ---
  var STATE = {
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER',
    VICTORY: 'VICTORY',
    ACHIEVEMENTS: 'ACHIEVEMENTS'
  };

  var currentState = STATE.MENU;
  var currentMode = 'WEIRD'; // 'WEIRD' (24 stages) | 'CRAZY' (50 stages)
  var currentStageIndex = 0;
  var currentScore = 0;
  var currentCombo = 0;
  var timerBankSeconds = 10.0;
  var maxTimerBank = 10.0;
  var lastFrameTime = Date.now();
  var canReviveThisRun = true;
  var activeChallenge = null;

  // --- 24 WEIRD MODE STAGES SPECIFICATION ---
  var WEIRD_STAGES = [
    { title: "Stage 1", prompt: "TAP THE RED CIRCLE", color: "#ef4444", count: 1, odd: false },
    { title: "Stage 2", prompt: "TAP THE BLUE CIRCLE", color: "#3b82f6", count: 2, odd: false },
    { title: "Stage 3", prompt: "TAP THE GREEN CIRCLE", color: "#10b981", count: 3, odd: false },
    { title: "Stage 4", prompt: "DON'T TAP THE RED ONE", color: "#3b82f6", dangerColor: "#ef4444", count: 3, odd: false },
    { title: "Stage 5", prompt: "TAP THE YELLOW CIRCLE", color: "#eab308", count: 4, odd: false },
    { title: "Stage 6", prompt: "TAP NUMBER 7", color: "#8b5cf6", count: 3, num: 7 },
    { title: "Stage 7", prompt: "TAP THE TOP CIRCLE", color: "#06b6d4", count: 3, top: true },
    { title: "Stage 8", prompt: "TAP THE PURPLE CIRCLE", color: "#a855f7", count: 4, odd: false },
    { title: "Stage 9", prompt: "TAP THE ODD NUMBER", color: "#f97316", count: 3, oddCheck: true },
    { title: "Stage 10", prompt: "TAP THE MOVING CIRCLE", color: "#ec4899", count: 3, moving: true },
    { title: "Stage 11", prompt: "TAP THE VEGETABLE", color: "#10b981", count: 3, emoji: "🥦", decoys: ["🍕", "🍟"] },
    { title: "Stage 12", prompt: "TAP THE FASTEST PULSE", color: "#ef4444", count: 3, pulse: true },
    { title: "Stage 13", prompt: "TAP THE CYAN CIRCLE", color: "#00f2fe", count: 4, odd: false },
    { title: "Stage 14", prompt: "TAP NUMBER 3", color: "#3b82f6", count: 3, num: 3 },
    { title: "Stage 15", prompt: "DON'T TAP! WAIT 1s", color: "#ef4444", wait: 1.2 },
    { title: "Stage 16", prompt: "TAP THE BIGGEST CIRCLE", color: "#8b5cf6", count: 3, big: true },
    { title: "Stage 17", prompt: "TAP THE SMALLEST CIRCLE", color: "#10b981", count: 3, small: true },
    { title: "Stage 18", prompt: "TAP THE ORANGE CIRCLE", color: "#f97316", count: 4, odd: false },
    { title: "Stage 19", prompt: "TAP THE GHOST CIRCLE", color: "#64748b", count: 3, ghost: true },
    { title: "Stage 20", prompt: "TAP NUMBER 9", color: "#eab308", count: 4, num: 9 },
    { title: "Stage 21", prompt: "OPPOSITE: TAP LEFT!", color: "#06b6d4", opposite: true },
    { title: "Stage 22", prompt: "TAP THE SHY CIRCLE", color: "#ec4899", count: 3, shy: true },
    { title: "Stage 23", prompt: "QUICK! 2 + 2 = ?", color: "#3b82f6", math: { ans: 4, choices: [4, 22, 5] } },
    { title: "Stage 24", prompt: "FINAL WEIRD: TAP GOLD!", color: "#ffd700", count: 5, final: true }
  ];

  // Generate Stage Challenge
  function setupStage(stageNum, mode) {
    var maxStages = mode === 'WEIRD' ? 24 : 50;
    var targets = [];

    var stageSpec = WEIRD_STAGES[(stageNum - 1) % WEIRD_STAGES.length];
    var prompt = stageSpec.prompt;

    if (mode === 'CRAZY') {
      prompt = "CRAZY " + stageNum + ": " + stageSpec.prompt;
    }

    var playTop = 130;
    var playBottom = height - 120;
    var playLeft = 40;
    var playRight = width - 40;

    var numTargets = stageSpec.count || 3;
    if (stageSpec.wait) {
      numTargets = 1;
    }

    for (var i = 0; i < numTargets; i++) {
      var x = playLeft + Math.random() * (playRight - playLeft);
      var y = playTop + Math.random() * (playBottom - playTop);
      var radius = 38;
      var isCorrect = (i === 0);
      var color = isCorrect ? stageSpec.color : "#475569";
      var label = "";

      if (stageSpec.num) {
        label = isCorrect ? "" + stageSpec.num : "" + (stageSpec.num + i * 2);
      } else if (stageSpec.oddCheck) {
        label = isCorrect ? "7" : (i === 1 ? "4" : "6");
      } else if (stageSpec.emoji) {
        label = isCorrect ? stageSpec.emoji : (stageSpec.decoys ? stageSpec.decoys[i - 1] : "🍕");
      } else if (stageSpec.math) {
        label = "" + stageSpec.math.choices[i];
        isCorrect = (stageSpec.math.choices[i] === stageSpec.math.ans);
        color = "#3b82f6";
      } else if (stageSpec.top) {
        if (i === 0) y = playTop + 30;
        else y = playTop + 140 + i * 80;
        isCorrect = (i === 0);
      } else if (stageSpec.opposite) {
        // opposite day: says tap left -> tap right
        x = i === 0 ? width * 0.75 : width * 0.25;
        y = height * 0.5;
        isCorrect = (i === 0);
        color = isCorrect ? "#06b6d4" : "#ec4899";
        label = isCorrect ? "RIGHT" : "LEFT";
      } else if (stageSpec.dangerColor && i === 1) {
        color = stageSpec.dangerColor;
        isCorrect = false;
      }

      targets.push({
        id: i,
        x: x,
        y: y,
        vx: stageSpec.moving ? (Math.random() > 0.5 ? 2 : -2) : 0,
        vy: stageSpec.moving ? (Math.random() > 0.5 ? 2 : -2) : 0,
        radius: radius,
        color: color,
        label: label,
        isCorrect: isCorrect,
        isShy: stageSpec.shy && isCorrect
      });
    }

    activeChallenge = {
      stage: stageNum,
      prompt: prompt,
      targets: targets,
      isWaitStage: !!stageSpec.wait,
      waitRemaining: stageSpec.wait || 0,
      maxStages: maxStages
    };
  }

  // --- START / RESTART / REVIVE ---
  function startGame(mode) {
    currentMode = mode;
    currentStageIndex = 1;
    currentScore = 0;
    currentCombo = 0;
    timerBankSeconds = 10.0;
    canReviveThisRun = true;
    playerData.totalRuns++;
    writeSave();

    setupStage(currentStageIndex, currentMode);
    currentState = STATE.PLAYING;
    sound.tap();
  }

  function handleStageSuccess() {
    currentScore += 10 + currentCombo * 5;
    currentCombo++;
    if (currentCombo > playerData.highestCombo) {
      playerData.highestCombo = currentCombo;
    }

    // Add +1.5s to continuous timer bank (capped at 10s)
    timerBankSeconds = Math.min(maxTimerBank, timerBankSeconds + 1.5);
    sound.perfect();

    // Check completion
    if (currentStageIndex >= activeChallenge.maxStages) {
      if (currentMode === 'WEIRD') {
        playerData.weirdModeCleared = true;
        if (currentScore > playerData.bestScoreWeird) playerData.bestScoreWeird = currentScore;
      } else {
        if (currentScore > playerData.bestScoreCrazy) playerData.bestScoreCrazy = currentScore;
      }
      writeSave();
      currentState = STATE.VICTORY;
      return;
    }

    currentStageIndex++;
    if (currentMode === 'WEIRD' && currentScore > playerData.bestScoreWeird) {
      playerData.bestScoreWeird = currentScore;
    } else if (currentMode === 'CRAZY' && currentScore > playerData.bestScoreCrazy) {
      playerData.bestScoreCrazy = currentScore;
    }
    writeSave();

    setupStage(currentStageIndex, currentMode);
  }

  function handleStageFailure() {
    sound.miss();
    if (currentMode === 'WEIRD' && currentScore > playerData.bestScoreWeird) {
      playerData.bestScoreWeird = currentScore;
    } else if (currentMode === 'CRAZY' && currentScore > playerData.bestScoreCrazy) {
      playerData.bestScoreCrazy = currentScore;
    }
    writeSave();
    currentState = STATE.GAME_OVER;
  }

  function reviveRun() {
    // Revive with full 10 seconds timer bank!
    canReviveThisRun = false;
    timerBankSeconds = 10.0;
    setupStage(currentStageIndex, currentMode);
    currentState = STATE.PLAYING;
    sound.perfect();
  }

  // --- TIKTOK REWARDED VIDEO ADS ---
  function showTikTokAdForRevive() {
    if (isTikTok && typeof tt.createRewardedVideoAd === 'function') {
      try {
        var videoAd = tt.createRewardedVideoAd({
          adUnitId: 'tt_rewarded_revive_ad_unit_01'
        });
        videoAd.show().catch(function () {
          videoAd.load().then(function () { return videoAd.show(); }).catch(function () {
            // Ad load failed, give free revive fallback
            reviveRun();
          });
        });
        videoAd.onClose(function (res) {
          if (res && res.isEnded) {
            reviveRun();
          }
        });
        return;
      } catch (e) {}
    }
    // Web simulation / Fallback
    reviveRun();
  }

  // --- TOUCH INPUT HANDLER ---
  function handleTouch(touchX, touchY) {
    playerData.totalTaps++;

    if (currentState === STATE.MENU) {
      // Button: WEIRD MODE (Easy)
      if (touchY >= 320 && touchY <= 385 && touchX >= 40 && touchX <= width - 40) {
        startGame('WEIRD');
        return;
      }
      // Button: CRAZY MODE (Hard)
      if (touchY >= 405 && touchY <= 470 && touchX >= 40 && touchX <= width - 40) {
        if (playerData.weirdModeCleared || playerData.bestScoreWeird > 0) {
          startGame('CRAZY');
        } else {
          // Play Weird Mode first if locked
          sound.miss();
          startGame('WEIRD');
        }
        return;
      }
      // Button: ACHIEVEMENTS
      if (touchY >= 490 && touchY <= 545 && touchX >= 40 && touchX <= width - 40) {
        currentState = STATE.ACHIEVEMENTS;
        sound.tap();
        return;
      }
      return;
    }

    if (currentState === STATE.ACHIEVEMENTS) {
      // Back button
      if (touchY >= height - 80 && touchY <= height - 30) {
        currentState = STATE.MENU;
        sound.tap();
      }
      return;
    }

    if (currentState === STATE.GAME_OVER) {
      // Revive Button (if available)
      if (canReviveThisRun && touchY >= height * 0.58 && touchY <= height * 0.58 + 55 && touchX >= 40 && touchX <= width - 40) {
        showTikTokAdForRevive();
        return;
      }
      // Retry Button
      if (touchY >= height * 0.70 && touchY <= height * 0.70 + 50 && touchX >= 40 && touchX <= width - 40) {
        startGame(currentMode);
        return;
      }
      // Menu Button
      if (touchY >= height * 0.80 && touchY <= height * 0.80 + 45 && touchX >= 60 && touchX <= width - 60) {
        currentState = STATE.MENU;
        sound.tap();
        return;
      }
      return;
    }

    if (currentState === STATE.VICTORY) {
      // Menu Button
      if (touchY >= height * 0.65 && touchY <= height * 0.65 + 50 && touchX >= 40 && touchX <= width - 40) {
        currentState = STATE.MENU;
        sound.tap();
        return;
      }
      return;
    }

    if (currentState === STATE.PLAYING && activeChallenge) {
      if (activeChallenge.isWaitStage) {
        // Tapping on a "Don't tap" stage fails instantly!
        handleStageFailure();
        return;
      }

      var hitAny = false;
      for (var i = 0; i < activeChallenge.targets.length; i++) {
        var t = activeChallenge.targets[i];
        var dx = touchX - t.x;
        var dy = touchY - t.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= t.radius + 15) {
          hitAny = true;
          if (t.isShy) {
            // Teleport away on first tap!
            t.x = 60 + Math.random() * (width - 120);
            t.y = 150 + Math.random() * (height - 300);
            t.isShy = false;
            sound.tap();
            return;
          }

          if (t.isCorrect) {
            handleStageSuccess();
          } else {
            handleStageFailure();
          }
          return;
        }
      }

      // Tapped empty space -> Miss!
      if (!hitAny) {
        handleStageFailure();
      }
    }
  }

  // Register touch events
  if (isTikTok && typeof tt.onTouchStart === 'function') {
    tt.onTouchStart(function (e) {
      if (e && e.touches && e.touches[0]) {
        handleTouch(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  } else if (canvasObj) {
    canvasObj.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (e.touches && e.touches[0]) {
        var rect = canvasObj.getBoundingClientRect();
        handleTouch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }, { passive: false });

    canvasObj.addEventListener('mousedown', function (e) {
      var rect = canvasObj.getBoundingClientRect();
      handleTouch(e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  // --- GAME LOOP & RENDERER ---
  function update(dt) {
    if (currentState === STATE.PLAYING) {
      timerBankSeconds -= dt;
      if (timerBankSeconds <= 0) {
        timerBankSeconds = 0;
        handleStageFailure();
        return;
      }

      if (activeChallenge) {
        if (activeChallenge.isWaitStage) {
          activeChallenge.waitRemaining -= dt;
          if (activeChallenge.waitRemaining <= 0) {
            handleStageSuccess();
            return;
          }
        }

        // Update target motion
        for (var i = 0; i < activeChallenge.targets.length; i++) {
          var t = activeChallenge.targets[i];
          if (t.vx || t.vy) {
            t.x += t.vx;
            t.y += t.vy;
            if (t.x - t.radius < 30 || t.x + t.radius > width - 30) t.vx *= -1;
            if (t.y - t.radius < 140 || t.y + t.radius > height - 130) t.vy *= -1;
          }
        }
      }
    }
  }

  function render() {
    // Clear screen
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);

    if (currentState === STATE.MENU) {
      renderMenu();
    } else if (currentState === STATE.PLAYING) {
      renderPlaying();
    } else if (currentState === STATE.GAME_OVER) {
      renderGameOver();
    } else if (currentState === STATE.VICTORY) {
      renderVictory();
    } else if (currentState === STATE.ACHIEVEMENTS) {
      renderAchievements();
    }
  }

  function renderMenu() {
    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('TIKTOK MINI GAME', width * 0.5, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('ONE MORE TAP', width * 0.5, 135);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText('Continuous 10s Reflex Gauntlet', width * 0.5, 165);

    // High Score Cards
    var cardW = (width - 90) * 0.5;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(40, 195, cardW, 75);
    ctx.strokeStyle = '#27272a';
    ctx.strokeRect(40, 195, cardW, 75);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('WEIRD BEST', 40 + cardW * 0.5, 220);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px monospace';
    ctx.fillText('' + (playerData.bestScoreWeird || 0), 40 + cardW * 0.5, 252);

    ctx.fillStyle = '#18181b';
    ctx.fillRect(50 + cardW, 195, cardW, 75);
    ctx.strokeStyle = '#27272a';
    ctx.strokeRect(50 + cardW, 195, cardW, 75);

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('CRAZY BEST', 50 + cardW * 1.5, 220);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 24px monospace';
    ctx.fillText('' + (playerData.bestScoreCrazy || 0), 50 + cardW * 1.5, 252);

    // WEIRD MODE BUTTON
    ctx.fillStyle = '#10b981';
    roundRect(ctx, 40, 320, width - 80, 65, 16, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = '900 18px sans-serif';
    ctx.fillText('PLAY WEIRD MODE (Easy)', width * 0.5, 350);
    ctx.font = '11px sans-serif';
    ctx.fillText('24 Quickfire Stages • Circle Colors', width * 0.5, 370);

    // CRAZY MODE BUTTON
    var crazyUnlocked = playerData.weirdModeCleared || playerData.bestScoreWeird > 0;
    ctx.fillStyle = crazyUnlocked ? '#f43f5e' : '#27272a';
    roundRect(ctx, 40, 405, width - 80, 65, 16, true, false);
    ctx.fillStyle = crazyUnlocked ? '#ffffff' : '#94a3b8';
    ctx.font = '900 18px sans-serif';
    ctx.fillText(crazyUnlocked ? 'PLAY CRAZY MODE (Hard)' : 'CRAZY MODE (🔒 Clear Weird)', width * 0.5, 435);
    ctx.font = '11px sans-serif';
    ctx.fillText(crazyUnlocked ? '50 Stages • Continuous 10s Timer' : 'Beat Stage 24 in Weird Mode to Unlock', width * 0.5, 455);

    // ACHIEVEMENTS BUTTON
    ctx.fillStyle = '#27272a';
    roundRect(ctx, 40, 490, width - 80, 55, 14, true, false);
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('🏆 VIEW ACHIEVEMENTS', width * 0.5, 524);

    // Stats footer
    ctx.fillStyle = '#64748b';
    ctx.font = '11px monospace';
    ctx.fillText('Peak Combo: x' + playerData.highestCombo + ' • Lifetime Taps: ' + playerData.totalTaps, width * 0.5, height - 35);
  }

  function renderPlaying() {
    if (!activeChallenge) return;

    // Header: Mode & Stage
    ctx.textAlign = 'left';
    ctx.fillStyle = currentMode === 'WEIRD' ? '#10b981' : '#f43f5e';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText((currentMode === 'WEIRD' ? 'WEIRD MODE' : 'CRAZY MODE') + ' • STAGE ' + currentStageIndex + '/' + activeChallenge.maxStages, 24, 45);

    // Score & Combo
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SCORE: ' + currentScore, width - 24, 45);

    if (currentCombo > 1) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('COMBO x' + currentCombo, width - 24, 65);
    }

    // CONTINUOUS 10-SECOND TIMER BANK BAR
    var barY = 75;
    var barW = width - 48;
    var barH = 16;
    ctx.fillStyle = '#27272a';
    roundRect(ctx, 24, barY, barW, barH, 8, true, false);

    var fillPct = Math.max(0, Math.min(1, timerBankSeconds / maxTimerBank));
    var timerColor = timerBankSeconds < 3.0 ? '#ef4444' : (timerBankSeconds < 6.0 ? '#eab308' : '#00f2fe');
    ctx.fillStyle = timerColor;
    if (fillPct > 0.05) {
      roundRect(ctx, 24, barY, barW * fillPct, barH, 8, true, false);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(timerBankSeconds.toFixed(1) + 's', width * 0.5, barY + 12);

    // INSTRUCTION PROMPT BANNER
    ctx.fillStyle = '#18181b';
    roundRect(ctx, 20, 105, width - 40, 50, 12, true, false);
    ctx.strokeStyle = currentMode === 'WEIRD' ? '#059669' : '#be123c';
    ctx.lineWidth = 1.5;
    roundRect(ctx, 20, 105, width - 40, 50, 12, false, true);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 16px sans-serif';
    ctx.fillText(activeChallenge.prompt, width * 0.5, 136);

    // TARGETS
    for (var i = 0; i < activeChallenge.targets.length; i++) {
      var t = activeChallenge.targets[i];

      // Outer glow / shadow
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      // Circle body
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
      ctx.fillStyle = t.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner label / number / emoji
      if (t.label) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(t.label, t.x, t.y + 7);
      }
    }
  }

  function renderGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f43f5e';
    ctx.font = '900 34px sans-serif';
    ctx.fillText('STAGE FAILED', width * 0.5, height * 0.25);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Reached Stage ' + currentStageIndex + ' in ' + (currentMode === 'WEIRD' ? 'Weird Mode' : 'Crazy Mode'), width * 0.5, height * 0.30);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px monospace';
    ctx.fillText('' + currentScore, width * 0.5, height * 0.40);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('Peak Combo: x' + currentCombo, width * 0.5, height * 0.45);

    // TIKTOK REVIVE AD BUTTON
    if (canReviveThisRun) {
      ctx.fillStyle = '#00f2fe';
      roundRect(ctx, 40, height * 0.58, width - 80, 55, 16, true, false);
      ctx.fillStyle = '#000000';
      ctx.font = '900 17px sans-serif';
      ctx.fillText('▶ REVIVE (+10s Timer)', width * 0.5, height * 0.58 + 34);
    }

    // RETRY BUTTON
    ctx.fillStyle = '#10b981';
    roundRect(ctx, 40, height * 0.70, width - 80, 50, 14, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('PLAY AGAIN', width * 0.5, height * 0.70 + 31);

    // MENU BUTTON
    ctx.fillStyle = '#27272a';
    roundRect(ctx, 60, height * 0.80, width - 120, 45, 12, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('RETURN TO MENU', width * 0.5, height * 0.80 + 28);
  }

  function renderVictory() {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#10b981';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('VICTORY!', width * 0.5, height * 0.25);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText((currentMode === 'WEIRD' ? 'WEIRD MODE 24/24' : 'CRAZY MODE 50/50') + ' COMPLETED!', width * 0.5, height * 0.32);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 48px monospace';
    ctx.fillText('' + currentScore, width * 0.5, height * 0.44);

    if (currentMode === 'WEIRD') {
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('🔥 CRAZY MODE IS NOW UNLOCKED! 🔥', width * 0.5, height * 0.52);
    }

    // MENU BUTTON
    ctx.fillStyle = '#10b981';
    roundRect(ctx, 40, height * 0.65, width - 80, 50, 14, true, false);
    ctx.fillStyle = '#000000';
    ctx.font = '900 16px sans-serif';
    ctx.fillText('BACK TO MENU', width * 0.5, height * 0.65 + 31);
  }

  function renderAchievements() {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '900 24px sans-serif';
    ctx.fillText('🏆 ACHIEVEMENTS', width * 0.5, 60);

    var achList = [
      { name: "First Tap", desc: "Complete your first stage", unlocked: playerData.totalTaps > 0 },
      { name: "Weird Champion", desc: "Clear all 24 Weird Mode stages", unlocked: playerData.weirdModeCleared },
      { name: "Combo Master", desc: "Achieve a 10x combo streak", unlocked: playerData.highestCombo >= 10 },
      { name: "Combo Legend", desc: "Achieve a 25x combo streak", unlocked: playerData.highestCombo >= 25 },
      { name: "Century Club", desc: "Accumulate 100 lifetime taps", unlocked: playerData.totalTaps >= 100 },
      { name: "Gauntlet Conqueror", desc: "Conquer Crazy Mode 50 stages", unlocked: playerData.bestScoreCrazy >= 500 }
    ];

    var startY = 100;
    for (var i = 0; i < achList.length; i++) {
      var a = achList[i];
      var y = startY + i * 65;

      ctx.fillStyle = a.unlocked ? '#18181b' : '#111113';
      roundRect(ctx, 30, y, width - 60, 55, 10, true, false);
      ctx.strokeStyle = a.unlocked ? '#fbbf24' : '#27272a';
      roundRect(ctx, 30, y, width - 60, 55, 10, false, true);

      ctx.textAlign = 'left';
      ctx.fillStyle = a.unlocked ? '#ffffff' : '#64748b';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(a.name, 45, y + 24);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(a.desc, 45, y + 42);

      ctx.textAlign = 'right';
      ctx.fillStyle = a.unlocked ? '#fbbf24' : '#475569';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(a.unlocked ? 'UNLOCKED' : 'LOCKED', width - 45, y + 33);
    }

    // BACK BUTTON
    ctx.textAlign = 'center';
    ctx.fillStyle = '#27272a';
    roundRect(ctx, 40, height - 75, width - 80, 48, 12, true, false);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('BACK TO MENU', width * 0.5, height - 45);
  }

  function roundRect(context, x, y, w, h, r, fill, stroke) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.closePath();
    if (fill) context.fill();
    if (stroke) context.stroke();
  }

  // Animation frame loop
  function loop() {
    var now = Date.now();
    var dt = (now - lastFrameTime) / 1000.0;
    if (dt > 0.1) dt = 0.1;
    lastFrameTime = now;

    update(dt);
    render();

    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(loop);
    } else if (isTikTok && typeof tt.requestAnimationFrame === 'function') {
      tt.requestAnimationFrame(loop);
    }
  }

  loop();
})();
