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
  { key: 'classique', name: 'Classique', bg: '#ffd2b4', holeColor: '#8c491a' },
  { key: 'projecteur', name: 'Projecteur', bg: 'linear-gradient(160deg,#ffd2b4,#f6a06b)', holeColor: '#8c491a' },
  { key: 'studio', name: 'Studio', bg: 'linear-gradient(160deg,#b2622d,#643312)', holeColor: '#2b1608' },
  { key: 'dore', name: 'Doré', bg: 'linear-gradient(160deg,#ffe9b0,#c99a3a)', holeColor: '#4a3410' },
  { key: 'nuit-violette', name: 'Nuit violette', bg: 'linear-gradient(160deg,#a678d8,#43206d)', holeColor: '#160a24' },
  { key: 'plateau-vert', name: 'Plateau vert', bg: 'linear-gradient(160deg,#c3dba3,#5b7a3a)', holeColor: '#2f4a1a' },
  { key: 'ecran-bleu', name: 'Écran bleu', bg: 'linear-gradient(150deg,#a9cdf5,#2f5c9e)', holeColor: '#e8f2ff' },
  { key: 'onyx', name: 'Onyx', bg: '#201e1d', holeColor: '#ffe9b0' },
];

export const DEFAULT_AVATAR: AvatarKey = 'projecteur';

export const avatarByKey = (key: AvatarKey): AvatarSkin => AVATARS.find((a) => a.key === key) ?? AVATARS[0];
