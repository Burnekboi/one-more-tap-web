import React, { useState, useEffect, useRef } from 'react';
import { tikTokAds } from '../utils/tiktokAds';
import { sound } from '../utils/audio';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Flame,
  ShieldCheck,
} from 'lucide-react';

interface TikTokAdModalProps {
  isOpen: boolean;
  onReward: () => void;
  onClose: () => void;
  reviveStageNumber: number;
  gameMode: 'WEIRD' | 'CRAZY';
}

export const TikTokAdModal: React.FC<TikTokAdModalProps> = ({
  isOpen,
  onReward,
  onClose,
  reviveStageNumber,
  gameMode,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(5);
      setCanClaim(false);
      setShowSkipConfirm(false);
      setClaimed(false);
      tikTokAds.recordImpression();

      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setCanClaim(true);
            sound.playMilestone();
            return 0;
          }
          sound.playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (claimed) return;
    setClaimed(true);
    tikTokAds.recordReviveGranted();
    sound.playRevive();
    setTimeout(() => {
      onReward();
    }, 250);
  };

  const handleCloseAttempt = () => {
    if (canClaim) {
      onClose();
    } else {
      setShowSkipConfirm(true);
    }
  };

  const confirmSkip = () => {
    setShowSkipConfirm(false);
    onClose();
  };

  const cancelSkip = () => {
    setShowSkipConfirm(false);
  };

  const progressPercent = Math.min(100, Math.max(0, ((5 - secondsRemaining) / 5) * 100));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full max-w-[340px] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* TIKTOK MINI HEADER BAR */}
        <div className="bg-zinc-900/95 border-b border-zinc-800 px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* TikTok Icon & Mini Badge */}
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center border border-zinc-700 shadow-sm relative overflow-hidden">
              <span className="text-[12px] font-black text-[#00f2fe]">d</span>
              <span className="text-[12px] font-black text-[#fe2c55] absolute left-[7px]">d</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold tracking-wide text-white">
                  TikTok Mini Game
                </span>
                <span className="text-[8px] font-mono uppercase bg-[#fe2c55]/20 text-[#fe2c55] border border-[#fe2c55]/40 px-1 py-0.2 rounded font-bold">
                  Ads
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 block leading-tight">
                Slot: {tikTokAds.getAdUnitId()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mute Toggle */}
            <button
              onClick={() => setMuted(!muted)}
              className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Close / Skip button */}
            <button
              onClick={handleCloseAttempt}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-zinc-800"
              title="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-1 bg-zinc-800 relative">
          <div
            className="h-full bg-gradient-to-r from-[#00f2fe] via-emerald-400 to-[#fe2c55] transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* SIMULATED AD CONTENT CANVAS */}
        <div className="relative aspect-[9/13] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-4 flex flex-col justify-between overflow-hidden">
          {/* Animated Background Ambience */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#fe2c55]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Top Status & Countdown */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full border border-zinc-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Sponsor
            </span>

            {canClaim ? (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-full animate-bounce">
                REWARD READY!
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/70 border border-zinc-800 px-2.5 py-0.5 rounded-full">
                Reward in {secondsRemaining}s
              </span>
            )}
          </div>

          {/* Center Showcase Graphic */}
          <div className="relative z-10 my-auto text-center flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00f2fe] via-purple-600 to-[#fe2c55] p-[2px] shadow-lg shadow-purple-500/25 animate-pulse">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex flex-col items-center justify-center">
                  <Flame className="w-8 h-8 text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-mono font-black text-zinc-300 tracking-tighter">
                    REFLEX MAX
                  </span>
                </div>
              </div>
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider bg-[#fe2c55] text-white rounded-full shadow-md">
                HOT
              </span>
            </div>

            <h4 className="text-sm font-black text-white tracking-tight leading-tight">
              One More Tap: Arcade Edition
            </h4>
            <p className="text-[11px] text-zinc-400 max-w-[220px] mt-1 leading-relaxed">
              Watch this 5-second sponsor showcase to resurrect immediately at{' '}
              <strong className="text-cyan-400">Stage {reviveStageNumber}</strong>!
            </p>

            {/* Quick Test Skip for Dev Testing */}
            {!canClaim && (
              <button
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setSecondsRemaining(0);
                  setCanClaim(true);
                  sound.playMilestone();
                }}
                className="mt-3 text-[9px] font-mono text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
              >
                [⚡ Skip to Reward (Dev Test)]
              </button>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="relative z-10 pt-2">
            {canClaim ? (
              <button
                id="claim-revive-btn"
                onClick={handleClaim}
                className="w-full py-3 bg-gradient-to-r from-[#00f2fe] via-emerald-400 to-[#00f2fe] hover:brightness-110 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-400/30 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer animate-pulse"
              >
                <Zap className="w-4 h-4 fill-black" />
                CLAIM REVIVE & RESUME STAGE {reviveStageNumber}
              </button>
            ) : (
              <div className="w-full py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-center">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Playing ad... Reward unlocks in {secondsRemaining}s
                </span>
              </div>
            )}

            <span className="block text-[8px] font-mono text-zinc-400 text-center mt-2">
              TikTok Mini Ads Engine • High-eCPM Rewarded Video Slot
            </span>
          </div>

          {/* SKIP WARNING DIALOG OVERLAY */}
          {showSkipConfirm && (
            <div className="absolute inset-0 z-30 bg-black/95 p-5 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-950/80 border border-amber-600 flex items-center justify-center mb-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h5 className="text-sm font-bold text-white mb-1">Skip Rewarded Ad?</h5>
              <p className="text-[11px] text-zinc-400 max-w-[200px] mb-4 leading-relaxed">
                If you close now, you will lose your chance to revive at Stage {reviveStageNumber}!
              </p>
              <div className="flex flex-col gap-2 w-full max-w-[200px]">
                <button
                  onClick={cancelSkip}
                  className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs rounded-xl cursor-pointer"
                >
                  Continue Watching ({secondsRemaining}s)
                </button>
                <button
                  onClick={confirmSkip}
                  className="w-full py-1.5 text-xs text-zinc-500 hover:text-red-400 cursor-pointer"
                >
                  Skip Anyway (No Revive)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
