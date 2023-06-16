import { azureStore } from "@/stores/azure";
import type { Azure } from "@/types/azure";
import "@/utilities/prototypes";

const azure = azureStore();

export const apiEndpoints = {
    projects: `https://dev.azure.com/{org}/_apis/projects?api-version=7.1-preview.4`,
    repos: `https://dev.azure.com/{org}/{project}/_apis/git/repositories?api-version=7.1-preview.1`,
    branches: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/refs?api-version=7.1-preview.1`,
    branch: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/refs?api-version=7.1-preview.1&filterContains={branch}&includeLinks=true&includeStatuses=true&peelTags=true`,
    pullRequests: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/pullrequests?api-version=7.1-preview.1&searchCriteria.status=completed`,
    pullRequest: `https://dev.azure.com/{org}/{project}/_apis/git/pullrequests/{id}?api-version=7.1-preview.1`,
    pullRequestsByTargetBranch: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/pullrequests?searchCriteria.targetRefName={targetRef}&searchCriteria.status=completed&api-version=7.1-preview.1&searchCriteria.includeLinks=true`,
    pullRequestStatuses: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/pullRequests/{id}/statuses?api-version=7.0`
};

export const urls = {
    pullRequest: `https://dev.azure.com/{org}/{project}/_git/{repo}/pullrequest/{id}`
};

interface AzureResponse<T> {
    count?: number;
    value: T;
}

export async function get<TResponse>(endpoint: string, pat: string = azure.pat): Promise<TResponse> {
    const encodedPat = azure.encodePat(pat);
    const authorization = `Basic ${encodedPat}`;

    const headers: HeadersInit = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Authorization", authorization);

    const request = await fetch(endpoint, {
        method: "GET",
        headers
    });

    return (await request.json()) as TResponse;
}

export async function postJson<TResponse, TRequest>(endpoint: string, body: TRequest, pat: string = azure.pat): Promise<TResponse> {
    const encodedPat = azure.encodePat(pat);
    const authorization = `Basic ${encodedPat}`;

    const headers: HeadersInit = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", authorization);

    const request = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    });

    if (request.status === 204) {
        return null as TResponse;
    }

    return (await request.json()) as TResponse;
}

const getList = async <TResponse>(endpoint: string, pat = azure.pat): Promise<TResponse[]> => {
    const items: TResponse[] = [];
    let count = 0;
    let skip = 0;
    do {
        const result = await get<AzureResponse<TResponse[]>>(`${endpoint}&$skip=${skip}`, pat);
        count = result.count!;
        skip += result.count!;
        items.push(...result.value);
    } while (count === 101);

    return items;
};

const getProjects = (org = azure.org, pat = azure.pat) => {
    const url = apiEndpoints.projects.formatUnicorn({ org });
    return getList<Azure.Project>(url, pat);
};

const getRepositories = (org = azure.org, project = azure.project, pat = azure.pat) => {
    const url = apiEndpoints.repos.formatUnicorn({ org, project });
    return getList<Azure.Repo>(url, pat);
};

const getBranches = (org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.branches.formatUnicorn({ org, project, repo });
    return getList<Azure.Ref>(url, pat);
};

const getBranch = async (branch: string, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.branch.formatUnicorn({ branch, org, project, repo });
    const branches = await get<AzureResponse<Azure.Ref[]>>(url, pat);
    return branches.value.shift();
};

const getPullRequests = (org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequests.formatUnicorn({ org, project, repo });
    return getList<Azure.PullRequest.PullRequest>(url, pat);
};

const getPullRequest = async (id: number, org = azure.org, project = azure.project, pat = azure.pat) => {
    const url = apiEndpoints.pullRequest.formatUnicorn({ id, org, project });
    const response = await get<Azure.PullRequest.PullRequest>(url, pat);
    return response;
};

const getPullRequestsByTarget = (targetRef: string, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequestsByTargetBranch.formatUnicorn({ targetRef, org, project, repo });
    return getList<Azure.PullRequest.PullRequest>(url, pat);
};

const getTagsFromObject = (obj: Azure.PullRequest.PullRequest | Azure.PullRequest.PullRequest[]) => {
    if (obj.constructor.name === "Array") {
        return (obj as Azure.PullRequest.PullRequest[])
            .filter((pr) => pr.labels)
            .map((pr) => pr.labels)
            .flat()
            .map((l) => l.name)
            .distinct();
    }

    return (obj as Azure.PullRequest.PullRequest).labels.map((l) => l.name).distinct();
};

const listPullRequestStatuses = (id: number, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequestStatuses.formatUnicorn({ org, project, repo, id });
    return getList<Azure.PullRequestStatus>(url, pat);
};

const setPullRequestStatus = (id: number, status: Azure.PullRequestStatus, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequestStatuses.formatUnicorn({ org, project, repo, id });
    return postJson<Azure.PullRequestStatus, Azure.PullRequestStatus>(url, status, pat);
};

interface IScope {
    scope: String;
    reason: String;
}

export const requiredScopes: IScope[] = [
    {
        scope: "Project and Team:Read",
        reason: "Needed to list available projects."
    },
    {
        scope: "Code:Read",
        reason: "Needed to list available repositories."
    },
    {
        scope: "Code:Status",
        reason: "Needed to update pull request statuses."
    }
];

export default {
    getProjects,
    getRepositories,
    getBranches,
    getBranch,
    getPullRequests,
    getPullRequest,
    getPullRequestsByTarget,
    getTagsFromObject,
    listPullRequestStatuses,
    setPullRequestStatus
};
