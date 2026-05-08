"use client";

import { useEffect, useRef, useState } from "react";
import { askGroqAI } from "@/lib/groq";
import RecipeAiCard from "@/components/ReceipeAICard";

type Message = {
  id: string;
  text: string;
  from: "user" | "ai";
};

export default function AIChatPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("Any 🌎");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Tell me ingredients & cuisine, I’ll cook recipes for you!",
      from: "ai",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const cuisines = [
    "Any 🌎",
    "Indian 🇮🇳",
    "Italian 🇮🇹",
    "Chinese 🇨🇳",
    "Mexican 🇲🇽",
    "Healthy 🥗",
  ];

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) {
      setMessages([
        {
          id: "1",
          text: "👋 Tell me ingredients & cuisine, I’ll cook recipes for you!",
          from: "ai",
        },
      ]);
      setInput("");
      setLoading(false);
    }
  }, [isOpen]);
  // auto scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const parseRecipes = (text: string) => {
    if (!text) return [];

    return text
      .split(/### Recipe/i) // 🔥 case-insensitive
      .map((t) => t.trim())
      .filter((t) => t.length > 10);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      from: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const prompt = `
You are a professional chef.

Create 3 recipes based on the ingredients.

IMPORTANT:
- If cuisine is "Any 🌎", choose the best matching global dishes
- Always return 3 recipes
- Keep format consistent

Ingredients: ${input}
Cuisine: ${selectedCuisine === "Any 🌎" ? "any global cuisine" : selectedCuisine}

FORMAT:

### Recipe
Name: 
Ingredients:
- 
- 
Steps:
1.
2.
Calories:

### Recipe
Name: 
Ingredients:
- 
- 
Steps:
1.
2.
Calories:

### Recipe
Name: 
Ingredients:
- 
- 
Steps:
1.
2.
Calories:
`;

      const aiText = await askGroqAI(prompt);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText || "No response",
        from: "ai",
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Error generating recipes",
          from: "ai",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <p className="font-bold text-lg">🍳 AI Chef</p>
          <p className="text-xs text-gray-500">
            Ingredients + cuisine → recipes
          </p>
        </div>

        <button onClick={onClose} className="text-xl">
          ✕
        </button>
      </div>

      {/* CUISINES */}
      <div className="px-3 py-2 border-b flex gap-2 overflow-x-auto">
        {cuisines.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCuisine(c)}
            className={`px-3 py-1 rounded-full whitespace-nowrap border text-sm ${
              selectedCuisine === c
                ? "bg-orange-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      >
        {messages.map((msg) => {
          const isUser = msg.from === "user";

          if (isUser) {
            return (
              <div
                key={msg.id}
                className="bg-orange-500 text-white p-3 rounded-xl ml-auto max-w-[85%]"
              >
                {msg.text}
              </div>
            );
          }

          return (
            <div key={msg.id}>
              {parseRecipes(msg.text).map((recipe, idx) => {
                const getValue = (key: string) => {
                  const match = recipe.match(
                    new RegExp(
                      `${key}:\\s*([\\s\\S]*?)(?=\\n[A-Za-z]+:|$)`,
                      "i",
                    ),
                  );
                  return match?.[1]?.trim() || "";
                };

                const name = getValue("Name");
                const ingredients = getValue("Ingredients");
                const steps = getValue("Steps");
                const calories = getValue("Calories");

                if (!name) return null;

                return (
                  <RecipeAiCard
                    key={idx}
                    name={name}
                    ingredients={ingredients}
                    steps={steps}
                    calories={calories}
                    imageQuery={name}
                  />
                );
              })}
            </div>
          );
        })}

        {loading && (
          <p className="text-gray-400 text-sm">🍳 Cooking recipes...</p>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. chicken, rice"
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
