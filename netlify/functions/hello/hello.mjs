export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify({ message: "Hello from Netlify Function!" }),
  };
}