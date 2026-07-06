import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import './CouncilCard.scss'

export type CouncilMember = {
    id: string
    role: string
    name: string
    title: string
    avatar?: string
    glowColor: string
    stat1: { label: string; value: string; accent?: boolean }
    stat2: { label: string; value: string; accent?: boolean }
}

type Props = {
    member: CouncilMember
    selected?: boolean
    filterActive?: boolean
    onToggle?: () => void
}

export default function CouncilCard({ member: m, selected = false, filterActive = false, onToggle }: Props) {
    const icon = filterActive ? faXmark : selected ? faCheck : faPlus

    return (
        <div
            className={`council-card${selected ? ' council-card--selected' : ''}`}
            style={{ '--glow': m.glowColor } as React.CSSProperties}
        >
            <button
                className={`council-card__toggle${selected ? ' council-card__toggle--active' : ''}`}
                onClick={onToggle}
                title={filterActive ? 'Retirer de la sélection' : selected ? 'Désélectionner' : 'Ajouter à la sélection'}
            >
                <FontAwesomeIcon icon={icon} />
            </button>

            <span className="council-card__role">{m.role}</span>

            <div className="council-card__avatar-wrapper">
                <div
                    className="council-card__avatar"
                    style={{ backgroundImage: m.avatar ? `url(${m.avatar})` : undefined }}
                >
                    {!m.avatar && (
                        <span className="council-card__initials" style={{ color: m.glowColor }}>
                            {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </span>
                    )}
                </div>
            </div>

            <div className="council-card__identity">
                <p className="council-card__name">{m.name}</p>
                <p className="council-card__title">{m.title}</p>
            </div>

            <div className="council-card__divider" />

            <div className="council-card__stats">
                <div className="council-card__stat">
                    <span className="council-card__stat-label">{m.stat1.label}</span>
                    <span
                        className="council-card__stat-value"
                        style={m.stat1.accent ? { color: m.glowColor } : undefined}
                    >
                        {m.stat1.value}
                    </span>
                </div>
                <div className="council-card__stat">
                    <span className="council-card__stat-label">{m.stat2.label}</span>
                    <span
                        className="council-card__stat-value"
                        style={m.stat2.accent ? { color: m.glowColor } : undefined}
                    >
                        {m.stat2.value}
                    </span>
                </div>
            </div>
        </div>
    )
}
