# Cal Prompt Generator

This project is a Google Apps Script web application designed to help support agents generate structured prompts for an AI assistant named Cal. It utilizes a Google
Sheet as its backend database for storing user data and prompt templates.

## Project Structure

The project is organized into several files, each with a specific purpose:

-   **`appsscript.json`**: This is the manifest file for the Google Apps Script project. It configures project settings, including authorized services (like SpreadsheetApp) and web app deployment options.

-   **`Code.js`**: Contains the core server-side logic for the web application. This includes the `doGet()` function to serve the HTML, utility functions like `include()`, `getConfig()`, `generateUniqueId()`, `isAdmin()`, and `isValidEidFormat()`. It acts as the main entry point for the web app and houses general-purpose functions used across the server-side code.

-   **`Auth.js`**: Handles user authentication and authorization. It contains functions for validating user logins (`validateLogin`), submitting new user signup requests (`submitSignupRequest`), and managing pending user requests (for admins, `getPendingRequests`, `processPendingUser`).

-   **`Database.js`**: Provides an interface for interacting with the Google Sheet acting as the database. It includes functions to get the active spreadsheet and specific sheets (`getSpreadsheet`, `getSheet`), retrieve and update user data (`getUserByEid`, `addPendingUser`, `getPendingUsers`, `updatePendingUserStatus`), and manage prompt templates (`getPromptCategories`, `getTopicsByCategory`, `getCasesByTopic`, `getPromptById`, `savePromptTemplate`, `updatePromptTemplate`, `deletePromptTemplate`).

-   **`Prompt.js`**: Contains the logic related to generating and managing prompts. This includes functions for fetching navigation data based on prompt categories and topics (`getNavigationData`), generating the final prompt object and text based on a template and user input (`generatePromptObject`, `generatePromptText`), and server-side functions for saving and deleting prompt templates (leveraging `Database.js`).

-   **`UI.js`**: Provides data specifically needed by the client-side UI, primarily for the template editor. It includes functions to get recommended keys for context and options (`getRecommendedContextKeys`, `getRecommendedOptionKeys`) and to retrieve data for populating the template editor form (`getTemplateEditorData`).

-   **`index.html`**: The main HTML file for the web application. It defines the structure of the user interface, including the login form, dashboard layout (sidebar and content area), prompt generation section, admin panel, and about section. It uses Apps Script templating (`<?!= include(...) ?>`) to include the CSS and JavaScript files.

-   **`css.html`**: Contains the CSS styles for the web application. It's included in `index.html` using Apps Script templating.

-   **`js.html`**: Contains the client-side JavaScript code. This script handles user interactions, form submissions, dynamic content loading, and communication with the server-side Google Apps Script functions using `google.script.run`.

-   **`.vscode/settings.json`**: A configuration file for Visual Studio Code, likely containing settings specific to the development environment, such as formatting rules or extension recommendations.

## Functionality Overview

The Cal Prompt Generator allows support agents to log in (with a signup request process for new users). Once logged in, agents can navigate through a list of prompt categories and topics to find specific case templates. Selecting a case loads a form allowing the agent to input relevant information. The application then generates a structured prompt based on the template and the provided input, which can be easily copied. Admin users have additional functionality to manage user requests and create, edit, and delete prompt templates.