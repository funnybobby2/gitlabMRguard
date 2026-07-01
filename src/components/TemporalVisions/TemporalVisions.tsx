import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faClock, faCodeMerge, type IconDefinition } from '@fortawesome/free-solid-svg-icons'
import './TemporalVisions.scss'

export type TemporalMetric = {
    icon: IconDefinition
    label: string
    value: string
    progress: number
    color: string
}

type Props = {
    metrics: TemporalMetric[]
}

export default function TemporalVisions({ metrics }: Props) {
    const { t } = useTranslation()
    return (
        <div className="temporal-visions">
            <div className="temporal-visions__header">
                <FontAwesomeIcon icon={faClockRotateLeft} />
                <span>{t('temporalVisions.title')}</span>
            </div>
            <div className="temporal-visions__list">
                {metrics.map((m, i) => (
                    <div key={i} className="temporal-metric">
                        <div className="temporal-metric__row">
                            <div className="temporal-metric__label">
                                <FontAwesomeIcon icon={m.icon} className="temporal-metric__icon" />
                                <span>{m.label}</span>
                            </div>
                            <span className="temporal-metric__value" style={{ color: m.color }}>{m.value}</span>
                        </div>
                        <div className="temporal-metric__bar-track">
                            <div
                                className="temporal-metric__bar-fill"
                                style={{ width: `${Math.min(Math.max(m.progress, 0), 100)}%`, background: m.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { faClock, faCodeMerge }
