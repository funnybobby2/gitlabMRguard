import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getProject, getProjectMembers, getOpenMRs, getMonthMRs } from '../services/gitlab'
import type { GitlabConfig } from './configSlice'

// --- Exported data types (used by pages) ---

export interface WarningEntry {
    id: string
    author: string
    date: string   // ISO string — convert to Date when reading
    link: string
    added: number
    deleted: number
}

export interface MemberStat {
    id: string
    username: string
    name: string
    avatarUrl: string | undefined
    accessLevel: number
    mrsAuthored: number
    linesAdded: number
    linesDeleted: number
    mrsMerged: number
}

export interface ProjectData {
    projectId: number
    projectName: string
    stats: {
        total: number
        merged: number
        opened: number
        closed: number
        mergeRate: number        // 0–1
        avgTimeToMergeMs: number // -1 = no data
        linesAdded: number
        linesDeleted: number
    }
    warnings: WarningEntry[]
    members: MemberStat[]
}

interface ProjectState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
    data: ProjectData | null
}

// --- Thunk ---

export const fetchProjectData = createAsyncThunk<ProjectData, GitlabConfig>(
    'project/fetch',
    async ({ baseUrl, token, projectPath }) => {
        const monthStart = new Date()
        monthStart.setDate(monthStart.getDate() - 30)
        monthStart.setHours(0, 0, 0, 0)

        const project = await getProject(baseUrl, token, projectPath)

        const [openMRs, monthMRs, members] = await Promise.all([
            getOpenMRs(baseUrl, token, project.id),
            getMonthMRs(baseUrl, token, project.id, monthStart.toISOString()),
            getProjectMembers(baseUrl, token, project.id),
        ])

        // --- Stats ---
        const mergedThisMonth = monthMRs.filter(mr => mr.state === 'merged')
        const closedThisMonth = monthMRs.filter(mr => mr.state === 'closed')
        const total = monthMRs.length
        const merged = mergedThisMonth.length
        const closed = closedThisMonth.length
        const mergeRate = total > 0 ? merged / total : 0

        // --- Avg time to merge ---
        const timesToMerge = mergedThisMonth
            .filter(mr => mr.merged_at)
            .map(mr => new Date(mr.merged_at!).getTime() - new Date(mr.created_at).getTime())
        const avgTimeToMergeMs = timesToMerge.length > 0
            ? timesToMerge.reduce((a, b) => a + b, 0) / timesToMerge.length
            : -1

        // --- Lines (from open MRs) ---
        const linesAdded = openMRs.reduce((s, mr) => s + mr.additions, 0)
        const linesDeleted = openMRs.reduce((s, mr) => s + mr.deletions, 0)

        // --- Warnings: open MRs that qualify ---
        const warnings: WarningEntry[] = openMRs
            .filter(mr => {
                const daysOld = (Date.now() - new Date(mr.created_at).getTime()) / 86_400_000
                return daysOld > 3 || mr.additions >= 2000 || !mr.approved
            })
            .map(mr => ({
                id: String(mr.iid),
                author: mr.author.name,
                date: mr.created_at,
                link: mr.web_url,
                added: mr.additions,
                deleted: mr.deletions,
            }))

        // --- Members stats ---
        const memberMap = new Map<string, MemberStat>()

        for (const m of members) {
            memberMap.set(m.username, {
                id: String(m.id),
                username: m.username,
                name: m.name,
                avatarUrl: m.avatar_url || undefined,
                accessLevel: m.access_level,
                mrsAuthored: 0,
                linesAdded: 0,
                linesDeleted: 0,
                mrsMerged: 0,
            })
        }

        // Pass 1 — monthMRs : comptages mrsAuthored + mrsMerged
        for (const mr of monthMRs) {
            const { username, name, avatar_url, id } = mr.author
            if (!memberMap.has(username)) {
                memberMap.set(username, {
                    id: String(id),
                    username,
                    name,
                    avatarUrl: avatar_url || undefined,
                    accessLevel: 0,
                    mrsAuthored: 0,
                    linesAdded: 0,
                    linesDeleted: 0,
                    mrsMerged: 0,
                })
            }
            const stat = memberMap.get(username)!
            stat.mrsAuthored++
            if (mr.state === 'merged') stat.mrsMerged++
        }

        // Pass 2 — openMRs : stats de lignes
        for (const mr of openMRs) {
            const { username, name, avatar_url, id } = mr.author
            if (!memberMap.has(username)) {
                memberMap.set(username, {
                    id: String(id),
                    username,
                    name,
                    avatarUrl: avatar_url || undefined,
                    accessLevel: 0,
                    mrsAuthored: 0,
                    linesAdded: 0,
                    linesDeleted: 0,
                    mrsMerged: 0,
                })
            }
            const stat = memberMap.get(username)!
            stat.linesAdded  += mr.additions
            stat.linesDeleted += mr.deletions
        }

        const membersList = [...memberMap.values()]
            .filter(m => m.mrsAuthored > 0 || m.accessLevel >= 40)
            .sort((a, b) => b.mrsAuthored - a.mrsAuthored)

        return {
            projectId: project.id,
            projectName: project.name,
            stats: { total, merged, opened: openMRs.length, closed, mergeRate, avgTimeToMergeMs, linesAdded, linesDeleted },
            warnings,
            members: membersList,
        }
    }
)

// --- Slice ---

const projectSlice = createSlice({
    name: 'project',
    initialState: { status: 'idle', error: null, data: null } as ProjectState,
    reducers: {
        clearProject(state) {
            state.status = 'idle'
            state.error = null
            state.data = null
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProjectData.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchProjectData.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.data = action.payload
            })
            .addCase(fetchProjectData.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Unknown error'
            })
    },
})

export const { clearProject } = projectSlice.actions
export default projectSlice.reducer
