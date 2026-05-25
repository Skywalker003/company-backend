import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import SimpleCrudTab from '../../components/ui/SimpleCrudTab'
import {
    getHomeStats, createHomeStat, updateHomeStat, deleteHomeStat,
    getHomeFeatures, createHomeFeature, updateHomeFeature, deleteHomeFeature,
    getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'stats',        label: 'Stats' },
    { id: 'features',     label: 'Features' },
    { id: 'testimonials', label: 'Testimonials' },
]

export default function Home() {
    const [tab, setTab] = useState('stats')

    return (
        <div className="content-page">
            <PageHeader title="Home" subtitle="Manage home page stats, features, and testimonials." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'stats' && (
                <SimpleCrudTab
                    fetchFn={getHomeStats} createFn={createHomeStat} updateFn={updateHomeStat} deleteFn={deleteHomeStat}
                    blank={{ end: 0, suffix: '', label: '', static: false }}
                    addLabel="Stat"
                    renderPreview={item => (
                        <><strong>{item.end}{item.suffix}</strong> <span className="content-meta">{item.label}</span></>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field-row">
                                <div className="field">
                                    <label>End Value</label>
                                    <input type="number" min={0} value={form.end} onChange={e => setForm(f => ({ ...f, end: +e.target.value }))} />
                                </div>
                                <div className="field">
                                    <label>Suffix</label>
                                    <input value={form.suffix} onChange={e => setForm(f => ({ ...f, suffix: e.target.value }))} placeholder="e.g. +" />
                                </div>
                            </div>
                            <div className="field">
                                <label>Label</label>
                                <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. SOLUTIONS OFFERED" required />
                            </div>
                            <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
                                <input type="checkbox" id="stat-static" checked={form.static ?? false} onChange={e => setForm(f => ({ ...f, static: e.target.checked }))} />
                                <label htmlFor="stat-static" style={{ margin: 0 }}>Static (don't animate)</label>
                            </div>
                        </>
                    )}
                />
            )}

            {tab === 'features' && (
                <SimpleCrudTab
                    fetchFn={getHomeFeatures} createFn={createHomeFeature} updateFn={updateHomeFeature} deleteFn={deleteHomeFeature}
                    blank={{ title: '', desc: '' }}
                    addLabel="Feature"
                    renderPreview={item => (
                        <><strong>{item.title}</strong><p className="content-meta">{item.desc}</p></>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field">
                                <label>Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div className="field">
                                <label>Description</label>
                                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2} />
                            </div>
                        </>
                    )}
                />
            )}

            {tab === 'testimonials' && (
                <SimpleCrudTab
                    fetchFn={getTestimonials} createFn={createTestimonial} updateFn={updateTestimonial} deleteFn={deleteTestimonial}
                    blank={{ name: '', role: '', company: '', rating: 5, quote: '' }}
                    addLabel="Testimonial"
                    renderPreview={item => (
                        <><strong>{item.name}</strong> <span className="content-meta">{item.role}, {item.company} — {'★'.repeat(item.rating)}</span><p className="content-meta">{item.quote}</p></>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field-row">
                                <div className="field">
                                    <label>Name</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                                </div>
                                <div className="field">
                                    <label>Rating (1–5)</label>
                                    <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(f => ({ ...f, rating: +e.target.value }))} />
                                </div>
                            </div>
                            <div className="field-row">
                                <div className="field">
                                    <label>Role</label>
                                    <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. CEO" />
                                </div>
                                <div className="field">
                                    <label>Company</label>
                                    <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                                </div>
                            </div>
                            <div className="field">
                                <label>Quote</label>
                                <textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={3} required />
                            </div>
                        </>
                    )}
                />
            )}
        </div>
    )
}
