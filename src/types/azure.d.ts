declare namespace Azure {
    interface Project {
        id: string;
        name: string;
    }

    interface Repo {
        id: string;
        name: string;
    }

    interface IdentityRef {
        id: string;
        displayName: string;
    }

    enum GitStatusState {
        error,
        failed,
        notApplicable,
        notSet,
        pending,
        succeeded
    }

    interface GitStatus {
        createdBy: IdentityRef;
        creationDate: string;
        description: string;
        id: number;
        state: GitStatusState;
        targetUrl: string;
        updatedDate: string;
    }

    interface Ref {
        name: string;
        creator: IdentityRef;
        statuses: GitStatus[];
        url: string;
    }
}
