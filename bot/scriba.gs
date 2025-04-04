
/**
 * Main function triggered on timer to check for formal acts or help requests.
 */
function checkSenateInbox() {
  var threads = GmailApp.search('is:unread');
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    for (var j = 0; j < messages.length; j++) {
      var msg = messages[j];
      if (msg.isUnread()) {
        var subject = msg.getSubject();
        var body = msg.getPlainBody();
        Logger.log("📜 Full raw body:\n" + body);

        if (detectHelpRequest(subject, body)) {
          Logger.log("🛎 Help request or malformed message detected.");
          msg.reply(buildHelpMessage());
          msg.markRead();
          continue;
        }

        var result = isFormalSenateAct(body);

        if (result.isValid) {
          Logger.log("✅ Formal act detected: " + result.commandType);
          handleSenateMessage(msg, result, body);
        } else if (result.invocationFound && !result.commandFound) {
          Logger.log("❌ Invocation found but no command.");
          msg.reply("⚠️ Your message invoked the Senate but did not include a command (e.g., ROGO:, SECONDO:). Please try again.");
        }

        msg.markRead();
      }
    }
  }
}

/**
 * Routes valid motions to the appropriate handler function.
 */
function handleSenateMessage(msg, result, body) {
  switch (result.commandType) {
    case "ROGO":
      onRogo(msg, result, body);
      break;
    case "SECONDO":
      onSecondo(msg, result, body);
      break;
    case "DISCESSIO":
      onDiscessio(msg, result, body);
      break;
    case "VOTE":
      onVote(msg, result, body);
      break;
    default:
      Logger.log("⚠️ Unrecognized command type.");
  }
}

function onRogo(msg, result, body) {
  Logger.log("📜 ROGO received from " + msg.getFrom());
  msg.reply("📜 Scriba Senatus acknowledges your ROGO command. Awaiting SECONDO:");
  logMotionToSheet(new Date(), msg.getFrom(), msg.getSubject(), "ROGO", body);
}


function onSecondo(msg, result, body) {
  Logger.log("📣 SECONDO received from " + msg.getFrom());
  updateMotionStatus(msg.getSubject(), "Seconded");
  logMotionToSheet(new Date(), msg.getFrom(), msg.getSubject(), "SECONDO", body);
  msg.reply("📣 SECONDO received. Debate may now commence.");
}



function onDiscessio(msg, result, body) {
  Logger.log("🗳️ DISCESSIO received from " + msg.getFrom());
  updateMotionStatus(msg.getSubject(), "In Voting");
  logMotionToSheet(new Date(), msg.getFrom(), msg.getSubject(), "DISCESSIO", body);
  msg.reply("🗳️ DISCESSIO received. Voting is now open. Senators may cast their votes with FAVEO, ANTIQVO, or ABSTINEO.");
}



function onVote(msg, result, body) {
  Logger.log("🗳️ Vote received from " + msg.getFrom());
  const vote = body.toUpperCase().trim();
  recordVote(msg.getSubject(), vote);
  msg.reply("🗳️ Vote recorded: " + vote);
  checkVoteOutcome(msg.getSubject());
}



/**
 * Parses the message body to check for invocation and valid commands.
 * Fixes:
 *  - Only assigns the first command found
 *  - Sets commandType to null if no invocation
 */
function isFormalSenateAct(body) {
  var lines = body
    .replace(/\r\n|\r|\n/g, '\n')  // Normalize all line breaks
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  var foundInvocation = false;
  var foundCommand = false;
  var commandType = null;

  Logger.log("📬 Inspecting lines in message:");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var upperLine = line.toUpperCase();
    Logger.log("→ " + line);

    if (!foundInvocation && upperLine.startsWith("PATRIBUS CONSCRIPTIS")) {
      foundInvocation = true;
    }

    if (!foundCommand) {
      if (upperLine.startsWith("ROGO:")) {
        foundCommand = true;
        commandType = "ROGO";
      } else if (upperLine.startsWith("SECONDO:")) {
        foundCommand = true;
        commandType = "SECONDO";
      } else if (upperLine.startsWith("DISCESSIO:")) {
        foundCommand = true;
        commandType = "DISCESSIO";
      } else if (
        upperLine === "FAVEO" ||
        upperLine === "ANTIQVO" ||
        upperLine === "ABSTINEO"
      ) {
        foundCommand = true;
        commandType = "VOTE";
      }
    }
  }

  return {
    isValid: foundInvocation && foundCommand,
    invocationFound: foundInvocation,
    commandFound: foundCommand,
    commandType: foundInvocation ? commandType : null
  };
}


/**
 * Detects whether a message should trigger a help response.
 */
function detectHelpRequest(subject, body) {
  var subj = subject.toUpperCase();
  var bodyCheck = isFormalSenateAct(body);
  return subj.includes("AUXILIUM") || subj.includes("OPEM") || !bodyCheck.invocationFound;
}

/**
 * Returns the ceremonial help message.
 */
function buildHelpMessage() {
  return (
    "PATRIBUS CONSCRIPTIS:\n\n" +
    "📜 Scriba Senatus stands ready to serve.\n\n" +
    "Your message was not recognized as a formal act of the Senate.\n\n" +
    "To submit a valid motion, begin your message body with:\n\n" +
    "  PATRIBUS CONSCRIPTIS:\n\n" +
    "And follow it with a command phrase on its own line, such as:\n\n" +
    "  ROGO: That we hold a festival in the forum.\n\n" +
    "Other recognized commands include:\n\n" +
    "  SECONDO:\n" +
    "  DISCESSIO:\n" +
    "  FAVEO / ANTIQVO / ABSTINEO\n\n" +
    "May your words find form in the voice of the Senate."
  );
}

/**
 * Logs a valid motion to the Senate Motions Log Google Sheet.
 */
function logMotionToSheet(timestamp, sender, subject, commandType, body) {
  var sheet = SpreadsheetApp.openById("1E50DGPYMcPyQAjgO8H_1ztV4wRvE4CZeT6btJmaGUP8").getSheetByName("Motions");
  sheet.appendRow([timestamp, sender, subject, commandType, body]);
}



/**
 * Updates vote counts for the latest 'In Voting' ROGO motion by subject.
 */
function recordVote(subject, voteType) {
  var sheet = SpreadsheetApp.openById("1E50DGPYMcPyQAjgO8H_1ztV4wRvE4CZeT6btJmaGUP8").getSheetByName("Motions");
  var data = sheet.getDataRange().getValues();
  var candidates = [];

  for (var i = 1; i < data.length; i++) {
    Logger.log(data[i]);
    if (
      data[i][2] === subject &&
      data[i][3] === "ROGO" &&
      data[i][5] === "In Voting"
    ) {
      candidates.push({ index: i, timestamp: new Date(data[i][0]) });
    }
  }

  if (candidates.length === 0) {
    Logger.log("⚠️ No voting-eligible motion found for: " + subject);
    return;
  }

  // Use the latest matching ROGO
  candidates.sort((a, b) => b.timestamp - a.timestamp);
  var idx = candidates[0].index;
  var row = data[idx];

  // Force values into integers
  row[6] = parseInt(row[6]) || 0; // FAVEO
  row[7] = parseInt(row[7]) || 0; // ANTIQVO
  row[8] = parseInt(row[8]) || 0; // ABSTINEO

  if (voteType === "FAVEO") row[6]++;
  else if (voteType === "ANTIQVO") row[7]++;
  else if (voteType === "ABSTINEO") row[8]++;

  Logger.log(`🔢 Updated vote totals → FAVEO: ${row[6]}, ANTIQVO: ${row[7]}, ABSTINEO: ${row[8]}`);

  // Write updated values back to the sheet
  sheet.getRange(idx + 1, 7, 1, 3).setValues([[row[6], row[7], row[8]]]);
}

/**
 * Updates the status of a motion in the sheet.
 */
function updateMotionStatus(subject, newStatus) {
  var sheet = SpreadsheetApp.openById("1E50DGPYMcPyQAjgO8H_1ztV4wRvE4CZeT6btJmaGUP8").getSheetByName("Motions");
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === subject && data[i][3] === "ROGO") {
      sheet.getRange(i + 1, 6).setValue(newStatus);
      return;
    }
  }
}



function runScribaTests() {
  Logger.log("🧪 BEGIN TESTING SCRIBA SENATUS 🧪");

  test_isFormalSenateAct();

  Logger.log("✅ All tests completed.");
}

function assertEqual(actual, expected, label) {
  if (actual === expected) {
    Logger.log("✅ PASS: " + label);
  } else {
    Logger.log("❌ FAIL: " + label + " | expected: " + expected + ", got: " + actual);
  }
}

function test_isFormalSenateAct() {
  Logger.log("▶ Testing isFormalSenateAct()...");

  // Valid ROGO
  let motion = "PATRIBUS CONSCRIPTIS:\n\nROGO: Let us build a colonnade.";
  let result1 = isFormalSenateAct(motion);
  assertEqual(result1.isValid, true, "Recognizes valid ROGO motion");
  assertEqual(result1.commandType, "ROGO", "Classifies ROGO");

  // Invocation but no command
  let malformed = "PATRIBUS CONSCRIPTIS:\n\nI have a thought.";
  let result2 = isFormalSenateAct(malformed);
  assertEqual(result2.isValid, false, "Fails without command");
  assertEqual(result2.invocationFound, true, "Finds invocation");
  assertEqual(result2.commandFound, false, "No command found");

  // Valid vote
  let vote = "PATRIBUS CONSCRIPTIS:\n\nFAVEO";
  let result3 = isFormalSenateAct(vote);
  assertEqual(result3.isValid, true, "Recognizes vote with FAVEO");
  assertEqual(result3.commandType, "VOTE", "Classifies vote as VOTE");

  // Valid SECONDO
  let second = "PATRIBUS CONSCRIPTIS:\n\nSECONDO: I affirm the motion.";
  let result4 = isFormalSenateAct(second);
  assertEqual(result4.isValid, true, "Recognizes valid SECONDO motion");
  assertEqual(result4.commandType, "SECONDO", "Classifies SECONDO");

  // Valid DISCESSIO
  let discessio = "PATRIBUS CONSCRIPTIS:\n\nDISCESSIO: Let the vote begin.";
  let result5 = isFormalSenateAct(discessio);
  assertEqual(result5.isValid, true, "Recognizes DISCESSIO");
  assertEqual(result5.commandType, "DISCESSIO", "Classifies DISCESSIO");

  // Garbage message
  let noise = "dearest friends, it is time";
  let result6 = isFormalSenateAct(noise);
  assertEqual(result6.isValid, false, "Ignores nonsense");
  assertEqual(result6.invocationFound, false, "No invocation");
  assertEqual(result6.commandFound, false, "No command");
}



/**
 * Tallies votes and declares outcome if quorum and majority reached.
 */
function checkVoteOutcome(subject) {
  const sheet = SpreadsheetApp.openById("1E50DGPYMcPyQAjgO8H_1ztV4wRvE4CZeT6btJmaGUP8").getSheetByName("Motions");
  const data = sheet.getDataRange().getValues();
  const quorum = Math.ceil(getSenatorCount() * 0.5 + 1);
  const index = data.findIndex(row => row[2] === subject && row[4] === "ROGO");

  if (index > 0) {
    const row = data[index];
    const votesFor = row[6] || 0;
    const votesAgainst = row[7] || 0;
    const abstain = row[8] || 0;
    const totalVotes = votesFor + votesAgainst + abstain;

    if (totalVotes >= quorum) {
      const passed = votesFor > votesAgainst;
      const status = passed ? "Passed" : "Failed";
      sheet.getRange(index + 1, 6).setValue(status);

      const result = `🧾 Voting concluded. Motion ${status} with ${votesFor} FAVEO / ${votesAgainst} ANTIQVO / ${abstain} ABSTINEO.`;
      GmailApp.sendEmail(Session.getActiveUser().getEmail(), "Senate Vote Result", result);
    }
  }
}

/**
 * Returns total number of senators on the Censor's roll.
 * For now this is hardcoded; in the future this should query a sheet or config.
 */
function getSenatorCount() {
  return 7; // Provisional value; replace with actual list length if needed
}
