import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import WarningItem from './WarningItem/WarningItem'
import './DivineWarnings.scss'

export type Warning = {
    id: string
    title: string
    author: string
    date: Date
    link: string
    added: number
    deleted: number
}

type Props = {
    warnings: Warning[]
    onExorciseWarning?: (id: string) => void
}

export default function DivineWarnings({ warnings, onExorciseWarning }: Props) {
    const { t } = useTranslation()
    return (
        <div className="divine-warnings">
            <div className="divine-warnings__header">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                <span>{t('divineWarnings.title')}</span>
            </div>

            <div className="divine-warnings__list">
                {warnings.map(w => (
                    <WarningItem
                        key={w.id}
                        {...w}
                        onExorcise={() => onExorciseWarning?.(w.id)}
                    />
                ))}
            </div>
        </div>
    )
}
