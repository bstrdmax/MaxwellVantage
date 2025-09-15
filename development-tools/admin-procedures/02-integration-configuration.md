# Desk Procedure: Integration Configuration

**Role:** Workspace Owner / Administrator
**Primary Tool:** Maxwell Vantage - Settings & Deployment Platform

This guide outlines the standard procedures for connecting and managing third-party integrations.

---

### 1. Accessing the Integrations Hub

-   **Action**: Navigate to **Settings** from the sidebar. The **Integrations Hub** card is located on this page.
-   **Purpose**: This hub is the central location for viewing the connection status of external services like Google Workspace and Airtable.

### 2. Connection Method: Environment Variables

All integrations in Maxwell Vantage are managed via **Environment Variables** in your deployment platform (e.g., Netlify). This is a security best practice that keeps secret keys out of the source code.

There are two types of environment variables used in this application:

1.  **Server-Side Variables**: These are the most secure and are **only** accessible by the backend serverless functions. They are never exposed to the user's browser. **All highly sensitive keys (Gemini, Airtable) MUST be server-side.**
2.  **Client-Side Variables (prefixed with `VITE_`)**: These are made available to the React frontend code. They should be used for services that require initialization in the browser (like Firebase).

### 3. Google Gemini API (Server-Side)

-   **Functionality**: Powers all AI features in the application.
-   **Configuration**: Set your Google Gemini API key as a server-side environment variable in your deployment platform.
-   **Procedure for Administrator**:
    1.  In your deployment platform's settings, add an environment variable for your secret Google Gemini API Key.
    2.  **Crucially, do not add the `VITE_` prefix.** This ensures the key remains secure on the server. The application's backend expects this variable to be named `API_KEY`.

### 4. Airtable (Server-Side)

-   **Functionality**: Syncs project and prospect data.
-   **Configuration**: You will need to set server-side environment variables for your Airtable API Key, your Base ID, and the names of your Projects and Prospects tables.
-   **Procedure for Administrator**:
    1.  Add the four required variables to your deployment platform's environment settings.
    2.  Fill in the corresponding values from your Airtable account.
    3.  **CRITICAL**: Do not add the `VITE_` prefix to these keys. These are sensitive credentials handled securely by a serverless function. Exposing them to the client by adding the `VITE_` prefix is a security risk and will cause the deployment to be blocked by Netlify's secrets scanner.
    4.  Redeploy the application for the changes to take effect.

### 5. Firebase (Client-Side)

-   **Functionality**: Manages user authentication (login, logout, session state).
-   **Configuration**: Set all keys from your Firebase web app configuration object as client-side environment variables.
-   **Procedure for Administrator**:
    1.  In your Firebase project settings, find your web app's configuration object.
    2.  Add each key-value pair from that object as an environment variable in your deployment platform, making sure to prefix each key with `VITE_`. For example, `apiKey` from Firebase should be an environment variable named `VITE_FIREBASE_API_KEY`.

### Verifying Connections

-   After setting variables and redeploying, navigate to the **Settings** page in Maxwell Vantage. The integrations should show a "Connected" status.
-   If the **Projects Assistant** shows "Using Mock Data", the `AIRTABLE_...` variables are likely incorrect or missing. Check your deployment platform's settings and redeploy.
-   If an integration is not connected, the most common cause is a mistyped variable name or value, or forgetting to redeploy the application.