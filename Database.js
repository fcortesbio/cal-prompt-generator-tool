// Get active spreadsheet

/**
 * Gets the active spreadsheet.
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet} The active spreadsheet.
 */
function getSpreadsheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Get sheet by name

/**
 * Gets a sheet by its name from the active spreadsheet.
 * @param {string} sheetName The name of the sheet to get.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} The sheet with the specified name, or null if not found.
 */
function getSheet(sheetName) {
  return getSpreadsheet().getSheetByName(sheetName);
}

// Get user data by EID

/**
 * Gets user data from the 'user_data' sheet based on the provided Employee ID (EID).
 * @param {string|number} eid The Employee ID of the user to retrieve.
 * @returns {object|null} An object containing the user's data (agent_eid, agent_name, agent_division, agent_role), or null if the user is not found.
 */
function getUserByEid(eid) {
  const sheet = getSheet("user_data");
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === eid.toString()) {
      return {
        agent_eid: data[i][0].toString(),
        agent_name: data[i][1],
        agent_division: data[i][2],
        agent_role: data[i][3],
      };
    }
  }

  return null;
}

// Add pending user signup request

/**
 * Adds a new pending user signup request to the 'pending_users' sheet.
 * @param {string|number} eid The Employee ID of the user.
 * @param {string} firstName The first name of the user.
 * @param {string} lastName The last name of the user.
 * @param {string} email The email address of the user.
 * @returns {boolean} True if the user was successfully added.
 */
function addPendingUser(eid, firstName, lastName, email) {
  const sheet = getSheet("pending_users");
  sheet.appendRow([eid, firstName, lastName, email, "pending"]);
  return true;
}

// Get all pending users

/**
 * Gets all pending user signup requests from the 'pending_users' sheet.
 * @returns {Array<object>} An array of objects, where each object represents a pending user with eid, firstName, lastName, email, and status.
 */
function getPendingUsers() {
  const sheet = getSheet("pending_users");
  const data = sheet.getDataRange().getValues();
  const users = [];

  for (let i = 0; i < data.length; i++) {
    users.push({
      eid: data[i][0].toString(),
      firstName: data[i][1],
      lastName: data[i][2],
      email: data[i][3],
      status: data[i][4],
    });
  }

  return users;
}

// Update pending user status

/**
 * Updates the status of a pending user in the 'pending_users' sheet. If the status is 'approved', the user is also added to the 'user_data' sheet.
 * @param {string|number} eid The Employee ID of the pending user to update.
 * @param {string} status The new status to set ('pending', 'approved', 'rejected').
 * @returns {boolean} True if the user status was updated, false if the user was not found in pending_users.
 */
function updatePendingUserStatus(eid, status) {
  const sheet = getSheet("pending_users");
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === eid.toString()) {
      sheet.getRange(i + 1, 5).setValue(status);

      if (status === "approved") {
        // Add to user_data
        const userSheet = getSheet("user_data");
        userSheet.appendRow([
          eid,
          data[i][2] + ", " + data[i][1], // Last, First
          "", // Division (empty by default)
          "agent", // Role (default to agent)
        ]);
      }

      return true;
    }
  }

  return false;
}

// Get all prompt categories (inquiry_reason)

/**
 * Gets all unique prompt categories (inquiry_reason) from the 'prompt_data' sheet.
 * @returns {Array<string>} An array of unique category names.
 */
function getPromptCategories() {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();
  const categories = new Set();

  for (let i = 0; i < data.length; i++) {
    if (data[i][1]) {
      // inquiry_reason
      categories.add(data[i][1]);
    }
  }

  return Array.from(categories);
}

// Get topics by category

/**
 * Gets all unique topic names associated with a given category from the 'prompt_data' sheet.
 * @param {string} category The category to filter topics by.
 * @returns {Array<string>} An array of unique topic names for the specified category.
 */
function getTopicsByCategory(category) {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();
  const topics = new Set();

  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === category && data[i][2]) {
      // match inquiry_reason and has topic_name
      topics.add(data[i][2]);
    }
  }

  return Array.from(topics);
}

// Get cases by category and topic

/**
 * Gets a list of cases (prompts) for a specific category and topic from the 'prompt_data' sheet.
 * @param {string} category The category to filter cases by.
 * @param {string} topic The topic to filter cases by.
 * @returns {Array<object>} An array of objects, where each object represents a case with prompt_id, case_name, backend_log, and email_subject.
 */
function getCasesByTopic(category, topic) {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();
  const cases = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i][1] === category && data[i][2] === topic && data[i][3]) {
      cases.push({
        prompt_id: data[i][0],
        case_name: data[i][3],
        backend_log: data[i][4] || "",
        email_subject: data[i][5] || "",
      });
    }
  }

  return cases;
}

// Get prompt data by ID

/**
 * Gets the full prompt data for a given prompt ID from the 'prompt_data' sheet.
 * @param {string|number} promptId The ID of the prompt to retrieve.
 * @returns {object|null} An object containing the prompt data (prompt_id, inquiry_reason, topic_name, case_name, backend_log, email_subject, context, options), or null if the prompt is not found.
 */
function getPromptById(promptId) {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === promptId.toString()) {
      return {
        prompt_id: data[i][0],
        inquiry_reason: data[i][1],
        topic_name: data[i][2],
        case_name: data[i][3],
        backend_log: data[i][4] || "",
        email_subject: data[i][5] || "",
        context: JSON.parse(data[i][6] || "{}"),
        options: JSON.parse(data[i][7] || "{}"),
      };
    }
  }

  return null;
}

// Save new prompt template

/**
 * Saves a new prompt template to the 'prompt_data' sheet. A unique prompt ID is generated for the new template.
 * @param {object} template An object containing the template data (inquiry_reason, topic_name, case_name, backend_log, email_subject, context, options).
 * @returns {number} The newly generated unique ID for the saved prompt template.
 */
function savePromptTemplate(template) {
  const sheet = getSheet("prompt_data");
  const promptId = generateUniqueId();

  sheet.appendRow([
    promptId,
    template.inquiry_reason,
    template.topic_name,
    template.case_name,
    template.backend_log || "",
    template.email_subject || "",
    JSON.stringify(template.context || {}),
    JSON.stringify(template.options || {}),
  ]);

  return promptId;
}

// Update existing prompt template

/**
 * Updates an existing prompt template in the 'prompt_data' sheet based on the provided template object's prompt_id.
 * @param {object} template An object containing the updated template data, including the prompt_id to identify the template to update.
 * @returns {boolean} True if the template was successfully updated, false if a template with the provided prompt_id was not found.
 */
function updatePromptTemplate(template) {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === template.prompt_id.toString()) {
      sheet.getRange(i + 1, 2).setValue(template.inquiry_reason);
      sheet.getRange(i + 1, 3).setValue(template.topic_name);
      sheet.getRange(i + 1, 4).setValue(template.case_name);
      sheet.getRange(i + 1, 5).setValue(template.backend_log || "");
      sheet.getRange(i + 1, 6).setValue(template.email_subject || "");
      sheet.getRange(i + 1, 7).setValue(JSON.stringify(template.context || {}));
      sheet.getRange(i + 1, 8).setValue(JSON.stringify(template.options || {}));

      return true;
    }
  }

  return false;
}

// Delete prompt template

/**
 * Deletes a prompt template from the 'prompt_data' sheet based on the provided prompt ID.
 * @param {string|number} promptId The ID of the prompt template to delete.
 * @returns {boolean} True if the template was successfully deleted, false if a template with the provided prompt ID was not found.
 */
function deletePromptTemplate(promptId) {
  const sheet = getSheet("prompt_data");
  const data = sheet.getDataRange().getValues();

  for (let i = 0; i < data.length; i++) {
    if (data[i][0].toString() === promptId.toString()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}
