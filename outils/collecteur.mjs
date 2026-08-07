/* Collecteur du dossier legislatif, version lisant la configuration.
   Traite un ou plusieurs dossiers, traduit leurs actes en jalons, fusionne le
   tout dans une seule sequence, et compare a la sequence saisie a la main.
   Peut aussi chercher la reference d un dossier par son intitule. */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

/* ============================================================
   Ce qu il faut collecter

   Sans argument, le programme lit donnees/courant.json et n en retient
   que le millesime portant "collecte": true. Il ne peut donc pas
   toucher a un millesime archive.

   Avec des arguments, ceux-ci l emportent. Ils ne servent qu aux
   verifications faites a la main.
   ============================================================ */

const arg = n => (process.argv[n] || "").trim();

let refsBrut = arg(2), sortie = arg(3), reference = arg(4);
const recherche = arg(5);

if (!refsBrut) {
  let conf;
  try {
    conf = JSON.parse(await fs.readFile("donnees/courant.json", "utf8"));
  } catch {
    console.error("Le fichier donnees/courant.json est introuvable ou illisible.");
    process.exit(1);
  }

  const aCollecter = (conf.millesimes || []).filter(m => m.collecte === true);

  if (!aCollecter.length) {
    console.log("Aucun millesime n est marque a collecter dans donnees/courant.json.");
    console.log("Rien n a ete ecrit.");
    process.exit(0);
  }
  if (aCollecter.length > 1) {
    console.log(`Attention : ${aCollecter.length} millesimes sont marques a collecter.`);
    console.log(`Seul le premier, ${aCollecter[0].cle}, est traite.`);
  }

  const m = aCollecter[0];
  const dossiers = (m.dossiers || []).map(s => String(s).trim()).filter(Boolean);

  if (!dossiers.length) {
    console.log(`Le millesime ${m.cle} n a pas encore de reference de dossier legislatif.`);
    console.log("Elle n existera qu au depot du texte. Rien n a ete ecrit.");
    process.exit(0);
  }

  const seqs = (m.sections && m.sections.chronologie && m.sections.chronologie.sequences) || [];
  refsBrut = dossiers.join(",");
  sortie = seqs.find(f => f.endsWith("-auto.json")) || `donnees/${m.cle}-auto.json`;
  reference = seqs.find(f => !f.endsWith("-auto.json")) || "";

  console.log(`Millesime a collecter : ${m.cle}`);
  console.log(`Dossiers : ${dossiers.join(", ")}`);
  console.log(`Sequence produite : ${sortie}`);
}

const REFS = refsBrut.split(",").map(s => s.trim()).filter(Boolean);
const ARCHIVE = "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/dossiers_legislatifs/Dossiers_Legislatifs.json.zip";

/* ============================================================
   Correspondance entre un acte et une etape du catalogue
   ============================================================ */

const sens = a => {
  const s = a.statutConclusion && a.statutConclusion.libelle;
  const d = a.decision && a.decision.libelle;
  return (s || d || "").toLowerCase();
};
const contient = (a, mot) => sens(a).normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(mot);

const CORRESPONDANCE = {
  "AN1-DEPOT": () => "depot-an",
  "AN1-COM-FOND-RAPPORT": () => "com-fin-an",
  "AN1-COM-AVIS-RAPPORT": () => "avis-commissions",
  "AN1-DEBATS-SEANCE": () => "seance-an",
  "AN1-DEBATS-DEC": a => contient(a, "rejet") ? "rejet-an"
    : contient(a, "49") ? "adoption-sans-vote" : "adoption-an",

  "SN1-DEPOT": () => "transmission-senat",
  "SN1-COM-FOND-RAPPORT": () => "com-fin-senat",
  "SN1-DEBATS-DEC": a => contient(a, "rejet") ? "rejet-senat"
    : contient(a, "conforme") ? "adoption-conforme-senat" : "adoption-senat",

  "CMP-SAISIE": () => "cmp-convocation",
  "CMP-DEC": a => contient(a, "desaccord") ? "cmp-desaccord" : "cmp-accord",

  "ANNLEC-DEPOT": () => "nl-transmission-an",
  "ANNLEC-COM-FOND-RAPPORT": () => "nl-com-an",
  "ANNLEC-DEBATS-SEANCE": () => "nl-seance-an",
  "ANNLEC-DGVT": () => "engagement-responsabilite",
  "ANNLEC-MOTION": () => "motion-censure-depot",
  "ANNLEC-MOTION-VOTE": a => contient(a, "rejet") ? "motion-censure-rejetee" : "motion-censure-adoptee",
  "ANNLEC-DEBATS-DEC": a => contient(a, "rejet") ? "rejet-an"
    : contient(a, "49") ? "adoption-sans-vote" : "nl-adoption-an",

  "SNNLEC-DEPOT": () => "nl-transmission-senat",
  "SNNLEC-COM-FOND-RAPPORT": () => "nl-com-senat",
  "SNNLEC-DEBATS-DEC": a => contient(a, "rejet") ? "rejet-senat" : "nl-adoption-senat",

  "ANLDEF-DEPOT": () => "lecture-definitive",
  "ANLDEF-DGVT": () => "engagement-responsabilite",
  "ANLDEF-MOTION": () => "motion-censure-depot",
  "ANLDEF-MOTION-VOTE": a => contient(a, "rejet") ? "motion-censure-rejetee" : "motion-censure-adoptee",
  "ANLDEF-DEBATS-DEC": a => contient(a, "rejet") ? "rejet-lecture-definitive" : "adoption-definitive",

  "CC-SAISIE-PM": () => "saisine-cc",
  "CC-SAISIE-AN": () => "saisine-cc",
  "CC-CONCLUSION": () => "decision-cc",
  "PROM-PUB": () => "promulgation"
};

const REGROUPES = new Set(["seance-an", "nl-seance-an", "avis-commissions", "saisine-cc"]);

/* ============================================================
   Archive
   ============================================================ */

const r = await fetch(ARCHIVE);
if (!r.ok) { console.error(`Archive inaccessible : ${r.status}`); process.exit(1); }
await fs.writeFile("/tmp/dossiers.zip", Buffer.from(await r.arrayBuffer()));

/* ---------- Mode recherche ---------- */

if (recherche) {
  await fs.mkdir("/tmp/tous", { recursive: true });
  console.log("Decompression de l archive...");
  execSync(`unzip -o -q /tmp/dossiers.zip -d /tmp/tous`, { stdio: "pipe" });
  console.log("Recherche...");
  let candidats = [];
  try {
    candidats = execSync(
      `grep -rilF ${JSON.stringify(recherche)} /tmp/tous --include=*.json`,
      { encoding: "utf8", maxBuffer: 5e8 }
    ).split("\n").filter(Boolean);
  } catch { candidats = []; }
  console.log(`${candidats.length} fichiers contiennent ces mots.`);

  const mot = recherche.toLowerCase();
  const trouves = [];
  for (const p of candidats) {
    try {
      const d = (JSON.parse(await fs.readFile(p, "utf8")).dossierParlementaire) || {};
      const td = d.titreDossier;
      const titre = td && (td.titre || td);
      if (String(titre || "").toLowerCase().includes(mot)) {
        trouves.push({ uid: d.uid, titre: String(titre) });
      }
    } catch { /* fichier illisible */ }
  }
  const l = [`# Recherche de dossier : « ${recherche} »`, "",
    `${candidats.length} fichiers contenaient ces mots, dont ${trouves.length} dans leur intitule.`, "",
    `| Reference | Intitule |`, `|---|---|`];
  trouves.slice(0, 60).forEach(t => l.push(`| \`${t.uid}\` | ${t.titre.slice(0, 110).replace(/\|/g, " ")} |`));
  await fs.mkdir("rapports", { recursive: true });
  await fs.writeFile("rapports/recherche-dossier.md", l.join("\n") + "\n");
  console.log(`${trouves.length} dossiers trouves. Rapport : rapports/recherche-dossier.md`);
  process.exit(0);
}

/* ============================================================
   Lecture des dossiers demandes
   ============================================================ */

function enfants(n) {
  let f = n && n.actesLegislatifs;
  if (f && f.acteLegislatif) f = f.acteLegislatif;
  return Array.isArray(f) ? f : f ? [f] : [];
}
const jour = d => d ? String(d).slice(0, 10) : null;

function documentAssocie(a) {
  if (typeof a.texteAssocie === "string") return a.texteAssocie;
  const t = a.textesAssocies && a.textesAssocies.texteAssocie;
  if (!t) return null;
  const liste = Array.isArray(t) ? t : [t];
  const bta = liste.find(x => x.typeTexte === "BTA") || liste[0];
  return bta && bta.refTexteAssocie ? bta.refTexteAssocie : null;
}

/* Regle de lien : chaque chambre chez elle, et rien d invente. */
function lienDocument(doc, cheminSenat) {
  if (!doc || !/^[A-Z]{4}/.test(doc)) return null;
  if (doc.includes("ANR5")) return `https://www.assemblee-nationale.fr/dyn/opendata/${doc}.html`;
  if (doc.includes("SNR5")) return cheminSenat || null;
  return null;
}

const brut = [];
const infoDossiers = [];

for (const ref of REFS) {
  await fs.rm("/tmp/extrait", { recursive: true, force: true });
  await fs.mkdir("/tmp/extrait", { recursive: true });
  try { execSync(`unzip -o -j /tmp/dossiers.zip "*${ref}*" -d /tmp/extrait`, { stdio: "pipe" }); } catch { /* rien */ }
  const fichiers = existsSync("/tmp/extrait") ? await fs.readdir("/tmp/extrait") : [];
  if (!fichiers.length) { infoDossiers.push({ ref, titre: null, actes: 0 }); continue; }

  const racine = JSON.parse(await fs.readFile(`/tmp/extrait/${fichiers[0]}`, "utf8"));
  const dossier = racine.dossierParlementaire || racine;
  const td = dossier.titreDossier;
  const titre = td && (td.titre || td) || ref;
  const cheminSenat = td && td.senatChemin ? td.senatChemin.replace(/^http:/, "https:") : null;

  const actes = [];
  (function parcourir(n) {
    if (!n || typeof n !== "object") return;
    if (n.codeActe) actes.push(n);
    enfants(n).forEach(parcourir);
  })({ actesLegislatifs: dossier.actesLegislatifs });

  infoDossiers.push({ ref, titre: String(titre), actes: actes.length });

  /* Date de reference pour la decision de commission mixte :
     celle du depot des rapports, seule date publiee par les deux chambres. */
  const rapportCMP = actes.find(a => a.codeActe === "CMP-COM-RAPPORT-AN")
                  || actes.find(a => a.codeActe === "CMP-COM-RAPPORT-SN");
  const dateRapportCMP = rapportCMP ? jour(rapportCMP.dateActe) : null;

  for (const a of actes) {
    const regle = CORRESPONDANCE[a.codeActe];
    if (!regle) continue;
    const etape = regle(a);
    let date = jour(a.dateActe);
    let noteDate = null;
    if (a.codeActe === "CMP-DEC" && dateRapportCMP && dateRapportCMP !== date) {
      noteDate = `Date du depot des rapports de commission mixte. Le dossier enregistre la decision au ${date}.`;
      date = dateRapportCMP;
    }
    if (!etape || !date) continue;
    brut.push({ etape, date, code: a.codeActe, noteDate, cheminSenat,
      statut: (a.statutConclusion && a.statutConclusion.libelle)
           || (a.decision && a.decision.libelle) || null,
      doc: documentAssocie(a), acte: a, ref, titre: String(titre) });
  }
}

/* ============================================================
   Regroupement et mise en forme
   ============================================================ */

const parCle = new Map();
for (const j of brut) {
  const cle = REGROUPES.has(j.etape) ? `${j.ref}|${j.etape}` : `${j.etape}|${j.date}|${j.ref}`;
  if (!parCle.has(cle)) parCle.set(cle, []);
  parCle.get(cle).push(j);
}

const jalons = [];
for (const [, groupe] of parCle) {
  groupe.sort((a, b) => a.date.localeCompare(b.date));
  const p = groupe[0], dernier = groupe[groupe.length - 1], a = p.acte;

  const j = { etape: p.etape, date: p.date, origine: "automatique",
    source: `Dossier ${p.ref}, acte ${p.code}` };

  /* Contexte destine a la redaction. Il ne contient que des faits releves
     ou calcules, jamais une interpretation. */
  const PHASES = {
    AN1: "premiere lecture a l Assemblee",
    SN1: "premiere lecture au Senat",
    CMP: "commission mixte paritaire",
    ANNLEC: "nouvelle lecture a l Assemblee",
    SNNLEC: "nouvelle lecture au Senat",
    ANLDEF: "lecture definitive a l Assemblee",
    CC: "controle du Conseil constitutionnel",
    PROM: "promulgation"
  };
  j.contexte = {
    phase: PHASES[p.code.split("-")[0]] || null,
    code_acte: p.code,
    statut_officiel: p.statut || null,
    dossier: p.titre
  };

  const precisions = [];
  if (p.statut) precisions.push(`Statut enregistre par l Assemblee : ${p.statut}.`);
  if (p.noteDate) precisions.push(p.noteDate);
  if (groupe.length > 1) precisions.push(`${groupe.length} actes de ce type, du ${p.date} au ${dernier.date}.`);
  if (REFS.length > 1) precisions.push(`Dossier : ${p.titre}.`);

  if (p.doc) j.doc = p.doc;
  const lien = lienDocument(p.doc, p.cheminSenat);
  if (lien) j.lien = lien;

  if (a.codeLoi) {
    j.doc = `Loi n° ${a.codeLoi} ${a.titreLoi || ""}`.trim();
    if (a.infoJO) {
      precisions.push(`Publiee au Journal officiel n° ${a.infoJO.numJO} du ${jour(a.infoJO.dateJO)}.`);
      if (a.infoJO.urlLegifrance) j.lien = a.infoJO.urlLegifrance.replace(/^http:/, "https:");
    }
  }
  if (a.urlConclusion) {
    j.lien = a.urlConclusion.replace(/^http:/, "https:");
    j.doc = `Decision n° ${a.anneeDecision}-${a.numDecision} DC`;
  }
  if (precisions.length) j.precision = precisions.join(" ");
  jalons.push(j);
}

jalons.sort((a, b) => a.date.localeCompare(b.date) || a.etape.localeCompare(b.etape));

/* ============================================================
   Enrichissement du contexte : jours ecoules, delais, anteriorite
   ============================================================ */

const depotJalon = jalons.find(j => j.etape === "depot-an");
const dateDepot = depotJalon ? depotJalon.date : null;
const ecart = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

/* Depart du decompte : saisi a la main, absent des donnees ouvertes. */
let departDecompte = null;
try {
  const reglages = JSON.parse(await fs.readFile("donnees/reglages.json", "utf8"));
  departDecompte = reglages.depart_decompte || null;
} catch { /* fichier absent, le contexte restera incomplet */ }

const voteAN = jalons.find(j => ["adoption-an", "rejet-an", "adoption-sans-vote", "rejet-partie1-an"].includes(j.etape));

jalons.forEach((j, i) => {
  const c = j.contexte;
  if (dateDepot) c.jours_depuis_depot = ecart(dateDepot, j.date);
  if (departDecompte) {
    c.depart_decompte = departDecompte;
    c.jours_depuis_depart = ecart(departDecompte, j.date);
    if (voteAN) {
      const d = ecart(departDecompte, voteAN.date);
      c.delai_40_jours_respecte = d <= 40;
      c.jours_assemblee_premiere_lecture = d;
    }
  } else {
    c.depart_decompte = null;
    c.avertissement = "Date de depart du decompte non renseignee : les delais ne peuvent pas etre qualifies.";
  }
  c.jalons_anterieurs = jalons.slice(0, i).map(x => x.etape);
});

/* ============================================================
   Ecriture
   ============================================================ */

const principal = infoDossiers[0] || {};
const depot = jalons.find(j => j.etape === "depot-an");
const donnees = {
  dossier: principal.titre || REFS[0],
  dossierRefs: REFS,
  depot: depot ? depot.date : (jalons[0] && jalons[0].date) || null,
  derniere_verification: new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC",
  sequence: jalons
};
await fs.mkdir("donnees", { recursive: true });
await fs.writeFile(sortie, JSON.stringify(donnees, null, 2) + "\n");

/* ============================================================
   Comparaison
   ============================================================ */

let manuelle = null;
try { manuelle = JSON.parse(await fs.readFile(reference, "utf8")); } catch { /* absente */ }

const l = [];
const dire = (s = "") => l.push(s);
dire(`# Collecte automatique`);
dire();
dire(`| Dossier | Reference | Actes lus |`);
dire(`|---|---|---|`);
infoDossiers.forEach(d => dire(`| ${d.titre || "introuvable"} | \`${d.ref}\` | ${d.actes} |`));
dire();
dire(`Jalons produits : ${jalons.length}.`);
dire();
dire(`## Sequence produite`);
dire();
dire(`| Date | Etape | Document | Lien |`);
dire(`|---|---|---|---|`);
for (const j of jalons) {
  dire(`| ${j.date} | \`${j.etape}\` | ${j.doc || ""} | ${j.lien ? "oui" : "non publie"} |`);
}
dire();

if (manuelle) {
  const cle = j => `${j.etape}|${j.date}`;
  const auto = new Set(jalons.map(cle));
  const main = new Set(manuelle.sequence.map(cle));
  const manquants = manuelle.sequence.filter(j => !auto.has(cle(j)));
  const nouveaux = jalons.filter(j => !main.has(cle(j)));

  dire(`## Presents dans la saisie manuelle, absents de la collecte`);
  dire();
  if (!manquants.length) dire(`Aucun.`);
  else { dire(`| Date | Etape |`); dire(`|---|---|`); manquants.forEach(j => dire(`| ${j.date} | \`${j.etape}\` |`)); }
  dire();
  dire(`## Trouves par la collecte, absents de la saisie manuelle`);
  dire();
  if (!nouveaux.length) dire(`Aucun.`);
  else { dire(`| Date | Etape |`); dire(`|---|---|`); nouveaux.forEach(j => dire(`| ${j.date} | \`${j.etape}\` |`)); }
  dire();
}

await fs.mkdir("rapports", { recursive: true });
await fs.writeFile(`rapports/collecte.md`, l.join("\n") + "\n");
console.log(`${jalons.length} jalons. Sequence : ${sortie}. Rapport : rapports/collecte.md`);
