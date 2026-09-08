import type { CSSProperties } from 'react';
import { RARITY_VISUALS } from '../data/rarityVisuals';
import type { Card } from '../types';

/** The card visual language — redesign pass (Nocturne), ported from the
 *  Claude Design handoff `FilmCard.dc.html`. Anatomy: `frame` (outer
 *  gradient border, carries the rarity identity) → `shell` (inner dark
 *  surface) → `artWrap` (the poster) → `fade` (gradient so the name plate
 *  stays legible over any poster) → `namePlate` / `metaRow` (type label +
 *  rarity dot) → `holoOverlay` (Rare+ only) → `countBadge` → `sheen` (a
 *  static diagonal highlight, on every owned card).
 *
 *  Replaces the previous "Collector foil" system (6 hand-tuned skins, a
 *  6-pip rarity row, an interactive chrome/holo shine driven by TiltCard) —
 *  the new design is flatter and reads the rarity from a single ink/glow
 *  pair (see `RARITY_VISUALS`) rather than a per-rarity gradient recipe. */

/** Rareté ≥ 3 (Rare+) porte le voile holo — seuil du handoff (`holo = rarity >= 3`). */
const HOLO_MIN_RARITY = 3;

export interface CardVisual {
  name: string;
  type: string;
  image: string;
  owned: boolean;
  locked: boolean;
  mini: boolean;
  holo: boolean;
  frame: CSSProperties;
  shell: CSSProperties;
  artWrap: CSSProperties;
  holoOverlay: boolean;
  holoOverlayStyle: CSSProperties;
  lockStyle: CSSProperties;
  fadeStyle: CSSProperties;
  namePlate: CSSProperties;
  metaRow: CSSProperties;
  typeStyle: CSSProperties;
  dotStyle: CSSProperties;
  showCount: boolean;
  countBadgeStyle: CSSProperties;
  sheenStyle: CSSProperties;
}

export interface BuildCardOptions {
  big?: boolean;
  /** Force the card to render as owned regardless of ownedCount (pack reveal). */
  forceOwned?: boolean;
  ownedCount?: number;
  /** Version holo de cette carte (voir HOLO_CHANCE dans state/store.ts) —
   *  porte le même voile que les raretés Rare+, quelle que soit la rareté
   *  réelle. N'a d'effet que si la carte est possédée. */
  isHolo?: boolean;
  ink?: string;
  glow?: string;
}

export function buildCardVisual(card: Card, opts: BuildCardOptions = {}): CardVisual {
  const big = !!opts.big;
  const owned = opts.forceOwned || (opts.ownedCount ?? 0) > 0;
  const ownedCount = opts.ownedCount ?? 0;
  const rv = RARITY_VISUALS[card.rarity];
  const ink = opts.ink ?? rv.ink;
  const glow = opts.glow ?? rv.glow;
  const holo = owned && (!!opts.isHolo || card.rarity >= HOLO_MIN_RARITY);

  const frame: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: big ? 18 : 12,
    padding: big ? 2.5 : 1.5,
    background: !owned
      ? 'linear-gradient(152deg, #5c5f69 0%, #33353d 45%, #46484f 70%, #62646d 100%)'
      : holo
        ? `linear-gradient(155deg, rgba(233,233,237,.5), ${glow} 45%, rgba(20,21,32,.9) 70%, rgba(233,233,237,.35))`
        : `linear-gradient(152deg, #d8dbe2 0%, #8b8f9c 18%, #4a4d58 38%, ${ink} 52%, #2c2e37 66%, #9a9eab 84%, #ced1d9 100%)`,
    boxShadow: owned ? `0 0 ${big ? 26 : 12}px ${glow}` : 'none',
    boxSizing: 'border-box',
  };

  const shell: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: big ? 16 : 10.5,
    overflow: 'hidden',
    background: holo && owned ? 'linear-gradient(160deg, #1c1d2c, #12131d 60%)' : 'var(--color-surface)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.12), inset 0 -1px 2px rgba(0,0,0,.5)',
  };

  const artWrap: CSSProperties = { position: 'absolute', inset: 0 };

  const holoOverlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    background: `linear-gradient(125deg, ${glow} 0%, rgba(150,138,224,0) 35%, rgba(233,233,237,.14) 55%, rgba(150,138,224,0) 75%, ${glow} 100%)`,
  };

  const lockStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
    fontSize: big ? 40 : 20,
    color: 'var(--color-neutral-500)',
    opacity: 0.5,
  };

  const fadeStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: big ? '46%' : '52%',
    background: 'linear-gradient(0deg, rgba(22,24,38,.96), rgba(22,24,38,0))',
    pointerEvents: 'none',
  };

  const namePlate: CSSProperties = {
    position: 'absolute',
    left: big ? 12 : 6,
    right: big ? 12 : 6,
    bottom: big ? 28 : 16,
    fontFamily: 'var(--font-heading)',
    fontWeight: 500,
    color: 'var(--color-neutral-100)',
    fontSize: big ? 13.5 : 8.5,
    lineHeight: 1.2,
    letterSpacing: '.01em',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  const metaRow: CSSProperties = {
    position: 'absolute',
    left: big ? 12 : 6,
    right: big ? 12 : 6,
    bottom: big ? 10 : 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  };

  const typeStyle: CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: big ? 9 : 6,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '.07em',
    color: 'rgba(233,233,237,.55)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const dotStyle: CSSProperties = {
    display: 'block',
    width: big ? 8 : 5,
    height: big ? 8 : 5,
    borderRadius: '50%',
    background: ink,
    flex: 'none',
  };

  const countBadgeStyle: CSSProperties = {
    position: 'absolute',
    top: 5,
    right: 5,
    background: 'var(--color-neutral-900)',
    color: 'var(--color-text)',
    fontFamily: 'var(--font-body)',
    fontSize: big ? 10.5 : 7.5,
    fontWeight: 600,
    padding: big ? '3px 8px' : '1px 5px',
    borderRadius: 999,
    boxShadow: 'var(--shadow-sm)',
  };

  const sheenStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    mixBlendMode: 'overlay',
    background: 'linear-gradient(120deg, rgba(255,255,255,.32) 0%, rgba(255,255,255,0) 26%, rgba(255,255,255,0) 68%, rgba(255,255,255,.14) 100%)',
  };

  return {
    // Film jamais trouvé → le nom reste un mystère, comme l'illustration
    // (déjà masquée par `owned` ci-dessus, voir artWrap dans FilmCard.tsx).
    name: owned ? card.name : '???',
    type: card.type,
    image: card.image,
    owned,
    locked: !owned,
    mini: !big,
    holo,
    frame,
    shell,
    artWrap,
    holoOverlay: holo,
    holoOverlayStyle,
    lockStyle,
    fadeStyle,
    namePlate,
    metaRow,
    typeStyle,
    dotStyle,
    showCount: ownedCount > 1,
    countBadgeStyle,
    sheenStyle,
  };
}
