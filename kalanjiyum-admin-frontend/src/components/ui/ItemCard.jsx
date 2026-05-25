import { Pencil, Trash2 } from 'lucide-react'
import './ItemCard.css'

export default function ItemCard({ onEdit, onDelete, children }) {
    return (
        <div className="item-card">
            <div className="item-card_body">{children}</div>
            <div className="item-card_actions">
                <button className="item-card_btn item-card_btn--edit" onClick={onEdit} aria-label="Edit">
                    <Pencil size={13} /> Edit
                </button>
                <button className="item-card_btn item-card_btn--delete" onClick={onDelete} aria-label="Delete" title="Delete">
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    )
}
