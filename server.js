import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI Key .env içinden alınacak
const OPENAI_KEY = process.env.OPENAI_KEY;

// ---- OpenAI API Fonksiyonu ----
async function askOpenAI(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Otomotiv arıza kod uzmanısın. Daima JSON formatında yanıt ver." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 700
    })
  });

  return await response.json();
}

// ====== /ask ENDPOINT (FRONTEND BURAYA İSTEKT ATIYOR) ======
app.post("/ask", async (req, res) => {
  const { brand, model, year, code, type } = req.body;

  if (!code) return res.json({ error: "Arıza kodu boş olamaz." });

  const base = `Araç: ${brand} ${model} ${year}\nArıza Kodu: ${code}\nYanıtı JSON formatında ver.`;

  let prompt = "";

  if (type === "desc") {
    prompt = base + `
Sadece şu JSON formatını üret:
{
  "aciklama": "...",
  "nedenler": ["...", "..."]
}`;
  }

  if (type === "fix") {
    prompt = base + `
Sadece şu JSON formatını üret:
{
  "cozum": ["1. ...", "2. ..."]
}`;
  }

  if (type === "video") {
    prompt = base + `
Gerçek video / kaynak öner. Sahte link verme!
Sadece şu JSON formatını üret:
{
  "videolar": [
    {
      "title": "video başlığı",
      "url": "https://youtube.com/... veya boş",
      "source": "YouTube | Web | Forum"
    }
  ]
}`;
  }

  try {
    const result = await askOpenAI(prompt);

    const content = result?.choices?.[0]?.message?.content;

    try {
      const json = JSON.parse(content);
      res.json(json);
    } catch {
      res.json({ error: "JSON parse hatası", raw: content });
    }

  } catch (err) {
    res.json({ error: "Sunucu/OpenAI hatası", detail: err.message });
  }
});

// ==== PORT ====
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("AY-TECH Backend Çalışıyor → PORT:", PORT);
});
