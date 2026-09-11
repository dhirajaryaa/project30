const AVATAR_BG = "e08a5c";

export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=${AVATAR_BG}&radius=8`;
}

export function newAvatarSeed(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let seed = "";
  for (let i = 0; i < 12; i++) {
    seed += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return seed;
}