import { useState } from 'react';

const styles = {
    item: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        background: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: '3px',
        transition: 'box-shadow 0.15s',
        position: 'relative',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: '1.5px solid var(--ink-faint)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '1px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: 'transparent',
    },
    checkboxDone: {
        background: 'var(--done)',
        borderColor: 'var(--done)',
    },
    checkmark: {
        color: 'white',
        fontSize: '10px',
        lineHeight: 1,
    },
    content: {
        flex: 1,
        minWidth: 0,
    },
    text: {
        fontSize: '14px',
        lineHeight: '1.5',
        color: 'var(--ink)',
        wordBreak: 'break-word',
        transition: 'color 0.15s',
    },
    textDone: {
        color: 'var(--ink-soft)',
        textDecoration: 'line-through',
        textDecorationColor: 'var(--ink-faint)',
    },
    meta: {
        marginTop: '4px',
        fontSize: '11px',
        color: 'var(--ink-faint)',
        fontVariantNumeric: 'tabular-nums',
    },
    tag: {
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: '20px',
        fontSize: '10px',
        fontWeight: '500',
        marginRight: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    tagWork: { background: 'var(--accent-soft)', color: 'var(--accent)' },
    tagPersonal: { background: 'var(--done-soft)', color: 'var(--done)' },
    tagOther: { background: '#EEE', color: 'var(--ink-soft)' },
    actions: {
        display: 'flex',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.15s',
        flexShrink: 0,
    },
    actionBtn: {
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        fontSize: '14px',
        transition: 'background 0.1s',
        color: 'var(--ink-soft)',
    },
};

const tagStyleMap = {
    工作: styles.tagWork,
    個人: styles.tagPersonal,
    其他: styles.tagOther,
};

export default function TodoItem({ todo, onToggle, onDelete }) {
    const [hovered, setHovered] = useState(false);
    const [removing, setRemoving] = useState(false);

    const handleDelete = () => {
        setRemoving(true);
        setTimeout(() => onDelete(todo.id), 220);
    };

    const date = new Date(todo.created_at);
    const timeStr = date.toLocaleTimeString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div
            className={`todo-item${removing ? ' removing' : ''}`}
            style={{ ...styles.item, boxShadow: hovered ? '0 2px 8px var(--shadow)' : 'none' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button
                style={{ ...styles.checkbox, ...(todo.is_done ? styles.checkboxDone : {}) }}
                onClick={() => onToggle(todo.id, todo.is_done)}
                title={todo.is_done ? '標記未完成' : '標記完成'}
            >
                {todo.is_done && <span style={styles.checkmark}>✓</span>}
            </button>

            <div style={styles.content}>
                <div style={{ ...styles.text, ...(todo.is_done ? styles.textDone : {}) }}>{todo.text}</div>
                <div style={styles.meta}>
                    {todo.tag && (
                        <span style={{ ...styles.tag, ...(tagStyleMap[todo.tag] || styles.tagOther) }}>{todo.tag}</span>
                    )}
                    {timeStr}
                </div>
            </div>

            <div style={{ ...styles.actions, opacity: hovered ? 1 : 0 }}>
                <button
                    style={styles.actionBtn}
                    onClick={handleDelete}
                    title='刪除'
                    onMouseEnter={e => (e.currentTarget.style.background = '#FEE8E0')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                    ×
                </button>
            </div>
        </div>
    );
}
