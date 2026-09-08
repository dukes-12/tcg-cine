import { SECRET_RARITY_ID } from '../data/catalog';
import { buildCardVisual } from '../lib/cardVisual';
import { useAnimations } from '../lib/useAnimations';
import type { Card } from '../types';
import CardArt from './CardArt';
import SecretCard from './SecretCard';

/** Renders one card: frame (rarity identity — gradient border/glow) →
 *  shell (surface) → artWrap (poster) → fade → namePlate / metaRow, plus
 *  le voile holo (Rare+ et version holo) et le sceau de quantité. Anatomie
 *  portée du handoff `FilmCard.dc.html` (redesign Nocturne) — voir
 *  cardVisual.ts.
 *
 *  La carte secrète (rareté 7) a son propre habillage, sans rapport avec
 *  buildCardVisual — on bascule vers SecretCard *avant* de l'appeler :
 *  chaque écran qui affiche déjà des cartes (collection, doublons,
 *  échanges, détail, révélation…) récupère le bon rendu sans rien changer
 *  de son côté. */
export default function FilmCard({
  card,
  big = false,
  ownedCount = 0,
  forceOwned = false,
  isHolo = false,
  ink,
  glow,
}: {
  card: Card;
  big?: boolean;
  ownedCount?: number;
  forceOwned?: boolean;
  /** Rend la version holo de la carte (voir HOLO_CHANCE) — sans effet sur
   *  la carte secrète, qui a déjà son propre habillage unique. */
  isHolo?: boolean;
  /** Encre/halo de la rareté (voir RARITY_VISUALS) — passés par l'appelant
   *  plutôt que recalculés ici, pour rester une source unique. */
  ink?: string;
  glow?: string;
}) {
  // Toujours appelé (règle des hooks) même si seule SecretCard s'en sert —
  // le coût est négligeable (un accès store + un media query déjà mémoïsé).
  const holoAnim = useAnimations();
  if (card.rarity === SECRET_RARITY_ID) {
    return <SecretCard card={card} big={big} holoAnim={holoAnim} ownedCount={ownedCount} forceOwned={forceOwned} />;
  }

  const d = buildCardVisual(card, { big, ownedCount, forceOwned, isHolo, ink, glow });

  return (
    <div style={d.frame}>
      <div style={d.shell}>
        {d.owned ? (
          <div style={d.artWrap}>
            <CardArt card={card} mini={!big} />
          </div>
        ) : (
          <div style={d.lockStyle}>?</div>
        )}
        {d.owned && (
          <>
            <div style={d.fadeStyle} />
            <div style={d.namePlate}>{d.name}</div>
            <div style={d.metaRow}>
              <span style={d.typeStyle}>{d.type}</span>
              <i style={d.dotStyle} />
            </div>
            {d.holoOverlay && <div style={d.holoOverlayStyle} />}
          </>
        )}
        {d.showCount && <span style={d.countBadgeStyle}>×{ownedCount}</span>}
        <div style={d.sheenStyle} />
      </div>
    </div>
  );
}
