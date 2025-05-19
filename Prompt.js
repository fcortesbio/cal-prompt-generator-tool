/**
 * Get navigation data (categories, topics, cases)
 * Retrieves structured navigation data containing prompt categories, topics, and cases.
 * This data is used to build the navigation sidebar in the UI.
 *
 * @returns {Array<Object>} An array of objects, where each object represents a category and contains its name and an array of topics. Each topic object contains its name and an array of cases.
 */
function getNavigationData() {
  const categories = getPromptCategories();
  const navigation = [];

  for (const category of categories) {
    const topics = getTopicsByCategory(category);
    const topicData = [];

    for (const topic of topics) {
      const cases = getCasesByTopic(category, topic);
      topicData.push({
        name: topic,
        cases: cases,
      });
    }

    navigation.push({
      name: category,
      topics: topicData,
    });
  }

  return navigation;
}

/**
 * Generates a prompt object based on a prompt template, agent data, and form data.
 *
 * @param {string} promptId - The ID of the prompt template.
 * @param {Object} agentData - The data of the agent generating the prompt (e.g., name).
 * @param {Object} formData - The data submitted from the prompt options form.
 */
function generatePromptObject(promptId, agentData, formData) {
  const promptTemplate = getPromptById(promptId);

  if (!promptTemplate) {
    return {
      success: false,
      message: "Prompt template not found.",
    };
  }

  // Extract first name
  const nameParts = agentData.name.split(", ");
  const firstName = nameParts.length > 1 ? nameParts[1] : agentData.name;

  // Build prompt object
  const promptObject = {
    agent_details: {
      agent_name: firstName,
      agent_team: "Customer Solutions Tech Team",
    },
    context: {},
    options: {},
  };

  // Fill in context from template
  for (const key in promptTemplate.context) {
    promptObject.context[key] = promptTemplate.context[key];
  }

  // Fill in options from form data
  for (const key in promptTemplate.options) {
    if (formData && formData[key]) {
      promptObject.options[key] = formData[key];
    } else {
      promptObject.options[key] = promptTemplate.options[key];
    }
  }

  // Generate the full prompt text
  const promptText = generatePromptText(promptObject);

  return {
    success: true,
    promptObject: promptObject,
    promptText: promptText,
    template: promptTemplate,
  };
}

/**
 * Generates the full prompt text based on the provided prompt object.
 *
 * @param {Object} promptObject - The object containing the structured prompt data.
 * @returns {string} The complete prompt text ready to be used with the AI.
 */
function generatePromptText(promptObject) {
  const template = `You are a support assistant at ${COMPANY}. Use the provided JSON to generate a polite, professional, and QA-compliant email response.

The email must follow **exactly** this 4-paragraph structure:

1. GREET    
2. THANKS + INTRO + EMPATHY + EDUCATION    
3. EMPOWERMENT    
4. CLOSING  

Below is the JSON object to use:

${JSON.stringify(promptObject, null, 2)}`;

  return template;
}

/**
 * Renders a template string using a simple Mustache-like syntax ({{key}}).
 *
 * @param {string} template - The template string with placeholders.
 * @param {Object} data - The data object to fill the placeholders.
 * @returns {string} The rendered template string.
 */
function renderMustache(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = key
      .trim()
      .split(".")
      .reduce((obj, prop) => obj?.[prop], data);
    return value !== undefined ? value : `[missing: ${key.trim()}]`;
  });
}

/**
 * Saves a new prompt template or updates an existing one (admin only).
 *
 * @param {string} eid - The EID of the admin user performing the action.
 * @param {Object} template - The template object to save or update.
 * @returns {Object} An object indicating success or failure and a message.
 */
function saveTemplate(eid, template) {
  if (!isAdmin(eid)) {
    return {
      success: false,
      message: "Unauthorized access.",
    };
  }

  // Validate required fields
  if (!template.inquiry_reason || !template.topic_name || !template.case_name) {
    return {
      success: false,
      message: "Missing required fields.",
    };
  }

  // Ensure context and options are objects
  if (typeof template.context !== "object") {
    template.context = {};
  }

  if (typeof template.options !== "object") {
    template.options = {};
  }

  // Save or update
  let result;
  if (template.prompt_id) {
    result = updatePromptTemplate(template);
    return {
      success: result,
      message: result
        ? "Template updated successfully."
        : "Failed to update template.",
      promptId: template.prompt_id,
    };
  } else {
    const promptId = savePromptTemplate(template);
    return {
      success: true,
      message: "Template saved successfully.",
      promptId: promptId,
    };
  }
}

/**
 * Deletes a prompt template by its ID (admin only).
 *
 * @param {string} eid - The EID of the admin user performing the action.
 * @param {string} promptId - The ID of the template to delete.
 * @returns {Object} An object indicating success or failure and a message.
 */
function deleteTemplate(eid, promptId) {
  if (!isAdmin(eid)) {
    return {
      success: false,
      message: "Unauthorized access.",
    };
  }

  const result = deletePromptTemplate(promptId);

  return {
    success: result,
    message: result
      ? "Template deleted successfully."
      : "Failed to delete template.",
  };
}
