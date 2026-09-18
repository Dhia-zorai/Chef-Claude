import { HfInference } from "@huggingface/inference";

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);

export async function getRecipeFromMistral(ingredientsArr, onChunk) {
  const ingredientsString = ingredientsArr.join(", ");
  try {
    const stream = hf.chatCompletionStream({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 384,
    });
    let recipe = "";
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      recipe += text;
      onChunk(recipe);
    }
    return recipe;
  } catch (err) {
    console.error("Failed to perform inference:", err);
    throw new Error("Could not generate a recipe. Please try again.");
  }
}
