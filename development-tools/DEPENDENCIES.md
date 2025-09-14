
# Dependency Reference

This document lists all external libraries, frameworks, and services used in the Maxwell Vantage application.

## Frontend Frameworks & Libraries

-   **React**: The core UI library for building the user interface.
-   **React DOM**: Serves as the entry point to the DOM and for rendering React components.
-   **Recharts**: A composable charting library built on React components, used for data visualization like the revenue chart.

## APIs & External Services

-   **Google Gemini API (`@google/genai`)**: The official SDK for interacting with Google's Gemini family of models. This is the core of all AI-powered features in the application.
-   **Google Fonts**: Used to import the 'Inter' and 'Source Serif Pro' font families for a clean and modern typography.
-   **Picsum Photos**: Used for placeholder avatar images.

## Development & Build Tools

-   **Vite**: A modern frontend build tool that provides an extremely fast development experience and bundles the application for production.
-   **TypeScript**: Used for static typing to improve code quality and maintainability.
-   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces. It is integrated into the build process via PostCSS.
-   **PostCSS**: A tool for transforming CSS with JavaScript plugins, used here for Tailwind CSS and Autoprefixer.
-   **ESLint / Prettier**: (Recommended for future setup) Linters and code formatters to enforce code style and catch errors early.
