import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import './FormModal.css'

export default function FormModal({ title, onClose, onSubmit, submitting, children }) {
    const dirtyRef = useRef(false)

    const guardedClose = () => {
        if (dirtyRef.current && !window.confirm('Discard unsaved changes?')) return
        onClose()
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
        const onKey = (e) => { if (e.key === 'Escape' && !submitting) guardedClose() }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = ''
            document.documentElement.style.overflow = ''
            window.removeEventListener('keydown', onKey)
        }
    }, [submitting])

    const handleSubmit = (e) => {
        dirtyRef.current = false
        onSubmit(e)
    }

    return (
        <div className="fmodal-overlay" onClick={() => !submitting && guardedClose()}>
            <div className="fmodal" onClick={e => e.stopPropagation()}>
                <div className="fmodal-header">
                    <h2 className="fmodal-title">{title}</h2>
                    <button className="fmodal-close" onClick={guardedClose} disabled={submitting} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
                <form className="fmodal-body" onSubmit={handleSubmit} onInput={() => { dirtyRef.current = true }}>
                    <div className="fmodal-fields">{children}</div>
                    <div className="fmodal-footer">
                        <button type="button" className="fmodal-btn fmodal-btn--cancel" onClick={guardedClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="fmodal-btn fmodal-btn--save" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <svg className="fmodal-spinner" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                    </svg>
                                    Saving…
                                </>
                            ) : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
