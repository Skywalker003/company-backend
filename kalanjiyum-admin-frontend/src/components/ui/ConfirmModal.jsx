import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import './ConfirmModal.css'

export default function ConfirmModal({ message = 'Are you sure you want to delete this item?', onConfirm, onCancel, loading }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape' && !loading) onCancel() }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onCancel, loading])

    return (
        <div className="cmodal-overlay" onClick={() => !loading && onCancel()}>
            <div className="cmodal" onClick={e => e.stopPropagation()}>
                <div className="cmodal-icon"><AlertTriangle size={22} /></div>
                <p className="cmodal-message">{message}</p>
                <div className="cmodal-actions">
                    <button className="cmodal-btn cmodal-btn--cancel" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="cmodal-btn cmodal-btn--delete" onClick={onConfirm} disabled={loading}>
                        {loading ? (
                            <>
                                <svg className="cmodal-spinner" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Deleting…
                            </>
                        ) : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}
