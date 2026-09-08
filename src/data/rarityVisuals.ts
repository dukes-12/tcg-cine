import type { RarityId } from '../types';

/** Presentation-only rarity metadata that isn't part of the data model
 *  (ink color for dots/bars, halo glow color, short label for tight UI).
 *
 *  Palette Nocturne (redesign pass) : une seule teinte accent (violet),
 *  la rareté monte en s'éclaircissant sur la rampe accent — du neutre
 *  (Commune) au blanc-violet quasi lumineux (Secrète). Portée depuis le
 *  handoff `TCG Ciné.dc.html` (`RARITIES`). Les mêmes valeurs doivent
 *  rester en phase avec `src/lib/cardVisual.ts`. */
export interface RarityVisual {
  short: string;
  ink: string;
  glow: string;
}

export const RARITY_VISUALS: Record<RarityId, RarityVisual> = {
  1: { short: 'Com.', ink: 'var(--color-neutral-500)', glow: 'rgba(147,151,171,.35)' },
  2: { short: 'Peu c.', ink: 'var(--color-neutral-300)', glow: 'rgba(207,211,229,.4)' },
  3: { short: 'Rare', ink: 'var(--color-accent-600)', glow: 'rgba(121,108,191,.55)' },
  4: { short: 'Épique', ink: 'var(--color-accent-500)', glow: 'rgba(150,138,224,.65)' },
  5: { short: 'Légend.', ink: 'var(--color-accent-400)', glow: 'rgba(181,171,252,.8)' },
  6: { short: 'Myth.', ink: 'var(--color-accent-300)', glow: 'rgba(210,206,253,.95)' },
  7: { short: 'Secr.', ink: 'var(--color-accent-100)', glow: 'rgba(245,244,255,1)' },
};
