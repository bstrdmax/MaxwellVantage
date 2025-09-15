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
> - **Server-Side Secrets (`AIRTABLE_...`)**: These are highly sensitive and MUST NOT be prefixed with `VITE_`. They are used by the Netlify Dev server to simulate the secure backend environment.
> - **Client-Side Keys (`VITE_FIREBASE_...`)**: These are safe to be exposed in the browser and MUST be prefixed with `VITE_` for the Vite build process to include them.
> 
> **Incorrectly prefixing a secret like `AIRTABLE_API_KEY` with `VITE_` will expose it and cause your production build to fail Netlify's security scan.**

#### Required Variables

Your `.env` file needs to contain keys for three services: Google Gemini, Airtable, and Firebase.

**Server-Side Secrets (No `VITE_` prefix):**
These keys are used by the backend and are not exposed to the browser. You will need to add variables for:
-   Your Google Gemini API Key.
-   Your Airtable API Key.
-   Your Airtable Base ID.
-   The name of your projects table in Airtable.
-   The name of your prospects table in Airtable.

**Client-Side Keys (Must have `VITE_` prefix):**
These keys are for Firebase and are safely exposed to the browser.
-   You will need to add all the key-value pairs from your Firebase web app's configuration object (apiKey, authDomain, projectId, etc.).
-   **Crucially, each variable name must be prefixed with `VITE_` for the application to work.** For example, the `apiKey` from Firebase should be stored in a variable named `VITE_FIREBASE_API_KEY`.

Refer to the source code (`src/firebase.ts`, `netlify/functions/*.ts`) for the exact variable names the application expects.

### 3. Running the Application

Once your dependencies are installed and your `.env` file is configured, you can start the local development server.

1.  In your terminal, from the project root, run:
    ```bash
    netlify dev
    ```
2.  The Netlify CLI will start the server, run your Vite dev server, and make your serverless function available. It will provide you with a local URL (e.g., `http://localhost:8888`).

The application should now be running locally with Hot Module Replacement (HMR) for the frontend and live reloading for your serverless function.