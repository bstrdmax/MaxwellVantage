
# Technical Guide: Architecture Overview

This document provides a high-level overview of the Maxwell Vantage application's technical architecture, which consists of a modern frontend and a secure serverless backend.

## Core Philosophy

The application is designed for security, performance, and a superior developer experience. It separates the client-side presentation layer from the secure backend logic, ensuring that sensitive API keys are never exposed to the browser.

## Frontend Stack (Client-Side)

-   **Framework**: **React 19** is the core library for building the user interface. The application is built with functional components and extensive use of React Hooks for state and lifecycle management.
-   **Build Tool**: **Vite** is used as the build tool and development server. It provides an extremely fast Hot Module Replacement (HMR) experience and bundles the code for optimized production deployments.
-   **Language**: **TypeScript** is used for all `.tsx` files to provide static typing.
-   **Styling**: **Tailwind CSS** is used for all styling via PostCSS.
-   **Authentication**: **Firebase Authentication** is integrated on the client-side to manage user login and sessions. The configuration keys are exposed safely via `VITE_` prefixed environment variables.

## Backend (Serverless)

-   **Platform**: **Netlify Functions** written in TypeScript.
-   **Architecture**: A single serverless function (`/netlify/functions/gemini.ts`) serves as a secure, lightweight backend.
-   **Purpose**: This function acts as a **secure proxy**. The React frontend sends requests to this function, which then securely attaches the secret Gemini API key and forwards the request to the Google Gemini API. This is the core of the application's security model.

## AI & API Integration

-   **Frontend-to-Backend Communication**: All AI-related requests from the React app are channeled through a single utility function: `src/utils/ai.ts -> callGemini()`. This function makes a `fetch` request to our Netlify Function endpoint (`/.netlify/functions/gemini`).
-   **Backend AI SDK**: The official **`@google/genai` SDK** is used exclusively within the serverless function on the backend. It is **not** part of the frontend browser bundle.
-   **API Key Management**: This is a critical aspect of the architecture:
    -   The **Google Gemini API Key** is stored as a standard environment variable (`API_KEY`) on Netlify. It is only accessible by the serverless function and is **never** exposed to the client.
    -   Client-side keys for services like **Firebase and Airtable** are managed via `VITE_` prefixed environment variables, which Vite safely embeds during the build process.
-   **Structured Output**: The serverless function leverages Gemini's JSON mode by providing a `responseSchema` in the API call. It then passes the resulting JSON string back to the client, ensuring robust and predictable data transfer.
