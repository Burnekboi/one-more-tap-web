System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, STAGE_PROGRESSION, generateWeirdModeStage, createDailySeed, createLCG, getTodayDateString, _crd;

  function generateStageChallenge(stageIndex, mode) {
    if (mode === void 0) {
      mode = 'CRAZY';
    }

    if (mode === 'WEIRD') {
      return (_crd && generateWeirdModeStage === void 0 ? (_reportPossibleCrUseOfgenerateWeirdModeStage({
        error: Error()
      }), generateWeirdModeStage) : generateWeirdModeStage)(stageIndex);
    } // A date-seeded pick means every player receives the same ten daily
    // challenges on a given calendar day, without storing a remote schedule.
    // The ten slots follow a balanced curve: 1-3 Tier 1, 4-6 Tier 2, 7-9
    // Tier 3/4, and slot 10 is the Insane Marathon Apex boss.


    if (mode === 'DAILY') {
      var random = (_crd && createLCG === void 0 ? (_reportPossibleCrUseOfcreateLCG({
        error: Error()
      }), createLCG) : createLCG)((_crd && createDailySeed === void 0 ? (_reportPossibleCrUseOfcreateDailySeed({
        error: Error()
      }), createDailySeed) : createDailySeed)((_crd && getTodayDateString === void 0 ? (_reportPossibleCrUseOfgetTodayDateString({
        error: Error()
      }), getTodayDateString) : getTodayDateString)()));
      var DAILY_BANDS = [[1, 10], [1, 10], [1, 10], [11, 20], [11, 20], [11, 20], [21, 40], [21, 40], [21, 40], 50];
      var band = DAILY_BANDS[stageIndex];

      var _stageNumber = typeof band === 'number' ? band : band[0] + Math.floor(random() * (band[1] - band[0] + 1));

      return generateStageChallenge(_stageNumber - 1, 'CRAZY');
    }

    var stageNumber = Math.min(50, Math.max(1, stageIndex + 1));
    var challengeType = (_crd && STAGE_PROGRESSION === void 0 ? (_reportPossibleCrUseOfSTAGE_PROGRESSION({
      error: Error()
    }), STAGE_PROGRESSION) : STAGE_PROGRESSION)[stageIndex] || 'TAP_TARGET';

    switch (challengeType) {
      case 'TAP_TARGET':
        return {
          type: 'TAP_TARGET',
          title: "STAGE " + stageNumber + ": THE FIRST STEP",
          instruction: 'TAP THE FLASHING ORB',
          failBlurb: 'You missed the circle! Warm up those fingers!',
          targets: [// The real target flashes between two colors; ten identical static
          // orbs try to hide it in plain sight.
          {
            id: 'c-1',
            x: 90,
            y: 52,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: true,
            colorIntervalSec: 0.4,
            alternatingColors: [{
              color: '#06b6d4',
              isCorrect: true
            }, {
              color: '#fbbf24',
              isCorrect: true
            }]
          }, {
            id: 'c-1-d1',
            x: 30,
            y: 30,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d2',
            x: 50,
            y: 30,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d3',
            x: 70,
            y: 30,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d4',
            x: 10,
            y: 52,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d5',
            x: 30,
            y: 52,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d6',
            x: 70,
            y: 52,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d7',
            x: 50,
            y: 52,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d8',
            x: 30,
            y: 74,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d9',
            x: 50,
            y: 74,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }, {
            id: 'c-1-d10',
            x: 70,
            y: 74,
            size: 52,
            color: '#06b6d4',
            label: 'TAP!',
            isCorrect: false
          }]
        };

      case 'AURA_CHECK':
        return {
          type: 'AURA_CHECK',
          title: "STAGE " + stageNumber + ": AURA CHECK",
          instruction: 'CLAIM +10,000 AURA',
          failBlurb: '-10,000 AURA! Bro picked the clown and lost all street respect!',
          targets: [{
            id: 'c-2-chad',
            x: 74,
            y: 62,
            size: 68,
            color: '#f97316',
            label: 'GIGA CHAD',
            isCorrect: true
          }, {
            id: 'c-2-clown',
            x: 26,
            y: 62,
            size: 66,
            color: '#3b82f6',
            label: 'CLOWN',
            isCorrect: false
          }, {
            id: 'c-2-zombie',
            x: 50,
            y: 30,
            size: 66,
            color: '#22c55e',
            label: 'ZOMBIE',
            isCorrect: false
          }]
        };

      case 'COLOR_TARGET':
        return {
          type: 'COLOR_TARGET',
          title: "STAGE " + stageNumber + ": CHROMATIC REFLEX",
          instruction: 'TAP THE EMERALD',
          failBlurb: 'Wrong color selected! Read carefully!',
          targets: [{
            id: 'c-3-r',
            x: 26,
            y: 50,
            size: 64,
            color: '#22c55e',
            isCorrect: false
          }, {
            id: 'c-3-g',
            x: 74,
            y: 50,
            size: 64,
            color: '#34d399',
            opacity: 0.82,
            isCorrect: true
          }, {
            id: 'c-3-b',
            x: 50,
            y: 70,
            size: 64,
            color: '#166534',
            isCorrect: false
          }]
        };

      case 'BATTERY_PANIC':
        return {
          type: 'BATTERY_PANIC',
          title: "STAGE " + stageNumber + ": 1% BATTERY RUSH",
          instruction: 'PLUG IN CHARGER BEFORE SHUTDOWN!',
          failBlurb: 'Screen went black! Your phone died at 1%!',
          targets: [{
            id: 'c-4-chg',
            x: 28,
            y: 50,
            size: 68,
            color: '#10b981',
            label: 'PLUG IN',
            isCorrect: true
          }, {
            id: 'c-4-off',
            x: 72,
            y: 50,
            size: 68,
            color: '#ef4444',
            label: 'POWER OFF',
            isCorrect: false
          }]
        };

      case 'BUBBLE_WRAP':
        return {
          type: 'BUBBLE_WRAP',
          title: "STAGE " + stageNumber + ": BUBBLE WRAP",
          instruction: 'POP THE GOLDEN BUBBLE',
          failBlurb: 'You popped a regular bubble!',
          targets: [{
            id: 'c-5-1',
            x: 20,
            y: 58,
            size: 58,
            color: '#38bdf8',
            isCorrect: false
          }, {
            id: 'c-5-gold',
            x: 70,
            y: 34,
            size: 58,
            color: '#fbbf24',
            label: 'GOLD',
            shape: 'diamond',
            isCorrect: true
          }, {
            id: 'c-5-3',
            x: 34,
            y: 34,
            size: 58,
            color: '#38bdf8',
            isCorrect: false
          }]
        };

      case 'WIFI_HUNT':
        return {
          type: 'WIFI_HUNT',
          title: "STAGE " + stageNumber + ": 5G WIFI HUNT",
          instruction: 'CONNECT TO GUEST WIFI',
          failBlurb: 'Connected to slow 2G dial-up! Lagged out!',
          targets: [{
            id: 'c-6-5g',
            x: 30,
            y: 50,
            size: 68,
            color: '#06b6d4',
            label: '5G GUEST',
            isCorrect: true
          }, {
            id: 'c-6-2g',
            x: 70,
            y: 50,
            size: 68,
            color: '#06b6d4',
            label: '2G PUBLIC',
            isCorrect: false
          }]
        };

      case 'CAT_MEME':
        return {
          type: 'CAT_MEME',
          title: "STAGE " + stageNumber + ": VIRAL CAT MEME",
          instruction: 'PET THE POPPING CAT ',
          failBlurb: 'You touched the hairball decoy!',
          targets: [{
            id: 'c-7-cat',
            x: 70,
            y: 60,
            size: 70,
            color: '#ec4899',
            label: 'POP CAT',
            isCorrect: true
          }, {
            id: 'c-7-dog',
            x: 30,
            y: 40,
            size: 66,
            color: '#64748b',
            label: 'DOGGO',
            isCorrect: false
          }]
        };

      case 'AUTOCORRECT_RESCUE':
        return {
          type: 'AUTOCORRECT_RESCUE',
          title: "STAGE " + stageNumber + ": AUTOCORRECT CRISIS",
          instruction: 'BRO WAY?',
          failBlurb: 'You sent an awkward embarrassing text!',
          targets: [{
            id: 'c-8-ok',
            x: 30,
            y: 50,
            size: 68,
            color: '#3b82f6',
            label: 'OK ON MY WAY',
            isCorrect: true
          }, {
            id: 'c-8-typo',
            x: 70,
            y: 50,
            size: 68,
            color: '#3b82f6',
            label: 'DUCK YOU BRO',
            isCorrect: false
          }]
        };

      case 'MICROWAVE_STOP':
        return {
          type: 'MICROWAVE_STOP',
          title: "STAGE " + stageNumber + ": 0:01 MICROWAVE STOP",
          instruction: 'STOP AT 1',
          failBlurb: 'BEEEEP! You woke up the entire household at 2 AM!',
          countdownSec: 3.0,
          targets: [{
            id: 'c-9-stop',
            x: 50,
            y: 50,
            size: 72,
            color: '#f59e0b',
            label: '3',
            isCorrect: true
          }]
        };

      case 'DONT_TAP':
        return {
          type: 'DONT_TAP',
          title: "STAGE " + stageNumber + ": DO NOT TOUCH",
          instruction: "DO NOT TOUCH! RESIST FOR 1.5s!",
          failBlurb: 'Impulsive tap detected! You could not resist!',
          waitDurationSec: 1.5,
          isSurvivalHold: true,
          targets: [{
            id: 'c-10-danger',
            x: 50,
            y: 50,
            size: 74,
            color: '#22c55e',
            label: 'TAP ME',
            isCorrect: false
          }]
        };

      case 'TRIPLE_LOCK':
        return {
          type: 'TRIPLE_LOCK',
          title: "STAGE " + stageNumber + ": ARMORED ORB",
          instruction: 'RAPID TAP 3 TIMES!',
          failBlurb: 'The armor was still up!',
          targets: [{
            id: 'c-11-armor',
            x: 50,
            y: 50,
            size: 78,
            color: '#3b82f6',
            requiredTaps: 3,
            tapsRemaining: 3,
            isCorrect: true
          }]
        };

      case 'SKULL_DODGE':
        return {
          type: 'SKULL_DODGE',
          title: "STAGE " + stageNumber + ": SKULL DODGE",
          instruction: 'CLEAR SAFE ORBS. AVOID THE SKULL!',
          failBlurb: 'You touched the skull!',
          collectAllCorrect: true,
          overlapKill: true,
          targets: [{
            id: 'c-12-s1',
            x: 22,
            y: 42,
            size: 54,
            color: '#06b6d4',
            isCorrect: true
          }, {
            id: 'c-12-s2',
            x: 78,
            y: 42,
            size: 54,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-12-s3',
            x: 32,
            y: 62,
            size: 54,
            color: '#eab308',
            isCorrect: true
          }, {
            id: 'c-12-s4',
            x: 68,
            y: 62,
            size: 54,
            color: '#a855f7',
            isCorrect: true
          }, {
            id: 'c-12-skull',
            x: 50,
            y: 52,
            size: 58,
            color: '#64748b',
            label: 'SKULL',
            vx: 1.8,
            vy: 1.4,
            isCorrect: false
          }]
        };

      case 'ASCENDING_TRIO':
        return {
          type: 'ASCENDING_TRIO',
          title: "STAGE " + stageNumber + ": ASCENDING TRIO",
          instruction: 'TAP SMALL -> MEDIUM -> LARGE',
          failBlurb: 'Size sequence broken!',
          targets: [{
            id: 'c-13-large',
            x: 24,
            y: 50,
            size: 78,
            color: '#8b5cf6',
            sequenceIndex: 3,
            isCorrect: false
          }, {
            id: 'c-13-medium',
            x: 52,
            y: 50,
            size: 62,
            color: '#3b82f6',
            sequenceIndex: 2,
            isCorrect: false
          }, {
            id: 'c-13-small',
            x: 80,
            y: 50,
            size: 46,
            color: '#06b6d4',
            sequenceIndex: 1,
            isCorrect: true
          }]
        };

      case 'TWIN_RED':
        return {
          type: 'TWIN_RED',
          title: "STAGE " + stageNumber + ": TWIN RED",
          instruction: 'TAP BOTH RED ORBS',
          failBlurb: 'That was not actually red!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-14-r1',
            x: 28,
            y: 38,
            size: 58,
            color: '#ef4444',
            isCorrect: true
          }, {
            id: 'c-14-r2',
            x: 72,
            y: 38,
            size: 58,
            color: '#ef4444',
            isCorrect: true
          }, {
            id: 'c-14-w1',
            x: 16,
            y: 60,
            size: 58,
            color: '#dc2626',
            isCorrect: false
          }, {
            id: 'c-14-w2',
            x: 50,
            y: 60,
            size: 58,
            color: '#f97316',
            isCorrect: false
          }, {
            id: 'c-14-w3',
            x: 84,
            y: 60,
            size: 58,
            color: '#f43f5e',
            isCorrect: false
          }]
        };

      case 'VANISHING_ORBS':
        return {
          type: 'VANISHING_ORBS',
          title: "STAGE " + stageNumber + ": VANISHING ORBS",
          instruction: 'TAP THE GREEN BEFORE IT COLLAPSES',
          failBlurb: 'The orbs collapsed into nothingness!',
          targets: [{
            id: 'c-15-g',
            x: 24,
            y: 62,
            size: 60,
            color: '#22c55e',
            shrink: true,
            isCorrect: true
          }, {
            id: 'c-15-b',
            x: 50,
            y: 40,
            size: 60,
            color: '#3b82f6',
            shrink: true,
            isCorrect: false
          }, {
            id: 'c-15-y',
            x: 76,
            y: 62,
            size: 60,
            color: '#eab308',
            shrink: true,
            isCorrect: false
          }]
        };

      case 'DONT_TAP_RED':
        return {
          type: 'DONT_TAP_RED',
          title: "STAGE " + stageNumber + ": DON'T TAP RED",
          instruction: "CLEAR NON-RED. DON'T TAP RED!",
          failBlurb: 'You tapped the forbidden red orb!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-16-n1',
            x: 24,
            y: 36,
            size: 52,
            color: '#06b6d4',
            isCorrect: true
          }, {
            id: 'c-16-n2',
            x: 76,
            y: 36,
            size: 52,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-16-n3',
            x: 24,
            y: 66,
            size: 52,
            color: '#eab308',
            isCorrect: true
          }, {
            id: 'c-16-n4',
            x: 76,
            y: 66,
            size: 52,
            color: '#a855f7',
            isCorrect: true
          }, {
            id: 'c-16-red',
            x: 50,
            y: 52,
            size: 56,
            color: '#ef4444',
            isCorrect: false
          }]
        };

      case 'HAMMER_TIME':
        return {
          type: 'HAMMER_TIME',
          title: "STAGE " + stageNumber + ": PATIENCE",
          instruction: 'PATIENCE',
          failBlurb: 'Impatient tap! You blew it!',
          countdownSec: 3.0,
          countdownSteps: [{
            label: 'Good to Go!',
            color: '#3b82f6'
          }, {
            label: "Ok! Don't Tap Yet",
            color: '#22c55e'
          }, {
            label: 'Don\'t Tap',
            color: '#ef4444'
          }],
          targets: [{
            id: 'c-17-patience',
            x: 50,
            y: 50,
            size: 72,
            color: '#ef4444',
            label: 'Don\'t Tap',
            isCorrect: true
          }]
        };

      case 'COLOR_COPY_FAKE':
        return {
          type: 'COLOR_COPY_FAKE',
          title: "STAGE " + stageNumber + ": COLOR-COPY FAKE",
          instruction: 'TAP BOTH GREEN ORBS. IGNORE THE FAKE!',
          failBlurb: 'The label faked you out!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-18-g1',
            x: 30,
            y: 38,
            size: 56,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-18-g2',
            x: 70,
            y: 38,
            size: 56,
            color: '#16a34a',
            isCorrect: true
          }, {
            id: 'c-18-fake',
            x: 50,
            y: 60,
            size: 56,
            color: '#3b82f6',
            label: 'GREEN',
            isCorrect: false
          }, {
            id: 'c-18-d1',
            x: 16,
            y: 60,
            size: 56,
            color: '#f43f5e',
            isCorrect: false
          }, {
            id: 'c-18-d2',
            x: 84,
            y: 60,
            size: 56,
            color: '#8b5cf6',
            isCorrect: false
          }, {
            id: 'c-18-d3',
            x: 50,
            y: 80,
            size: 56,
            color: '#06b6d4',
            isCorrect: false
          }]
        };

      case 'SHIELD_BOMB':
        return {
          type: 'SHIELD_BOMB',
          title: "STAGE " + stageNumber + ": SHIELD + BOMB",
          instruction: 'CLEAR THE ARMORED ORB. AVOID BOMB!',
          failBlurb: 'The bomb ended the run!',
          targets: [{
            id: 'c-19-armor',
            x: 38,
            y: 50,
            size: 70,
            color: '#f59e0b',
            requiredTaps: 3,
            tapsRemaining: 3,
            isCorrect: true
          }, {
            id: 'c-19-bomb',
            x: 62,
            y: 50,
            size: 56,
            color: '#64748b',
            label: 'BOMB',
            isCorrect: false
          }, {
            id: 'c-19-d1',
            x: 22,
            y: 34,
            size: 54,
            color: '#3b82f6',
            isCorrect: false
          }, {
            id: 'c-19-d2',
            x: 78,
            y: 66,
            size: 54,
            color: '#22c55e',
            isCorrect: false
          }]
        };

      case 'DESCENDING_TRIO':
        return {
          type: 'DESCENDING_TRIO',
          title: "STAGE " + stageNumber + ": DESCENDING TRIO",
          instruction: 'TAP LARGE -> MEDIUM -> SMALL. AVOID BOMB!',
          failBlurb: 'Wrong order or hit the bomb!',
          overlapKill: true,
          targets: [{
            id: 'c-20-medium',
            x: 26,
            y: 50,
            size: 62,
            color: '#3b82f6',
            sequenceIndex: 2,
            isCorrect: false
          }, {
            id: 'c-20-small',
            x: 50,
            y: 50,
            size: 46,
            color: '#06b6d4',
            sequenceIndex: 3,
            isCorrect: false
          }, {
            id: 'c-20-large',
            x: 74,
            y: 50,
            size: 78,
            color: '#8b5cf6',
            sequenceIndex: 1,
            isCorrect: true
          }, {
            id: 'c-20-bomb',
            x: 50,
            y: 72,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            vx: 2.2,
            vy: 1.6,
            isCorrect: false
          }]
        };

      case 'CHAMELEON':
        return {
          type: 'CHAMELEON',
          title: "STAGE " + stageNumber + ": DESTROY THE INVADER",
          instruction: 'DESTROY THE INVADER!',
          failBlurb: 'You destroyed a friendly orb!',
          targets: [{
            id: 'c-21-invader',
            x: 76,
            y: 62,
            size: 58,
            color: '#3b82f6',
            shape: 'triangle',
            expand: true,
            isCorrect: true
          }, {
            id: 'c-21-s1',
            x: 24,
            y: 36,
            size: 58,
            color: '#22c55e',
            shape: 'circle',
            shrink: true,
            isCorrect: false
          }, {
            id: 'c-21-s2',
            x: 50,
            y: 50,
            size: 58,
            color: '#eab308',
            shape: 'square',
            shrink: true,
            isCorrect: false
          }]
        };

      case 'MOSH_PIT':
        return {
          type: 'MOSH_PIT',
          title: "STAGE " + stageNumber + ": WHO IS LONELY?",
          instruction: "WHO'S THE LONELY ONE?",
          failBlurb: 'You picked the wrong crowd member!',
          targets: [{
            id: 'c-22-tg',
            x: 58,
            y: 34,
            size: 56,
            color: '#22c55e',
            shape: 'triangle',
            isCorrect: false
          }, {
            id: 'c-22-tb',
            x: 84,
            y: 34,
            size: 56,
            color: '#3b82f6',
            shape: 'triangle',
            isCorrect: false
          }, {
            id: 'c-22-sb',
            x: 20,
            y: 34,
            size: 56,
            color: '#3b82f6',
            shape: 'square',
            isCorrect: false
          }, {
            id: 'c-22-cy',
            x: 32,
            y: 60,
            size: 56,
            color: '#eab308',
            shape: 'circle',
            isCorrect: false
          }, {
            id: 'c-22-cg',
            x: 68,
            y: 60,
            size: 56,
            color: '#22c55e',
            shape: 'circle',
            isCorrect: false
          }, {
            id: 'c-22-pp',
            x: 58,
            y: 72,
            size: 60,
            color: '#a855f7',
            shape: 'pentagon',
            isCorrect: true
          }]
        };

      case 'EVEN_FAIR':
        return {
          type: 'EVEN_FAIR',
          title: "STAGE " + stageNumber + ": EVEN FAIR",
          instruction: "WHERE'S MY EVEN?",
          failBlurb: 'That diamond was odd!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-23-e2',
            x: 20,
            y: 36,
            size: 58,
            color: '#22c55e',
            shape: 'diamond',
            label: '2',
            isCorrect: true
          }, {
            id: 'c-23-o1',
            x: 44,
            y: 36,
            size: 58,
            color: '#ef4444',
            shape: 'diamond',
            label: '1',
            isCorrect: false
          }, {
            id: 'c-23-e4',
            x: 68,
            y: 36,
            size: 58,
            color: '#3b82f6',
            shape: 'diamond',
            label: '4',
            isCorrect: true
          }, {
            id: 'c-23-o3',
            x: 90,
            y: 36,
            size: 58,
            color: '#a855f7',
            shape: 'diamond',
            label: '3',
            isCorrect: false
          }, {
            id: 'c-23-o5',
            x: 14,
            y: 62,
            size: 58,
            color: '#f97316',
            shape: 'diamond',
            label: '5',
            isCorrect: false
          }, {
            id: 'c-23-e6',
            x: 36,
            y: 62,
            size: 58,
            color: '#eab308',
            shape: 'diamond',
            label: '6',
            isCorrect: true
          }, {
            id: 'c-23-o7',
            x: 58,
            y: 62,
            size: 58,
            color: '#06b6d4',
            shape: 'diamond',
            label: '7',
            isCorrect: false
          }, {
            id: 'c-23-o9',
            x: 82,
            y: 62,
            size: 58,
            color: '#f43f5e',
            shape: 'diamond',
            label: '9',
            isCorrect: false
          }]
        };

      case 'DON_T_TAP_BLUE':
        return {
          type: 'DON_T_TAP_BLUE',
          title: "STAGE " + stageNumber + ": NO BLUE, NO SQUARE",
          instruction: "DON'T TAP BLUE. DON'T TAP SQUARE",
          failBlurb: 'You broke the color/shape rule!',
          targets: [{
            id: 'c-24-circleG',
            x: 24,
            y: 62,
            size: 62,
            color: '#22c55e',
            shape: 'circle',
            isCorrect: true
          }, {
            id: 'c-24-sqB',
            x: 76,
            y: 38,
            size: 60,
            color: '#3b82f6',
            shape: 'square',
            isCorrect: false
          }, {
            id: 'c-24-sqR',
            x: 24,
            y: 38,
            size: 60,
            color: '#ef4444',
            shape: 'square',
            isCorrect: false
          }, {
            id: 'c-24-triB',
            x: 76,
            y: 62,
            size: 60,
            color: '#3b82f6',
            shape: 'triangle',
            isCorrect: false
          }, {
            id: 'c-24-pentB',
            x: 50,
            y: 50,
            size: 60,
            color: '#3b82f6',
            shape: 'pentagon',
            isCorrect: false
          }]
        };

      case 'CONVEYOR':
        return {
          type: 'CONVEYOR',
          title: "STAGE " + stageNumber + ": CONVEYOR",
          instruction: 'FIND THE SEQUENCE!',
          failBlurb: 'Wrong number broke the belt!',
          targets: [{
            id: 'c-25-13',
            x: 14,
            y: 36,
            size: 50,
            color: '#06b6d4',
            label: '13',
            sequenceIndex: 1,
            isCorrect: true
          }, {
            id: 'c-25-7',
            x: 78,
            y: 30,
            size: 50,
            color: '#06b6d4',
            label: '7',
            isCorrect: false
          }, {
            id: 'c-25-14',
            x: 30,
            y: 55,
            size: 50,
            color: '#06b6d4',
            label: '14',
            sequenceIndex: 2,
            isCorrect: false
          }, {
            id: 'c-25-22',
            x: 78,
            y: 52,
            size: 50,
            color: '#06b6d4',
            label: '22',
            isCorrect: false
          }, {
            id: 'c-25-15',
            x: 45,
            y: 78,
            size: 50,
            color: '#06b6d4',
            label: '15',
            sequenceIndex: 3,
            isCorrect: false
          }, {
            id: 'c-25-3',
            x: 20,
            y: 64,
            size: 50,
            color: '#06b6d4',
            label: '3',
            isCorrect: false
          }, {
            id: 'c-25-31',
            x: 64,
            y: 80,
            size: 50,
            color: '#06b6d4',
            label: '31',
            isCorrect: false
          }, {
            id: 'c-25-9',
            x: 55,
            y: 42,
            size: 50,
            color: '#06b6d4',
            label: '9',
            isCorrect: false
          }]
        };

      case 'TRAFFIC_LIGHT':
        return {
          type: 'TRAFFIC_LIGHT',
          title: "STAGE " + stageNumber + ": TRAFFIC LIGHT",
          instruction: 'TAP ONLY WHILE GREEN',
          failBlurb: 'Ran the red light!',
          targets: [{
            id: 'c-26-light',
            x: 50,
            y: 50,
            size: 72,
            color: '#ef4444',
            colorIntervalSec: 0.55,
            alternatingColors: [{
              color: '#ef4444',
              isCorrect: false
            }, {
              color: '#eab308',
              isCorrect: false
            }, {
              color: '#22c55e',
              isCorrect: true
            }]
          }]
        };

      case 'SHAPE_SHIFT':
        return {
          type: 'SHAPE_SHIFT',
          title: "STAGE " + stageNumber + ": SHAPE SHIFT",
          instruction: 'TAP THE GREEN CIRCLE, NOT CRIMSON SQUARE',
          failBlurb: 'It morphed under your thumb!',
          targets: [{
            id: 'c-27-shift',
            x: 50,
            y: 50,
            size: 68,
            color: '#22c55e',
            shape: 'circle',
            vx: 1.4,
            vy: 1.0,
            colorIntervalSec: 0.55,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true,
              shape: 'circle'
            }, {
              color: '#ef4444',
              isCorrect: false,
              shape: 'square'
            }]
          }]
        };

      case 'MIRROR_MATH':
        return {
          type: 'MIRROR_MATH',
          title: "STAGE " + stageNumber + ": MIRROR MATH",
          instruction: 'X + 4 = 9. TAP X ON A CIRCLE',
          failBlurb: 'The mirror lied about the math!',
          targets: [{
            id: 'c-28-5',
            x: 20,
            y: 40,
            size: 58,
            color: '#22c55e',
            shape: 'circle',
            label: '5',
            isCorrect: true
          }, {
            id: 'c-28-3',
            x: 22,
            y: 60,
            size: 58,
            color: '#64748b',
            shape: 'diamond',
            label: '3',
            isCorrect: false
          }, {
            id: 'c-28-6',
            x: 50,
            y: 60,
            size: 58,
            color: '#64748b',
            shape: 'circle',
            label: '6',
            isCorrect: false
          }, {
            id: 'c-28-9',
            x: 78,
            y: 60,
            size: 58,
            color: '#ef4444',
            shape: 'diamond',
            label: '9',
            isCorrect: false
          }, {
            id: 'c-28-7',
            x: 80,
            y: 40,
            size: 58,
            color: '#64748b',
            shape: 'circle',
            label: '7',
            isCorrect: false
          }, {
            id: 'c-28-5b',
            x: 50,
            y: 40,
            size: 58,
            color: '#ef4444',
            shape: 'diamond',
            label: '5',
            isCorrect: false
          }]
        };

      case 'SHAPE_CONFUSER':
        {
          // Stage 29 finds the 9-sided nonagon; stage 30 finds the 6-sided hexagon.
          var wantNonagon = stageNumber === 29;
          return {
            type: 'SHAPE_CONFUSER',
            title: "STAGE " + stageNumber + ": SHAPE CONFUSER",
            instruction: wantNonagon ? 'FIND THE 9 SIDED FIGURE' : 'FIND THE 6 SIDED FIGURE',
            failBlurb: wantNonagon ? 'That is not the nonagon!' : 'That is not the hexagon!',
            targets: [{
              id: "c-" + stageNumber + "-oct",
              x: 15,
              y: 28,
              size: 54,
              color: '#22c55e',
              shape: 'octagon',
              isCorrect: false
            }, {
              id: "c-" + stageNumber + "-hex",
              x: 72,
              y: 32,
              size: 54,
              color: '#3b82f6',
              shape: 'hexagon',
              isCorrect: !wantNonagon
            }, {
              id: "c-" + stageNumber + "-sq",
              x: 38,
              y: 55,
              size: 54,
              color: '#ef4444',
              shape: 'square',
              isCorrect: false
            }, {
              id: "c-" + stageNumber + "-pent",
              x: 14,
              y: 72,
              size: 54,
              color: '#a855f7',
              shape: 'pentagon',
              isCorrect: false
            }, {
              id: "c-" + stageNumber + "-non",
              x: 78,
              y: 70,
              size: 54,
              color: '#eab308',
              shape: 'nonagon',
              isCorrect: wantNonagon
            }]
          };
        }

      case 'CORD_CUTTER':
        return {
          type: 'CORD_CUTTER',
          title: "STAGE " + stageNumber + ": CORD CUTTER",
          instruction: 'CUT THE 3 RED CABLES!',
          failBlurb: 'You cut the wrong cable!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-31-cut1',
            x: 28,
            y: 40,
            size: 56,
            color: '#ef4444',
            label: 'CUT',
            isCorrect: true
          }, {
            id: 'c-31-cut2',
            x: 72,
            y: 40,
            size: 56,
            color: '#ef4444',
            label: 'CUT',
            isCorrect: true
          }, {
            id: 'c-31-cut3',
            x: 50,
            y: 62,
            size: 56,
            color: '#ef4444',
            label: 'CUT',
            isCorrect: true
          }, {
            id: 'c-31-keep1',
            x: 22,
            y: 64,
            size: 54,
            color: '#64748b',
            label: 'KEEP',
            isCorrect: false
          }, {
            id: 'c-31-keep2',
            x: 78,
            y: 64,
            size: 54,
            color: '#64748b',
            label: 'KEEP',
            isCorrect: false
          }]
        };

      case 'STROBE_FIRE':
        return {
          type: 'STROBE_FIRE',
          title: "STAGE " + stageNumber + ": STROBE FIRE",
          instruction: 'TAP BOTH STROBES WHILE GREEN',
          failBlurb: 'You tapped a red strobe!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-32-s1',
            x: 38,
            y: 48,
            size: 56,
            color: '#22c55e',
            colorIntervalSec: 0.45,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }]
          }, {
            id: 'c-32-s2',
            x: 62,
            y: 48,
            size: 56,
            color: '#22c55e',
            colorIntervalSec: 0.6,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }]
          }]
        };

      case 'TICKING_ORBIT':
        return {
          type: 'TICKING_ORBIT',
          title: "STAGE " + stageNumber + ": TICKING ORBIT",
          instruction: 'TAP 1 -> 2 -> 3! DODGE THE ORBITAL BOMB!',
          failBlurb: 'The orbital bomb caught your tap!',
          overlapKill: true,
          targets: [{
            id: 'c-33-s1',
            x: 24,
            y: 36,
            size: 52,
            color: '#06b6d4',
            label: '1',
            sequenceIndex: 1,
            isCorrect: true
          }, {
            id: 'c-33-s2',
            x: 50,
            y: 60,
            size: 52,
            color: '#06b6d4',
            label: '2',
            sequenceIndex: 2,
            isCorrect: false
          }, {
            id: 'c-33-s3',
            x: 76,
            y: 36,
            size: 52,
            color: '#06b6d4',
            label: '3',
            sequenceIndex: 3,
            isCorrect: false
          }, {
            id: 'c-33-bomb',
            x: 50,
            y: 50,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            isOrbiting: true,
            orbitRadius: 85,
            orbitSpeedDeg: 200,
            orbitPhaseDeg: 0,
            isCorrect: false
          }]
        };

      case 'STORM_SURGE':
        return {
          type: 'STORM_SURGE',
          title: "STAGE " + stageNumber + ": STORM SURGE",
          instruction: 'CLEAR BOTH SAFETY ORBS. DODGE THE STORM!',
          failBlurb: 'The storm surge zapped your tap!',
          collectAllCorrect: true,
          overlapKill: true,
          targets: [{
            id: 'c-34-safe1',
            x: 24,
            y: 42,
            size: 54,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-34-safe2',
            x: 76,
            y: 58,
            size: 54,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-34-storm',
            x: 50,
            y: 50,
            size: 60,
            color: '#64748b',
            label: 'STORM',
            vx: 3.4,
            vy: 1.4,
            isCorrect: false
          }]
        };

      case 'CREEPING_CURSOR':
        return {
          type: 'CREEPING_CURSOR',
          title: "STAGE " + stageNumber + ": CREEPING CURSOR",
          instruction: "TAP 3x! DON'T LET THE CURSOR CATCH YOU!",
          failBlurb: 'The cursor hovered your tap!',
          overlapKill: true,
          targets: [{
            id: 'c-35-core',
            x: 44,
            y: 50,
            size: 64,
            color: '#f59e0b',
            requiredTaps: 3,
            tapsRemaining: 3,
            isCorrect: true
          }, {
            id: 'c-35-creep',
            x: 58,
            y: 36,
            size: 50,
            color: '#64748b',
            label: 'CURSOR',
            vx: 1.5,
            vy: 1.2,
            isCorrect: false
          }]
        };

      case 'CIRCUIT_BREAK':
        return {
          type: 'CIRCUIT_BREAK',
          title: "STAGE " + stageNumber + ": CIRCUIT BREAK",
          instruction: 'TAP 1 -> 2 -> 3! TARGETS DRIFT!',
          failBlurb: 'The drifting circuit broke your sequence!',
          targets: [{
            id: 'c-36-1',
            x: 24,
            y: 40,
            size: 52,
            color: '#06b6d4',
            label: '1',
            sequenceIndex: 1,
            vx: 2.0,
            vy: 1.2,
            isCorrect: true
          }, {
            id: 'c-36-2',
            x: 50,
            y: 58,
            size: 52,
            color: '#3b82f6',
            label: '2',
            sequenceIndex: 2,
            vx: -1.8,
            vy: -1.4,
            isCorrect: false
          }, {
            id: 'c-36-3',
            x: 76,
            y: 40,
            size: 52,
            color: '#8b5cf6',
            label: '3',
            sequenceIndex: 3,
            vx: 1.6,
            vy: -1.6,
            isCorrect: false
          }]
        };

      case 'TACHYON_DEFUSE':
        return {
          type: 'TACHYON_DEFUSE',
          title: "STAGE " + stageNumber + ": TACHYON DEFUSE",
          instruction: 'DEFUSE THE TICKING BOMB IN THE FINAL SECOND!',
          failBlurb: 'You tapped too early... or hit the fake!',
          countdownSec: 3.0,
          targets: [{
            id: 'c-37-real',
            x: 32,
            y: 50,
            size: 66,
            color: '#06b6d4',
            label: '3',
            isCorrect: true
          }, {
            id: 'c-37-fake',
            x: 68,
            y: 50,
            size: 62,
            color: '#ef4444',
            label: 'FAKE',
            isCorrect: false
          }]
        };

      case 'PHANTOM_SHIFT':
        return {
          type: 'PHANTOM_SHIFT',
          title: "STAGE " + stageNumber + ": PHANTOM SHIFT",
          instruction: 'TAP WHILE GREEN CIRCLE (NOT CRIMSON SQUARE!)',
          failBlurb: 'It shifted under your tap!',
          targets: [{
            id: 'c-38-shift',
            x: 44,
            y: 48,
            size: 64,
            color: '#22c55e',
            shape: 'circle',
            vx: 1.6,
            vy: 1.2,
            colorIntervalSec: 0.4,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true,
              shape: 'circle'
            }, {
              color: '#ef4444',
              isCorrect: false,
              shape: 'square'
            }]
          }]
        };

      case 'JITTER_MASH':
        return {
          type: 'JITTER_MASH',
          title: "STAGE " + stageNumber + ": JITTER MASH",
          instruction: 'RAPID TAP 6 TIMES!',
          failBlurb: 'The jitter threw off your rhythm!',
          stopAfterTaps: 4,
          stopDurationSec: 1.0,
          stopMessage: 'Stop!',
          stopPrompt: 'STOP! HANDS OFF THE KEYBOARD!',
          targets: [{
            id: 'c-39-mash',
            x: 50,
            y: 48,
            size: 84,
            color: '#f59e0b',
            requiredTaps: 6,
            tapsRemaining: 6,
            vx: 1.2,
            vy: 0.9,
            isCorrect: true
          }]
        };

      case 'CROWN_JEWEL':
        return {
          type: 'CROWN_JEWEL',
          title: "STAGE " + stageNumber + ": CROWN JEWEL",
          instruction: 'TAP THE LONE PENTAGON TWICE!',
          failBlurb: 'That was a fake octagon!',
          targets: [{
            id: 'c-40-jewel',
            x: 62,
            y: 46,
            size: 64,
            color: '#fbbf24',
            shape: 'pentagon',
            requiredTaps: 2,
            tapsRemaining: 2,
            isCorrect: true
          }, {
            id: 'c-40-o1',
            x: 28,
            y: 40,
            size: 56,
            color: '#64748b',
            shape: 'octagon',
            isCorrect: false
          }, {
            id: 'c-40-o2',
            x: 78,
            y: 58,
            size: 56,
            color: '#64748b',
            shape: 'octagon',
            isCorrect: false
          }, {
            id: 'c-40-o3',
            x: 36,
            y: 66,
            size: 56,
            color: '#64748b',
            shape: 'octagon',
            isCorrect: false
          }]
        };

      case 'FLASH_TRACE':
        return {
          type: 'FLASH_MEMORY',
          title: "STAGE " + stageNumber + ": FLASH TRACE",
          instruction: 'MEMORIZE THE YELLOW ONE!',
          failBlurb: 'Wrong orb guessed after the fade!',
          targets: [{
            id: 'c-41-r',
            x: 18,
            y: 38,
            size: 54,
            color: '#ef4444',
            originalColor: '#ef4444',
            isCorrect: false
          }, {
            id: 'c-41-b',
            x: 40,
            y: 38,
            size: 54,
            color: '#3b82f6',
            originalColor: '#3b82f6',
            isCorrect: false
          }, {
            id: 'c-41-g',
            x: 62,
            y: 38,
            size: 54,
            color: '#22c55e',
            originalColor: '#22c55e',
            isCorrect: false
          }, {
            id: 'c-41-p',
            x: 84,
            y: 38,
            size: 54,
            color: '#a855f7',
            originalColor: '#a855f7',
            isCorrect: false
          }, {
            id: 'c-41-y',
            x: 52,
            y: 60,
            size: 58,
            color: '#eab308',
            originalColor: '#eab308',
            isCorrect: true
          }]
        };

      case 'GOLD_ORBIT':
        return {
          type: 'GOLD_ORBIT',
          title: "STAGE " + stageNumber + ": GOLD ORBIT",
          instruction: 'STRIKE THE GOLD ORBITING ORB',
          failBlurb: 'You clipped a relay decoy!',
          targets: [{
            id: 'c-42-gold',
            x: 71.7,
            y: 50,
            size: 56,
            color: '#fbbf24',
            isOrbiting: true,
            orbitRadius: 85,
            orbitSpeedDeg: 260,
            orbitPhaseDeg: 0,
            isCorrect: true
          }, {
            id: 'c-42-d1',
            x: 50,
            y: 39.4,
            size: 56,
            color: '#3b82f6',
            isOrbiting: true,
            orbitRadius: 85,
            orbitSpeedDeg: 260,
            orbitPhaseDeg: 90,
            isCorrect: false
          }, {
            id: 'c-42-d2',
            x: 28.3,
            y: 50,
            size: 56,
            color: '#a855f7',
            isOrbiting: true,
            orbitRadius: 85,
            orbitSpeedDeg: 260,
            orbitPhaseDeg: 180,
            isCorrect: false
          }, {
            id: 'c-42-d3',
            x: 50,
            y: 60.6,
            size: 56,
            color: '#ef4444',
            isOrbiting: true,
            orbitRadius: 85,
            orbitSpeedDeg: 260,
            orbitPhaseDeg: 270,
            isCorrect: false
          }]
        };

      case 'WHITE_SPACE':
        return {
          type: 'TOUCH_SPACE',
          title: "STAGE " + stageNumber + ": WHITE SPACE",
          instruction: 'TAP THE EMPTY SPACE!',
          failBlurb: 'You hit a decoy orb!',
          targets: [{
            id: 'c-43-d1',
            x: 24,
            y: 40,
            size: 60,
            color: '#64748b',
            isCorrect: false
          }, {
            id: 'c-43-d2',
            x: 76,
            y: 40,
            size: 60,
            color: '#64748b',
            isCorrect: false
          }, {
            id: 'c-43-d3',
            x: 26,
            y: 66,
            size: 60,
            color: '#64748b',
            isCorrect: false
          }, {
            id: 'c-43-d4',
            x: 74,
            y: 66,
            size: 60,
            color: '#64748b',
            isCorrect: false
          }]
        };

      case 'BOMB_WEAVE':
        return {
          type: 'BOMB_WEAVE',
          title: "STAGE " + stageNumber + ": BOMB WEAVE",
          instruction: 'CLEAR 3 SERVERS! WEAVE THROUGH 2 BOMBS!',
          failBlurb: 'A bomb clipped your tap!',
          collectAllCorrect: true,
          overlapKill: true,
          targets: [{
            id: 'c-44-s1',
            x: 20,
            y: 42,
            size: 52,
            color: '#06b6d4',
            isCorrect: true
          }, {
            id: 'c-44-s2',
            x: 50,
            y: 42,
            size: 52,
            color: '#22c55e',
            isCorrect: true
          }, {
            id: 'c-44-s3',
            x: 80,
            y: 42,
            size: 52,
            color: '#8b5cf6',
            isCorrect: true
          }, {
            id: 'c-44-b1',
            x: 50,
            y: 30,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            vx: 2.8,
            vy: 1.6,
            isCorrect: false
          }, {
            id: 'c-44-b2',
            x: 26,
            y: 64,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            vx: -2.6,
            vy: 1.4,
            isCorrect: false
          }]
        };

      case 'DRAW_REACTION':
        return {
          type: 'REACTION',
          title: "STAGE " + stageNumber + ": DRAW REACTION",
          instruction: 'WAIT FOR GREEN! THEN TAP THE MOVING ORB!',
          failBlurb: 'You pulled the trigger too early!',
          subState: 'WAIT',
          targets: [{
            id: 'c-45-draw',
            x: 50,
            y: 50,
            size: 64,
            color: '#ef4444',
            vx: 2.4,
            vy: 1.6,
            isCorrect: false
          }]
        };

      case 'SWITCH_DANCE':
        return {
          type: 'SWITCH_DANCE',
          title: "STAGE " + stageNumber + ": SWITCH DANCE",
          instruction: 'TAP BOTH STROBES WHILE GREEN! AVOID RED!',
          failBlurb: 'Tapped a strobe on red (or the trap)!',
          collectAllCorrect: true,
          targets: [{
            id: 'c-46-a1',
            x: 30,
            y: 46,
            size: 58,
            color: '#22c55e',
            colorIntervalSec: 0.6,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }]
          }, {
            id: 'c-46-a2',
            x: 70,
            y: 46,
            size: 58,
            color: '#22c55e',
            colorIntervalSec: 0.45,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true
            }, {
              color: '#ef4444',
              isCorrect: false
            }]
          }, {
            id: 'c-46-trap',
            x: 50,
            y: 70,
            size: 58,
            color: '#ef4444',
            isCorrect: false
          }]
        };

      case 'VANISHING_ORB':
        return {
          type: 'VANISHING_ORB',
          title: "STAGE " + stageNumber + ": VANISHING ORB",
          instruction: 'TAP THE ONE THAT IS SHRINKING!',
          failBlurb: 'You tapped an idle clone!',
          targets: [{
            id: 'c-47-shrink',
            x: 38,
            y: 52,
            size: 62,
            color: '#8b5cf6',
            shrink: true,
            isCorrect: true
          }, {
            id: 'c-47-d1',
            x: 70,
            y: 36,
            size: 62,
            color: '#8b5cf6',
            isCorrect: false
          }, {
            id: 'c-47-d2',
            x: 70,
            y: 64,
            size: 62,
            color: '#8b5cf6',
            isCorrect: false
          }, {
            id: 'c-47-d3',
            x: 16,
            y: 60,
            size: 62,
            color: '#8b5cf6',
            isCorrect: false
          }]
        };

      case 'CURSOR_STOP':
        return {
          type: 'CURSOR_STOP',
          title: "STAGE " + stageNumber + ": CURSOR FREEZE",
          instruction: 'TAP 5x! STAND STILL WHEN THE BOMB PASSES!',
          failBlurb: 'The sweep bomb caught your hand!',
          overlapKill: true,
          stopAfterTaps: 3,
          stopDurationSec: 1.0,
          stopMessage: 'Stop!',
          stopPrompt: 'STOP! HANDS OFF!',
          targets: [{
            id: 'c-48-t',
            x: 50,
            y: 48,
            size: 78,
            color: '#f59e0b',
            requiredTaps: 5,
            tapsRemaining: 5,
            vx: 1.6,
            vy: 1.0,
            isCorrect: true
          }, {
            id: 'c-48-bomb',
            x: 50,
            y: 30,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            vx: 2.4,
            vy: 2.0,
            isCorrect: false
          }]
        };

      case 'CHROMATIC_SURGE':
        return {
          type: 'CHROMATIC_SURGE',
          title: "STAGE " + stageNumber + ": CHROMATIC SURGE",
          instruction: 'TAP 3x - ONLY WHEN GREEN CIRCLE!',
          failBlurb: 'You tapped a crimson square!',
          targets: [{
            id: 'c-49-chroma',
            x: 50,
            y: 50,
            size: 78,
            color: '#22c55e',
            shape: 'circle',
            requiredTaps: 3,
            tapsRemaining: 3,
            vx: 1.4,
            vy: 1.2,
            colorIntervalSec: 0.35,
            alternatingColors: [{
              color: '#22c55e',
              isCorrect: true,
              shape: 'circle'
            }, {
              color: '#ef4444',
              isCorrect: false,
              shape: 'square'
            }]
          }]
        };

      case 'FINALE_GAUNTLET':
        return {
          type: 'FINALE_GAUNTLET',
          title: 'STAGE 50: FINALE GAUNTLET',
          instruction: 'APEX: TAP 1 -> 2 -> 3 -> 4 -> 5! DODGE BOMBS + SWITCHERS!',
          failBlurb: 'The Finale Gauntlet overwhelmed you!',
          timeLimitSec: 8.0,
          overlapKill: true,
          targets: [{
            id: 'c-50-t1',
            x: 20,
            y: 38,
            size: 52,
            color: '#22d3ee',
            label: '1',
            shape: 'square',
            sequenceIndex: 1,
            vx: 1.6,
            vy: 1.2,
            isCorrect: true
          }, {
            id: 'c-50-t2',
            x: 80,
            y: 38,
            size: 52,
            color: '#3b82f6',
            label: '2',
            shape: 'square',
            sequenceIndex: 2,
            vx: -1.5,
            vy: 1.4,
            isCorrect: false
          }, {
            id: 'c-50-t3',
            x: 20,
            y: 62,
            size: 52,
            color: '#8b5cf6',
            label: '3',
            shape: 'square',
            sequenceIndex: 3,
            vx: 1.4,
            vy: -1.5,
            isCorrect: false
          }, {
            id: 'c-50-t4',
            x: 80,
            y: 62,
            size: 52,
            color: '#ec4899',
            label: '4',
            shape: 'square',
            sequenceIndex: 4,
            vx: -1.7,
            vy: -1.2,
            isCorrect: false
          }, {
            id: 'c-50-t5',
            x: 50,
            y: 52,
            size: 56,
            color: '#fbbf24',
            label: '5',
            shape: 'circle',
            sequenceIndex: 5,
            isCorrect: false
          }, {
            id: 'c-50-bomb1',
            x: 75.5,
            y: 50,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            isOrbiting: true,
            orbitRadius: 100,
            orbitSpeedDeg: 200,
            orbitPhaseDeg: 0,
            isCorrect: false
          }, {
            id: 'c-50-bomb2',
            x: 24.5,
            y: 50,
            size: 54,
            color: '#64748b',
            label: 'BOMB',
            isOrbiting: true,
            orbitRadius: 100,
            orbitSpeedDeg: 200,
            orbitPhaseDeg: 180,
            isCorrect: false
          }, {
            id: 'c-50-switch1',
            x: 38,
            y: 72,
            size: 52,
            color: '#a855f7',
            isCorrect: false,
            colorIntervalSec: 0.35,
            alternatingColors: [{
              color: '#a855f7',
              isCorrect: false
            }, {
              color: '#22d3ee',
              isCorrect: false
            }]
          }, {
            id: 'c-50-switch2',
            x: 62,
            y: 72,
            size: 52,
            color: '#22d3ee',
            isCorrect: false,
            colorIntervalSec: 0.35,
            alternatingColors: [{
              color: '#22d3ee',
              isCorrect: false
            }, {
              color: '#a855f7',
              isCorrect: false
            }]
          }]
        };

      default:
        return {
          type: 'TAP_TARGET',
          title: "STAGE " + stageNumber + ": REFLEX",
          instruction: 'TAP THE TARGET',
          failBlurb: 'Missed target!',
          targets: [{
            id: 'c-def',
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

  function _reportPossibleCrUseOfGameMode(extras) {
    _reporterNs.report("GameMode", "../template/models", _context.meta, extras);
  }

  function _reportPossibleCrUseOfSTAGE_PROGRESSION(extras) {
    _reporterNs.report("STAGE_PROGRESSION", "../template/constants", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgenerateWeirdModeStage(extras) {
    _reporterNs.report("generateWeirdModeStage", "./weirdStages", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcreateDailySeed(extras) {
    _reporterNs.report("createDailySeed", "./dailySeed", _context.meta, extras);
  }

  function _reportPossibleCrUseOfcreateLCG(extras) {
    _reporterNs.report("createLCG", "./dailySeed", _context.meta, extras);
  }

  function _reportPossibleCrUseOfgetTodayDateString(extras) {
    _reporterNs.report("getTodayDateString", "./dailySeed", _context.meta, extras);
  }

  _export("generateStageChallenge", generateStageChallenge);

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
    }, function (_unresolved_2) {
      STAGE_PROGRESSION = _unresolved_2.STAGE_PROGRESSION;
    }, function (_unresolved_3) {
      generateWeirdModeStage = _unresolved_3.generateWeirdModeStage;
    }, function (_unresolved_4) {
      createDailySeed = _unresolved_4.createDailySeed;
      createLCG = _unresolved_4.createLCG;
      getTodayDateString = _unresolved_4.getTodayDateString;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "98e55XR4xZFKauDF2g34F4m", "challenges", undefined);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=04381a3f6e022ae75e2042c429fd1d7ee3b9374a.js.map