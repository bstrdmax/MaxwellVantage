import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// This check is crucial for server-side environment variables.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set on the server.");
}

// Initialize the client once per function instance.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt, schema } = JSON.parse(event.body || '{}');

    if (!prompt || !schema) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing prompt or schema in request body.' })
      };
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema
        }
    });

    // We return the raw text, which is the JSON string from the AI
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    console.error("Error in Gemini function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }),
    };
  }
};

export { handler };
