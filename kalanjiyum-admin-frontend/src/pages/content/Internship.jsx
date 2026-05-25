import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import SimpleCrudTab from '../../components/ui/SimpleCrudTab'
import IconSelect from '../../components/ui/IconSelect'
import ImageUpload from '../../components/ui/ImageUpload'
import TagEditor from '../../components/ui/TagEditor'
import {
    getInternDomains,     createInternDomain,     updateInternDomain,     deleteInternDomain,
    getInternReasons,     createInternReason,     updateInternReason,     deleteInternReason,
    getInternBenefits,    createInternBenefit,    updateInternBenefit,    deleteInternBenefit,
    getInternSteps,       createInternStep,       updateInternStep,       deleteInternStep,
    getEligibilityCards,  createEligibilityCard,  updateEligibilityCard,  deleteEligibilityCard,
    getInternFAQs,        createInternFAQ,        updateInternFAQ,        deleteInternFAQ,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'domains',     label: 'Domains' },
    { id: 'reasons',     label: 'Why Intern' },
    { id: 'benefits',    label: 'Benefits' },
    { id: 'steps',       label: 'Steps' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'faqs',        label: 'FAQs' },
]

export default function Internship() {
    const [tab, setTab] = useState('domains')
    return (
        <div className="content-page">
            <PageHeader title="Internship" subtitle="Manage all internship page content." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'domains' && (
                <SimpleCrudTab
                    fetchFn={getInternDomains} createFn={createInternDomain} updateFn={updateInternDomain} deleteFn={deleteInternDomain}
                    blank={{ title: '', badge: '', badgeColor: '#3b82f6', desc: '', domainKey: '', image: '', rolesLabel: 'Roles', roles: [], tagsLabel: '', tagGroups: [] }}
                    addLabel="Domain"
                    renderPreview={item => (
                        <><strong>{item.title}</strong><span className="content-badge" style={{ background: item.badgeColor + '20', color: item.badgeColor }}>{item.badge}</span><p className="content-meta">{item.desc}</p></>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field-row">
                                <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                                <div className="field"><label>Domain Key</label><input value={form.domainKey} onChange={e => setForm(f => ({ ...f, domainKey: e.target.value }))} placeholder="e.g. software-dev" /></div>
                            </div>
                            <div className="field-row">
                                <div className="field"><label>Badge Text</label><input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} /></div>
                                <div className="field"><label>Badge Color</label><input type="color" value={form.badgeColor} onChange={e => setForm(f => ({ ...f, badgeColor: e.target.value }))} /></div>
                            </div>
                            <div className="field"><label>Description</label><textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={2} /></div>
                            <div className="field"><label>Image</label><ImageUpload value={form.image ?? ''} onChange={v => setForm(f => ({ ...f, image: v }))} /></div>
                            <div className="field"><label>Roles Label</label><input value={form.rolesLabel} onChange={e => setForm(f => ({ ...f, rolesLabel: e.target.value }))} /></div>
                            <div className="field"><label>Roles</label><TagEditor value={form.roles ?? []} onChange={v => setForm(f => ({ ...f, roles: v }))} placeholder="Add role…" /></div>
                            <div className="field"><label>Tags Label</label><input value={form.tagsLabel ?? ''} onChange={e => setForm(f => ({ ...f, tagsLabel: e.target.value }))} placeholder="e.g. Tech Stack" /></div>
                            <div className="field">
                                <label>Tag Groups</label>
                                {(form.tagGroups ?? []).map((grp, gi) => (
                                    <div key={gi} className="field-row" style={{ alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div className="field" style={{ flex: '0 0 140px' }}>
                                            <input value={grp.label} onChange={e => setForm(f => { const g = [...f.tagGroups]; g[gi] = { ...g[gi], label: e.target.value }; return { ...f, tagGroups: g } })} placeholder="Group label" />
                                        </div>
                                        <div className="field" style={{ flex: 1 }}>
                                            <TagEditor value={grp.tags ?? []} onChange={v => setForm(f => { const g = [...f.tagGroups]; g[gi] = { ...g[gi], tags: v }; return { ...f, tagGroups: g } })} placeholder="Add tag…" />
                                        </div>
                                        <button type="button" style={{ marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger, #ef4444)' }} onClick={() => setForm(f => ({ ...f, tagGroups: f.tagGroups.filter((_, i) => i !== gi) }))}>✕</button>
                                    </div>
                                ))}
                                <button type="button" className="content-add-btn" style={{ marginTop: '0.25rem' }} onClick={() => setForm(f => ({ ...f, tagGroups: [...(f.tagGroups ?? []), { label: '', tags: [] }] }))}>+ Add Group</button>
                            </div>
                        </>
                    )}
                />
            )}

            {tab === 'reasons' && (
                <SimpleCrudTab
                    fetchFn={getInternReasons} createFn={createInternReason} updateFn={updateInternReason} deleteFn={deleteInternReason}
                    blank={{ icon: '', title: '', text: '' }}
                    addLabel="Reason"
                    renderPreview={item => <><strong>{item.title}</strong><p className="content-meta">{item.text}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Text</label><textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={2} /></div>
                        </>
                    )}
                />
            )}

            {tab === 'benefits' && (
                <SimpleCrudTab
                    fetchFn={getInternBenefits} createFn={createInternBenefit} updateFn={updateInternBenefit} deleteFn={deleteInternBenefit}
                    blank={{ benefit: '' }}
                    addLabel="Benefit"
                    renderPreview={item => <span>{item.benefit}</span>}
                    renderForm={(form, setForm) => (
                        <div className="field"><label>Benefit</label><input value={form.benefit} onChange={e => setForm(f => ({ ...f, benefit: e.target.value }))} required /></div>
                    )}
                />
            )}

            {tab === 'steps' && (
                <SimpleCrudTab
                    fetchFn={getInternSteps} createFn={createInternStep} updateFn={updateInternStep} deleteFn={deleteInternStep}
                    blank={{ num: '', title: '', text: '' }}
                    addLabel="Step"
                    renderPreview={item => <><strong>Step {item.num}: {item.title}</strong><p className="content-meta">{item.text}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Step Number</label><input value={form.num} onChange={e => setForm(f => ({ ...f, num: e.target.value }))} placeholder="1" /></div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Text</label><textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={2} /></div>
                        </>
                    )}
                />
            )}

            {tab === 'eligibility' && (
                <SimpleCrudTab
                    fetchFn={getEligibilityCards} createFn={createEligibilityCard} updateFn={updateEligibilityCard} deleteFn={deleteEligibilityCard}
                    blank={{ icon: '', title: '', text: '' }}
                    addLabel="Card"
                    renderPreview={item => <><strong>{item.title}</strong><p className="content-meta">{item.text}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Icon</label><IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} /></div>
                            <div className="field"><label>Title</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                            <div className="field"><label>Text</label><textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={2} /></div>
                        </>
                    )}
                />
            )}

            {tab === 'faqs' && (
                <SimpleCrudTab
                    fetchFn={getInternFAQs} createFn={createInternFAQ} updateFn={updateInternFAQ} deleteFn={deleteInternFAQ}
                    blank={{ q: '', a: '' }}
                    addLabel="FAQ"
                    renderPreview={item => <><strong>{item.q}</strong><p className="content-meta">{item.a}</p></>}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field"><label>Question</label><input value={form.q} onChange={e => setForm(f => ({ ...f, q: e.target.value }))} required /></div>
                            <div className="field"><label>Answer</label><textarea value={form.a} onChange={e => setForm(f => ({ ...f, a: e.target.value }))} rows={3} /></div>
                        </>
                    )}
                />
            )}
        </div>
    )
}
