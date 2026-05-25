import { useRef, useState, useEffect } from 'react'
import './ContentTabs.css'

export default function ContentTabs({ tabs, active, onChange }) {
    const scrollRef = useRef(null)
    const [fade, setFade] = useState(false)

    const checkFade = () => {
        const el = scrollRef.current
        if (!el) return
        setFade(el.scrollWidth > el.clientWidth + 4 && el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }

    useEffect(() => {
        checkFade()
        const el = scrollRef.current
        el?.addEventListener('scroll', checkFade, { passive: true })
        window.addEventListener('resize', checkFade)
        return () => {
            el?.removeEventListener('scroll', checkFade)
            window.removeEventListener('resize', checkFade)
        }
    }, [tabs])

    return (
        <div className={`ctabs-wrap${fade ? ' ctabs-wrap--fade' : ''}`}>
            <div className="ctabs" ref={scrollRef}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`ctabs-btn${active === tab.id ? ' ctabs-btn--active' : ''}`}
                        onClick={() => onChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
