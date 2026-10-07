# Final revision evidence and Daniel decision

This public repository emits a factual PR request artifact. The private backend
collects and attests the final tool bundle, CI, Daniel decision, observed merge
and post-merge verification. Backend policy: `7df698f8cf9ccb07314b371e5fa1fe36116cf2e6`.

1. After the last change, publish actual tool reports and findings in a
   `forlex-tool-review` comment binding the final head and current base SHA.
2. The backend observer prepares evidence once `qa` passes. Its signed envelope
   and unsigned decision template remain in the private backend's Actions artifacts.
3. Daniel reviews the code/evidence and submits his own `forlex-review-decision`
   GitHub review on this public PR. The observer validates its exact SHA/digest.
4. Every later change requires fresh validation and a fresh Daniel decision.
5. Daniel alone merges. Publish actual `forlex-post-merge-verification` evidence
   afterward so the observer can record that stage.

[Private operator runbook](https://github.com/forlex-ai/platform.backend/blob/294710bca4/docs/operations/CODE_REVIEW_EVIDENCE.md)
[Private backend observer](https://github.com/forlex-ai/platform.backend/actions/workflows/public-repository-review-evidence.yml)

The backend observer is exercised on its implementation PR and polls every 30
minutes after its normal default-branch publication. Manual dispatch also requires
default-branch publication. The local request job reads public GitHub facts and
executes no private collector or candidate code. Its success is request creation;
Daniel decision, merge, signed review evidence and Vanta acceptance remain
separate. Existing classic `qa` branch protection remains authoritative.
