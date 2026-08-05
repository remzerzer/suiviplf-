/* Inventaire du flux de publications de l'Assemblee nationale.
   Ce programme ne modifie pas la frise. Il ouvre le flux d'une journee,
   compte ce qui s'y trouve, et tente d'identifier a quel dossier legislatif
   se rattachent les documents autres que les amendements.
   Son but est de decouvrir le format reel avant d'ecrire quoi que ce soit. */

const BASE = "https://www.assemblee-nationale.fr/dyn/opendata";
const MAX_NOTICES = 40;

/* ---------- 1. Date a examiner ---------- */

const argDate = process.argv[2];
const jour = argDate && /^\d{4}-\d{2}-\d{2}$/.test(argDate)
  ? argDate
  : new Date().toISOString().slice(0, 10);

/* ---------- 2. Recuperation du flux ---------- */

async function fluxDuJour(date) {
  const url = `${BASE}/list-publication/publication_${date}.csv`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`flux introuvable (${r.status})`);
  return r.text();
}

/* ---------- 3. Analyse des lignes et dedoublonnage ---------- */

function analyser(csv) {
  const publications = new Map();
  let lignes = 0;

  for (const ligne of csv.split("\n")) {
    const t = ligne.trim();
    if (!t) continue;
    lignes++;
    const sep = t.indexOf(";");
    if (sep < 0) continue;
    const horodatage = t.slice(0, sep);
    const url = t.slice(sep + 1);
    const fichier = url.split("/").pop() || "";
    const uid = fichier.replace(/\.(xml|json|pdf|html)$/i, "");
    if (!uid) continue;
    const dejaVu = publications.get(uid);
    if (!dejaVu) {
      publications.set(uid, { uid, premier: horodatage, dernier: horodatage, occurrences: 1 });
    } else {
      dejaVu.dernier = horodatage;
      dejaVu.occurrences++;
    }
  }
  return { lignes, publications };
}

/* ---------- 4. Classement par prefixe ---------- */

const FAMILLES = [
  ["AM",    "Amendements"],
  ["RAPP",  "Rapports legislatifs"],
  ["AVIS",  "Avis de commissions"],
  ["AVCE",  "Avis du Conseil d Etat"],
  ["ACIN",  "Etudes d impact et annexes"],
  ["PRJL",  "Projets de loi et textes adoptes"],
  ["PION",  "Propositions de loi et textes adoptes"],
  ["PNRE",  "Propositions de resolution europeenne"],
  ["RINF",  "Rapports d information"],
  ["CRSAJO","Comptes rendus analytiques"],
  ["CRS",   "Comptes rendus de seance"],
  ["CRC",   "Comptes rendus de commission"],
  ["RU",    "Reunions"],
  ["EDOC",  "Documents europeens"]
];

function famille(uid) {
  for (const [prefixe, libelle] of FAMILLES) {
    if (uid.startsWith(prefixe)) return libelle;
  }
  return "Autres";
}

/* ---------- 5. Lecture des notices, pour decouvrir le rattachement ---------- */

function extraireBalises(xml, motif) {
  const trouve = [];
  const re = new RegExp(`<([A-Za-z0-9_:.-]*${motif}[A-Za-z0-9_:.-]*)>([^<]{1,200})</\\1>`, "gi");
  let m;
  while ((m = re.exec(xml)) !== null) {
    trouve.push(`${m[1]} = ${m[2].trim()}`);
    if (trouve.length >= 6) break;
  }
  return trouve;
}

async function notice(uid) {
  try {
    const r = await fetch(`${BASE}/${uid}.xml`);
    if (!r.ok) return { uid, erreur: `reponse ${r.status}` };
    const xml = await r.text();
    return {
      uid,
      taille: xml.length,
      dossier: extraireBalises(xml, "dossier"),
      titres: extraireBalises(xml, "titre"),
      numeros: extraireBalises(xml, "numero")
    };
  } catch (e) {
    return { uid, erreur: String(e.message || e) };
  }
}

/* ---------- 6. Redaction du rapport ---------- */

function rapport(date, lignes, publications, comptes, notices) {
  const l = [];
  l.push(`# Inventaire du flux du ${date}`);
  l.push("");
  l.push(`Etabli automatiquement. Ce rapport ne modifie pas la frise.`);
  l.push("");
  l.push(`## Volume`);
  l.push("");
  l.push(`| Mesure | Valeur |`);
  l.push(`|---|---|`);
  l.push(`| Lignes dans le fichier | ${lignes} |`);
  l.push(`| Documents distincts apres dedoublonnage | ${publications.size} |`);
  const republies = [...publications.values()].filter(p => p.occurrences > 1).length;
  l.push(`| Documents republies au moins une fois | ${republies} |`);
  l.push("");
  l.push(`## Repartition par famille`);
  l.push("");
  l.push(`| Famille | Documents distincts |`);
  l.push(`|---|---|`);
  for (const [fam, n] of comptes) l.push(`| ${fam} | ${n} |`);
  l.push("");
  l.push(`## Notices examinees`);
  l.push("");
  l.push(`Les documents autres que les amendements ne portent pas le numero du dossier`);
  l.push(`dans leur identifiant. Le programme a ouvert leur notice pour chercher un`);
  l.push(`rattachement. Voici ce qu'il y a trouve.`);
  l.push("");
  if (!notices.length) {
    l.push(`Aucune notice a examiner ce jour-la.`);
  }
  for (const n of notices) {
    l.push(`### ${n.uid}`);
    l.push("");
    if (n.erreur) {
      l.push(`Notice illisible : ${n.erreur}`);
      l.push("");
      continue;
    }
    l.push(`Taille de la notice : ${n.taille} caracteres.`);
    l.push("");
    const bloc = (titre, tab) => {
      l.push(`**${titre}**`);
      l.push("");
      if (!tab.length) l.push(`Aucune balise correspondante.`);
      else tab.forEach(x => l.push(`- \`${x}\``));
      l.push("");
    };
    bloc("Balises contenant « dossier »", n.dossier);
    bloc("Balises contenant « titre »", n.titres);
    bloc("Balises contenant « numero »", n.numeros);
  }
  return l.join("\n") + "\n";
}

/* ---------- 7. Execution ---------- */

const fs = await import("node:fs/promises");

try {
  const csv = await fluxDuJour(jour);
  const { lignes, publications } = analyser(csv);

  const comptes = new Map();
  for (const p of publications.values()) {
    const f = famille(p.uid);
    comptes.set(f, (comptes.get(f) || 0) + 1);
  }
  const comptesTries = [...comptes.entries()].sort((a, b) => b[1] - a[1]);

  const aExaminer = [...publications.values()]
    .filter(p => /^(PRJL|RAPP|AVIS|ACIN|AVCE)/.test(p.uid))
    .slice(0, MAX_NOTICES);

  const notices = [];
  for (const p of aExaminer) {
    notices.push(await notice(p.uid));
  }

  await fs.mkdir("rapports", { recursive: true });
  await fs.writeFile(`rapports/inventaire-${jour}.md`, rapport(jour, lignes, publications, comptesTries, notices));

  console.log(`Inventaire du ${jour} : ${lignes} lignes, ${publications.size} documents distincts, ${notices.length} notices examinees.`);
} catch (e) {
  console.error(`Echec : ${e.message}`);
  process.exit(1);
}
