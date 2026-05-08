export async function POST(req: Request) {
  const { prompt } = await req.json();
const API_KEY = process.env.GROQ_API_KEY;
  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful food chef. Give recipes with calories and ingredients.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  const data = await res.json();

  return Response.json({
    text: data?.choices?.[0]?.message?.content || "",
  });
}