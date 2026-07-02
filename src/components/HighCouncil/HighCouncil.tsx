import { useTranslation } from 'react-i18next'
import CouncilCard, { type CouncilMember } from './CouncilCard/CouncilCard'
import './HighCouncil.scss'

export type { CouncilMember }

type Props = {
    members: CouncilMember[]
}

export default function HighCouncil({ members }: Props) {
    const { t } = useTranslation()

    return (
        <div className="high-council">
            <div className="high-council__title-block">
                <h2 className="high-council__title">{t('highCouncil.title')}</h2>
                <p className="high-council__subtitle">{t('highCouncil.subtitle')}</p>
            </div>

            <div className="high-council__grid">
                {members.map(m => (
                    <CouncilCard key={m.id} member={m} />
                ))}
            </div>
        </div>
    )
}
