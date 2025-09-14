import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent } from "@netlify/functions";

// This check is crucial for server-side environment variables.
// It ensures that the function will fail to build if the API key is not provided in the Netlify UI,
// preventing accidental deployment of a non-functional service.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set on the server.");
}

// Initialize the client once per function instance (cold start).
// This is more efficient than creating a new client on every invocation.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * The main handler for the Netlify serverless function.
 * This function acts as a secure proxy between the frontend application and the Google Gemini API.
 * It receives a prompt and a schema from the client, adds the secret API key on the server-side,
 * calls the Gemini API, and then returns the response to the client.
 */
const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests to this endpoint.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the request body sent from the client-side `callGemini` utility.
    const { prompt, schema } = JSON.parse(event.body || '{}');

    // Validate that the required parameters are present.
    if (!prompt || !schema) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing prompt or schema in request body.' })
      };
    }

    // Securely call the Gemini API using the server-side initialized client.
    // The API key is never exposed to the client.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema // The schema is passed through from the client.
        }
    });

    // The Gemini API, when in JSON mode, returns a `text` property containing the JSON as a string.
    // We wrap this in our own object to provide a consistent response structure to the client.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: response.text }),
    };
  } catch (error) {
    // Log the detailed error on the server for debugging purposes.
    console.error("Error in Gemini function:", error);
    
    // Return a generic error message to the client.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }),
    };
  }
};

export { handler };
