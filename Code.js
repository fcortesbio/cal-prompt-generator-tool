// Configuration Constants
const COMPANY = "domain";
const DOMAIN_NAME = "domain.com";
const OWNER_NAME = "Fabi";
const OWNER_EMAIL = "fabi@domain.com";
const EID_LENGTH = 7;

/**
 * Handles GET requests to the web app.
 * Serves the index.html template and sets basic page properties.
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output to be served.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Cal Prompt Generator')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Consider if ALLOWALL is the most secure option for your use case.
}

/**
 * Includes the content of an HTML file.
 * This is typically used within scriptlets in HTML templates.
 *
 * @param {string} filename The name of the HTML file to include (without the .html extension).
 * @returns {string} The content of the specified HTML file.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Provides configuration constants to the client-side.
 * This function is typically called via google.script.run from the client.
 *
 * @returns {Object} An object containing configuration constants.
 * @property {string} COMPANY - The company name.
 * @property {string} DOMAIN_NAME - The domain name.
 * @property {string} OWNER_NAME - The name of the owner.
 * @property {string} OWNER_EMAIL - The email address of the owner.
 * @property {number} EID_LENGTH - The expected length of employee IDs.
 */
function getConfig() {
  return {
    COMPANY: COMPANY,
    DOMAIN_NAME: DOMAIN_NAME,
    OWNER_NAME: OWNER_NAME,
    OWNER_EMAIL: OWNER_EMAIL,
    EID_LENGTH: EID_LENGTH
  };
}

/**
 * Generates a pseudo-unique numerical ID.
 * @returns {number} A pseudo-unique numerical ID.
 */
function generateUniqueId() {
  return Math.floor(Math.random() * 1000000000);
}

/**
 * Checks if a user with the given EID is an administrator.
 * It retrieves user data based on EID and checks the 'agent_role'.
 *
 * @param {string|number} eid The employee ID of the user.
 * @returns {boolean} True if the user is an admin, false otherwise.
 */
function isAdmin(eid) {
  // getUserByEid defined at Database.js
  const userData = getUserByEid(eid);
  return userData && userData.agent_role === 'admin';
}

/**
 * Validates the format of an Employee ID (EID).
 * Checks if the EID exists, has the correct length, and is a number.
 *
 * @param {string|number} eid The employee ID to validate.
 * @returns {boolean} True if the EID format is valid, false otherwise.
 */
function isValidEidFormat(eid) {
  return eid && eid.toString().length === EID_LENGTH && !isNaN(eid);
}