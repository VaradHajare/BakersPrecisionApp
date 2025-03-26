import { GEMINI_API_KEY } from '../constants/data';

// Sends a message to the Gemini API and updates the chat with the response
export const sendChatMessage = async (message, setChatMessages, apiKey, onComplete) => {
  console.log('Sending message:', message);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
  const systemInstruction = "You are a cooking assistant called Zestix. Respond to cooking related questions with the appropriate answers. For other questions, belonging to political or other origins, don't answer them. Although make sure to respond to general messages like 'hi', 'thank you', etc with polite responses. incase the user is done chatting with you, respond with a polite goodbye message.";
  const fullMessage = `${systemInstruction}\n\nUser question: ${message}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: fullMessage,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Chat API Response:', data);

    const botResponse = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I couldn’t process that.';
    setChatMessages((prev) => [...prev, { text: botResponse, sender: 'bot' }]);
    if (onComplete) onComplete(botResponse);
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    setChatMessages((prev) => [...prev, { text: 'Error: Could not get a response.', sender: 'bot' }]);
    if (onComplete) onComplete(null);
  }
};

// Fetch substitution from dataset, nutrition from Gemini
export const fetchSubstitutionAndNutrition = async (ingredient, grams, dataset, apiKey, setSubstitution, setNutrition) => {
  try {
    const density = dataset[ingredient]; // Density in grams per US cup
    if (!density || typeof density !== 'number') {
      setSubstitution('No substitution data available.');
      setNutrition('No nutrition data available.');
      return;
    }

    // Substitution from dataset (placeholder since not in current JSON, will use Gemini if expanded)
    const substitutionText = dataset[ingredient]?.substitution
      ? `Substitute: ${dataset[ingredient].substitution}`
      : await fetchSubstitutionFromGemini(ingredient, dataset, apiKey) || 'No substitution found in dataset.';
    setSubstitution(substitutionText);

    // Nutrition from Gemini with static "Approx. data" appended
    const rawNutritionText = await fetchNutritionFromGemini(ingredient, grams, apiKey) || 'Nutrition: No data available.';
    const nutritionText = `${rawNutritionText} - Approx. data`; // Add concise static message
    setNutrition(nutritionText);
  } catch (error) {
    console.error('Error in fetchSubstitutionAndNutrition:', error);
    setSubstitution('Error fetching substitution.');
    setNutrition('Error fetching nutrition.');
  }
};

// Fetch substitution from dataset via Gemini (ensures dataset-only results)
async function fetchSubstitutionFromGemini(ingredient, dataset, apiKey) {
  const ingredientsList = Object.keys(dataset).join(', ');
  const query = `From this list of ingredients: ${ingredientsList}, what is a suitable substitution for ${ingredient} in cooking? Provide only a substitution from the list or say "No substitution found in dataset."`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [{ parts: [{ text: query }] }],
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const result = data.candidates[0]?.content?.parts[0]?.text;
    return result && result !== 'No substitution found in dataset.' ? `Substitute: ${result}` : result;
  } catch (error) {
    console.error('Error fetching substitution from Gemini:', error);
    return null;
  }
}

// Fetch nutrition from Gemini with strict formatting
async function fetchNutritionFromGemini(ingredient, grams, apiKey) {
  const query = `What is the nutritional value of ${grams}g of ${ingredient}? Provide only calories, carbohydrates, proteins, and fats in this exact format: "Nutrition for ${grams}g: X cal, Y g carbs, Z g protein, W g fat". Do not include any additional text, disclaimers, or explanations.`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const requestBody = {
    contents: [{ parts: [{ text: query }] }],
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text;
  } catch (error) {
    console.error('Error fetching nutrition from Gemini:', error);
    return null;
  }
}