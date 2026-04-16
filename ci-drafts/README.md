CI drafts for review
=====================

These are draft workflow YAMLs implementing the "Minimal" split (Option A):

- `ci-core.yml` — core CI (single Node 24 job). Runs `nx affected` / `nx run-many` for lint/typecheck/build and runs tests for all packages except `@burglekitt/gmt` (to avoid duplicate test runs).
- `gmt-matrix-tests.yml` — path-filtered workflow for `packages/gmt/**` that runs the node × timezone matrix (3×3) and executes only the `@burglekitt/gmt` tests.

How to apply (when you're ready):

1. Move the drafts into `.github/workflows/` (this will replace the current `ci.yml`):

```bash
mv ci-drafts/ci-core.yml .github/workflows/ci.yml
mv ci-drafts/gmt-matrix-tests.yml .github/workflows/gmt-matrix-tests.yml
```

2. Commit the changes locally (do not push unless you're ready to run workflows):

```bash
git add .github/workflows/ci.yml .github/workflows/gmt-matrix-tests.yml
git commit -m "ci: split — core Node24 CI + gmt timezone matrix (draft)"
```

3. When you want CI checks to appear in the GitHub branch-protection UI, push the branch and open a PR. The job `name` values will appear after a run.

Branch-protection notes:

- Suggested checks to require after running once:
  - `CI — Node 24`  (core job)
  - `GMT TZ — Node 24 / UTC`, `GMT TZ — Node 24 / Pacific/Apia`, `GMT TZ — Node 24 / Pacific/Niue` (or require only a `GMT Summary` aggregator if you add one)

I will not move or commit these drafts unless you explicitly tell me to. Please confirm if you'd like me to:

- A) Move the drafts into `.github/workflows/` and create a local commit (I will NOT push), or
- B) Make no file changes and instead produce the final YAML content for you to apply manually.
