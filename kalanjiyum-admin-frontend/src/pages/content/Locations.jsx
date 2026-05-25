import { useState, useEffect } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import ItemCard from '../../components/ui/ItemCard'
import FormModal from '../../components/ui/FormModal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { useCrud } from '../../hooks/useCrud'
import {
    getLocations, createLocation, updateLocation, deleteLocation,
    getFooterContact, updateFooterContact,
    getHeadquarters, updateHeadquarters,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'offices',  label: 'Offices' },
    { id: 'hq',       label: 'Headquarters' },
    { id: 'contact',  label: 'Footer Contact' },
]

const BLANK_LOCATION = { type: 'Registered Office', name: '', address: '', mapUrl: '' }

function LocationForm({ value, onChange }) {
    return (
        <>
            <div className="field">
                <label>Type</label>
                <select value={value.type} onChange={e => onChange({ ...value, type: e.target.value })}>
                    <option>Registered Office</option>
                    <option>Branch Office</option>
                </select>
            </div>
            <div className="field">
                <label>Name</label>
                <input required value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Office name" />
            </div>
            <div className="field">
                <label>Address</label>
                <textarea value={value.address} onChange={e => onChange({ ...value, address: e.target.value })} placeholder="Full address" rows={3} />
            </div>
            <div className="field">
                <label>Map URL</label>
                <input type="url" value={value.mapUrl} onChange={e => onChange({ ...value, mapUrl: e.target.value })} placeholder="Google Maps embed URL" />
            </div>
        </>
    )
}

function OfficesTab() {
    const { items, loading, reload } = useCrud(getLocations)
    const [modal, setModal]     = useState(null)
    const [form, setForm]       = useState(BLANK_LOCATION)
    const [saving, setSaving]   = useState(false)
    const [deleting, setDeleting] = useState(null)
    const show = useToast()

    const openAdd  = () => { setForm(BLANK_LOCATION); setModal('add') }
    const openEdit = (item) => { setForm(item); setModal('edit') }

    const handleSave = (e) => {
        e.preventDefault()
        setSaving(true)
        const call = modal === 'add' ? createLocation(form) : updateLocation(form.id, form)
        call.then(() => { show('Saved successfully'); reload(); setModal(null) }).catch(() => show('Save failed', 'error')).finally(() => setSaving(false))
    }

    const handleDelete = () => {
        setSaving(true)
        deleteLocation(deleting.id)
            .then(() => { show('Deleted'); reload(); setDeleting(null) })
            .catch(() => show('Delete failed', 'error'))
            .finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>

    return (
        <>
            <div className="content-list-header">
                <span className="content-count">{items.length} office{items.length !== 1 ? 's' : ''}</span>
                <button className="content-add-btn" onClick={openAdd}>+ Add Office</button>
            </div>
            <div className="content-list">
                {items.length === 0 && <EmptyState title="No offices yet" subtitle="Add your first office location." actionLabel="+ Add Office" onAction={openAdd} />}
                {items.map(item => (
                    <ItemCard key={item.id} onEdit={() => openEdit(item)} onDelete={() => setDeleting(item)}>
                        <strong>{item.name}</strong>
                        <span className="content-badge">{item.type}</span>
                        <p className="content-meta">{item.address}</p>
                    </ItemCard>
                ))}
            </div>

            {modal && (
                <FormModal title={modal === 'add' ? 'Add Office' : 'Edit Office'} onClose={() => setModal(null)} onSubmit={handleSave} submitting={saving}>
                    <LocationForm value={form} onChange={setForm} />
                </FormModal>
            )}
            {deleting && (
                <ConfirmModal message={`Delete "${deleting.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={saving} />
            )}
        </>
    )
}

function ContactTab() {
    const [form, setForm]       = useState({ email: '', hours: '', address: '' })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving]   = useState(false)
    const show = useToast()

    useEffect(() => {
        setLoading(true)
        getFooterContact()
            .then(data => { if (data) setForm({ email: data.email ?? '', hours: data.hours ?? '', address: data.address ?? '' }) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const handleSave = (e) => {
        e.preventDefault()
        setSaving(true)
        updateFooterContact(form)
            .then(() => show('Saved successfully'))
            .catch(() => show('Save failed', 'error'))
            .finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>

    return (
        <form className="content-single-form" onSubmit={handleSave}>
            <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contactus@example.com" />
            </div>
            <div className="field">
                <label>Business Hours</label>
                <input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="Mon–Sat 9:30AM–5:30PM" />
            </div>
            <div className="field">
                <label>Address</label>
                <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={3} />
            </div>
            <div className="content-form-actions">
                <button type="submit" className="content-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}

function HeadquartersTab() {
    const [form, setForm]       = useState({ name: '', subtitle: '', mapUrl: '' })
    const [loading, setLoading] = useState(false)
    const [saving, setSaving]   = useState(false)
    const show = useToast()

    useEffect(() => {
        setLoading(true)
        getHeadquarters()
            .then(data => { if (data) setForm({ name: data.name ?? '', subtitle: data.subtitle ?? '', mapUrl: data.mapUrl ?? '' }) })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const handleSave = (e) => {
        e.preventDefault()
        setSaving(true)
        updateHeadquarters(form)
            .then(() => show('Saved successfully'))
            .catch(() => show('Save failed', 'error'))
            .finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>

    return (
        <form className="content-single-form" onSubmit={handleSave}>
            <div className="field">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kalanjiyam Technical Solutions" />
            </div>
            <div className="field">
                <label>Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. Our Roots, Our Pride" />
            </div>
            <div className="field">
                <label>Map Embed URL</label>
                <input type="url" value={form.mapUrl} onChange={e => setForm(f => ({ ...f, mapUrl: e.target.value }))} placeholder="Google Maps embed URL" />
            </div>
            <div className="content-form-actions">
                <button type="submit" className="content-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}

export default function Locations() {
    const [tab, setTab] = useState('offices')
    return (
        <div className="content-page">
            <PageHeader title="Locations" subtitle="Manage office locations and contact info." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />
            {tab === 'offices' && <OfficesTab />}
            {tab === 'hq'      && <HeadquartersTab />}
            {tab === 'contact' && <ContactTab />}
        </div>
    )
}
