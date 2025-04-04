# TODO – Scriba Senatus

> *Custos Actorum in servitio Rei Publicae Vaporwave*

## 🎯 MVP Goals

- [x] Detect valid motions that begin with `PATRIBUS CONSCRIPTIS:`
- [x] Reply with ceremonial message for motions (`ROGO:` detected)
- [x] Reply to malformed messages privately with correction tips
- [ ] Log motions (date, sender, subject, body) into a Google Sheet
- [ ] Detect `SECONDO:` replies and update the Sheet
- [ ] Automatically open debate period after a second
- [ ] Detect `DISCESSIO:` and open voting window
- [ ] Detect and tally votes (`FAVEO`, `ANTIQVO`, `ABSTINEO`)
- [ ] Declare outcome (based on quorum and majority)
- [ ] Format and store passed motions as Markdown in GitHub (eventually)

## 🧪 Testing Strategy

- [x] Write unit tests for core functions:
  - `isFormalSenateAct()`
  - `parseCommandType()`
  - `sanitizeBodyLines()`
- [ ] Simulate test motions with labeled email subjects (e.g. `TEST: VOTE`)
- [ ] Optional: build `TEST:` command that triggers a diagnostic reply
- [ ] (Future) Store expected inputs/outputs in test Sheet

## 🧠 Possible Enhancements

- [ ] Assign Senatus Consulta numbers (e.g. SC-RPV-2025-01)
- [ ] Send weekly digest of active motions and results
- [ ] Format and export passed motions as Markdown (for GitHub or publication)
- [ ] Add webhook for publishing Senatus Consulta to a site or newsletter

## 🔒 Infrastructure & Access

- [ ] Add flag for "test mode" vs. "live mode"
- [ ] Maintain internal whitelist of valid senatorial email addresses (the Censor’s roll)
- [x] Timer-based trigger (already active)

## 🤝 For Future Collaboration

- [ ] Include annotated source code with clear comments and ceremonial language
- [ ] Add contribution ideas to README when collaboration is closer
