# Maxwell Vantage - Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 2024-08-02
**Status:** Live

---

## 1.0 Overview & Vision

### 1.1 Vision
Maxwell Vantage is a strategic command center designed to empower boutique service-based businesses, starting with Maxwell Risk Group, by automating and analyzing key operational workflows. By integrating cutting-edge AI, it transforms raw data from disparate sources (projects, leads, content, email) into actionable intelligence, freeing up key personnel to focus on high-value strategic tasks.

### 1.2 Problem Statement
Key operators in growing service businesses are often bogged down by repetitive administrative tasks (e.g., client onboarding), time-consuming analysis (e.g., sales prospecting), and the cognitive load of managing multiple workflows. This creates operational bottlenecks, slows growth, and prevents leaders from focusing on strategy.

### 1.3 Solution
Maxwell Vantage provides a unified dashboard with specialized "Assistants" that use the Google Gemini API to automate tasks and generate strategic insights. It serves as a digital Chief Operating Officer, providing leverage and clarity across the business.

---

## 2.0 Target Audience

-   **Primary User:** The COO, Head of Operations, or technically-minded CEO of a small-to-medium-sized service business (10-100 employees).
-   **Secondary Users:** Project Managers, Sales Development Representatives (SDRs), Content Marketers.

---

## 3.0 Core Features & User Stories

### 3.1 Dashboard
-   **Description:** A high-level overview of business health.
-   **User Story:** "As a COO, I want to see a snapshot of all key business metrics in one place when I log in, so I can quickly assess the health of the company and identify immediate priorities."
-   **Components:**
    -   KPI Stat Cards (Active Projects, Risk, Health, Prospects)
    -   Revenue Forecasting Chart
    -   Project Health Summary
    -   Recent Activity Feed

### 3.2 Projects Assistant
-   **Description:** Streamlines project management with a focus on client onboarding.
-   **User Story:** "As a Project Manager, I want to automate the creation of kick-off documents and welcome emails for new clients, so I can reduce manual errors and onboard clients faster."
-   **Components:**
    -   **Onboarding Playbook:** Configurable templates for documents and emails with AI-assist for drafting.
    -   **Onboarding Queue:** Lists projects with "Onboarding" status.
    -   **Automated Onboarding Flow:** A modal-based review and execution process.
    -   **Deadline Alerts:** Flags overdue or upcoming project deadlines.
    -   **All Projects View:** A live-synced table of all projects from a data source (Airtable).

### 3.3 Prospects Assistant (Intelligence Hub)
-   **Description:** An AI-powered tool for lead generation and strategic sales analysis.
-   **User Story:** "As an SDR, I want the AI to analyze a new prospect based on our ideal client profile and give me specific talking points, so I can conduct more effective and personalized outreach."
-   **Components:**
    -   **System Context:** The "brain" for the AI, defining persona, values, and strategy.
    -   **AI Prospector:** A tool to find new leads based on natural language queries, with an AI suggestion feature.
    -   **Prospect List & Analysis View:** A pipeline view with detailed, AI-generated analysis for each prospect (Analysis, Strategy, Talking Points, Fit).

### 3.4 Content Assistant (Workspace)
-   **Description:** An integrated workspace for content ideation, AI-powered drafting, and workflow management.
-   **User Story:** "As a Content Marketer, I want to provide a topic and have the AI draft a blog post, a LinkedIn update, and a newsletter snippet in our brand voice, so I can accelerate our content production lifecycle."
-   **Components:**
    -   **Content Calendar:** Visual overview of the content schedule.
    -   **Idea Hub:** Aggregates ideas from manual input and connected sources (Google Drive).
    -   **AI Content Brain:** Configurable context for the AI's writing (voice, guidance, examples).
    -   **Content Generator:** Creates multiple content formats from a single topic.
    -   **Workflow Management:** A kanban-like system to move content from Draft > In Drive > Approved.

### 3.5 COO Assistant
-   **Description:** Provides high-level strategic analysis and risk assessment.
-   **User Story:** "As a CEO, I want the AI to analyze our website's user experience and give me actionable recommendations for improving conversions, so I can make data-driven decisions about our marketing assets."
-   **Components:**
    -   **Top Priority Focus:** Highlights the most critical issue in the business.
    -   **Website Conversion Analysis:** AI-powered UX/CRO audit of any URL.
    -   **Key Insights Feed:** AI-generated recommendations for different business areas.
    -   **Risk Assessment & Goal Tracker:** Summarizes risks and tracks progress against strategic goals.

### 3.6 Authentication & Settings
-   **Description:** User management and system configuration.
-   **User Story:** "As an administrator, I want to securely log in and manage integrations, so I can control access and ensure the system has the data it needs."
-   **Components:**
    -   Email/Password authentication via Firebase.
    -   Integrations Hub to view connection status (Airtable, Google).
    -   Account management and settings panels.

---

## 4.0 Technical Architecture & Implementation

### 4.1 Frontend
-   **Framework:** React 19 (Vite build tool)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **State Management:** React Hooks (`useState`, `useEffect`) and Context API (`AuthContext`).
-   **Persistence:** `localStorage` is used for user-specific settings like AI context and playbook templates.

### 4.2 Backend (Serverless)
-   **Platform:** Netlify Functions
-   **Architecture:** A single serverless function (`/netlify/functions/gemini.ts`) acts as a secure proxy between the frontend and the Google Gemini API.
-   **Security:** The Google Gemini API key is stored exclusively as a server-side environment variable on Netlify, never exposing it to the browser.

### 4.3 AI Integration
-   **SDK:** `@google/genai` (used server-side within the Netlify function).
-   **Model:** `gemini-2.5-flash` is used for all text and JSON-based tasks due to its balance of speed and capability.
-   **Core Technique:** The application heavily relies on Gemini's JSON mode by providing a strict `responseSchema`. This ensures reliable, structured data return from the API, eliminating fragile string parsing on the client.

### 4.4 Authentication
-   **Service:** Firebase Authentication
-   **Method:** Email & Password. The system is architected to be easily expandable to other providers (e.g., Google Sign-In).

---

## 5.0 Design & UX Principles

-   **Clarity over Clutter:** The UI prioritizes showing the most important information first, with a clean, uncluttered layout.
-   **Action-Oriented:** Every view is designed around a core set of actions the user needs to take. Buttons and interactive elements are prominent.
-   **AI as an Assistant:** The AI's role is to augment, not replace, the user. It provides drafts, suggestions, and analysis, but the user always has the final review and execution control.
-   **Responsive & Accessible:** The application is designed to be usable across desktop devices and adheres to basic accessibility standards.

---

## 6.0 Assumptions & Dependencies

-   The user has active accounts for Google (Workspace), Airtable, and Firebase.
-   The user is comfortable managing API keys and environment variables in a deployment platform like Netlify.
-   The application is designed for internal use within a single organization, not as a multi-tenant SaaS.

---

## 7.0 Future Roadmap

-   **Real-time Collaboration:** Integrate features for multiple users to comment on or edit generated content.
-   **Deeper Airtable Integration:** Implement two-way data sync and allow for more complex automations to be triggered from within Vantage.
-   **Voice-to-Text Knowledge:** Activate the microphone feature to allow users to add to the knowledge base via voice notes.
-   **Advanced Analytics:** Create a dedicated analytics dashboard with more granular reporting on AI usage, content performance, and sales funnel velocity.
-   **Multi-Modal AI:** Integrate image generation for social media content and image analysis for website reviews.
