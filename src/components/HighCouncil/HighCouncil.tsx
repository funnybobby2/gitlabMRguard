import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faPenToSquare, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import CouncilCard, { type CouncilMember } from './CouncilCard/CouncilCard'
import './HighCouncil.scss'

export type { CouncilMember }

const STORAGE_KEY = 'council-filter'

function readStorage(): { selectedIds: string[]; filterActive: boolean } {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw)
    } catch {}
    return { selectedIds: [], filterActive: false }
}

type Props = {
    members: CouncilMember[]
}

export default function HighCouncil({ members }: Props) {
    const { t } = useTranslation()
    const [selectedIds, setSelectedIds]   = useState<string[]>(() => readStorage().selectedIds)
    const [filterActive, setFilterActive] = useState<boolean>(() => readStorage().filterActive)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedIds, filterActive }))
    }, [selectedIds, filterActive])

    const toggle = (id: string) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const visibleMembers = filterActive && selectedIds.length > 0
        ? members.filter(m => selectedIds.includes(m.id))
        : members

    return (
        <div className="high-council">
            <div className="high-council__title-block">
                <div className="high-council__title-row">
                    <div>
                        <h2 className="high-council__title">{t('highCouncil.title')}</h2>
                        <p className="high-council__subtitle">{t('highCouncil.subtitle')}</p>
                    </div>
                    <div className="high-council__actions">
                        {!filterActive && selectedIds.length > 0 && (
                            <button className="high-council__btn high-council__btn--primary" onClick={() => setFilterActive(true)}>
                                <FontAwesomeIcon icon={faFilter} />
                                {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
                            </button>
                        )}
                        {filterActive && (
                            <>
                                <button className="high-council__btn" onClick={() => setFilterActive(false)}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    Modifier
                                </button>
                                <button className="high-council__btn high-council__btn--ghost" onClick={() => { setSelectedIds([]); setFilterActive(false) }}>
                                    <FontAwesomeIcon icon={faRotateLeft} />
                                    Réinitialiser
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="high-council__grid">
                {visibleMembers.map(m => (
                    <CouncilCard
                        key={m.id}
                        member={m}
                        selected={selectedIds.includes(m.id)}
                        filterActive={filterActive}
                        onToggle={() => toggle(m.id)}
                    />
                ))}
            </div>
        </div>
    )
}
