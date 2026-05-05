# Phase Complete
Mark the current phase as done and prepare for the next one.

Steps:
1. Run npx tsc --noEmit and fix any TypeScript errors
2. Run npm run build and confirm it succeeds
3. Update the Phase Tracker in CLAUDE.md — check off the completed phase
4. Commit: chore: complete phase [N] - [phase name]
5. List what was built in this phase
6. List what comes next in the following phase
7. Ask the user to confirm before starting the next phase
