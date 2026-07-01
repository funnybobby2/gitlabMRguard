import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faBell, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector } from '../../store/hooks'
import './TopNav.scss'

type TopNavProps = {
  title: string
}

export default function TopNav({ title }: TopNavProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isConnected = useAppSelector(s => s.project.status === 'succeeded')

  return (
    <header className="topnav">
      <span className="topnav-title">{title}</span>
      <div className="topnav-actions">
        <div className="search-box">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input type="text" className="search-input" placeholder={t('topnav.searchPlaceholder')} />
        </div>
        <button className="icon-btn" aria-label="Notifications">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button
          className={`icon-btn icon-btn--account${isConnected ? ' icon-btn--connected' : ''}`}
          aria-label="Account"
          onClick={() => navigate('/settings')}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </header>
  )
}
