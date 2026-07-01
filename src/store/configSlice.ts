import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface GitlabConfig {
    baseUrl: string
    token: string
    projectPath: string
}

const STORAGE_KEY = 'mr-guard-gitlab-config'

function loadFromStorage(): GitlabConfig {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return JSON.parse(raw) as GitlabConfig
    } catch {}
    return { baseUrl: '', token: '', projectPath: '' }
}

const configSlice = createSlice({
    name: 'config',
    initialState: loadFromStorage(),
    reducers: {
        setConfig(_state, action: PayloadAction<GitlabConfig>) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
            return action.payload
        },
        clearConfig() {
            localStorage.removeItem(STORAGE_KEY)
            return { baseUrl: '', token: '', projectPath: '' }
        },
    },
})

export const { setConfig, clearConfig } = configSlice.actions
export default configSlice.reducer
