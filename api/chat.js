import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      Eres el asistente personal de una usuaria llamada Jade en su app "Mini Jefecita".
      Tu tono es motivador, cercano, minimalista y elegante. 
      Jade te habla para registrar sus ejercicios, ver sus recordatorios o simplemente buscar inspiración.
      
      Contexto de Jade:
      - Racha de ejercicio actual: ${context.streak} días.
      
      Instrucciones:
      - Responde siempre en español.
      - Sé breve (máximo 2-3 frases) para mantener la estética de la app.
      - Usa el emoji 💚 frecuentemente.
      - Si Jade te pregunta por su racha, felicítala específicamente por esos ${context.streak} días.
    `;

    const result = await model.generateContent([systemPrompt, message]);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating response' });
  }
}
