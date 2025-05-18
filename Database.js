// Get active spreadsheet
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Get sheet by name
function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

// Get user data by EID
function getUserByEid(eid) {
  const sheet = getSheet('user_data');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === eid.toString()) {
      return {
        agent_eid: data[i][0].toString(),
        agent_name: data[i][1],
        agent_division: data[i][2],
        agent_role: data[i][3]
      };
    }
  }
  
  return null;
}

// Add pending user signup request
function addPendingUser(eid, firstName, lastName, email) {
  const sheet = getSheet('pending_users');
  sheet.appendRow([eid, firstName, lastName, email, 'pending']);
  return true;
}

// Get all pending users
function getPendingUsers() {
  const sheet = getSheet('pending_users');
  const data = sheet.getDataRange().getValues();
  const users = [];
  
  for (let i = 0; i < data.length; i++) {
    users.push({
      eid: data[i][0].toString(),
      firstName: data[i][1],
      lastName: data[i][2],
      email: data[i][3],
      status: data[i][4]
    });
  }
  
  return users;
}

// Update pending user status
function updatePendingUserStatus(eid, status) {
  const sheet = getSheet('pending_users');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === eid.toString()) {
      sheet.getRange(i + 1, 5).setValue(status);
      
      if (status === 'approved') {
        // Add to user_data
        const userSheet = getSheet('user_data');
        userSheet.appendRow([
          eid,
          data[i][2] + ', ' + data[i][1], // Last, First
          '', // Division (empty by default)
          'agent' // Role (default to agent)
        ]);
      }
      
      return true;
    }
  }
  
  return false;
}

// Get all prompt categories (inquiry_reason)
function getPromptCategories() {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  const categories = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][1]) { // inquiry_reason
      categories.add(data[i][1]);
    }
  }
  
  return Array.from(categories);
}

// Get topics by category
function getTopicsByCategory(category) {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  const topics = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === category && data[i][2]) { // match inquiry_reason and has topic_name
      topics.add(data[i][2]);
    }
  }
  
  return Array.from(topics);
}

// Get cases by category and topic
function getCasesByTopic(category, topic) {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  const cases = [];
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === category && data[i][2] === topic && data[i][3]) {
      cases.push({
        prompt_id: data[i][0],
        case_name: data[i][3],
        backend_log: data[i][4] || '',
        email_subject: data[i][5] || ''
      });
    }
  }
  
  return cases;
}

// Get prompt data by ID
function getPromptById(promptId) {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === promptId.toString()) {
      return {
        prompt_id: data[i][0],
        inquiry_reason: data[i][1],
        topic_name: data[i][2],
        case_name: data[i][3],
        backend_log: data[i][4] || '',
        email_subject: data[i][5] || '',
        context: JSON.parse(data[i][6] || '{}'),
        options: JSON.parse(data[i][7] || '{}')
      };
    }
  }
  
  return null;
}

// Save new prompt template
function savePromptTemplate(template) {
  const sheet = getSheet('prompt_data');
  const promptId = generateUniqueId();
  
  sheet.appendRow([
    promptId,
    template.inquiry_reason,
    template.topic_name,
    template.case_name,
    template.backend_log || '',
    template.email_subject || '',
    JSON.stringify(template.context || {}),
    JSON.stringify(template.options || {})
  ]);
  
  return promptId;
}

// Update existing prompt template
function updatePromptTemplate(template) {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === template.prompt_id.toString()) {
      sheet.getRange(i + 1, 2).setValue(template.inquiry_reason);
      sheet.getRange(i + 1, 3).setValue(template.topic_name);
      sheet.getRange(i + 1, 4).setValue(template.case_name);
      sheet.getRange(i + 1, 5).setValue(template.backend_log || '');
      sheet.getRange(i + 1, 6).setValue(template.email_subject || '');
      sheet.getRange(i + 1, 7).setValue(JSON.stringify(template.context || {}));
      sheet.getRange(i + 1, 8).setValue(JSON.stringify(template.options || {}));
      
      return true;
    }
  }
  
  return false;
}

// Delete prompt template
function deletePromptTemplate(promptId) {
  const sheet = getSheet('prompt_data');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === promptId.toString()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  
  return false;
}