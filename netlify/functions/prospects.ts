
import type { Handler, HandlerEvent } from "@netlify/functions";

/**
 * The handler for fetching prospect data from Airtable securely.
 * It uses server-side environment variables to make the API call.
 */
const handler: Handler = async (event: HandlerEvent) => {
  // Only allow GET requests for fetching prospects.
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, PROSPECTS_TABLE_NAME } = process.env;

  // Check for the presence of necessary environment variables.
  // NOTE: We use `process.env` here because this is secure server-side code.
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !PROSPECTS_TABLE_NAME) {
    console.error("Airtable environment variables for prospects not set.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error: Missing Airtable prospect credentials." }),
    };
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PROSPECTS_TABLE_NAME}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Airtable API Error: ${response.status} ${errorBody}`);
      throw new Error(`Failed to fetch from Airtable. Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.records),
    };
  } catch (error) {
    console.error("Error in prospects function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred.' }),
    };
  }
};

export { handler };