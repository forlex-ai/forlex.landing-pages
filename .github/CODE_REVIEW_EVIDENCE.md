# Final revision evidence and Daniel decision

This repository uses immutable policy `5e57b67eef02f5945bb9b3c3194924d5c3a5e969` from platform.backend.
The [shared contract and operator runbook](https://github.com/forlex-ai/platform.backend/blob/14276ddeeafcef4e4c3b88dbc9a20a7d6b1706f1/docs/operations/CODE_REVIEW_EVIDENCE.md) describes the bundle, decision and post-merge formats.

1. After the final change, put actual reports and findings in a `forlex-tool-review` PR comment. Reports must bind the final head SHA and current base SHA.
2. Once CI passes, re-run the failed PR-triggered evidence workflow. The prepare job produces a signed envelope and an unsigned Daniel decision template. Missing evidence remains a failed check.
3. Daniel examines the final revision and linked reports, fills in the decision and submits his own GitHub PR review. A COMMENTED review can carry his decision when he is the PR author; it is not independent human approval.
4. The decision job validates the exact SHA and context digest. Any later push, bundle/report/finding/CI change requires fresh validation and a fresh decision.
5. Daniel alone performs the merge. The closed-PR event records the observed merger and merge SHA. Submit actual post-merge verification and request the verified stage afterward.

The manual dispatcher becomes available after the workflow reaches the default branch through the normal release process. Before that, PR-triggered runs can be re-run. Preparation, decision, merge, verification, deployment and Vanta acceptance are separate events. Do not close a control from a prepared artifact alone.

Extra CI names for this repository: `["qa"]`. Active ruleset checks are always included.

Classic branch protection requires qa; this check name is explicitly added because the collector automatically reads rulesets. Classic app-ID binding and legacy commit statuses are not automatically imported; they remain a separate adoption limitation.

Actions artifact retention is 90 days. Archive attested envelopes and source reports in the controlled audit evidence store for the required retention period. This initial adoption leaves the evidence checks advisory until Daniel accepts the real four-stage pilot.
