
function runMediumVoteTest() {
  Logger.log("🗳️ BEGIN MEDIUM VOTE TEST 🗳️");

  const subject = "Lex Aequitas";

  // Step 1: Seed a motion already in voting
  seedVoteTestMotion(subject);

  // Step 2: Cast votes
  recordVote(subject, "FAVEO");     // support
  recordVote(subject, "ANTIQVO");   // oppose
  recordVote(subject, "ABSTINEO");  // neutral
  recordVote(subject, "FAVEO");     // support
  recordVote(subject, "FAVEO");     // support

  // Step 3: Trigger vote outcome checker
  checkVoteOutcome(subject);

  Logger.log("✅ MEDIUM VOTE TEST COMPLETED.");
}

/**
 * Seeds a fake motion in 'In Voting' status for vote testing.
 */
function seedVoteTestMotion(subject) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Motions");
  const now = new Date();
  sheet.appendRow([
    now,
    "tribune@example.com",
    subject,
    "ROGO",
    "ROGO: That equity be upheld in all deliberations.",
    "In Voting",
    0, 0, 0
  ]);
  Logger.log("🧾 Motion seeded for vote test: " + subject);
}
