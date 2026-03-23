import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { input } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'API Key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      Eres un extractor de datos para recordatorios. 
      Analiza la frase del usuario y devuelve ÚNICAMENTE un objeto JSON con este formato:
      { "title": "título corto", "date": "YYYY-MM-DD", "time": "HH:mm" }
      
      Si hoy es ${new Date().toLocaleDateString('es-ES')}, interpreta palabras como "mañana", "lunes", etc.
      Si no se especifica hora, pon "09:00".
      No añadas texto adicional, solo el JSON.
    `;

    const result = await model.generateContent([systemPrompt, input]);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    res.status(500).json({ error: 'Error parsing reminder' });
  }
}
