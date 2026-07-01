import './ScribeCard.scss'

export type ScribeStat = {
  label: string
  value: string
  variant?: 'positive' | 'negative' | 'neutral'
}

type ScribeCardProps = {
  title: string
  stats: ScribeStat[]
  quote?: string
}

export default function ScribeCard({ title, stats, quote }: ScribeCardProps) {
  return (
    <div className="scribe-card">
      <p className="scribe-title">{title}</p>

      <div className="scribe-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="scribe-stat">
            <span className="scribe-stat-label">{stat.label}</span>
            <span className={`scribe-stat-value scribe-stat-value--${stat.variant ?? 'neutral'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {quote && (
        <blockquote className="scribe-quote">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}
    </div>
  )
}
