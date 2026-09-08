import type { CSSProperties } from 'react';

/** The film-reel emblem, drawn in CSS (no asset) — reused for the pack
 *  thumbnails, the card back, the profile avatar and the card-art
 *  placeholder. Two "sprocket holes" on a reel disc — the cinema
 *  equivalent of the pig-snout emblem from the original TCG-PIG. */
export default function ReelEmblem({
  width,
  height,
  holeWidth,
  holeHeight,
  gap,
  bg = '#ffd2b4',
  holeColor = '#8c491a',
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
  return (
    <div
      style={{
        width,
        height,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
        boxShadow,
        flex: 'none',
        ...style,
      }}
    >
      <i style={{ width: holeWidth, height: holeHeight, borderRadius: '50%', background: holeColor, display: 'block' }} />
      <i style={{ width: holeWidth, height: holeHeight, borderRadius: '50%', background: holeColor, display: 'block' }} />
    </div>
  );
}
