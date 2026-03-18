import { useState } from 'react'

const TAGS = ['工作', '個人', '其他']

const styles = {
  wrapper: {
    background: 'var(--paper)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    fontSize: '14px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--ink)',
  },
  addBtn: {
    padding: '10px 18px',
    margin: '6px',
    background: 'var(--accent)',
    color: 'white',
    borderRadius: '2px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
    flexShrink: 0,
  },
  tagRow: {
    display: 'flex',
    gap: '6px',
    padding: '0 14px 12px',
  },
  tagBtn: {
    padding: '3px 10px',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    fontSize: '11px',
    background: 'transparent',
    color: 'var(--ink-soft)',
    cursor: 'pointer',
    transition: 'all 0.1s',
    fontFamily: 'inherit',
    letterSpacing: '0.03em',
  },
  tagBtnActive: {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: 'white',
  },
}

export default function AddTodo({ onAdd, loading }) {
  const [text, setText] = useState('')
  const [tag, setTag] = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await onAdd(text.trim(), tag || null)
    setText('')
    setTag('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        ...styles.wrapper,
        boxShadow: focused ? '0 0 0 2px var(--accent)' : 'none',
      }}>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="新增待辦事項..."
            autoFocus
          />
          <button
            type="submit"
            style={{ ...styles.addBtn, opacity: loading || !text.trim() ? 0.4 : 1 }}
            disabled={loading || !text.trim()}
          >
            {loading ? '…' : '新增'}
          </button>
        </div>
        <div style={styles.tagRow}>
          {TAGS.map(t => (
            <button
              key={t}
              type="button"
              style={{
                ...styles.tagBtn,
                ...(tag === t ? styles.tagBtnActive : {}),
              }}
              onClick={() => setTag(tag === t ? '' : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </form>
  )
}
