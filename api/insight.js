import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      Eres el coach motivacional de Jade. 
      Genera UNA SOLA FRASE de inspiración (máximo 12-15 palabras) basada en su estado:
      - Racha de ejercicio: ${context.streak} días.
      - Avisos pendientes: ${context.remindersCount}.
      - Hora local: ${new Date().toLocaleTimeString('es-ES')}.
      
      Reglas: Sé elegante, minimalista y usa el emoji 💚. Evita clichés genéricos.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text().trim();

    res.status(200).json({ insight: text });
  } catch (error) {
    res.status(500).json({ error: 'Error generating insight' });
  }
}
