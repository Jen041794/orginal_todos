const styles = {
  bar: {
    display: 'flex',
    gap: '0',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
    background: 'var(--paper)',
  },
  btn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '11px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.1s',
    borderRight: '1px solid var(--border)',
  },
  btnActive: {
    background: 'var(--ink)',
    color: 'var(--bg)',
  },
  btnLast: {
    borderRight: 'none',
  },
}

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'active', label: '進行中' },
  { key: 'done', label: '已完成' },
]

export default function FilterBar({ filter, onChange, counts }) {
  return (
    <div style={styles.bar}>
      {FILTERS.map((f, i) => (
        <button
          key={f.key}
          style={{
            ...styles.btn,
            ...(filter === f.key ? styles.btnActive : {}),
            ...(i === FILTERS.length - 1 ? styles.btnLast : {}),
          }}
          onClick={() => onChange(f.key)}
        >
          {f.label}
          {counts[f.key] > 0 && (
            <span style={{
              marginLeft: '5px',
              opacity: 0.6,
              fontSize: '10px',
            }}>
              {counts[f.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
