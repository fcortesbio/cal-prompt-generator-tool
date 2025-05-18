// Configuration Constants
const COMPANY = "Blond";
const DOMAIN_NAME = "domain.com";
const OWNER_NAME = "Fabi";
const OWNER_EMAIL = "steve@domain.com";
const EID_LENGTH = 7;

// Main function to serve the web app
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Cal Prompt Generator')
    // .setFaviconUrl('https://www.google.com/s2/favicons?domain=google.com')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Include HTML files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Get configuration for client-side
function getConfig() {
  return {
    COMPANY: COMPANY,
    DOMAIN_NAME: DOMAIN_NAME,
    OWNER_NAME: OWNER_NAME,
    OWNER_EMAIL: OWNER_EMAIL,
    EID_LENGTH: EID_LENGTH
  };
}

// Generate a unique ID for prompts
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000000);
}

// Utility function to check if user is admin
function isAdmin(eid) {
  const userData = getUserByEid(eid);
  return userData && userData.agent_role === 'admin';
}

// Utility function to validate EID format
function isValidEidFormat(eid) {
  return eid && eid.toString().length === EID_LENGTH && !isNaN(eid);
}