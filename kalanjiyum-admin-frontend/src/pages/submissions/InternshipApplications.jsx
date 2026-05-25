import { useState, useEffect, useCallback } from 'react'
import { Eye, Download, ExternalLink, RefreshCw, FileDown } from 'lucide-react'

const ORIGIN = (() => { try { return new URL(import.meta.env.VITE_API_BASE_URL ?? '').origin } catch { return '' } })()
const fileUrl = (path) => path ? (path.startsWith('http') ? path : ORIGIN + path) : null
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import DetailModal from '../../components/ui/DetailModal'
import FileViewer from './FileViewer'
import { downloadAs } from './downloadAs'
import { getInternshipSubmissions, markSubmissionViewed, getViewedSubmissions } from '../../api/submissions'
import { exportCsv } from './exportCsv'
import './Submissions.css'

const fmt     = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const fmtShort = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const sameYear = d.getFullYear() === new Date().getFullYear()
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + (sameYear ? '' : ` '${String(d.getFullYear()).slice(2)}`)
}
const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—'

const EXPORT_COLUMNS = [
    { label: 'Date',             value: r => fmt(r.submittedAt) },
    { label: 'Full Name',        value: r => r.fullName ?? '' },
    { label: 'Gender',           value: r => r.gender ?? '' },
    { label: 'DOB',              value: r => fmtDate(r.dob) },
    { label: 'Email',            value: r => r.email ?? '' },
    { label: 'Phone',            value: r => r.phone ?? '' },
    { label: 'Address',          value: r => r.fullAddress ?? '' },
    { label: 'District',         value: r => r.district ?? '' },
    { label: 'State',            value: r => r.state ?? '' },
    { label: 'Pincode',          value: r => r.pincode ?? '' },
    { label: 'College',          value: r => r.collegeName ?? '' },
    { label: 'College Location', value: r => r.collegeLocation ?? '' },
    { label: 'Register No.',     value: r => r.registerNo ?? '' },
    { label: 'Qualification',    value: r => r.qualification ?? '' },
    { label: 'Department',       value: r => r.department ?? '' },
    { label: 'Status',           value: r => r.currentStatus ?? '' },
    { label: 'Passed Year',      value: r => r.passedYear ?? '' },
    { label: 'Domain',           value: r => r.domain ?? '' },
    { label: 'Role',             value: r => r.role ?? '' },
    { label: 'Mode',             value: r => r.mode ?? '' },
    { label: 'Duration',         value: r => r.duration ?? '' },
    { label: 'Start Date',       value: r => fmtDate(r.startDate) },
    { label: 'End Date',         value: r => fmtDate(r.endDate) },
    { label: 'Skills',           value: r => (r.skills ?? []).join('; ') },
    { label: 'Tools',            value: r => (r.tools  ?? []).join('; ') },
    { label: 'Experience',       value: r => r.experience ?? '' },
    { label: 'Resume URL',       value: r => r.resumeUrl   ? fileUrl(r.resumeUrl)   : '' },
    { label: 'Bonafide URL',     value: r => r.bonafideUrl ? fileUrl(r.bonafideUrl) : '' },
    { label: 'ID Proof URL',     value: r => r.idProofUrl  ? fileUrl(r.idProofUrl)  : '' },
]

const COLUMNS = [
    { key: '_seen',       label: '',         width: 24,  render: r => <span className={`sub-dot${r.__viewed ? ' sub-dot--seen' : ''}`} /> },
    { key: 'submittedAt', label: 'Date',     width: 160, render: r => fmt(r.submittedAt) },
    { key: 'fullName',    label: 'Name',     width: 160 },
    { key: 'email',       label: 'Email',    width: 200 },
    { key: 'domain',      label: 'Domain',   width: 160 },
    { key: 'role',        label: 'Role',     width: 180 },
    { key: 'duration',    label: 'Duration', width: 100 },
    { key: 'actions',     label: '',         width: 80,
        render: r => (
            <button className="sub-view-btn" onClick={r.__onView}>
                <Eye size={14} /> View
            </button>
        )
    },
]

const dlName = (url, label, name) => `${label} - ${name}.${(url || '').split('.').pop().toLowerCase() || 'pdf'}`

function InternDetail({ row, onViewFile }) {
    const name = row.fullName || 'Applicant'
    return (
        <dl className="sub-detail">
            <div className="sub-detail_row"><dt>Date</dt><dd>{fmt(row.submittedAt)}</dd></div>
            <div className="sub-detail_row"><dt>Full Name</dt><dd>{row.fullName}</dd></div>
            <div className="sub-detail_row"><dt>Gender</dt><dd>{row.gender}</dd></div>
            <div className="sub-detail_row"><dt>DOB</dt><dd>{fmtDate(row.dob)}</dd></div>
            <div className="sub-detail_row"><dt>Email</dt><dd><a href={`mailto:${row.email}`}>{row.email}</a></dd></div>
            <div className="sub-detail_row"><dt>Phone</dt><dd>{row.phone}</dd></div>
            <div className="sub-detail_row sub-detail_row--full"><dt>Address</dt><dd>{row.fullAddress}, {row.district}, {row.state} — {row.pincode}</dd></div>
            <div className="sub-detail_row"><dt>College</dt><dd>{row.collegeName}</dd></div>
            <div className="sub-detail_row"><dt>College Location</dt><dd>{row.collegeLocation}</dd></div>
            <div className="sub-detail_row"><dt>Register No.</dt><dd>{row.registerNo}</dd></div>
            <div className="sub-detail_row"><dt>Qualification</dt><dd>{row.qualification}</dd></div>
            <div className="sub-detail_row"><dt>Department</dt><dd>{row.department}</dd></div>
            <div className="sub-detail_row"><dt>Status</dt><dd>{row.currentStatus}</dd></div>
            <div className="sub-detail_row"><dt>Passed Year</dt><dd>{row.passedYear}</dd></div>
            <div className="sub-detail_row"><dt>Domain</dt><dd>{row.domain}</dd></div>
            <div className="sub-detail_row"><dt>Role</dt><dd>{row.role}</dd></div>
            <div className="sub-detail_row"><dt>Mode</dt><dd>{row.mode}</dd></div>
            <div className="sub-detail_row"><dt>Duration</dt><dd>{row.duration}</dd></div>
            <div className="sub-detail_row"><dt>Start Date</dt><dd>{fmtDate(row.startDate)}</dd></div>
            <div className="sub-detail_row"><dt>End Date</dt><dd>{fmtDate(row.endDate)}</dd></div>
            {row.skills?.length > 0 && (
                <div className="sub-detail_row sub-detail_row--full"><dt>Skills</dt><dd>{row.skills.join(', ')}</dd></div>
            )}
            {row.tools?.length > 0 && (
                <div className="sub-detail_row sub-detail_row--full"><dt>Tools</dt><dd>{row.tools.join(', ')}</dd></div>
            )}
            {row.experience && (
                <div className="sub-detail_row sub-detail_row--full"><dt>Experience</dt><dd className="sub-detail_message">{row.experience}</dd></div>
            )}
            {row.resumeUrl && (
                <div className="sub-detail_row"><dt>Resume</dt><dd className="sub-file-actions">
                    <button className="sub-file-link" onClick={() => onViewFile({ url: fileUrl(row.resumeUrl), label: 'Resume' })}><ExternalLink size={13} /> View</button>
                    <button className="sub-file-link" onClick={() => downloadAs(fileUrl(row.resumeUrl), dlName(row.resumeUrl, 'Resume', name))}><Download size={13} /> Download</button>
                </dd></div>
            )}
            {row.bonafideUrl && (
                <div className="sub-detail_row"><dt>Bonafide</dt><dd className="sub-file-actions">
                    <button className="sub-file-link" onClick={() => onViewFile({ url: fileUrl(row.bonafideUrl), label: 'Bonafide Certificate' })}><ExternalLink size={13} /> View</button>
                    <button className="sub-file-link" onClick={() => downloadAs(fileUrl(row.bonafideUrl), dlName(row.bonafideUrl, 'Bonafide', name))}><Download size={13} /> Download</button>
                </dd></div>
            )}
            {row.idProofUrl && (
                <div className="sub-detail_row"><dt>ID Proof</dt><dd className="sub-file-actions">
                    <button className="sub-file-link" onClick={() => onViewFile({ url: fileUrl(row.idProofUrl), label: 'ID Proof' })}><ExternalLink size={13} /> View</button>
                    <button className="sub-file-link" onClick={() => downloadAs(fileUrl(row.idProofUrl), dlName(row.idProofUrl, 'ID Proof', name))}><Download size={13} /> Download</button>
                </dd></div>
            )}
        </dl>
    )
}

export default function InternshipApplications() {
    const [rows, setRows]         = useState([])
    const [page, setPage]         = useState(1)
    const [total, setTotal]       = useState(0)
    const [loading, setLoading]   = useState(false)
    const [selected, setSelected] = useState(null)
    const [viewFile, setViewFile] = useState(null)
    const [search, setSearch]       = useState('')
    const [exporting, setExporting] = useState(false)
    const [viewedIds, setViewedIds] = useState(new Set())

    const LIMIT = 20

    const load = useCallback((p) => {
        setLoading(true)
        getInternshipSubmissions(p, LIMIT)
            .then(data => {
                setRows(data.items ?? data)
                setTotal(data.total ?? data.length)
                setPage(p)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load(1) }, [load])
    useEffect(() => { getViewedSubmissions().then(d => setViewedIds(new Set(d.intern ?? []))).catch(() => {}) }, [])

    const handleExport = () => {
        setExporting(true)
        getInternshipSubmissions(1, 9999)
            .then(data => exportCsv(data.items ?? data, EXPORT_COLUMNS, 'internship-applications.csv'))
            .catch(() => {})
            .finally(() => setExporting(false))
    }

    const rowsWithAction = rows.map(r => ({
        ...r,
        __viewed: viewedIds.has(r.id),
        __onView: () => {
            markSubmissionViewed('intern', r.id).catch(() => {})
            setViewedIds(prev => new Set([...prev, r.id]))
            setSelected(r)
        }
    }))
    const filtered = rowsWithAction.filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return (r.fullName ?? '').toLowerCase().includes(q)
            || (r.email   ?? '').toLowerCase().includes(q)
            || (r.domain  ?? '').toLowerCase().includes(q)
            || (r.role    ?? '').toLowerCase().includes(q)
    })
    const totalPages = search ? 1 : Math.ceil(total / LIMIT)
    const subtitle = search
        ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
        : `${total} total application${total !== 1 ? 's' : ''}`

    return (
        <div className="sub-page">
            <PageHeader
                title="Internship Applications"
                subtitle={subtitle}
                action={
                    <div className="sub-toolbar">
                        <input className="sub-search" placeholder="Search name, email, domain…" value={search} onChange={e => setSearch(e.target.value)} />
                        <button className="sub-refresh-btn" onClick={() => load(page)} title="Refresh"><RefreshCw size={14} /></button>
                        <button className="sub-export-btn" onClick={handleExport} disabled={exporting}><FileDown size={14} />{exporting ? 'Exporting…' : 'Export CSV'}</button>
                    </div>
                }
            />
            <DataTable
                columns={COLUMNS}
                rows={filtered}
                page={page}
                totalPages={totalPages}
                onPage={load}
                loading={loading}
                emptyText="No internship applications yet."
                mobileCard={r => {
                    const initials = r.fullName ? r.fullName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2) : '?'
                    const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#0ea5e9']
                    const bg = colors[(r.fullName?.charCodeAt(0) ?? 0) % colors.length]
                    const meta = [r.domain, r.role].filter(Boolean).join(' · ')
                    return (
                        <div className="sub-mcard">
                            <div className="sub-mcard_avatar" style={{ background: bg }}>{initials}{!r.__viewed && <span className="sub-mcard_newdot" />}</div>
                            <div className="sub-mcard_body">
                                <span className="sub-mcard_name">{r.fullName}</span>
                                <span className="sub-mcard_email">{r.email}</span>
                                <div className="sub-mcard_foot">
                                    {meta && <span className="sub-mcard_meta">{meta}</span>}
                                    <span className="sub-mcard_date">{fmtShort(r.submittedAt)}</span>
                                </div>
                            </div>
                            <button className="sub-view-btn" onClick={r.__onView}><Eye size={14}/> View</button>
                        </div>
                    )
                }}
            />
            {selected && (
                <DetailModal title="Internship Application" onClose={() => setSelected(null)}>
                    <InternDetail row={selected} onViewFile={setViewFile} />
                </DetailModal>
            )}
            {viewFile && (
                <FileViewer url={viewFile.url} label={viewFile.label} onClose={() => setViewFile(null)} />
            )}
        </div>
    )
}