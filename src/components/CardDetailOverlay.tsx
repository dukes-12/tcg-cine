import { SECRET_RARITY_ID, cardById, rarityById } from '../data/catalog';
import { RARITY_VISUALS } from '../data/rarityVisuals';
import { useStore } from '../state/store';
import type { CardStatus } from '../types';
import FilmCard from './FilmCard';
import TiltCard from './TiltCard';

const STATUS_OPTIONS: { key: CardStatus; label: string }[] = [
  { key: 'vu', label: 'Vu' },
  { key: 'veut_voir', label: 'Veut le voir' },
  { key: 'pas_interesse', label: "Ne m'intéresse pas" },
];

/** Card detail overlay — triggered by tapping any card anywhere in the app.
 *  Ported from the "DÉTAIL" block in TCG Ciné - Collection Cinéma.dc.html.
 *  Une seule direction visuelle (Collector foil) : plus de prop `style`.
 *
 *  C'est l'écran "on s'arrête sur cette carte en particulier" — celui où
 *  incliner la carte au doigt pour l'admirer (TiltCard) fait sens ; pas
 *  branché sur les vignettes minuscules de la grille (Collection), où le
 *  geste de pointeur sert déjà à ouvrir ce détail. */
export default function CardDetailOverlay() {
  const detailId = useStore((s) => s.detail);
  const owned = useStore((s) => s.owned);
  const ownedHolo = useStore((s) => s.ownedHolo);
  const closeDetail = useStore((s) => s.closeDetail);
  const cardStatus = useStore((s) => s.cardStatus);
  const setCardStatus = useStore((s) => s.setCardStatus);

  if (detailId == null) return null;
  const card = cardById(detailId);
  if (!card) return null;

  const rarity = rarityById(card.rarity);
  const visual = RARITY_VISUALS[card.rarity];
  const count = owned[card.id] || 0;
  const holoCount = ownedHolo[card.id] || 0;
  // Deux collections indépendantes (voir HOLO_CHANCE dans state/store.ts) :
  // la carte est révélée dès qu'un exemplaire existe dans l'une OU l'autre,
  // et les deux comptes s'affichent côte à côte plutôt que l'un "dans"
  // l'autre.
  const revealed = count > 0 || holoCount > 0;
  const isSecret = card.rarity === SECRET_RARITY_ID;
  const parts: string[] = [];
  if (count > 0) parts.push(`${count} classique${count > 1 ? 's' : ''}`);
  if (holoCount > 0) parts.push(`${holoCount} holo`);
  // Le nom/type/synopsis d'un film pas encore tiré restent visibles — on
  // ne masque plus en "???" que la carte secrète, seul cas où la surprise
  // totale est le but. Sinon impossible de décider "veut voir"/"pas
  // intéressé" sur un film qu'on n'a jamais pioché : ce serait noter à
  // l'aveugle, exactement l'inverse de ce que ce statut sert à faire.
  const meta = isSecret
    ? count > 0
      ? '1 sur 1 — pièce unique, ne se recycle pas'
      : 'Existe quelque part. 1 chance sur 6 000 000 par carte tirée.'
    : revealed
      ? `${card.type} · ${parts.join(' · ')} · ${rarity.recycleValue} bobines`
      : `${card.type} · pas encore trouvée`;
  const displayName = isSecret && !revealed ? '???' : card.name;

  return (
    <div className="overlay">
      <div
        style={{
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: `radial-gradient(circle,${visual.glow},transparent 68%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ width: 238, height: 332, animation: 'pigPop .3s ease both', position: 'relative', zIndex: 2 }}>
        <TiltCard>
          <FilmCard card={card} big ownedCount={count + holoCount} isHolo={holoCount > 0} />
        </TiltCard>
      </div>
      <div style={{ marginTop: 22, textAlign: 'center', color: 'var(--color-text)', position: 'relative', zIndex: 2, maxWidth: 300 }}>
        <div style={{ fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.7 }}>{rarity.name}</div>
        <h2 style={{ fontSize: 25, margin: '7px 0 0', color: 'var(--color-text)', textWrap: 'balance' as const }}>{displayName}</h2>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 7 }}>{meta}</div>
        {!(isSecret && !revealed) && card.synopsis && (
          <p style={{ fontSize: 12.5, opacity: 0.9, marginTop: 14, lineHeight: 1.5, textAlign: 'left' }}>{card.synopsis}</p>
        )}
      </div>

      {!isSecret && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, position: 'relative', zIndex: 2, maxWidth: 300 }}>
          {STATUS_OPTIONS.map((opt) => {
            const active = cardStatus[card.id] === opt.key;
            return (
              <button
                key={opt.key}
                className="pressable"
                onClick={() => setCardStatus(card.id, opt.key)}
                style={{
                  cursor: 'pointer',
                  border: 0,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 11,
                  padding: '7px 12px',
                  borderRadius: 999,
                  background: active ? 'var(--color-accent)' : 'var(--color-neutral-800)',
                  color: active ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        className="pressable"
        onClick={closeDetail}
        style={{
          marginTop: 24,
          position: 'relative',
          zIndex: 2,
          border: 0,
          cursor: 'pointer',
          fontFamily: 'var(--font-heading)',
          fontSize: 14,
          background: 'var(--color-neutral-800)',
          color: 'var(--color-text)',
          padding: '12px 28px',
          borderRadius: 999,
        }}
      >
        Fermer
      </button>
    </div>
  );
}
