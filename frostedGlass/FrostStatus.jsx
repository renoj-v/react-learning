export default function FrostStatus({ frozen }) {
  const text = frozen ? 'frozen' : 'dormant';

  return (
    <div
      style={{
        fontSize: 12,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: frozen ? 'rgba(180,220,255,0.85)' : 'rgba(180,220,255,0.45)',
        transition: 'color 0.5s',
      }}
    >
      {text}
    </div>
  );
}
