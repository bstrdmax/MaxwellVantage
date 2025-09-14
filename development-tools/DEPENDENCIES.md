# Dependency Reference

This document lists all external libraries, frameworks, and services used in the Maxwell Vantage application.

## Frontend Frameworks & Libraries

-   **React**: The core UI library for building the user interface.
-   **React DOM**: Serves as the entry point to the DOM and for rendering React components.
-   **Recharts**: A composable charting library built on React components, used for data visualization like the revenue chart.
-   **Firebase Client SDK**: Used for frontend user authentication and session management.

## APIs & External Services

-   **Firebase Authentication**: Provides the backend service for user sign-up, sign-in, and session management.
-   **Airtable API**: Used to fetch and update project and prospect data in real-time.
-   **Google Gemini API**: The core AI service used for all generative and analytical features. This is accessed securely via a serverless function, not directly from the client.
-   **Google Fonts**: Used to import the 'Inter' and 'Source Serif Pro' font families for a clean and modern typography.

## Development & Build Tools

-   **Vite**: A modern frontend build tool that provides an extremely fast development experience and bundles the application for production.
-   **TypeScript**: Used for static typing to improve code quality and maintainability.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
-   **@netlify/functions**: A dev dependency that provides type definitions and tooling for developing Netlify serverless functions.
-   **@google/genai**: The official Gemini SDK. It is a dependency of our serverless function and is **not** included in the client-side browser bundle.
