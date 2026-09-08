import type { PackKey } from '../types';

/** Presentation-only pack metadata (long-form description + thumbnail
 *  gradient) that isn't part of the data model. Ported from
 *  TCG Ciné - Collection Cinéma.dc.html (`PACKS`). */
export interface PackVisual {
  desc: string;
  bg: string;
}

export const PACK_VISUALS: Record<PackKey, PackVisual> = {
  basic: { desc: '5 cartes, taux standard.', bg: 'linear-gradient(160deg,var(--color-accent-700),var(--color-accent-900))' },
  foire: { desc: '6 cartes, dont 3 Rare ou mieux garanties.', bg: 'linear-gradient(160deg,var(--color-accent-500),var(--color-accent-800))' },
  doree: { desc: '7 cartes, dont 2 Épique ou mieux garanties.', bg: 'linear-gradient(160deg,var(--color-accent-300),var(--color-accent-700) 55%,var(--color-accent-900))' },
};
