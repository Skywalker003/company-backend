import { useState, useCallback, useEffect } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import SimpleCrudTab from '../../components/ui/SimpleCrudTab'
import IconSelect from '../../components/ui/IconSelect'
import ImageUpload from '../../components/ui/ImageUpload'
import { useToast } from '../../components/ui/Toast'
import { useCrud } from '../../hooks/useCrud'
import {
    getWhoWeAreText, updateWhoWeAreText,
    getMissionVision, createMissionVision, updateMissionVision, deleteMissionVision,
    getCoreValues, createCoreValue, updateCoreValue, deleteCoreValue,
    getGallerySlides, createGallerySlide, updateGallerySlide, deleteGallerySlide,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'whoweare', label: 'Who We Are' },
    { id: 'mission',  label: 'Mission & Vision' },
    { id: 'values',   label: 'Core Values' },
    { id: 'gallery',  label: 'Gallery' },
]

function WhoWeAreTab() {
    const fetchFn = useCallback(getWhoWeAreText, [])
    const { items: data, loading } = useCrud(fetchFn)
    const [paragraphs, setParagraphs] = useState(['', ''])
    const [saving, setSaving] = useState(false)
    const show = useToast()

    useEffect(() => {
        if (Array.isArray(data) && data.length) setParagraphs(data)
    }, [data])

    const handleSave = (e) => {
        e.preventDefault(); setSaving(true)
        updateWhoWeAreText(paragraphs)
            .then(() => show('Saved successfully'))
            .catch(() => show('Save failed', 'error'))
            .finally(() => setSaving(false))
    }

    if (loading) return <p className="content-loading">Loading…</p>
    return (
        <form className="content-single-form" onSubmit={handleSave}>
            <p style={{ fontSize: '.775rem', color: '#64748b', margin: 0 }}>HTML is supported (e.g. &lt;strong&gt;text&lt;/strong&gt;)</p>
            {paragraphs.map((p, i) => (
                <div className="field" key={i}>
                    <label>Paragraph {i + 1}</label>
                    <textarea value={p} onChange={e => setParagraphs(ps => ps.map((x, j) => j === i ? e.target.value : x))} rows={4} />
                </div>
            ))}
            <div className="content-form-actions">
                <button type="submit" className="content-save-btn" disabled={saving}>
                    {saving ? 'Saving…' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}

export default function About() {
    const [tab, setTab] = useState('whoweare')

    return (
        <div className="content-page">
            <PageHeader title="About" subtitle="Manage the About page content." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'whoweare' && <WhoWeAreTab />}

            {tab === 'mission' && (
                <SimpleCrudTab
                    fetchFn={getMissionVision} createFn={createMissionVision} updateFn={updateMissionVision} deleteFn={deleteMissionVision}
                    blank={{ icon: '', title: '', description: '' }}
                    addLabel="Item"
                    renderPreview={item => <><strong>{item.title}</strong><p className="content-meta">{item.description}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
                        </>
                    )}
                />
            )}

            {tab === 'values' && (
                <SimpleCrudTab
                    fetchFn={getCoreValues} createFn={createCoreValue} updateFn={updateCoreValue} deleteFn={deleteCoreValue}
                    blank={{ icon: '', title: '', desc: '' }}
                    addLabel="Value"
                    renderPreview={item => <><strong>{item.title}</strong><p className="content-meta">{item.desc}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Description</label><textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2} /></div>
                        </>
                    )}
                />
            )}

            {tab === 'gallery' && (
                <SimpleCrudTab
                    fetchFn={getGallerySlides} createFn={createGallerySlide} updateFn={updateGallerySlide} deleteFn={deleteGallerySlide}
                    blank={{ src: '', caption: '' }}
                    addLabel="Slide"
                    renderPreview={item => <><strong>{item.caption}</strong><p className="content-meta">{item.src}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Image</label><ImageUpload value={form.src ?? ''} onChange={v => setForm(f => ({ ...f, src: v }))} /></div>
                            <div className="field"><label>Caption</label><input value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} /></div>
                        </>
                    )}
                />
            )}
        </div>
    )
}
