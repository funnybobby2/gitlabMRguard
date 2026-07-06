import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faHourglassHalf,
    faBan,
    faBolt,
    faUserSecret,
    faClock,
    faFire,
} from '@fortawesome/free-solid-svg-icons'
import './WarningItem.scss'

export type WarningCategory = 'abandoned' | 'unsanctified' | 'chaos'

export type WarningItemProps = {
    id: string
    title: string
    author: string
    date: Date
    link: string
    added: number
    deleted: number
    onExorcise?: () => void
}

const CATEGORY_ICON = {
    abandoned:    faHourglassHalf,
    unsanctified: faBan,
    chaos:        faBolt,
}

function getCategory(added: number, date: Date): WarningCategory {
    const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000)
    if (diffDays > 3)   return 'abandoned'
    if (added >= 2000)  return 'chaos'
    return 'unsanctified'
}

function getRelativeTime(date: Date): string {
    const diffMs   = Date.now() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 60)  return `${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30)  return `${diffDays}d`
    return `${Math.floor(diffDays / 30)}mo`
}

export default function WarningItem({ id, title, author, date, link, added, deleted, onExorcise }: WarningItemProps) {
    const { t } = useTranslation()
    const category = getCategory(added, date)
    const moons    = getRelativeTime(date)

    return (
        <div className={`warning-item warning-item--${category}`}>
            <div className="warning-item__icon">
                <FontAwesomeIcon icon={CATEGORY_ICON[category]} />
            </div>

            <div className="warning-item__body">
                <div className="warning-item__header">
                    <span className="warning-item__id">#{id}</span>
                    <span className="warning-item__title">{title}</span>
                </div>

                <p className="warning-item__desc">
                    {category === 'abandoned'    && t('warningItem.abandoned',    { moons })}
                    {category === 'unsanctified' && t('warningItem.unsanctified')}
                    {category === 'chaos'        && t('warningItem.chaos',        { count: added.toLocaleString() })}
                </p>

                <div className="warning-item__meta">
                    <FontAwesomeIcon icon={faUserSecret} />
                    <span className="warning-item__author">{author}</span>
                    <FontAwesomeIcon icon={faClock} />
                    <span className="warning-item__time">{getRelativeTime(date)}</span>
                </div>

                <div className="warning-item__diff">
                    <span className="warning-item__diff-added">+{added.toLocaleString()} {t('divineWarnings.linesAdded')}</span>
                    <span className="warning-item__diff-removed">-{deleted.toLocaleString()} {t('divineWarnings.linesRemoved')}</span>
                </div>
            </div>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="warning-item__exorcise"
                onClick={onExorcise}
                title={t('divineWarnings.exorciseOne')}
            >
                <FontAwesomeIcon icon={faFire} />
                {t('divineWarnings.exorciseOne')}
            </a>
        </div>
    )
}
