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
        monthStart.setDate(1)
        monthStart.setHours(0, 0, 0, 0)

        const [project, openMRs, monthMRs] = await Promise.all([
            getProject(baseUrl, token, projectPath),
            getOpenMRs(baseUrl, token, projectPath),
            getMonthMRs(baseUrl, token, projectPath, monthStart.toISOString()),
        ])

        const members = await getProjectMembers(baseUrl, token, project.id)

        // --- Stats ---
        const mergedThisMonth = monthMRs.filter(mr => mr.state === 'merged')
        const closedThisMonth = monthMRs.filter(mr => mr.state === 'closed')
        const total = monthMRs.length
        const merged = mergedThisMonth.length
        const closed = closedThisMonth.length
        const mergeRate = total > 0 ? merged / total : 0

        // --- Avg time to merge ---
        const timesToMerge = mergedThisMonth
            .filter(mr => mr.mergedAt)
            .map(mr => new Date(mr.mergedAt!).getTime() - new Date(mr.createdAt).getTime())
        const avgTimeToMergeMs = timesToMerge.length > 0
            ? timesToMerge.reduce((a, b) => a + b, 0) / timesToMerge.length
            : -1

        // --- Lines ---
        const linesAdded = monthMRs.reduce((s, mr) => s + (mr.diffStatsSummary?.additions ?? 0), 0)
        const linesDeleted = monthMRs.reduce((s, mr) => s + (mr.diffStatsSummary?.deletions ?? 0), 0)

        // --- Warnings: open MRs that qualify ---
        const warnings: WarningEntry[] = openMRs
            .filter(mr => {
                const daysOld = (Date.now() - new Date(mr.createdAt).getTime()) / 86_400_000
                const linesIn = mr.diffStatsSummary?.additions ?? 0
                const approved = mr.approvedBy.nodes.length > 0
                return daysOld > 3 || linesIn >= 2000 || !approved
            })
            .map(mr => ({
                id: String(mr.iid),
                author: mr.author.name,
                date: mr.createdAt,
                link: mr.webUrl,
                added: mr.diffStatsSummary?.additions ?? 0,
                deleted: mr.diffStatsSummary?.deletions ?? 0,
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

        const seen = new Set<number>()
        for (const mr of [...monthMRs, ...openMRs]) {
            if (seen.has(mr.iid)) continue
            seen.add(mr.iid)
            const u = mr.author.username
            if (!memberMap.has(u)) {
                memberMap.set(u, {
                    id: mr.author.id,
                    username: u,
                    name: mr.author.name,
                    avatarUrl: mr.author.avatarUrl || undefined,
                    accessLevel: 0,
                    mrsAuthored: 0,
                    linesAdded: 0,
                    linesDeleted: 0,
                    mrsMerged: 0,
                })
            }
            const stat = memberMap.get(u)!
            stat.mrsAuthored++
            stat.linesAdded += mr.diffStatsSummary?.additions ?? 0
            stat.linesDeleted += mr.diffStatsSummary?.deletions ?? 0
            if (mr.state === 'merged') stat.mrsMerged++
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
