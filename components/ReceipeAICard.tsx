"use client";

import Image from "next/image";
import React from "react";
type Props = {
  name: string;
  ingredients: string;
  steps: string;
  calories: string;
  imageQuery?: string;
};

function RecipeAiCard({
  name,
  ingredients,
  steps,
  calories,
  imageQuery,
}: Props) {
  // 🔥 safer fallback images (NO unsplash search URLs)

  const fallbackImages = [
    "https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg", // Pizza
    "https://www.themealdb.com/images/media/meals/1548772327.jpg", // Chicken
    "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg", // Pasta
    "https://www.themealdb.com/images/media/meals/1529444830.jpg", // Curry
    "https://www.themealdb.com/images/media/meals/1529446352.jpg", // Beef
    "https://www.themealdb.com/images/media/meals/1525873040.jpg", // Salad
    "https://www.themealdb.com/images/media/meals/1549542994.jpg", // Rice dish
    "https://www.themealdb.com/images/media/meals/1520084413.jpg", // Soup
    "https://www.themealdb.com/images/media/meals/1550440197.jpg", // Seafood
    "https://www.themealdb.com/images/media/meals/1530060603.jpg", // Breakfast
    "https://www.themealdb.com/images/media/meals/1529446137.jpg", // Sandwich
    "https://www.themealdb.com/images/media/meals/1511803146.jpg", // Dessert
  ];

  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const imageUrl = fallbackImages[index % fallbackImages.length];

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4 border border-gray-100">
      {/* IMAGE */}
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-lg font-bold">🍽️ {name}</h3>

        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold">🧾 Ingredients:</span> {ingredients}
        </p>

        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold">👨‍🍳 Steps:</span> {steps}
        </p>

        <p className="text-sm text-orange-500 mt-2 font-semibold">
          🔥 {calories}
        </p>
      </div>
    </div>
  );
}
export default React.memo(RecipeAiCard);
