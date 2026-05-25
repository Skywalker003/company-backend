import { useState, useEffect, useCallback } from 'react'
import { Eye, Download, ExternalLink, RefreshCw, FileDown } from 'lucide-react'

const ORIGIN = (() => { try { return new URL(import.meta.env.VITE_API_BASE_URL ?? '').origin } catch { return '' } })()
const fileUrl = (path) => path ? (path.startsWith('http') ? path : ORIGIN + path) : null
import PageHeader from '../../components/ui/PageHeader'
import DataTable from '../../components/ui/DataTable'
import DetailModal from '../../components/ui/DetailModal'
import FileViewer from './FileViewer'
import { downloadAs } from './downloadAs'
import { getJobSubmissions, markSubmissionViewed, getViewedSubmissions } from '../../api/submissions'
import { exportCsv } from './exportCsv'
import './Submissions.css'

const fmt = (iso) => iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'
const fmtShort = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    const sameYear = d.getFullYear() === new Date().getFullYear()
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + (sameYear ? '' : ` '${String(d.getFullYear()).slice(2)}`)
}

const EXPORT_COLUMNS = [
    { label: 'Date',       value: r => fmt(r.submittedAt) },
    { label: 'First Name', value: r => r.firstName ?? '' },
    { label: 'Last Name',  value: r => r.lastName ?? '' },
    { label: 'Email',      value: r => r.email ?? '' },
    { label: 'Phone',      value: r => r.phone ?? '' },
    { label: 'Position',   value: r => r.position ?? '' },
    { label: 'Address',    value: r => r.address ?? '' },
    { label: 'Resume URL', value: r => r.resumeUrl ? fileUrl(r.resumeUrl) : '' },
    { label: 'Photo URL',  value: r => r.photoUrl  ? fileUrl(r.photoUrl)  : '' },
]

const COLUMNS = [
    { key: '_seen',       label: '',         width: 24,  render: r => <span className={`sub-dot${r.__viewed ? ' sub-dot--seen' : ''}`} /> },
    { key: 'submittedAt', label: 'Date',     width: 160, render: r => fmt(r.submittedAt) },
    { key: 'name',        label: 'Name',     width: 180, render: r => `${r.firstName} ${r.lastName}` },
    { key: 'email',       label: 'Email',    width: 200 },
    { key: 'phone',       label: 'Phone',    width: 130 },
    { key: 'position',    label: 'Position', width: 200 },
    { key: 'actions',     label: '',         width: 80,
        render: r => (
            <button className="sub-view-btn" onClick={r.__onView}>
                <Eye size={14} /> View
            </button>
        )
    },
]

const dlName = (url, label, name) => `${label} - ${name}.${(url || '').split('.').pop().toLowerCase() || 'pdf'}`

function JobDetail({ row, onViewFile }) {
    const name = `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Applicant'
    return (
        <dl className="sub-detail">
            <div className="sub-detail_row"><dt>Date</dt><dd>{fmt(row.submittedAt)}</dd></div>
            <div className="sub-detail_row"><dt>Name</dt><dd>{row.firstName} {row.lastName}</dd></div>
            <div className="sub-detail_row"><dt>Email</dt><dd><a href={`mailto:${row.email}`}>{row.email}</a></dd></div>
            <div className="sub-detail_row"><dt>Phone</dt><dd>{row.phone || '—'}</dd></div>
            <div className="sub-detail_row"><dt>Position</dt><dd>{row.position || '—'}</dd></div>
            <div className="sub-detail_row"><dt>Address</dt><dd>{row.address || '—'}</dd></div>
            {row.resumeUrl && (
                <div className="sub-detail_row">
                    <dt>Resume</dt>
                    <dd className="sub-file-actions">
                        <button className="sub-file-link" onClick={() => onViewFile({ url: fileUrl(row.resumeUrl), label: 'Resume' })}><ExternalLink size={13} /> View</button>
                        <button className="sub-file-link" onClick={() => downloadAs(fileUrl(row.resumeUrl), dlName(row.resumeUrl, 'Resume', name))}><Download size={13} /> Download</button>
                    </dd>
                </div>
            )}
            {row.photoUrl && (
                <div className="sub-detail_row">
                    <dt>Photo</dt>
                    <dd className="sub-file-actions">
                        <button className="sub-file-link" onClick={() => onViewFile({ url: fileUrl(row.photoUrl), label: 'Photo' })}><ExternalLink size={13} /> View</button>
                        <button className="sub-file-link" onClick={() => downloadAs(fileUrl(row.photoUrl), dlName(row.photoUrl, 'Photo', name))}><Download size={13} /> Download</button>
                    </dd>
                </div>
            )}
        </dl>
    )
}

export default function JobApplications() {
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
        getJobSubmissions(p, LIMIT)
            .then(data => {
                setRows(data.items ?? data)
                setTotal(data.total ?? data.length)
                setPage(p)
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { load(1) }, [load])
    useEffect(() => { getViewedSubmissions().then(d => setViewedIds(new Set(d.jobs ?? []))).catch(() => {}) }, [])

    const handleExport = () => {
        setExporting(true)
        getJobSubmissions(1, 9999)
            .then(data => exportCsv(data.items ?? data, EXPORT_COLUMNS, 'job-applications.csv'))
            .catch(() => {})
            .finally(() => setExporting(false))
    }

    const rowsWithAction = rows.map(r => ({
        ...r,
        __viewed: viewedIds.has(r.id),
        __onView: () => {
            markSubmissionViewed('jobs', r.id).catch(() => {})
            setViewedIds(prev => new Set([...prev, r.id]))
            setSelected(r)
        }
    }))
    const filtered = rowsWithAction.filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return (`${r.firstName} ${r.lastName}`).toLowerCase().includes(q)
            || (r.email    ?? '').toLowerCase().includes(q)
            || (r.position ?? '').toLowerCase().includes(q)
    })
    const totalPages = search ? 1 : Math.ceil(total / LIMIT)
    const subtitle = search
        ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
        : `${total} total application${total !== 1 ? 's' : ''}`

    return (
        <div className="sub-page">
            <PageHeader
                title="Job Applications"
                subtitle={subtitle}
                action={
                    <div className="sub-toolbar">
                        <input className="sub-search" placeholder="Search name, email…" value={search} onChange={e => setSearch(e.target.value)} />
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
                emptyText="No job applications yet."
                mobileCard={r => {
                    const name = `${r.firstName ?? ''} ${r.lastName ?? ''}`.trim()
                    const initials = name ? name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0,2) : '?'
                    const colors = ['#3b82f6','#8b5cf6','#ec4899','#f59e0b','#10b981','#0ea5e9']
                    const bg = colors[(name?.charCodeAt(0) ?? 0) % colors.length]
                    return (
                        <div className="sub-mcard">
                            <div className="sub-mcard_avatar" style={{ background: bg }}>{initials}{!r.__viewed && <span className="sub-mcard_newdot" />}</div>
                            <div className="sub-mcard_body">
                                <span className="sub-mcard_name">{name}</span>
                                <span className="sub-mcard_email">{r.email}</span>
                                <div className="sub-mcard_foot">
                                    {r.position && <span className="sub-mcard_meta">{r.position}</span>}
                                    <span className="sub-mcard_date">{fmtShort(r.submittedAt)}</span>
                                </div>
                            </div>
                            <button className="sub-view-btn" onClick={r.__onView}><Eye size={14}/> View</button>
                        </div>
                    )
                }}
            />
            {selected && (
                <DetailModal title="Job Application" onClose={() => setSelected(null)}>
                    <JobDetail row={selected} onViewFile={setViewFile} />
                </DetailModal>
            )}
            {viewFile && (
                <FileViewer url={viewFile.url} label={viewFile.label} onClose={() => setViewFile(null)} />
            )}
        </div>
    )
}