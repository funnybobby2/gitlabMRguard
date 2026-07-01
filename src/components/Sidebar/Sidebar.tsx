import './Sidebar.scss'
import EyeOfProvidence from './EyeOfProvidence/EyeOfProvidence'

type NavItem = {
  id: string
  label: string
  icon: React.ReactNode
}

type SidebarProps = {
  appName: string
  tagline: string
  navItems: NavItem[]
  activeItem: string
  onNavClick?: (id: string) => void
  onInvokeMerge?: () => void
}


export default function Sidebar({
  appName,
  tagline,
  navItems,
  activeItem,
  onNavClick,
  onInvokeMerge,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <EyeOfProvidence />
        <h1 className="sidebar-appname">{appName}</h1>
        <p className="sidebar-tagline">{tagline}</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeItem === item.id ? 'nav-item--active' : ''}`}
            onClick={() => onNavClick?.(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <span className="nav-item-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="invoke-btn" onClick={onInvokeMerge}>
          INVOKE MERGE
        </button>
        <div className="sidebar-bottom-links">
          <button className="bottom-link">
            <SettingsIcon />
            SETTINGS
          </button>
          <button className="bottom-link">
            <LogoutIcon />
            LOGOUT
          </button>
        </div>
      </div>
    </aside>
  )
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}
