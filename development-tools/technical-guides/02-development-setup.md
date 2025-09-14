

# Technical Guide: Development Setup

This guide explains how to set up the Maxwell Vantage application on a local machine for development purposes.

## Prerequisites

1.  **Node.js and npm**: You must have Node.js (version 20 LTS or higher) and npm installed. The project is configured to run on Node 20. You can download it from [nodejs.org](https://nodejs.org/) or use a version manager like `nvm`.
2.  **Netlify CLI**: To run the serverless function locally, you need the Netlify command-line interface. Install it globally: `npm install -g netlify-cli`.
3.  **A Code Editor**: Visual Studio Code is recommended.
4.  **API Keys**: You must have valid API keys for:
    -   Google Gemini
    -   Firebase
    -   Airtable (including your Base ID and Table Names)

## Local Setup Instructions

### 1. Install Dependencies

Clone or download the project files to your local machine. Open a terminal in the project's root directory and run the following command to install all the required libraries:

```bash
npm install
```

### 2. Set Up Environment Variables

The application uses environment variables to handle API keys securely.

1.  In the root of the project, create a new file named `.env`.
2.  **This file is ignored by git and should never be committed.**
3.  Add your secret keys to the `.env` file in the following format:

```env
# Google Gemini API Key (for the serverless function, NOT exposed to client)
API_KEY=your_gemini_api_key_here

# Airtable Credentials (SERVER-SIDE ONLY for security)
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
PROJECTS_TABLE_NAME=YourProjectsTableName
PROSPECTS_TABLE_NAME=YourProspectsTableName

# Firebase Credentials (safe to be exposed to client)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
Replace the placeholder values with your actual credentials. 
- The server-side keys (like `API_KEY` and `AIRTABLE_API_KEY`) are used by the Netlify CLI to simulate the server environment for your functions.
- The `VITE_` prefix is required by Vite to expose variables to the client-side application code.

### 3. Running the Application

Once your dependencies are installed and your `.env` file is configured, you can start the local development server.

1.  In your terminal, from the project root, run:
    ```bash
    netlify dev
    ```
2.  The Netlify CLI will start the server, run your Vite dev server, and make your serverless function available. It will provide you with a local URL (e.g., `http://localhost:8888`).

The application should now be running locally with Hot Module Replacement (HMR) for the frontend and live reloading for your serverless function.