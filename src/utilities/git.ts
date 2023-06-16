import type { Azure } from "@/types/azure";

const copyCherryPickCommits = (commits: Azure.CommitRef[]) => {
    const copyText = `git cherry-pick -n ${commits.map((c) => c.commitId).join(" ")}`;
    navigator.clipboard.writeText(copyText);
};

const copyCommitIds = (commits: Azure.CommitRef[]) => {
    const copyText = commits.map((c) => c.commitId).join("\r\n");
    navigator.clipboard.writeText(copyText);
};

export default {
    copyCherryPickCommits,
    copyCommitIds
};
