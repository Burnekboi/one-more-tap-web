import React, { useState } from 'react';
import { PlayerData, Achievement, TabType, GameMode } from '../types';
import { sound } from '../utils/audio';
import {
  Trophy,
  Flame,
  MousePointer,
  RotateCcw,
  Zap,
  Gamepad2,
  CircleDot,
  Lock,
  Play,
  Award,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layers,
} from 'lucide-react';
import { TikTokAdModal } from './TikTokAdModal';
import { CocosExportModal } from './CocosExportModal';
import { tikTokAds } from '../utils/tiktokAds';

interface DashboardViewProps {
  playerData: PlayerData;
  achievements: Achievement[];
  checklist?: any[];
  onToggleChecklistItem?: (catIndex: number, itemIndex: number) => void;
  onSelectTab: (tab: TabType) => void;
  onLaunchMode?: (mode: GameMode) => void;
}

export function DashboardView({
  playerData,
  achievements,
  onSelectTab,
  onLaunchMode,
}: DashboardViewProps) {
  const [testAdOpen, setTestAdOpen] = useState<boolean>(false);
  const [cocosModalOpen, setCocosModalOpen] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(sound.isMuted());

  const handleLaunch = (mode: GameMode) => {
    sound.playButton();
    if (onLaunchMode) {
      onLaunchMode(mode);
    } else {
      onSelectTab('prototype');
    }
  };

  const toggleSound = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) sound.playButton();
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Top Header with Quick Player Stats */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-800/80 px-2.5 py-0.5 rounded-full">
                TikTok Mini Game
              </span>
              <span className="text-xs font-mono text-zinc-400">Version 1.0.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ONE MORE TAP
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Select a game mode below or review your unlocked achievement trophies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                sound.playTap();
                setCocosModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border border-emerald-700/80 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cocos Creator Project Guide"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Cocos Project
            </button>
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={() => setTestAdOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-[#fe2c55] fill-current" />
              Test Ad Revive
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-800/80">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Weird Best</span>
              <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {playerData.bestScoreWeird || 0}
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Crazy Best</span>
              <Zap className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-2xl font-black font-mono text-white">
              {playerData.bestScoreCrazy || playerData.bestScore || 0}
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Peak Combo</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400">
              x{playerData.highestCombo}
            </div>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Lifetime Taps</span>
              <MousePointer className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-400">
              {playerData.totalTaps.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Game Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WEIRD MODE (Easy) Card */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border-2 border-emerald-800/80 hover:border-emerald-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
                Easy Mode • 24 Stages
              </span>
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                Record: <strong className="text-white">{playerData.bestScoreWeird || 0}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-black text-white flex items-center gap-2.5 mt-2">
              <CircleDot className="w-6 h-6 text-emerald-400" />
              WEIRD MODE
            </h2>

            <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed">
              24 quickfire stages featuring pure <strong className="text-emerald-300">circle colors</strong> and numbers with zero text hints. Fast, accessible reflex flow.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-zinc-950/70 border border-emerald-900/40 text-xs text-zinc-400 flex items-center justify-between">
              <span>Stage Cap: <strong>24 Stages</strong></span>
              <span className="text-emerald-400 font-bold">10s Continuous Timer</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800">
            <button
              id="dashboard-play-weird-btn"
              onClick={() => handleLaunch('WEIRD')}
              className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-black font-black text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-emerald-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4" />
              Play WEIRD MODE
            </button>
          </div>
        </div>

        {/* CRAZY MODE (Hard) Card */}
        <div className="bg-gradient-to-br from-rose-950/40 via-zinc-900 to-zinc-900 border-2 border-rose-800/80 hover:border-rose-500 rounded-2xl p-6 flex flex-col justify-between shadow-xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                playerData.weirdModeCleared
                  ? 'text-rose-400 bg-rose-950 border-rose-800'
                  : 'text-amber-400 bg-amber-950/80 border-amber-800'
              }`}>
                {playerData.weirdModeCleared ? 'Hard Mode • 50 Stages' : '🔒 Locked (Clear Weird First)'}
              </span>
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                Record: <strong className="text-white">{playerData.bestScoreCrazy || playerData.bestScore || 0}</strong>
              </span>
            </div>

            <h2 className="text-2xl font-black text-white flex items-center gap-2.5 mt-2">
              <Zap className="w-6 h-6 text-rose-400" />
              CRAZY MODE
            </h2>

            <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed">
              The full 50-stage gauntlet! High stakes Stroop challenges, reverse psychology, moving hazards, and meme reflexes with continuous 10s timer bank.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-zinc-950/70 border border-rose-900/40 text-xs text-zinc-400 flex items-center justify-between">
              <span>Stage Cap: <strong>50 Stages</strong></span>
              <span className="text-rose-400 font-bold">5 Difficulty Tiers</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800">
            <button
              id="dashboard-play-crazy-btn"
              onClick={() => {
                if (!playerData.weirdModeCleared) {
                  sound.playMiss();
                  handleLaunch('WEIRD');
                  return;
                }
                handleLaunch('CRAZY');
              }}
              className={`w-full py-3.5 font-black text-sm tracking-wider uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                playerData.weirdModeCleared
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
              }`}
            >
              {playerData.weirdModeCleared ? (
                <>
                  <Zap className="w-4 h-4" />
                  Play CRAZY MODE
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  Clear Weird Mode to Unlock
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS SECTION */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Achievements &amp; Medals</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Earn trophies through reflex precision, combo streaks, and mode completions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-white">
              {unlockedCount} / {achievements.length} Unlocked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlocked;
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-zinc-950/90 border-yellow-500/50 shadow-md shadow-yellow-500/5'
                    : 'bg-zinc-950/40 border-zinc-800/80 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isUnlocked
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}>
                      {isUnlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isUnlocked
                        ? 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                        : 'bg-zinc-900 text-zinc-500'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold ${isUnlocked ? 'text-white' : 'text-zinc-400'}`}>
                    {ach.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {ach.maxProgress && ach.maxProgress > 1 && (
                  <div className="mt-3 pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                      <span>Progress</span>
                      <span>{ach.progress || 0} / {ach.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isUnlocked ? 'bg-yellow-400' : 'bg-cyan-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round(((ach.progress || 0) / ach.maxProgress) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* TIKTOK MINI AD MODAL */}
      <TikTokAdModal
        isOpen={testAdOpen}
        onReward={() => {
          setTestAdOpen(false);
          sound.playPerfect();
        }}
        onClose={() => setTestAdOpen(false)}
        reviveStageNumber={1}
        gameMode="WEIRD"
      />

      {/* COCOS CREATOR PROJECT MODAL */}
      <CocosExportModal
        isOpen={cocosModalOpen}
        onClose={() => setCocosModalOpen(false)}
      />
    </div>
  );
}
