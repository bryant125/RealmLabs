import { GoogleGenAI, Type } from "@google/genai";
import { AppRoadmap } from "../types";

export const generateAppRoadmap = async (idea: string): Promise<AppRoadmap> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("System API key not detected. Interface restricted.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `Design a professional mobile app development strategy for: "${idea}". 
      
      Instructions:
      1. Define a clear, unique App Name.
      2. Suggest a modern tech stack (e.g., React Native + Node.js + PostgreSQL).
      3. List 5 core innovative features.
      4. Provide a 4-step development timeline with standard FontAwesome icon names (e.g., fa-pencil-ruler, fa-code, fa-vial, fa-rocket).
      5. Evaluate project complexity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            concept: { type: Type.STRING },
            techStack: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            features: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING }
                },
                required: ["title", "description", "icon"]
              }
            },
            estimatedDifficulty: { 
              type: Type.STRING,
              enum: ["Easy", "Intermediate", "Advanced"]
            }
          },
          required: ["appName", "concept", "techStack", "features", "timeline", "estimatedDifficulty"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from neural engine.");

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as AppRoadmap;
  } catch (e) {
    console.error("Gemini Execution Error:", e);
    throw new Error(e instanceof Error ? e.message : "The AI returned an invalid project structure.");
  }
};