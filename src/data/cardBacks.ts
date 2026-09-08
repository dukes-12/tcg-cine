import type { CardBackKey } from '../types';

/** Les dos de carte. `sceau` est débloqué d'office ; les trois autres
 *  s'achètent en bobines dans Profil → Dos de carte.
 *  Palette Nocturne (redesign pass) — le handoff `TCG Ciné.dc.html` ne
 *  spécifie pas les dos de carte, retint fait main pour rester dans la
 *  même famille (accent violet, fond sombre) que le reste de l'appli. */
export interface CardBackSkin {
  key: CardBackKey;
  name: string;
  /** 0 = débloqué d'office. */
  price: number;
  /** Fond de la carte. */
  bg: string;
  /** Encre du mot-marque et des filets. */
  ink: string;
  /** Couleur de la bobine dans le médaillon. */
  reelEmblemBg: string;
  /** Couleur des trous de la bobine. */
  hole: string;
  /** Fond du médaillon. */
  medallion: string;
  /** Anneau autour du médaillon (0 = aucun). */
  ring: string;
  /** Sous-titre sous le mot-marque (facultatif). */
  tagline?: string;
  /** Décor de fond propre au dos. */
  pattern: 'guilloche' | 'ripples' | 'rays' | 'none';
}

export const CARD_BACKS: CardBackSkin[] = [
  {
    key: 'sceau',
    name: 'Clap doré',
    price: 0,
    bg: 'radial-gradient(120% 100% at 50% 8%,#3a3560,#201d38 58%,#12101f)',
    ink: '#ffd98a',
    reelEmblemBg: '#5d5294',
    hole: '#f5f4ff',
    medallion: 'linear-gradient(180deg,#2b2741,#161826)',
    ring: 'linear-gradient(140deg,#ffe9b0,#c99a3a)',
    tagline: 'série un',
    pattern: 'guilloche',
  },
  {
    key: 'souille',
    name: 'Pellicule',
    price: 400,
    bg: 'repeating-radial-gradient(circle at 50% 46%,#12131d 0 11px,#232532 11px 24px)',
    ink: '#e9e9ed',
    reelEmblemBg: '#e9e9ed',
    hole: '#232532',
    medallion: 'linear-gradient(160deg,#423a6a,#2b2741)',
    ring: 'rgba(233,233,237,.2)',
    pattern: 'ripples',
  },
  {
    key: 'deco',
    name: 'Néon',
    price: 650,
    bg: '#161826',
    ink: '#d2cefd',
    reelEmblemBg: '#968ae0',
    hole: '#2b2741',
    medallion: '#232532',
    ring: '#796cbf',
    tagline: 'cartes à collectionner',
    pattern: 'rays',
  },
  {
    key: 'nuit',
    name: 'Nuit violette',
    price: 900,
    bg: 'radial-gradient(120% 100% at 50% 10%,#6c3fa0,#3b1d5e 60%,#160a24)',
    ink: '#e7e5fe',
    reelEmblemBg: '#e7e5fe',
    hole: '#3b1d5e',
    medallion: 'linear-gradient(170deg,#423a6a,#160a24)',
    ring: 'linear-gradient(140deg,#d2cefd,#796cbf)',
    tagline: 'édition mythique',
    pattern: 'rays',
  },
];

export const DEFAULT_CARD_BACK: CardBackKey = 'sceau';

export const cardBackByKey = (key: CardBackKey): CardBackSkin =>
  CARD_BACKS.find((b) => b.key === key) ?? CARD_BACKS[0];
