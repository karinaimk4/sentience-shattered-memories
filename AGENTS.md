# Repository instructions

Follow `CLAUDE.md` for the complete workflow. Read `DESIGN.md` and `docs/PROGRESS.md` before changing the game.

- Work in `gameplay-v4/`; keep Story, Endless, and Event functional.
- Never push directly to `main`. Use a feature/fix/docs branch and a Pull Request.
- Preserve user changes and old local prototypes; generated output belongs in ignored `web-dist/`.
- Verify with `npm run build` and the relevant smoke tests before handoff.
- Do not commit large demo videos, ZIP exports, QA screenshots, or generated build directories.
