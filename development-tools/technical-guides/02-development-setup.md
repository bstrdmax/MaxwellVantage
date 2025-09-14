

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
3.  Add the required variables to the `.env` file. For each variable, you will add a line like `VARIABLE_NAME=your_actual_value`.

> [!CAUTION]
> **CRITICAL SECURITY NOTE**
> 
> It is essential to distinguish between server-side secrets and client-side keys.
> - **Server-Side Secrets (`API_KEY`, `AIRTABLE_...`)**: These are highly sensitive and MUST NOT be prefixed with `VITE_`. They are used by the Netlify Dev server to simulate the secure backend environment.
> - **Client-Side Keys (`VITE_FIREBASE_...`)**: These are safe to be exposed in the browser and MUST be prefixed with `VITE_` for the Vite build process to include them.
> 
> **Incorrectly prefixing a secret like `AIRTABLE_API_KEY` with `VITE_` will expose it and cause your production build to fail Netlify's security scan.**

#### Required Variables

**Server-Side Secrets (No `VITE_` prefix):**
-   `API_KEY`: Your Google Gemini API Key.
-   `AIRTABLE_API_KEY`: Your Airtable API Key.
-   `AIRTABLE_BASE_ID`: Your Airtable Base ID.
-   `PROJECTS_TABLE_NAME`: The name of your projects table in Airtable.
-   `PROSPECTS_TABLE_NAME`: The name of your prospects table in Airtable.

**Client-Side Keys (Must have `VITE_` prefix):**
-   `VITE_FIREBASE_API_KEY`: Your Firebase API Key.
-   `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain.
-   `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID.
-   `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
-   `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
-   `VITE_FIREBASE_APP_ID`: Your Firebase app ID.

Replace the placeholder descriptions with your actual credentials.
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