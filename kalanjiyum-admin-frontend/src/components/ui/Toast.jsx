import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import './Toast.css'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const show = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }, [])

    const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastCtx.Provider value={show}>
            {children}
            <div className="toast-container" aria-live="polite">
                {toasts.map(t => (
                    <div key={t.id} className={`toast toast--${t.type}`} role="alert">
                        <span className="toast-icon">
                            {t.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
                        </span>
                        <span className="toast-msg">{t.message}</span>
                        <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                            <X size={13} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastCtx.Provider>
    )
}

export function useToast() {
    const show = useContext(ToastCtx)
    return show ?? (() => {})
}
