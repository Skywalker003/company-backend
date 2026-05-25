import { useEffect } from 'react'
import { X } from 'lucide-react'
import './DetailModal.css'

export default function DetailModal({ title, onClose, children }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        const onKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [onClose])

    return (
        <div className="dmodal-overlay" onClick={onClose}>
            <div className="dmodal" onClick={e => e.stopPropagation()}>
                <div className="dmodal-header">
                    <h2 className="dmodal-title">{title}</h2>
                    <button className="dmodal-close" onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <div className="dmodal-body">{children}</div>
            </div>
        </div>
    )
}
