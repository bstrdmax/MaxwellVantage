
# Technical Guide: Development Setup

This guide explains how to set up the Maxwell Vantage application on a local machine for development purposes.

## Prerequisites

1.  **Node.js and npm**: You must have Node.js (version 18 or higher) and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
2.  **A Code Editor**: Visual Studio Code is recommended.
3.  **API Keys**: You must have valid API keys for:
    -   Google Gemini
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
# Google Gemini API Key
VITE_API_KEY=your_gemini_api_key_here

# Airtable Credentials
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_PROJECTS_TABLE_NAME=YourProjectsTableName
VITE_PROSPECTS_TABLE_NAME=YourProspectsTableName
```
Replace the placeholder values with your actual credentials. The `VITE_` prefix is required by Vite to expose these variables to the application code.

### 3. Running the Application

Once your dependencies are installed and your `.env` file is configured, you can start the local development server.

1.  In your terminal, from the project root, run:
    ```bash
    npm run dev
    ```
2.  Vite will start the server and provide you with a local URL. Open this URL in your browser (e.g., `http://localhost:5173`).

The application should now be running locally with Hot Module Replacement (HMR), meaning changes you make to the code will appear in the browser instantly without a full page reload.
