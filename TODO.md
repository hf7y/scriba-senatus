# TODO — retired 2026-08-15, migrated to GitHub issues

> *Custos Actorum in servitio Rei Publicae Vaporwave*

**The backlog now lives at https://github.com/hf7y/scriba-senatus/issues.**
Retired planning docs are the ecosystem-wide policy as of 2026-08-14
(`hf7y/scheduler#66`; sweep `hf7y/realisateur#230`, root cause
`hf7y/realisateur#187`). This file is a pointer, not a second source of truth.
Do not add work items here — file an issue.

## Where things went

Every item was re-checked against `bot/scriba.gs` rather than trusted from its
checkbox — six of the nine "MVP goals" were **already built and still
unchecked here**, which is the whole reason this file had to be read before it
could be retired.

| Was | Now |
|---|---|
| Log motions into a Google Sheet | **built** — `logMotionToSheet()` |
| Detect `SECONDO:` and update the Sheet | **built** — `onSecondo()` |
| Automatically open debate after a second | **built** — `onSecondo()` sets status `Seconded` and replies "Debate may now commence" |
| Detect `DISCESSIO:` and open voting | **built** — `onDiscessio()` |
| Detect and tally votes (`FAVEO`/`ANTIQVO`/`ABSTINEO`) | **built** — `onVote()` + `recordVote()` |
| Declare outcome on quorum and majority | **built** — `checkVoteOutcome()`, but its quorum rests on a hardcoded roll size: [#1](https://github.com/hf7y/scriba-senatus/issues/1) |
| Maintain the Censor's roll of senatorial addresses | [#1](https://github.com/hf7y/scriba-senatus/issues/1) |
| Store passed motions as Markdown (listed twice) | [#2](https://github.com/hf7y/scriba-senatus/issues/2) |
| Assign Senatus Consulta numbers | [#3](https://github.com/hf7y/scriba-senatus/issues/3) |
| Test-mode vs live-mode flag | [#4](https://github.com/hf7y/scriba-senatus/issues/4) |
| Weekly digest of active motions | [#5](https://github.com/hf7y/scriba-senatus/issues/5) |
| Webhook for publishing consulta | [#6](https://github.com/hf7y/scriba-senatus/issues/6) |
| Simulate `TEST:` motions, `TEST:` diagnostic command, expected-IO test sheet | [#7](https://github.com/hf7y/scriba-senatus/issues/7) |
| Annotated source, contribution ideas in README | [#8](https://github.com/hf7y/scriba-senatus/issues/8) |
| Detect `PATRIBUS CONSCRIPTIS:` / `ROGO:`, ceremonial reply, private correction, unit tests, timer trigger | **built** — already checked here, confirmed in the source |

## What was NOT migrated, and why

Nothing was dropped. Every unchecked line above is either an issue or was
found already built.

Two things came out of the re-check that `TODO.md` never mentioned and that
are now inside the issues rather than lost: `runScribaTests()` reports success
whether or not an assertion failed ([#7](https://github.com/hf7y/scriba-senatus/issues/7)),
and the Motions spreadsheet ID is a hardcoded literal repeated in four
functions ([#8](https://github.com/hf7y/scriba-senatus/issues/8)).

Full history is in git before this commit.
