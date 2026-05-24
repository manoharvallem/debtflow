const PEOPLE_SHEET = 'People';
const TRANSACTIONS_SHEET = 'Transactions';
const WORKFLOW_SHEET = 'Workflow';

const PEOPLE_HEADERS = ['id', 'name', 'totalDebt', 'amountPaid', 'lastPaymentDate', 'status', 'currentStage', 'lastStageDate', 'joiningDate', 'labels'];
const TRANSACTION_HEADERS = ['id', 'debtorId', 'amount', 'type', 'date', 'note'];
const WORKFLOW_HEADERS = ['id', 'debtorId', 'stage', 'date', 'note', 'joiningDate'];

function doGet(e) {
  const callback = e.parameter.callback || 'callback';
  if (!isAllowedCallback(callback)) return textResponse('Invalid callback.');

  try {
    validateToken(e.parameter.token);
    ensureSheets();
    return javascriptResponse(callback, { ok: true, data: readAllData() });
  } catch (error) {
    return javascriptResponse(callback, { ok: false, error: String(error.message || error) });
  }
}

function doPost(e) {
  try {
    validateToken(e.parameter.token);
    ensureSheets();
    const action = JSON.parse(e.parameter.payload || '{}');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      applyAction(action);
    } finally {
      lock.releaseLock();
    }
    return textResponse('OK');
  } catch (error) {
    return textResponse(`ERROR: ${String(error.message || error)}`);
  }
}

function applyAction(action) {
  switch (action.type) {
    case 'replaceAll':
      replaceAll(action.debtors || [], action.transactions || [], action.workflowEntries || []);
      break;
    case 'upsertDebtor':
      upsertRow(PEOPLE_SHEET, PEOPLE_HEADERS, debtorToRow(action.debtor));
      break;
    case 'upsertTransaction':
      upsertRow(TRANSACTIONS_SHEET, TRANSACTION_HEADERS, transactionToRow(action.transaction));
      break;
    case 'upsertWorkflowEntry':
      upsertRow(WORKFLOW_SHEET, WORKFLOW_HEADERS, workflowToRow(action.workflowEntry));
      break;
    case 'deleteDebtor':
      deleteDebtor(action.debtorId);
      break;
    case 'reset':
      replaceAll([], [], []);
      break;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

function readAllData() {
  return {
    debtors: readObjects(PEOPLE_SHEET, PEOPLE_HEADERS).map(rowToDebtor),
    transactions: readObjects(TRANSACTIONS_SHEET, TRANSACTION_HEADERS).map(rowToTransaction),
    workflowEntries: readObjects(WORKFLOW_SHEET, WORKFLOW_HEADERS).map(rowToWorkflow),
  };
}

function replaceAll(debtors, transactions, workflowEntries) {
  writeObjects(PEOPLE_SHEET, PEOPLE_HEADERS, debtors.map(debtorToRow));
  writeObjects(TRANSACTIONS_SHEET, TRANSACTION_HEADERS, transactions.map(transactionToRow));
  writeObjects(WORKFLOW_SHEET, WORKFLOW_HEADERS, workflowEntries.map(workflowToRow));
}

function deleteDebtor(debtorId) {
  deleteRowById(PEOPLE_SHEET, String(debtorId));
  deleteRowsByColumn(TRANSACTIONS_SHEET, 'debtorId', String(debtorId));
  deleteRowsByColumn(WORKFLOW_SHEET, 'debtorId', String(debtorId));
}

function ensureSheets() {
  ensureSheet(PEOPLE_SHEET, PEOPLE_HEADERS);
  ensureSheet(TRANSACTIONS_SHEET, TRANSACTION_HEADERS);
  ensureSheet(WORKFLOW_SHEET, WORKFLOW_HEADERS);
}

function ensureSheet(name, headers) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) sheet = spreadsheet.insertSheet(name);

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = headers.some((header, index) => currentHeaders[index] !== header);
  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function readObjects(sheetName, headers) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet.getRange(2, 1, lastRow - 1, headers.length).getValues().filter(row => row[0]).map(row => headers.reduce((object, header, index) => {
    object[header] = row[index];
    return object;
  }, {}));
}

function writeObjects(sheetName, headers, rows) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
}

function upsertRow(sheetName, headers, row) {
  if (!row || !row[0]) throw new Error(`Invalid row for ${sheetName}.`);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const existingRow = findRowById(sheet, String(row[0]));
  if (existingRow) sheet.getRange(existingRow, 1, 1, headers.length).setValues([row]);
  else sheet.appendRow(row);
}

function deleteRowById(sheetName, id) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const row = findRowById(sheet, id);
  if (row) sheet.deleteRow(row);
}

function deleteRowsByColumn(sheetName, columnName, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(columnName) + 1;
  if (!columnIndex) return;
  
  const values = sheet.getRange(1, columnIndex, sheet.getLastRow(), 1).getValues();
  for (let row = sheet.getLastRow(); row >= 2; row -= 1) {
    if (String(values[row - 1][0]) === value) sheet.deleteRow(row);
  }
}

function findRowById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const index = ids.findIndex(row => String(row[0]) === id);
  return index === -1 ? null : index + 2;
}

function debtorToRow(debtor) {
  return [
    String(debtor.id || ''),
    String(debtor.name || ''),
    Number(debtor.totalDebt || 0),
    Number(debtor.amountPaid || 0),
    String(debtor.lastPaymentDate || ''),
    String(debtor.status || 'PENDING'),
    String(debtor.currentStage || 'REFERRED_TO_HR'),
    String(debtor.lastStageDate || ''),
    String(debtor.joiningDate || ''),
    Array.isArray(debtor.labels) ? debtor.labels.join(', ') : String(debtor.labels || ''),
  ];
}

function transactionToRow(transaction) {
  return [
    String(transaction.id || ''),
    String(transaction.debtorId || ''),
    Number(transaction.amount || 0),
    String(transaction.type || 'DEBT'),
    String(transaction.date || ''),
    String(transaction.note || ''),
  ];
}

function workflowToRow(workflowEntry) {
  return [
    String(workflowEntry.id || ''),
    String(workflowEntry.debtorId || ''),
    String(workflowEntry.stage || 'REFERRED_TO_HR'),
    String(workflowEntry.date || ''),
    String(workflowEntry.note || ''),
    String(workflowEntry.joiningDate || ''),
  ];
}

function rowToDebtor(row) {
  return {
    id: String(row.id || ''),
    name: String(row.name || ''),
    totalDebt: Number(row.totalDebt || 0),
    amountPaid: Number(row.amountPaid || 0),
    lastPaymentDate: row.lastPaymentDate ? String(row.lastPaymentDate) : undefined,
    status: String(row.status || 'PENDING'),
    currentStage: String(row.currentStage || 'REFERRED_TO_HR'),
    lastStageDate: row.lastStageDate ? String(row.lastStageDate) : undefined,
    joiningDate: row.joiningDate ? String(row.joiningDate) : undefined,
    labels: row.labels ? String(row.labels).split(',').map(label => label.trim()).filter(Boolean) : [],
  };
}

function rowToTransaction(row) {
  return {
    id: String(row.id || ''),
    debtorId: String(row.debtorId || ''),
    amount: Number(row.amount || 0),
    type: String(row.type || 'DEBT'),
    date: String(row.date || ''),
    note: String(row.note || ''),
  };
}

function rowToWorkflow(row) {
  return {
    id: String(row.id || ''),
    debtorId: String(row.debtorId || ''),
    stage: String(row.stage || 'REFERRED_TO_HR'),
    date: String(row.date || ''),
    note: String(row.note || ''),
    joiningDate: row.joiningDate ? String(row.joiningDate) : undefined,
  };
}

function validateToken(token) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty('DEBTFLOW_API_TOKEN');
  if (expectedToken && token !== expectedToken) throw new Error('Invalid token.');
}

function isAllowedCallback(callback) {
  return /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)?$/.test(callback);
}

function javascriptResponse(callback, payload) {
  return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload)});`).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function textResponse(value) {
  return ContentService.createTextOutput(value).setMimeType(ContentService.MimeType.TEXT);
}
