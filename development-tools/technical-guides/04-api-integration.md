# Technical Guide: Gemini API Integration

This document details how the Maxwell Vantage application utilizes the `@google/genai` SDK to power its intelligent features. All API calls are client-side.

## Initialization

A single `GoogleGenAI` instance is initialized where needed, using the API key from the environment.

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
```

## Core Method: `ai.models.generateContent`

This is the primary method used for all text-based generation tasks. The key to the application's stability is its reliance on Gemini's JSON mode, which is enabled by providing `responseMimeType: "application/json"` and a `responseSchema`.

---

### Feature: Prospect Analysis (`ProspectsView.tsx`)

-   **Goal**: To generate a structured analysis of a sales prospect.
-   **Prompt**: The prompt is constructed by combining the high-level **System Context** (persona, strategy) with the specific details of the selected prospect.
-   **Configuration**:
    -   `model`: "gemini-2.5-flash"
    -   `responseMimeType`: "application/json"
    -   `responseSchema`: A `Type.OBJECT` schema is defined to force the model to return a JSON object with specific keys: `analysis`, `strategy`, `talkingPoints` (an array of strings), and `whyFit`.

-   **Example Code Snippet**:
    ```typescript
    import { GoogleGenAI, Type } from "@google/genai";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `System Context: ... Prospect Info: ... Based on this, generate an analysis.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: { type: Type.STRING },
                    strategy: { type: Type.STRING },
                    talkingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    whyFit: { type: Type.STRING }
                },
                required: ["analysis", "strategy", "talkingPoints", "whyFit"]
            }
        }
    });

    const analysisResult = JSON.parse(response.text);
    // Update component state with analysisResult
    ```

---

### Feature: Content Generation (`ContentAssistantView.tsx`)

-   **Goal**: To generate multiple types of content (blog, social, newsletter) from a single topic.
-   **Prompt**: The prompt combines the **AI Content Brain** configuration (voice, guidance, examples) with the user-provided topic.
-   **Configuration**:
    -   `model`: "gemini-2.5-flash"
    -   `responseMimeType`: "application/json"
    -   `responseSchema`: A nested JSON schema is used. The top-level object has keys `blogPost`, `linkedInPost`, and `newsletter`. Each of these keys corresponds to an object with `title` and `body` properties.

-   **Example Code Snippet**:
    ```typescript
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Context: ... Topic: "${topic}" ... Generate 3 pieces of content.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    blogPost:   { type: Type.OBJECT, properties: { title: { type: Type.STRING }, body: { type: Type.STRING } } },
                    linkedInPost: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, body: { type: Type.STRING } } },
                    newsletter: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, body: { type: Type.STRING } } }
                },
                required: ["blogPost", "linkedInPost", "newsletter"]
            }
        }
    });

    const result = JSON.parse(response.text);
    // Create new content items from result.blogPost, etc.
    ```

---

### Feature: Website UX Analysis (`COOAssistantView.tsx`)

-   **Goal**: To analyze a website and provide structured UX/CRO recommendations.
-   **Prompt**: A persona-driven prompt instructs the AI to act as a world-class expert and analyze a given URL, returning three specific improvements.
-   **Configuration**:
    -   `model`: "gemini-2.5-flash"
    -   `responseMimeType`: "application/json"
    -   `responseSchema`: The schema expects an object with a single key, `improvements`, which is an array of objects. Each object in the array must have an `area`, `finding`, and `recommendation`.

-   **Example Code Snippet**:
    ```typescript
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `As a UX expert, analyze "${analysisUrl}" and provide 3 improvements.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    improvements: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                area: { type: Type.STRING },
                                finding: { type: Type.STRING },
                                recommendation: { type: Type.STRING }
                            },
                            required: ["area", "finding", "recommendation"]
                        }
                    }
                },
                required: ["improvements"]
            }
        }
    });

    const jsonResponse = JSON.parse(response.text);
    setAnalysisResults(jsonResponse.improvements);
    ```
