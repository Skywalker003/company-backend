import { useState, useEffect, useRef } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import ItemCard from '../../components/ui/ItemCard'
import FormModal from '../../components/ui/FormModal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import TagEditor from '../../components/ui/TagEditor'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/ui/Toast'
import { useCrud } from '../../hooks/useCrud'
import {
    getPortfolioTopics, createPortfolioTopic, updatePortfolioTopic, deletePortfolioTopic,
    getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'topics',   label: 'Topics' },
    { id: 'projects', label: 'Projects' },
]

const BLANK_TOPIC   = { id: '', label: '', fullLabel: '', subFilters: [] }
const BLANK_PROJECT = { topic: '', subCategory: '', tag: 'WEB APP', featured: false, title: '', description: '', highlights: [], phase: '' }

const FALLBACK_TOPICS = [
    { id: 'crm',       label: 'CRM' },
    { id: 'scm',       label: 'SCM' },
    { id: 'mes',       label: 'MES' },
    { id: 'inventory', label: 'Inventory & Warehouse' },
    { id: 'hrm',       label: 'HRM' },
    { id: 'finance',   label: 'Accounting & Finance' },
]
const TAGS = ['WEB APP', 'DASHBOARD', 'MOBILE APP', 'IOT', 'MODULE']
const PHASES = ['', 'Factory Phase', 'Post Factory Phase']

function TopicsTab() {
    const { items, loading, reload } = useCrud(getPortfolioTopics)
    const [modal, setModal]       = useState(null)
    const [form, setForm]         = useState(BLANK_TOPIC)
    const [saving, setSaving]     = useState(false)
    const [deleting, setDeleting] = useState(null)
    const show = useToast()

    const openAdd  = () => { setForm(BLANK_TOPIC); setModal('add') }
    const openEdit = (item) => { setForm(item); setModal('edit') }
    const handleSave = (e) => {
        e.preventDefault(); setSaving(true)
        const call = modal === 'add' ? createPortfolioTopic(form) : updatePortfolioTopic(form.id, form)
        call.then(() => { show('Saved successfully'); reload(); setModal(null) }).catch(() => show('Save failed', 'error')).finally(() => setSaving(false))
    }
    const handleDelete = () => {
        setSaving(true)
        deletePortfolioTopic(deleting.id).then(() => { show('Deleted'); reload(); setDeleting(null) }).catch(() => show('Delete failed', 'error')).finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>
    return (
        <>
            <div className="content-list-header">
                <span className="content-count">{items.length} topic{items.length !== 1 ? 's' : ''}</span>
                <button className="content-add-btn" onClick={openAdd}>+ Add Topic</button>
            </div>
            <div className="content-list">
                {items.length === 0 && <EmptyState title="No topics yet" subtitle="Add your first portfolio topic." actionLabel="+ Add Topic" onAction={openAdd} />}
                {items.map((item, i) => (
                    <ItemCard key={item.id ?? i} onEdit={() => openEdit(item)} onDelete={() => setDeleting(item)}>
                        <strong>{item.fullLabel}</strong>
                        <span className="content-badge content-badge--gray">{item.id}</span>
                        <p className="content-meta">Filters: {(item.subFilters ?? []).join(', ') || '—'}</p>
                    </ItemCard>
                ))}
            </div>
            {modal && (
                <FormModal title={modal === 'add' ? 'Add Topic' : 'Edit Topic'} onClose={() => setModal(null)} onSubmit={handleSave} submitting={saving}>
                    <div className="field-row">
                        <div className="field"><label>ID (slug)</label><input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="e.g. crm" required /></div>
                        <div className="field"><label>Short Label</label><input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. CRM" required /></div>
                    </div>
                    <div className="field"><label>Full Label</label><input value={form.fullLabel} onChange={e => setForm(f => ({ ...f, fullLabel: e.target.value }))} placeholder="e.g. Customer Relationship Management" /></div>
                    <div className="field"><label>Sub-filters</label><TagEditor value={form.subFilters ?? []} onChange={v => setForm(f => ({ ...f, subFilters: v }))} placeholder="Add filter…" /></div>
                </FormModal>
            )}
            {deleting && <ConfirmModal message={`Delete topic "${deleting.label}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </>
    )
}

const PAGE_SIZE = 20

function ProjectsTab() {
    const { items: apiTopics }  = useCrud(getPortfolioTopics)
    const topics = apiTopics.length > 0 ? apiTopics : FALLBACK_TOPICS
    const { items, loading, reload } = useCrud(getPortfolioItems)
    const [modal, setModal]       = useState(null)
    const [form, setForm]         = useState(BLANK_PROJECT)
    const [saving, setSaving]     = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [search, setSearch]     = useState('')
    const [filterTopic, setFilterTopic] = useState('')
    const [page, setPage]         = useState(1)
    const topRef = useRef(null)
    const show = useToast()

    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, [page])

    const selectedTopic = topics.find(t => t.id === form.topic)
    const subFilters = (selectedTopic?.subFilters ?? []).filter(sf => sf !== 'All')

    const openAdd  = () => { setForm(BLANK_PROJECT); setModal('add') }
    const openEdit = (item) => { setForm(item); setModal('edit') }
    const handleSave = (e) => {
        e.preventDefault(); setSaving(true)
        const call = modal === 'add' ? createPortfolioItem(form) : updatePortfolioItem(form.id, form)
        call.then(() => { show('Saved successfully'); reload(); setModal(null) }).catch(() => show('Save failed', 'error')).finally(() => setSaving(false))
    }
    const handleDelete = () => {
        setSaving(true)
        deletePortfolioItem(deleting.id).then(() => { show('Deleted'); reload(); setDeleting(null) }).catch(() => show('Delete failed', 'error')).finally(() => setSaving(false))
    }

    const filtered = items.filter(item => {
        const q = search.toLowerCase()
        const matchSearch = !search
            || (item.title ?? '').toLowerCase().includes(q)
            || (item.topic ?? '').toLowerCase().includes(q)
            || (item.subCategory ?? '').toLowerCase().includes(q)
        const matchTopic = !filterTopic || item.topic === filterTopic
        return matchSearch && matchTopic
    })
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
    const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1) }
    const handleTopicChange  = (e) => { setFilterTopic(e.target.value); setPage(1) }

    if (loading) return <p className="content-loading">Loading…</p>
    return (
        <>
            <div className="content-list-header" ref={topRef}>
                <span className="content-count">
                    {search || filterTopic ? `${filtered.length} / ${items.length}` : items.length} project{items.length !== 1 ? 's' : ''}
                </span>
                <div className="proj-toolbar">
                    <select className="proj-filter-select" value={filterTopic} onChange={handleTopicChange}>
                        <option value="">All topics</option>
                        {topics.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                    <input
                        className="proj-search"
                        placeholder="Search title, topic…"
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <button className="content-add-btn" onClick={openAdd}>+ Add Project</button>
                </div>
            </div>
            <div className="content-list">
                {filtered.length === 0 && items.length > 0 && (
                    <p className="content-loading" style={{ color: '#94a3b8' }}>No projects match your search.</p>
                )}
                {items.length === 0 && <EmptyState title="No projects yet" subtitle="Add your first portfolio project." actionLabel="+ Add Project" onAction={openAdd} />}
                {pageItems.map((item, i) => (
                    <ItemCard key={item.id ?? i} onEdit={() => openEdit(item)} onDelete={() => setDeleting(item)}>
                        <strong>{item.title}</strong>
                        <span className="content-badge content-badge--gray">{item.tag}</span>
                        {item.featured && <span className="content-badge">Featured</span>}
                        <p className="content-meta">{item.topic} · {item.subCategory}</p>
                    </ItemCard>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="proj-pagination">
                    <button className="proj-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                    <span className="proj-page-info">Page {page} of {totalPages}</span>
                    <button className="proj-page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
                </div>
            )}
            {modal && (
                <FormModal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)} onSubmit={handleSave} submitting={saving}>
                    <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                    <div className="field-row">
                        <div className="field">
                            <label>Topic</label>
                            <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value, subCategory: '' }))}>
                                <option value="">Select topic</option>
                                {topics.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label>Tag</label>
                            <select value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                                {TAGS.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="field-row">
                        <div className="field">
                            <label>Sub-category</label>
                            <select value={form.subCategory} onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}>
                                <option value="">— None —</option>
                                {subFilters.map(sf => <option key={sf} value={sf}>{sf}</option>)}
                                {form.subCategory && !subFilters.includes(form.subCategory) && (
                                    <option value={form.subCategory}>{form.subCategory}</option>
                                )}
                            </select>
                        </div>
                        <div className="field">
                            <label>Phase (optional)</label>
                            <select value={form.phase ?? ''} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}>
                                {PHASES.map(p => <option key={p} value={p}>{p || '— None —'}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                        <input type="checkbox" id="proj-featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                        <label htmlFor="proj-featured" style={{ margin: 0 }}>Featured</label>
                    </div>
                    <div className="field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                    <div className="field"><label>Highlights</label><TagEditor value={form.highlights ?? []} onChange={v => setForm(f => ({ ...f, highlights: v }))} placeholder="Add highlight…" /></div>
                </FormModal>
            )}
            {deleting && <ConfirmModal message={`Delete "${deleting.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} loading={saving} />}
        </>
    )
}

export default function Portfolio() {
    const [tab, setTab] = useState('projects')
    return (
        <div className="content-page">
            <PageHeader title="Portfolio" subtitle="Manage portfolio topics and projects." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />
            {tab === 'topics'   && <TopicsTab />}
            {tab === 'projects' && <ProjectsTab />}
        </div>
    )
}
