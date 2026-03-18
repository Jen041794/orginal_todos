import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AddTodo from './components/AddTodo'
import TodoItem from './components/TodoItem'
import FilterBar from './components/FilterBar'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    padding: '48px 20px 80px',
    background: 'var(--bg)',
  },
  container: {
    width: '100%',
    maxWidth: '560px',
  },
  header: {
    marginBottom: '36px',
  },
  eyebrow: {
    fontSize: '10px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--ink-soft)',
    marginBottom: '8px',
  },
  title: {
    fontFamily: "'Noto Serif TC', serif",
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--ink)',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'var(--ink-faint)',
  },
  accentDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    marginRight: '6px',
    verticalAlign: 'middle',
    marginTop: '-2px',
  },
  section: {
    marginTop: '24px',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
    marginBottom: '16px',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'var(--ink-faint)',
    fontSize: '13px',
    fontStyle: 'italic',
  },
  errorBanner: {
    padding: '12px 16px',
    background: '#FEE8E0',
    border: '1px solid #F0C4B4',
    borderRadius: '3px',
    fontSize: '13px',
    color: 'var(--accent)',
    marginBottom: '16px',
  },
  progressBar: {
    height: '3px',
    background: 'var(--border)',
    borderRadius: '2px',
    marginTop: '12px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--done)',
    borderRadius: '2px',
    transition: 'width 0.4s ease',
  },
  clearBtn: {
    fontSize: '11px',
    color: 'var(--ink-faint)',
    letterSpacing: '0.03em',
    padding: '6px 0',
    flexShrink: 0,
    transition: 'color 0.1s',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '24px 0',
  },
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)

  const today = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    setFetchError(null)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setFetchError('無法載入待辦事項，請確認 Supabase 設定。')
      console.error(error)
    } else {
      setTodos(data)
    }
  }

  async function handleAdd(text, tag) {
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .insert([{ text, tag, is_done: false }])
      .select()
      .single()

    if (!error && data) {
      setTodos(prev => [data, ...prev])
    }
    setLoading(false)
  }

  async function handleToggle(id, currentDone) {
    const { data, error } = await supabase
      .from('todos')
      .update({ is_done: !currentDone })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTodos(prev => prev.map(t => t.id === id ? data : t))
    }
  }

  async function handleDelete(id) {
    await supabase.from('todos').delete().eq('id', id)
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  async function handleClearDone() {
    const doneIds = todos.filter(t => t.is_done).map(t => t.id)
    if (!doneIds.length) return
    await supabase.from('todos').delete().in('id', doneIds)
    setTodos(prev => prev.filter(t => !t.is_done))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.is_done
    if (filter === 'done')   return t.is_done
    return true
  })

  const doneCount   = todos.filter(t => t.is_done).length
  const totalCount  = todos.length
  const activeCount = totalCount - doneCount
  const progress    = totalCount > 0 ? (doneCount / totalCount) * 100 : 0

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.eyebrow}>
            <span style={styles.accentDot} />
            {today}
          </div>
          <h1 style={styles.title}>今日待辦</h1>
          {totalCount > 0 && (
            <>
              <div style={styles.subtitle}>
                {doneCount} / {totalCount} 項完成
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {fetchError && (
          <div style={styles.errorBanner}>⚠ {fetchError}</div>
        )}

        {/* Add Todo */}
        <AddTodo onAdd={handleAdd} loading={loading} />

        {/* Controls */}
        <div style={styles.controls}>
          <FilterBar
            filter={filter}
            onChange={setFilter}
            counts={{ all: totalCount, active: activeCount, done: doneCount }}
          />
          {doneCount > 0 && (
            <button
              style={styles.clearBtn}
              onClick={handleClearDone}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-faint)'}
            >
              清除完成
            </button>
          )}
        </div>

        {/* List */}
        <div style={styles.list}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              {filter === 'done' ? '還沒有完成的項目' :
               filter === 'active' ? '太棒了！所有事項都完成了' :
               '新增你的第一個待辦事項'}
            </div>
          ) : (
            filtered.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
