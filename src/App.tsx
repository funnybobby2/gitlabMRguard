import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScroll, faUsers, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import './App.scss'
import Sidebar from './components/Sidebar/Sidebar'
import TopNav from './components/TopNav/TopNav'
import Footer from './components/Footer/Footer'
import Prophecies from './pages/Prophecies'
import Coven from './pages/Coven'
import Archives from './pages/Archives'
import Settings from './pages/Settings'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { triggerSuspicious, triggerCuriosity, setMode } from './store/eyeSlice'
import { fetchProjectData } from './store/projectSlice'
import { useRandomEyeEffect } from './hooks/useRandomEyeEffect'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()
  const config = useAppSelector(s => s.config)
  const projectStatus = useAppSelector(s => s.project.status)
  useRandomEyeEffect()

  // Auto-fetch on load if config is stored
  useEffect(() => {
    if (config.baseUrl && config.token && config.projectPath && projectStatus === 'idle') {
      dispatch(fetchProjectData(config))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const NAV_ITEMS = [
    { id: 'prophecies', path: '/prophecies', label: t('nav.prophecies'), fullLabel: t('nav.prophecies_full'), icon: <FontAwesomeIcon icon={faScroll} />,     onNavigate: () => dispatch(triggerSuspicious()) },
    { id: 'coven',      path: '/coven',      label: t('nav.coven'),      fullLabel: t('nav.coven_full'),       icon: <FontAwesomeIcon icon={faUsers} />,      onNavigate: () => dispatch(triggerCuriosity()) },
    { id: 'archives',   path: '/archives',   label: t('nav.archives'),   fullLabel: t('nav.archives_full'),    icon: <FontAwesomeIcon icon={faBoxArchive} />, onNavigate: () => dispatch(setMode({ mode: 'sharingan', value: true })) },
  ]

  const activeItem = NAV_ITEMS.find(n => pathname.startsWith(n.path))
  const pageTitle = activeItem?.fullLabel ?? (pathname.startsWith('/settings') ? t('nav.settings_full') : '')

  return (
    <div className="app">
      <Sidebar appName="MR patrol" navItems={NAV_ITEMS} theme={theme} onThemeChange={setTheme} />
      <div className="main-wrapper">
        <TopNav title={pageTitle} />
        <main className="content-area">
          <Routes>
            <Route index element={<Navigate to="/prophecies" replace />} />
            <Route path="/prophecies" element={<Prophecies />} />
            <Route path="/coven"      element={<Coven />} />
            <Route path="/archives"   element={<Archives />} />
            <Route path="/settings"   element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  )
}
