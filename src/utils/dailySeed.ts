// Section 15 & 42: Client-side Deterministic Daily Challenge Algorithm

export function createDailySeed(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Linear Congruential Generator (LCG) for deterministic random numbers
export function createLCG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateDailyChallengeSequence(dateString: string, count: number = 10) {
  const seed = createDailySeed(dateString);
  const random = createLCG(seed);
  const challengeTypes = [
    'TAP_TARGET',
    'COLOR_TARGET',
    'MOVING_TARGET',
    'SHRINKING_TARGET',
    'MULTI_TAP',
    'SEQUENCE',
    'REACTION',
  ];

  const sequence = [];
  for (let i = 1; i <= count; i++) {
    const idx = Math.floor(random() * challengeTypes.length);
    const timeLimit = Math.max(800, Math.floor(2200 - i * 90 + random() * 200));
    sequence.push({
      step: i,
      type: challengeTypes[idx],
      timeLimitMs: timeLimit,
      targetCount: idx === 1 ? 3 : idx === 5 ? 3 : 1,
    });
  }
  return { seed, sequence };
}
