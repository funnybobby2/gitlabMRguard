import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setConfig } from '../store/configSlice'
import { fetchProjectData } from '../store/projectSlice'
import './Settings.scss'

export default function Settings() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const storedConfig = useAppSelector(s => s.config)
    const { status, error, data } = useAppSelector(s => s.project)

    const [baseUrl, setBaseUrl]           = useState(storedConfig.baseUrl)
    const [token, setToken]               = useState(storedConfig.token)
    const [projectPath, setProjectPath]   = useState(storedConfig.projectPath)

    const isLoading = status === 'loading'
    const canSubmit = baseUrl.trim() && token.trim() && projectPath.trim() && !isLoading

    function handleConnect() {
        const cfg = {
            baseUrl:     baseUrl.trim().replace(/\/$/, ''),
            token:       token.trim(),
            projectPath: projectPath.trim(),
        }
        dispatch(setConfig(cfg))
        dispatch(fetchProjectData(cfg))
    }

    return (
        <div className="page settings-page">
            <div className="settings-section">
                <h2 className="settings-section__title">{t('settings.gitlab.title')}</h2>
                <p className="settings-section__subtitle">{t('settings.gitlab.subtitle')}</p>

                <div className="settings-form">
                    <div className="settings-form__field">
                        <label className="settings-form__label">{t('settings.gitlab.baseUrl')}</label>
                        <input
                            className="settings-form__input"
                            type="url"
                            value={baseUrl}
                            onChange={e => setBaseUrl(e.target.value)}
                            placeholder={t('settings.gitlab.baseUrlPlaceholder')}
                            autoComplete="off"
                        />
                    </div>

                    <div className="settings-form__field">
                        <label className="settings-form__label">{t('settings.gitlab.token')}</label>
                        <input
                            className="settings-form__input"
                            type="password"
                            value={token}
                            onChange={e => setToken(e.target.value)}
                            placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                            autoComplete="off"
                        />
                        <span className="settings-form__hint">{t('settings.gitlab.tokenHint')}</span>
                    </div>

                    <div className="settings-form__field">
                        <label className="settings-form__label">{t('settings.gitlab.projectPath')}</label>
                        <input
                            className="settings-form__input"
                            type="text"
                            value={projectPath}
                            onChange={e => setProjectPath(e.target.value)}
                            placeholder={t('settings.gitlab.projectPathPlaceholder')}
                            autoComplete="off"
                        />
                    </div>

                    <button
                        className="settings-form__submit"
                        onClick={handleConnect}
                        disabled={!canSubmit}
                    >
                        {isLoading
                            ? <><FontAwesomeIcon icon={faSpinner} spin /> {t('settings.gitlab.connecting')}</>
                            : t('settings.gitlab.connect')
                        }
                    </button>

                    {status === 'succeeded' && data && (
                        <div className="settings-status settings-status--success">
                            <FontAwesomeIcon icon={faCircleCheck} />
                            {t('settings.gitlab.connected', { name: data.projectName })}
                        </div>
                    )}

                    {status === 'failed' && error && (
                        <div className="settings-status settings-status--error">
                            <FontAwesomeIcon icon={faTriangleExclamation} />
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
