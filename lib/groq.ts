export const askGroqAI = async (prompt: string) => {
  try {
    const res = await fetch("/api/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    console.log("🔥 GROQ RESPONSE:", data);

    return data.text || "";
  } catch (error) {
    console.log("❌ GROQ ERROR:", error);
    return "";
  }
};