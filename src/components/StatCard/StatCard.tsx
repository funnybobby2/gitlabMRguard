import './StatCard.scss'

type StatCardProps = {
    label: string
    value: string | number
    subtitle?: string
}

export default function StatCard({ label, value, subtitle }: StatCardProps) {
    return (
        <div className="stat-card">
            <p className="stat-card-label">{label}</p>
            <p className="stat-card-value">{value}</p>
            {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
        </div>
    )
}
