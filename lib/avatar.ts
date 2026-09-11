const AVATAR_BG = "e08a5c";

const AVATAR_OPTS =
  "beardProbability=0&gestureProbability=0&glassesProbability=0&clothesGraphicProbability=0";

export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/10.x/notionists/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=${AVATAR_BG}&${AVATAR_OPTS}&radius=10`;
}

export function newAvatarSeed(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let seed = "";
  for (let i = 0; i < 12; i++) {
    seed += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return seed;
}