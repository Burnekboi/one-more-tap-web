import React, { useState, useEffect, useRef } from 'react';
import { GameState, ActiveChallenge, TargetItem, PlayerData, GameMode } from '../types';
import { sound } from '../utils/audio';
import {
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  Skull,
  Crown,
  Zap,
  CheckCircle2,
  Timer,
  Lock,
} from 'lucide-react';
import { generateStageChallenge, getStageDifficulty } from '../utils/challengeGenerators';
import { TikTokAdModal } from './TikTokAdModal';
import { tikTokAds } from '../utils/tiktokAds';

interface GameSimulatorProps {
  playerData: PlayerData;
  onUpdatePlayerData: (data: Partial<PlayerData>) => void;
  isDailyMode?: boolean;
  initialMode?: GameMode;
  onModeChange?: (mode: GameMode) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export function GameSimulator({
  playerData,
  onUpdatePlayerData,
  isDailyMode = false,
  initialMode = 'WEIRD',
  onModeChange,
}: GameSimulatorProps) {
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [stage, setStage] = useState(1);
  const [activeChallenge, setActiveChallenge] = useState<ActiveChallenge | null>(null);

  useEffect(() => {
    if (initialMode) {
      setGameMode(initialMode);
    }
  }, [initialMode]);

  const maxStages = gameMode === 'WEIRD' ? 24 : 50;
  const modeTitle = gameMode === 'WEIRD' ? 'WEIRD MODE(easy)' : 'CRAZY MODE(hard)';

  // Survival hold countdown state for DONT_TAP & REVERSE_PSYCH
  const [survivalHoldMs, setSurvivalHoldMs] = useState<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  // Synchronous refs to prevent stale closure traps across async timers & events
  const stageRef = useRef<number>(1);
  const scoreRef = useRef<number>(0);
  const comboRef = useRef<number>(0);
  const activeChallengeRef = useRef<ActiveChallenge | null>(null);
  const stageEnterTimeRef = useRef<number>(performance.now());

  // Continuous timer bank: starts at 10000ms, does not reset between stages, capped at 10000ms
  const [timeLeftMs, setTimeLeftMs] = useState(10000);
  const timeLeftMsRef = useRef<number>(10000);
  const [timeRemainingPercent, setTimeRemainingPercent] = useState(100);
  const [timeBonusFeedback, setTimeBonusFeedback] = useState<{ text: string; isCombo: boolean } | null>(null);
  const timeBonusTimeoutRef = useRef<number | null>(null);

  const [comboFeedback, setComboFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isPerfectFeedback, setIsPerfectFeedback] = useState(false);
  const [screenPulse, setScreenPulse] = useState(false);
  const [gameOverBlurb, setGameOverBlurb] = useState<string>('');
  const [muted, setMuted] = useState(sound.isMuted());
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [, setGhostTick] = useState<number>(0);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [revivesUsedThisRun, setRevivesUsedThisRun] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const stageTimeoutRef = useRef<number | null>(null);
  const catchMeTimerRef = useRef<number | null>(null);

  const challengeStateRef = useRef<{
    active: boolean;
    challenge: ActiveChallenge | null;
    score: number;
    combo: number;
    stage: number;
  }>({
    active: false,
    challenge: null,
    score: 0,
    combo: 0,
    stage: 1,
  });

  // Keep state refs updated synchronously
  useEffect(() => {
    stageRef.current = stage;
    scoreRef.current = score;
    comboRef.current = combo;
    activeChallengeRef.current = activeChallenge;
    challengeStateRef.current = {
      active: gameState === GameState.PLAYING,
      challenge: activeChallenge,
      score,
      combo,
      stage,
    };
  }, [gameState, activeChallenge, score, combo, stage]);

  // Particle engine loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= 0.035;
        p.size *= 0.96;

        if (p.alpha <= 0.02 || p.size <= 0.5) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const spawnParticles = (xPx: number, yPx: number, count: number, color: string) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x: xPx,
        y: yPx,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        alpha: 1,
        size: 3 + Math.random() * 4,
        color,
      });
    }
  };

  // Clear all running timers
  const clearTimers = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (catchMeTimerRef.current) {
      clearTimeout(catchMeTimerRef.current);
      catchMeTimerRef.current = null;
    }
    if (timeBonusTimeoutRef.current) {
      clearTimeout(timeBonusTimeoutRef.current);
      timeBonusTimeoutRef.current = null;
    }
    setSurvivalHoldMs(null);
  };

  // Setup special stage triggers (Reaction signal flip, or survive wait for DONT_TAP / REVERSE_PSYCH)
  const setupStageSpecialTriggers = (challenge: ActiveChallenge) => {
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (catchMeTimerRef.current) {
      clearTimeout(catchMeTimerRef.current);
      catchMeTimerRef.current = null;
    }
    setSurvivalHoldMs(null);

    // Reaction challenge: flips from WAIT to TAP NOW after 800-1300ms
    if (challenge.type === 'REACTION') {
      const waitMs = 800 + Math.random() * 500;
      stageTimeoutRef.current = window.setTimeout(() => {
        setActiveChallenge((prev) => {
          if (!prev || prev.type !== 'REACTION') return prev;
          sound.playMilestone();
          return {
            ...prev,
            instruction: 'TAP NOW! FAST!!',
            subState: 'TAP',
            targets: [
              {
                id: 'reaction-tap-green',
                x: 50,
                y: 50,
                size: 78,
                color: '#22c55e',
                label: gameMode === 'WEIRD' ? undefined : 'TAP NOW!',
                textColor: '#000000',
                isCorrect: true,
              },
            ],
          };
        });
      }, waitMs);
    }

    // DONT_TAP: Survive for 1.5s without touching (active countdown gauge + timer bank safely paused)
    if (challenge.type === 'DONT_TAP') {
      let holdRemaining = 1500;
      setSurvivalHoldMs(holdRemaining);

      holdIntervalRef.current = window.setInterval(() => {
        if (!challengeStateRef.current.active) return;
        holdRemaining -= 50;
        setSurvivalHoldMs(Math.max(0, holdRemaining));

        if (holdRemaining <= 0) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          setSurvivalHoldMs(null);
          handleChallengeSuccess(15);
        }
      }, 50);
    }

    // REVERSE_PSYCH: Survive for 1.8s without touching (timer bank paused)
    if (challenge.type === 'REVERSE_PSYCH') {
      let holdRemaining = 1800;
      setSurvivalHoldMs(holdRemaining);

      holdIntervalRef.current = window.setInterval(() => {
        if (!challengeStateRef.current.active) return;
        holdRemaining -= 50;
        setSurvivalHoldMs(Math.max(0, holdRemaining));

        if (holdRemaining <= 0) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          setSurvivalHoldMs(null);
          handleChallengeSuccess(20);
        }
      }, 50);
    }

    // CATCH_ME_RED: Line of circles moving bottom to top, turns red for 1.5s, then 2.0s cooldown, then next circle turns red
    if (challenge.type === 'CATCH_ME_RED') {
      let redIndex = 0;
      let phase: 'RED' | 'COOLDOWN' = 'RED';

      const updateCatchMeTargets = (activeIdx: number, isRedPhase: boolean) => {
        setActiveChallenge((prev) => {
          if (!prev || prev.type !== 'CATCH_ME_RED') return prev;
          const updated = prev.targets.map((t, idx) => {
            const isThisRed = isRedPhase && idx === activeIdx;
            return {
              ...t,
              color: isThisRed ? '#ef4444' : '#3b82f6',
              label: undefined,
              isRed: isThisRed,
              isCorrect: isThisRed,
            };
          });
          return { ...prev, targets: updated };
        });
      };

      updateCatchMeTargets(redIndex, true);

      const runCycle = () => {
        if (!challengeStateRef.current.active) return;
        if (phase === 'RED') {
          phase = 'COOLDOWN';
          updateCatchMeTargets(redIndex, false);
          catchMeTimerRef.current = window.setTimeout(runCycle, 2000);
        } else {
          phase = 'RED';
          redIndex = (redIndex + 1) % (activeChallengeRef.current?.targets.length || 5);
          updateCatchMeTargets(redIndex, true);
          catchMeTimerRef.current = window.setTimeout(runCycle, 1500);
        }
      };

      catchMeTimerRef.current = window.setTimeout(runCycle, 1500);
    }

    // TAP_BEFORE_EXPLODE: 3 seconds countdown to defuse 2 exploding circles
    if (challenge.type === 'TAP_BEFORE_EXPLODE') {
      let explodeLeft = 3000;
      setSurvivalHoldMs(explodeLeft);

      holdIntervalRef.current = window.setInterval(() => {
        if (!challengeStateRef.current.active) return;
        explodeLeft -= 50;
        setSurvivalHoldMs(Math.max(0, explodeLeft));

        if (explodeLeft <= 0) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          setSurvivalHoldMs(null);
          triggerGameOver('BOMB_EXPLODED', '💥 BOOM! The circle exploded! You must tap the exploding circles within 3 seconds!');
        }
      }, 50);
    }
  };

  // Start continuous countdown timer
  const startContinuousTimer = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    let lastTime = performance.now();
    const interval = window.setInterval(() => {
      if (!challengeStateRef.current.active) return;
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      // Decrement continuous timer bank ONLY if NOT in a DO NOT TOUCH, WAIT, or SUSPENSE stage
      const current = activeChallengeRef.current;
      const isHoldStage =
        current && (
          current.type === 'DONT_TAP' ||
          current.type === 'REVERSE_PSYCH' ||
          (current.type === 'REACTION' && current.subState === 'WAIT') ||
          (current.type === 'CONFUSION_TAP' && current.subState === 'SUSPENSE')
        );

      if (!isHoldStage) {
        timeLeftMsRef.current = Math.max(0, timeLeftMsRef.current - delta);
        const remaining = timeLeftMsRef.current;
        setTimeLeftMs(remaining);
        setTimeRemainingPercent((remaining / 10000) * 100);

        // Check for Timeout Game Over
        if (remaining <= 0) {
          clearInterval(interval);
          triggerGameOver('TIMEOUT', challengeStateRef.current.challenge?.failBlurb || '10 seconds timer bank expired! Faster next time!');
          return;
        }
      }

      // Update ghost tick for continuous smooth fading animation
      if (current && current.type === 'GHOST_CIRCLE') {
        setGhostTick((t) => t + 1);
      }

      // Physics for moving targets
      if (current) {
        if (current.type === 'MOVING_TARGET' || current.type === 'PHONE_DROP' || current.type === 'CHOPSTICKS_GRAB') {
          setActiveChallenge((prev) => {
            if (!prev) return prev;
            const updatedTargets = prev.targets.map((t) => {
              let nextX = t.x + (t.vx || 0);
              let nextY = t.y + (t.vy || 0);
              let nextVx = t.vx || 0;
              let nextVy = t.vy || 0;

              if (nextX < 24 || nextX > 76) nextVx = -nextVx;
              if (nextY < 32 || nextY > 68) nextVy = -nextVy;

              return {
                ...t,
                x: Math.max(22, Math.min(78, nextX)),
                y: Math.max(30, Math.min(70, nextY)),
                vx: nextVx,
                vy: nextVy,
              };
            });
            return { ...prev, targets: updatedTargets };
          });
        } else if (current.type === 'CATCH_ME_RED') {
          // Line of blue circles moving bottom to top, wrap seamlessly
          setActiveChallenge((prev) => {
            if (!prev || prev.type !== 'CATCH_ME_RED') return prev;
            const updatedTargets = prev.targets.map((t) => {
              let nextY = t.y + (t.vy || -0.22);
              if (nextY < 12) nextY = 88;
              return { ...t, y: nextY };
            });
            return { ...prev, targets: updatedTargets };
          });
        } else if (current.type === 'FLOATING_BUBBLE') {
          // 10 blue circles: 1 floating upwards, 9 falling downwards
          setActiveChallenge((prev) => {
            if (!prev || prev.type !== 'FLOATING_BUBBLE') return prev;
            const updatedTargets = prev.targets.map((t) => {
              let nextY = t.y + (t.vy || 0.25);
              if (t.isFloatingUp) {
                if (nextY < 12) nextY = 88;
              } else {
                if (nextY > 88) nextY = 12;
              }
              return { ...t, y: nextY };
            });
            return { ...prev, targets: updatedTargets };
          });
        } else if (current.type === 'GHOST_CIRCLE') {
          // 50 lightblue circles drift gently with bouncy bounds
          setActiveChallenge((prev) => {
            if (!prev || prev.type !== 'GHOST_CIRCLE') return prev;
            const updatedTargets = prev.targets.map((t) => {
              let nextX = t.x + (t.vx || 0);
              let nextY = t.y + (t.vy || 0);
              let nextVx = t.vx || 0;
              let nextVy = t.vy || 0;

              if (nextX < 10 || nextX > 90) nextVx = -nextVx;
              if (nextY < 12 || nextY > 88) nextVy = -nextVy;

              return {
                ...t,
                x: Math.max(10, Math.min(90, nextX)),
                y: Math.max(12, Math.min(88, nextY)),
                vx: nextVx,
                vy: nextVy,
              };
            });
            return { ...prev, targets: updatedTargets };
          });
        } else if (current.type === 'TAP_THE_TOP') {
          // 3 circles moving upwards with slow, fast, fastest speeds
          setActiveChallenge((prev) => {
            if (!prev || prev.type !== 'TAP_THE_TOP') return prev;
            const updatedTargets = prev.targets.map((t) => {
              let nextY = t.y + (t.vy || -0.25);
              if (nextY < 14) nextY = 86; // Wrap around to bottom so the highest changes continuously
              return { ...t, y: nextY };
            });
            return { ...prev, targets: updatedTargets };
          });
        }
      }
    }, 20);

    timerIntervalRef.current = interval;
  };

  // Start game run from Stage 1
  const handleStartGame = (modeOverride?: GameMode) => {
    const activeMode = modeOverride || gameMode;
    if (activeMode === 'CRAZY' && !playerData.weirdModeCleared) {
      sound.playMiss();
      setLockNotice('Complete WEIRD MODE (24 Stages) to unlock CRAZY MODE!');
      setTimeout(() => setLockNotice(null), 2500);
      return;
    }

    if (modeOverride && modeOverride !== gameMode) {
      setGameMode(modeOverride);
      onModeChange?.(modeOverride);
    }
    clearTimers();
    sound.playButton();
    setScore(0);
    setCombo(0);
    setStage(1);
    stageRef.current = 1;
    scoreRef.current = 0;
    comboRef.current = 0;
    setComboFeedback(null);
    setIsPerfectFeedback(false);
    setGameOverBlurb('');
    setTimeBonusFeedback(null);
    setSurvivalHoldMs(null);
    setRevivesUsedThisRun(0);

    // Initial 10-second timer bank
    timeLeftMsRef.current = 10000;
    setTimeLeftMs(10000);
    setTimeRemainingPercent(100);

    setGameState(GameState.PLAYING);

    const firstChallenge = generateStageChallenge(0, activeMode);
    activeChallengeRef.current = firstChallenge;
    stageEnterTimeRef.current = performance.now();
    setActiveChallenge(firstChallenge);
    setupStageSpecialTriggers(firstChallenge);
    startContinuousTimer();
  };

  // Trigger game over with humorous reason
  const triggerGameOver = (cause: string = 'MISSED', customBlurb?: string) => {
    clearTimers();
    sound.playMiss();
    setTimeout(() => sound.playGameOver(), 150);

    setGameState(GameState.GAME_OVER);
    const finalScore = scoreRef.current;
    const finalCombo = comboRef.current;

    setGameOverBlurb(customBlurb || activeChallengeRef.current?.failBlurb || 'Reaction window expired! Faster next time!');

    const isNewRecord = finalScore > playerData.bestScore;
    if (isNewRecord) {
      setTimeout(() => sound.playNewBest(), 350);
    }

    const modeKey = gameMode === 'WEIRD' ? 'bestScoreWeird' : 'bestScoreCrazy';
    const prevModeBest = playerData[modeKey] || 0;

    onUpdatePlayerData({
      bestScore: Math.max(playerData.bestScore, finalScore),
      [modeKey]: Math.max(prevModeBest, finalScore),
      totalRuns: (playerData.totalRuns || 0) + 1,
      highestCombo: Math.max(playerData.highestCombo || 0, finalCombo),
      ...(isDailyMode
        ? {
            dailyBestScore: Math.max(playerData.dailyBestScore || 0, finalScore),
          }
        : {}),
    });
  };

  // TikTok Mini Rewarded Ad: Handle Revive Click
  const handleReviveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playButton();

    // Check if running in native TikTok Mini Game runtime
    if (tikTokAds.isTikTokMiniNative()) {
      const rewarded = await tikTokAds.showNativeRewardedAd();
      if (rewarded === true) {
        executeRevive();
        return;
      }
      if (rewarded === false) {
        return; // User cancelled / closed ad without completing
      }
    }

    // Open simulated TikTok Mini Rewarded Ad modal
    setIsAdModalOpen(true);
  };

  // Grant Revive after watching TikTok Mini Ad: Restore stage where player died
  const executeRevive = () => {
    clearTimers();
    setIsAdModalOpen(false);

    // Replenish 10-second continuous timer bank
    timeLeftMsRef.current = 10000;
    setTimeLeftMs(10000);
    setTimeRemainingPercent(100);

    const currentReviveStage = stageRef.current;

    // Generate fresh challenge for the exact stage where the player died
    const freshChallenge = generateStageChallenge(currentReviveStage - 1, gameMode);
    activeChallengeRef.current = freshChallenge;
    setActiveChallenge(freshChallenge);
    stageEnterTimeRef.current = performance.now();

    setRevivesUsedThisRun((prev) => prev + 1);
    setGameOverBlurb('');
    setGameState(GameState.PLAYING);

    setupStageSpecialTriggers(freshChallenge);
    startContinuousTimer();

    sound.playRevive();
    setComboFeedback({
      text: `⚡ REVIVED! STAGE ${currentReviveStage} (+10s BANK)`,
      color: '#00f2fe',
    });
    setScreenPulse(true);
    setTimeout(() => setScreenPulse(false), 140);
  };

  // Pass challenge on successful completion
  const handleChallengeSuccess = (customAddedScore?: number) => {
    if (stageTimeoutRef.current) {
      clearTimeout(stageTimeoutRef.current);
      stageTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setSurvivalHoldMs(null);

    const currentStageNum = stageRef.current;
    const currentCombo = comboRef.current;
    const currentScore = scoreRef.current;

    const elapsed = performance.now() - stageEnterTimeRef.current;
    const isPerfect = elapsed < 800;

    if (isPerfect) {
      sound.playPerfect();
      setIsPerfectFeedback(true);
      setTimeout(() => setIsPerfectFeedback(false), 500);
    } else {
      sound.playTap();
    }

    const newCombo = currentCombo + 1;
    const comboMultiplier = 1 + Math.floor(newCombo / 5) * 0.5;
    const addedScore = customAddedScore ?? Math.floor((isPerfect ? 20 : 10) * comboMultiplier);
    const nextScore = currentScore + addedScore;

    scoreRef.current = nextScore;
    comboRef.current = newCombo;
    setScore(nextScore);
    setCombo(newCombo);

    // CONTINUOUS TIMER REWARD:
    // Base: +3.0 seconds. If combo >= 5: +4.0 seconds!
    // Total max time is capped at 10.0 seconds (10000ms). Does not reset!
    const bonusMs = newCombo >= 5 ? 4000 : 3000;
    const prevTime = timeLeftMsRef.current;
    const nextTime = Math.min(10000, prevTime + bonusMs);
    timeLeftMsRef.current = nextTime;
    setTimeLeftMs(nextTime);
    setTimeRemainingPercent((nextTime / 10000) * 100);

    // Show floating time bonus feedback
    setTimeBonusFeedback({
      text: newCombo >= 5 ? '+4.0s (5x COMBO BONUS!)' : '+3.0s',
      isCombo: newCombo >= 5,
    });
    if (timeBonusTimeoutRef.current) clearTimeout(timeBonusTimeoutRef.current);
    timeBonusTimeoutRef.current = window.setTimeout(() => setTimeBonusFeedback(null), 900);

    // Track lifetime taps
    onUpdatePlayerData({
      totalTaps: (playerData.totalTaps || 0) + 1,
    });

    // Milestone callouts
    if (newCombo === 5) {
      setComboFeedback({ text: '5x STREAK (+4s BONUS!)', color: '#38bdf8' });
      sound.playMilestone();
    } else if (newCombo === 10) {
      setComboFeedback({ text: '10x UNSTOPPABLE!', color: '#22c55e' });
      sound.playMilestone();
    } else if (newCombo === 25) {
      setComboFeedback({ text: '25x GODLIKE!!', color: '#a855f7' });
      sound.playMilestone();
    } else if (newCombo === 50) {
      setComboFeedback({ text: '50x IMMORTAL!!', color: '#f59e0b' });
      sound.playMilestone();
    }

    // Screen pulse
    setScreenPulse(true);
    setTimeout(() => setScreenPulse(false), 80);

    // Check Victory!
    if (currentStageNum >= maxStages) {
      // VICTORY! Beaten all stages for current mode!
      clearTimers();
      sound.playMilestone();
      setTimeout(() => sound.playNewBest(), 300);
      setGameState(GameState.VICTORY);

      const modeKey = gameMode === 'WEIRD' ? 'bestScoreWeird' : 'bestScoreCrazy';
      const prevModeBest = playerData[modeKey] || 0;

      onUpdatePlayerData({
        bestScore: Math.max(playerData.bestScore, nextScore),
        [modeKey]: Math.max(prevModeBest, nextScore),
        weirdModeCleared: gameMode === 'WEIRD' ? true : (playerData.weirdModeCleared || false),
        totalRuns: (playerData.totalRuns || 0) + 1,
        highestCombo: Math.max(playerData.highestCombo || 0, newCombo),
        ...(isDailyMode
          ? { dailyBestScore: Math.max(playerData.dailyBestScore || 0, nextScore) }
          : {}),
      });
      return;
    }

    // Transition to next non-repeating stage
    const nextStage = currentStageNum + 1;
    stageRef.current = nextStage;
    setStage(nextStage);
    const nextChallenge = generateStageChallenge(nextStage - 1, gameMode);
    activeChallengeRef.current = nextChallenge;
    setActiveChallenge(nextChallenge);
    stageEnterTimeRef.current = performance.now();
    setupStageSpecialTriggers(nextChallenge);
  };

  // Handle Target Tap
  const handleTargetTap = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    target: TargetItem
  ) => {
    e.stopPropagation();
    if (gameState !== GameState.PLAYING || !activeChallenge) return;

    // Click coordinates for particle burst
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = document.getElementById('arcade-playfield')?.getBoundingClientRect();
    const pxX = rect.left + rect.width / 2 - (containerRect?.left || 0);
    const pxY = rect.top + rect.height / 2 - (containerRect?.top || 0);

    // If reaction tapped during WAIT state: jump the gun!
    if (activeChallenge.type === 'REACTION' && activeChallenge.subState === 'WAIT') {
      const timeSinceEnter = performance.now() - stageEnterTimeRef.current;
      if (timeSinceEnter < 350) return; // Grace period buffer for previous stage clicks
      triggerGameOver('EARLY_TAP', 'You tapped before the green signal! Wait for green!');
      return;
    }

    // If tapped while DONT_TAP or REVERSE_PSYCH is active: immediate fail (after grace period)!
    if (activeChallenge.type === 'DONT_TAP' || (activeChallenge.type === 'REVERSE_PSYCH' && activeChallenge.mustSurviveDuration)) {
      const timeSinceEnter = performance.now() - stageEnterTimeRef.current;
      if (timeSinceEnter < 350) return; // Grace period buffer for previous stage clicks
      triggerGameOver('FORBIDDEN_TAP', activeChallenge.failBlurb || 'Impulsive touch! You were explicitly instructed DO NOT TOUCH!');
      return;
    }

    // Danger / incorrect target tapped
    if (target.isDanger || target.isCorrect === false) {
      triggerGameOver('WRONG_TARGET', activeChallenge.failBlurb || 'Wrong target tapped!');
      return;
    }

    // BUBBLE WRAP: Pop all 3 bubbles
    if (activeChallenge.type === 'BUBBLE_WRAP') {
      sound.playTap();
      spawnParticles(pxX, pxY, 8, '#38bdf8');
      const remainingTargets = activeChallenge.targets.filter((t) => t.id !== target.id);
      if (remainingTargets.length === 0) {
        handleChallengeSuccess();
      } else {
        setActiveChallenge((prev) => (prev ? { ...prev, targets: remainingTargets } : null));
      }
      return;
    }

    // PIN CRACK: Tap 1, 2, 3, 4 sequentially
    if (activeChallenge.type === 'PIN_CRACK') {
      sound.playTap();
      spawnParticles(pxX, pxY, 8, '#38bdf8');
      const step = target.stepNumber;
      if (step && step < 4) {
        const nextStep = step + 1;
        setActiveChallenge((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            targets: prev.targets.map((t) => ({
              ...t,
              isCorrect: t.stepNumber === nextStep,
              color: (t.stepNumber ?? 0) <= step ? '#16a34a' : '#334155',
            })),
          };
        });
        return;
      }
      handleChallengeSuccess();
      return;
    }

    // SEQUENCE: Tap 1, 2, 3 in order
    if (activeChallenge.type === 'SEQUENCE') {
      const currentStep = target.stepNumber;
      sound.playTap();
      spawnParticles(pxX, pxY, 6, '#38bdf8');

      if (currentStep && currentStep < 3) {
        const nextStep = currentStep + 1;
        setActiveChallenge((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            targets: prev.targets.map((t) => ({
              ...t,
              isCorrect: t.stepNumber === nextStep,
              color: (t.stepNumber ?? 0) <= currentStep ? '#16a34a' : '#334155',
              textColor: '#ffffff',
            })),
          };
        });
        return;
      }
      handleChallengeSuccess();
      return;
    }

    // MULTI_TAP: Mash turbo button 5 times
    if (activeChallenge.type === 'MULTI_TAP') {
      const remaining = (target.tapsRemaining || 1) - 1;
      sound.playTap();
      spawnParticles(pxX, pxY, 6, '#38bdf8');

      if (remaining > 0) {
        setActiveChallenge((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            targets: [
              {
                ...target,
                label: gameMode === 'WEIRD' ? String(remaining) : `x${remaining}`,
                tapsRemaining: remaining,
              },
            ],
          };
        });
        return;
      }
      handleChallengeSuccess();
      return;
    }

    // SHY_TELEPORT: Blinks away once on first tap
    if (activeChallenge.type === 'SHY_TELEPORT' && activeChallenge.subState === 'FIRST_POS') {
      sound.playTap();
      spawnParticles(pxX, pxY, 8, '#c084fc');
      setActiveChallenge((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          instruction: 'OVER HERE! QUICK!!',
          subState: 'SECOND_POS',
          targets: [
            {
              id: 'shy-2',
              x: 72,
              y: 58,
              size: 64,
              color: '#22c55e',
              label: 'GOTCHA!',
              isCorrect: true,
            },
          ],
        };
      });
      return;
    }

    // TRIPLE_COLOR_RULE: Tap Red, Don't Tap Green, Tap Blue (3 circles red, green and blue)
    if (activeChallenge.type === 'TRIPLE_COLOR_RULE') {
      if (target.isDanger || target.id.includes('green') || target.color === '#22c55e') {
        triggerGameOver('TAPPED_GREEN', "You tapped GREEN! The rule is: TAP RED, DON'T TAP GREEN, TAP BLUE!");
        return;
      }
      sound.playTap();
      spawnParticles(pxX, pxY, 10, target.color);
      const remainingTargets = activeChallenge.targets.filter((t) => t.id !== target.id);
      const remainingNeeded = remainingTargets.filter((t) => !t.isDanger);
      if (remainingNeeded.length === 0) {
        handleChallengeSuccess();
      } else {
        setActiveChallenge((prev) => (prev ? { ...prev, targets: remainingTargets } : null));
      }
      return;
    }

    // FLOATING_BUBBLE: 10 blue circles, 1 floating upwards, 9 falling downwards
    if (activeChallenge.type === 'FLOATING_BUBBLE') {
      if (target.isFloatingUp || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#60a5fa');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('FALLING_BUBBLE', 'That bubble was falling downwards! Catch the one floating UPWARDS! ⬆️');
        return;
      }
    }

    // IMPOSTOR_FINDER: 5 circles with emojis, only 1 is disguised/impostor
    if (activeChallenge.type === 'IMPOSTOR_FINDER') {
      if (target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#f59e0b');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('WRONG_IMPOSTOR', "Wrong choice! That wasn't the impostor with the disguise/mask!");
        return;
      }
    }

    // CATCH_ME_RED: Line of blue circles, catch when it turns red
    if (activeChallenge.type === 'CATCH_ME_RED') {
      if (target.isRed) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#ef4444');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('TAPPED_BLUE', 'It was BLUE! Catch it when it turns RED! ⚡');
        return;
      }
    }

    // CONFUSION_TAP: Tap Red 3x, Tap Blue 2x, Green on next stage (1.5s suspense hold)
    if (activeChallenge.type === 'CONFUSION_TAP') {
      if (activeChallenge.subState === 'SUSPENSE') {
        triggerGameOver('SUSPENSE_BROKEN', 'You tapped during the suspense! Green is for NEXT stage!');
        return;
      }

      if (target.isDanger || target.id.includes('green') || target.color === '#22c55e') {
        triggerGameOver('TAPPED_GREEN_EARLY', 'You tapped GREEN! Green is for NEXT stage, not this one!');
        return;
      }

      sound.playTap();
      spawnParticles(pxX, pxY, 8, target.color);

      const rem = (target.tapsRemaining || 1) - 1;
      const updatedTargets = activeChallenge.targets.map((t) => {
        if (t.id === target.id) {
          return {
            ...t,
            tapsRemaining: rem,
            label: rem > 0 ? (gameMode === 'WEIRD' ? String(rem) : `x${rem}`) : (gameMode === 'WEIRD' ? undefined : 'DONE ✓'),
            isCorrect: rem > 0,
          };
        }
        return t;
      });

      const redTarget = updatedTargets.find((t) => t.id.includes('red'));
      const blueTarget = updatedTargets.find((t) => t.id.includes('blue'));
      const redDone = !redTarget || (redTarget.tapsRemaining ?? 0) <= 0;
      const blueDone = !blueTarget || (blueTarget.tapsRemaining ?? 0) <= 0;

      if (redDone && blueDone) {
        // Red 3x & Blue 2x done! Hold player for 1.5s suspense
        setActiveChallenge((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            targets: updatedTargets,
            subState: 'SUSPENSE',
            instruction: 'WAITING... (1.5s SUSPENSE) 🤔 DON\'T TOUCH GREEN!',
          };
        });

        setSurvivalHoldMs(1500);
        let suspenseLeft = 1500;
        holdIntervalRef.current = window.setInterval(() => {
          if (!challengeStateRef.current.active) return;
          suspenseLeft -= 50;
          setSurvivalHoldMs(Math.max(0, suspenseLeft));
          if (suspenseLeft <= 0) {
            if (holdIntervalRef.current) {
              clearInterval(holdIntervalRef.current);
              holdIntervalRef.current = null;
            }
            setSurvivalHoldMs(null);
            handleChallengeSuccess(25);
          }
        }, 50);
        return;
      }

      setActiveChallenge((prev) => (prev ? { ...prev, targets: updatedTargets } : null));
      return;
    }

    // GHOST_CIRCLE: 50 lightblue circles, only 1 is fading ghost
    if (activeChallenge.type === 'GHOST_CIRCLE') {
      if (target.isGhost || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#38bdf8');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('NOT_GHOST', "That wasn't the ghost! Find the circle that fades in and out! 👻");
        return;
      }
    }

    // ODD_NUMBER_HUNT: 5 circles with numbers, only 1 odd number
    if (activeChallenge.type === 'ODD_NUMBER_HUNT') {
      if (target.isOdd || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, target.color);
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('EVEN_NUMBER', 'That is an EVEN number! I am not even—tap the ODD number! 🔢');
        return;
      }
    }

    // EAT_VEGETABLES: 10 circles (5 red, 2 blue, 3 green) - tap only green vegetables!
    if (activeChallenge.type === 'EAT_VEGETABLES') {
      if (target.isDanger || target.color === '#ef4444' || target.color === '#3b82f6') {
        triggerGameOver('JUNK_FOOD', 'You ate junk food! Be healthy, eat only the GREEN vegetables! 🥦');
        return;
      }
      sound.playTap();
      spawnParticles(pxX, pxY, 12, '#22c55e');
      const updated = activeChallenge.targets.filter((t) => t.id !== target.id);
      const greenRemaining = updated.some((t) => t.isCorrect || t.color === '#22c55e');
      if (!greenRemaining) {
        handleChallengeSuccess(20);
        return;
      }
      setActiveChallenge((prev) => (prev ? { ...prev, targets: updated } : null));
      return;
    }

    // TAP_BEFORE_EXPLODE: 5 circles (3 shrinking, 2 exploding in 3s)
    if (activeChallenge.type === 'TAP_BEFORE_EXPLODE') {
      if (target.isShrinking) {
        triggerGameOver('WRONG_TARGET', 'That was a SHRINKING circle, not an exploding one! Tap the exploding bombs! 💣');
        return;
      }
      if (target.isExploding || target.isCorrect) {
        sound.playTap();
        spawnParticles(pxX, pxY, 16, '#f97316');
        const updated = activeChallenge.targets.filter((t) => t.id !== target.id);
        const bombsRemaining = updated.some((t) => t.isExploding || t.isCorrect);
        if (!bombsRemaining) {
          if (holdIntervalRef.current) {
            clearInterval(holdIntervalRef.current);
            holdIntervalRef.current = null;
          }
          setSurvivalHoldMs(null);
          handleChallengeSuccess(25);
          return;
        }
        setActiveChallenge((prev) => (prev ? { ...prev, targets: updated } : null));
        return;
      }
    }

    // DONT_EAT_VEGETABLES: 10 circles (5 red, 2 blue, 3 green) - tap red & blue, avoid green!
    if (activeChallenge.type === 'DONT_EAT_VEGETABLES') {
      if (target.isDanger || target.color === '#22c55e') {
        triggerGameOver('ATE_VEGGIES', "You ate the vegetables! The rule was DON'T eat the vegetables! 🚫🥦");
        return;
      }
      sound.playTap();
      spawnParticles(pxX, pxY, 10, target.color);
      const updated = activeChallenge.targets.filter((t) => t.id !== target.id);
      const targetsRemaining = updated.some((t) => t.isCorrect);
      if (!targetsRemaining) {
        handleChallengeSuccess(20);
        return;
      }
      setActiveChallenge((prev) => (prev ? { ...prev, targets: updated } : null));
      return;
    }

    // WASD_JUMP: 5 circles (W, A, S, D, Space) - goal is Space
    if (activeChallenge.type === 'WASD_JUMP') {
      if (target.label === 'SPACE' || target.id.includes('sp') || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#0284c7');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('WRONG_KEY', 'Wrong key! Tap SPACE to Jump! ⌨️');
        return;
      }
    }

    // GREEN_MEANS_STOP: 3 circles (red, orange, green) - goal is Red
    if (activeChallenge.type === 'GREEN_MEANS_STOP') {
      if (target.color === '#ef4444' || target.label === 'RED' || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#ef4444');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('TAPPED_WRONG_LIGHT', 'Green means go, BUT STOP! Tap RED! 🚦');
        return;
      }
    }

    // WASD_WALK: 5 circles (W, A, S, D, Space) - goal is W
    if (activeChallenge.type === 'WASD_WALK') {
      if (target.label === 'W' || target.id.includes('w') || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, '#10b981');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('WRONG_KEY', 'Wrong key! Tap W to walk forward! ⬆️');
        return;
      }
    }

    // HIT_ME_BABY_ONE: 3 circles (1, 2, 3) - goal is 1
    if (activeChallenge.type === 'HIT_ME_BABY_ONE') {
      if (target.label === '1' || target.id.includes('1') || target.isCorrect) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 18, '#ec4899');
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('WRONG_NUMBER', 'Oops!... Hit me baby ONE more time! Tap 1! 🎵');
        return;
      }
    }

    // TAP_THE_TOP: 3 circles moving upwards - goal is highest circle
    if (activeChallenge.type === 'TAP_THE_TOP') {
      const minY = Math.min(...activeChallenge.targets.map((t) => t.y));
      if (target.y <= minY + 4) {
        sound.playPerfect();
        spawnParticles(pxX, pxY, 16, target.color);
        handleChallengeSuccess();
        return;
      } else {
        triggerGameOver('NOT_THE_TOP', "That wasn't the highest circle! Tap the circle closest to the top! 🚀");
        return;
      }
    }

    // TOUCH_SPACE: Touching the circle is a fail!
    if (activeChallenge.type === 'TOUCH_SPACE') {
      triggerGameOver('TOUCHED_CIRCLE', 'You touched the circle! The instruction was TOUCH SPACE! 🌌');
      return;
    }

    // Normal successful tap on correct target
    spawnParticles(pxX, pxY, 12, target.color || '#38bdf8');
    handleChallengeSuccess();
  };

  // Mis-tap on background during gameplay = fail (with generous magnetic assist for moving targets)
  const handleBackgroundMiss = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== GameState.PLAYING) return;

    // TOUCH_SPACE: Touching the empty space IS THE GOAL!
    if (activeChallenge?.type === 'TOUCH_SPACE') {
      sound.playTap();
      const rect = document.getElementById('arcade-playfield')?.getBoundingClientRect();
      const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX;
      const clientY = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY;
      if (rect && clientX !== undefined && clientY !== undefined) {
        spawnParticles(clientX - rect.left, clientY - rect.top, 14, '#38bdf8');
      }
      handleChallengeSuccess();
      return;
    }

    // CONFUSION_TAP during suspense: touching background fails!
    if (activeChallenge?.type === 'CONFUSION_TAP' && activeChallenge.subState === 'SUSPENSE') {
      triggerGameOver('SUSPENSE_BROKEN', 'You tapped during the suspense! Green is for NEXT stage!');
      return;
    }

    // If DONT_TAP or REVERSE_PSYCH is active: touching screen background fails after grace period
    if (
      activeChallenge?.type === 'DONT_TAP' ||
      (activeChallenge?.type === 'REVERSE_PSYCH' && activeChallenge?.mustSurviveDuration)
    ) {
      const timeSinceEnter = performance.now() - stageEnterTimeRef.current;
      if (timeSinceEnter < 350) return; // Grace period buffer for previous stage clicks
      triggerGameOver('FORBIDDEN_TAP', 'You touched the screen! You were explicitly instructed DO NOT TOUCH!');
      return;
    }

    // If reaction waiting for green signal: jumping the gun on background also fails
    if (activeChallenge?.type === 'REACTION' && activeChallenge?.subState === 'WAIT') {
      const timeSinceEnter = performance.now() - stageEnterTimeRef.current;
      if (timeSinceEnter < 350) return;
      triggerGameOver('EARLY_TAP', 'You tapped before the green signal! Wait for green!');
      return;
    }

    // Magnetic proximity catch assist for moving targets (MOVING_TARGET, PHONE_DROP, CHOPSTICKS_GRAB, TAP_THE_TOP)
    const isMoving =
      activeChallenge?.type === 'MOVING_TARGET' ||
      activeChallenge?.type === 'PHONE_DROP' ||
      activeChallenge?.type === 'CHOPSTICKS_GRAB' ||
      activeChallenge?.type === 'TAP_THE_TOP';

    if (isMoving && activeChallenge && activeChallenge.targets.length > 0) {
      const playfield = document.getElementById('arcade-playfield')?.getBoundingClientRect();
      if (playfield) {
        const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX;
        const clientY = 'clientY' in e ? e.clientY : e.touches?.[0]?.clientY;
        if (clientX !== undefined && clientY !== undefined) {
          let closestTarget = activeChallenge.targets[0];
          let minDist = 9999;
          for (const t of activeChallenge.targets) {
            const targetPixelX = playfield.left + (t.x / 100) * playfield.width;
            const targetPixelY = playfield.top + (t.y / 100) * playfield.height;
            const dist = Math.hypot(clientX - targetPixelX, clientY - targetPixelY);
            if (dist < minDist) {
              minDist = dist;
              closestTarget = t;
            }
          }
          if (closestTarget && minDist <= 90) {
            handleTargetTap(e, closestTarget);
            return;
          }
        }
      }
    }

    triggerGameOver('BACKGROUND_MISS', 'You tapped the empty void! Accurate taps only!');
  };

  const toGo = Math.max(0, playerData.bestScore - score);
  const difficulty = getStageDifficulty(stage, gameMode);

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Arcade Device Container (TikTok Portrait 9:16 safe canvas) */}
      <div
        id="arcade-device-shell"
        className={`relative w-full max-w-[390px] h-[640px] bg-zinc-950 border-2 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none transition-colors duration-200 ${
          screenPulse ? 'border-cyan-400/80 shadow-cyan-500/30' : 'border-zinc-800 shadow-black'
        }`}
        onClick={handleBackgroundMiss}
      >
        {/* Canvas for Particle Burst Rendering */}
        <canvas
          ref={canvasRef}
          width={390}
          height={640}
          className="absolute inset-0 pointer-events-none z-30"
        />

        {/* TOP HUD: Stage, Difficulty, Score, Combo, Continuous Timer */}
        <div className="relative z-20 pt-3 px-5 flex flex-col items-center pointer-events-none">
          {/* Top Info Bar: Stage Indicator & Difficulty Badge */}
          <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black tracking-wider text-zinc-100 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-lg">
                STAGE {stage} <span className="text-zinc-500 font-normal">/ {maxStages}</span>
              </span>
              <span
                style={{ color: difficulty.color, backgroundColor: difficulty.bg, borderColor: difficulty.border }}
                className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border"
              >
                {difficulty.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                gameMode === 'WEIRD'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-rose-950/80 text-rose-300 border-rose-800/80'
              }`}>
                {gameMode === 'WEIRD' ? 'WEIRD(easy)' : 'CRAZY(hard)'}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                <strong className="text-zinc-200">
                  {gameMode === 'WEIRD'
                    ? (playerData.bestScoreWeird || playerData.bestScore)
                    : (playerData.bestScoreCrazy || playerData.bestScore)}
                </strong>
              </span>
            </div>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-1.5 border border-zinc-800/40">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                gameMode === 'WEIRD'
                  ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400'
                  : 'bg-gradient-to-r from-cyan-400 via-yellow-400 to-rose-500'
              }`}
              style={{ width: `${(stage / maxStages) * 100}%` }}
            />
          </div>

          {/* Current Score & Combo Display */}
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black font-mono tracking-tighter text-white drop-shadow-md">
              {score}
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="text-xs font-black font-mono text-amber-400 tracking-wider">
                  COMBO x{combo}
                </span>
              </div>
            )}
          </div>

          {/* Milestone and Perfect Popups */}
          <div className="h-4 flex items-center justify-center">
            {isPerfectFeedback && (
              <span className="text-xs font-black tracking-widest text-yellow-300 animate-bounce">
                ★ PERFECT +20 ★
              </span>
            )}
            {!isPerfectFeedback && comboFeedback && (
              <span
                style={{ color: comboFeedback.color }}
                className="text-xs font-extrabold tracking-widest uppercase animate-pulse"
              >
                {comboFeedback.text}
              </span>
            )}
          </div>

          {/* CONTINUOUS TIMER BAR (10s Max Bank, +3s on Clear, +4s if 5x Combo) */}
          {gameState === GameState.PLAYING && (
            <div className="w-full mt-1">
              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80 relative">
                <div
                  className="h-full transition-all duration-75 ease-linear rounded-full"
                  style={{
                    width: `${timeRemainingPercent}%`,
                    backgroundColor:
                      timeRemainingPercent > 45
                        ? '#22c55e'
                        : timeRemainingPercent > 25
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono mt-1 px-1">
                <span className="flex items-center gap-1 font-bold text-zinc-300">
                  <Timer className="w-3 h-3 text-cyan-400" />
                  <span>{(timeLeftMs / 1000).toFixed(1)}s</span>
                  {survivalHoldMs !== null || (activeChallenge?.type === 'REACTION' && activeChallenge?.subState === 'WAIT') ? (
                    <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 border border-amber-600/80 px-1.5 py-0.5 rounded-full animate-pulse">
                      PAUSED
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-normal">/ 10.0s MAX</span>
                  )}
                </span>

                {/* Floating time bonus feedback */}
                {timeBonusFeedback ? (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded animate-bounce ${
                      timeBonusFeedback.isCombo
                        ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/40'
                        : 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                    }`}
                  >
                    {timeBonusFeedback.text}
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    {combo >= 4 ? '🔥 NEXT +4s BONUS' : '+3s PER STAGE'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Instruction Bar */}
          {gameState === GameState.PLAYING && activeChallenge && (
            <div
              className={`mt-2 text-xs font-bold tracking-wide text-center px-3 py-1.5 rounded-xl border max-w-full truncate shadow-md transition-all ${
                survivalHoldMs !== null && (activeChallenge.type === 'DONT_TAP' || activeChallenge.type === 'REVERSE_PSYCH')
                  ? 'bg-red-950/95 text-red-200 border-red-500 shadow-red-500/30 animate-pulse'
                  : 'bg-zinc-900/90 text-zinc-100 border-zinc-700'
              }`}
            >
              {survivalHoldMs !== null && (activeChallenge.type === 'DONT_TAP' || activeChallenge.type === 'REVERSE_PSYCH') ? (
                <span className="flex items-center justify-center gap-1.5 text-xs font-extrabold tracking-wider">
                  <span>🚨 DO NOT TOUCH! HOLD STILL:</span>
                  <span className="font-mono text-yellow-300 font-black">
                    {(survivalHoldMs / 1000).toFixed(1)}s
                  </span>
                  <span>🚨</span>
                </span>
              ) : (
                activeChallenge.instruction
              )}
            </div>
          )}
        </div>

        {/* CENTRAL PLAYFIELD: Target Safe Area */}
        <div id="arcade-playfield" className="relative flex-1 w-full overflow-hidden">
          {/* MENU STATE */}
          {gameState === GameState.MENU && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center z-20 pointer-events-auto">
              {/* Crown Icon with Mode Accent */}
              <div className="mb-3 flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-xl animate-pulse ${
                    gameMode === 'WEIRD'
                      ? 'bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-emerald-500/30'
                      : 'bg-gradient-to-br from-rose-500 to-amber-500 shadow-rose-500/30'
                  }`}
                >
                  <Crown className="w-8 h-8 text-black stroke-[2.5]" />
                </div>
                
                {/* Active Difficulty Title */}
                <h1 className="text-xl font-black tracking-wider text-white uppercase">
                  {modeTitle}
                </h1>
                
                <p className="text-[11px] text-zinc-400 mt-1 max-w-[280px] leading-relaxed">
                  {gameMode === 'WEIRD'
                    ? '24 stages of pure circle colors and standard numbers with zero clues or hints.'
                    : '50 non-repeating gauntlet mechanics from Easy to Insane! Continuous 10s timer bank.'}
                </p>
              </div>

              {/* Mode Selection Toggle Buttons */}
              <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-2xl mb-4 w-full max-w-[310px] gap-1">
                <button
                  type="button"
                  id="mode-toggle-weird"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGameMode('WEIRD');
                    onModeChange?.('WEIRD');
                    sound.playButton();
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-left transition-all cursor-pointer ${
                    gameMode === 'WEIRD'
                      ? 'bg-emerald-400 text-black shadow-md shadow-emerald-400/25'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="block text-xs font-black tracking-tight leading-tight">
                    WEIRD MODE(easy)
                  </span>
                  <span className={`block text-[9px] font-medium leading-tight mt-0.5 ${
                    gameMode === 'WEIRD' ? 'text-zinc-900' : 'text-zinc-500'
                  }`}>
                    24 Stages • Circles
                  </span>
                </button>

                <button
                  type="button"
                  id="mode-toggle-crazy"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!playerData.weirdModeCleared) {
                      sound.playMiss();
                      setLockNotice('Complete WEIRD MODE (24 Stages) to unlock CRAZY MODE!');
                      setTimeout(() => setLockNotice(null), 2500);
                      return;
                    }
                    setGameMode('CRAZY');
                    onModeChange?.('CRAZY');
                    sound.playButton();
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-left transition-all cursor-pointer ${
                    gameMode === 'CRAZY'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                      : !playerData.weirdModeCleared
                      ? 'text-zinc-600 hover:text-zinc-500'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="block text-xs font-black tracking-tight leading-tight">
                      CRAZY MODE(hard)
                    </span>
                    {!playerData.weirdModeCleared && (
                      <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </div>
                  <span className={`block text-[9px] font-medium leading-tight mt-0.5 ${
                    gameMode === 'CRAZY'
                      ? 'text-rose-100'
                      : !playerData.weirdModeCleared
                      ? 'text-amber-500/90 font-mono'
                      : 'text-zinc-500'
                  }`}>
                    {!playerData.weirdModeCleared ? '🔒 Beat Weird Mode' : '50 Stages • Gauntlet'}
                  </span>
                </button>
              </div>

              {/* Lock Notice Banner */}
              {lockNotice && (
                <div className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/90 border border-amber-600/80 px-3 py-1.5 rounded-xl mb-3 animate-bounce">
                  🔒 {lockNotice}
                </div>
              )}

              {/* Dominant PLAY Button */}
              <button
                id="arcade-play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame();
                }}
                className={`w-60 py-3 font-extrabold text-sm tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  gameMode === 'WEIRD'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/30'
                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                START STAGE 1 / {maxStages}
              </button>

              {/* Difficulty Ladder Badges */}
              {gameMode === 'WEIRD' ? (
                <div className="flex flex-wrap justify-center gap-1 mt-3.5 max-w-[310px]">
                  <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                    1-8: Warmup
                  </span>
                  <span className="text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                    9-16: Flow
                  </span>
                  <span className="text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full">
                    17-24: Reflex
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-1 mt-3.5 max-w-[310px]">
                  <span className="text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded-full">
                    1-10 Easy
                  </span>
                  <span className="text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded-full">
                    11-20 Med
                  </span>
                  <span className="text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded-full">
                    21-35 Hard
                  </span>
                  <span className="text-[9px] font-mono bg-orange-950/80 text-orange-300 border border-orange-800 px-1.5 py-0.5 rounded-full">
                    36-45 Ext
                  </span>
                  <span className="text-[9px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded-full font-bold">
                    46-50 Insane
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE GAMEPLAY TARGETS (50 MECHANICS SUPPORT) */}
          {gameState === GameState.PLAYING && activeChallenge && (
            <>
              {/* Active Stage Suspense Timers without Clues */}
              {activeChallenge.type === 'CONFUSION_TAP' && activeChallenge.subState === 'SUSPENSE' && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-black font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-amber-200 pointer-events-none select-none flex items-center gap-1.5 whitespace-nowrap">
                  <span>⏳</span>
                  <span className="font-mono font-black">
                    {survivalHoldMs !== null ? (survivalHoldMs / 1000).toFixed(1) : '1.5'}s
                  </span>
                </div>
              )}

              {activeChallenge.type === 'TAP_BEFORE_EXPLODE' && survivalHoldMs !== null && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-rose-300 pointer-events-none select-none flex items-center gap-1.5 whitespace-nowrap">
                  <span>⏱️</span>
                  <span className="font-mono font-black text-yellow-300">
                    {(survivalHoldMs / 1000).toFixed(1)}s
                  </span>
                </div>
              )}

              {activeChallenge.targets.map((target) => {
                const isShrinking = activeChallenge.type === 'SHRINKING_TARGET' || target.isShrinking;
                const shrinkScale = isShrinking ? Math.max(0.35, timeRemainingPercent / 100) : 1;
                const isMoving =
                  activeChallenge.type === 'MOVING_TARGET' ||
                  activeChallenge.type === 'PHONE_DROP' ||
                  activeChallenge.type === 'CHOPSTICKS_GRAB' ||
                  activeChallenge.type === 'TAP_THE_TOP';

                // Compute dynamic fading for GHOST_CIRCLE
                let computedOpacity = target.opacity ?? 1;
                if (target.isGhost) {
                  const elapsed = (performance.now() - stageEnterTimeRef.current) % 3500;
                  if (elapsed < 1800) {
                    computedOpacity = 1;
                  } else if (elapsed < 2600) {
                    computedOpacity = Math.max(0.08, 1 - ((elapsed - 1800) / 800) * 0.92);
                  } else {
                    computedOpacity = Math.min(1, 0.08 + ((elapsed - 2600) / 900) * 0.92);
                  }
                }
                const isPill = [
                  'AURA_CHECK',
                  'AUTOCORRECT_RESCUE',
                  'EMOTIONAL_DAMAGE',
                  'RIZZ_CHECK',
                  'BATTERY_PANIC',
                  'PET_PEEVE',
                  'CAT_MEME',
                  'MICROWAVE_STOP',
                  'ALARM_SNOOZE',
                  'CAPTCHA_BOT',
                  'UNSUBSCRIBE_NINJA',
                  'OVERTHINKING',
                  'ELEVATOR_DOOR',
                  'USB_ORIENTATION',
                  'SPOILER_ALERT',
                  'SNEEZING_HOLD',
                  'MATH_MISDIRECTION',
                  'LOW_STORAGE',
                  'DISCORD_PING',
                  'PHANTOM_VIBRATION',
                  'TIKTOK_SCROLL',
                  'HIGH_STAKES_BOMB',
                ].includes(activeChallenge.type);

                const isGrid2x2 = [
                  'WIFI_HUNT',
                  'WATER_3AM',
                  'CAP_OR_NO_CAP',
                  'QUICK_MATH',
                  'STROOP_LIAR',
                  'IMPOSTOR',
                  'ODD_ONE_OUT',
                ].includes(activeChallenge.type);

                return (
                  <div
                    key={target.id}
                    id={`target-${target.id}`}
                    onClick={(e) => handleTargetTap(e, target)}
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      width: isPill ? '240px' : isGrid2x2 ? '132px' : `${target.size}px`,
                      maxWidth: isPill ? '88%' : '45%',
                      height: isPill ? 'auto' : isGrid2x2 ? '66px' : `${target.size}px`,
                      minHeight: isPill ? '50px' : undefined,
                      backgroundColor: target.color,
                      opacity: computedOpacity,
                      touchAction: 'manipulation',
                      boxShadow: isPill || isGrid2x2
                        ? `0 0 20px ${target.color}88`
                        : `0 0 15px ${target.color}66`,
                      transform: `translate(-50%, -50%) scale(${shrinkScale})`,
                    }}
                    className={`absolute cursor-pointer flex flex-col items-center justify-center select-none z-20 transition-transform active:scale-95 hover:scale-105 border ${
                      isPill
                        ? 'rounded-2xl px-4 py-2.5 shadow-xl border-white/40'
                        : isGrid2x2
                        ? 'rounded-xl px-2.5 py-1.5 shadow-lg border-white/40'
                        : 'rounded-full p-1.5 border-white/30'
                    }`}
                  >
                    {/* Impostor emoji icon */}
                    {target.emoji && (
                      <span className="text-2xl sm:text-3xl select-none pointer-events-none leading-none">
                        {target.emoji}
                      </span>
                    )}

                    {/* Normal numbers & standard labels - no hints */}
                    {target.label && (
                      <span
                        style={{ color: target.textColor || '#ffffff' }}
                        className={`font-black tracking-tight text-center leading-tight select-none pointer-events-none ${
                          isPill
                            ? 'text-xs sm:text-sm font-extrabold uppercase'
                            : isGrid2x2
                            ? 'text-[11px] sm:text-xs font-extrabold uppercase'
                            : /^\d+$/.test(target.label)
                            ? 'text-xl sm:text-2xl font-black'
                            : target.label.length <= 2
                            ? 'text-lg sm:text-xl font-black'
                            : 'text-xs sm:text-sm font-black'
                        }`}
                      >
                        {target.label}
                      </span>
                    )}
                    {target.subtitle && gameMode !== 'WEIRD' && (
                      <span
                        style={{ color: target.textColor ? `${target.textColor}dd` : 'rgba(255,255,255,0.85)' }}
                        className={`font-mono text-center font-bold select-none pointer-events-none mt-0.5 ${
                          isPill ? 'text-[10px] tracking-wide' : 'text-[9px]'
                        }`}
                      >
                        {target.subtitle}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* VICTORY STATE */}
          {gameState === GameState.VICTORY && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-zinc-950/95 pointer-events-auto">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-2xl animate-bounce ${
                  gameMode === 'WEIRD'
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 shadow-emerald-500/50'
                    : 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 shadow-yellow-500/50'
                }`}
              >
                <Crown className="w-12 h-12 text-black stroke-[2.5]" />
              </div>

              <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                STAGE {maxStages} / {maxStages} CLEARED!
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight uppercase">
                {gameMode === 'WEIRD' ? 'WEIRD MODE VICTORY!' : 'CRAZY MODE VICTORY!'}
              </h2>

              <p className="text-xs text-zinc-300 mt-2 max-w-[280px] leading-relaxed">
                {gameMode === 'WEIRD'
                  ? 'You mastered all 24 stages of pure colors and core reflex mechanics!'
                  : 'You conquered the full 50-stage gauntlet from Easy to Insane with absolute mastery!'}
              </p>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 my-4 w-full max-w-[280px] flex justify-around">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Final Score</span>
                  <span className="text-2xl font-black font-mono text-white">{score}</span>
                </div>
                <div className="w-px bg-zinc-800" />
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Max Combo</span>
                  <span className="text-2xl font-black font-mono text-amber-400">{combo}x</span>
                </div>
              </div>

              <button
                id="arcade-victory-play-again"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame();
                }}
                className={`w-56 py-3.5 font-black text-base tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  gameMode === 'WEIRD'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/30'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/30'
                }`}
              >
                <RotateCcw className="w-5 h-5 stroke-[2.5]" />
                PLAY AGAIN
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playButton();
                  setGameState(GameState.MENU);
                }}
                className="mt-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 py-2 px-4 cursor-pointer"
              >
                RETURN TO MENU
              </button>
            </div>
          )}

          {/* GAME OVER SCREEN */}
          {gameState === GameState.GAME_OVER && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-zinc-950/95 pointer-events-auto">
              <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-1 flex items-center gap-1.5">
                <Skull className="w-4 h-4 text-red-400" />
                {score > (gameMode === 'WEIRD' ? (playerData.bestScoreWeird || 0) : (playerData.bestScoreCrazy || 0))
                  ? 'NEW BEST RECORD!'
                  : 'GAME OVER'}
              </div>

              <div className="text-5xl font-black font-mono text-white tracking-tighter my-2">
                {score}
              </div>

              <div className="text-xs font-mono text-zinc-400 mb-2">
                REACHED STAGE <strong className="text-cyan-400 font-bold">{stage} / {maxStages}</strong> • {modeTitle}
              </div>

              {/* Entertaining Failure Blurb */}
              {gameOverBlurb && (
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-xs text-amber-300 mb-4 max-w-[280px] leading-snug">
                  <span className="text-zinc-500 font-mono block text-[10px] uppercase mb-0.5">Cause of Defeat:</span>
                  &ldquo;{gameOverBlurb}&rdquo;
                </div>
              )}

              {toGo > 0 && (
                <div className="bg-zinc-900/80 border border-zinc-800 px-4 py-1.5 rounded-xl text-xs font-bold text-cyan-400 mb-5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{toGo} MORE TO BEAT YOUR BEST</span>
                </div>
              )}

              {/* TIKTOK MINI ADS: REVIVE BUTTON */}
              <button
                id="tiktok-revive-btn"
                onClick={handleReviveClick}
                className="w-64 py-3 mb-2.5 bg-gradient-to-r from-[#00f2fe] via-emerald-400 to-[#fe2c55] hover:brightness-110 text-black font-black text-xs tracking-wider uppercase rounded-2xl shadow-xl shadow-cyan-500/25 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer relative overflow-hidden group"
              >
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-black stroke-black animate-bounce" />
                  <span>REVIVE AT STAGE {stage}</span>
                  {revivesUsedThisRun > 0 && (
                    <span className="text-[9px] bg-black/25 text-black px-1.5 py-0.2 rounded-full font-mono">
                      USED: {revivesUsedThisRun}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-normal opacity-90 mt-0.5">
                  <span>▶ WATCH TIKTOK MINI AD</span>
                  <span>•</span>
                  <span>+10s TIMER</span>
                </div>
              </button>

              {/* 1-Tap TRY AGAIN Button */}
              <button
                id="arcade-retry-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartGame();
                }}
                className={`w-64 py-3 font-black text-xs tracking-wider rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                  gameMode === 'WEIRD'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-emerald-400/30'
                    : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                }`}
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                TRY AGAIN (STAGE 1)
              </button>

              <button
                id="arcade-return-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playButton();
                  setGameState(GameState.MENU);
                }}
                className="mt-3 text-xs font-medium text-zinc-400 hover:text-zinc-200 py-2 px-4 cursor-pointer"
              >
                RETURN TO MENU
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS & FOOTER */}
        <div className="relative z-20 pb-4 px-6 flex items-center justify-between text-[11px] font-mono text-zinc-400 border-t border-zinc-900 pt-2">
          <span>PORTRAIT 9:16</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = !muted;
              sound.setMuted(next);
              setMuted(next);
            }}
            className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{muted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>
          <span className={gameMode === 'WEIRD' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {gameMode === 'WEIRD' ? 'WEIRD (24)' : 'CRAZY (50)'}
          </span>
        </div>
      </div>

      {/* TIKTOK MINI REWARDED AD MODAL */}
      <TikTokAdModal
        isOpen={isAdModalOpen}
        onReward={executeRevive}
        onClose={() => setIsAdModalOpen(false)}
        reviveStageNumber={stage}
        gameMode={gameMode}
      />
    </div>
  );
}
