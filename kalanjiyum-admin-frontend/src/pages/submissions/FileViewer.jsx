import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { downloadAs } from './downloadAs'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString()

const IMAGES = ['jpg', 'jpeg', 'png', 'gif', 'webp']

export default function FileViewer({ url, label, onClose }) {
    const ext     = (url || '').split('.').pop().toLowerCase()
    const isImage = IMAGES.includes(ext)
    const isPdf   = ext === 'pdf'

    const [numPages, setNumPages] = useState(null)
    const [pageNum,  setPageNum]  = useState(1)

    return (
        <div className="fv-overlay" onClick={onClose}>
            <div className="fv-box" onClick={e => e.stopPropagation()}>
                <div className="fv-header">
                    <span>{label}</span>
                    <div className="fv-header-actions">
                        {isPdf && numPages > 1 && (
                            <span className="fv-pager">
                                <button className="fv-page-btn" disabled={pageNum <= 1} onClick={() => setPageNum(p => p - 1)}><ChevronLeft size={14}/></button>
                                <span>{pageNum} / {numPages}</span>
                                <button className="fv-page-btn" disabled={pageNum >= numPages} onClick={() => setPageNum(p => p + 1)}><ChevronRight size={14}/></button>
                            </span>
                        )}
                        <button className="sub-file-link" onClick={() => downloadAs(url, `${label}.${(url || '').split('.').pop().toLowerCase() || 'file'}`)}><Download size={13} /> Download</button>
                        <button className="fv-close" onClick={onClose}><X size={16} /></button>
                    </div>
                </div>
                <div className="fv-body">
                    {isImage && <img src={url} alt={label} />}
                    {isPdf && (
                        <Document
                            file={url}
                            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setPageNum(1) }}
                            loading={<p className="fv-noprev">Loading…</p>}
                            error={<p className="fv-noprev">Could not load PDF — <a href={url} download>download instead</a></p>}
                        >
                            <Page
                                pageNumber={pageNum}
                                width={820}
                                renderTextLayer
                                renderAnnotationLayer
                            />
                        </Document>
                    )}
                    {!isImage && !isPdf && (
                        <p className="fv-noprev">Preview not available — <a href={url} download>download to view</a></p>
                    )}
                </div>
            </div>
        </div>
    )
}