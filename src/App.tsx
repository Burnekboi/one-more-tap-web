import React, { useState, useEffect } from 'react';
import { TabType, PlayerData, Achievement, ChecklistCategory, GameMode } from './types';
import { INITIAL_ACHIEVEMENTS, INITIAL_CHECKLIST } from './data/gameConstants';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GameSimulator } from './components/GameSimulator';
import { DocumentationView } from './components/DocumentationView';
import { BalanceStudioView } from './components/BalanceStudioView';
import { TikTokLegalView } from './components/TikTokLegalView';

const STORAGE_KEY = 'one_more_tap_save_v1';
const CHECKLIST_STORAGE_KEY = 'one_more_tap_dod_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('WEIRD');

  // Load persistent player data (Section 16 & 41 SaveManager)
  const [playerData, setPlayerData] = useState<PlayerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          bestScore: typeof parsed.bestScore === 'number' ? parsed.bestScore : 782,
          bestScoreWeird: typeof parsed.bestScoreWeird === 'number' ? parsed.bestScoreWeird : 0,
          bestScoreCrazy: typeof parsed.bestScoreCrazy === 'number' ? parsed.bestScoreCrazy : (parsed.bestScore || 782),
          weirdModeCleared: Boolean(parsed.weirdModeCleared),
          totalRuns: typeof parsed.totalRuns === 'number' ? parsed.totalRuns : 42,
          totalTaps: typeof parsed.totalTaps === 'number' ? parsed.totalTaps : 640,
          highestCombo: typeof parsed.highestCombo === 'number' ? parsed.highestCombo : 17,
          achievements: Array.isArray(parsed.achievements) ? parsed.achievements : ['first_tap', 'getting_started'],
          dailyBestScore: typeof parsed.dailyBestScore === 'number' ? parsed.dailyBestScore : 1284,
          lastDailyDate: parsed.lastDailyDate || '',
        };
      }
    } catch {
      // ignore
    }
    return {
      bestScore: 782,
      bestScoreWeird: 0,
      bestScoreCrazy: 782,
      weirdModeCleared: false,
      totalRuns: 42,
      totalTaps: 640,
      highestCombo: 17,
      achievements: ['first_tap', 'getting_started'],
      dailyBestScore: 1284,
      lastDailyDate: '',
    };
  });

  // Load persistent Definition of Done checklist (Section 45)
  const [checklist, setChecklist] = useState<ChecklistCategory[]>(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_CHECKLIST;
  });

  // Calculate achievements with unlock status
  const achievements: Achievement[] = INITIAL_ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked: playerData.achievements.includes(a.id),
  }));

  // Save changes to localStorage
  const handleUpdatePlayerData = (data: Partial<PlayerData>) => {
    setPlayerData((prev) => {
      const next = { ...prev, ...data };

      // Check achievements (Section 19)
      const nextAch = [...next.achievements];
      if (next.totalTaps >= 1 && !nextAch.includes('first_tap')) nextAch.push('first_tap');
      if (next.bestScore >= 50 && !nextAch.includes('getting_started')) nextAch.push('getting_started');
      if (next.totalTaps >= 100 && !nextAch.includes('tap_master')) nextAch.push('tap_master');
      if (next.highestCombo >= 25 && !nextAch.includes('combo_king')) nextAch.push('combo_king');
      if (next.highestCombo >= 50 && !nextAch.includes('insane')) nextAch.push('insane');
      if (next.totalRuns >= 10 && !nextAch.includes('one_more')) nextAch.push('one_more');
      if (next.totalTaps >= 15 && !nextAch.includes('peeve_slayer')) nextAch.push('peeve_slayer');
      if (next.totalTaps >= 25 && !nextAch.includes('aura_god')) nextAch.push('aura_god');
      if (next.totalTaps >= 35 && !nextAch.includes('battery_saver')) nextAch.push('battery_saver');
      if (next.totalTaps >= 45 && !nextAch.includes('no_cap_king')) nextAch.push('no_cap_king');
      if (next.totalTaps >= 60 && !nextAch.includes('night_hydrator')) nextAch.push('night_hydrator');
      if (next.highestCombo >= 15 && !nextAch.includes('brain_master')) nextAch.push('brain_master');
      if (next.highestCombo >= 20 && !nextAch.includes('untouchable')) nextAch.push('untouchable');
      if (next.totalRuns >= 3 && !nextAch.includes('iron_will')) nextAch.push('iron_will');
      next.achievements = nextAch;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleChecklistItem = (catIndex: number, itemIndex: number) => {
    setChecklist((prev) => {
      const next = prev.map((cat, cIdx) => {
        if (cIdx !== catIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item, iIdx) => {
            if (iIdx !== itemIndex) return item;
            return { ...item, checked: !item.checked };
          }),
        };
      });
      try {
        localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        bestScore={playerData.bestScore}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            playerData={playerData}
            achievements={achievements}
            checklist={checklist}
            onToggleChecklistItem={handleToggleChecklistItem}
            onSelectTab={setActiveTab}
            onLaunchMode={(mode) => {
              setSelectedGameMode(mode);
              setActiveTab('prototype');
            }}
          />
        )}

        {activeTab === 'prototype' && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-4 max-w-md">
              <span className={`text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                selectedGameMode === 'WEIRD'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-rose-950/80 text-rose-300 border-rose-800/80'
              }`}>
                {selectedGameMode === 'WEIRD' ? 'WEIRD MODE (EASY) • 24 STAGES' : 'CRAZY MODE (HARD) • 50 STAGES'}
              </span>
              <h2 className="text-xl font-black text-white mt-2">
                Live Prototype Simulator
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                {selectedGameMode === 'WEIRD'
                  ? '24 stages of pure circle colors using the 24 core mechanics. Easy reflex flow!'
                  : '50-stage non-repeating gauntlet from Easy to Insane. Continuous 10s timer bank: +3s per clear!'}
              </p>
            </div>

            <GameSimulator
              playerData={playerData}
              onUpdatePlayerData={handleUpdatePlayerData}
              initialMode={selectedGameMode}
              onModeChange={setSelectedGameMode}
            />
          </div>
        )}

        {activeTab === 'docs' && <DocumentationView />}

        {activeTab === 'tuning' && <BalanceStudioView />}

        {activeTab === 'legal' && (
          <TikTokLegalView onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Footer with Creed from Section 49 */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 lg:px-8 mt-auto text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-xs font-mono text-cyan-400 font-bold tracking-wide">
            &ldquo;ONE MORE TAP must be easy to learn, satisfying to play, difficult to master, and fast enough that the player can restart before they have time to get bored.&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-cyan-400 transition-colors cursor-pointer underline underline-offset-4"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-cyan-400 transition-colors cursor-pointer underline underline-offset-4"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('legal')}
              className="hover:text-cyan-400 transition-colors cursor-pointer underline underline-offset-4"
            >
              TikTok Developer Setup
            </button>
            <span>•</span>
            <span className="text-zinc-500 font-mono">Contact: niconan.shaun1128@gmail.com</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            TikTok Mini Games Specification • Cocos Creator + TypeScript Architecture • Client-Side V1
          </p>
        </div>
      </footer>
    </div>
  );
}
