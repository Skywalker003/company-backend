import { useState, useRef, useEffect } from 'react'
import {
    Target, Eye, IndianRupee, Users, Lightbulb, ShieldCheck,
    Settings, RefreshCw, Globe, Network, Cpu, Wrench,
    Search, PenTool, Code2, Rocket, Laptop, Calendar,
    Award, BookOpen, User, TrendingUp, Cog, ChevronDown
} from 'lucide-react'
import './IconSelect.css'

const ICONS = {
    Target, Eye, IndianRupee, Users, Lightbulb, ShieldCheck,
    Settings, RefreshCw, Globe, Network, Cpu, Wrench,
    Search, PenTool, Code2, Rocket, Laptop, Calendar,
    Award, BookOpen, User, TrendingUp, Cog,
}

export default function IconSelect({ value, onChange }) {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const SelectedIcon = value && ICONS[value] ? ICONS[value] : null

    return (
        <div className="iconsel" ref={ref}>
            <button type="button" className="iconsel-trigger" onClick={() => setOpen(o => !o)}>
                <span className="iconsel-preview">
                    {SelectedIcon ? <SelectedIcon size={15} /> : <span className="iconsel-placeholder">Select icon</span>}
                    {value && <span className="iconsel-name">{value}</span>}
                </span>
                <ChevronDown size={13} className={`iconsel-chevron${open ? ' iconsel-chevron--open' : ''}`} />
            </button>
            {open && (
                <div className="iconsel-dropdown">
                    {Object.entries(ICONS).map(([name, Icon]) => (
                        <button
                            key={name}
                            type="button"
                            className={`iconsel-option${value === name ? ' iconsel-option--active' : ''}`}
                            onClick={() => { onChange(name); setOpen(false) }}
                        >
                            <Icon size={14} />
                            <span>{name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
