/** 7 = Secrète — pas une rareté "normale" : poids 0 dans `roll()`, elle
 *  n'est jamais tirée par la table pondérée habituelle. Voir SECRET_CHANCE
 *  dans lib/draw.ts. */
export type RarityId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RarityKey =
  | 'commune'
  | 'peu_commune'
  | 'rare'
  | 'epique'
  | 'legendaire'
  | 'mythique'
  | 'secrete';

export interface Rarity {
  id: RarityId;
  key: RarityKey;
  name: string;
  weight: number;
  recycleValue: number;
}

export type CardType = string;

export interface Card {
  id: number;
  name: string;
  type: CardType;
  rarity: RarityId;
  image: string;
  slotId: string;
  /** Court synopsis (TMDb `overview`, via scripts/fetch-tmdb-posters.mjs
   *  --with-synopsis) — absent si jamais récupéré, voir CardDetailOverlay. */
  synopsis?: string;
}

export type PackKey = 'basic' | 'foire' | 'doree';

export interface Pack {
  key: PackKey;
  name: string;
  price: number;
  cards: number;
  guaranteedFloor: RarityId | null;
  /** Combien de cartes du sac doivent atteindre `guaranteedFloor` — au
   *  moins, pas exactement (un tirage naturel peut en donner plus). Absent
   *  ou 0 : pas de garantie, `guaranteedFloor` est alors ignoré. */
  guaranteedCount?: number;
  subtitle: string;
}

export interface CardCatalog {
  version: number;
  types: CardType[];
  rarities: Rarity[];
  packs: Pack[];
  cards: Card[];
}

/** Les dos de carte — voir src/data/cardBacks.ts. `sceau` est le dos par
 *  défaut, les trois autres s'achètent en bobines. */
export type CardBackKey = 'sceau' | 'souille' | 'deco' | 'nuit';

/** Statut personnel sur un film — indépendant de la possession de la
 *  carte (on peut noter "veut voir" un film qu'on n'a pas encore tiré).
 *  Un clic sur le bouton déjà actif le désactive (retour à `undefined`,
 *  la carte n'apparaît alors dans `cardStatus`). Voir CardDetailOverlay. */
export type CardStatus = 'vu' | 'veut_voir' | 'pas_interesse';

/** Préférence d'animations — voir src/lib/useAnimations.ts. */
export type AnimationPref = 'auto' | 'on' | 'off';

/** Avatars de profil — voir src/data/avatars.ts. Tous débloqués d'office
 *  (identité, pas une rareté à collectionner comme les dos de carte). */
export type AvatarKey =
  | 'classique'
  | 'projecteur'
  | 'studio'
  | 'dore'
  | 'nuit-violette'
  | 'plateau-vert'
  | 'ecran-bleu'
  | 'onyx';

/** Nombre de cartes par ligne dans la collection. */
export type GridCols = 2 | 3 | 4;

export type SortKey = 'rarete' | 'nom' | 'type' | 'nb';

export type TabKey = 'collection' | 'shop' | 'open' | 'dupes' | 'trades' | 'friends' | 'profile';

export type PackState = 'idle' | 'tearing' | 'reveal' | 'summary';

/** Roue de la chance — voir src/components/WheelOverlay.tsx. */
export type WheelState = 'idle' | 'spinning' | 'result';
