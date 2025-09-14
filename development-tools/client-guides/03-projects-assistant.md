# Guide: Projects Assistant

The Projects Assistant is designed to streamline project management, with a powerful focus on automating the client onboarding process.

## 1. Onboarding Playbook

This is the control center for your automated onboarding. Here you define the templates that the AI will use for every new project.

-   **Document Templates**: List the standard documents you need for each project (e.g., Kick-off Agenda, Project Timeline).
    -   Use placeholders like `{client_name}` and `{project_name}` which will be automatically replaced.
    -   You can add new templates manually or use the **"Suggest with AI"** button to get best-practice recommendations.
-   **Welcome Email Template**: Define the initial email sent to new clients.
    -   Use the same placeholders for personalization.
    -   Use the **"Draft with AI"** button to generate a professional and welcoming email template.

**Note**: All changes to the playbook are automatically saved to your browser's local storage for persistence.

## 2. Onboarding Assistant Queue

Any project with the status "Onboarding" will appear in this queue.

**How to Onboard a Project:**

1.  Click the **"Initiate Onboarding"** button next to a project.
2.  An "Onboarding Plan" modal will appear. The AI will use your playbook templates to generate the specific documents and email for this client.
3.  **Review the Plan**: You can edit the body of the welcome email directly in the preview if needed.
4.  Click **"Confirm & Execute"**. The system will:
    -   (Simulate) Create the documents in your connected Google Drive.
    -   (Simulate) Send the welcome email.
    -   Change the project's status to "On Track".
    -   You will receive a notification upon completion.

## 3. Deadline Alerts

This card automatically flags projects that are overdue or due within the next 7 days, helping you stay on top of critical timelines.

## 4. All Projects View

This is a comprehensive table of all your projects, synced live from your data source (e.g., Airtable). It provides key information like status, health score, and a direct link to the project's Google Drive folder.
