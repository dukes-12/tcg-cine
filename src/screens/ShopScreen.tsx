import { useNavigate } from 'react-router-dom';
import DailyBoosterBanner from '../components/DailyBoosterBanner';
import FreeBoosterBanner from '../components/FreeBoosterBanner';
import BobinesPill from '../components/BobinesPill';
import SlotMachineBanner from '../components/SlotMachineBanner';
import WheelBanner from '../components/WheelBanner';
import { PACKS } from '../data/catalog';
import { PACK_VISUALS } from '../data/packVisuals';
import { useStore } from '../state/store';

const smallBtn = (bg: string, col: string) => ({
  cursor: 'pointer' as const,
  border: 0,
  fontFamily: 'var(--font-heading)',
  fontSize: 12,
  padding: '8px 14px',
  borderRadius: 999,
  background: bg,
  color: col,
});

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
              key={pk.key}
              style={{
                display: 'flex',
                gap: 13,
                alignItems: 'center',
                padding: 13,
                borderRadius: 30,
                background: 'var(--color-surface)',
                boxShadow: pk.key === activePack ? 'inset 0 0 0 2px var(--color-accent)' : 'none',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button className="pressable" onClick={() => buyPack(pk.key)} style={smallBtn('var(--color-accent)', 'var(--color-bg)')}>
                  Acheter
                </button>
                <button
                  className="pressable"
                  onClick={() => {
                    selectPackForOpening(pk.key);
                    navigate('/open');
                  }}
                  style={{ cursor: 'pointer', border: 0, fontFamily: 'var(--font-heading)', fontSize: 12, padding: '8px 14px', borderRadius: 999, background: 'transparent', color: 'var(--color-text)', boxShadow: 'inset 0 0 0 1px var(--color-divider)' }}
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
