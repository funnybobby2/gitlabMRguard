import { useState } from 'react'
import './App.scss'
import Sidebar from './components/Sidebar/Sidebar'
import TopNav from './components/TopNav/TopNav'
import Dashboard from './components/Dashboard/Dashboard'

const NAV_ITEMS = [
  { id: 'almanac', label: 'ALMANAC', icon: <GridIcon /> },
  { id: 'prophecies', label: 'PROPHECIES', icon: <GridIcon /> },
  { id: 'coven', label: 'COVEN', icon: <PeopleIcon /> },
  { id: 'dark-omens', label: 'DARK OMENS', icon: <WarningIcon /> },
  { id: 'archives', label: 'ARCHIVES', icon: <ArchiveIcon /> },
]

const TOP_TABS = [
  { id: 'repositories', label: 'REPOSITORIES' },
  { id: 'organizations', label: 'ORGANIZATIONS' },
  { id: 'fleet', label: 'FLEET' },
]

export default function App() {
  const [activeNav, setActiveNav] = useState('almanac')
  const [activeTab, setActiveTab] = useState('repositories')

  return (
    <div className="app">
      <Sidebar
        appName="AETHER"
        tagline="GIT DIVINATION"
        navItems={NAV_ITEMS}
        activeItem={activeNav}
        onNavClick={setActiveNav}
      />
      <div className="main-wrapper">
        <TopNav
          pageTitle="Lunar Overview"
          pageSubtitle=""
          tabs={TOP_TABS}
          activeTab={activeTab}
          onTabClick={setActiveTab}
        />
        <main className="content-area">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function ArchiveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" rx="1" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  )
}
