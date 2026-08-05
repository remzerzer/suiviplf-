/* Collecteur du dossier legislatif.
   Telecharge l archive des dossiers, extrait le dossier demande, traduit ses
   actes en jalons de la frise, et compare le resultat a la sequence deja
   enregistree. Il ecrit un fichier de sequence automatique et un rapport de
   comparaison. Il ne remplace jamais la sequence validee. */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const ref = process.argv[2] || "DLR5L17N52428";
const sortie = process.argv[3] || "donnees/plf-2026-auto.json";
const reference = process.argv[4] || "donnees/plf-2026.json";
const ARCHIVE = "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/dossiers_legislatifs/Dossiers_Legislatifs.json.zip";

/* ============================================================
   Table de correspondance entre un acte et une etape du catalogue.
   Quand le sens depend du statut, une fonction tranche.
   ============================================================ */

const sens = a => {
  const s = a.statutConclusion && a.statutConclusion.libelle;
  const d = a.decision && a.decision.libelle;
  return (s || d || "").toLowerCase();
};

const CORRESPONDANCE = {
  "AN1-DEPOT": () => "depot-an",
  "AN1-COM-FOND-RAPPORT": () => "com-fin-an",
  "AN1-COM-AVIS-RAPPORT": () => "avis-commissions",
  "AN1-DEBATS-SEANCE": () => "seance-an",
  "AN1-DEBATS-DEC": a => {
    const s = sens(a);
    if (s.includes("rejet")) return "rejet-an";
    if (s.includes("49")) return "adoption-sans-vote";
    return "adoption-an";
  },

  "SN1-DEPOT": () => "transmission-senat",
  "SN1-COM-FOND-RAPPORT": () => "com-fin-senat",
  "SN1-DEBATS-DEC": a => {
    const s = sens(a);
    if (s.includes("rejet")) return "rejet-senat";
    if (s.includes("conforme")) return "adoption-conforme-senat";
    return "adoption-senat";
  },

  "CMP-SAISIE": () => "cmp-convocation",
  "CMP-DEC": a => sens(a).includes("desaccord") || sens(a).includes("désaccord")
    ? "cmp-desaccord" : "cmp-accord",

  "ANNLEC-DEPOT": () => "nl-transmission-an",
  "ANNLEC-COM-FOND-RAPPORT": () => "nl-com-an",
  "ANNLEC-DEBATS-SEANCE": () => "nl-seance-an",
  "ANNLEC-DGVT": () => "engagement-responsabilite",
  "ANNLEC-MOTION": () => "motion-censure-depot",
  "ANNLEC-MOTION-VOTE": a => sens(a).includes("rejet")
    ? "motion-censure-rejetee" : "motion-censure-adoptee",
  "ANNLEC-DEBATS-DEC": a => {
    const s = sens(a);
    if (s.includes("rejet")) return "rejet-an";
    if (s.includes("49")) return "adoption-sans-vote";
    return "nl-adoption-an";
  },

  "SNNLEC-DEPOT": () => "nl-transmission-senat",
  "SNNLEC-COM-FOND-RAPPORT": () => "nl-com-senat",
  "SNNLEC-DEBATS-DEC": a => sens(a).includes("rejet")
    ? "rejet-senat" : "nl-adoption-senat",

  "ANLDEF-DEPOT": () => "lecture-definitive",
  "ANLDEF-DGVT": () => "engagement-responsabilite",
  "ANLDEF-MOTION": () => "motion-censure-depot",
  "ANLDEF-MOTION-VOTE": a => sens(a).includes("rejet")
    ? "motion-censure-rejetee" : "motion-censure-adoptee",
  "ANLDEF-DEBATS-DEC": a => {
    const s = sens(a);
    if (s.includes("rejet")) return "rejet-lecture-definitive";
    return "adoption-definitive";
  },

  "CC-SAISIE-PM": () => "saisine-cc",
  "CC-SAISIE-AN": () => "saisine-cc",
  "CC-CONCLUSION": () => "decision-cc",
  "PROM-PUB": () => "promulgation"
};

/* Actes regroupes : une seule ligne pour toute une serie. */
const REGROUPES = new Set(["seance-an", "nl-seance-an", "avis-commissions", "saisine-cc"]);

/* ============================================================
   Recuperation et extraction
   ============================================================ */

const r = await fetch(ARCHIVE);
if (!r.ok) { console.error(`Archive inaccessible : ${r.status}`); process.exit(1); }
await fs.writeFile("/tmp/dossiers.zip", Buffer.from(await r.arrayBuffer()));
await fs.mkdir("/tmp/extrait", { recursive: true });
execSync(`unzip -o -j /tmp/dossiers.zip "*${ref}*" -d /tmp/extrait`, { stdio: "pipe" });
const fichiers = existsSync("/tmp/extrait") ? await fs.readdir("/tmp/extrait") : [];
if (!fichiers.length) { console.error("Dossier introuvable dans l archive."); process.exit(1); }
const racine = JSON.parse(await fs.readFile(`/tmp/extrait/${fichiers[0]}`, "utf8"));
const dossier = racine.dossierParlementaire || racine;

/* ============================================================
   Aplatissement de l arbre des actes
   ============================================================ */

function enfants(n) {
  let f = n && n.actesLegislatifs;
  if (f && f.acteLegislatif) f = f.acteLegislatif;
  return Array.isArray(f) ? f : f ? [f] : [];
}

const actes = [];
(function parcourir(n) {
  if (!n || typeof n !== "object") return;
  if (n.codeActe) actes.push(n);
  enfants(n).forEach(parcourir);
})({ actesLegislatifs: dossier.actesLegislatifs });

/* ============================================================
   Traduction en jalons
   ============================================================ */

const jour = d => d ? String(d).slice(0, 10) : null;

function documentAssocie(a) {
  if (a.texteAssocie) return a.texteAssocie;
  const t = a.textesAssocies && a.textesAssocies.texteAssocie;
  if (!t) return null;
  const liste = Array.isArray(t) ? t : [t];
  const bta = liste.find(x => x.typeTexte === "BTA") || liste[0];
  return bta && bta.refTexteAssocie ? bta.refTexteAssocie : null;
}

const brut = [];
for (const a of actes) {
  const regle = CORRESPONDANCE[a.codeActe];
  if (!regle) continue;
  const etape = regle(a);
  if (!etape) continue;
  const date = jour(a.dateActe);
  if (!date) continue;
  brut.push({
    etape, date, code: a.codeActe,
    statut: (a.statutConclusion && a.statutConclusion.libelle)
         || (a.decision && a.decision.libelle) || null,
    doc: documentAssocie(a),
    acte: a
  });
}

/* Regroupement des series et dedoublonnage */
const parEtape = new Map();
for (const j of brut) {
  const cle = REGROUPES.has(j.etape) ? j.etape : `${j.etape}|${j.date}`;
  if (!parEtape.has(cle)) parEtape.set(cle, []);
  parEtape.get(cle).push(j);
}

const jalons = [];
for (const [, groupe] of parEtape) {
  groupe.sort((a, b) => a.date.localeCompare(b.date));
  const premier = groupe[0];
  const dernier = groupe[groupe.length - 1];
  const j = {
    etape: premier.etape,
    date: premier.date,
    doc: premier.doc || "",
    origine: "automatique",
    source: `Dossier legislatif ${ref}, acte ${premier.code}`
  };
  if (premier.statut) j.precision = `Statut enregistre par l Assemblee : ${premier.statut}.`;
  if (groupe.length > 1) {
    j.precision = (j.precision ? j.precision + " " : "")
      + `${groupe.length} actes de ce type, du ${premier.date} au ${dernier.date}.`;
  }
  /* Elements propres a la promulgation */
  const a = premier.acte;
  if (a.codeLoi) {
    j.doc = `Loi n° ${a.codeLoi} ${a.titreLoi || ""}`.trim();
    if (a.infoJO) {
      j.precision = (j.precision ? j.precision + " " : "")
        + `Publiee au Journal officiel n° ${a.infoJO.numJO} du ${jour(a.infoJO.dateJO)}.`;
      if (a.infoJO.urlLegifrance) j.lien = a.infoJO.urlLegifrance;
    }
  }
  if (a.urlConclusion) {
    j.lien = a.urlConclusion;
    j.doc = `Decision n° ${a.anneeDecision}-${a.numDecision} DC`;
  }
  if (!j.lien && j.doc && /^[A-Z]{4}/.test(j.doc)) {
    j.lien = `https://www.assemblee-nationale.fr/dyn/opendata/${j.doc}.html`;
  }
  jalons.push(j);
}

jalons.sort((a, b) => a.date.localeCompare(b.date));

/* ============================================================
   Ecriture de la sequence automatique
   ============================================================ */

const premierDepot = jalons.find(j => j.etape === "depot-an");
const donnees = {
  dossier: dossier.titreDossier || ref,
  dossierRef: ref,
  depot: premierDepot ? premierDepot.date : (jalons[0] && jalons[0].date) || null,
  derniere_verification: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
  sequence: jalons.map(({ etape, date, doc, precision, lien, origine, source }) =>
    Object.fromEntries(Object.entries({ etape, date, doc, precision, lien, origine, source })
      .filter(([, v]) => v !== undefined && v !== null && v !== "")))
};
await fs.mkdir("donnees", { recursive: true });
await fs.writeFile(sortie, JSON.stringify(donnees, null, 2) + "\n");

/* ============================================================
   Comparaison avec la sequence saisie a la main
   ============================================================ */

let manuelle = null;
try { manuelle = JSON.parse(await fs.readFile(reference, "utf8")); } catch { /* absente */ }

const l = [];
const dire = (s = "") => l.push(s);
dire(`# Comparaison de la collecte automatique`);
dire();
dire(`Dossier : ${donnees.dossier}`);
dire(`Reference : \`${ref}\``);
dire();
dire(`Actes lus dans le dossier : ${actes.length}.`);
dire(`Actes traduits en jalons : ${brut.length}.`);
dire(`Jalons apres regroupement : ${jalons.length}.`);
dire();

dire(`## Sequence produite automatiquement`);
dire();
dire(`| Date | Etape | Document | Statut releve |`);
dire(`|---|---|---|---|`);
for (const j of jalons) {
  dire(`| ${j.date} | \`${j.etape}\` | ${j.doc || ""} | ${(j.precision || "").slice(0, 80)} |`);
}
dire();

if (manuelle) {
  const cle = j => `${j.etape}|${j.date}`;
  const auto = new Set(jalons.map(cle));
  const main = new Set(manuelle.sequence.map(cle));

  const manquants = manuelle.sequence.filter(j => !auto.has(cle(j)));
  const nouveaux = jalons.filter(j => !main.has(cle(j)));

  dire(`## Ce que la saisie manuelle contient et que le programme n a pas trouve`);
  dire();
  if (!manquants.length) dire(`Aucun ecart.`);
  else {
    dire(`| Date | Etape |`);
    dire(`|---|---|`);
    manquants.forEach(j => dire(`| ${j.date} | \`${j.etape}\` |`));
  }
  dire();
  dire(`## Ce que le programme a trouve en plus`);
  dire();
  if (!nouveaux.length) dire(`Aucun ecart.`);
  else {
    dire(`| Date | Etape |`);
    dire(`|---|---|`);
    nouveaux.forEach(j => dire(`| ${j.date} | \`${j.etape}\` |`));
  }
  dire();
}

/* Codes rencontres sans correspondance, pour ne rien laisser dans l ombre */
const sansRegle = new Map();
for (const a of actes) {
  if (CORRESPONDANCE[a.codeActe]) continue;
  const lib = a.libelleActe ? (a.libelleActe.nomCanonique || "") : "";
  if (!sansRegle.has(a.codeActe)) sansRegle.set(a.codeActe, { lib, n: 0 });
  sansRegle.get(a.codeActe).n++;
}
dire(`## Actes sans correspondance`);
dire();
dire(`Ces actes existent dans le dossier mais ne produisent aucun jalon.`);
dire(`C est volontaire pour les nominations, saisines et reunions, qui alourdiraient la frise.`);
dire();
dire(`| Code | Occurrences | Libelle |`);
dire(`|---|---|---|`);
for (const [code, i] of [...sansRegle.entries()].sort()) {
  dire(`| \`${code}\` | ${i.n} | ${String(i.lib).slice(0, 60).replace(/\|/g, " ")} |`);
}
dire();

await fs.mkdir("rapports", { recursive: true });
await fs.writeFile(`rapports/comparaison-${ref}.md`, l.join("\n") + "\n");
console.log(`${jalons.length} jalons produits. Sequence : ${sortie}. Rapport : rapports/comparaison-${ref}.md`);
