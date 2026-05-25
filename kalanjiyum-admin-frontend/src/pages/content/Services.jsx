import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import SimpleCrudTab from '../../components/ui/SimpleCrudTab'
import IconSelect from '../../components/ui/IconSelect'
import ImageUpload from '../../components/ui/ImageUpload'
import TagEditor from '../../components/ui/TagEditor'
import {
    getServices, createService, updateService, deleteService,
    getServiceProcess, createServiceStep, updateServiceStep, deleteServiceStep,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'services', label: 'Service Areas' },
    { id: 'process',  label: 'Process Steps' },
]

const BLANK_SERVICE = { title: '', shortDescription: '', desc: '', color: '#3b82f6', bg: '#eff6ff', icon: '', anchor: '', image: '', items: [] }
const BLANK_STEP    = { step: '', icon: '', title: '', desc: '' }

export default function Services() {
    const [tab, setTab] = useState('services')
    return (
        <div className="content-page">
            <PageHeader title="Services" subtitle="Manage service areas and delivery process." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'services' && (
                <SimpleCrudTab
                    fetchFn={getServices} createFn={createService} updateFn={updateService} deleteFn={deleteService}
                    blank={BLANK_SERVICE}
                    addLabel="Service"
                    renderPreview={item => (
                        <>
                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color, marginRight: 6 }} />
                            <strong>{item.title}</strong>
                            <p className="content-meta">{item.shortDescription}</p>
                        </>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Anchor (URL slug)</label><input value={form.anchor} onChange={e => setForm(f => ({ ...f, anchor: e.target.value }))} placeholder="e.g. plc-programming" /></div>
                            <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            <div className="field-row">
                                <div className="field"><label>Accent Color</label><input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></div>
                                <div className="field"><label>Background Color</label><input type="color" value={form.bg} onChange={e => setForm(f => ({ ...f, bg: e.target.value }))} /></div>
                            </div>
                            <div className="field"><label>Short Description</label><input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} /></div>
                            <div className="field"><label>Full Description</label><textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} /></div>
                            <div className="field"><label>Image</label><ImageUpload value={form.image ?? ''} onChange={v => setForm(f => ({ ...f, image: v }))} /></div>
                            <div className="field"><label>Service Items</label><TagEditor value={form.items ?? []} onChange={v => setForm(f => ({ ...f, items: v }))} placeholder="Add item and press Enter…" /></div>
                        </>
                    )}
                />
            )}

            {tab === 'process' && (
                <SimpleCrudTab
                    fetchFn={getServiceProcess} createFn={createServiceStep} updateFn={updateServiceStep} deleteFn={deleteServiceStep}
                    blank={BLANK_STEP}
                    addLabel="Step"
                    renderPreview={item => (
                        <>
                            <strong>Step {item.step}: {item.title}</strong>
                            <p className="content-meta">{item.desc}</p>
                        </>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field-row">
                                <div className="field"><label>Step Number</label><input value={form.step} onChange={e => setForm(f => ({ ...f, step: e.target.value }))} placeholder="01" /></div>
                                <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            </div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Description</label><textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2} /></div>
                        </>
                    )}
                />
            )}
        </div>
    )
}