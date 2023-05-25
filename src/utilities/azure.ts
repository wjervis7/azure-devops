import { azureStore } from "@/stores/azure";

const azure = azureStore();

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

    const response = (await request.json()) as AzureResponse<TResponse>;
    return response.value;
}

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
