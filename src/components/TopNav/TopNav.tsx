import './TopNav.scss'

type NavTab = {
  id: string
  label: string
}

type TopNavProps = {
  pageTitle: string
  pageSubtitle: string
  tabs: NavTab[]
  activeTab: string
  onTabClick?: (id: string) => void
  searchPlaceholder?: string
}

export default function TopNav({
  pageTitle,
  pageSubtitle,
  tabs,
  activeTab,
  onTabClick,
  searchPlaceholder = 'SEARCH VOID...',
}: TopNavProps) {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="page-title-block">
          <span className="page-title">{pageTitle}</span>
          {pageSubtitle && <span className="page-subtitle">{pageSubtitle}</span>}
        </div>
        <nav className="topnav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`topnav-tab ${activeTab === tab.id ? 'topnav-tab--active' : ''}`}
              onClick={() => onTabClick?.(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="topnav-right">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
          />
        </div>
        <button className="icon-btn" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="icon-btn" aria-label="Account">
          <UserIcon />
        </button>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
