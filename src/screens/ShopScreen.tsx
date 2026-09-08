import { useNavigate } from 'react-router-dom';
import DailyBoosterBanner from '../components/DailyBoosterBanner';
import FreeBoosterBanner from '../components/FreeBoosterBanner';
import BobinesPill from '../components/BobinesPill';
import SlotMachineBanner from '../components/SlotMachineBanner';
import WheelBanner from '../components/WheelBanner';
import { PACKS } from '../data/catalog';
import { PACK_VISUALS } from '../data/packVisuals';
import { useStore } from '../state/store';

/** Ported from the "BOUTIQUE" block in TCG Ciné - Collection Cinéma.dc.html.
 *  Deux bandeaux de sachets gratuits, cumulatifs : le versement quotidien
 *  (+3, directement dans le stock) et le sac horaire (réserve à part). */
export default function ShopScreen() {
  const bobines = useStore((s) => s.bobines);
  const stock = useStore((s) => s.stock);
  const activePack = useStore((s) => s.activePack);
  const buyPack = useStore((s) => s.buyPack);
  const selectPackForOpening = useStore((s) => s.selectPackForOpening);
  const navigate = useNavigate();

  return (
    <div className="screen">
      <div className="screen-inner" style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <h1 style={{ fontSize: 30, margin: 0, lineHeight: 1 }}>Boutique</h1>
        <BobinesPill bobines={bobines} />
      </div>
      <p style={{ padding: '0 18px', fontSize: 13, opacity: 0.6, margin: '10px 0 0', textWrap: 'pretty' as const }}>
        Les bobines se gagnent en recyclant tes doublons.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '20px 18px 0' }}>
        <DailyBoosterBanner />
        <FreeBoosterBanner />
        <WheelBanner />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '13px 18px 0' }}>
        {PACKS.map((pk) => {
          const visual = PACK_VISUALS[pk.key];
          const inPocket = stock[pk.key] || 0;
          return (
            <div
              className={`booster-panel${pk.key === activePack ? ' is-selected' : ''}`}
              key={pk.key}
              style={{
                '--booster-color': visual.bg,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 78,
                  flex: 'none',
                  borderRadius: 12,
                  background: visual.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <i className="ph ph-film-strip" style={{ fontSize: 24, color: '#fff' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, lineHeight: 1.1 }}>{pk.name}</div>
                <div style={{ fontSize: 11.5, opacity: 0.65, marginTop: 4, textWrap: 'pretty' as const }}>{visual.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 13,
                      color: 'var(--color-accent-800)',
                      background: 'var(--color-accent-200)',
                      padding: '3px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {pk.price} bobines
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.5, fontWeight: 700 }}>En poche : {inPocket}</span>
                </div>
              </div>
              <div className="booster-actions">
                <button type="button" className="btn btn-primary" onClick={() => buyPack(pk.key)}>
                  Acheter
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    selectPackForOpening(pk.key);
                    navigate('/open');
                  }}
                >
                  Ouvrir
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '13px 18px 20px' }}>
        <SlotMachineBanner />
      </div>
    </div>
  );
}
