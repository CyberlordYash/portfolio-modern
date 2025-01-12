// app/api/hello/route.js

// Function that handles the API request
export async function GET(request) {
  return new Response(JSON.stringify({ message: "ok" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
