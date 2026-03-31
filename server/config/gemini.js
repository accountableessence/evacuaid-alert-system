import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

let aiClient = null;

if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("🧠 Google Gemini AI engine Hooked successfully.");
  } catch (error) {
    console.error("Gemini AI initialization failed:", error.message);
  }
} else {
  console.warn("🧠 Gemini AI key missing in server/.env. Automated response generation is DISABLED.");
}

export default aiClient;
