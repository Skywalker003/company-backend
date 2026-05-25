import './PageHeader.css'

export default function PageHeader({ title, subtitle, action }) {
    return (
        <div className="page-header">
            <div>
                <h1 className="page-header_title">{title}</h1>
                {subtitle && <p className="page-header_subtitle">{subtitle}</p>}
            </div>
            {action && <div className="page-header_action">{action}</div>}
        </div>
    )
}
