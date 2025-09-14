/**
 * A client-side enum to replicate the schema types needed from the `@google/genai` package.
 * This allows us to define JSON schemas on the client without needing to import the
 * entire heavy `@google/genai` SDK into the browser bundle, improving performance and reducing load times.
 */
export enum SchemaType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}

/**
 * Defines the shape of the payload sent to our secure Netlify serverless function.
 */
interface GeminiRequestPayload {
    prompt: string;
    schema: object;
}

/**
 * Calls the secure Netlify serverless function to interact with the Gemini API.
 * This is the single, centralized point for all AI interactions from the frontend.
 * It abstracts the fetch logic and ensures the client-side code does not handle API keys.
 * 
 * @param payload - An object containing the prompt string and the JSON schema for the expected response.
 * @returns A promise that resolves to the parsed JSON object from the AI's response.
 * @throws An error if the network request fails or the AI returns an error.
 */
export const callGemini = async (payload: GeminiRequestPayload): Promise<any> => {
    // The endpoint path corresponds to the location of our serverless function.
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // Handle non-2xx responses from the serverless function.
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The AI assistant failed to respond.');
    }

    const result = await response.json();
    
    // The serverless function returns the AI's JSON string in a 'text' property.
    // We must parse this string on the client to get the actual JSON object.
    return JSON.parse(result.text);
};
