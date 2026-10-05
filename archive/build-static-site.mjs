import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "frontend");
const requestedVariant = process.argv[2] || process.env.SITE_VARIANT;
const requestedOutput = process.argv[3] || process.env.SITE_OUTPUT;
const buildAll = requestedVariant === "--all";
const variants = buildAll ? ["usa", "haiti"] : [requestedVariant || "haiti"];

if (variants.some((variant) => !["usa", "haiti"].includes(variant))) {
  throw new Error("SITE_VARIANT must be either 'usa' or 'haiti'.");
}

const dataSource = fs.readFileSync(path.join(source, "js", "data.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(dataSource, sandbox, { filename: "frontend/js/data.js" });
const allData = sandbox.window.MGM_DATA;

const englishReplacements = {
  "index.html": [
    ["Portfolio architectural de Marie Gaëlle Mentor aux États-Unis et en Haïti.", "United States architectural portfolio of Marie Gaëlle Mentor."],
    ["Architecte Marie Gaëlle Mentor", "Marie Gaëlle Mentor Architectural Designer"],
    ["Aller au contenu", "Skip to content"],
    ["Concevoir avec justesse, du concept au chantier.", "Design with clarity, from concept to completion."],
    ["Parler de votre projet", "Discuss your project"],
    ["Réalisations", "Selected work"],
    ["Une architecture ancrée dans son contexte.", "Architecture grounded in its context."],
    ["Toutes les réalisations", "View all projects"],
    ["Ouvrez le livre architectural.", "Open the architectural book."],
    ["Feuilleter le portfolio", "Turn the pages"],
    ["Nouveau projet", "New project"],
    ["Donnons une forme claire à vos ambitions.", "Give your ambitions a clear form."],
    ["Prendre contact", "Get in touch"],
    ["Nous utilisons des statistiques respectueuses de votre vie privée pour améliorer le site.", "We use privacy-friendly analytics to improve the site."],
    [">Accepter<", ">Accept<"],
    [">Refuser<", ">Decline<"]
  ],
  "about.html": [
    ["Parcours et approche de Marie Gaëlle Mentor.", "Career and design approach of Marie Gaëlle Mentor."],
    ["À propos |", "About |"],
    ["Aller au contenu", "Skip to content"]
  ],
  "projects.html": [
    ["Réalisations architecturales de Marie Gaëlle Mentor.", "Architectural projects by Marie Gaëlle Mentor in the United States."],
    ["Réalisations |", "Projects |"],
    ["Aller au contenu", "Skip to content"],
    [">Réalisations<", ">Projects<"],
    ["Une sélection organisée par pays, ville, année et typologie.", "A selection organized by location, year and project type."],
    [">Pays<", ">Country<"],
    [">Tous<", ">All<"],
    [">Ville<", ">City<"],
    [">Toutes<", ">All<"],
    [">Année<", ">Year<"],
    [">Réinitialiser<", ">Reset<"]
  ],
  "project.html": [
    ["Projet |", "Project |"],
    ["Aller au contenu", "Skip to content"]
  ],
  "portfolio.html": [
    ["Portfolio architectural interactif de Marie Gaëlle Mentor.", "Interactive United States architectural portfolio of Marie Gaëlle Mentor."],
    ["Aller au contenu", "Skip to content"],
    ["Portfolio Haïti", "United States Portfolio"],
    ["Feuilletez les projets.", "Turn the pages."],
    ["Photos, rendus et plans réunis dans un livre architectural interactif.", "Built work and drawings in an interactive architectural book."],
    ["Portfolio interactif", "Interactive portfolio"],
    ["Commandes du portfolio", "Portfolio controls"],
    ["Page précédente", "Previous page"],
    ["Page suivante", "Next page"],
    ["Plein écran", "Fullscreen"],
    ["Afficher le portfolio en plein écran", "View portfolio in fullscreen"]
  ],
  "contact.html": [
    ["Présentez votre projet à Marie Gaëlle Mentor.", "Tell Marie Gaëlle Mentor about your project."],
    ["Aller au contenu", "Skip to content"],
    ["Parlons de votre projet.", "Let's discuss your project."],
    ["Partagez les informations essentielles. Aucune sélection de rendez-vous ou de budget n’est demandée.", "Share the essential details of your project. No appointment or budget selection is required."],
    ["Prise de contact", "Get in touch"],
    ["États-Unis et Haïti", "United States"],
    ["Les coordonnées professionnelles définitives seront affichées après validation.", "Final professional contact details will be displayed after validation."],
    ["Nom complet *", "Full name *"],
    ["Téléphone *", "Phone *"],
    ["Pays *", "Country *"],
    ["Ville *", "City *"],
    ["Type de projet *", "Project type *"],
    [">Choisir<", ">Select<"],
    [">Conception architecturale<", ">Architectural design<"],
    [">Design intérieur<", ">Interior design<"],
    [">Rénovation<", ">Renovation<"],
    [">Rendus et modélisation 3D<", ">3D visualization<"],
    ["Description du projet", "Project description"],
    ["Ce numéro utilise WhatsApp", "This number uses WhatsApp"],
    ["J’accepte la ", "I accept the "],
    ["politique de confidentialité", "privacy policy"],
    ["Envoyer la demande", "Send request"]
  ],
  "privacy.html": [
    ["Confidentialité |", "Privacy |"],
    ["Aller au contenu", "Skip to content"],
    [">Confidentialité<", ">Privacy<"],
    ["Vos données, avec mesure.", "Your data, handled with care."],
    ["Version de travail à faire valider juridiquement avant la mise en production.", "Draft version to be legally reviewed before production."],
    ["Données collectées", "Data collected"],
    ["Le formulaire collecte les coordonnées et informations nécessaires au traitement d’une demande.", "The form collects the contact and project information required to process an inquiry."],
    ["Conservation", "Retention"],
    ["Les demandes clôturées sont conservées six mois, puis supprimées.", "Closed inquiries are retained for six months and then deleted."],
    ["Statistiques", "Analytics"],
    ["Elles ne sont activées qu’après votre consentement.", "Analytics are enabled only after your consent."]
  ],
  "legal.html": [
    ["Mentions légales |", "Legal notice |"],
    ["Aller au contenu", "Skip to content"],
    [">Mentions légales<", ">Legal notice<"],
    ["Informations légales.", "Legal information."],
    ["Activité professionnelle personnelle de Marie Gaëlle Mentor. Le site ne représente pas une LLC.", "Professional website of Marie Gaëlle Mentor."],
    ["Éditrice", "Publisher"],
    ["Marie Gaëlle Mentor. Coordonnées professionnelles à confirmer.", "Marie Gaëlle Mentor. Professional contact details to be confirmed."],
    ["Propriété intellectuelle", "Intellectual property"],
    ["Les textes, images, plans et portfolios restent protégés.", "All text, images, drawings and portfolios remain protected."]
  ],
  "cookies.html": [
    ["Aller au contenu", "Skip to content"],
    ["Vos préférences.", "Your preferences."],
    ["Le site mémorise votre marché, votre langue, votre thème et votre choix concernant les statistiques.", "The site remembers your theme and analytics preference."],
    ["Réinitialiser mes préférences", "Reset my preferences"],
    ["Préférences réinitialisées.", "Preferences reset."]
  ],
  "404.html": [
    ["Page introuvable |", "Page not found |"],
    ["Erreur 404", "404 error"],
    ["Cette page n’existe pas.", "This page does not exist."],
    ["Voir les réalisations", "View projects"]
  ]
};

function replaceAllLiteral(value, search, replacement) {
  return value.split(search).join(replacement);
}

function localizeHtml(file, html) {
  let result = html
    .replace(/<html lang="fr" data-theme="dark" data-market="ht" data-locale="fr">/g, '<html lang="en" data-theme="dark" data-market="us" data-locale="en">')
    .replace(/src="images\/haiti\/beach-house-cover\.webp"/g, 'src="images/usa/townhouse-waterbury-cover.webp"')
    .replace(/\sdata-ht-src="[^"]*"/g, "");

  for (const [search, replacement] of englishReplacements[file] || []) {
    result = replaceAllLiteral(result, search, replacement);
  }
  return result;
}

function dataFor(variant) {
  if (variant === "haiti") return allData;
  const usProfile = structuredClone(allData.profiles.us);
  usProfile.lead = "Marie Gaëlle Mentor brings more than two decades of architectural practice in New York and Connecticut to every commission. Her work is grounded in one clear ambition: creating places that are practical, expressive and genuinely comfortable to inhabit.";
  usProfile.facts = [
    { value: "20+", label: "years of United States practice" },
    { value: "NY + CT", label: "regional experience" },
    { value: "3", label: "languages: English, French and Creole" }
  ];
  usProfile.timeline = usProfile.timeline.filter((item) => !["1990–1995", "2014–2019"].includes(item.title));
  return {
    services: allData.services.map(({ en }) => ({ en })),
    profiles: { us: usProfile },
    projects: allData.projects.filter((project) => project.markets.includes("us"))
  };
}

function outputFor(variant) {
  if (buildAll) return path.join(root, "dist-sites", variant);
  return path.resolve(root, requestedOutput || "dist-site");
}

function build(variant) {
  const output = outputFor(variant);
  fs.rmSync(output, { recursive: true, force: true });
  fs.cpSync(source, output, { recursive: true });

  if (variant === "usa") {
    fs.rmSync(path.join(output, "images", "haiti"), { recursive: true, force: true });
    fs.rmSync(path.join(output, "admin"), { recursive: true, force: true });
    for (const entry of fs.readdirSync(output, { withFileTypes: true })) {
      if (!entry.isFile() || path.extname(entry.name) !== ".html") continue;
      const file = path.join(output, entry.name);
      fs.writeFileSync(file, localizeHtml(entry.name, fs.readFileSync(file, "utf8")), "utf8");
    }
  }

  const generatedData = [
    "(function () {",
    '  "use strict";',
    `  window.MGM_SITE_VARIANT = ${JSON.stringify(variant)};`,
    `  window.MGM_DATA = ${JSON.stringify(dataFor(variant), null, 2)};`,
    "}());",
    ""
  ].join("\n");
  fs.writeFileSync(path.join(output, "js", "data.js"), generatedData, "utf8");
  fs.writeFileSync(path.join(output, "site-manifest.json"), JSON.stringify({
    variant,
    domain: variant === "usa" ? "mariegaellementor.com" : "haiti.mariegaellementor.com",
    markets: variant === "usa" ? ["us"] : ["us", "ht"],
    locale: variant === "usa" ? "en" : "fr/ht/en",
    generatedAt: new Date().toISOString()
  }, null, 2), "utf8");
  console.log(`Built ${variant} site at ${path.relative(root, output)}`);
}

variants.forEach(build);
