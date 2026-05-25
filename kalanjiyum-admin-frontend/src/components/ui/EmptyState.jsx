import { Inbox } from 'lucide-react'
import './EmptyState.css'

export default function EmptyState({ icon: Icon = Inbox, title, subtitle, actionLabel, onAction }) {
    return (
        <div className="empty-state">
            <div className="empty-state_icon">
                <Icon size={30} />
            </div>
            <p className="empty-state_title">{title}</p>
            {subtitle && <p className="empty-state_sub">{subtitle}</p>}
            {actionLabel && (
                <button className="empty-state_btn" onClick={onAction} type="button">
                    {actionLabel}
                </button>
            )}
        </div>
    )
}
