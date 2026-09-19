import React from "react";
import Recipe from "./Recipe";
import IngredientsList from "./ingredientsList";
import { getRecipeFromMistral } from "../ai";

/**
 * Challenge: Get a recipe from the AI!
 *
 * This will be a bit harder of a challenge that will require you
 * to think critically and synthesize the skills you've been
 * learning and practicing up to this point.
 *
 * Use the `getRecipeFromMistral` function so that when the user
 * clicks "Get a recipe", the text response from the AI is displayed
 * in the <ClaudeRecipe> component.
 *
 * For now, just have it render the raw markdown that the AI returns,
 * don't worry about making it look nice yet. (We're going to use a
 * package that will render the markdown for us soon.)
 */

export default function Main() {
  const [ingredients, setIngredients] = React.useState([
    "Chicken",
    "Couscous",
    "Tomatoes",
    "ground beef",
    "tomato paste",
  ]);

  const [recipe, setRecipe] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const recipeSection = React.useRef(null);

  async function getRecipe() {
    setRecipe("");
    setLoading(true);
    try {
      await getRecipeFromMistral(ingredients, setRecipe);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(formData) {
    const newIngredient = formData.get("ingredient");
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
  }

  React.useEffect(() => {
    if (recipe && recipeSection.current) {
      recipeSection.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

  return (
    <main>
      <form action={handleSubmit} className="addIng">
        <input
          type="text"
          placeholder="e.g. Couscous"
          aria-label="Add available Ingredients"
          name="ingredient"
          required
        />
        <button>+ Add Ingredient</button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          onClick={getRecipe}
        />
      )}

      {loading && <p aria-live="polite">Generating your recipe...</p>}
      {recipe && <Recipe recipe={recipe} />}
    </main>
  );
}
