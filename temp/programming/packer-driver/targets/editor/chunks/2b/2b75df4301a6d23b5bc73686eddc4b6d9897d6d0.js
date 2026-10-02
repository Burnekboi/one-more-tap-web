System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, _crd, WEIRD_MODE_STAGE_COUNT;

  function generateWeirdModeStage(stageIndex) {
    const stageNum = stageIndex + 1;

    switch (stageNum) {
      case 1:
        return {
          type: 'COLOR_TARGET',
          title: 'STAGE 1: TAP THE GREEN',
          instruction: 'TAP THE GREEN CIRCLE',
          failBlurb: 'You missed the green circle!',
          targets: [{
            id: 'w-1-r',
            x: 26,
            y: 50,
            size: 60,
            color: '#ef4444',
            isCorrect: false
          }, {
            id: 'w-1-g',
            x: 50,
            y: 50,
            size: 68,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'w-1-b',
            x: 74,
            y: 50,
            size: 60,
            color: '#3b82f6',
            isCorrect: false
          }]
        };

      case 2:
        return {
          type: 'DONT_TAP',
          title: "STAGE 2: DON'T TAP RED",
          instruction: "DON'T TAP RED! CLEAR NON-RED",
          failBlurb: 'You tapped the forbidden red circle!',
          collectAllCorrect: true,
          targets: [{
            id: 'w-2-red',
            x: 26,
            y: 50,
            size: 60,
            color: '#ef4444',
            isCorrect: false
          }, {
            id: 'w-2-cyn',
            x: 50,
            y: 50,
            size: 60,
            color: '#06b6d4',
            isCorrect: true
          }, {
            id: 'w-2-ylw',
            x: 74,
            y: 50,
            size: 60,
            color: '#eab308',
            isCorrect: true
          }]
        };

      case 3:
        return {
          type: 'STROOP_TEXT',
          title: 'STAGE 3: TAP THE WORD: BLUE',
          instruction: 'TAP THE WORD "BLUE" (IGNORE INK)',
          failBlurb: 'You tapped the wrong semantic word!',
          targets: [{
            id: 'w-3-1',
            x: 26,
            y: 50,
            size: 62,
            color: '#eab308',
            label: 'BLUE',
            textColor: '#ffffff',
            isCorrect: true
          }, {
            id: 'w-3-2',
            x: 50,
            y: 50,
            size: 62,
            color: '#3b82f6',
            label: 'RED',
            textColor: '#ffffff',
            isCorrect: false
          }, {
            id: 'w-3-3',
            x: 74,
            y: 50,
            size: 62,
            color: '#22c55e',
            label: 'GREEN',
            textColor: '#ffffff',
            isCorrect: false
          }]
        };

      case 4:
        return {
          type: 'STROOP_INK',
          title: 'STAGE 4: TAP THE INK: RED',
          instruction: 'TAP TARGET WITH RED INK',
          failBlurb: 'Wrong ink color selected!',
          targets: [{
            id: 'w-4-1',
            x: 30,
            y: 50,
            size: 64,
            color: '#ef4444',
            label: 'GREEN',
            textColor: '#ffffff',
            isCorrect: true
          }, {
            id: 'w-4-2',
            x: 70,
            y: 50,
            size: 64,
            color: '#06b6d4',
            label: 'RED',
            textColor: '#ffffff',
            isCorrect: false
          }]
        };

      case 5:
        return {
          type: 'SEQUENCE',
          title: 'STAGE 5: TAP IN ASCENDING',
          instruction: 'TAP NUMBERS: 2 -> 7 -> 9',
          failBlurb: 'Tapped out of ascending sequence!',
          targets: [{
            id: 'w-5-7',
            x: 26,
            y: 50,
            size: 60,
            color: '#3b82f6',
            label: '7',
            sequenceIndex: 2,
            isCorrect: true
          }, {
            id: 'w-5-2',
            x: 50,
            y: 50,
            size: 62,
            color: '#06b6d4',
            label: '2',
            sequenceIndex: 1,
            isCorrect: true
          }, {
            id: 'w-5-9',
            x: 74,
            y: 50,
            size: 60,
            color: '#8b5cf6',
            label: '9',
            sequenceIndex: 3,
            isCorrect: false
          }]
        };

      case 6:
        return {
          type: 'SEQUENCE',
          title: 'STAGE 6: TAP IN DESCENDING',
          instruction: 'TAP NUMBERS: 9 -> 5 -> 1',
          failBlurb: 'Tapped out of descending sequence!',
          targets: [{
            id: 'w-6-1',
            x: 26,
            y: 50,
            size: 60,
            color: '#06b6d4',
            label: '1',
            sequenceIndex: 3,
            isCorrect: false
          }, {
            id: 'w-6-5',
            x: 50,
            y: 50,
            size: 60,
            color: '#3b82f6',
            label: '5',
            sequenceIndex: 2,
            isCorrect: true
          }, {
            id: 'w-6-9',
            x: 74,
            y: 50,
            size: 62,
            color: '#8b5cf6',
            label: '9',
            sequenceIndex: 1,
            isCorrect: true
          }]
        };

      case 7:
        return {
          type: 'ODD_NUMBERS',
          title: 'STAGE 7: ODD NUMBERS ONLY',
          instruction: 'TAP BOTH ODD NUMBERS',
          failBlurb: 'Tapped an even number!',
          collectAllCorrect: true,
          targets: [{
            id: 'w-7-4',
            x: 20,
            y: 50,
            size: 56,
            color: '#64748b',
            label: '4',
            isCorrect: false
          }, {
            id: 'w-7-3',
            x: 40,
            y: 50,
            size: 56,
            color: '#ec4899',
            label: '3',
            isCorrect: true
          }, {
            id: 'w-7-7',
            x: 60,
            y: 50,
            size: 56,
            color: '#f59e0b',
            label: '7',
            isCorrect: true
          }, {
            id: 'w-7-8',
            x: 80,
            y: 50,
            size: 56,
            color: '#8b5cf6',
            label: '8',
            isCorrect: false
          }]
        };

      case 8:
        return {
          type: 'EVEN_NUMBERS',
          title: 'STAGE 8: EVEN NUMBERS ONLY',
          instruction: 'TAP BOTH EVEN NUMBERS',
          failBlurb: 'Tapped an odd number!',
          collectAllCorrect: true,
          targets: [{
            id: 'w-8-1',
            x: 20,
            y: 50,
            size: 56,
            color: '#64748b',
            label: '1',
            isCorrect: false
          }, {
            id: 'w-8-2',
            x: 40,
            y: 50,
            size: 56,
            color: '#ef4444',
            label: '2',
            isCorrect: true
          }, {
            id: 'w-8-6',
            x: 60,
            y: 50,
            size: 56,
            color: '#3b82f6',
            label: '6',
            isCorrect: true
          }, {
            id: 'w-8-5',
            x: 80,
            y: 50,
            size: 56,
            color: '#f97316',
            label: '5',
            isCorrect: false
          }]
        };

      case 9:
        return {
          type: 'BIGGEST_RADIUS',
          title: 'STAGE 9: TAP THE BIGGEST',
          instruction: 'TAP THE LARGEST GEOMETRIC CIRCLE',
          failBlurb: 'Fooled by the inner digit size!',
          targets: [{
            id: 'w-9-small',
            x: 26,
            y: 50,
            size: 36,
            color: '#3b82f6',
            label: '99',
            isCorrect: false
          }, {
            id: 'w-9-mid',
            x: 50,
            y: 50,
            size: 54,
            color: '#3b82f6',
            label: '50',
            isCorrect: false
          }, {
            id: 'w-9-big',
            x: 78,
            y: 50,
            size: 76,
            color: '#22c55e',
            label: '1',
            isCorrect: true
          }]
        };

      case 10:
        return {
          type: 'SMALLEST_RADIUS',
          title: 'STAGE 10: TAP THE SMALLEST',
          instruction: 'TAP THE PHYSICALLY SMALLEST HITBOX',
          failBlurb: 'Tapped a larger circle!',
          targets: [{
            id: 'w-10-tiny',
            x: 30,
            y: 50,
            size: 34,
            color: '#ec4899',
            label: '9',
            isCorrect: true
          }, {
            id: 'w-10-huge',
            x: 70,
            y: 50,
            size: 78,
            color: '#475569',
            label: '1',
            isCorrect: false
          }]
        };

      case 11:
        return {
          type: 'MULTI_TAP',
          title: 'STAGE 11: TAP 5 TIMES',
          instruction: 'RAPID TAP 5 TIMES!',
          failBlurb: 'Not enough taps before time ran out!',
          targets: [{
            id: 'w-11-m',
            x: 50,
            y: 50,
            size: 74,
            color: '#f59e0b',
            requiredTaps: 5,
            tapsRemaining: 5,
            isCorrect: true
          }]
        };

      case 12:
        return {
          type: 'AVOID_BOMB',
          title: 'STAGE 12: AVOID THE BOMB',
          instruction: 'CLEAR SAFE TARGETS. AVOID SKULL BOMB!',
          failBlurb: 'You touched the skull bomb!',
          collectAllCorrect: true,
          targets: [{
            id: 'w-12-safe1',
            x: 30,
            y: 44,
            size: 58,
            color: '#06b6d4',
            label: 'SAFE',
            isCorrect: true
          }, {
            id: 'w-12-safe2',
            x: 70,
            y: 44,
            size: 58,
            color: '#06b6d4',
            label: 'SAFE',
            isCorrect: true
          }, {
            id: 'w-12-bomb',
            x: 50,
            y: 60,
            size: 66,
            color: '#ef4444',
            label: 'BOMB',
            isCorrect: false
          }]
        };

      case 13:
        return {
          type: 'MOVING_TARGET',
          title: 'STAGE 13: MOVING TARGET',
          instruction: 'CATCH THE BOUNCING ORB',
          failBlurb: 'The moving orb escaped your reach!',
          targets: [{
            id: 'w-13-move',
            x: 50,
            y: 50,
            size: 64,
            color: '#3b82f6',
            vx: 2.5,
            vy: 1.8,
            isCorrect: true
          }]
        };

      case 14:
        return {
          type: 'CHAMELEON',
          title: 'STAGE 14: CHAMELEON TARGET',
          instruction: 'TAP ONLY WHEN GREEN (AVOID CRIMSON)',
          failBlurb: 'Tapped while showing crimson!',
          targets: [{
            id: 'w-14-cham',
            x: 50,
            y: 50,
            size: 70,
            color: '#22c55e',
            isCorrect: true,
            colorIntervalSec: 0.7,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }]
          }]
        };

      case 15:
        return {
          type: 'TAP_CENTER',
          title: 'STAGE 15: TAP THE CENTER',
          instruction: 'TAP THE TRUE CENTER TARGET',
          failBlurb: 'You tapped an outer moving circle!',
          targets: [// The real target is fully transparent but still hittable; the 10
          // bouncing decoys orbiting around it are only there to misdirect.
          {
            id: 'w-15-center',
            x: 50,
            y: 50,
            size: 72,
            color: '#8b5cf6',
            opacity: 0,
            isCorrect: true
          }, {
            id: 'w-15-d1',
            x: 26,
            y: 40,
            size: 44,
            color: '#ef4444',
            vx: 2.6,
            vy: 1.4,
            isCorrect: false
          }, {
            id: 'w-15-d2',
            x: 74,
            y: 40,
            size: 44,
            color: '#f97316',
            vx: -2.4,
            vy: 1.7,
            isCorrect: false
          }, {
            id: 'w-15-d3',
            x: 24,
            y: 60,
            size: 44,
            color: '#eab308',
            vx: 2.2,
            vy: -1.8,
            isCorrect: false
          }, {
            id: 'w-15-d4',
            x: 76,
            y: 60,
            size: 44,
            color: '#22c55e',
            vx: -2.8,
            vy: -1.3,
            isCorrect: false
          }, {
            id: 'w-15-d5',
            x: 15,
            y: 50,
            size: 44,
            color: '#3b82f6',
            vx: 2.5,
            vy: 0.8,
            isCorrect: false
          }, {
            id: 'w-15-d6',
            x: 85,
            y: 50,
            size: 44,
            color: '#ec4899',
            vx: -2.1,
            vy: 1.9,
            isCorrect: false
          }, {
            id: 'w-15-d7',
            x: 34,
            y: 24,
            size: 44,
            color: '#8b5cf6',
            vx: 2.0,
            vy: 2.4,
            isCorrect: false
          }, {
            id: 'w-15-d8',
            x: 66,
            y: 24,
            size: 44,
            color: '#06b6d4',
            vx: -2.3,
            vy: 2.0,
            isCorrect: false
          }, {
            id: 'w-15-d9',
            x: 34,
            y: 76,
            size: 44,
            color: '#f43f5e',
            vx: 1.9,
            vy: -2.2,
            isCorrect: false
          }, {
            id: 'w-15-d10',
            x: 66,
            y: 76,
            size: 44,
            color: '#a855f7',
            vx: -1.7,
            vy: -2.5,
            isCorrect: false
          }]
        };

      case 16:
        return {
          type: 'SHRINKING_TARGET',
          title: 'STAGE 16: SHRINKING TARGET',
          instruction: 'TAP BEFORE IT COLLAPSES!',
          failBlurb: 'Target vanished into nothingness!',
          targets: [{
            id: 'w-16-shrink',
            x: 50,
            y: 50,
            size: 74,
            color: '#ec4899',
            isCorrect: true
          }]
        };

      case 17:
        return {
          type: 'OPPOSITE_DAY',
          title: 'STAGE 17: OPPOSITE DAY',
          instruction: 'DIRECTIVE: DO NOT TAP BLUE -> TAP IT!',
          failBlurb: 'Fell for opposite day trap!',
          targets: [{
            id: 'w-17-blue',
            x: 50,
            y: 50,
            size: 70,
            color: '#3b82f6',
            label: 'BLUE',
            isCorrect: true
          }]
        };

      case 18:
        return {
          type: 'DOUBLE_TROUBLE',
          title: 'STAGE 18: DOUBLE TROUBLE',
          instruction: 'TAP GREEN ONLY WHEN NOT TOUCHING TRAP!',
          failBlurb: 'Hit the bomb or missed moving orbs!',
          collectAllCorrect: true,
          overlapKill: true,
          targets: [{
            id: 'w-18-m1',
            x: 30,
            y: 40,
            size: 56,
            color: '#10b981',
            vx: 2.0,
            vy: 1.5,
            isCorrect: true
          }, {
            id: 'w-18-m2',
            x: 70,
            y: 60,
            size: 56,
            color: '#10b981',
            vx: -2.0,
            vy: -1.5,
            isCorrect: true
          }, {
            id: 'w-18-bomb',
            x: 50,
            y: 50,
            size: 64,
            color: '#ef4444',
            label: 'TRAP',
            isCorrect: false
          }]
        };

      case 19:
        return {
          type: 'FAST_MATH',
          title: 'STAGE 19: FAST MATH',
          instruction: 'SOLVE: 3 + 4 = ?',
          failBlurb: 'Wrong calculation under pressure!',
          targets: [{
            id: 'w-19-6',
            x: 22,
            y: 50,
            size: 54,
            color: '#22c55e',
            label: '6',
            isCorrect: false
          }, {
            id: 'w-19-7',
            x: 42,
            y: 50,
            size: 54,
            color: '#22c55e',
            label: '7',
            isCorrect: true
          }, {
            id: 'w-19-8',
            x: 62,
            y: 50,
            size: 54,
            color: '#22c55e',
            label: '8',
            isCorrect: false
          }, {
            id: 'w-19-9',
            x: 82,
            y: 50,
            size: 54,
            color: '#22c55e',
            label: '9',
            isCorrect: false
          }]
        };

      case 20:
        return {
          type: 'MULTI_TAP',
          title: 'STAGE 20: TAP 8 TIMES FAST',
          instruction: 'RAPID TAP 8 TIMES!',
          failBlurb: 'Finger speed too slow!',
          stopAfterTaps: 5,
          stopDurationSec: 1.0,
          stopMessage: 'Stop!',
          stopPrompt: 'STOP FOR A MOMENT!',
          targets: [{
            id: 'w-20-8',
            x: 50,
            y: 50,
            size: 76,
            color: '#f59e0b',
            requiredTaps: 8,
            tapsRemaining: 8,
            isCorrect: true
          }]
        };

      case 21:
        return {
          type: 'PRIMARY_COLORS',
          title: 'STAGE 21: ONLY PRIMARY COLORS',
          instruction: 'TAP PRIMARY (RED, BLUE, YELLOW)',
          failBlurb: 'Tapped a secondary color!',
          collectAllCorrect: true,
          targets: [{
            id: 'w-21-red',
            x: 20,
            y: 38,
            size: 54,
            color: '#ef4444',
            isCorrect: true
          }, {
            id: 'w-21-pur',
            x: 50,
            y: 38,
            size: 54,
            color: '#a855f7',
            isCorrect: false
          }, {
            id: 'w-21-blu',
            x: 80,
            y: 38,
            size: 54,
            color: '#3b82f6',
            isCorrect: true
          }, {
            id: 'w-21-grn',
            x: 20,
            y: 62,
            size: 54,
            color: '#22c55e',
            isCorrect: false
          }, {
            id: 'w-21-ylw',
            x: 50,
            y: 62,
            size: 54,
            color: '#eab308',
            isCorrect: true
          }, {
            id: 'w-21-org',
            x: 80,
            y: 62,
            size: 54,
            color: '#f97316',
            isCorrect: false
          }]
        };

      case 22:
        return {
          type: 'FLASH_MEMORY',
          title: 'STAGE 22: FLASH MEMORY',
          instruction: 'MEMORIZE! WHICH ONE WAS YELLOW?',
          failBlurb: 'Wrong target guessed after fade!',
          targets: [{
            id: 'w-22-1',
            x: 26,
            y: 50,
            size: 60,
            color: '#ef4444',
            originalColor: '#ef4444',
            isCorrect: false
          }, {
            id: 'w-22-2',
            x: 50,
            y: 50,
            size: 60,
            color: '#eab308',
            originalColor: '#eab308',
            isCorrect: true
          }, {
            id: 'w-22-3',
            x: 74,
            y: 50,
            size: 60,
            color: '#3b82f6',
            originalColor: '#3b82f6',
            isCorrect: false
          }]
        };

      case 23:
        return {
          type: 'ORBIT_TARGET',
          title: 'STAGE 23: ORBITING TARGETS',
          instruction: 'STRIKE THE GOLDEN ORBITING ORB',
          failBlurb: 'Hit the wrong orbiting decoy!',
          targets: [{
            id: 'w-23-o1',
            x: 50,
            y: 50,
            size: 56,
            color: '#3b82f6',
            isOrbiting: true,
            orbitRadius: 90,
            orbitSpeedDeg: 120,
            orbitPhaseDeg: 0,
            isCorrect: false
          }, {
            id: 'w-23-o2',
            x: 50,
            y: 50,
            size: 56,
            color: '#fbbf24',
            isOrbiting: true,
            orbitRadius: 90,
            orbitSpeedDeg: 120,
            orbitPhaseDeg: 120,
            isCorrect: true
          }, {
            id: 'w-23-o3',
            x: 50,
            y: 50,
            size: 56,
            color: '#a855f7',
            isOrbiting: true,
            orbitRadius: 90,
            orbitSpeedDeg: 120,
            orbitPhaseDeg: 240,
            isCorrect: false
          }]
        };

      case 24:
        return {
          type: 'FINAL_REFLEX',
          title: 'STAGE 24: FINAL TEST',
          instruction: '3 TAPS ONLY WHEN CYAN! AVOID SKULLS!',
          failBlurb: 'Failed the grandmaster trial!',
          targets: [{
            id: 'w-24-boss',
            x: 50,
            y: 50,
            size: 76,
            color: '#22d3ee',
            isCorrect: true,
            requiredTaps: 3,
            tapsRemaining: 3,
            vx: 1.8,
            vy: 1.4,
            colorIntervalSec: 0.45,
            alternatingColors: [{
              color: '#22d3ee',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }, {
              color: '#a855f7',
              isCorrect: false
            }]
          }, {
            id: 'w-24-skull1',
            x: 50,
            y: 50,
            size: 52,
            color: '#64748b',
            label: 'SKULL',
            isOrbiting: true,
            orbitRadius: 110,
            orbitSpeedDeg: -160,
            orbitPhaseDeg: 0,
            isCorrect: false
          }, {
            id: 'w-24-skull2',
            x: 50,
            y: 50,
            size: 52,
            color: '#64748b',
            label: 'SKULL',
            isOrbiting: true,
            orbitRadius: 110,
            orbitSpeedDeg: -160,
            orbitPhaseDeg: 180,
            isCorrect: false
          }]
        };

      case 25:
        return {
          type: 'TAP_YOU',
          title: 'STAGE 25: TAP YOU!',
          instruction: 'TAP YOU!',
          failBlurb: 'Sike! "ME" was the real answer!',
          targets: [{
            id: 'w-25-me',
            x: 26,
            y: 50,
            size: 64,
            color: '#22c55e',
            label: 'ME',
            isCorrect: true
          }, {
            id: 'w-25-you',
            x: 50,
            y: 50,
            size: 64,
            color: '#ef4444',
            label: 'YOU',
            isCorrect: false
          }, {
            id: 'w-25-i',
            x: 74,
            y: 50,
            size: 64,
            color: '#3b82f6',
            label: 'I',
            isCorrect: false
          }]
        };

      default:
        return {
          type: 'TAP_TARGET',
          title: `STAGE ${stageNum}: WEIRD TAP`,
          instruction: 'TAP THE CENTER ORB',
          failBlurb: 'Missed target!',
          targets: [{
            id: 'w-fallback',
            x: 50,
            y: 50,
            size: 64,
            color: '#06b6d4',
            isCorrect: true
          }]
        };
    }
  }

  function _reportPossibleCrUseOfActiveChallenge(extras) {
    _reporterNs.report("ActiveChallenge", "../template/models", _context.meta, extras);
  }

  _export("generateWeirdModeStage", generateWeirdModeStage);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6b7bftaEMhFT6dKRuzPogaX", "weirdStages", undefined);

      _export("WEIRD_MODE_STAGE_COUNT", WEIRD_MODE_STAGE_COUNT = 25);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=2b75df4301a6d23b5bc73686eddc4b6d9897d6d0.js.map