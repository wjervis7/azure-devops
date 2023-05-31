import { azureStore } from "@/stores/azure";
import "@/utilities/prototypes";

const azure = azureStore();

export const apiEndpoints = {
    projects: `https://dev.azure.com/{org}/_apis/projects?api-version=7.1-preview.4`,
    repos: `https://dev.azure.com/{org}/{project}/_apis/git/repositories?api-version=7.1-preview.1`,
    branches: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/refs?api-version=7.1-preview.1`,
    branch: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/refs?api-version=7.1-preview.1&filterContains={branch}&includeLinks=true&includeStatuses=true&peelTags=true`,
    pullRequests: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/pullrequests?api-version=7.1-preview.1&searchCriteria.status=completed`,
    pullRequestsByTargetBranch: `https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repo}/pullrequests?searchCriteria.targetRefName={targetRef}&searchCriteria.status=completed&api-version=7.1-preview.1&searchCriteria.includeLinks=true`
};

export const urls = {
    pullRequest: `https://dev.azure.com/{org}/{project}/_git/{repo}/pullrequest/{id}`
};

interface AzureResponse<T> {
    count?: number;
    value: T;
}

export async function get<TResponse>(endpoint: string, pat: string = azure.pat): Promise<AzureResponse<TResponse>> {
    const encodedPat = azure.encodePat(pat);
    const authorization = `Basic ${encodedPat}`;

    const headers: HeadersInit = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Authorization", authorization);

    const request = await fetch(endpoint, {
        method: "GET",
        headers
    });

    const response = (await request.json()) as AzureResponse<TResponse>;
    return response;
}

const getList = async <TResponse>(endpoint: string, pat = azure.pat): Promise<TResponse[]> => {
    const items: TResponse[] = [];
    let count = 0;
    let skip = 0;
    do {
        const result = await get<TResponse[]>(`${endpoint}&$skip=${skip}`, pat);
        count = result.count!;
        skip += result.count!;
        items.push(...result.value);
    } while (count === 101);

    return items;
};

const getProjects = (org = azure.org, pat = azure.pat) => {
    const url = apiEndpoints.projects.replace("{org}", org);
    return getList<Azure.Project>(url, pat);
};

const getRepositories = (org = azure.org, project = azure.project, pat = azure.pat) => {
    const url = apiEndpoints.repos.replace("{org}", org).replace("{project}", project);
    return getList<Azure.Repo>(url, pat);
};

const getBranches = (org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.branches.formatUnicorn({ org, project, repo });
    return getList<Azure.Ref>(url, pat);
};

const getBranch = async (branch: string, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.branch.formatUnicorn({ branch, org, project, repo });
    const branches = await get<Azure.Ref[]>(url, pat);
    return branches.value.shift();
};

const getPullRequests = (org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequests.formatUnicorn({ org, project, repo });
    return getList<Azure.PullRequest>(url, pat);
};

const getPullRequestsByTarget = (targetRef: string, org = azure.org, project = azure.project, repo = azure.repo, pat = azure.pat) => {
    const url = apiEndpoints.pullRequestsByTargetBranch.formatUnicorn({ targetRef, org, project, repo });
    return getList<Azure.PullRequest>(url, pat);
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
    }
];

export default {
    getProjects,
    getRepositories,
    getBranches,
    getBranch,
    getPullRequests,
    getPullRequestsByTarget
};
