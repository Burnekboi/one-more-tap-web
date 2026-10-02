import React, { useState } from 'react';
import { X, FolderArchive, Play, Layers, ExternalLink, Check, Copy, Sparkles, Terminal } from 'lucide-react';
import { sound } from '../utils/audio';

interface CocosExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CocosExportModal({ isOpen, onClose }: CocosExportModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    sound.playTap();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Cocos Creator Ready Project
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  v3.8+ Auto-Boot
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Directly open, preview immediately, and 1-click build for TikTok Minis
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Status banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200 leading-relaxed">
              <strong className="text-white block text-sm font-semibold mb-1">
                Zero Manual Setup Required in Cocos Creator
              </strong>
              The project includes the pre-configured <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">assets/Main.scene</code> and autonomous <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">GameManager.ts</code>. You do not need to create nodes, configure resolutions, or build camera hierarchies.
            </div>
          </div>

          {/* 3 Simple Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              How to Open &amp; Build:
            </h3>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Open in Cocos Dashboard</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Open Cocos Dashboard &rarr; click <strong>Add</strong> &rarr; select this repository root folder &rarr; open with Cocos Creator <strong>3.8.x</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">Click Preview (Play Button)</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Click the <strong>Play</strong> button in the top toolbar. The game launches immediately with Weird Mode (24 stages), Crazy Mode (50 stages), and continuous 10s timer bank.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">1-Click Build for TikTok / ByteDance Mini Game</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Top menu: <strong>Project &rarr; Build</strong>. The profile is already set to <strong>ByteDance Mini Game</strong>. Click <strong>Build</strong> to output to <code className="text-rose-300">build/bytedance-mini-game</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Project Structure Snapshot */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
              <span className="flex items-center gap-1.5">
                <FolderArchive className="w-3.5 h-3.5 text-yellow-400" />
                Cocos Creator Project Manifest
              </span>
              <span className="text-emerald-400">All Files Present &amp; Validated</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-300 space-y-1 bg-black/40 p-2.5 rounded-lg border border-zinc-800">
              <div>📁 <strong>assets/</strong> &rarr; <span className="text-cyan-400">Main.scene</span> (configured start scene)</div>
              <div>📁 <strong>assets/scripts/</strong> &rarr; <span className="text-cyan-400">GameManager.ts</span> (autonomous game engine)</div>
              <div>📁 <strong>settings/</strong> &rarr; <span className="text-cyan-400">project.json</span> (720x1280 portrait resolution)</div>
              <div>📁 <strong>profiles/v2/packages/</strong> &rarr; <span className="text-cyan-400">builder.json</span> (ByteDance Mini Game build profile)</div>
              <div>📁 <strong>build-templates/</strong> &rarr; <span className="text-cyan-400">game.json, project.config.json</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            One More Tap • TikTok &amp; Cocos Creator 3.8
          </span>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
