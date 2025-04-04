
function runFullMotionLifecycleTest() {
  Logger.log("🏛️ BEGIN FULL SENATE MOTION LIFECYCLE TEST 🏛️");

  const subject = "Lex Testamentum";

  // Step 1: Create a ROGO motion
  seedFakeMotion(subject, "ROGO", "ROGO: That we create a testament to test all things.", "Proposed");

  // Step 2: Simulate SECONDO (Seconded)
  updateMotionStatus(subject, "Seconded");
  logMotionToSheet(new Date(), "secondor@example.com", subject, "SECONDO", "SECONDO: I second this noble idea.");

  // Step 3: Simulate DISCESSIO (opens voting)
  updateMotionStatus(subject, "In Voting");
  logMotionToSheet(new Date(), "initiator@example.com", subject, "DISCESSIO", "DISCESSIO: Let the vote begin.");

  // Step 4: Simulate multiple votes
  recordVote(subject, "FAVEO");
  recordVote(subject, "FAVEO");
  recordVote(subject, "ANTIQVO");
  recordVote(subject, "ABSTINEO");
  recordVote(subject, "FAVEO"); // 3 FAVEO meets quorum (4 total votes)

  // Step 5: Trigger outcome
  checkVoteOutcome(subject);

  Logger.log("✅ FULL LIFECYCLE TEST COMPLETED.");
}

/**
 * Seeds a motion into the sheet with a given command and status.
 */
function seedFakeMotion(subject, command, body, status) {
    var sheet = SpreadsheetApp.openById("1E50DGPYMcPyQAjgO8H_1ztV4wRvE4CZeT6btJmaGUP8").getSheetByName("Motions");
  const now = new Date();
  sheet.appendRow([
    now,
    "initiator@example.com",
    subject,
    command,
    body,
    status,
    0, 0, 0
  ]);
  Logger.log("🧾 Seeded motion: " + subject + " [" + command + "]");
}
