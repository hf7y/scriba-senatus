
function runChaoticSenateSession() {
  Logger.log("🏛️ BEGIN CHAOTIC SENATE SESSION TEST 🏛️");

  const motions = [
    { subject: "Lex Vinum", sender: "senator.grapes@example.com", motion: "ROGO: That we establish a wine cellar beneath the Curia." },
    { subject: "Lex Aqua", sender: "senator.river@example.com", motion: "ROGO: That aqueducts be cleansed monthly." },
    { subject: "Lex Ignis", sender: "senator.flame@example.com", motion: "ROGO: That torches remain lit in all temples." }
  ];

  // Step 1: Seed 3 simultaneous motions
  motions.forEach((item) => {
    seedFakeMotion(item.subject, "ROGO", item.motion, "Proposed", item.sender);
  });

  // Step 2: SECONDO two of them (out of order)
  updateMotionStatus("Lex Ignis", "Seconded");
  logMotionToSheet(new Date(), "senator.firestarter@example.com", "Lex Ignis", "SECONDO", "SECONDO: I support this flame.");

  updateMotionStatus("Lex Aqua", "Seconded");
  logMotionToSheet(new Date(), "senator.stream@example.com", "Lex Aqua", "SECONDO", "SECONDO: Water is life.");

  // Step 3: DISCESSIO opens for Lex Aqua (before Ignis)
  updateMotionStatus("Lex Aqua", "In Voting");
  logMotionToSheet(new Date(), "senator.faucet@example.com", "Lex Aqua", "DISCESSIO", "DISCESSIO: Let the flow of votes begin.");

  // Step 4: Votes start arriving for Lex Aqua
  recordVote("Lex Aqua", "FAVEO");
  recordVote("Lex Aqua", "FAVEO");
  recordVote("Lex Aqua", "ABSTINEO");

  // Step 5: Second SECONDO arrives late for Lex Vinum (motion not yet in voting)
  updateMotionStatus("Lex Vinum", "Seconded");
  logMotionToSheet(new Date(), "senator.toast@example.com", "Lex Vinum", "SECONDO", "SECONDO: Long live the vine.");

  // Step 6: DISCESSIO for Lex Vinum
  updateMotionStatus("Lex Vinum", "In Voting");
  logMotionToSheet(new Date(), "senator.toast@example.com", "Lex Vinum", "DISCESSIO", "DISCESSIO: Let us raise a glass and vote.");

  // Step 7: More votes for Lex Aqua (push it past quorum)
  recordVote("Lex Aqua", "FAVEO");

  // Step 8: Check vote outcome (Lex Aqua should pass)
  checkVoteOutcome("Lex Aqua");

  // Step 9: Conflicting votes for Lex Vinum
  recordVote("Lex Vinum", "ANTIQVO");
  recordVote("Lex Vinum", "ANTIQVO");
  recordVote("Lex Vinum", "FAVEO");

  // Step 10: Check Lex Vinum outcome (should fail)
  checkVoteOutcome("Lex Vinum");

  Logger.log("✅ CHAOTIC SENATE SESSION TEST COMPLETED.");
}

function seedFakeMotion(subject, command, body, status, sender) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Motions");
  const now = new Date();

  // Optional cleanup to avoid duplicate subjects
  for (let i = sheet.getLastRow(); i > 1; i--) {
    if (sheet.getRange(i, 3).getValue() === subject) {
      sheet.deleteRow(i);
    }
  }

  sheet.appendRow([
    now,
    sender || "scribe@senate.org",
    subject,
    command,
    body,
    status,
    0, 0, 0
  ]);
  Logger.log("🧾 Motion seeded: " + subject);
}
