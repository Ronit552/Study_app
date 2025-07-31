
import { GoogleGenAI } from "@google/genai";
import { FALLBACK_QUOTES } from '../constants';

const getApiKey = (): string | undefined => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("API_KEY environment variable not found. Using fallback quotes.");
}

export const getMotivationalQuote = async (): Promise<string> => {
    if (!ai) {
        return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a short, powerful motivational quote for someone studying or coding. Keep it under 20 words.",
            config: {
              temperature: 0.9,
              topK: 1,
              topP: 1,
            }
        });
        
        const text = response.text.trim().replace(/\"/g, "");
        return text || FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    } catch (error) {
        console.error("Error fetching quote from Gemini API:", error);
        return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    }
};
