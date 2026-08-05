/* Collecte des documents d un dossier legislatif dans le flux de l Assemblee.
   Pour chaque journee demandee, le programme releve les documents publies,
   ouvre leur notice, ne retient que ceux dont la reference de dossier
   correspond, et propose pour chacun l etape du catalogue qui parait
   convenir. Il ne modifie ni la frise ni la sequence : il rend un rapport. */

const BASE = "https://www.assemblee-nationale.fr/dyn/opendata";
const MAX_NOTICES_PAR_JOUR = 90;

/* ---------- 1. Arguments ---------- */

const dossierRef = process.argv[2] || "DLR5L17N52428";
const dates = (process.argv[3] || "")
  .split(",").map(s => s.trim()).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s));

if (!dates.length) {
  console.error("Aucune date valide fournie.");
  process.exit(1);
}

/* ---------- 2. Lecture du flux d une journee ---------- */

async function flux(date) {
  const r = await fetch(`${BASE}/list-publication/publication_${date}.csv`);
  if (!r.ok) return null;
  return r.text();
}

function documentsDistincts(csv) {
  const vus = new Map();
  let lignes = 0;
  for (const ligne of csv.split("\n")) {
    const t = ligne.trim();
    if (!t) continue;
    lignes++;
    const sep = t.indexOf(";");
    if (sep < 0) continue;
    const heure = t.slice(0, sep);
    const uid = (t.slice(sep + 1).split("/").pop() || "").replace(/\.(xml|json|pdf|html)$/i, "");
    if (!uid) continue;
    if (!vus.has(uid)) vus.set(uid, { uid, premiere: heure });
  }
  return { lignes, documents: [...vus.values()] };
}

/* ---------- 3. Notices et reference de dossier ---------- */

function baliseUnique(xml, nom) {
  const m = new RegExp(`<${nom}>([^<]{1,300})</${nom}>`, "i").exec(xml);
  return m ? m[1].trim() : null;
}

async function notice(uid) {
  try {
    const r = await fetch(`${BASE}/${uid}.xml`);
    if (!r.ok) return null;
    const xml = await r.text();
    return {
      dossier: baliseUnique(xml, "dossierRef"),
      titre: baliseUnique(xml, "titrePrincipalCourt") || baliseUnique(xml, "titrePrincipal")
    };
  } catch { return null; }
}

/* ---------- 4. Proposition d etape ---------- */

function proposition(uid) {
  if (/^PRJLANR5L\d+TAP/.test(uid))
    return { etape: null, lecture: "Version imprimee d un texte adopte, doublon du precedent" };
  if (/^PRJLANR5L\d+BTA/.test(uid))
    return { etape: "adoption-an | adoption-sans-vote | adoption-definitive", lecture: "Texte adopte en seance, la lecture concernee reste a qualifier" };
  if (/^PRJLANR5L\d+BTC/.test(uid))
    return { etape: null, lecture: "Texte adopte par la commission" };
  if (/^PRJLANR5L\d+B\d/.test(uid))
    return { etape: "depot-an | nl-transmission-an", lecture: "Projet de loi depose ou transmis, a qualifier selon le moment" };
  if (/^RAPPANR5L/.test(uid))
    return { etape: "com-fin-an | nl-com-an", lecture: "Rapport de commission" };
  if (/^AVISANR5L/.test(uid))
    return { etape: "avis-commissions", lecture: "Avis d une commission saisie pour avis" };
  if (/^ACINANR5L/.test(uid))
    return { etape: null, lecture: "Annexe au projet de loi" };
  if (/^AVCEANR5L/.test(uid))
    return { etape: null, lecture: "Avis du Conseil d Etat" };
  return { etape: null, lecture: "Type non reconnu" };
}

const AEXAMINER = /^(PRJL|RAPP|AVIS|ACIN|AVCE|PION)/;

/* ---------- 5. Sequence deja enregistree, pour comparaison ---------- */

const fs = await import("node:fs/promises");

async function sequenceConnue() {
  try {
    const brut = await fs.readFile("donnees/plf-2026.json", "utf8");
    const d = JSON.parse(brut);
    const parDate = new Map();
    for (const ev of d.sequence) {
      if (!parDate.has(ev.date)) parDate.set(ev.date, []);
      parDate.get(ev.date).push(ev.etape);
    }
    return parDate;
  } catch { return new Map(); }
}

/* ---------- 6. Execution ---------- */

const connue = await sequenceConnue();
const l = [];
l.push(`# Collecte du dossier ${dossierRef}`);
l.push("");
l.push(`Journees examinees : ${dates.join(", ")}.`);
l.push("");
l.push(`Ce rapport ne modifie ni la frise ni la sequence. Il sert a verifier que le`);
l.push(`programme retrouve seul les jalons que nous avons saisis a la main.`);
l.push("");

let totalRetenus = 0;

for (const date of dates) {
  l.push(`## ${date}`);
  l.push("");

  const csv = await flux(date);
  if (csv === null) {
    l.push(`Flux indisponible pour cette date.`);
    l.push("");
    continue;
  }

  const { lignes, documents } = documentsDistincts(csv);
  const amendements = documents.filter(d => d.uid.startsWith("AM")).length;
  const candidats = documents.filter(d => AEXAMINER.test(d.uid)).slice(0, MAX_NOTICES_PAR_JOUR);

  const retenus = [];
  for (const c of candidats) {
    const n = await notice(c.uid);
    if (n && n.dossier === dossierRef) retenus.push({ ...c, ...n });
  }
  totalRetenus += retenus.length;

  l.push(`| Mesure | Valeur |`);
  l.push(`|---|---|`);
  l.push(`| Lignes du flux | ${lignes} |`);
  l.push(`| Documents distincts | ${documents.length} |`);
  l.push(`| Dont amendements | ${amendements} |`);
  l.push(`| Notices ouvertes | ${candidats.length} |`);
  l.push(`| Documents du dossier | ${retenus.length} |`);
  l.push("");

  if (retenus.length) {
    l.push(`| Heure | Document | Etape proposee | Lecture |`);
    l.push(`|---|---|---|---|`);
    for (const r of retenus) {
      const p = proposition(r.uid);
      l.push(`| ${r.premiere.slice(11)} | \`${r.uid}\` | ${p.etape || "aucune"} | ${p.lecture} |`);
    }
    l.push("");
  } else {
    l.push(`Aucun document de ce dossier publie ce jour-la.`);
    l.push("");
  }

  const attendus = connue.get(date);
  l.push(`**Jalons saisis a la main pour cette date :** ${attendus ? attendus.join(", ") : "aucun"}.`);
  l.push("");
}

l.push(`## Total`);
l.push("");
l.push(`${totalRetenus} documents du dossier retrouves sur ${dates.length} journees.`);
l.push("");

await fs.mkdir("rapports", { recursive: true });
const nom = `rapports/collecte-${dates[0]}-a-${dates[dates.length - 1]}.md`;
await fs.writeFile(nom, l.join("\n") + "\n");
console.log(`Rapport ecrit : ${nom} (${totalRetenus} documents retenus).`);
