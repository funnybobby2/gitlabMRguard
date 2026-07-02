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
}

export default function CouncilCard({ member: m }: Props) {
    return (
        <div className="council-card">
            <span className="council-card__role">{m.role}</span>

            <div className="council-card__avatar-wrapper">
                <div
                    className="council-card__avatar"
                    style={{
                        backgroundImage: m.avatar ? `url(${m.avatar})` : undefined,
                        '--glow': m.glowColor,
                    } as React.CSSProperties}
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
