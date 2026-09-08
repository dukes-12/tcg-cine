import type { CSSProperties } from 'react';

/** The film-reel emblem, drawn in CSS (no asset) — reused for the pack
 *  thumbnails, the card back, the profile avatar and the card-art
 *  placeholder. A center hub plus a ring of sprocket holes, like an actual
 *  film reel spool seen face-on — the earlier version (two holes side by
 *  side) read as a pig snout at a glance, which is exactly the leftover
 *  this cinema theme needs to not have. */
const HOLE_COUNT = 6;
const HOLE_ANGLES = Array.from({ length: HOLE_COUNT }, (_, i) => (i / HOLE_COUNT) * Math.PI * 2 - Math.PI / 2);

export default function ReelEmblem({
  width,
  height,
  holeWidth,
  holeHeight,
  gap,
  bg = '#232532',
  holeColor = '#161826',
  boxShadow,
  style,
}: {
  width: number;
  height: number;
  holeWidth: number;
  holeHeight: number;
  gap: number;
  bg?: string;
  holeColor?: string;
  boxShadow?: string;
  style?: CSSProperties;
}) {
  // Rayon de la couronne de trous — la moitié du conteneur, moins la place
  // du trou lui-même et la marge (`gap`, réutilisé ici comme retrait plutôt
  // que comme espacement entre deux points). `width`/`height` diffèrent
  // souvent (emblème ovale, pas un cercle parfait) : rayon x et y calculés
  // séparément pour que la couronne épouse la même ellipse que le pourtour.
  const rx = Math.max(0, width / 2 - holeWidth / 2 - gap);
  const ry = Math.max(0, height / 2 - holeHeight / 2 - gap);
  const hubSize = Math.max(holeWidth, holeHeight) * 1.15;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: '50%',
        background: bg,
        boxShadow,
        flex: 'none',
        ...style,
      }}
    >
      {HOLE_ANGLES.map((a, i) => (
        <i
          key={i}
          style={{
            position: 'absolute',
            left: `calc(50% + ${Math.cos(a) * rx}px)`,
            top: `calc(50% + ${Math.sin(a) * ry}px)`,
            width: holeWidth,
            height: holeHeight,
            marginLeft: -holeWidth / 2,
            marginTop: -holeHeight / 2,
            borderRadius: '50%',
            background: holeColor,
            display: 'block',
          }}
        />
      ))}
      <i
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: hubSize,
          height: hubSize,
          marginLeft: -hubSize / 2,
          marginTop: -hubSize / 2,
          borderRadius: '50%',
          background: holeColor,
          display: 'block',
        }}
      />
    </div>
  );
}
