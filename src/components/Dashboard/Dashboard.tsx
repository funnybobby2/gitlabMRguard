import './Dashboard.scss'
import StatCard from '../StatCard/StatCard'
import AdeptTable, { type Adept } from '../AdeptTable/AdeptTable'
import ScribeCard, { type ScribeStat } from '../ScribeCard/ScribeCard'

const STAT_CARDS = [
  { label: 'Total MRs', value: '1,284', subtitle: '+12% lunar flux' },
  { label: 'Merged', value: '942', subtitle: 'Successfully Aligned' },
]

const ADEPTS: Adept[] = [
  { id: '1', name: 'ARCHON_X', artifacts: 412, blessings: 89, status: 'ASCENDING' },
  { id: '2', name: 'VELAS_NULL', artifacts: 388, blessings: 112, status: 'ALIGNED' },
  { id: '3', name: 'MIRA_VII', artifacts: 271, blessings: 64, status: 'ASCENDING' },
  { id: '4', name: 'SERAPH_0', artifacts: 213, blessings: 37, status: 'DORMANT' },
]

const SCRIBE_STATS: ScribeStat[] = [
  { label: 'Additions', value: '+12,842', variant: 'positive' },
  { label: 'Deletions', value: '-4,210', variant: 'negative' },
  { label: 'Commits', value: '3,892', variant: 'neutral' },
]

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h2 className="dashboard-title">
          {'ARCANES DE FUSION'.split('').map((char, i) => (
            <span key={i} className={char !== ' ' ? `glyph glyph-${i % 4}` : undefined}>
              {char}
            </span>
          ))}
        </h2>
        <span className="dashboard-cycle">CELESTIAL CYCLE: WAXING MOON</span>
      </div>

      <div className="dashboard-stats">
        {STAT_CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dashboard-grid">
        <AdeptTable
          title="Le Cercle des Sages"
          subtitle="Adept Council"
          adepts={ADEPTS}
        />
        <ScribeCard
          title="Scribe de l'Éther"
          stats={SCRIBE_STATS}
          quote="The code volume is currently in celestial alignment. No retrograde detected."
        />
      </div>
    </div>
  )
}
