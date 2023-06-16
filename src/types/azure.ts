export namespace Azure {
    export interface Project {
        id: string;
        name: string;
    }

    export interface Repo {
        id: string;
        name: string;
    }

    export class IdentityRef {
        id?: string;
        displayName?: string;
    }

    export interface Ref {
        name: string;
        creator: IdentityRef;
        statuses: Git.Status[];
        url: string;
        id: string;
    }

    export interface WebApiTag {
        active: boolean;
        id: string;
        name: string;
        url: string;
    }

    export interface CommitRef {
        comment: string;
        commitId: string;
    }

    export class PullRequestStatus {
        context: Git.StatusContext;
        id?: number;
        state: Git.State;
        description: string;

        constructor(params: Partial<PullRequestStatus>) {
            this.context = params.context || {
                genre: "",
                name: ""
            };

            this.state = params.state || Git.State.notSet;
            this.description = params.description || "";
        }

        get title(): string {
            return `${this.context.genre}/${this.context.name}`;
        }
    }

    export namespace PullRequest {
        export enum Vote {
            rejected = -10,
            waitingForAuthor = -5,
            noVote = 0,
            approvedWithSuggestions = 5,
            approved = 10
        }

        export enum VoteStatus {
            rejected = "Rejected",
            waitingForAuthor = "Waiting for Author",
            noVote = "No Vote",
            approvedWithSuggestions = "Approved with Suggestions",
            approved = "Approved"
        }

        export class VoterRef extends IdentityRef {
            hasDeclined?: boolean;
            isRequired?: boolean;
            vote?: Vote;
            voteText() {
                switch (this.vote) {
                    case Vote.rejected:
                        return VoteStatus.rejected.toString();
                    case Vote.waitingForAuthor:
                        return VoteStatus.waitingForAuthor.toString();
                    case Vote.noVote:
                        return VoteStatus.noVote.toString();
                    case Vote.approvedWithSuggestions:
                        return VoteStatus.approvedWithSuggestions.toString();
                    case Vote.approved:
                        return VoteStatus.approved.toString();
                }
            }
        }

        export enum Status {
            abandoned,
            active,
            all,
            completed,
            notSet
        }

        export interface PullRequest {
            autoCompleteSetBy: IdentityRef;
            closedBy: IdentityRef;
            closedDate: string;
            createdBy: IdentityRef;
            creationDate: string;
            isDraft: boolean;
            labels: WebApiTag[];
            lastMergeCommit: CommitRef;
            pullRequestId: number;
            reviewers: VoterRef[];
            sourceRefName: string;
            status: Status;
            targetRefName: string;
            title: string;
            url: string;
        }
    }

    export namespace Git {
        export enum State {
            error,
            failed,
            notApplicable,
            notSet,
            pending,
            succeeded
        }

        export interface Status {
            createdBy: IdentityRef;
            creationDate: string;
            description: string;
            id: number;
            state: State;
            targetUrl: string;
            updatedDate: string;
        }

        export interface StatusContext {
            genre: string;
            name: string;
        }
    }
}
