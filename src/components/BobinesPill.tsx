export default function BobinesPill({ bobines }: { bobines: number }) {
  return (
    <span
      style={{
        marginLeft: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'var(--color-accent-200)',
        color: 'var(--color-accent-800)',
        padding: '6px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <i style={{ width: 11, height: 11, borderRadius: '50%', border: '2px solid var(--color-accent-700)', display: 'block' }} />
      {bobines}
    </span>
  );
}
