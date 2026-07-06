// --- Types ---

export interface GitlabProject {
    id: number
    name: string
    name_with_namespace: string
    web_url: string
}

export interface GitlabMember {
    id: number
    username: string
    name: string
    avatar_url: string
    access_level: number
}

export interface GitlabMRRest {
    iid: number
    title: string
    state: string
    created_at: string
    merged_at: string | null
    web_url: string
    author: { id: number; username: string; name: string; avatar_url: string }
}

export interface GitlabOpenMR extends GitlabMRRest {
    approved: boolean
    additions: number
    deletions: number
}

// --- Internal helpers ---

function parseDiffStats(changes: Array<{ diff: string }>): { additions: number; deletions: number } {
    let additions = 0, deletions = 0
    for (const { diff } of changes) {
        for (const line of diff.split('\n')) {
            if (line.startsWith('+') && !line.startsWith('+++')) additions++
            else if (line.startsWith('-') && !line.startsWith('---')) deletions++
        }
    }
    return { additions, deletions }
}

function buildHeaders(token: string): HeadersInit {
    return { 'PRIVATE-TOKEN': token }
}

async function restGet<T>(url: string, token: string): Promise<T> {
    const res = await fetch(url, { headers: buildHeaders(token) })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`GitLab ${res.status}: ${text}`)
    }
    return res.json() as Promise<T>
}

// --- Public API ---

export async function getProject(baseUrl: string, token: string, projectPath: string): Promise<GitlabProject> {
    return restGet(`${baseUrl}/api/v4/projects/${encodeURIComponent(projectPath)}`, token)
}

export async function getProjectMembers(baseUrl: string, token: string, projectId: number): Promise<GitlabMember[]> {
    const all: GitlabMember[] = []
    let page = 1
    while (true) {
        const batch = await restGet<GitlabMember[]>(
            `${baseUrl}/api/v4/projects/${projectId}/members/all?per_page=100&page=${page}`,
            token
        )
        all.push(...batch)
        if (batch.length < 100) break
        page++
    }
    return all
}

export async function getOpenMRs(baseUrl: string, token: string, projectId: number): Promise<GitlabOpenMR[]> {
    // 1. Fetch all open MRs (paginated)
    const all: GitlabMRRest[] = []
    let page = 1
    while (true) {
        const batch = await restGet<GitlabMRRest[]>(
            `${baseUrl}/api/v4/projects/${projectId}/merge_requests?state=opened&per_page=100&page=${page}`,
            token
        )
        all.push(...batch)
        if (batch.length < 100) break
        page++
    }

    // 2. Enrich each MR with approvals and diff stats in parallel
    return Promise.all(all.map(async (mr) => {
        const [approvals, changes] = await Promise.all([
            restGet<{ approved: boolean }>(
                `${baseUrl}/api/v4/projects/${projectId}/merge_requests/${mr.iid}/approvals`,
                token
            ).catch(() => ({ approved: false })),
            restGet<{ diff_stats?: { additions: number; deletions: number }; changes?: Array<{ diff: string }> }>(
                `${baseUrl}/api/v4/projects/${projectId}/merge_requests/${mr.iid}/changes`,
                token
            ).catch(() => ({ diff_stats: undefined, changes: [] })),
        ])
        const diffStats = changes.diff_stats ?? parseDiffStats(changes.changes ?? [])
        return {
            ...mr,
            approved: approvals.approved,
            additions: diffStats.additions,
            deletions: diffStats.deletions,
        }
    }))
}

export async function getMRFirstNoteDate(baseUrl: string, token: string, projectId: number, mrIid: number): Promise<string | null> {
    const notes = await restGet<Array<{ system: boolean; created_at: string }>>(
        `${baseUrl}/api/v4/projects/${projectId}/merge_requests/${mrIid}/notes?sort=asc&order_by=created_at&per_page=20`,
        token
    ).catch(() => [] as Array<{ system: boolean; created_at: string }>)
    return notes.find(n => !n.system)?.created_at ?? null
}

export async function getMonthMRs(baseUrl: string, token: string, projectId: number, createdAfter: string): Promise<GitlabMRRest[]> {
    const all: GitlabMRRest[] = []
    let page = 1
    while (true) {
        const batch = await restGet<GitlabMRRest[]>(
            `${baseUrl}/api/v4/projects/${projectId}/merge_requests?state=all&created_after=${encodeURIComponent(createdAfter)}&per_page=100&page=${page}`,
            token
        )
        all.push(...batch)
        if (batch.length < 100) break
        page++
    }
    return all
}
