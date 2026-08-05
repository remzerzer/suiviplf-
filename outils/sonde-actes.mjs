/* Sonde ciblee des actes decisifs.
   La sonde precedente a montre que le dossier legislatif contient tous les
   actes dates. Il reste a savoir comment une decision de seance distingue
   une adoption d un rejet, et comment une commission mixte enregistre son
   issue. Ce programme affiche le contenu complet d une quinzaine d actes. */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const ref = process.argv[2] || "DLR5L17N52428";
const ARCHIVE = "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/dossiers_legislatifs/Dossiers_Legislatifs.json.zip";

/* Codes dont le contenu nous interesse. Les autres sont ignores. */
const CIBLES = [
  "AN1-DEPOT",
  "AN1-DEBATS-DEC",
  "SN1-DEPOT",
  "SN1-DEBATS-DEC",
  "CMP-SAISIE",
  "CMP-DEC",
  "ANNLEC-DEPOT",
  "ANNLEC-DGVT",
  "ANNLEC-MOTION",
  "ANNLEC-MOTION-VOTE",
  "ANNLEC-DEBATS-DEC",
  "SNNLEC-DEBATS-DEC",
  "ANLDEF-DEPOT",
  "ANLDEF-DGVT",
  "ANLDEF-MOTION-VOTE",
  "ANLDEF-DEBATS-DEC",
  "CC-SAISIE-PM",
  "CC-CONCLUSION",
  "PROM-PUB"
];

const l = [];
const dire = (s = "") => l.push(s);

/* ---------- Recuperation ---------- */

const r = await fetch(ARCHIVE);
if (!r.ok) {
  console.error(`Archive inaccessible : ${r.status}`);
  process.exit(1);
}
const buf = Buffer.from(await r.arrayBuffer());
await fs.writeFile("/tmp/dossiers.zip", buf);
await fs.mkdir("/tmp/extrait", { recursive: true });
execSync(`unzip -o -j /tmp/dossiers.zip "*${ref}*" -d /tmp/extrait`, { stdio: "pipe" });
const fichiers = existsSync("/tmp/extrait") ? await fs.readdir("/tmp/extrait") : [];
if (!fichiers.length) {
  console.error("Dossier introuvable dans l archive.");
  process.exit(1);
}
const racine = JSON.parse(await fs.readFile(`/tmp/extrait/${fichiers[0]}`, "utf8"));
const dossier = racine.dossierParlementaire || racine;

/* ---------- Parcours de l arbre ---------- */

function enfants(n) {
  let f = n && n.actesLegislatifs;
  if (f && f.acteLegislatif) f = f.acteLegislatif;
  return Array.isArray(f) ? f : f ? [f] : [];
}

const tous = [];
(function parcourir(n, chemin) {
  if (!n || typeof n !== "object") return;
  if (n.codeActe) tous.push({ acte: n, chemin });
  enfants(n).forEach(e => parcourir(e, chemin.concat(n.codeActe || "?")));
})({ actesLegislatifs: dossier.actesLegislatifs }, []);

/* Version allegee : on retire la descendance pour ne montrer que l acte. */
function sansDescendance(a) {
  const copie = {};
  for (const [k, v] of Object.entries(a)) {
    if (k === "actesLegislatifs") copie[k] = enfants(a).length ? `[${enfants(a).length} actes filles]` : null;
    else copie[k] = v;
  }
  return copie;
}

/* ---------- Rapport ---------- */

dire(`# Actes decisifs du dossier ${ref}`);
dire();
dire(`Contenu complet des actes qui determinent le sens d une etape.`);
dire(`Ce rapport ne modifie ni la frise ni la sequence.`);
dire();
dire(`Actes trouves au total dans le dossier : ${tous.length}.`);
dire();

/* Vue d ensemble avec le libelle enfin lisible */
dire(`## Vue d ensemble`);
dire();
dire(`| Code | Date | Libelle | Type technique |`);
dire(`|---|---|---|---|`);
for (const { acte } of tous) {
  const lib = acte.libelleActe
    ? (acte.libelleActe.nomCanonique || acte.libelleActe.libelleCourt || "")
    : "";
  if (!CIBLES.includes(acte.codeActe)) continue;
  const d = acte.dateActe ? String(acte.dateActe).slice(0, 10) : "sans date";
  dire(`| \`${acte.codeActe}\` | ${d} | ${String(lib).slice(0, 70).replace(/\|/g, " ")} | ${acte["@xsi:type"] || "?"} |`);
}
dire();

/* Contenu integral */
dire(`## Contenu integral`);
dire();
let n = 0;
for (const { acte, chemin } of tous) {
  if (!CIBLES.includes(acte.codeActe)) continue;
  n++;
  const d = acte.dateActe ? String(acte.dateActe).slice(0, 10) : "sans date";
  dire(`### ${n}. \`${acte.codeActe}\` du ${d}`);
  dire();
  dire(`Chemin dans l arbre : ${chemin.filter(Boolean).join(" > ") || "racine"}.`);
  dire();
  dire("```json");
  dire(JSON.stringify(sansDescendance(acte), null, 2).slice(0, 2200));
  dire("```");
  dire();
}

/* Liste de tous les codes rencontres, pour ne rien manquer */
const codes = new Map();
for (const { acte } of tous) {
  const lib = acte.libelleActe ? (acte.libelleActe.nomCanonique || "") : "";
  if (!codes.has(acte.codeActe)) codes.set(acte.codeActe, { lib, n: 0 });
  codes.get(acte.codeActe).n++;
}
dire(`## Tous les codes rencontres`);
dire();
dire(`| Code | Occurrences | Libelle |`);
dire(`|---|---|---|`);
for (const [code, info] of [...codes.entries()].sort()) {
  dire(`| \`${code}\` | ${info.n} | ${String(info.lib).slice(0, 70).replace(/\|/g, " ")} |`);
}
dire();

await fs.mkdir("rapports", { recursive: true });
await fs.writeFile(`rapports/actes-${ref}.md`, l.join("\n") + "\n");
console.log(`Rapport ecrit : rapports/actes-${ref}.md (${n} actes detailles, ${codes.size} codes distincts).`);
