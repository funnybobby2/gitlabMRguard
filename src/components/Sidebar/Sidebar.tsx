import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faRightFromBracket, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import './Sidebar.scss'
import EyeOfProvidence from './EyeOfProvidence/EyeOfProvidence'
import type { Theme } from '../../hooks/useTheme'
import { useAppDispatch } from '../../store/hooks'
import { clearConfig } from '../../store/configSlice'
import { clearProject } from '../../store/projectSlice'

type NavItem = {
  id: string
  path: string
  label: string
  fullLabel?: string
  icon: React.ReactNode
  onNavigate?: () => void
}

type SidebarProps = {
  appName: string
  navItems: NavItem[]
  onInvokeMerge?: () => void
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

export default function Sidebar({ appName, navItems, onInvokeMerge, theme, onThemeChange }: SidebarProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false)
      }
    }
    if (settingsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen])

  function handleLogout() {
    dispatch(clearConfig())
    dispatch(clearProject())
    navigate('/settings')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <EyeOfProvidence />
        <h1 className="sidebar-appname">{appName}</h1>
        <p className="sidebar-tagline">{t('sidebar.tagline')}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
            onClick={() => item.onNavigate?.()}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="invoke-btn" onClick={onInvokeMerge}>
          {t('sidebar.invokeMerge')}
        </button>
        <div className="sidebar-bottom-links">
          <div className="settings-wrapper" ref={settingsRef}>
            <button className="bottom-link" onClick={() => setSettingsOpen(o => !o)}>
              <FontAwesomeIcon icon={faGear} />
              {t('sidebar.settings')}
            </button>
            {settingsOpen && (
              <div className="settings-popover">
                <span className="settings-popover__label">LANGUAGE</span>
                <div className="settings-popover__langs">
                  <button
                    className={`lang-option${i18n.language.startsWith('fr') ? ' lang-option--active' : ''}`}
                    onClick={() => { i18n.changeLanguage('fr'); setSettingsOpen(false) }}
                  >FR</button>
                  <button
                    className={`lang-option${i18n.language.startsWith('en') ? ' lang-option--active' : ''}`}
                    onClick={() => { i18n.changeLanguage('en'); setSettingsOpen(false) }}
                  >EN</button>
                </div>
                <span className="settings-popover__label">{t('sidebar.theme')}</span>
                <div className="settings-popover__themes">
                  <button
                    className={`theme-option${theme === 'dark' ? ' theme-option--active' : ''}`}
                    onClick={() => onThemeChange('dark')}
                  >
                    <FontAwesomeIcon icon={faMoon} />
                    {t('sidebar.themeDark')}
                  </button>
                  <button
                    className={`theme-option${theme === 'light' ? ' theme-option--active' : ''}`}
                    onClick={() => onThemeChange('light')}
                  >
                    <FontAwesomeIcon icon={faSun} />
                    {t('sidebar.themeLight')}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="bottom-link" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            {t('sidebar.logout')}
          </button>
        </div>
      </div>
    </aside>
  )
}
