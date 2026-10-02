import { TabType } from '../types';
import { LayoutDashboard, Gamepad2, BookOpen, Sliders, Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { useState } from 'react';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  bestScore: number;
}

export function Navbar({ activeTab, onSelectTab, bestScore }: NavbarProps) {
  const [muted, setMuted] = useState(sound.isMuted());

  const toggleSound = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) sound.playButton();
  };

  const navItems: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Studio Dashboard', icon: LayoutDashboard },
    { id: 'prototype', label: 'Playable Simulator', icon: Gamepad2 },
    { id: 'docs', label: 'App Documentation (50 Sections)', icon: BookOpen },
    { id: 'tuning', label: 'Balance Studio', icon: Sliders },
    { id: 'legal', label: 'TikTok & Legal', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-black font-black text-lg select-none">
              ●
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-white text-base">ONE MORE TAP</span>
                <span className="text-[10px] font-mono uppercase bg-cyan-950/90 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                  Cocos + TikTok V1
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">Hyper-Casual Arcade Engine &amp; Design Portal</p>
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-sound-toggle-btn"
              onClick={toggleSound}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              title={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800/80 overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  sound.playButton();
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/25 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side widgets: Best Score & Mute */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 rounded-lg border border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">Your Best</span>
            <span className="text-sm font-black font-mono text-cyan-400">
              {bestScore.toLocaleString()}
            </span>
          </div>

          <button
            id="desktop-sound-toggle-btn"
            onClick={toggleSound}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={muted ? 'Unmute Synthetic SFX' : 'Mute Synthetic SFX'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
