import './AdeptTable.scss'

export type AdeptStatus = 'ASCENDING' | 'ALIGNED' | 'DORMANT'

export type Adept = {
  id: string
  name: string
  avatarUrl?: string
  artifacts: number
  blessings: number
  status: AdeptStatus
}

type AdeptTableProps = {
  title: string
  subtitle: string
  adepts: Adept[]
}

export default function AdeptTable({ title, subtitle, adepts }: AdeptTableProps) {
  return (
    <div className="adept-table-card">
      <div className="adept-table-header">
        <span className="adept-table-title">{title}</span>
        <span className="adept-table-subtitle">{subtitle}</span>
      </div>

      <table className="adept-table">
        <thead>
          <tr>
            <th>ADEPT</th>
            <th>ARTIFACTS</th>
            <th>BLESSINGS</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {adepts.map((adept) => (
            <tr key={adept.id}>
              <td>
                <div className="adept-identity">
                  <Avatar name={adept.name} url={adept.avatarUrl} />
                  <span className="adept-name">{adept.name}</span>
                </div>
              </td>
              <td className="adept-number">{adept.artifacts}</td>
              <td className="adept-number">{adept.blessings}</td>
              <td>
                <span className={`status-badge status-badge--${adept.status.toLowerCase()}`}>
                  {adept.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Avatar({ name, url }: { name: string; url?: string }) {
  const initials = name.slice(0, 2).toUpperCase()
  if (url) {
    return <img className="avatar" src={url} alt={name} />
  }
  return <div className="avatar avatar--initials">{initials}</div>
}
