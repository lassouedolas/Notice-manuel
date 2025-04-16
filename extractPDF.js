const fs = require("fs");
const pdfParse = require("pdf-parse");

function nettoyerTexte(texte) {
  return texte
    .split("\n")
    .map(ligne => ligne.trim())
    .filter(ligne => ligne.length > 0)
    .join("\n");
}

async function extraireTexteDepuisPDF(fichierPDF, fichierSortie) {
  try {
    const dataBuffer = fs.readFileSync(fichierPDF);
    const data = await pdfParse(dataBuffer);
    const texteNettoye = nettoyerTexte(data.text);
    fs.writeFileSync(fichierSortie, texteNettoye, "utf8");
    console.log(`✅ Texte extrait et sauvegardé dans ${fichierSortie}`);
  } catch (err) {
    console.error("❌ Erreur lors de l'extraction :", err);
  }
}

module.exports = { extraireTexteDepuisPDF };
