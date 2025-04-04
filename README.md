# Scriba Senatus 🪶

*A ceremonial-parliamentary bot and constitutional framework for the digital Senate of the Res Publica Vaporwave.*

---

## 🏛️ What This Repository Contains

- **📜 `Lex Fundationis` and `Lex Orationis`** — the founding charters of the Senate
- **🤖 `scriba.gs`** — source code for Scriba Senatus, our ceremonial email bot
- **📋 `memory/`** — the motion ledger used to track the current state of active motions
- **✅ `tests/`** — simulated motion sessions, stress tests, and vote outcomes
- **🧾 `consulta/` (future)** — markdown archive of passed *Senatus Consulta*

---

## 🧠 What Scriba Does

Scriba listens to emails sent to the Senate list. When addressed with `PATRIBUS CONSCRIPTIS:`, it recognizes ceremonial commands:

- `ROGO:` to propose a motion
- `SECONDO:` to second a motion
- `DISCESSIO:` to call a vote
- `FAVEO`, `ANTIQVO`, `ABSTINEO` to vote

It manages each motion’s status, enforces quorum rules, tallies votes, and replies in a Roman ceremonial style.

---

## ⚙️ For Developers

Scriba is written in **Google Apps Script** and connected to:

- **Gmail** (reads and replies to emails)
- **Google Sheets** (tracks live state of motions)

A **1-minute polling trigger** is currently active for testing.

### 🧪 Testing

- Unit tests are in `scriba_test.gs` and `scriba_vote_test.gs`
- End-to-end tests like `scriba_chaotic_session_test.gs` simulate entire sessions
- You can run them manually from within the Apps Script project

---

## 🤝 Collaborators Welcome

We invite future Senators, scribes, and engineers to contribute in any of these ways:

- ✍️ Draft new procedural laws (`lex-orationis.md`)
- 📜 Improve ceremonial responses or command parsing
- 🛠 Help structure Markdown export of *senatus consulta*
- 🧪 Build new stress test simulations

A `CONTRIBUTING.md` is forthcoming.

---

## 📜 Sample Invocation

