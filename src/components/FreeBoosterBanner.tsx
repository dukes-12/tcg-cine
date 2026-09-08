import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FREE_BOOSTER_MAX, useStore } from '../state/store';
import { formatCountdown } from '../lib/formatCountdown';
import ReelEmblem from './ReelEmblem';

/** Le sac gratuit horaire — réserve à part, plafonnée à 3, cumulative avec le
 *  versement quotidien de DailyBoosterBanner (les deux coexistent, ce n'en
 *  est pas un remplacement). */
export default function FreeBoosterBanner() {
  const freeBoosters = useStore((s) => s.freeBoosters);
  const nextFreeBoosterAt = useStore((s) => s.nextFreeBoosterAt);
  const claimFreeBooster = useStore((s) => s.claimFreeBooster);
  const navigate = useNavigate();

  // Tick local pour le compte à rebours — ne touche pas au store.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const full = freeBoosters >= FREE_BOOSTER_MAX;
  const subtitle = full
    ? 'Réserve pleine — ouvre-en un pour relancer le compteur.'
    : nextFreeBoosterAt == null
      ? 'Prochain sac gratuit bientôt.'
      : `Prochain sac gratuit dans ${formatCountdown(nextFreeBoosterAt - Date.now())}.`;

  return (
    <div className="booster-panel booster-panel--reward">
      <div
        className="booster-art booster-art--gift"
        style={{
          position: 'relative',
          width: 66,
          height: 88,
          flex: 'none',
          borderRadius: 20,
          background: 'linear-gradient(160deg,#f6a06b,#8c491a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <ReelEmblem width={34} height={27} holeWidth={5} holeHeight={9} gap={5} />
        {freeBoosters > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: 'var(--color-accent-2-600)',
              color: 'var(--color-bg)',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 999,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            ×{freeBoosters}
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="booster-title">Sac gratuit</div>
        <div className="booster-description">{subtitle}</div>
      </div>
      <button
        className="btn btn-primary booster-action"
        type="button"
        disabled={freeBoosters <= 0}
        onClick={() => {
          claimFreeBooster();
          navigate('/open');
        }}

      >
        Ouvrir
      </button>
    </div>
  );
}
