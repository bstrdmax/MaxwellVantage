// A client-side enum to replicate the schema types needed from the @google/genai package.
// This allows us to remove the full SDK from the browser bundle.
export enum SchemaType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
}

interface GeminiRequestPayload {
    prompt: string;
    schema: object;
}

/**
 * Calls the secure Netlify serverless function to interact with the Gemini API.
 * @param payload - An object containing the prompt and the JSON schema for the expected response.
 * @returns The parsed JSON object from the AI's response.
 */
export const callGemini = async (payload: GeminiRequestPayload): Promise<any> => {
    const response = await fetch('/.netlify/functions/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The AI assistant failed to respond.');
    }

    const result = await response.json();
    // The serverless function returns the AI's JSON string in a 'text' property.
    return JSON.parse(result.text);
};
