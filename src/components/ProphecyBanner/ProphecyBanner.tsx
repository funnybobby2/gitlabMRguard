import { useTranslation } from 'react-i18next'
import './ProphecyBanner.scss'

type Props = {
    title: string
    rate: number
    onSummonReviewers?: () => void
    onViewScrolls?: () => void
}

type Tier = 'danger' | 'warning' | 'info' | 'success'

function getTier(rate: number): Tier {
    if (rate <= 40) return 'danger'
    if (rate <= 60) return 'warning'
    if (rate <= 80) return 'info'
    return 'success'
}

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProphecyBanner({ title, rate, onSummonReviewers, onViewScrolls }: Props) {
    const { t } = useTranslation()
    const dashOffset = CIRCUMFERENCE * (1 - Math.min(Math.max(rate, 0), 100) / 100)
    const tier = getTier(rate)

    return (
        <div className={`prophecy-banner prophecy-banner--${tier}`}>
            <div className="prophecy-banner__circle-wrapper">
                <svg className="prophecy-banner__circle" viewBox="0 0 200 200">
                    <circle className="prophecy-banner__track"     cx="100" cy="100" r={RADIUS} />
                    <circle
                        className="prophecy-banner__progress"
                        cx="100" cy="100" r={RADIUS}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                    />
                </svg>
                <div className="prophecy-banner__circle-label">
                    <span className="prophecy-banner__circle-text">{t('prophecyBanner.mergeSuccess')}</span>
                    <span className="prophecy-banner__circle-value">{+rate.toFixed(2)}%</span>
                </div>
            </div>

            <div className="prophecy-banner__content">
                <span className={`prophecy-banner__badge prophecy-banner__badge--${tier}`}>
                    <AlignmentIcon />
                    {t('prophecyBanner.alignment')} : {t(`prophecyBanner.tiers.${tier}.label`)}
                </span>
                <h2 className="prophecy-banner__title">{title}</h2>
                <p className="prophecy-banner__description">{t(`prophecyBanner.tiers.${tier}.description`)}</p>
                <div className="prophecy-banner__actions">
                    <button className="prophecy-banner__btn prophecy-banner__btn--primary" onClick={onSummonReviewers}>
                        {t('prophecyBanner.summonReviewers')}
                    </button>
                    <button className="prophecy-banner__btn prophecy-banner__btn--secondary" onClick={onViewScrolls}>
                        {t('prophecyBanner.viewScrolls')}
                    </button>
                </div>
            </div>
        </div>
    )
}

function AlignmentIcon() {
    return (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
    )
}
