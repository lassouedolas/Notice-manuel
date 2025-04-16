require("dotenv").config();
const fs = require("fs");
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function creerPrompt(texteNotice) {
  return `Tu es un expert en électroménager et notices d'utilisation. Voici le contenu brut extrait d'une notice utilisateur. Génère les éléments suivants en français :

1. Un **résumé de 4-5 lignes** du produit.
2. Une **fiche technique** sous forme de bullet points (capacité, puissance, dimensions, etc.).
3. Une **FAQ** de 5 questions-réponses.
4. Un **titre SEO** et une **meta description**.

Voici la notice :

"""${texteNotice}"""`;
}

async function genererFicheDepuisTexte(fichierTexte) {
  try {
    const texteNotice = fs.readFileSync(fichierTexte, "utf8");
    const prompt = creerPrompt(texteNotice);
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const reponse = completion.choices[0].message.content;
    const sortie = fichierTexte.replace(".txt", "_ficheIA.txt");
    fs.writeFileSync(sortie, reponse, "utf8");
    console.log(`✅ Fiche IA générée dans ${sortie}`);
  } catch (err) {
    console.error("❌ Erreur GPT :", err);
  }
}

module.exports = { genererFicheDepuisTexte };
