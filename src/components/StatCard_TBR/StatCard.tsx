import './StatCard.scss'

type StatCardProps = {
  label: string
  value: string
  subtitle: string
}

export default function StatCard({ label, value, subtitle }: StatCardProps) {
  return (
    <div className="stat-card">
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-subtitle">{subtitle}</p>
    </div>
  )
}
