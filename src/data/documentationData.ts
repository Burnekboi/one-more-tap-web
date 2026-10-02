import { DocumentationSection } from '../types';

export const DOCUMENTATION_SECTIONS: DocumentationSection[] = [
  {
    id: 1,
    title: "1. Core Game Concept",
    category: "Overview",
    summary: "ONE MORE TAP is a fast reaction game where the player completes increasingly difficult tap challenges.",
    content: `ONE MORE TAP is a fast reaction game where the player completes increasingly difficult tap challenges.

The player starts with very simple tasks.

As the run continues:
- Targets become smaller.
- Targets move.
- Reaction windows become shorter.
- Patterns become more complicated.
- Challenges become faster.
- Special challenges appear.

Eventually the player makes a mistake and the run ends.

The main psychological loop is:
"I'M SO CLOSE TO MY BEST SCORE. ONE MORE TRY."

The game should be extremely easy to understand but increasingly difficult to master.`,
    tags: ["concept", "core loop", "psychological loop", "reaction"]
  },
  {
    id: 2,
    title: "2. Design Philosophy",
    category: "Overview",
    summary: "Six cardinal rules: Simple, Fast, Satisfying, Difficult but Fair, Replayable, and Lightweight.",
    content: `Follow these rules throughout development:

RULE #1 — SIMPLE
The player should understand the game within approximately 3 seconds.

RULE #2 — FAST
There should be almost no downtime between challenges.

RULE #3 — SATISFYING
Every successful tap should feel rewarding through animation, sound, score feedback, combo feedback and particles.

RULE #4 — DIFFICULT BUT FAIR
The player should understand why they failed.

RULE #5 — REPLAYABLE
After Game Over, the player should immediately want to press TRY AGAIN.

RULE #6 — LIGHTWEIGHT
Avoid unnecessary systems that increase loading time, memory usage or platform compatibility problems.`,
    tags: ["philosophy", "rules", "satisfying", "fast", "simple"]
  },
  {
    id: 3,
    title: "3. Main Game Flow",
    category: "Gameplay",
    summary: "START -> Main Menu -> Play / Daily / Achievements -> Challenge Loop -> Success or Game Over -> Results.",
    content: `START
  |
  v
MAIN MENU
  |
  +-- Play
  |
  +-- Daily Challenge
  |
  +-- Achievements
          |
          v
      GAME START
          |
          v
      CHALLENGE
          |
          v
       SUCCESS
          |
          v
      SCORE +10
      COMBO +1
          |
          v
    NEXT CHALLENGE
          |
          +----------------+
          |                |
       SUCCESS            FAIL
          |                |
          v                v
      Continue          GAME OVER
                           |
                           v
                        RESULTS
                           |
              +------------+------------+
              |                         |
              v                         v
           RETRY                      MENU`,
    tags: ["flow", "loop", "menu", "state machine"]
  },
  {
    id: 4,
    title: "4. Main Menu",
    category: "Gameplay",
    summary: "Keep the main menu extremely clean: ONE MORE TAP title, Your Best score, dominant PLAY button, Daily, Achievements.",
    content: `Keep the main menu extremely clean.

Suggested structure:
              ONE MORE TAP

               YOUR BEST
                  782

            [    PLAY    ]

             DAILY CHALLENGE
             ACHIEVEMENTS

The PLAY button should be the dominant element.
Do not overload the first screen.`,
    tags: ["menu", "ui", "clean", "play button"]
  },
  {
    id: 5,
    title: "5. Game Screen",
    category: "Gameplay",
    summary: "Layout with Score, Combo x17, and central safe gameplay target area.",
    content: `Suggested layout:

+-----------------------------+
|                             |
|           SCORE             |
|            247              |
|                             |
|          COMBO x17          |
|                             |
|                             |
|              ●              |
|                             |
|                             |
|                             |
+-----------------------------+

The target should generally occupy the central gameplay area.
Keep important UI away from the active target area.`,
    tags: ["game screen", "layout", "safe area", "hud"]
  },
  {
    id: 6,
    title: "6. Game State",
    category: "Architecture",
    summary: "Central game state system with strictly one active state at a time: MENU, COUNTDOWN, PLAYING, PAUSED, GAME_OVER.",
    content: `Create a central game state system. Only one state should be active at a time.`,
    codeSnippet: `enum GameState {
    MENU,
    COUNTDOWN,
    PLAYING,
    PAUSED,
    GAME_OVER
}`,
    tags: ["game state", "enum", "architecture"]
  },
  {
    id: 7,
    title: "7. Challenge System (Expanded: 15 Types)",
    category: "Gameplay",
    summary: "ChallengeManager.ts with 15 core V1 challenge types, featuring hilarious psychological tricks, brain teasers, Pet Peeves, and tricky traps.",
    content: `This is the most important system in the game.

Create: ChallengeManager.ts
The manager determines what challenge the player needs to complete.
The game features 15 diverse, entertaining, and tricky challenge types combining arcade reflexes with psychological humor:

--- CORE REFLEX MECHANICS ---
CHALLENGE 1 — TAP TARGET
"TAP THE CIRCLE" - A simple target appears, player taps it.

CHALLENGE 2 — COLOR TARGET
"TAP GREEN" - Display multiple colored targets: RED, GREEN, BLUE. Only the correct color should be tapped.

CHALLENGE 3 — DON'T TAP
"TAP BLUE" - BLUE, RED. Red is dangerous! Player must avoid dangerous decoys.

CHALLENGE 4 — MOVING TARGET
The target bounces around the safe gameplay area. Player taps before time expires.

CHALLENGE 5 — SHRINKING TARGET
Target starts large and continuously shrinks down. Player taps before it vanishes.

CHALLENGE 6 — MULTI TAP
"TAP x3" - Player must tap the target 3 times within a rapid time window.

CHALLENGE 7 — SEQUENCE
"1 -> 2 -> 3" - Player must tap targets in the strict numerical order.

CHALLENGE 8 — REACTION
Display: WAIT... Then suddenly: TAP! Tapping early is a premature failure.

--- TRICKY & HILARIOUS PSYCHOLOGICAL MECHANICS ---
CHALLENGE 9 — PET PEEVE / HUMOR SLAP
Targets are labeled with relatable everyday annoyances vs beloved things:
e.g. "SLAP YOUR PET PEEVE!": [COLD COFFEE] vs [WARM BED] vs [MY DOGGO]
"DELETE THE NUISANCE!": [UNSKIPPABLE AD] vs [TASTY PIZZA]
"ANNIHILATE MONDAY!": [6AM ALARM] vs [3PM FRIDAY]
Entertaining witty answers make every tap hilarious and emotionally satisfying!

CHALLENGE 10 — THE STROOP LIAR (BRAIN MELT)
Cognitive conflict test. Word text says "RED", but ink font color is BRIGHT BLUE!
Instruction: "TAP INK COLOR (NOT THE WORD!)" or "TAP WORD (NOT COLOR!)".
Forces rapid brain rewiring under strict time pressure!

CHALLENGE 11 — REVERSE PSYCHOLOGY ("DO NOT TOUCH")
A flashing red button screams: "DO NOT PRESS!".
The timer ticks down. If you do nothing, you survive! But wait... at 0.3s it might flip to: "PSYCH! PRESS NOW!".

CHALLENGE 12 — SUS IMPOSTOR (ODD ONE OUT)
4 quick items appear: e.g. 🐱 🐱 🐶 🐱 -> "TAP THE BARKER!", or 🍕 🍔 🥦 🍟 -> "DESTROY THE VEGETABLE!".
Spot the odd one out in under 1.2 seconds.

CHALLENGE 13 — OPPOSITE DAY (BRAIN INVERSION)
Screen flashes in glitch retro styling:
"OPPOSITE DAY: TAP LEFT!" -> Player must tap RIGHT!
"OPPOSITE DAY: DO NOT TAP!" -> Player MUST tap!

CHALLENGE 14 — QUICK MAFS (1+1 PANIC)
Super-fast kindergarten arithmetic with hilarious answers:
e.g. "2 + 2 = ?" [4] [22] [MY BRAIN HURTS]
"7 - 3 = ?" [4] [0] [42]

CHALLENGE 15 — SHY TELEPORTER (FEINT JUMP)
Target dodges away the instant the player approaches, then stays vulnerable on its second position for a split-second catch!`,
    tags: ["challenges", "15 types", "gameplay", "mechanics", "funny", "pet peeve", "stroop"]
  },
  {
    id: 8,
    title: "8. Difficulty System",
    category: "Systems",
    summary: "DifficultyManager.ts scaling across 6 score ranges: Very Easy (0-10) to Extreme (201+).",
    content: `Create: DifficultyManager.ts
Difficulty should increase gradually.

Suggested score ranges:
0–10       Very Easy
11–25      Easy
26–50      Medium
51–100     Hard
101–200    Very Hard
201+       Extreme

Do not increase every difficulty parameter simultaneously.
Gradually modify:
- Target size
- Target speed
- Reaction time
- Number of objects
- Challenge complexity
- Spawn distance
- Animation duration

Difficulty should feel smooth rather than suddenly unfair.`,
    tags: ["difficulty", "progression", "scaling", "balance"]
  },
  {
    id: 9,
    title: "9. Fairness / Validation",
    category: "Systems",
    summary: "NEVER create an impossible challenge. Rigorous validateChallenge() guardrails to preserve player trust.",
    content: `NEVER create an impossible challenge.

Examples of invalid situations:
- Target appears outside the safe screen area.
- Target is visible for an impossible amount of time.
- Random targets overlap in an impossible configuration.
- Instructions contradict the generated target.
- Sequence generates impossible ordering.
- Target becomes inaccessible because of UI placement.

Create validation logic such as:
validateChallenge(): boolean

If validation fails:
- Discard the generated challenge.
- Generate another challenge.

The player should feel: "I lost because I made a mistake." NOT: "The game cheated me."`,
    tags: ["fairness", "validation", "anti-cheat", "quality"]
  },
  {
    id: 10,
    title: "10. Score System",
    category: "Systems",
    summary: "Base successful challenge: +10 points. Score += baseScore * comboMultiplier.",
    content: `Keep scoring simple in V1.

Base successful challenge:
+10 points

Combo can increase the effective score:
score += baseScore * comboMultiplier

Do not make numbers increase excessively quickly.
The score should remain understandable.`,
    tags: ["score", "math", "multiplier"]
  },
  {
    id: 11,
    title: "11. Combo System",
    category: "Systems",
    summary: "Consecutive successes increment combo. Milestones: NICE (5), GREAT (10), PERFECT (25), INSANE (50).",
    content: `Every consecutive successful challenge increases combo: x1, x2, x3, x4...

Milestone feedback:
- 5 combo: "NICE"
- 10 combo: "GREAT"
- 25 combo: "PERFECT"
- 50 combo: "INSANE"

Combo feedback should use:
- Scale animation
- Particle burst
- Sound
- Small screen pulse

Do not let effects obscure the gameplay target.`,
    tags: ["combo", "milestones", "feedback", "juice"]
  },
  {
    id: 12,
    title: "12. Perfect Tap System",
    category: "Systems",
    summary: "Timing classification (NORMAL, PERFECT, MISS). Perfect taps award bonus feedback and +20 points.",
    content: `Add timing classification:`,
    codeSnippet: `enum TapResult {
    NORMAL,
    PERFECT,
    MISS
}

// Perfect taps give stronger visual/audio feedback:
// PERFECT! +20
// This gives skilled players another reason to replay.`,
    tags: ["perfect tap", "timing", "skill"]
  },
  {
    id: 13,
    title: "13. Game Over Screen",
    category: "Gameplay",
    summary: "Fast Game Over screen showing score, best score, [X] TO GO, and 1-tap instant retry.",
    content: `Game Over must be very fast.

Suggested layout:
          GAME OVER

             764

          BEST 782

        18 TO GO

       [ TRY AGAIN ]

            MENU

If the player achieves a new record:
          NEW BEST!
             831
         AMAZING!

The player should be able to restart with one tap.`,
    tags: ["game over", "retry", "results"]
  },
  {
    id: 14,
    title: "14. 'X More To Beat Your Best' Mechanic",
    category: "Retention",
    summary: "Major retention hook: e.g., Best 782, Score 764 -> '18 MORE TO BEAT YOUR BEST'.",
    content: `This should be implemented intentionally.

Example:
bestScore = 782
currentScore = 764

Display:
18 MORE TO BEAT YOUR BEST

If currentScore exceeds bestScore:
NEW BEST

This is a major retention mechanic.
The player should think: "I can beat that." Then immediately try again.`,
    tags: ["retention", "hook", "psychology", "personal best"]
  },
  {
    id: 15,
    title: "15. Daily Challenge",
    category: "Retention",
    summary: "Client-side deterministic daily challenge generated by date seed: date -> seed -> challenge sequence.",
    content: `V1 should include a daily challenge system while keeping it client-side.
The daily challenge should be deterministic.

Concept:
date -> seed -> challenge sequence

Example:
generateDailySeed("2026-09-17")

Everyone playing on the same day can receive the same challenge sequence.
The daily challenge should reset based on the calendar date.`,
    tags: ["daily challenge", "seed", "deterministic", "retention"]
  },
  {
    id: 16,
    title: "16. Client-Side Save System",
    category: "Architecture",
    summary: "SaveManager.ts storing bestScore, runs, taps, combo, achievements, daily stats locally via sys.localStorage.",
    content: `Create: SaveManager.ts. Do not create a database for V1. All state persists client-side.`,
    codeSnippet: `interface PlayerData {
    bestScore: number;
    totalRuns: number;
    totalTaps: number;
    highestCombo: number;
    achievements: string[];
    dailyBestScore: number;
    lastDailyDate: string;
}`,
    tags: ["save system", "persistence", "localstorage", "schema"]
  },
  {
    id: 17,
    title: "17. Pure Tap-to-Play Mechanics",
    category: "Systems",
    summary: "Streamlined gameplay stripped of cosmetic skins to prioritize raw reflexive mastery, sub-16ms touch responsiveness, and zero distraction.",
    content: `Visual skins have been completely removed to prioritize pure gameplay clarity.

Key Architectural Tenets:
- No cosmetic microtransactions or skin catalogs
- Sub-16ms touch response (using Input.EventType.TOUCH_START)
- Maximum visual contrast between targets, decoys, and background
- Instant restart loop (<1s) so players never lose reflexive flow`,
    tags: ["tap-to-play", "mechanics", "gameplay", "minimalism"]
  },
  {
    id: 18,
    title: "18. Cocos Creator & TypeScript (No HTML)",
    category: "Architecture",
    summary: "TikTok Mini Games mandate: HTML/DOM elements are not supported. All UI and gameplay must run on Cocos WebGL/Canvas nodes via TypeScript.",
    content: `Crucial Platform Architecture Constraint:

In native TikTok Minis, standard web HTML/DOM elements are strictly prohibited or non-functional.
All gameplay, HUD elements, modals, and buttons must be implemented as Cocos Creator 3.8+ Node components:
- Pure TypeScript scripts (GameManager.ts, UIManager.ts, StageManager.ts)
- cc.Label and cc.Sprite components instead of HTML text/divs
- Touch events handled exclusively through Cocos Input system
- sys.localStorage utilized for client-side persistence`,
    tags: ["cocos", "typescript", "tiktok", "no-html", "architecture"]
  },
  {
    id: 19,
    title: "19. Achievement System",
    category: "Systems",
    summary: "AchievementManager.ts with 9 initial achievements (First Tap, Tap Master, Combo King, Untouchable, etc.).",
    content: `Create: AchievementManager.ts

Initial achievements:
1. First Tap - Complete first tap.
2. Getting Started - Score 50.
3. Tap Master - 100 total taps.
4. Speed Demon - 20 perfect taps.
5. Combo King - 25 combo.
6. Insane - 50 combo.
7. One More - Play 10 runs.
8. Daily Player - Complete 7 daily challenges.
9. Untouchable - Complete 20 challenges without missing.`,
    tags: ["achievements", "milestones", "goals"]
  },
  {
    id: 20,
    title: "20. Audio System",
    category: "Systems",
    summary: "Short, crisp, non-fatiguing SFX: tap, perfect, combo, levelup, miss, gameover, button, newbest, and music.",
    content: `Audio is important because the game relies on satisfying feedback.

SFX List:
- tap.wav: Very short, crisp, satisfying, not annoying on fast repeats
- perfect.wav
- combo.wav
- levelup.wav
- miss.wav
- gameover.wav
- button.wav
- newbest.wav

Music: menu_music, game_music.
Always provide an option to mute audio.`,
    tags: ["audio", "sfx", "music", "feedback"]
  },
  {
    id: 21,
    title: "21. Visual Feedback / Game Juice",
    category: "Gameplay",
    summary: "PLAYER TAPS -> TARGET SCALE / POP -> PARTICLE BURST -> SCORE POP -> COMBO UPDATE -> NEXT TARGET.",
    content: `Every successful action should provide immediate feedback.

Suggested sequence:
PLAYER TAPS
    |
    v
TARGET SCALE / POP
    |
    v
PARTICLE BURST
    |
    v
SCORE POP
    |
    v
COMBO UPDATE
    |
    v
NEXT TARGET

Effects should happen quickly. Avoid long animations that make the player wait.`,
    tags: ["juice", "particles", "animation", "feel"]
  },
  {
    id: 22,
    title: "22. Visual Style",
    category: "Overview",
    summary: "Minimal futuristic arcade: Dark/black background, neon target, clean typography, high contrast, smooth scaling.",
    content: `Recommended art direction:
- Minimal futuristic arcade
- Dark/black background
- Neon target
- Clean typography
- Strong contrast
- Small but satisfying particle effects
- Smooth scaling
- Fast transitions
- No clutter

The screen should remain visually understandable even when gameplay becomes fast.`,
    tags: ["art style", "visuals", "neon", "arcade"]
  },
  {
    id: 23,
    title: "23. Scene Architecture",
    category: "Architecture",
    summary: "Single scene (assets/scenes/Main.scene) managing Menu, Game, Game Over, Daily, Achievements.",
    content: `Keep V1 small.

Suggested scene:
assets/scenes/Main.scene

Initially, one scene can manage:
- Main menu
- Gameplay
- Game Over
- Daily Challenge
- Achievements

Do not create many scenes just for organization.`,
    tags: ["scene", "cocos", "architecture"]
  },
  {
    id: 24,
    title: "24. Project Structure",
    category: "Architecture",
    summary: "Modular Cocos directory layout: scripts, prefabs, textures, audio, fonts.",
    content: `Suggested Cocos project structure:

assets/
|-- scenes/Main.scene
|-- scripts/
|   |-- GameManager.ts, GameState.ts
|   |-- ChallengeManager.ts, ChallengeBase.ts, DifficultyManager.ts
|   |-- ScoreManager.ts, ComboManager.ts, SaveManager.ts
|   |-- DailyChallengeManager.ts, AchievementManager.ts
|   |-- AudioManager.ts, EffectManager.ts, UIManager.ts
|-- prefabs/ (Target, Button, Popup, Particle)
|-- textures/ (ui, targets)
|-- audio/ (sfx, music)
|-- fonts/`,
    tags: ["structure", "files", "cocos"]
  },
  {
    id: 25,
    title: "25. Architecture & Manager Pattern",
    category: "Architecture",
    summary: "GameManager coordinating ChallengeManager, ScoreManager, UIManager, DifficultyManager, and ComboManager.",
    content: `Use a central manager architecture.

                    GameManager
                         |
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
ChallengeManager   ScoreManager     UIManager
       |                 |
       v                 v
DifficultyManager   ComboManager
       |
       v
Target System

Supporting systems: SaveManager, AudioManager, EffectManager, AchievementManager, DailyChallengeManager.`,
    tags: ["architecture", "managers", "design patterns"]
  },
  {
    id: 26,
    title: "26. GameManager Responsibilities",
    category: "Architecture",
    summary: "High-level lifecycle: startGame(), startChallenge(), completeChallenge(), failChallenge(), endGame(), restartGame().",
    content: `GameManager.ts should control the high-level lifecycle:
- startGame()
- startChallenge()
- completeChallenge()
- failChallenge()
- endGame()
- restartGame()
- returnToMenu()

GameManager should NOT contain every piece of game logic. Delegate to specialized managers.`,
    tags: ["gamemanager", "lifecycle", "methods"]
  },
  {
    id: 27,
    title: "27. Challenge Architecture",
    category: "Architecture",
    summary: "Abstract ChallengeBase class with start(), complete(), fail(), cleanup() overridden by each challenge type.",
    content: `Use a base challenge class.`,
    codeSnippet: `abstract class ChallengeBase {
    abstract start(): void;
    abstract complete(): void;
    abstract fail(): void;
    abstract cleanup(): void;
}

// Implementations:
// TapTargetChallenge, ColorChallenge, DontTapChallenge,
// MovingTargetChallenge, ShrinkingTargetChallenge,
// MultiTapChallenge, SequenceChallenge, ReactionChallenge`,
    tags: ["oop", "challengebase", "inheritance"]
  },
  {
    id: 28,
    title: "28. Random Challenge Selection & Weights",
    category: "Systems",
    summary: "Weighted challenge selection based on difficulty to avoid repetition or unfair spikes.",
    content: `Do not choose challenges using completely uncontrolled randomness.
Use weighted challenge selection based on difficulty.

Example early-game weights:
- Tap Target: 40%
- Color: 30%
- Moving: 15%
- Shrinking: 10%
- Reaction: 5%

Example extreme-game weights:
- Tap Target: 5%
- Color: 15%
- Moving: 20%
- Shrinking: 20%
- Sequence: 15%
- Reaction: 15%
- Multi Tap: 10%`,
    tags: ["weights", "probability", "tuning"]
  },
  {
    id: 29,
    title: "29. Anti-Frustration System",
    category: "Systems",
    summary: "Subtly protect players from unfair RNG (slight ease after repeated fails; avoid extreme hazards at high combo).",
    content: `The game should protect players from unfair random difficulty.

Potential logic:
- If player failed repeatedly: slightly reduce difficulty.
- If player has a very high combo: avoid generating an unnecessarily extreme random challenge.

Do not make the protection obvious. The player should feel challenged but treated fairly. Do NOT rig against the player.`,
    tags: ["anti-frustration", "fairness", "adaptive"]
  },
  {
    id: 30,
    title: "30. First-Time Player Experience",
    category: "Gameplay",
    summary: "Zero long tutorials. Teach through immediate action: 'TAP THE CIRCLE' -> 'GOOD!' -> next challenge.",
    content: `Do not create a long tutorial. Teach through gameplay.

First screen:
TAP THE CIRCLE
       ●
Player taps.

Then:
GOOD!

Next challenge:
TAP
 ●
Then gradually introduce other mechanics. The player learns by playing.`,
    tags: ["ftue", "onboarding", "tutorial"]
  },
  {
    id: 31,
    title: "31. First 60 Seconds Progression",
    category: "Gameplay",
    summary: "Paced introduction: 0-5s basic taps, 5-15s color, 15-25s moving, 25-40s shrinking, 40-60s mixed.",
    content: `Suggested progression:
0–5 seconds: Basic taps.
5–15 seconds: Color challenge.
15–25 seconds: Moving target.
25–40 seconds: Shrinking target.
40–60 seconds: Mixed challenges.

Do not introduce every mechanic immediately.`,
    tags: ["pacing", "progression", "retention"]
  },
  {
    id: 32,
    title: "32. Retention Loop",
    category: "Retention",
    summary: "OPEN -> DAILY BONUS -> PLAY RUN -> COMBO -> FAIL -> '18 TO BEAT BEST' -> RETRY -> NEW RECORD -> UNLOCK.",
    content: `Core loop:
OPEN GAME
    |
    v
DAILY BONUS
    |
    v
PLAY RUN
    |
    v
BUILD COMBO
    |
    v
GET BETTER
    |
    v
FAIL
    |
    v
"18 MORE TO BEAT BEST"
    |
    v
RETRY
    |
    v
NEW RECORD
    |
    v
UNLOCK ITEM
    |
    v
DAILY CHALLENGE
    |
    v
COME BACK`,
    tags: ["retention loop", "habit", "replayability"]
  },
  {
    id: 33,
    title: "33. Monetization — Later Phase",
    category: "Production",
    summary: "Do NOT include monetization in prototype. Later add rewarded ads (1 revive per run, double score) via TikTok SDK.",
    content: `Do NOT make monetization part of the initial prototype.
First prove that the core gameplay is fun.

Later, add TikTok-supported advertising:
- REVIVE: Watch ad to continue run (limit ~1 per run)
- DOUBLE SCORE: Watch ad to multiply score

Monetization should never interrupt gameplay excessively.`,
    tags: ["monetization", "ads", "tiktok", "revive"]
  },
  {
    id: 34,
    title: "34. No Backend For V1",
    category: "Architecture",
    summary: "Strict client-side requirement: TikTok -> Cocos Mini Game -> Local Player Data. Zero servers or MongoDB.",
    content: `Explicit requirement: V1 is CLIENT-SIDE.

Architecture:
TikTok -> Cocos Mini Game -> Local Player Data

Do NOT add:
- MongoDB
- Express
- Railway
- REST API
- Authentication server
- External player database

The core game must work without an internet-dependent backend.`,
    tags: ["no backend", "client-side", "offline-first"]
  },
  {
    id: 35,
    title: "35. Future Backend (V2/V3)",
    category: "Production",
    summary: "Introduce backend only for global leaderboard, cloud saves, tournaments, anti-cheat in V2/V3.",
    content: `Only introduce a backend if future requirements need:
- Global leaderboard
- Cloud saves
- Anti-cheat validation
- Cross-device progression
- Player accounts
- Server-controlled events
- Global tournaments`,
    tags: ["future", "v2", "backend roadmap"]
  },
  {
    id: 36,
    title: "36. Global Leaderboard Warning",
    category: "Production",
    summary: "Real global leaderboards cannot be safe client-side. For V1 use 'YOUR BEST' instead of fake global ranks.",
    content: `A real global leaderboard cannot be safely implemented purely client-side.
A real leaderboard requires server-side storage and validation.

For V1 use:
YOUR BEST
instead of pretending a local score is a global rank.`,
    tags: ["leaderboard", "warning", "anti-slop"]
  },
  {
    id: 37,
    title: "37. Development Phases (Phases 1 to 6)",
    category: "Production",
    summary: "Phase 1: Core Prototype -> Phase 2: Challenges -> Phase 3: Difficulty -> Phase 4: Juice -> Phase 5: Retention -> Phase 6: TikTok.",
    content: `PHASE 1 — CORE PROTOTYPE: Main scene, game state, target, tap detection, score, combo, game over, restart.
PHASE 2 — CHALLENGE SYSTEM: Tap, Color, Don't Tap, Moving, Shrinking, Multi Tap, Sequence, Reaction.
PHASE 3 — DIFFICULTY: Progression curve, weighted challenges, speed scaling, fairness validation.
PHASE 4 — GAME JUICE: Particles, screen pulse, score pop, combo animation, sound, perfect tap.
PHASE 5 — RETENTION: Local save, achievements, pure tap-to-play balance, daily challenge.
PHASE 6 — TIKTOK INTEGRATION: TikTok Mini Game SDK, lifecycle, ads, packaging, mobile testing.`,
    tags: ["phases", "roadmap", "milestones", "schedule"]
  },
  {
    id: 38,
    title: "38. Performance Requirements",
    category: "Architecture",
    summary: "Object pooling, sprite atlases, reuse prefabs, lightweight particles, zero unnecessary physics.",
    content: `ONE MORE TAP should be lightweight.

Avoid:
- Huge textures
- Unnecessarily complex shaders
- Hundreds of simultaneous particles
- Constantly spawning/destroying nodes
- Unnecessary physics
- Large audio files
- Excessive animation objects

Prefer:
- Object pooling
- Sprite atlases
- Compressed assets
- Reusable prefabs
- Lightweight particle effects
- Deterministic gameplay`,
    tags: ["performance", "fps", "mobile", "optimization"]
  },
  {
    id: 39,
    title: "39. Multi-Resolution & Device Support",
    category: "Systems",
    summary: "Safe bounds layout, responsive portrait aspect ratios, prevents targets spawning beneath HUD.",
    content: `The game must support different phone aspect ratios:
- Use Cocos responsive layout systems.
- Keep the gameplay area inside safe bounds.
- Do not hardcode a single device resolution.
- Keep important UI readable.
- Keep targets tappable.
- Prevent targets from spawning underneath critical UI.
- Test narrow and tall portrait screens.`,
    tags: ["responsive", "portrait", "aspect ratio", "safe area"]
  },
  {
    id: 40,
    title: "40. Input Requirements",
    category: "Systems",
    summary: "Touch start / tap, fast repeated taps, multi-touch handling, avoid keyboard/mouse dependencies.",
    content: `Primary input is touch.

Support:
- Touch start / tap
- Fast repeated taps
- Multi-tap challenge input
- Timing-sensitive input

Avoid requiring:
- Keyboard
- Mouse
- Controller

Development testing may use mouse input where convenient, but the game must be designed for touch.`,
    tags: ["input", "touch", "mobile"]
  },
  {
    id: 41,
    title: "41. Save Data Safety",
    category: "Architecture",
    summary: "Initialize defaults, validate values, clamp, prevent NaN/Infinity, support saveVersion: 1 migrations.",
    content: `SaveManager should:
- Initialize default data on first launch.
- Validate loaded values.
- Prevent NaN/Infinity values.
- Clamp invalid values.
- Handle missing properties.
- Support a save-data version (e.g. saveVersion: 1).
- Avoid corrupting the entire save if one field is invalid.`,
    tags: ["save safety", "validation", "migration"]
  },
  {
    id: 42,
    title: "42. Deterministic Daily Challenge",
    category: "Systems",
    summary: "createDailySeed(dateString) to generate identical sequence for all players on the same calendar day.",
    content: `Daily challenge generation should be deterministic.
Do NOT depend entirely on Math.random() for daily challenge generation.`,
    codeSnippet: `function createDailySeed(dateString: string): number {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        hash = (hash << 5) - hash + dateString.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}`,
    tags: ["daily seed", "algorithm", "deterministic"]
  },
  {
    id: 43,
    title: "43. Reset & Restart Behavior",
    category: "Architecture",
    summary: "Stop timers, remove targets, clean listeners, avoid memory/audio leaks on rapid retry loops.",
    content: `When a run ends:
- Stop all active timers.
- Stop challenge logic.
- Remove/disable active targets.
- Stop unnecessary animation loops.
- Clear temporary state.
- Preserve player save data.
- Prepare clean state for retry.

When restarting:
- Do not stack event listeners.
- Do not duplicate timers.
- Do not duplicate audio.
- Do not leak nodes.`,
    tags: ["restart", "lifecycle", "cleanup", "memory"]
  },
  {
    id: 44,
    title: "44. Error Handling",
    category: "Architecture",
    summary: "Graceful failure for missing assets, corrupted saves, or challenge generation failures.",
    content: `The game should fail gracefully.

Examples:
- Missing optional asset
- Missing save data
- Invalid save data
- Challenge generation failure
- Unsupported optional platform feature

Do not allow one optional system to crash the entire game. Core gameplay must remain functional.`,
    tags: ["error handling", "robustness", "fail-safe"]
  },
  {
    id: 45,
    title: "45. V1 Definition of Done",
    category: "Production",
    summary: "Comprehensive acceptance criteria across Gameplay, UX, Performance, Persistence, and Platform.",
    content: `GAMEPLAY:
- Game launches.
- Player can start a run.
- Target appears correctly.
- Tap detection works.
- Score works.
- Combo works.
- Challenges work.
- Difficulty increases.
- Failure works.
- Game Over works.
- Retry works.

UX:
- No unnecessary loading screens.
- Player understands the game immediately.
- Retry takes one tap.
- Animations do not block input unnecessarily.
- UI works on different phone resolutions.
- Target is always visually obvious.
- Game Over clearly shows score and best.

PERFORMANCE:
- No major frame drops.
- No memory leaks.
- No unnecessary node creation.
- Particles are controlled.
- Audio does not cause stuttering.
- Game remains responsive during long runs.

PERSISTENCE:
- Best score saves.
- Run counts and combo records save.
- Achievements save.
- Daily challenge data saves.

PLATFORM:
- Cocos project builds correctly.
- TikTok Mini Game package builds correctly.
- No HTML5/browser dependency for the game runtime.
- No required external server.
- Platform lifecycle events are handled correctly.
- Tested on target mobile devices.`,
    tags: ["dod", "definition of done", "checklist", "quality"]
  },
  {
    id: 46,
    title: "46. First Development Milestone",
    category: "Production",
    summary: "Smallest playable loop: Score 0 -> Tap -> Score 10 -> Tap -> Score 20 -> Miss -> Game Over -> Retry.",
    content: `The coder's FIRST milestone must be extremely small.

Build only this:
ONE MORE TAP
       PLAY
        |
        v
     SCORE 0
        |
        v
        ●
        |
       TAP
        |
        v
     SCORE 10
        |
        v
        ●
        |
       TAP
        |
        v
     SCORE 20
        |
        v
       MISS
        |
        v
    GAME OVER
        |
        v
     SCORE 20
        |
        v
      RETRY

Do NOT build skins, achievements, daily challenges, or advanced types before this basic loop works and feels good.`,
    tags: ["milestone 1", "prototype", "core loop"]
  },
  {
    id: 47,
    title: "47. Development Priority",
    category: "Production",
    summary: "15-step ranked priority: Core tap loop first, monetization and future backend last.",
    content: `Priority order:
1. Core tap loop
2. Score
3. Combo
4. Game Over
5. Retry
6. Challenge system
7. Difficulty
8. Game juice
9. Save system
10. Daily challenge
11. Achievements
12. Cocos Creator TypeScript Engine Migration (No HTML in TikTok Minis)
13. TikTok platform integration
14. Monetization
15. Optional future backend

Gameplay quality comes before feature quantity.`,
    tags: ["priorities", "ordering", "roadmap"]
  },
  {
    id: 48,
    title: "48. What NOT to Build in V1",
    category: "Overview",
    summary: "Strict anti-slop list: No multiplayer, chat, blockchain, 100+ challenges, story mode, or server databases.",
    content: `Do NOT add:
- Multiplayer
- Chat
- Friends system
- Global leaderboard
- Login
- Player profiles
- Clans
- NFTs
- Blockchain
- Inventory backend
- Complex shop
- 100+ challenge types
- Story mode
- Character system
- Huge particle effects
- Procedural worlds
- External database
- Required backend server

Keep V1 focused. The core game should remain:
OPEN -> TAP -> SURVIVE -> FAIL -> "ONE MORE TAP" -> REPEAT`,
    tags: ["what not to build", "anti-slop", "scope", "v1 boundary"]
  },
  {
    id: 49,
    title: "49. The Golden Rule",
    category: "Overview",
    summary: "Put at the top of README: 'ONE MORE TAP must be easy to learn, satisfying to play, difficult to master...'",
    content: `"ONE MORE TAP must be easy to learn, satisfying to play, difficult to master, and fast enough that the player can restart before they have time to get bored."

The intended player experience:
"That was easy."
Then:
"Okay, that was faster."
Then:
"Wait, I almost beat my record."
Then:
"One more."
Then:
"ONE MORE."
Then:
"ONE MORE TAP."`,
    tags: ["golden rule", "creed", "game design"]
  },
  {
    id: 50,
    title: "50. Coder Start Instructions",
    category: "Production",
    summary: "Start now with Phase 1 only: Scene, GameManager, GameState, Target, Touch, Score, Combo, Game Over, Retry.",
    content: `START NOW WITH PHASE 1 ONLY.
Do not implement the entire documentation at once.

First create the Cocos Creator project and establish:
1. Main scene.
2. GameManager.
3. GameState.
4. Basic target prefab/node.
5. Touch detection.
6. ScoreManager.
7. Basic combo system.
8. Game Over UI.
9. Retry button.
10. Clean reset/restart lifecycle.

Once the first playable loop is working, test it on an actual mobile device.
Only after the core loop is confirmed fun and stable should development proceed to Phase 2.`,
    tags: ["coder instructions", "getting started", "phase 1"]
  }
];
