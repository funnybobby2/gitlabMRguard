import { useTranslation } from 'react-i18next'
import HighCouncil, { CouncilMember } from '../components/HighCouncil/HighCouncil'
import { useAppSelector } from '../store/hooks'
import type { MemberStat } from '../store/projectSlice'
import './Coven.scss'

function accessLevelToRole(level: number, t: (k: string) => string): string {
    if (level >= 50) return t('highCouncil.roles.architect')
    if (level >= 40) return t('highCouncil.roles.gatekeeper')
    if (level >= 30) return t('highCouncil.roles.scholar')
    return t('highCouncil.roles.herald')
}

function accessLevelToTitle(level: number, t: (k: string) => string): string {
    if (level >= 50) return t('highCouncil.titles.highAuthor')
    if (level >= 40) return t('highCouncil.titles.grandInquisitor')
    if (level >= 30) return t('highCouncil.titles.sageOfScript')
    return t('highCouncil.titles.sealBearer')
}

function accessLevelToGlow(level: number): string {
    if (level >= 50) return '#e6b428'
    if (level >= 40) return '#e84060'
    if (level >= 30) return '#3a7bd5'
    return '#00c87a'
}

function memberToCard(m: MemberStat, t: (k: string) => string): CouncilMember {
    return {
        id:        m.id,
        role:      accessLevelToRole(m.accessLevel, t),
        name:      m.name,
        title:     accessLevelToTitle(m.accessLevel, t),
        avatar:    m.avatarUrl,
        glowColor: accessLevelToGlow(m.accessLevel),
        stat1: { label: t('highCouncil.stats.summons'), value: `${m.mrsAuthored} MRs`, accent: true },
        stat2: { label: t('highCouncil.stats.scrolls'), value: `+${m.linesAdded.toLocaleString()}`, accent: m.linesAdded > 0 },
    }
}

export default function Coven() {
    const { t } = useTranslation()
    const { data } = useAppSelector(s => s.project)

    const members: CouncilMember[] = data
        ? data.members.map(m => memberToCard(m, t))
        : []

    return (
        <div className="page page--coven">
            <HighCouncil members={members} />
        </div>
    )
}
