import type { AvatarKey } from '../types';

/** Les avatars de profil — un emblème "bobine de film" décliné en
 *  plusieurs couleurs, dessiné en CSS via `ReelEmblem` (pas de nouvel
 *  asset). Tous débloqués d'office : c'est une identité visuelle, pas une
 *  rareté à collectionner comme les dos de carte (voir `cardBacks.ts`). */
export interface AvatarSkin {
  key: AvatarKey;
  name: string;
  bg: string;
  holeColor: string;
}

export const AVATARS: AvatarSkin[] = [
  { key: 'classique', name: 'Classique', bg: 'var(--color-neutral-700)', holeColor: 'var(--color-neutral-300)' },
  { key: 'projecteur', name: 'Projecteur', bg: 'linear-gradient(160deg,var(--color-accent-400),var(--color-accent-700))', holeColor: 'var(--color-accent-100)' },
  { key: 'studio', name: 'Studio', bg: 'linear-gradient(160deg,var(--color-neutral-600),var(--color-neutral-900))', holeColor: 'var(--color-neutral-200)' },
  { key: 'dore', name: 'Doré', bg: 'linear-gradient(160deg,#ffe9b0,#c99a3a)', holeColor: '#4a3410' },
  { key: 'nuit-violette', name: 'Nuit violette', bg: 'linear-gradient(160deg,var(--color-accent-500),var(--color-accent-900))', holeColor: 'var(--color-accent-100)' },
  { key: 'plateau-vert', name: 'Plateau vert', bg: 'linear-gradient(160deg,#8fbf9e,#2f5c42)', holeColor: '#e6fff0' },
  { key: 'ecran-bleu', name: 'Écran bleu', bg: 'linear-gradient(150deg,#8ec2f5,#2f5c9e)', holeColor: '#e8f2ff' },
  { key: 'onyx', name: 'Onyx', bg: 'var(--color-bg)', holeColor: 'var(--color-accent-300)' },
];

export const DEFAULT_AVATAR: AvatarKey = 'projecteur';

export const avatarByKey = (key: AvatarKey): AvatarSkin => AVATARS.find((a) => a.key === key) ?? AVATARS[0];
