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

export interface GqlMRNode {
    iid: number
    title: string
    state: string
    createdAt: string
    mergedAt: string | null
    webUrl: string
    author: {
        id: string
        username: string
        name: string
        avatarUrl: string
    }
    approvedBy: {
        nodes: Array<{ id: string }>
    }
    diffStatsSummary: {
        additions: number
        deletions: number
    } | null
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

async function gqlFetch<T = Record<string, unknown>>(
    baseUrl: string,
    token: string,
    query: string,
    variables: Record<string, unknown> = {}
): Promise<T> {
    const res = await fetch(`${baseUrl}/api/graphql`, {
        method: 'POST',
        headers: { 'PRIVATE-TOKEN': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    })
    if (!res.ok) throw new Error(`GraphQL ${res.status}`)
    const json = await res.json()
    if (json.errors?.length) throw new Error(json.errors[0].message)
    return json.data as T
}

async function fetchAllGqlPages<TNode>(
    baseUrl: string,
    token: string,
    query: string,
    variables: Record<string, unknown>,
    getPage: (data: Record<string, unknown>) => { nodes: TNode[]; pageInfo: { hasNextPage: boolean; endCursor: string } }
): Promise<TNode[]> {
    const all: TNode[] = []
    let after: string | null = null
    do {
        const data = await gqlFetch<Record<string, unknown>>(baseUrl, token, query, { ...variables, after })
        const page = getPage(data)
        all.push(...page.nodes)
        if (!page.pageInfo.hasNextPage) break
        after = page.pageInfo.endCursor
    } while (true)
    return all
}

// --- GraphQL queries ---

const OPEN_MRS_QUERY = `
  query OpenMRs($fullPath: ID!, $after: String) {
    project(fullPath: $fullPath) {
      mergeRequests(state: opened, first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          iid title createdAt webUrl
          author { id username name avatarUrl }
          approvedBy { nodes { id } }
          diffStatsSummary { additions deletions }
        }
      }
    }
  }
`

const MONTH_MRS_QUERY = `
  query MonthMRs($fullPath: ID!, $createdAfter: Time!, $after: String) {
    project(fullPath: $fullPath) {
      mergeRequests(createdAfter: $createdAfter, first: 100, after: $after) {
        pageInfo { hasNextPage endCursor }
        nodes {
          iid state createdAt mergedAt
          author { id username name avatarUrl }
          diffStatsSummary { additions deletions }
        }
      }
    }
  }
`

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

export async function getOpenMRs(baseUrl: string, token: string, projectPath: string): Promise<GqlMRNode[]> {
    return fetchAllGqlPages<GqlMRNode>(
        baseUrl, token, OPEN_MRS_QUERY, { fullPath: projectPath },
        (data) => (data as any).project.mergeRequests
    )
}

export async function getMonthMRs(baseUrl: string, token: string, projectPath: string, createdAfter: string): Promise<GqlMRNode[]> {
    return fetchAllGqlPages<GqlMRNode>(
        baseUrl, token, MONTH_MRS_QUERY, { fullPath: projectPath, createdAfter },
        (data) => (data as any).project.mergeRequests
    )
}
