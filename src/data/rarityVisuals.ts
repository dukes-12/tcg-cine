import type { RarityId } from '../types';

/** Presentation-only rarity metadata that isn't part of the data model
 *  (ink color for dots/bars, halo glow color, short label for tight UI).
 *
 *  Un vrai code couleur par palier (pas des nuances d'une seule teinte
 *  accent) — convention TCG classique, pour qu'une rareté se reconnaisse
 *  d'un coup d'œil sans lire l'étiquette : gris → vert → bleu → violet →
 *  or → rouge, blanc-or pour la Secrète. Chaque teinte reste lisible sur
 *  le fond sombre Nocturne (tons pierre précieuse, pas pastel). Les mêmes
 *  valeurs doivent rester en phase avec `src/lib/cardVisual.ts`. */
export interface RarityVisual {
  short: string;
  ink: string;
  glow: string;
}

export const RARITY_VISUALS: Record<RarityId, RarityVisual> = {
  1: { short: 'Com.', ink: '#9397ab', glow: 'rgba(147,151,171,.4)' },
  2: { short: 'Peu c.', ink: '#5fbf7a', glow: 'rgba(95,191,122,.5)' },
  3: { short: 'Rare', ink: '#4f9dff', glow: 'rgba(79,157,255,.6)' },
  4: { short: 'Épique', ink: '#a06cf2', glow: 'rgba(160,108,242,.7)' },
  5: { short: 'Légend.', ink: '#f2a93c', glow: 'rgba(242,169,60,.8)' },
  6: { short: 'Myth.', ink: '#f2495c', glow: 'rgba(242,73,92,.85)' },
  7: { short: 'Secr.', ink: '#fff2c9', glow: 'rgba(255,242,201,1)' },
};
