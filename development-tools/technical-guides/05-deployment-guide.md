

# Technical Guide: Deployment to Netlify

This guide provides step-by-step instructions for deploying the Maxwell Vantage application to Netlify.

---

## Introduction

Deploying this application involves more than just building the frontend; it requires correctly configuring the serverless backend function and securing your API keys as environment variables. Following these steps carefully is critical for a successful and secure deployment.

## Prerequisites

1.  **A Netlify Account**: Sign up for a free account at [netlify.com](https://www.netlify.com/).
2.  **A Git Provider Account**: Your project code must be hosted on GitHub, GitLab, or Bitbucket.
3.  **A Google Cloud / Firebase Account**: You must have a Google account to create and configure the necessary services.
4.  **Required API Keys**: You must have all your API keys and credentials ready *before* starting the deployment steps.

---

## Step 0: Google Cloud & Firebase Prerequisite Setup

Before deploying to Netlify, you must configure your Google services. Firebase is part of Google Cloud, so these steps are connected.

### 1. Create a Firebase Project
-   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
-   Once created, go to your project's settings and add a new "Web app". Give it a nickname.
-   Firebase will provide you with a `firebaseConfig` object. **Keep this information handy**; you will need it for the environment variables in Step 4.

### 2. Enable Firebase Authentication Methods
-   In the Firebase Console, go to the **Authentication** section.
-   Click on the **"Sign-in method"** tab.
-   Enable the **"Email/Password"** provider.
-   Enable the **"Google"** provider. You will be prompted to select a project support email.

### 3. Enable Google Cloud APIs
Your Firebase project is also a Google Cloud Platform (GCP) project. You need to enable the APIs that the application assistants will use.
-   Navigate to the [Google Cloud API Library](https://console.cloud.google.com/apis/library) and make sure you have the correct project selected.
-   Search for and **enable** the following APIs:
    1.  **Google Drive API** (for the Projects and Content Assistants)
    2.  **Gmail API** (for the Email VA)
    3.  **Google Generative AI API** (sometimes listed as "Vertex AI", ensure your account has access)

### 4. Configure the OAuth Consent Screen
This is the screen your users will see when they grant the application permission to access their Google data. **This step is mandatory.**
-   In the GCP Console, go to **APIs & Services > OAuth consent screen**.
-   Choose **"External"** for the user type and click **"Create"**.
-   Fill out the required information (App name, User support email, etc.).
-   On the "Scopes" page, click **"Add or Remove Scopes"**.
-   Add the following scopes:
    -   `https://www.googleapis.com/auth/drive.file`
    -   `https://www.googleapis.com/auth/gmail.readonly`
    -   `.../auth/userinfo.email` (should be there by default)
    -   `.../auth/userinfo.profile` (should be there by default)
    -   `openid` (should be there by default)
-   Save and continue through the rest of the setup. You can add test users if you wish, but for now, the main goal is to have the consent screen configured.

---

## Step 1: Push Project to a Git Repository

If you haven't already, ensure your entire project, including the `netlify/functions` directory and the `netlify.toml` file, is pushed to a repository on your chosen Git provider.

---

## Step 2: Create a New Site on Netlify

1.  Log in to your Netlify dashboard.
2.  Click the **"Add new site"** button and select **"Import an existing project"**.
3.  Connect to your Git provider (e.g., GitHub) and authorize Netlify to access your repositories.
4.  Select the repository containing your Maxwell Vantage project.

---

## Step 3: Configure Build Settings

Netlify should detect your build settings automatically from your project configuration. You should verify they are correct.

-   **Node.js Version**: The required Node.js version is specified in the `.nvmrc` file at the root of the project. Netlify will automatically detect and use this version (currently Node 20 LTS). No manual configuration is required in the Netlify UI.
-   **Base directory**: (leave blank unless your project is in a subdirectory)
-   **Build command**: `npm run build`
-   **Publish directory**: `dist`
-   **Functions directory**: `netlify/functions`

These settings tell Netlify how to build your React application and where to find your serverless function.

---

## Step 4: Configure Environment Variables (CRITICAL STEP)

This is the most important step for ensuring your application works and your API keys are secure.

1.  Before clicking "Deploy", navigate to the **"Site settings"** for your new site.
2.  Go to the **"Build & deploy"** section and then to the **"Environment"** sub-section.
3.  Click **"Edit variables"** and add the following keys one by one.

<br>

> [!CAUTION]
> **CRITICAL SECURITY WARNING**
> 
> You **MUST** configure your environment variables exactly as described below. A common error is incorrectly prefixing secret keys with `VITE_`.
> 
> - **Correct (Secure):** `AIRTABLE_API_K​EY`
> - **INCORRECT (Insecure):** `VITE_AIRTABLE_API_K​EY`
> 
> Prefixing a secret key like the Airtable or Gemini key with `VITE_` will **expose it to the public internet** and will **cause your build to fail**.

<br>

### 4.1 Server-Side Variables (Secrets)
These variables are only accessible by the backend functions and are kept secure. **DO NOT add a `VITE_` prefix to these.** Add each variable with its corresponding secret value from your service provider.

| Key | Description |
| :-- | :---------- |
| `API_K​EY` | Your Google Gemini API Key. |
| `AIRTABLE_API_K​EY` | Your Airtable Personal Access Token or API Key. |
| `AIRTABLE_BASE_I​D` | The ID of your Airtable base. |
| `PROJECTS_TABLE_NA​ME` | The exact name of the table for projects. |
| `PROSPECTS_TABLE_NA​ME`| The exact name of the table for prospects. |

### 4.2 Client-Side Variables (Public)
These variables are prefixed with `VITE_` and are safe to be exposed to the browser. Only Firebase keys should be in this section. Add each variable with its corresponding value from the `firebaseConfig` object you obtained in Step 0.

| Key | Description |
| :-- | :---------- |
| `VITE_FIREBASE_API_K​EY` | The API Key from your Firebase config. |
| `VITE_FIREBASE_AUTH_DOMA​IN` | The Auth Domain from your Firebase config. |
| `VITE_FIREBASE_PROJECT_I​D`| The Project ID from your Firebase config. |
| `VITE_FIREBASE_STORAGE_BUCK​ET`| The Storage Bucket from your Firebase config. |
| `VITE_FIREBASE_MESSAGING_SENDER_I​D` | The Messaging Sender ID from your Firebase config. |
| `VITE_FIREBASE_APP_I​D` | The App ID from your Firebase config. |

**Double-check that you have entered all variables correctly.** A mistake here is the most common cause of deployment failure.

---

## Step 5: Trigger Deployment

1.  Navigate to the **"Deploys"** tab for your site.
2.  Click the **"Trigger deploy"** dropdown and select **"Deploy site"**.
3.  Netlify will now pull your code from Git, install dependencies, run the build command, and deploy your site and serverless function.

---

## Step 6: Verify Deployment

1.  Once the deploy status is "Published", click the site URL provided by Netlify (e.g., `https://your-site-name.netlify.app`).
2.  **Test Authentication**: You should see the login screen. Try creating an account and logging in.
3.  **Test AI Features**:
    -   Navigate to the **Prospects Assistant**.
    -   Select a prospect and click **"Generate AI Analysis"**.
    -   If the analysis loads successfully, your serverless function is correctly configured with the `API_K​EY`. If you get an error, check the function logs in the Netlify dashboard.
4.  **Test Airtable Integration**:
    -   Navigate to the **Projects Assistant**.
    -   Verify that the "All Projects" table shows a green "Live from Airtable" status indicator. If it shows "Using Mock Data", re-check your `AIRTABLE_...` environment variables.

---

## Troubleshooting

-   **"Function not found" or 404 errors on AI/Airtable calls**: Ensure your build settings in Netlify correctly specify the functions directory (`netlify/functions`).
-   **AI features return errors**: Go to the **"Functions"** tab in your Netlify site dashboard and check the logs for your `gemini` function. The logs will often contain specific error messages from the AI or point to a missing `API_K​EY`.
-   **Airtable/Firebase not working**: This is almost always due to incorrect or missing environment variables. Go back to Step 4 and carefully verify each key and value. Remember to redeploy after any change to environment variables.