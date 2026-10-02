import { TargetItem } from '../types';

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export const VIBRANT_CHOICE_PALETTES = [
  "#0284c7", // Sky Blue
  "#7c3aed", // Purple
  "#0d9488", // Teal
  "#ea580c", // Orange
  "#d97706", // Amber
  "#ec4899", // Pink
  "#3b82f6", // Royal Blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Violet
  "#14b8a6", // Mint Teal
  "#f43f5e", // Rose
  "#6366f1", // Indigo
];

export function assignShuffledColors<T extends object>(items: T[]): (T & { color: string })[] {
  const colors = shuffle(VIBRANT_CHOICE_PALETTES);
  return items.map((item, idx) => ({
    ...item,
    color: colors[idx % colors.length],
  }));
}

export interface GeneratedQuestionStage {
  title: string;
  instruction: string;
  failBlurb: string;
  targets: TargetItem[];
}

// ----------------------------------------------------------------------
// STAGE 2: AURA CHECK (Randomized questions & targets)
// ----------------------------------------------------------------------
export function getAuraCheckStage(stageNumber: number): GeneratedQuestionStage {
  const pools = [
    {
      instruction: 'CLAIM +10,000 AURA: TAP THE GIGA CHAD 🗿',
      failBlurb: '-10,000 AURA! Bro picked the clown and lost all street respect!',
      correctId: 'aura-chad',
    },
    {
      instruction: 'UNBOTHERED LEGEND: TAP THE CHILL GUY 🐶',
      failBlurb: 'Bro panicked and lost his chill! Zero composure!',
      correctId: 'aura-chill',
    },
    {
      instruction: 'LOCKED IN: TAP THE MEWING PHARAOH 🤫',
      failBlurb: 'You broke your mewing streak! Jawline revoked!',
      correctId: 'aura-mew',
    },
    {
      instruction: 'PURE FOCUS: TAP THE SIGMA GRINDSET 🕶️',
      failBlurb: 'Fell for the NPC decoy! Focus on the grind!',
      correctId: 'aura-sigma',
    },
  ];

  const allItems = [
    { id: 'aura-chad', label: '🗿 GIGA CHAD', subtitle: '+10,000 AURA (LEGEND)', color: '#0284c7' },
    { id: 'aura-chill', label: '🐶 CHILL GUY', subtitle: '+8,000 AURA (EFFORTLESS)', color: '#16a34a' },
    { id: 'aura-mew', label: '🤫 MEWING STREAK', subtitle: '+7,000 AURA (LOCKED IN)', color: '#7c3aed' },
    { id: 'aura-sigma', label: '🕶️ SIGMA GRINDSET', subtitle: '+9,000 AURA (UNFAZED)', color: '#0f766e' },
    { id: 'aura-clown', label: '🤡 CLOWN BEHAVIOR', subtitle: '-50,000 AURA', color: '#dc2626' },
    { id: 'aura-npc', label: '🤖 GENERIC NPC', subtitle: '0 AURA (IRRELEVANT)', color: '#475569' },
    { id: 'aura-rage', label: '🤬 KEYBOARD SMASHER', subtitle: '-99,999 AURA', color: '#b91c1c' },
  ];

  const pickedQuestion = pickRandom(pools);
  const correctItem = allItems.find((i) => i.id === pickedQuestion.correctId)!;
  const distractorCandidates = allItems.filter((i) => i.id !== pickedQuestion.correctId);
  const distractors = shuffle(distractorCandidates).slice(0, 2);

  const selectedOptions = assignShuffledColors(shuffle([correctItem, ...distractors]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: AURA CHECK`,
    instruction: pickedQuestion.instruction,
    failBlurb: pickedQuestion.failBlurb,
    targets: selectedOptions.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === pickedQuestion.correctId,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 3: COLOR TARGET (Randomized target color)
// ----------------------------------------------------------------------
export function getColorTargetStage(stageNumber: number): GeneratedQuestionStage {
  const colorList = [
    { name: 'EMERALD GREEN', code: '#22c55e' },
    { name: 'CRIMSON RED', code: '#ef4444' },
    { name: 'OCEAN BLUE', code: '#3b82f6' },
    { name: 'AMBER GOLD', code: '#f59e0b' },
    { name: 'ELECTRIC PURPLE', code: '#a855f7' },
    { name: 'NEON CYAN', code: '#06b6d4' },
  ];

  const selected3 = shuffle(colorList).slice(0, 3);
  const targetColor = pickRandom(selected3);
  const xPositions = [28, 50, 72];

  return {
    title: `STAGE ${stageNumber}: COLOR DISCRIMINATION`,
    instruction: `TAP THE ${targetColor.name} TARGET!`,
    failBlurb: `Wrong color! Only ${targetColor.name} was safe to tap!`,
    targets: selected3.map((c, i) => ({
      id: `color-${c.code}`,
      x: xPositions[i],
      y: 50,
      size: 62,
      color: c.code,
      isCorrect: c.code === targetColor.code,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 4: BATTERY PANIC (User Example: 150W Fast Charger, Power Bank, etc.)
// ----------------------------------------------------------------------
export function getBatteryPanicStage(stageNumber: number): GeneratedQuestionStage {
  const options = [
    {
      id: 'bat-150w',
      label: '⚡ 150W FAST CHARGER',
      subtitle: '0% TO 100% IN 9 MINS',
      color: '#16a34a',
      prompts: [
        'BATTERY AT 1%! PLUG IN 150W FAST CHARGER!',
        'NEED 100% FAST! FIND THE 150W FAST CHARGER!',
      ],
      fail: 'You picked a slow broken cable while your phone died at 1%!',
    },
    {
      id: 'bat-powerbank',
      label: '🔋 20,000mAh POWER BANK',
      subtitle: 'HEAVY BRICK OF JUICE',
      color: '#0284c7',
      prompts: [
        'ON THE RUN! GRAB THE 20,000mAh POWER BANK!',
        'NO WALL OUTLETS! FIND THE PORTABLE POWER BANK!',
      ],
      fail: 'You left the house with 1% battery and no power bank!',
    },
    {
      id: 'bat-bent',
      label: '🔌 BENT CABLE FROM 2014',
      subtitle: 'ONLY WORKS AT A 47° ANGLE',
      color: '#dc2626',
      prompts: [
        'DESPERATE TIMES! FIND THE BENT CABLE FROM 2014!',
        'NO OTHER WIRES! GRAB THE ANGLE-BENT CABLE!',
      ],
      fail: 'You bumped the cable and broke the 47-degree charging sweet spot!',
    },
    {
      id: 'bat-gas',
      label: '⛽ $4 GAS STATION WIRE',
      subtitle: 'SMOKES AFTER 3 SECONDS',
      color: '#ca8a04',
      prompts: [
        'HIGHWAY STRANDED! BUY THE $4 GAS STATION WIRE!',
        'DESPERATE AT 2AM! GRAB THE GAS STATION WIRE!',
      ],
      fail: 'The wire sparked and gave 0.5% charge before burning out!',
    },
    {
      id: 'bat-car',
      label: '🚗 12V CAR CIGARETTE PLUG',
      subtitle: 'TRICKLE SPEED CHARGING',
      color: '#7c3aed',
      prompts: [
        'ROAD TRIP EMERGENCY! FIND THE 12V CAR PLUG!',
        'DRIVING IN DARK: PLUG INTO 12V CAR ADAPTER!',
      ],
      fail: 'You missed the 12V car plug and the GPS died in the middle of nowhere!',
    },
  ];

  // Pick 3 options for the screen
  const chosenOptions = shuffle(options).slice(0, 3);
  // Pick 1 of these 3 as the required answer
  const correctOption = pickRandom(chosenOptions);
  const prompt = pickRandom(correctOption.prompts);

  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: 1% BATTERY PANIC`,
    instruction: prompt,
    failBlurb: correctOption.fail,
    targets: chosenOptions.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === correctOption.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 6: WIFI HUNT (Randomized Network Hunt)
// ----------------------------------------------------------------------
export function getWifiHuntStage(stageNumber: number): GeneratedQuestionStage {
  const networks = [
    {
      id: 'wifi-5g',
      label: '📶 5G ULTRA HYPERSPEED',
      subtitle: '1200 Mbps (CLEAN)',
      color: '#2563eb',
      prompt: 'STREAMING 4K: CONNECT TO 5G ULTRA HYPERSPEED!',
      fail: 'Connected to dial-up cafe wifi! Video stuck at 144p buffering!',
    },
    {
      id: 'wifi-airport',
      label: '✈️ FREE AIRPORT LOUNGE',
      subtitle: 'NO PASSWORD REQUIRED',
      color: '#0d9488',
      prompt: 'FLIGHT DELAYED: CONNECT TO FREE AIRPORT LOUNGE!',
      fail: 'Airport security rejected your sketchy dial-up request!',
    },
    {
      id: 'wifi-starlink',
      label: '🛰️ STARLINK SATELLITE',
      subtitle: 'LOW ORBIT SIGNAL',
      color: '#7c3aed',
      prompt: 'OFF-GRID CAMPING: HOOK INTO STARLINK SATELLITE!',
      fail: 'Lost in the woods with zero satellite signal!',
    },
    {
      id: 'wifi-hotspot',
      label: '📱 BRO\'S HOTSPOT (5GB LEFT)',
      subtitle: 'PASSWORD: password123',
      color: '#16a34a',
      prompt: 'ROAMING DEAD: CONNECT TO BRO\'S HOTSPOT!',
      fail: 'Bro turned off hotspot to save battery for TikTok!',
    },
    {
      id: 'wifi-1bar',
      label: '📉 1-BAR 3G BUFFER',
      subtitle: 'BUFFERING SINCE 2012',
      color: '#dc2626',
      prompt: '',
      fail: '',
    },
    {
      id: 'wifi-airplane',
      label: '📴 AIRPLANE MODE',
      subtitle: 'ALL RADIOS OFF',
      color: '#475569',
      prompt: '',
      fail: '',
    },
    {
      id: 'wifi-sketchy',
      label: '⚠️ FBI SURVEILLANCE VAN #4',
      subtitle: 'UNSECURED NETWORK',
      color: '#ca8a04',
      prompt: '',
      fail: '',
    },
  ];

  const validTargets = networks.filter((n) => n.prompt !== '');
  const distractors = networks.filter((n) => n.prompt === '');

  const chosenTarget = pickRandom(validTargets);
  const chosenDistractors = shuffle(distractors).slice(0, 3);
  const final4 = shuffle([chosenTarget, ...chosenDistractors]);

  const gridPositions = [
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ];

  return {
    title: `STAGE ${stageNumber}: SIGNAL HUNT`,
    instruction: chosenTarget.prompt,
    failBlurb: chosenTarget.fail,
    targets: final4.map((net, idx) => ({
      id: net.id,
      x: gridPositions[idx].x,
      y: gridPositions[idx].y,
      size: 64,
      color: net.color,
      label: net.label,
      subtitle: net.subtitle,
      textColor: '#ffffff',
      isCorrect: net.id === chosenTarget.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 7: CAT MEME (Randomized Cat Meme Boop)
// ----------------------------------------------------------------------
export function getCatMemeStage(stageNumber: number): GeneratedQuestionStage {
  const catTargets = [
    {
      id: 'cat-smug',
      label: '😼 SMUG CAT MEME',
      subtitle: 'GENTLE NOSE BOOP',
      color: '#0891b2',
      prompt: 'BOOP THE SMUG CAT 😼 (DODGE SPICY DEMONS)!',
      fail: 'You provoked the angry spicy demon cat instead of the smug boop!',
    },
    {
      id: 'cat-pop',
      label: '🐱 POP CAT (MOUTH OPEN)',
      subtitle: 'POPPING AT 120 FPS',
      color: '#16a34a',
      prompt: 'SPEED TEST: TAP POP CAT WITH OPEN MOUTH 🐱!',
      fail: 'Too slow! Pop cat closed mouth before your finger arrived!',
    },
    {
      id: 'cat-maxwell',
      label: '🌀 SPINNING MAXWELL',
      subtitle: 'SYNTH MUSIC PLAYING',
      color: '#7c3aed',
      prompt: 'CATCH MAXWELL THE SPINNING CAT 🌀!',
      fail: 'Maxwell spun out of control and knocked over your lamp!',
    },
    {
      id: 'cat-salad',
      label: '🥗 SMUDGE AT THE SALAD',
      subtitle: 'CONFUSED AT VEGETABLES',
      color: '#0284c7',
      prompt: 'FIND SMUDGE CONFUSED AT THE SALAD 🥗!',
      fail: 'You yelled at the cat like the Real Housewives meme!',
    },
  ];

  const badCats = [
    { id: 'cat-hiss', label: '😾 3 AM HISSING DEMON', subtitle: 'WILL BITE ANKLES', color: '#dc2626' },
    { id: 'cat-bath', label: '🛁 WET BATH CAT', subtitle: 'SEEKING REVENGE', color: '#ea580c' },
    { id: 'cat-vet', label: '💉 CAT AT THE VET', subtitle: 'PURE TERROR CLAWS', color: '#475569' },
  ];

  const chosenTarget = pickRandom(catTargets);
  const chosenDistractors = shuffle(badCats).slice(0, 2);
  const final3 = shuffle([chosenTarget, ...chosenDistractors]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: VIRAL CAT MEME`,
    instruction: chosenTarget.prompt,
    failBlurb: chosenTarget.fail,
    targets: final3.map((cat, idx) => ({
      id: cat.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: cat.color,
      label: cat.label,
      subtitle: cat.subtitle,
      textColor: '#ffffff',
      isCorrect: cat.id === chosenTarget.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 8: AUTOCORRECT RESCUE (Randomized Texting Crisis)
// ----------------------------------------------------------------------
export function getAutocorrectStage(stageNumber: number): GeneratedQuestionStage {
  const scenarios = [
    {
      prompt: 'TEXTING MOM: SEND WHOLESOME "LOVE YOU MOM" ❤️',
      fail: 'You sent an unhinged autocorrect curse to your sweet mother!',
      correct: { id: 'auto-mom', label: '❤️ LOVE YOU MOM', subtitle: 'WHOLESOME GOOD SON', color: '#16a34a' },
      bad1: { id: 'auto-duck', label: '🦆 WHAT THE DUCK', subtitle: 'AUTOCORRECT CURSE', color: '#dc2626' },
      bad2: { id: 'auto-jail', label: '🚔 SEND BAIL MONEY', subtitle: 'WRONG CONTACT SELECTED', color: '#9333ea' },
    },
    {
      prompt: 'TEXTING BOSS: SEND PROFESSIONAL "ON MY WAY" 🚗',
      fail: 'You sent your boss a TikTok sound instead of arrival confirmation!',
      correct: { id: 'auto-boss', label: '🚗 ON MY WAY TO OFFICE', subtitle: 'PUNCTUAL EMPLOYEE', color: '#16a34a' },
      bad1: { id: 'auto-sleep', label: '😴 OVERSLEPT AGAIN', subtitle: 'CAREER LIMITING MOVE', color: '#dc2626' },
      bad2: { id: 'auto-fired', label: '🔥 I QUIT PEACE OUT', subtitle: 'POCKET DIALED DISASTER', color: '#ea580c' },
    },
    {
      prompt: 'TEXTING CRUSH: SEND "HAD A GREAT TIME" 😊',
      fail: 'You sent a proposal marriage meme on the first date!',
      correct: { id: 'auto-crush', label: '😊 HAD A GREAT TIME TONIGHT', subtitle: 'SMOOTH & RESPECTFUL', color: '#16a34a' },
      bad1: { id: 'auto-ring', label: '💍 WILL YOU MARRY ME', subtitle: 'CRINGE OVERLOAD', color: '#dc2626' },
      bad2: { id: 'auto-read', label: '💀 (UNSENT UNSENT UNSENT)', subtitle: 'PANIC DELETION', color: '#475569' },
    },
  ];

  const sc = pickRandom(scenarios);
  const options = shuffle([sc.correct, sc.bad1, sc.bad2]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: AUTOCORRECT CRISIS`,
    instruction: sc.prompt,
    failBlurb: sc.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === sc.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 9: MICROWAVE STOP (Randomized stealth timing)
// ----------------------------------------------------------------------
export function getMicrowaveStage(stageNumber: number): GeneratedQuestionStage {
  const variations = [
    {
      prompt: 'STOP MICROWAVE AT 0:01 BEFORE THE LOUD BEEP!',
      fail: 'BEEP! BEEP! BEEP! The microwave woke up the whole household!',
      correct: { id: 'micro-001', label: '🛑 STOP AT 0:01 (SILENT)', subtitle: 'STEALTH NINJA MASTER', color: '#0284c7' },
    },
    {
      prompt: 'MIDNIGHT SNACK: MUTE THE AUDIO CHIME 🔇!',
      fail: 'The speaker blared maximum volume at 3:15 AM!',
      correct: { id: 'micro-mute', label: '🔇 HOLD SOUND BUTTON 3s', subtitle: 'PERMANENT SILENT MODE', color: '#16a34a' },
    },
    {
      prompt: 'FOOD READY: OPEN DOOR WITH ZERO HANDLE CLICK!',
      fail: 'The latch snapped like thunder in the dead of night!',
      correct: { id: 'micro-open', label: '🚪 SLOW HANDLE RELEASE', subtitle: 'ZERO CLICK SOUND', color: '#0f766e' },
    },
  ];

  const badOptions = [
    { id: 'micro-beep', label: '🔊 LET IT BEEP 5 TIMES', subtitle: 'WAKES ENTIRE HOUSE', color: '#dc2626' },
    { id: 'micro-plus', label: '⏱️ ACCIDENTALLY +30s', subtitle: 'FOOD OVERHEATS & EXPLODES', color: '#ca8a04' },
  ];

  const picked = pickRandom(variations);
  const options = assignShuffledColors(shuffle([picked.correct, ...badOptions]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: MIDNIGHT SNACK`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 11: CAP OR NO CAP (Randomized Viral Myths vs Facts)
// ----------------------------------------------------------------------
export function getCapOrNoCapStage(stageNumber: number): GeneratedQuestionStage {
  const questions = [
    {
      instruction: 'TAP THE 100% TRUE SCIENTIFIC FACT (NO CAP)!',
      fail: 'You fell for a viral myth! Pure unverified misinformation!',
      correct: { id: 'fact-penguin', label: '🐧 PENGUINS HAVE KNEES', subtitle: 'NO CAP (100% TRUE)', color: '#16a34a' },
      distractors: [
        { id: 'cap-gum', label: '🍬 GUM DIGESTS 7 YEARS', subtitle: 'TOTAL CAP (MYTH)', color: '#dc2626' },
        { id: 'cap-brain', label: '🧠 HUMANS USE 10% BRAIN', subtitle: 'HOLLYWOOD CAP', color: '#475569' },
        { id: 'cap-lightning', label: '⚡ LIGHTNING NEVER HITS 2x', subtitle: 'MASSIVE CAP', color: '#ca8a04' },
      ],
    },
    {
      instruction: 'TAP THE REAL FACT (NO CAP):',
      fail: 'Total cap! That viral internet rumor was debunked years ago!',
      correct: { id: 'fact-shark', label: '🦈 SHARKS ARE OLDER THAN TREES', subtitle: 'NO CAP (400M YEARS)', color: '#16a34a' },
      distractors: [
        { id: 'cap-carrots', label: '🥕 CARROTS GIVE NIGHT VISION', subtitle: 'WW2 PROPAGANDA CAP', color: '#dc2626' },
        { id: 'cap-bull', label: '🐂 BULLS HATE COLOR RED', subtitle: 'PURE CAP (COLORBLIND)', color: '#475569' },
        { id: 'cap-shave', label: '✂️ SHAVING MAKES HAIR THICKER', subtitle: 'DELUSIONAL CAP', color: '#ca8a04' },
      ],
    },
    {
      instruction: 'SPOT THE REAL BIOLOGY FACT (NO CAP):',
      fail: 'Fell for another fake superstition!',
      correct: { id: 'fact-honey', label: '🍯 HONEY NEVER SPOILS', subtitle: 'NO CAP (EDIBLE FOR 3000 YRS)', color: '#16a34a' },
      distractors: [
        { id: 'cap-goldfish', label: '🐟 GOLDFISH HAVE 3-SEC MEMORY', subtitle: 'PROVEN CAP (MONTHS)', color: '#dc2626' },
        { id: 'cap-bats', label: '🦇 BATS ARE COMPLETELY BLIND', subtitle: 'MYTHOLOGICAL CAP', color: '#475569' },
        { id: 'cap-coffee', label: '☕ COFFEE STUNTS GROWTH', subtitle: 'UNTRUE CAP', color: '#ca8a04' },
      ],
    },
    {
      instruction: 'WHICH ONE IS 100% NO CAP?',
      fail: 'You picked a folklore myth instead of astronomical fact!',
      correct: { id: 'fact-venus', label: '🪐 VENUS DAY > VENUS YEAR', subtitle: 'NO CAP (SLOW SPIN)', color: '#16a34a' },
      distractors: [
        { id: 'cap-knuckles', label: '💥 POPPING KNUCKLES = ARTHRITIS', subtitle: 'DISPROVEN CAP', color: '#dc2626' },
        { id: 'cap-bird', label: '🐦 TOUCH BABY BIRD = MOM LEAVES', subtitle: 'FALSE CAP', color: '#475569' },
        { id: 'cap-swallow', label: '🕷️ YOU EAT 8 SPIDERS A YEAR', subtitle: 'URBAN LEGEND CAP', color: '#ca8a04' },
      ],
    },
  ];

  const picked = pickRandom(questions);
  const items = shuffle([picked.correct, ...picked.distractors]);

  const gridPositions = [
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ];

  return {
    title: `STAGE ${stageNumber}: CAP OR NO CAP DETECTOR`,
    instruction: picked.instruction,
    failBlurb: picked.fail,
    targets: items.map((it, idx) => ({
      id: it.id,
      x: gridPositions[idx].x,
      y: gridPositions[idx].y,
      size: 64,
      color: it.color,
      label: it.label,
      subtitle: it.subtitle,
      textColor: '#ffffff',
      isCorrect: it.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 12: PET PEEVE (Randomized everyday annoyances)
// ----------------------------------------------------------------------
export function getPetPeeveStage(stageNumber: number): GeneratedQuestionStage {
  const peeves = [
    {
      prompt: 'BRING PEACE: STRAIGHTEN THE CROOKED PAINTING 🖼️!',
      fail: 'Your OCD exploded! You left the frame tilted at 13 degrees!',
      correct: { id: 'pv-crooked', label: '🖼️ STRAIGHTEN CROOKED FRAME', subtitle: 'INSTANT HARMONY', color: '#0891b2' },
    },
    {
      prompt: 'SAVE YOUR SANITY: SILENCE THE RADAR ALARM 🔕!',
      fail: 'The siren triggered immediate fight-or-flight heart palpitations!',
      correct: { id: 'pv-alarm', label: '🔕 MUTE RADAR ALARM SOUND', subtitle: 'INNER PEACE RESTORED', color: '#16a34a' },
    },
    {
      prompt: 'FIX THE MESS: UNTANGLE THE EARPHONE CORDS 🎧!',
      fail: 'The cables formed an impossible quantum knot forever!',
      correct: { id: 'pv-cord', label: '🎧 UNTANGLE HEADPHONE CORD', subtitle: 'PERFECTLY STRAIGHTENED', color: '#0284c7' },
    },
    {
      prompt: 'SATISFACTION: PEEL THE NEW PLASTIC FILM ✨!',
      fail: 'You left the bubbly plastic film on the screen for 4 years!',
      correct: { id: 'pv-peel', label: '✨ PEEL FRESH FACTORY FILM', subtitle: 'MAXIMUM SATISFACTION', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'pv-chew', label: '👄 OPEN MOUTH CHOMPING', subtitle: 'MAXIMUM ANNOYANCE', color: '#dc2626' },
    { id: 'pv-cold', label: '☕ DRINK COLD SOGGY COFFEE', subtitle: 'RUINED MORNING', color: '#ea580c' },
    { id: 'pv-battery', label: '🔋 SMOKE DETECTOR CHIRP', subtitle: 'EVERY 45 SECONDS', color: '#475569' },
  ];

  const picked = pickRandom(peeves);
  const chosenBads = shuffle(badOptions).slice(0, 2);
  const all3 = shuffle([picked.correct, ...chosenBads]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: PET PEEVE SLAP`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: all3.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 13: ALARM SNOOZE (Randomized morning dilemmas)
// ----------------------------------------------------------------------
export function getAlarmSnoozeStage(stageNumber: number): GeneratedQuestionStage {
  const dilemmas = [
    {
      prompt: 'MONDAY 6:00 AM: SMASH THE 5-MINUTE SNOOZE BUTTON 💤!',
      fail: 'You turned off the alarm completely and woke up at 3:00 PM!',
      correct: { id: 'al-snooze', label: '💤 SNOOZE 5 MINS', subtitle: 'PURE BLISS IN BED', color: '#0284c7' },
    },
    {
      prompt: 'FINAL EXAM DAY: JUMP OUT OF BED & WAKE UP IMMEDIATELY 🏃!',
      fail: 'You snoozed and missed the entire final exam! Grade F!',
      correct: { id: 'al-wake', label: '🏃 JUMP OUT OF BED NOW', subtitle: 'ADRENALINE SPEED', color: '#16a34a' },
    },
    {
      prompt: 'SATURDAY MORNING: CANCEL ALARM AND SLEEP IN FOREVER 📴!',
      fail: 'You woke up at 5:00 AM on Saturday for no reason!',
      correct: { id: 'al-cancel', label: '📴 CANCEL ALARM (WEEKEND)', subtitle: 'SLEEP TILL NOON', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'al-cold', label: '🚿 5 AM ICE COLD SHOWER', subtitle: 'WHO CHOOSES THIS?', color: '#dc2626' },
    { id: 'al-scroll', label: '📱 SCROLL REELS FOR 2 HOURS', subtitle: 'MORNING WASTED', color: '#ca8a04' },
  ];

  const picked = pickRandom(dilemmas);
  const options = assignShuffledColors(shuffle([picked.correct, ...badOptions]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: MORNING ALARM`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 14: WATER 3AM (Randomized night drinks)
// ----------------------------------------------------------------------
export function getWater3AMStage(stageNumber: number): GeneratedQuestionStage {
  const choices = [
    {
      id: 'water-ice',
      label: '🧊 CRISP ICE WATER',
      subtitle: 'DIVINE HYDRATION',
      color: '#0284c7',
      prompt: '3:00 AM THIRST: CHUG THE CRISP ICE WATER 🧊!',
      fail: 'You drank flaming spicy noodles at 3 AM! Instant heartburn!',
    },
    {
      id: 'water-lemon',
      label: '🍋 COLD LEMON WATER',
      subtitle: 'CITRUS REFRESHMENT',
      color: '#0d9488',
      prompt: 'DRY MOUTH AT 3 AM: DRINK FRESH LEMON WATER 🍋!',
      fail: 'You swallowed expired sour milk from 2022!',
    },
    {
      id: 'water-apple',
      label: '🧃 ICE COLD APPLE JUICE',
      subtitle: 'MAXIMUM SUGAR JUICE',
      color: '#16a34a',
      prompt: 'CRAVING SWEET: DRINK COLD APPLE JUICE 🧃!',
      fail: 'You drank flat warm soda that sat on the counter for 4 days!',
    },
  ];

  const distractors = [
    { id: 'drink-ramen', label: '🍜 2X SPICY RAMEN', subtitle: 'ACID REFLUX TRAP', color: '#dc2626' },
    { id: 'drink-milk', label: '🥛 EXPIRED CHUNKY MILK', subtitle: 'BEST BY LAST WEEK', color: '#475569' },
    { id: 'drink-soda', label: '🥤 FLAT WARM SODA', subtitle: 'ZERO CARBONATION', color: '#ca8a04' },
  ];

  const pickedTarget = pickRandom(choices);
  const chosenDistractors = shuffle(distractors);
  const final4 = shuffle([pickedTarget, ...chosenDistractors]);

  const gridPositions = [
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ];

  return {
    title: `STAGE ${stageNumber}: 3:00 AM THIRST`,
    instruction: pickedTarget.prompt,
    failBlurb: pickedTarget.fail,
    targets: final4.map((drink, idx) => ({
      id: drink.id,
      x: gridPositions[idx].x,
      y: gridPositions[idx].y,
      size: 64,
      color: drink.color,
      label: drink.label,
      subtitle: drink.subtitle,
      textColor: '#ffffff',
      isCorrect: drink.id === pickedTarget.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 15: CAPTCHA BOT (Randomized verification questions)
// ----------------------------------------------------------------------
export function getCaptchaStage(stageNumber: number): GeneratedQuestionStage {
  const variations = [
    {
      prompt: 'PROVE YOU ARE HUMAN: TAP "I AM NOT A ROBOT" ☑️!',
      fail: 'Security filter detected you as a rogue toaster oven! Access denied!',
      correct: { id: 'cap-human', label: '☑️ I AM NOT A ROBOT', subtitle: 'VERIFIED HUMAN BEING', color: '#16a34a' },
    },
    {
      prompt: 'SECURITY CHECK: TAP "VERIFY HUMAN IDENTITY" 🛡️!',
      fail: 'Biometric scan failed! You clicked the bot script!',
      correct: { id: 'cap-id', label: '🛡️ VERIFY HUMAN IDENTITY', subtitle: 'BIOMETRIC PASS', color: '#0284c7' },
    },
    {
      prompt: 'SPEED CHALLENGE: CLICK THE GREEN CHECKMARK ✅!',
      fail: 'You clicked the 400 endless traffic light trap!',
      correct: { id: 'cap-check', label: '✅ INSTANT GREEN PASS', subtitle: 'ONE-CLICK VERIFIED', color: '#0f766e' },
    },
  ];

  const badOptions = [
    { id: 'cap-robot', label: '🤖 BEEP BOOP I AM AI', subtitle: 'SCRAPER BOT DETECTED', color: '#dc2626' },
    { id: 'cap-hydrant', label: '🚒 SELECT 400 TRAFFIC LIGHTS', subtitle: 'CAPTCHA ENDLESS LOOP', color: '#ca8a04' },
  ];

  const picked = pickRandom(variations);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: HUMAN VERIFICATION`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 16: EMOTIONAL DAMAGE (Randomized savage comebacks)
// ----------------------------------------------------------------------
export function getEmotionalDamageStage(stageNumber: number): GeneratedQuestionStage {
  const comebacks = [
    {
      prompt: 'SILENCE THE CRINGE NPC: DEPLOY EMOTIONAL DAMAGE 💥!',
      fail: 'You took 9999 critical psychological damage and went home crying!',
      correct: { id: 'dmg-damage', label: '💥 "EMOTIONAL DAMAGE!"', subtitle: 'CRITICAL EGO SHATTER', color: '#dc2626' },
    },
    {
      prompt: 'UNWANTED OPINION: HIT THEM WITH "WHO ASKED?" 🤫!',
      fail: 'You listened to a 45-minute lecture on crypto from a stranger!',
      correct: { id: 'dmg-asked', label: '🤫 "DID ANYBODY ASK THOUGH?"', subtitle: 'CONVERSATION TERMINATED', color: '#7c3aed' },
    },
    {
      prompt: 'COLD SHUTDOWN: REPLY WITH SINGLE LETTER "K." 🆗!',
      fail: 'You typed out a 7-paragraph essay that nobody will ever read!',
      correct: { id: 'dmg-k', label: '🆗 "k."', subtitle: 'COLDEST POSSIBLE REPLY', color: '#0284c7' },
    },
  ];

  const badOptions = [
    { id: 'dmg-cry', label: '😭 CRY IN THE CORNER', subtitle: 'UNCONDITIONAL SURRENDER', color: '#475569' },
    { id: 'dmg-essay', label: '📝 WRITE 5-PAGE ESSAY', subtitle: 'LOST ALL LEVERAGE', color: '#ca8a04' },
  ];

  const picked = pickRandom(comebacks);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: EMOTIONAL DAMAGE`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 17: RIZZ CHECK (Randomized Rizz lines)
// ----------------------------------------------------------------------
export function getRizzCheckStage(stageNumber: number): GeneratedQuestionStage {
  const rizzVariations = [
    {
      prompt: 'DEPLOY UNLIMITED CHARISMA: TAP SMOOTH TALKER 😎!',
      fail: 'You sent a meme from 2012 and were left on Delivered forever!',
      correct: { id: 'rz-smooth', label: '😎 SMOOTH CHARISMA', subtitle: 'UNLIMITED W RIZZ', color: '#9333ea' },
    },
    {
      prompt: 'SMOOTH OPERATOR: "ARE YOU GOOGLE? YOU HAVE EVERYTHING" 🔍!',
      fail: 'You sent "hey... u up?" at 3 AM and got blocked immediately!',
      correct: { id: 'rz-google', label: '🔍 "ARE YOU GOOGLE?"', subtitle: 'W LINE DELIVERED', color: '#16a34a' },
    },
    {
      prompt: 'CONFIDENCE CHECK: "I MUST BE SNOWING BECAUSE I FELL FOR YOU" ❄️!',
      fail: 'You sent an awkward stuttering voice note with wind noise!',
      correct: { id: 'rz-snow', label: '❄️ "I FELL FOR YOU"', subtitle: 'CHARMING & WITTY', color: '#0284c7' },
    },
  ];

  const badOptions = [
    { id: 'rz-delivered', label: '✉️ LEFT ON DELIVERED', subtitle: 'SINCE 4 WEEKS AGO', color: '#dc2626' },
    { id: 'rz-uup', label: '😶 "HEY... U UP?"', subtitle: 'INSTANT RESTRAINING ORDER', color: '#475569' },
  ];

  const picked = pickRandom(rizzVariations);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: UNLIMITED RIZZ`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 18: UNSUBSCRIBE NINJA (Randomized sneaky marketing text)
// ----------------------------------------------------------------------
export function getUnsubscribeStage(stageNumber: number): GeneratedQuestionStage {
  const variations = [
    {
      prompt: 'FIND THE MICROSCOPIC GRAY "unsubscribe" LINK!',
      fail: 'You clicked the flashy button and subscribed to 500 emails/day!',
      correct: { id: 'un-sub', label: 'unsubscribe', subtitle: '(tiny gray text)', color: '#334155' },
    },
    {
      prompt: 'OPT OUT OF SPAM: TAP "Manage Preferences" ⚙️!',
      fail: 'You accidentally confirmed daily promotional SMS alerts!',
      correct: { id: 'un-pref', label: 'Manage Preferences', subtitle: '(hidden bottom link)', color: '#334155' },
    },
    {
      prompt: 'ESCAPE SPAM LIST: TAP "Cancel Subscription" 🚫!',
      fail: 'You upgraded to the Platinum Spam VIP tier for $99/mo!',
      correct: { id: 'un-cancel', label: 'Cancel Subscription', subtitle: '(faded font)', color: '#334155' },
    },
  ];

  const traps = [
    { id: 'un-spam', label: '📬 SEND ME 50 EMAILS/DAY', subtitle: 'BIG FLASHY BLUE BUTTON', color: '#2563eb' },
    { id: 'un-vip', label: '⭐ UPGRADE TO VIP SPAM', subtitle: 'UNLIMITED OFFERS', color: '#16a34a' },
  ];

  const picked = pickRandom(variations);
  const options = shuffle([picked.correct, ...traps]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: SPAM EMAIL NINJA`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: opt.id === picked.correct.id ? 54 : 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: opt.id === picked.correct.id ? '#94a3b8' : '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 19: SUS IMPOSTOR (Randomized Impostor Archetypes)
// ----------------------------------------------------------------------
export function getImpostorStage(stageNumber: number): GeneratedQuestionStage {
  const impostorSets = [
    { odd: '👽', twin: '🤖', prompt: 'FIND THE ALIEN AMONG ANDROIDS 👽!' },
    { odd: '🐱', twin: '🐶', prompt: 'FIND THE CAT SNEAKING AMONG DOGS 🐱!' },
    { odd: '🍍', twin: '🍎', prompt: 'FIND THE PINEAPPLE IN THE ORCHARD 🍍!' },
    { odd: '⭐', twin: '🌙', prompt: 'FIND THE SHINING STAR AMONG MOONS ⭐!' },
    { odd: '8', twin: 'B', prompt: 'FIND NUMBER 8 HIDDEN AMONG Bs!' },
  ];

  const chosen = pickRandom(impostorSets);
  const coords = shuffle([
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ]);

  return {
    title: `STAGE ${stageNumber}: SUS IMPOSTOR`,
    instruction: chosen.prompt,
    failBlurb: 'That was an innocent crewmate! The real impostor remains sus!',
    targets: [
      {
        id: 'imp-odd',
        x: coords[0].x,
        y: coords[0].y,
        size: 60,
        color: '#ef4444',
        label: chosen.odd,
        subtitle: 'SUS!',
        textColor: '#ffffff',
        isCorrect: true,
      },
      {
        id: 'imp-t1',
        x: coords[1].x,
        y: coords[1].y,
        size: 60,
        color: '#06b6d4',
        label: chosen.twin,
        subtitle: 'CREW',
        textColor: '#ffffff',
        isCorrect: false,
      },
      {
        id: 'imp-t2',
        x: coords[2].x,
        y: coords[2].y,
        size: 60,
        color: '#06b6d4',
        label: chosen.twin,
        subtitle: 'CREW',
        textColor: '#ffffff',
        isCorrect: false,
      },
      {
        id: 'imp-t3',
        x: coords[3].x,
        y: coords[3].y,
        size: 60,
        color: '#06b6d4',
        label: chosen.twin,
        subtitle: 'CREW',
        textColor: '#ffffff',
        isCorrect: false,
      },
    ],
  };
}

// ----------------------------------------------------------------------
// STAGE 20: OVERTHINKING (Randomized midnight mind traps)
// ----------------------------------------------------------------------
export function getOverthinkingStage(stageNumber: number): GeneratedQuestionStage {
  const choices = [
    {
      prompt: 'GO TO SLEEP! DO NOT RELIVE 2017 CRINGE!',
      fail: 'You remembered an awkward high five from 7 years ago and stayed awake until 5 AM!',
      correct: { id: 'ov-sleep', label: '😴 GO TO SLEEP (PEACE)', subtitle: 'RESTFUL 8 HOURS', color: '#0284c7' },
    },
    {
      prompt: 'BEDTIME RULE: PUT PHONE ON DO NOT DISTURB 🌙!',
      fail: 'A midnight meme notification woke you up and sucked you into an 8-hour rabbit hole!',
      correct: { id: 'ov-dnd', label: '🌙 DO NOT DISTURB', subtitle: 'ZERO DISTRACTIONS', color: '#16a34a' },
    },
    {
      prompt: 'CALM THE MIND: TURN ON DEEP SLEEP RAIN SOUNDS 🌧️!',
      fail: 'You chose to re-read passive aggressive emails in the dark!',
      correct: { id: 'ov-rain', label: '🌧️ RAIN SOUNDS', subtitle: 'FALL ASLEEP IN 5 MINS', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'ov-cringe', label: '💀 REMEMBER 2017 CRINGE', subtitle: 'INTERNAL SCREAMING', color: '#dc2626' },
    { id: 'ov-doom', label: '📱 3 MORE HOURS OF REELS', subtitle: 'BRAIN CELLS MELTING', color: '#ea580c' },
  ];

  const picked = pickRandom(choices);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: MIDNIGHT OVERTHINKING`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 24: QUICK MATH (Dynamically Generated Arithmetic Problems)
// ----------------------------------------------------------------------
export function getQuickMathStage(stageNumber: number): GeneratedQuestionStage {
  const problemTypes = [
    () => {
      // a + b * c
      const a = Math.floor(Math.random() * 6) + 3; // 3 to 8
      const b = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const c = Math.floor(Math.random() * 4) + 2; // 2 to 5
      const ans = a + b * c;
      const trapAns = (a + b) * c; // ignoring PEMDAS
      return {
        prompt: `SOLVE: ${a} + ${b} × ${c} = ? (REMEMBER PEMDAS)`,
        fail: `PEMDAS rule! Multiply first: ${b} × ${c} = ${b * c}, then + ${a} = ${ans}!`,
        correct: ans,
        distractors: [trapAns, ans + 2, ans - 1],
      };
    },
    () => {
      // a * b - c
      const a = Math.floor(Math.random() * 5) + 4; // 4 to 8
      const b = Math.floor(Math.random() * 4) + 3; // 3 to 6
      const c = Math.floor(Math.random() * 5) + 2; // 2 to 6
      const ans = a * b - c;
      return {
        prompt: `RAPID MATH: ${a} × ${b} - ${c} = ?`,
        fail: `Wrong calculation! ${a} × ${b} = ${a * b}, minus ${c} = ${ans}!`,
        correct: ans,
        distractors: [ans + 3, ans - 2, a * (b - c)],
      };
    },
    () => {
      // 7 + 7 ÷ 7
      return {
        prompt: 'SOLVE: 7 + 7 ÷ 7 = ? (ORDER OF OPERATIONS)',
        fail: 'PEMDAS failed you! 7 ÷ 7 = 1, then 7 + 1 = 8!',
        correct: 8,
        distractors: [2, 7, 14],
      };
    },
    () => {
      // a^2 - b
      const a = Math.floor(Math.random() * 4) + 4; // 4, 5, 6, 7
      const b = Math.floor(Math.random() * 5) + 3; // 3 to 7
      const ans = a * a - b;
      return {
        prompt: `QUICK SQUARE: ${a}² - ${b} = ?`,
        fail: `${a}² is ${a * a}, minus ${b} equals ${ans}!`,
        correct: ans,
        distractors: [a * 2 - b, ans + 4, ans - 3],
      };
    },
  ];

  const gen = pickRandom(problemTypes)();
  const options = assignShuffledColors(shuffle([
    { val: gen.correct, isCorrect: true, subtitle: 'CORRECT!' },
    { val: gen.distractors[0], isCorrect: false, subtitle: 'NOOB TRAP' },
    { val: gen.distractors[1], isCorrect: false, subtitle: 'OFF BY A BIT' },
    { val: gen.distractors[2], isCorrect: false, subtitle: 'WILD GUESS' },
  ]));

  const gridPositions = [
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ];

  return {
    title: `STAGE ${stageNumber}: QUICK MAFS`,
    instruction: gen.prompt,
    failBlurb: gen.fail,
    targets: options.map((opt, idx) => ({
      id: `math-opt-${idx}`,
      x: gridPositions[idx].x,
      y: gridPositions[idx].y,
      size: 64,
      color: opt.color,
      label: `${opt.val}`,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.isCorrect,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 25: USB ORIENTATION (Randomized USB dilemmas)
// ----------------------------------------------------------------------
export function getUsbStage(stageNumber: number): GeneratedQuestionStage {
  const variations = [
    {
      prompt: 'PLUG IN USB: 3RD FLIP IS ALWAYS THE MAGIC FIT!',
      fail: 'You jammed it in sideways and crushed the motherboards pins!',
      correct: { id: 'usb-flip3', label: '🔌 3RD FLIP (PERFECT FIT)', subtitle: 'PHYSICS CERTAINTY', color: '#0284c7' },
    },
    {
      prompt: 'MODERN TECH: USE USB-C (WORKS IN BOTH DIRECTIONS)!',
      fail: 'You spent 5 minutes looking for the right side of a USB-C cable!',
      correct: { id: 'usb-c', label: '⚡ REVERSIBLE USB-C', subtitle: 'ZERO FLIPPING NEEDED', color: '#16a34a' },
    },
    {
      prompt: 'PRO TIP: ALIGN THE USB LOGO FACING UPWARDS 🔝!',
      fail: 'Logo was facing the carpet! Jammed into the ethernet port!',
      correct: { id: 'usb-logo', label: '🔝 LOGO FACING UP', subtitle: 'SLIDES IN SMOOTHLY', color: '#7c3aed' },
    },
  ];

  const traps = [
    { id: 'usb-side1', label: '❌ 1ST TRY (DOESN\'T FIT)', subtitle: 'UNIVERSAL RULE', color: '#dc2626' },
    { id: 'usb-force', label: '🔨 FORCE IT HARDER', subtitle: 'BENDS MOTHERBOARD', color: '#ca8a04' },
  ];

  const picked = pickRandom(variations);
  const options = shuffle([picked.correct, ...traps]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: USB QUANTUM PUZZLE`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 26: SPOILER ALERT (Randomized movie safe reviews)
// ----------------------------------------------------------------------
export function getSpoilerStage(stageNumber: number): GeneratedQuestionStage {
  const safeReviews = [
    { id: 'sp-sound', label: '🎬 "GREAT SOUNDTRACK & PACING"', subtitle: '100% SPOILER-FREE', prompt: 'TAP THE SAFE NON-SPOILER REVIEW!' },
    { id: 'sp-acting', label: '🌟 "CINEMATOGRAPHY WAS 10/10"', subtitle: 'SAFE PRAISE ONLY', prompt: 'DODGE SPOILERS: TAP THE VISUAL APPRECIATION!' },
    { id: 'sp-director', label: '🍿 "DIRECTOR BROUGHT THEIR A-GAME"', subtitle: 'ZERO PLOT LEAKS', prompt: 'FIND THE PURE SPOILER-FREE CRITIC QUOTE!' },
  ];

  const spoilers = [
    { id: 'sp-dies', label: '💀 "HERO DIES AT THE 2HR MARK"', subtitle: 'CRITICAL PLOT RUINED', color: '#dc2626' },
    { id: 'sp-villain', label: '😱 "THE DOG WAS THE VILLAIN"', subtitle: 'UNFORGIVABLE SPOILER', color: '#ea580c' },
    { id: 'sp-dream', label: '💤 "IT WAS ALL A DREAM AT THE END"', subtitle: 'WORST PLOT TWIST', color: '#475569' },
  ];

  const chosenSafe = pickRandom(safeReviews);
  const chosenSpoilers = shuffle(spoilers).slice(0, 2);
  const options = assignShuffledColors(shuffle([chosenSafe, ...chosenSpoilers]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: MOVIE SPOILER DODGE`,
    instruction: chosenSafe.prompt,
    failBlurb: 'Movie ending spoiled! You found out the secret plot twist!',
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === chosenSafe.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 30: STROOP LIAR (Randomized ink vs word challenge)
// ----------------------------------------------------------------------
export function getStroopStage(stageNumber: number): GeneratedQuestionStage {
  const colors = [
    { name: 'RED', code: '#ef4444' },
    { name: 'BLUE', code: '#3b82f6' },
    { name: 'GREEN', code: '#22c55e' },
    { name: 'YELLOW', code: '#eab308' },
    { name: 'PURPLE', code: '#a855f7' },
  ];

  const shuffledColors = shuffle(colors);
  const wordColor = shuffledColors[0]; // The word text
  const inkColor = shuffledColors[1];  // The ink color

  const askForInk = Math.random() > 0.5;

  const targetColorCode = askForInk ? inkColor.code : wordColor.code;
  const targetLabel = askForInk ? `${inkColor.name} INK` : `${wordColor.name} INK`;

  const instruction = askForInk
    ? `TAP THE INK COLOR: WORD SAYS "${wordColor.name}" IN ${inkColor.name} INK!`
    : `TAP THE WRITTEN WORD: WORD SAYS "${wordColor.name}" IN ${inkColor.name} INK!`;

  const failBlurb = askForInk
    ? `Cognitive trap! The text spelled ${wordColor.name}, but the INK was ${inkColor.name}!`
    : `Brain trick! You clicked the ink color instead of reading the written word!`;

  const choices = shuffle([
    { id: 'st-correct', code: targetColorCode, label: targetLabel, isCorrect: true, sub: 'CORRECT' },
    { id: 'st-trick', code: askForInk ? wordColor.code : inkColor.code, label: askForInk ? `${wordColor.name} INK` : `${inkColor.name} INK`, isCorrect: false, sub: 'BRAIN TRAP' },
    { id: 'st-decoy1', code: shuffledColors[2].code, label: `${shuffledColors[2].name} INK`, isCorrect: false, sub: 'DECOY' },
    { id: 'st-decoy2', code: shuffledColors[3].code, label: `${shuffledColors[3].name} INK`, isCorrect: false, sub: 'DECOY' },
  ]);

  const gridPositions = [
    { x: 34, y: 44 },
    { x: 66, y: 44 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ];

  return {
    title: `STAGE ${stageNumber}: THE STROOP LIAR`,
    instruction,
    failBlurb,
    targets: choices.map((c, idx) => ({
      id: c.id,
      x: gridPositions[idx].x,
      y: gridPositions[idx].y,
      size: 64,
      color: c.code,
      label: c.label,
      subtitle: c.sub,
      textColor: '#ffffff',
      isCorrect: c.isCorrect,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 32: MATH MISDIRECTION (Cognitive Teasers)
// ----------------------------------------------------------------------
export function getMathMisdirectionStage(stageNumber: number): GeneratedQuestionStage {
  const teasers = [
    {
      prompt: 'BAT & BALL = $1.10. BAT COSTS $1.00 MORE. BALL COST?',
      fail: 'Classic cognitive trap! If ball is $0.10, total would be $1.20! Correct is $0.05!',
      correct: { id: 'm-5c', label: '💲 $0.05 (FIVE CENTS)', subtitle: '$1.05 + $0.05 = $1.10', color: '#16a34a' },
      bad1: { id: 'm-10c', label: '💲 $0.10 (TEN CENTS)', subtitle: 'POPULAR TRAP', color: '#dc2626' },
      bad2: { id: 'm-1d', label: '💲 $1.00', subtitle: 'BAT MINUS BALL', color: '#475569' },
    },
    {
      prompt: '5 MACHINES MAKE 5 WIDGETS IN 5 MINS. 100 MACHINES MAKE 100 IN?',
      fail: 'Each machine takes 5 mins per widget! 100 machines still take 5 minutes!',
      correct: { id: 'm-5m', label: '⏱️ 5 MINUTES', subtitle: 'PARALLEL PRODUCTION', color: '#16a34a' },
      bad1: { id: 'm-100m', label: '⏱️ 100 MINUTES', subtitle: 'INTUITION TRAP', color: '#dc2626' },
      bad2: { id: 'm-20m', label: '⏱️ 20 MINUTES', subtitle: 'MATH ERROR', color: '#475569' },
    },
    {
      prompt: 'YOU PASS THE RUNNER IN 2ND PLACE. WHAT PLACE ARE YOU IN NOW?',
      fail: 'If you overtake 2nd place, you become 2nd place! Not 1st place!',
      correct: { id: 'm-2nd', label: '🥈 2ND PLACE', subtitle: 'YOU TOOK THEIR SPOT', color: '#16a34a' },
      bad1: { id: 'm-1st', label: '🥇 1ST PLACE', subtitle: 'LEADER IS STILL AHEAD', color: '#dc2626' },
      bad2: { id: 'm-3rd', label: '🥉 3RD PLACE', subtitle: 'BACKWARDS MATH', color: '#475569' },
    },
  ];

  const picked = pickRandom(teasers);
  const options = assignShuffledColors(shuffle([picked.correct, picked.bad1, picked.bad2]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: COGNITIVE TRAP`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 33: LOW STORAGE (Randomized file cleaning)
// ----------------------------------------------------------------------
export function getLowStorageStage(stageNumber: number): GeneratedQuestionStage {
  const choices = [
    {
      prompt: 'STORAGE AT 99.9%! FREE 64GB: DELETE 50,000 MEMES 🗑️!',
      fail: 'You wiped System32/OS instead of deleting stale memes from 2019!',
      correct: { id: 'st-memes', label: '🗑️ DELETE 50K MEMES', subtitle: '64 GB INSTANTLY FREED', color: '#16a34a' },
    },
    {
      prompt: 'IPHONE STORAGE FULL: CLEAR 25GB CACHE & TEMP FILES 🧹!',
      fail: 'You deleted all your irreplaceable baby photos forever!',
      correct: { id: 'st-cache', label: '🧹 CLEAR APP CACHE', subtitle: '25 GB FREED SAFELY', color: '#0284c7' },
    },
    {
      prompt: 'OUT OF MEMORY: REMOVE 4,000 DUPLICATE SCREENSHOTS 📱!',
      fail: 'You formatted the entire device partition!',
      correct: { id: 'st-shots', label: '📱 PURGE DUPLICATE SCREENSHOTS', subtitle: 'CLEAN PHOTO ROLL', color: '#7c3aed' },
    },
  ];

  const traps = [
    { id: 'st-os', label: '⚠️ DELETE OPERATING SYSTEM', subtitle: 'DEVICE BRICKED', color: '#dc2626' },
    { id: 'st-photos', label: '📷 DELETE CHILDHOOD PHOTOS', subtitle: 'IRREPLACEABLE MEMORIES GONE', color: '#ca8a04' },
  ];

  const picked = pickRandom(choices);
  const options = shuffle([picked.correct, ...traps]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: STORAGE PANIC`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 36: DISCORD PING (Randomized @everyone chaos)
// ----------------------------------------------------------------------
export function getDiscordPingStage(stageNumber: number): GeneratedQuestionStage {
  const variations = [
    {
      prompt: 'RANDOM @everyone SPAM: MUTE SERVER FOREVER 🔕!',
      fail: 'You replied "@everyone WHO PINGED" and triggered 100,000 more notifications!',
      correct: { id: 'dc-mute', label: '🔕 MUTE SERVER FOREVER', subtitle: 'ETERNAL SILENCE', color: '#16a34a' },
    },
    {
      prompt: 'UNWANTED GHOST PING: CLOSE DISCORD APP 🛑!',
      fail: 'You unmuted all notification sounds and destroyed your eardrums!',
      correct: { id: 'dc-close', label: '🛑 FORCE QUIT APPLICATION', subtitle: 'PEACE RESTORED', color: '#0284c7' },
    },
    {
      prompt: 'RAID INCOMING: SUPPRESS ALL @everyone ROLES 🛡️!',
      fail: 'You joined the voice channel with an unmuted fan!',
      correct: { id: 'dc-suppress', label: '🛡️ SUPPRESS ALL ROLES', subtitle: 'ZERO PING SOUNDS', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'dc-reply', label: '📢 REPLY "@everyone WHY"', subtitle: 'WAKES 50,000 GAMERS', color: '#dc2626' },
    { id: 'dc-sound', label: '🔊 TURN ON MAX VOLUME SOUNDS', subtitle: 'EARDRUM SHATTER', color: '#ca8a04' },
  ];

  const picked = pickRandom(variations);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: @everyone SPAM`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 48: HIGH STAKES BOMB (Randomized Wire Cutting)
// ----------------------------------------------------------------------
export function getBombWireStage(stageNumber: number): GeneratedQuestionStage {
  const wires = [
    { id: 'wire-blue', name: 'BLUE', code: '#0284c7', label: '✂️ BLUE WIRE' },
    { id: 'wire-green', name: 'GREEN', code: '#16a34a', label: '✂️ GREEN WIRE' },
    { id: 'wire-yellow', name: 'YELLOW', code: '#eab308', label: '✂️ YELLOW WIRE' },
    { id: 'wire-cyan', name: 'CYAN', code: '#06b6d4', label: '✂️ CYAN WIRE' },
  ];

  const pickedWire = pickRandom(wires);
  const otherWires = wires.filter((w) => w.id !== pickedWire.id);
  const selectedOther = shuffle(otherWires).slice(0, 2);

  const redDetonator = {
    id: 'wire-red',
    name: 'RED',
    code: '#dc2626',
    label: '✂️ RED WIRE (DETONATOR)',
    subtitle: 'BOOOOM!',
  };

  const choices = shuffle([
    { ...pickedWire, subtitle: 'DEFUSAL CODE MATCH', isCorrect: true },
    { ...selectedOther[0], subtitle: 'LIVE DETONATOR', isCorrect: false },
    redDetonator,
  ]);

  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: DEFUSAL PROTOCOL`,
    instruction: `DEFUSAL MANUAL: CUT THE ${pickedWire.name} WIRE! DO NOT TOUCH RED!`,
    failBlurb: `BOOOOM! You cut the wrong wire and triggered the detonator!`,
    targets: choices.map((w, idx) => ({
      id: w.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: w.code,
      label: w.label,
      subtitle: w.subtitle,
      textColor: '#ffffff',
      isCorrect: (w as any).isCorrect === true,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 22: ELEVATOR COURTESY (Randomized Door Choice)
// ----------------------------------------------------------------------
export function getElevatorStage(stageNumber: number): GeneratedQuestionStage {
  const scenarios = [
    {
      prompt: 'NEIGHBOR SPRINTING TO DOORS: PRESS HOLD OPEN ◀️▶️!',
      fail: 'You slammed the doors in your neighbor\'s face! Villain behavior!',
      correct: { id: 'el-open', label: '◀️▶️ HOLD OPEN', subtitle: 'WHOLESOME NEIGHBOR', color: '#16a34a' },
      bad1: { id: 'el-close', label: '▶️◀️ MASH CLOSE DOOR', subtitle: 'AVOID EYE CONTACT', color: '#dc2626' },
    },
    {
      prompt: 'URGENT FLIGHT DEPARTURE: MASH CLOSE DOOR ▶️◀️!',
      fail: 'You held the door and missed your flight to Tokyo!',
      correct: { id: 'el-close', label: '▶️◀️ MASH CLOSE DOOR', subtitle: 'HURRY TO GATE', color: '#16a34a' },
      bad1: { id: 'el-open', label: '◀️▶️ HOLD OPEN', subtitle: 'TOO SLOW', color: '#dc2626' },
    },
  ];

  const picked = pickRandom(scenarios);
  const badEmergency = { id: 'el-stop', label: '🚨 EMERGENCY STOP', subtitle: 'EVERYONE TRAPPED', color: '#ca8a04' };
  const options = assignShuffledColors(shuffle([picked.correct, picked.bad1, badEmergency]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: ELEVATOR PROTOCOL`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 28: OPPOSITE DAY (Randomized Colors & Conditions)
// ----------------------------------------------------------------------
export function getOppositeDayStage(stageNumber: number): GeneratedQuestionStage {
  const pairs = [
    {
      prompt: 'OPPOSITE DAY: "DO NOT TAP THE PURPLE BUTTON"',
      fail: 'On Opposite Day, "DO NOT TAP" means you MUST tap it!',
      colorA: { name: 'PURPLE', code: '#a855f7', isCorrect: true },
      colorB: { name: 'ORANGE', code: '#f97316', isCorrect: false },
    },
    {
      prompt: 'OPPOSITE DAY: "TAP THE CYAN BUTTON"',
      fail: 'On Opposite Day, "TAP CYAN" means tap the other button (AMBER)!',
      colorA: { name: 'CYAN', code: '#06b6d4', isCorrect: false },
      colorB: { name: 'AMBER', code: '#f59e0b', isCorrect: true },
    },
    {
      prompt: 'OPPOSITE DAY: "AVOID THE EMERALD TARGET"',
      fail: 'On Opposite Day, "AVOID" means touch it!',
      colorA: { name: 'EMERALD', code: '#22c55e', isCorrect: true },
      colorB: { name: 'RUBY', code: '#ef4444', isCorrect: false },
    },
  ];

  const picked = pickRandom(pairs);
  const xPositions = shuffle([32, 68]);

  return {
    title: `STAGE ${stageNumber}: OPPOSITE DAY`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: [
      {
        id: 'opp-a',
        x: xPositions[0],
        y: 50,
        size: 68,
        color: picked.colorA.code,
        label: picked.colorA.name,
        textColor: '#ffffff',
        isCorrect: picked.colorA.isCorrect,
      },
      {
        id: 'opp-b',
        x: xPositions[1],
        y: 50,
        size: 68,
        color: picked.colorB.code,
        label: picked.colorB.name,
        textColor: '#ffffff',
        isCorrect: picked.colorB.isCorrect,
      },
    ],
  };
}

// ----------------------------------------------------------------------
// STAGE 29: SNEEZING HOLD (Randomized Silent Library Techniques)
// ----------------------------------------------------------------------
export function getSneezingHoldStage(stageNumber: number): GeneratedQuestionStage {
  const techniques = [
    {
      prompt: 'EXPLOSIVE SNEEZE INCOMING: TAP "SILENT ELBOW MUFFLE" 🤫!',
      fail: 'ACHOOO! You sneezed with the force of a sonic rocket in dead silence!',
      correct: { id: 'sn-elbow', label: '🤫 SILENT ELBOW MUFFLE', subtitle: 'ZERO SOUND ESCAPED', color: '#0891b2' },
    },
    {
      prompt: 'NOSE TICKLING: TAP "PINCH NOSE BRIDGE" 👃!',
      fail: 'You failed to pinch in time and sneezed across the examination paper!',
      correct: { id: 'sn-pinch', label: '👃 PINCH NOSE BRIDGE', subtitle: 'SNEEZE DEFUSED', color: '#16a34a' },
    },
    {
      prompt: 'QUIET SANCTUARY: TAP "HOLD BREATH FOR 5 SECONDS" 🫁!',
      fail: 'You choked on air and started a coughing fit in the quiet zone!',
      correct: { id: 'sn-breath', label: '🫁 HOLD BREATH (5 SECS)', subtitle: 'TICKLE VANISHED', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'sn-boom', label: '💥 130dB MEGAPHONE SNEEZE', subtitle: 'SHATTERS WINDOWS', color: '#dc2626' },
    { id: 'sn-choke', label: '🤧 LOUD CHOKING COUGH', subtitle: 'ENTIRE ROOM STARES', color: '#ca8a04' },
  ];

  const picked = pickRandom(techniques);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: QUIET LIBRARY EXAM`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 37: PHANTOM VIBRATION (Randomized Incoming Alert)
// ----------------------------------------------------------------------
export function getPhantomVibrationStage(stageNumber: number): GeneratedQuestionStage {
  const callers = [
    {
      prompt: 'ANSWER REAL PHONE CALL: "MOM CALLING" 📞!',
      fail: 'You ignored mom\'s real call and tapped an imaginary phantom buzz!',
      correct: { id: 'pv-mom', label: '📞 MOM CALLING (REAL)', subtitle: 'ACTUALLY RINGING', color: '#16a34a' },
    },
    {
      prompt: 'DELIVERY ARRIVED: ANSWER "DOORDASH DRIVER" 🍕!',
      fail: 'You grabbed pocket lint while your pizza sat outside in the cold!',
      correct: { id: 'pv-food', label: '🍕 DOORDASH DRIVER (REAL)', subtitle: 'FOOD AT DOOR', color: '#0284c7' },
    },
    {
      prompt: 'IMPORTANT NOTIFICATION: ANSWER "CLINIC RESULTS" 🏥!',
      fail: 'You hallucinated an incoming text from nobody!',
      correct: { id: 'pv-clinic', label: '🏥 CLINIC APPOINTMENT', subtitle: 'CONFIRM TIME', color: '#7c3aed' },
    },
  ];

  const phantoms = [
    { id: 'pv-ghost', label: '👻 GHOST POCKET BUZZ', subtitle: 'BRAIN HALLUCINATED', color: '#dc2626' },
    { id: 'pv-lint', label: '📴 POCKET LINT', subtitle: 'NOT EVEN A PHONE', color: '#475569' },
  ];

  const picked = pickRandom(callers);
  const options = assignShuffledColors(shuffle([picked.correct, ...phantoms]));
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: PHANTOM POCKET BUZZ`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 38: SPEED TYPO (Randomized Keyboard Key)
// ----------------------------------------------------------------------
export function getSpeedTypoStage(stageNumber: number): GeneratedQuestionStage {
  const keys = [
    { key: 'W', desc: 'COMMON W (WINNER)', prompt: 'FASTEST FINGERS: TAP "W" FOR THE WIN!', color: '#16a34a' },
    { key: 'F', desc: 'PAY RESPECTS', prompt: 'GAMER REFLEX: TAP "F" TO PAY RESPECTS!', color: '#0284c7' },
    { key: 'G', desc: 'GOOD GAME', prompt: 'CLUTCH ROUND: TAP "G" FOR GOOD GAME!', color: '#7c3aed' },
    { key: 'R', desc: 'TACTICAL RELOAD', prompt: 'MAGAZINE EMPTY: TAP "R" TO RELOAD!', color: '#0d9488' },
  ];

  const picked = pickRandom(keys);
  const badKeys = [
    { key: 'L', desc: 'TAKE THE L', color: '#dc2626' },
    { key: 'Q', desc: 'RAGE QUIT', color: '#475569' },
  ];

  const xPositions = shuffle([28, 50, 72]);
  const options = assignShuffledColors(shuffle([
    { id: `key-${picked.key}`, label: `⌨️ ${picked.key}`, subtitle: picked.desc, isCorrect: true },
    { id: `key-${badKeys[0].key}`, label: `⌨️ ${badKeys[0].key}`, subtitle: badKeys[0].desc, isCorrect: false },
    { id: `key-${badKeys[1].key}`, label: `⌨️ ${badKeys[1].key}`, subtitle: badKeys[1].desc, isCorrect: false },
  ]));

  return {
    title: `STAGE ${stageNumber}: KEYBOARD WARRIOR`,
    instruction: picked.prompt,
    failBlurb: 'Skill issue! You mis-pressed the wrong key under adrenaline pressure!',
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: xPositions[idx],
      y: 50,
      size: 64,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.isCorrect,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 40: ODD ONE OUT (Randomized subtle shade difference)
// ----------------------------------------------------------------------
export function getOddOneOutStage(stageNumber: number): GeneratedQuestionStage {
  const palettes = [
    { name: 'INDIGO', base: '#4f46e5', odd: '#818cf8' },
    { name: 'EMERALD', base: '#16a34a', odd: '#4ade80' },
    { name: 'AMBER', base: '#d97706', odd: '#fbbf24' },
    { name: 'ROSE', base: '#e11d48', odd: '#fb7185' },
    { name: 'CYAN', base: '#0891b2', odd: '#38bdf8' },
  ];

  const pal = pickRandom(palettes);
  const coords = shuffle([
    { x: 34, y: 42 },
    { x: 66, y: 42 },
    { x: 34, y: 58 },
    { x: 66, y: 58 },
  ]);

  return {
    title: `STAGE ${stageNumber}: SUBTLE HUE SHIFT`,
    instruction: `FIND THE SQUARE WITH A SLIGHTLY LIGHTER ${pal.name} SHADE!`,
    failBlurb: 'Your eyes deceived you under intense time pressure!',
    targets: [
      {
        id: 'hue-odd',
        x: coords[0].x,
        y: coords[0].y,
        size: 64,
        color: pal.odd,
        label: '■',
        textColor: '#ffffff',
        isCorrect: true,
      },
      {
        id: 'hue-base-1',
        x: coords[1].x,
        y: coords[1].y,
        size: 64,
        color: pal.base,
        label: '■',
        textColor: '#ffffff',
        isCorrect: false,
      },
      {
        id: 'hue-base-2',
        x: coords[2].x,
        y: coords[2].y,
        size: 64,
        color: pal.base,
        label: '■',
        textColor: '#ffffff',
        isCorrect: false,
      },
      {
        id: 'hue-base-3',
        x: coords[3].x,
        y: coords[3].y,
        size: 64,
        color: pal.base,
        label: '■',
        textColor: '#ffffff',
        isCorrect: false,
      },
    ],
  };
}

// ----------------------------------------------------------------------
// STAGE 42: RGB RAPID COUNTING (Randomized Emoji Count)
// ----------------------------------------------------------------------
export function getRgbCountingStage(stageNumber: number): GeneratedQuestionStage {
  const emojiTypes = [
    { icon: '⭐', name: 'STARS' },
    { icon: '🔥', name: 'FLAMES' },
    { icon: '💎', name: 'DIAMONDS' },
    { icon: '⚡', name: 'BOLTS' },
  ];

  const pickedEmoji = pickRandom(emojiTypes);
  const count = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
  const iconsString = Array(count).fill(pickedEmoji.icon).join(' ');

  const xPositions = shuffle([28, 50, 72]);
  const choices = assignShuffledColors(shuffle([
    { val: count, isCorrect: true, sub: 'EXACT' },
    { val: count - 1, isCorrect: false, sub: 'ONE LESS' },
    { val: count + 1, isCorrect: false, sub: 'ONE MORE' },
  ]));

  return {
    title: `STAGE ${stageNumber}: RAPID COUNTING`,
    instruction: `COUNT: ${iconsString} (HOW MANY ${pickedEmoji.name}?)`,
    failBlurb: `Under adrenaline rush you miscounted the ${pickedEmoji.name}!`,
    targets: choices.map((c, idx) => ({
      id: `count-${c.val}`,
      x: xPositions[idx],
      y: 50,
      size: 64,
      color: c.color,
      label: `${c.val}`,
      subtitle: c.sub,
      textColor: '#ffffff',
      isCorrect: c.isCorrect,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 43: TIKTOK SCROLL DETOX (Randomized Healthy Choices)
// ----------------------------------------------------------------------
export function getTiktokScrollStage(stageNumber: number): GeneratedQuestionStage {
  const detoxChoices = [
    {
      prompt: 'ESCAPE INFINITE REELS: TAP "TOUCH GRASS" 🌱!',
      fail: 'You chose "Just 1 more reel" and woke up 4 years in the future!',
      correct: { id: 'tx-grass', label: '🌱 TOUCH GRASS (ESCAPE)', subtitle: 'REAL WORLD OXYGEN', color: '#16a34a' },
    },
    {
      prompt: 'DOPAMINE DETOX: TAP "GO FOR A 15-MIN WALK" 👟!',
      fail: 'You watched an AI voice read Reddit posts for another 3 hours!',
      correct: { id: 'tx-walk', label: '👟 15-MIN SUNSHINE WALK', subtitle: 'RECHARGE ENERGY', color: '#0284c7' },
    },
    {
      prompt: 'BREAK THE ADDICTION: TAP "READ A BOOK" 📚!',
      fail: 'Your attention span disintegrated watching split-screen mobile games!',
      correct: { id: 'tx-book', label: '📚 READ A CHAPTER', subtitle: 'BRAIN RESTORATION', color: '#7c3aed' },
    },
  ];

  const badOptions = [
    { id: 'tx-1more', label: '📱 JUST 1 MORE VIDEO', subtitle: 'ANOTHER 4 HOURS GONE', color: '#dc2626' },
    { id: 'tx-split', label: '🧠 SPLIT SCREEN SURFERS', subtitle: 'ATTENTION SPAN ZERO', color: '#ea580c' },
  ];

  const picked = pickRandom(detoxChoices);
  const options = shuffle([picked.correct, ...badOptions]);
  const yPositions = [36, 50, 64];

  return {
    title: `STAGE ${stageNumber}: DOOMSCROLL DETOX`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: options.map((opt, idx) => ({
      id: opt.id,
      x: 50,
      y: yPositions[idx],
      size: 68,
      color: opt.color,
      label: opt.label,
      subtitle: opt.subtitle,
      textColor: '#ffffff',
      isCorrect: opt.id === picked.correct.id,
    })),
  };
}

// ----------------------------------------------------------------------
// STAGE 47: CHAOS SHUFFLE (Randomized Winning Cup Prize)
// ----------------------------------------------------------------------
export function getChaosShuffleStage(stageNumber: number): GeneratedQuestionStage {
  const prizes = [
    { id: 'cup-crown', label: '👑 CROWN', prompt: 'TRACK THE GOLDEN CROWN CUP 👑!' },
    { id: 'cup-diamond', label: '💎 DIAMOND', prompt: 'EYES ON THE PRIZE: TRACK THE DIAMOND 💎!' },
    { id: 'cup-star', label: '⭐ GOLD STAR', prompt: 'HIGH ROLLER: TRACK THE GOLD STAR ⭐!' },
  ];

  const picked = pickRandom(prizes);
  const cupPositions = shuffle([26, 50, 74]);

  return {
    title: `STAGE ${stageNumber}: THREE-CUP MONTE`,
    instruction: picked.prompt,
    failBlurb: 'Empty cup! The street magician swindled your victory!',
    targets: [
      {
        id: picked.id,
        x: cupPositions[0],
        y: 50,
        size: 64,
        color: '#d97706',
        label: picked.label,
        subtitle: 'WINNER',
        textColor: '#ffffff',
        isCorrect: true,
      },
      {
        id: 'cup-empty1',
        x: cupPositions[1],
        y: 50,
        size: 64,
        color: '#d97706',
        label: '🗑️ EMPTY',
        subtitle: 'NOTHING',
        textColor: '#ffffff',
        isCorrect: false,
      },
      {
        id: 'cup-empty2',
        x: cupPositions[2],
        y: 50,
        size: 64,
        color: '#d97706',
        label: '🪨 ROCK',
        subtitle: 'NOTHING',
        textColor: '#ffffff',
        isCorrect: false,
      },
    ],
  };
}

// ----------------------------------------------------------------------
// STAGE 49: QUANTUM DECISION (Randomized Dilemmas)
// ----------------------------------------------------------------------
export function getQuantumDecisionStage(stageNumber: number): GeneratedQuestionStage {
  const dilemmas = [
    {
      prompt: 'SCHRÖDINGER\'S BOX: PICK BOX A (LUCKY STATE)!',
      fail: 'You picked Box B! The cat collapsed into a defeat timeline!',
      optA: { id: 'box-a', label: '🎁 BOX A (LUCKY)', sub: 'QUANTUM SUCCESS', color: '#7c3aed', isCorrect: true },
      optB: { id: 'box-b', label: '📦 BOX B (CURSED)', sub: 'DEFEAT TRAP', color: '#0284c7', isCorrect: false },
    },
    {
      prompt: 'SCHRÖDINGER\'S BOX: PICK BOX B (WINNING FREQUENCY)!',
      fail: 'You picked Box A! Quantum decoherence caused defeat!',
      optA: { id: 'box-a', label: '📦 BOX A (CURSED)', sub: 'DEFEAT TRAP', color: '#0284c7', isCorrect: false },
      optB: { id: 'box-b', label: '🎁 BOX B (WINNER)', sub: 'QUANTUM SUCCESS', color: '#7c3aed', isCorrect: true },
    },
    {
      prompt: 'MATRIX CHOICE: TAKE THE RED PILL (WAKE UP TO VICTORY)!',
      fail: 'You took the blue pill and forgot how to play video games!',
      optA: { id: 'pill-red', label: '🔴 RED PILL', sub: 'WAKE UP TO VICTORY', color: '#ef4444', isCorrect: true },
      optB: { id: 'pill-blue', label: '🔵 BLUE PILL', sub: 'SWEET IGNORANCE', color: '#3b82f6', isCorrect: false },
    },
  ];

  const picked = pickRandom(dilemmas);
  const xPositions = shuffle([32, 68]);

  return {
    title: `STAGE ${stageNumber}: QUANTUM DECISION`,
    instruction: picked.prompt,
    failBlurb: picked.fail,
    targets: [
      {
        id: picked.optA.id,
        x: xPositions[0],
        y: 50,
        size: 68,
        color: picked.optA.color,
        label: picked.optA.label,
        subtitle: picked.optA.sub,
        textColor: '#ffffff',
        isCorrect: picked.optA.isCorrect,
      },
      {
        id: picked.optB.id,
        x: xPositions[1],
        y: 50,
        size: 68,
        color: picked.optB.color,
        label: picked.optB.label,
        subtitle: picked.optB.sub,
        textColor: '#ffffff',
        isCorrect: picked.optB.isCorrect,
      },
    ],
  };
}

// ----------------------------------------------------------------------
// STAGE 50: FINAL BOSS OVERDRIVE (Randomized Boss Core Target)
// ----------------------------------------------------------------------
export function getFinalBossStage(stageNumber: number): GeneratedQuestionStage {
  const bosses = [
    { label: '👑 GRANDMASTER CORE', prompt: 'THE 50TH STAGE! HIT THE GRANDMASTER CORE TO WIN!' },
    { label: '⚡ HYPER-NUCLEUS', prompt: 'STAGE 50 OVERDRIVE: CRACK THE HYPER-NUCLEUS!' },
    { label: '🌟 TRANSCENDENT ORB', prompt: 'FINAL HURDLE: STRIKE THE TRANSCENDENT ORB!' },
  ];

  const chosenBoss = pickRandom(bosses);
  const coords = shuffle([
    { x: 50, y: 50, isBoss: true },
    { x: 30, y: 35, isBoss: false },
    { x: 70, y: 65, isBoss: false },
  ]);

  return {
    title: `STAGE ${stageNumber}: GRAND FINALE TRANSCENDENCE`,
    instruction: chosenBoss.prompt,
    failBlurb: 'Fell at the very final step! Stage 50 proved too insane!',
    targets: coords.map((c, idx) => ({
      id: `boss-${idx}`,
      x: c.x,
      y: c.y,
      size: c.isBoss ? 80 : 54,
      color: '#dc2626',
      label: c.isBoss ? chosenBoss.label : '💥 OVERHEAT',
      subtitle: c.isBoss ? 'FINAL VICTORY CORE' : 'FATAL TRAP',
      textColor: c.isBoss ? '#000000' : '#ffffff',
      isCorrect: c.isBoss,
    })),
  };
}
