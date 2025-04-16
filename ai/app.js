require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { extraireTexteDepuisPDF } = require("./pdf/extractPDF");
const { genererFicheDepuisTexte } = require("./ai/genererFicheIA");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: "public/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.get("/", (req, res) => res.render("index"));

app.post("/upload", upload.single("pdf"), async (req, res) => {
  const fichierPDF = req.file.path;
  const nomBase = path.parse(fichierPDF).name;
  const fichierTexte = `sorties/${nomBase}.txt`;

  await extraireTexteDepuisPDF(fichierPDF, fichierTexte);
  await genererFicheDepuisTexte(fichierTexte);

  res.redirect(`/fiche/${nomBase}`);
});

app.get("/fiche/:nom", (req, res) => {
  const chemin = `sorties/${req.params.nom}_ficheIA.txt`;
  const contenu = fs.existsSync(chemin) ? fs.readFileSync(chemin, "utf8") : "Fiche non trouvée.";
  res.render("fiche", { contenu });
});

app.listen(PORT, () => console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`));
