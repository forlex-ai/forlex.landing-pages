# Final revision evidence and Daniel decision

This public repository emits a factual PR request artifact. The private backend
collects and attests the final tool bundle, CI, Daniel decision, observed merge
and post-merge verification. Backend policy: `93a9a57a586374c673b5a47806dceb5d50d717f8`.

1. After the last change, publish actual tool reports and findings in a
   `forlex-tool-review` comment binding the final head and current base SHA.
2. The backend observer prepares evidence once `qa` passes. Its signed envelope
   and unsigned decision template remain in the private backend's Actions artifacts.
3. Daniel reviews the code/evidence and submits his own `forlex-review-decision`
   GitHub review on this public PR. The observer validates its exact SHA/digest.
4. Every later change requires fresh validation and a fresh Daniel decision.
5. Daniel alone merges. Publish actual `forlex-post-merge-verification` evidence
   afterward so the observer can record that stage.

[Private operator runbook](https://github.com/forlex-ai/platform.backend/blob/3c6abe5c3e2686f15f7b86675fae0f3e37e83716/docs/operations/CODE_REVIEW_EVIDENCE.md)
[Private backend observer](https://github.com/forlex-ai/platform.backend/actions/workflows/public-repository-review-evidence.yml)

The backend observer is exercised on its implementation PR and polls every 30
minutes after its normal default-branch publication. The registered observer
can be dispatched with the CLI on its published backend feature branch before
merge: `gh workflow run public-repository-review-evidence.yml --repo forlex-ai/platform.backend --ref feat/review-decision-evidence -f pr_number=2 -f stage=prepared`. This path was exercised with signed evidence and independent signature verification. The local request job reads public GitHub facts and
executes no private collector or candidate code. Its success is request creation;
Daniel decision, merge, signed review evidence and Vanta acceptance remain
separate. Existing classic `qa` branch protection remains authoritative.
