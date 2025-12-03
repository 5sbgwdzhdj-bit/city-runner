import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Analyzes raw user input and returns a structured suggestion
export const analyzeOrderRequest = async (userInput: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key missing. Cannot analyze.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI assistant for a delivery/errand app. 
      Analyze the user's raw request: "${userInput}".
      
      Return a concise, polite summary that a delivery rider would find useful. 
      Include implied urgency, item type, or special handling if detected.
      Limit to 150 characters. Language: Simplified Chinese.`,
    });
    
    return response.text || "无法分析请求，请重试。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "智能分析服务暂时不可用。";
  }
};

export const suggestTags = async (userInput: string): Promise<string[]> => {
    if (!process.env.API_KEY) return ['普通单'];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this errand request: "${userInput}", suggest 3 short tags (e.g., "Urgent", "Fragile", "Food"). Return ONLY a JSON array of strings in Simplified Chinese. Example: ["加急", "易碎"].`,
            config: {
                responseMimeType: "application/json"
            }
        });
        const text = response.text;
        if(text) return JSON.parse(text);
        return ['日常'];
    } catch (e) {
        return ['普通'];
    }
}