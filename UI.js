// Get recommended context keys
function getRecommendedContextKeys() {
  return [
    'case_description',
    'contact_reason',
    'action_required',
    'justification',
    'request_status',
    'pending_reason',
    'actions_taken',
    'recommendations',
    'empowerment_statement'
  ];
}

// Get recommended option keys
function getRecommendedOptionKeys() {
  return [
    'ticket_number',
    'user_name',
    'user_company'
  ];
}

// Get template editor data
function getTemplateEditorData(adminEid, promptId) {
  if (!isAdmin(adminEid)) {
    return { 
      success: false, 
      message: 'Unauthorized access.' 
    };
  }
  
  let template = null;
  
  if (promptId) {
    template = getPromptById(promptId);
    if (!template) {
      return { 
        success: false, 
        message: 'Template not found.' 
      };
    }
  }
  
  return {
    success: true,
    template: template,
    contextKeys: getRecommendedContextKeys(),
    optionKeys: getRecommendedOptionKeys(),
    categories: getPromptCategories()
  };
}