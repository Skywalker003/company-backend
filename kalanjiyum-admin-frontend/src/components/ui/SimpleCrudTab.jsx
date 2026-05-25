import { useState } from 'react'
import ItemCard from './ItemCard'
import FormModal from './FormModal'
import ConfirmModal from './ConfirmModal'
import EmptyState from './EmptyState'
import { useToast } from './Toast'
import { useCrud } from '../../hooks/useCrud'

export default function SimpleCrudTab({ fetchFn, createFn, updateFn, deleteFn, blank, addLabel, renderPreview, renderForm }) {
    const { items, loading, reload } = useCrud(fetchFn)
    const [modal, setModal]       = useState(null)
    const [form, setForm]         = useState(blank)
    const [saving, setSaving]     = useState(false)
    const [deleting, setDeleting] = useState(null)
    const show = useToast()

    const openAdd  = () => { setForm(blank); setModal('add') }
    const openEdit = (item) => { setForm(item); setModal('edit') }
    const handleSave = (e) => {
        e.preventDefault(); setSaving(true)
        const call = modal === 'add' ? createFn(form) : updateFn(form.id, form)
        call.then(() => { show('Saved successfully'); reload(); setModal(null) }).catch(() => show('Save failed', 'error')).finally(() => setSaving(false))
    }
    const handleDelete = () => {
        setSaving(true)
        deleteFn(deleting.id).then(() => { show('Deleted'); reload(); setDeleting(null) }).catch(() => show('Delete failed', 'error')).finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>
    return (
        <>
            <div className="content-list-header">
                <span className="content-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                <button className="content-add-btn" onClick={openAdd}>+ {addLabel}</button>
            </div>
            <div className="content-list">
                {items.length === 0 && (
                    <EmptyState
                        title={`No ${addLabel.toLowerCase()}s yet`}
                        subtitle={`Add your first ${addLabel.toLowerCase()} to get started.`}
                        actionLabel={`+ Add ${addLabel}`}
                        onAction={openAdd}
                    />
                )}
                {items.map((item, i) => (
                    <ItemCard key={item.id ?? i} onEdit={() => openEdit(item)} onDelete={() => setDeleting(item)}>
                        {renderPreview(item)}
                    </ItemCard>
                ))}
            </div>
            {modal && (
                <FormModal title={modal === 'add' ? `Add ${addLabel}` : 'Edit'} onClose={() => setModal(null)} onSubmit={handleSave} submitting={saving}>
                    {renderForm(form, setForm)}
                </FormModal>
            )}
            {deleting && <ConfirmModal onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </>
    )
}
