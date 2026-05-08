"use client";

import { useEffect, useState } from "react";
import { getCategories, getRecipes, searchRecipes } from "@/lib/api";
import AIChatPanel from "@/components/AIChatPanel";
import { useRouter } from "next/navigation";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showHint, setShowHint] = useState(true);
  // Load categories
  const router = useRouter();
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        setLoading(true);

        const data = await searchRecipes(query);
        setRecipes(data);

        setLoading(false);
      } else {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);
  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);

      if (data?.length) {
        setActiveCategory(data[0].strCategory);
      }
    };

    loadCategories();
  }, []);

  // Load recipes when category changes
  useEffect(() => {
    if (!activeCategory) return;

    const loadRecipes = async () => {
      setLoading(true);
      const data = await getRecipes(activeCategory);
      setRecipes(data || []);
      setLoading(false);
    };

    loadRecipes();
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* HEADER */}
        <h1 className="text-3xl font-bold">🍽️ Food App</h1>
        <p className="text-gray-500 mt-1">
          Choose a category and explore recipes
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes (pizza, pasta...)"
          className="w-full mt-5 bg-white border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* CATEGORIES */}
        <div className="mt-3">
          <div className="overflow-x-auto">
            <div className="flex gap-2 w-max pb-2 pr-4">
              {categories.map((cat) => (
                <button
                  key={cat.idCategory}
                  onClick={() => setActiveCategory(cat.strCategory)}
                  className={`px-4 py-2 rounded-full border whitespace-nowrap flex-shrink-0 ${
                    activeCategory === cat.strCategory
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {cat.strCategory}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && <p className="text-gray-400 mt-4">Loading recipes...</p>}
        {!loading && recipes.length === 0 && (
          <p className="text-gray-400 mt-6 text-center">No recipes found 🍽️</p>
        )}

        {/* RECIPES */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {recipes.map((r) => (
            <div
              onClick={() => router.push(`/recipe/${r.idMeal}`)}
              key={r.idMeal}
              className="bg-white rounded-xl p-3 shadow hover:shadow-md transition"
            >
              <img src={r.strMealThumb} className="rounded-lg mb-2" />
              <p className="font-medium">{r.strMeal}</p>
            </div>
          ))}
        </div>
      </div>
      <AIChatPanel isOpen={showChat} onClose={() => setShowChat(false)} />
      {!showChat && (
        <div className="fixed bottom-6 right-6 z-50 group">
          {/* Tooltip */}
          {!showHint && (
            <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition">
              Ask AI for recipes 🍳
            </div>
          )}

          {/* Button */}
          <button
            onClick={() => setShowChat(true)}
            className="w-14 h-14 rounded-full bg-orange-500 text-white shadow-lg"
          >
            💬
          </button>
          {showHint && !showChat && (
            <div className="fixed bottom-24 right-6 bg-white p-4 rounded-xl shadow-xl w-56 text-sm z-50">
              <p className="font-semibold mb-1">🍳 AI Chef</p>
              <p className="text-gray-600">
                Enter ingredients and get instant recipes!
              </p>

              <button
                onClick={() => setShowHint(false)}
                className="text-orange-500 mt-2 text-xs font-medium"
              >
                Got it
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
