import { useTranslation } from 'react-i18next'
import { faClock, faCodeMerge } from '@fortawesome/free-solid-svg-icons'
import StatCard from '../components/StatCard/StatCard'
import ProphecyBanner from '../components/ProphecyBanner/ProphecyBanner'
import DivineWarnings from '../components/DivineWarnings/DivineWarnings'
import TemporalVisions, { TemporalMetric } from '../components/TemporalVisions/TemporalVisions'
import LinesStatCard from '../components/LinesStatCard/LinesStatCard'
import { useAppSelector } from '../store/hooks'
import './Prophecies.scss'

function formatDuration(ms: number): string {
    const h = Math.floor(ms / 3_600_000)
    if (h < 48) return `${h}h`
    return `${Math.floor(h / 24)}j ${h % 24}h`
}

export default function Prophecies() {
    const { t } = useTranslation()
    const { data } = useAppSelector(s => s.project)

    const stats    = data?.stats
    const warnings = data?.warnings.map(w => ({ ...w, date: new Date(w.date) })) ?? []

    const mergeRateMs      = stats?.avgTimeToMergeMs ?? -1
    const mergeTimeVal     = mergeRateMs > 0 ? formatDuration(mergeRateMs) : '—'
    const mergeProgress    = mergeRateMs > 0 ? Math.min(100, (mergeRateMs / (7 * 24 * 3_600_000)) * 100) : 0

    const firstReviewMs    = stats?.avgTimeToFirstReviewMs ?? -1
    const firstReviewVal   = firstReviewMs > 0 ? formatDuration(firstReviewMs) : '—'
    const firstReviewProgress = firstReviewMs > 0 ? Math.min(100, (firstReviewMs / (3 * 24 * 3_600_000)) * 100) : 0

    const temporalMetrics: TemporalMetric[] = [
        { icon: faClock,     label: t('temporalVisions.timeToFirstReview'), value: firstReviewVal,  progress: firstReviewProgress, color: '#e6b428' },
        { icon: faCodeMerge, label: t('temporalVisions.timeToMerge'),       value: mergeTimeVal,    progress: mergeProgress,       color: '#a78bfa' },
    ]

    return (
        <div className="page page--prophecies">
            <div className="prophecies-main">
                <div className="prophecies-left">
                    <ProphecyBanner
                        title={data ? data.projectName : t('prophecyBanner.mergeSuccess')}
                        rate={(stats?.mergeRate ?? 0) * 100}
                    />
                    <div className="prophecies-stats-wrapper">
                        <div className="prophecies-stats">
                            <StatCard label={t('prophecies.totalMRs')} value={stats?.total   ?? 0} subtitle={t('prophecies.totalMRs_sub')} />
                            <StatCard label={t('prophecies.merged')}   value={stats?.merged  ?? 0} subtitle={t('prophecies.merged_sub')} />
                            <StatCard label={t('prophecies.pending')}  value={stats?.opened  ?? 0} subtitle={t('prophecies.pending_sub')} />
                            <StatCard label={t('prophecies.closed')}   value={stats?.closed  ?? 0} subtitle={t('prophecies.closed_sub')} />
                        </div>
                        <div className="prophecies-lines">
                            <LinesStatCard type="added"   count={stats?.linesAdded   ?? 0} />
                            <LinesStatCard type="deleted" count={stats?.linesDeleted ?? 0} />
                        </div>
                    </div>

                    <TemporalVisions metrics={temporalMetrics} />
                </div>
                <DivineWarnings warnings={warnings} />
            </div>
        </div>
    )
}
