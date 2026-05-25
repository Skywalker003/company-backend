import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { uploadFile } from '../../api/client'
import './ImageUpload.css'

const ORIGIN = (() => { try { return new URL(import.meta.env.VITE_API_BASE_URL ?? '').origin } catch { return '' } })()
const toAbsolute = (url) => url ? (url.startsWith('http') ? url : ORIGIN + url) : ''

export default function ImageUpload({ value, onChange }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError]         = useState('')
    const inputRef = useRef(null)

    const handleFile = (file) => {
        if (!file) return
        setError('')
        setUploading(true)
        uploadFile('/submissions/upload', file)
            .then(data => onChange(data.url))
            .catch(() => setError('Upload failed — try again.'))
            .finally(() => setUploading(false))
    }

    return (
        <div className="img-upload">
            {value && (
                <div className="img-upload_preview">
                    <img src={toAbsolute(value)} alt="Preview" />
                    <button type="button" className="img-upload_remove" onClick={() => onChange('')} title="Remove"><X size={12} /></button>
                </div>
            )}
            <div className="img-upload_row">
                <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { handleFile(e.target.files[0]); e.target.value = '' }} />
                <button type="button" className="img-upload_btn" onClick={() => inputRef.current.click()} disabled={uploading}>
                    <Upload size={13} />{uploading ? 'Uploading…' : 'Upload Image'}
                </button>
                <span className="img-upload_or">or paste URL</span>
                <input className="img-upload_url" type="url" placeholder="https://…" value={value} onChange={e => onChange(e.target.value)} />
            </div>
            {error && <p className="img-upload_error">{error}</p>}
        </div>
    )
}