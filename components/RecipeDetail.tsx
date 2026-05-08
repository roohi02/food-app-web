"use client";

import { useEffect, useState } from "react";
import { getRecipeById } from "@/lib/api";

export default function RecipeDetail({ id }: { id: string }) {
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const data = await getRecipeById(id);
      console.log(data);
      setRecipe(data);
    };

    load();
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(
        `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`,
      );
    }
  }

  const calories = Math.floor(Math.random() * 400) + 200;
  const time = Math.floor(Math.random() * 40) + 10;
  const difficulty = ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img
        src={recipe.strMealThumb}
        className="w-full h-64 object-contain rounded-xl"
      />

      <h1 className="text-2xl font-bold mt-4">{recipe.strMeal}</h1>

      <div className="flex gap-4 mt-3 text-sm">
        <span>🔥 {calories} cal</span>
        <span>⏱️ {time} mins</span>
        <span>📊 {difficulty}</span>
      </div>

      <h2 className="mt-6 font-semibold text-lg">🧾 Ingredients</h2>
      <ul className="list-disc ml-5 mt-2">
        {ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>

      <h2 className="mt-6 font-semibold text-lg">👨‍🍳 Steps</h2>
      <p className="mt-2 whitespace-pre-line">{recipe.strInstructions}</p>

      {recipe.strYoutube && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg">🎥 Watch</h2>
          <iframe
            className="w-full h-64 mt-2 rounded-xl"
            src={recipe.strYoutube.replace("watch?v=", "embed/")}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
