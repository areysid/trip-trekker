// Import the required libraries
//const { GoogleGenAI } = require('@google/genai');
import {
    GoogleGenerativeAI,
  } from "@google/generative-ai";


const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Use the appropriate model here
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export async function getChatSession() {
  const chat = await model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [{ text: `AI Travel planner\n` }],
      },
      {
        role: 'model',
        parts: [{ text: `An AI travel planner could offer a range of features, depending on its sophistication...` }],
      },
    ],
  });



  return chat;
}