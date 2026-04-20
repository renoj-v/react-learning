export default function FreezeButton({ frozen, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '13px 34px',
        fontSize: 15,
        fontWeight: 500,
        color: '#e0eeff',
        border: '1px solid rgba(180,220,255,0.35)',
        borderRadius: 100,
        background: 'rgba(180,220,255,0.1)',
        cursor: 'pointer',
        outline: 'none',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        letterSpacing: '0.03em',
        transition: 'background 0.2s, border-color 0.2s, transform 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(180,220,255,0.2)';
        e.currentTarget.style.borderColor = 'rgba(180,220,255,0.55)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(180,220,255,0.1)';
        e.currentTarget.style.borderColor = 'rgba(180,220,255,0.35)';
        e.currentTarget.style.transform = 'none';
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
    >
      {frozen ? 'thaw' : 'freeze'}
    </button>
  );
}
