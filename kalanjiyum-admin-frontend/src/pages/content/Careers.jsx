import { useState } from 'react'
import PageHeader from '../../components/ui/PageHeader'
import ContentTabs from '../../components/ui/ContentTabs'
import SimpleCrudTab from '../../components/ui/SimpleCrudTab'
import IconSelect from '../../components/ui/IconSelect'
import {
    getJobs, createJob, updateJob, deleteJob,
    getCareersReasons, createCareersReason, updateCareersReason, deleteCareersReason,
} from '../../api/content'
import './Content.css'

const TABS = [
    { id: 'jobs',    label: 'Job Openings' },
    { id: 'reasons', label: 'Why Join Us' },
]

const BLANK_JOB    = { title: '', type: 'Full-Time', location: '', desc: '' }
const BLANK_REASON = { icon: '', title: '', desc: '' }

export default function Careers() {
    const [tab, setTab] = useState('jobs')

    return (
        <div className="content-page">
            <PageHeader title="Careers" subtitle="Manage job openings and why-join-us content." />
            <ContentTabs tabs={TABS} active={tab} onChange={setTab} />

            {tab === 'jobs' && (
                <SimpleCrudTab
                    fetchFn={getJobs} createFn={createJob} updateFn={updateJob} deleteFn={deleteJob}
                    blank={BLANK_JOB}
                    addLabel="Job"
                    renderPreview={item => (
                        <>
                            <strong>{item.title}</strong>
                            <span className="content-badge">{item.type}</span>
                            <span className="content-badge content-badge--gray">{item.location}</span>
                            <p className="content-meta">{item.desc}</p>
                        </>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field">
                                <label>Job Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. PLC Engineer" required />
                            </div>
                            <div className="field-row">
                                <div className="field">
                                    <label>Type</label>
                                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                        <option>Full-Time</option>
                                        <option>Part-Time</option>
                                        <option>Contract</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label>Location</label>
                                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Chennai, TN" />
                                </div>
                            </div>
                            <div className="field">
                                <label>Description</label>
                                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} rows={3} />
                            </div>
                        </>
                    )}
                />
            )}

            {tab === 'reasons' && (
                <SimpleCrudTab
                    fetchFn={getCareersReasons} createFn={createCareersReason} updateFn={updateCareersReason} deleteFn={deleteCareersReason}
                    blank={BLANK_REASON}
                    addLabel="Reason"
                    renderPreview={item => (
                        <>
                            <strong>{item.title}</strong>
                            <p className="content-meta">{item.desc}</p>
                        </>
                    )}
                    renderForm={(form, setForm) => (
                        <>
                            <div className="field">
                                <label>Icon</label>
                                <IconSelect value={form.icon} onChange={v => setForm(f => ({ ...f, icon: v }))} />
                            </div>
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
        </div>
    )
}