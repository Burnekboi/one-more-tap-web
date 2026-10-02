// The TikTok mini-game is authored for the target portrait viewport.  Keeping
// this in sync with the Creator project avoids a cropped 720px-wide canvas on
// 392px devices.
export const DESIGN_WIDTH = 392;
export const DESIGN_HEIGHT = 800;

export const INITIAL_TIMER_BANK_SEC = 8.0;
export const MAX_TIMER_BANK_SEC = 8.0;
export const TIMER_BONUS_SEC = 2.0;
export const COMBO_TIMER_BONUS_SEC = 3.0;

export const SCORE_BASE_PER_TAP = 10;
export const SCORE_COMBO_MULTIPLIER = 5;

export const WEIRD_STAGE_COUNT = 25;
export const CRAZY_STAGE_COUNT = 50;

export const STAGE_PROGRESSION: string[] = [
  'TAP_TARGET',
  'AURA_CHECK',
  'COLOR_TARGET',
  'BATTERY_PANIC',
  'BUBBLE_WRAP',
  'WIFI_HUNT',
  'CAT_MEME',
  'AUTOCORRECT_RESCUE',
  'MICROWAVE_STOP',
  'DONT_TAP',
  'TRIPLE_LOCK',
  'SKULL_DODGE',
  'ASCENDING_TRIO',
  'TWIN_RED',
  'VANISHING_ORBS',
  'DONT_TAP_RED',
  'HAMMER_TIME',
  'COLOR_COPY_FAKE',
  'SHIELD_BOMB',
  'DESCENDING_TRIO',
  'CHAMELEON',
  'MOSH_PIT',
  'EVEN_FAIR',
  'DON_T_TAP_BLUE',
  'CONVEYOR',
  'TRAFFIC_LIGHT',
  'SHAPE_SHIFT',
  'MIRROR_MATH',
  'SHAPE_CONFUSER',
  'SHAPE_CONFUSER',
  'CORD_CUTTER',
  'STROBE_FIRE',
  'TICKING_ORBIT',
  'STORM_SURGE',
  'CREEPING_CURSOR',
  'CIRCUIT_BREAK',
  'TACHYON_DEFUSE',
  'PHANTOM_SHIFT',
  'JITTER_MASH',
  'CROWN_JEWEL',
  'FLASH_TRACE',
  'GOLD_ORBIT',
  'WHITE_SPACE',
  'SWEEP_SWARM',
  'DRAW_REACTION',
  'HOLD_STILL',
  'SHRINK_HUNT',
  'NEON_HUNT',
  'COMBO_FOUR',
  'FINALE_GAUNTLET',
];
