export async function getCategories() {
  const res = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const data = await res.json();
  return data.categories;
}

export async function getRecipes(category: string) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const data = await res.json();
  return data.meals;
}

export async function searchRecipes(query: string) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const data = await res.json();
  return data.meals || [];
}
export const getRecipeById = async (id: string) => {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await res.json();

    return data?.meals?.[0] || null;
  } catch (error) {
    console.log("API ERROR:", error);
    return null;
  }
};