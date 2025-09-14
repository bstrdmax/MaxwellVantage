# Technical Guide: Gemini API Integration

This document details the secure, serverless workflow used by Maxwell Vantage to interact with the Google Gemini API.

## Core Principle: No Client-Side API Keys

To ensure maximum security, the Google Gemini API key and the `@google/genai` SDK are **never** exposed to the user's browser. All communication with the Gemini API is proxied through a secure backend serverless function.

## The Integration Workflow

The process involves three main parts: The React Component (Client), the Utility Function (Client), and the Serverless Function (Backend).

### 1. The React Component (e.g., `ProspectsView.tsx`)

A component that needs AI functionality constructs a `prompt` and a `schema` describing the desired JSON output. It does **not** initialize or interact with the `@google/genai` SDK directly.

-   **Goal**: To get a structured analysis of a sales prospect.
-   **Action**: It calls the `callGemini` utility function, passing the prompt and schema.

**Example Code Snippet from a Component:**

```typescript
import { callGemini, SchemaType } from '../../utils/ai';

const handleGenerateAnalysis = async (prospectId: string) => {
    setIsAnalyzing(true);
    try {
        const prompt = `System Context: ... Prospect Info: ... Based on this, generate an analysis.`;
        
        const schema = {
            type: SchemaType.OBJECT,
            properties: {
                analysis: { type: SchemaType.STRING },
                strategy: { type: SchemaType.STRING },
                talkingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                whyFit: { type: SchemaType.STRING }
            },
            required: ["analysis", "strategy", "talkingPoints", "whyFit"]
        };

        const analysisResult = await callGemini({ prompt, schema });
        // Update component state with analysisResult
    } catch (error) {
        console.error("Error generating analysis:", error);
    } finally {
        setIsAnalyzing(false);
    }
};
```
*Notice the use of the local `SchemaType` enum, which avoids needing the full `@google/genai` package on the client.*

---

### 2. The Utility Function (`src/utils/ai.ts`)

This client-side helper function acts as the single point of contact for the backend.

-   **Goal**: To abstract away the `fetch` call to the serverless function.
-   **Action**:
    1.  It takes the `prompt` and `schema` as an argument.
    2.  It sends a `POST` request to the serverless endpoint (`/.netlify/functions/gemini`).
    3.  It handles the response, checks for errors, and parses the JSON result before returning it to the calling component.

**Code Snippet from `ai.ts`:**

```typescript
export const callGemini = async (payload: GeminiRequestPayload): Promise<any> => {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // ... error handling ...
    }

    const result = await response.json();
    // The serverless function returns the AI's JSON string in a 'text' property.
    return JSON.parse(result.text);
};
```

---

### 3. The Serverless Function (`netlify/functions/gemini.ts`)

This backend function is the only part of the system that holds the Gemini API key and uses the `@google/genai` SDK.

-   **Goal**: To securely process requests from the frontend and call the Gemini API.
-   **Action**:
    1.  It receives the `POST` request from `callGemini`.
    2.  It initializes the `GoogleGenAI` client using the `API_KEY` from its secure environment variables.
    3.  It calls `ai.models.generateContent` using the prompt and schema from the request body.
    4.  It takes the JSON string from the Gemini response (`response.text`) and sends it back to the frontend.

**Code Snippet from `gemini.ts`:**
```typescript
import { GoogleGenAI } from "@google/genai";
// ...
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // ...
    const { prompt, schema } = JSON.parse(event.body || '{}');
    // ...
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ text: response.text }), // Return the raw JSON string
    };
};
```
This architecture ensures a clean separation of concerns and robust security for all AI-powered features.
