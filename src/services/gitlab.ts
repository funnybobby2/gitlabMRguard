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
        const [approvals, details] = await Promise.all([
            restGet<{ approved: boolean }>(
                `${baseUrl}/api/v4/projects/${projectId}/merge_requests/${mr.iid}/approvals`,
                token
            ).catch(() => ({ approved: false })),
            restGet<{ diff_stats?: { additions: number; deletions: number } }>(
                `${baseUrl}/api/v4/projects/${projectId}/merge_requests/${mr.iid}`,
                token
            ).catch(() => ({ diff_stats: undefined })),
        ])
        return {
            ...mr,
            approved: approvals.approved,
            additions: details.diff_stats?.additions ?? 0,
            deletions: details.diff_stats?.deletions ?? 0,
        }
    }))
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
