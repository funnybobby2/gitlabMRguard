import { useTranslation } from 'react-i18next'
import './Footer.scss'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="app-footer">
      {t('footer.text')}
    </footer>
  )
}
