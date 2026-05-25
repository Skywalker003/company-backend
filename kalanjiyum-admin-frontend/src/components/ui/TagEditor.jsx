import { useState } from 'react'
import { X } from 'lucide-react'
import './TagEditor.css'

export default function TagEditor({ value = [], onChange, placeholder = 'Add item…' }) {
    const [input, setInput] = useState('')

    const add = () => {
        const trimmed = input.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setInput('')
    }

    const remove = (tag) => onChange(value.filter(t => t !== tag))

    const onKey = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); add() }
        if (e.key === 'Backspace' && !input && value.length) remove(value[value.length - 1])
    }

    return (
        <div className="tageditor">
            <div className="tageditor-tags">
                {value.map(tag => (
                    <span key={tag} className="tageditor-tag">
                        {tag}
                        <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
                            <X size={10} />
                        </button>
                    </span>
                ))}
                <input
                    className="tageditor-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={onKey}
                    onBlur={add}
                    placeholder={value.length === 0 ? placeholder : ''}
                />
            </div>
        </div>
    )
}
