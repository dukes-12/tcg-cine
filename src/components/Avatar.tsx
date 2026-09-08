import { useState, type CSSProperties } from 'react';
import { avatarByKey } from '../data/avatars';
import type { AvatarKey } from '../types';
import ReelEmblem from './ReelEmblem';

/** La photo de profil. Deux sources : une photo choisie dans la galerie de
 *  l'appareil (`photo`, une data URI — voir lib/photo.ts), sinon un objectif
 *  `ReelEmblem` dans les couleurs de l'avatar préréglé (`avatar`). `photo` gagne
 *  quand les deux sont fournis. Utilisé dans Profil (le sien), Amis et la
 *  fiche d'un joueur (celui d'un autre, renvoyé par `/api/profile/:username`
 *  et `/api/friends`). */
export default function Avatar({
  avatar,
  photo,
  size = 74,
  boxShadow = 'var(--shadow-md)',
  style,
}: {
  avatar: AvatarKey;
  photo?: string | null;
  size?: number;
  boxShadow?: string;
  style?: CSSProperties;
}) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (photo && !photoFailed) {
    return (
      <img
        className="account-avatar"
        src={photo}
        alt=""
        width={size}
        height={size}
        onError={() => setPhotoFailed(true)}
        style={{ width: size, height: size, boxShadow, ...style }}
      />
    );
  }

  const a = avatarByKey(avatar);
  return (
    <span className="account-avatar account-avatar--preset" style={{ width: size, height: size, boxShadow, ...style }}>
      <ReelEmblem
      width={size}
      height={size}
      holeWidth={Math.round(size * 0.16)}
      holeHeight={Math.round(size * 0.26)}
      gap={Math.round(size * 0.15)}
      bg={a.bg}
      holeColor={a.holeColor}
        boxShadow="none"
      />
    </span>
  );
}
