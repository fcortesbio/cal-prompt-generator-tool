// Get recommended context keys
/**
 * Retrieves a list of recommended keys for prompt context fields.
 *
 * @returns {string[]} An array of recommended context keys.
 */
function getRecommendedContextKeys() {
  return [
    "case_description",
    "contact_reason",
    "action_required",
    "justification",
    "request_status",
    "pending_reason",
    "actions_taken",
    "recommendations",
    "empowerment_statement",
  ];
}

// Get recommended option keys
/**
 * Retrieves a list of recommended keys for prompt option fields.
 *
 * @returns {string[]} An array of recommended option keys.
 */
function getRecommendedOptionKeys() {
  return ["ticket_number", "user_name", "user_company"];
}

// Get template editor data
/**
 * Retrieves data required to populate the template editor UI,
 * including a specific template if an ID is provided,
 * recommended context and option keys, and available prompt categories.
 *
 * @param {string} adminEid The EID of the user requesting the data (for authorization).
 * @param {string} [promptId] The ID of the prompt template to retrieve (optional).
 * @returns {Object} An object containing success status, a message if unsuccessful, and the editor data if successful.
 */
function getTemplateEditorData(adminEid, promptId) {
  if (!isAdmin(adminEid)) {
    return {
      success: false,
      message: "Unauthorized access.",
    };
  }

  let template = null;

  if (promptId) {
    template = getPromptById(promptId);
    if (!template) {
      return {
        success: false,
        message: "Template not found.",
      };
    }
  }

  return {
    success: true,
    template: template,
    contextKeys: getRecommendedContextKeys(),
    optionKeys: getRecommendedOptionKeys(),
    categories: getPromptCategories(),
  };
}
