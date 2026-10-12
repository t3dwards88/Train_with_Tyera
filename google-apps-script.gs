// Paste this entire file into the Apps Script editor (Extensions > Apps Script)
// of the Google Sheet you want submissions logged to. See README.md for the
// full setup steps. You should not need to change anything in this file.

function doPost(e) {
  var params = e.parameter;
  var formType = params.formType || 'unknown';
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = formType === 'calculator' ? 'Calculator' : 'Assessment';
  var sheet = ss.getSheetByName(sheetName);

  var headers = formType === 'calculator'
    ? ['Timestamp', 'Weight (lbs)', 'Goal multiplier', 'Meals per day', 'Fasting hours', 'Start time', 'Daily protein (g)', 'Eating window (hrs)']
    : ['Timestamp', 'Name', 'Age', 'Eaters', 'Kids', 'Schedule', 'Allergies', 'Dislikes', 'Cook time', 'Done Whole30 before', 'Goal', 'Timeframe', 'Blockers', 'Workout days', 'Workout time', 'Equipment', 'Injuries', 'Result summary'];

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var row = formType === 'calculator'
    ? [new Date(), params.weight, params.goal, params.meals, params.fasting, params.startTime, params.dailyProtein, params.windowHours]
    : [new Date(), params.name, params.age, params.eaters, params.kids, params.schedule, params.allergies, params.dislikes, params.cooktime, params.whole30, params.goal, params.timeframe, params.blockers, params.wodays, params.wotime, params.equipment, params.injuries, params.resultSummary];

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
