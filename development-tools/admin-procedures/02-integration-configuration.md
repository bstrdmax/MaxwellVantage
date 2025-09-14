
# Desk Procedure: Integration Configuration

**Role:** Workspace Owner / Administrator
**Primary Tool:** Maxwell Vantage - Settings & Deployment Platform

This guide outlines the standard procedures for connecting and managing third-party integrations.

---

### 1. Accessing the Integrations Hub

-   **Action**: Navigate to **Settings** from the sidebar. The **Integrations Hub** card is located on this page.
-   **Purpose**: This hub is the central location for managing connections to external services like Google Workspace and Airtable.

### 2. Google Workspace

-   **Functionality**:
    -   **Projects Assistant**: Allows the AI to create onboarding documents in Google Docs/Sheets.
    -   **Content Assistant**: Enables saving generated content drafts to Google Drive.
-   **Status**:
    -   This integration is currently a **mock-up**. In a production environment, this would involve an OAuth flow.
-   **Procedure to Connect**:
    1.  (Mock) Click the **"Connect"** button.
    2.  You would be redirected to a Google authentication screen to grant permissions.

### 3. Airtable

-   **Functionality**:
    -   **Projects Assistant**: Syncs the "All Projects" view from an Airtable base.
    -   **Prospects Assistant**: Allows syncing of qualified prospects from Vantage *to* an Airtable base.
-   **Connection Method**: The Airtable connection is managed via **Environment Variables**, not through the user interface. This is a security measure to protect your API key.
-   **Procedure for Administrator**:
    1.  **Obtain Credentials**: Get the Airtable API Key, Base ID, Projects Table Name, and Prospects Table Name from your Airtable account.
    2.  **Set Environment Variables**: In your deployment platform (e.g., Netlify, Vercel), navigate to the site's settings and find the "Environment Variables" section.
    3.  **Add the following variables**:
        -   `VITE_AIRTABLE_API_KEY`
        -   `VITE_AIRTABLE_BASE_ID`
        -   `VITE_PROJECTS_TABLE_NAME`
        -   `VITE_PROSPECTS_TABLE_NAME`
    4.  **Redeploy**: Save the variables and trigger a new deployment of the application for the changes to take effect.
-   **Verifying the Connection**:
    -   Once the variables are set, navigate to the **Settings** page in Maxwell Vantage. The Airtable integration should show a green "Connected" status.
    -   If it shows "Not Connected", verify that the environment variables were entered correctly and the site has been redeployed.
