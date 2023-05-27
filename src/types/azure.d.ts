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
        id: string;
    }

    interface WebApiTag {
        active: boolean;
        id: string;
        name: string;
        url: string;
    }

    interface CommitRef {
        comment: string;
        commitId: string;
    }

    enum Vote {
        rejected = -10,
        waitingForAuthor = -5,
        noVote = 0,
        approvedWithSuggestions = 5,
        approved = 10
    }

    enum VoteStatus {
        rejected = "Rejected",
        waitingForAuthor = "Waiting for Author",
        noVote = "No Vote",
        approvedWithSuggestions = "Approved with Suggestions",
        approved = "Approved"
    }

    class VoterRef extends IdentityRef {
        hasDeclined: boolean;
        isRequired: boolean;
        vote: Vote;
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

    enum PullRequestStatus {
        abandoned,
        active,
        all,
        completed,
        notSet
    }

    interface PullRequest {
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
        status: PullRequestStatus;
        targetRefName: string;
        title: string;
        url: string;
    }
}
