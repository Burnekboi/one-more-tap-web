# ONE MORE TAP — Cocos Creator 3.8 Native Mini Game Project

A complete, ready-to-run 10-second reflex gauntlet targeting **ByteDance / TikTok Mini Game** runtime and **Cocos Creator 3.8.8** editor.

Designed for portrait orientation (720x1280) with full dynamic scene-graph bootstrapping. Zero manual node wiring or asset inspector dragging required.

---

## ⚡ Run it (2 clicks)

1. Open **Cocos Creator 3.8.8**.
2. Click **Open Project**, select this root repository folder (`one_more_tap`), and click **Preview** (Browser or Simulator).

The project will boot into `Main.scene`, configure the design resolution (`720x1280`, `SHOW_ALL`), construct the complete HUD and screen state machine, and let you play both **WEIRD MODE** (24 Stages) and **CRAZY MODE** (50 Stages) immediately.

---

## 📁 Project Structure

```
assets/
├── Main.scene               # Minimalist entry scene container (UUID: 4c0d371f-6eba-4feb-acc8-1abf1ce5af65)
├── scripts/
│   ├── GameRoot.ts          # Core orchestrator: builds entire UI & stage runtime
│   ├── GameManager.ts       # Backward-compatible scene component hook
│   ├── core/
│   │   ├── MathUtil.ts      # Coordinate transforms & math helpers
│   │   ├── Music.ts         # Zero-asset synthetic Web Audio / TikTok audio synthesizer
│   │   ├── SaveManager.ts   # Unified storage for records and achievements
│   │   ├── ctx.ts           # Game runtime context definition
│   │   ├── flow.ts          # Continuous 10s timer bank & scoring calculations
│   │   └── platform.ts      # TikTok SDK (tt.createRewardedVideoAd / tt.getStorageSync) & browser shim
│   ├── entities/
│   │   ├── Target.ts        # Interactive circles, multi-tap, shrinking, and shy targets
│   │   ├── TimerBar.ts      # Dynamic 10s countdown bar with warning colors
│   │   └── Particle.ts      # Tap burst particle emitter
│   ├── challenges/
│   │   ├── weirdStages.ts   # Full 24 Weird Mode stage definitions
│   │   ├── challenges.ts    # Full 50 Crazy Mode stage definitions
│   │   └── dailySeed.ts     # Deterministic PRNG seed generator
│   └── template/
│       ├── constants.ts     # Resolution, scores, and stage progression lists
│       ├── models.ts        # Interfaces and TypeScript models
│       └── achievements.ts  # Trophies and unlock criteria
settings/
└── project.json             # Design resolution: 720x1280 portrait, start scene configured
```

### 🛠️ Cocos Meta & Scene Synchronization

To scan all assets, enforce Cocos Creator 3.8.8 schema compliance, and keep `settings/project.json` synchronized with `Main.scene`:

```bash
npm run sync-meta
# or
node sync-metas.cjs
```

---

## 🎮 Game Rules & Mechanics

- **Continuous 10s Timer Bank**: You start with 10.0 seconds. The clock runs continuously across stages.
- **Time Rewards**: Each successful stage grants **+1.5s** (or **+2.0s** on streaks of 5+). Total bank is capped at 10.0s.
- **Score Calculation**: `Score = 10 + (Combo * 5)`.
- **WEIRD MODE (24 Stages)**: Accessible reflex puzzles featuring color discs and numbers without textual distractions.
- **CRAZY MODE (50 Stages)**: High-speed gauntlet featuring Stroop effect, moving targets, reverse psychology, and meme challenges.
- **TikTok Mini Rewarded Ad Revive**: Watch a ByteDance rewarded video ad to restore the timer bank to 10.0s and continue from the exact stage where you failed.

---

## 📦 Build for TikTok Mini Game

1. In Cocos Creator, go to **Project** → **Build**.
2. Select **ByteDance Mini Game** as the platform.
3. Set orientation to **Portrait** (`720x1280`).
4. Click **Build**, then import the output directory into **ByteDance DevTools** (`字节跳动开发者工具`) to preview and publish.
