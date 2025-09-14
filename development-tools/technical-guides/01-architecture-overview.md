
# Technical Guide: Architecture Overview

This document provides a high-level overview of the Maxwell Vantage application's technical architecture.

## Core Philosophy

The application is designed as a modern, single-page application (SPA) built with a standard, production-ready toolchain. It prioritizes a fast development experience, type safety, and secure configuration management.

## Frontend Stack

-   **Framework**: **React 19** is the core library for building the user interface. The application is built with functional components and extensive use of React Hooks for state and lifecycle management.
-   **Build Tool**: **Vite** is used as the build tool and development server. It provides an extremely fast Hot Module Replacement (HMR) experience and bundles the code for optimized production deployments.
-   **Language**: **TypeScript** is used for all `.tsx` files to provide static typing, which improves code quality, readability, and developer experience.
-   **Styling**: **Tailwind CSS** is used for all styling. It is integrated into the Vite build process via PostCSS, allowing for rapid, utility-first UI development directly within the component files.
-   **Modularity**: The application is broken down into a logical `src` directory structure:
    -   `src/components/`: Contains the main views (`projects/`, `prospects/`, etc.) and reusable UI elements (`ui/`, `charts/`).
    -   `src/App.tsx`: The root component that handles routing and state management.
    -   `src/index.tsx`: The entry point that mounts the React application to the DOM.

## State Management

-   **Local State**: `useState` is the primary hook for managing component-level state.
-   **Global State**: For application-wide state (like the active view or notifications), state is "lifted up" to the root `App.tsx` component and passed down to child components via props.
-   **Persistent State**: `localStorage` is used for persisting user settings and configurations across sessions, such as the Onboarding Playbook templates and AI context settings.

## AI & API Integration

-   **SDK**: The official **`@google/genai` SDK** is used for all interactions with the Gemini API.
-   **API Key Management**: API keys and other secrets are managed securely via **environment variables**.
    -   Vite exposes these variables to the client-side code through the `import.meta.env` object.
    -   For local development, keys are stored in a `.env` file (which is git-ignored).
    -   For production, these variables must be configured in the hosting provider's settings.
    -   This approach ensures that secret keys are never hard-coded into the source code.
-   **Structured Output**: The application heavily relies on Gemini's ability to return structured JSON data by providing a `responseSchema` in the API call. This eliminates the need for fragile string parsing and makes the integration robust.
