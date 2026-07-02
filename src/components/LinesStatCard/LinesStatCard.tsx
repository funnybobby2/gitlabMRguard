import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import './LinesStatCard.scss'

type Props = {
    type: 'added' | 'deleted'
    count: number
}

export default function LinesStatCard({ type, count }: Props) {
    const { t } = useTranslation()
    const isAdded = type === 'added'

    return (
        <div className={`lines-stat-card lines-stat-card--${type}`}>
            <div className="lines-stat-card__icon">
                <FontAwesomeIcon icon={isAdded ? faPlus : faMinus} />
            </div>
            <div className="lines-stat-card__body">
                <p className="lines-stat-card__label">{t(`linesStatCard.${type}.label`)}</p>
                <p className="lines-stat-card__value">
                    {count.toLocaleString()}
                </p>
                <p className="lines-stat-card__subtitle">{t(`linesStatCard.${type}.subtitle`)}</p>
            </div>
        </div>
    )
}
