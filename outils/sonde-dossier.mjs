/* Sonde du dossier legislatif.
   Le flux au fil de l eau donne des documents. Ce programme cherche la source
   qui donne des actes dates. Il essaie d abord l adresse directe du dossier,
   puis, a defaut, l archive complete des dossiers legislatifs.
   Il ne modifie rien : il decrit ce qu il trouve. */

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

const ref = process.argv[2] || "DLR5L17N52428";
const DIRECT = `https://www.assemblee-nationale.fr/dyn/opendata/${ref}.xml`;
const ARCHIVE = "https://data.assemblee-nationale.fr/static/openData/repository/17/loi/dossiers_legislatifs/Dossiers_Legislatifs.json.zip";

const l = [];
const dire = (s = "") => l.push(s);

dire(`# Sonde du dossier ${ref}`);
dire();
dire(`Ce rapport decrit la source qui contient les actes dates du dossier.`);
dire(`Il ne modifie ni la frise ni la sequence.`);
dire();

/* ---------- Piste 1 : adresse directe ---------- */

let contenu = null;
let provenance = null;

dire(`## Piste 1, adresse directe`);
dire();
dire(`Adresse essayee : \`${DIRECT}\``);
dire();

try {
  const r = await fetch(DIRECT);
  dire(`Reponse du serveur : ${r.status}.`);
  if (r.ok) {
    const t = await r.text();
    if (t.trim().startsWith("<")) {
      contenu = t;
      provenance = "adresse directe, format XML";
      dire(`Contenu recu : ${t.length} caracteres, format XML.`);
    } else {
      dire(`Contenu recu mais ce n est pas du XML. Debut : \`${t.slice(0, 120)}\``);
    }
  }
} catch (e) {
  dire(`Echec de la requete : ${e.message}`);
}
dire();

/* ---------- Piste 2 : archive complete ---------- */

if (!contenu) {
  dire(`## Piste 2, archive complete des dossiers legislatifs`);
  dire();
  dire(`Adresse essayee : \`${ARCHIVE}\``);
  dire();
  try {
    const r = await fetch(ARCHIVE);
    dire(`Reponse du serveur : ${r.status}.`);
    if (r.ok) {
      const buf = Buffer.from(await r.arrayBuffer());
      await fs.writeFile("/tmp/dossiers.zip", buf);
      dire(`Archive telechargee : ${(buf.length / 1048576).toFixed(1)} Mo.`);

      await fs.mkdir("/tmp/extrait", { recursive: true });
      try {
        execSync(`unzip -o -j /tmp/dossiers.zip "*${ref}*" -d /tmp/extrait`, { stdio: "pipe" });
      } catch {
        dire(`Aucun fichier portant cette reference dans l archive.`);
      }
      const fichiers = existsSync("/tmp/extrait") ? await fs.readdir("/tmp/extrait") : [];
      dire(`Fichiers extraits : ${fichiers.length ? fichiers.join(", ") : "aucun"}.`);
      if (fichiers.length) {
        contenu = await fs.readFile(`/tmp/extrait/${fichiers[0]}`, "utf8");
        provenance = `archive, fichier ${fichiers[0]}`;
        dire(`Contenu lu : ${contenu.length} caracteres.`);
      }
    }
  } catch (e) {
    dire(`Echec : ${e.message}`);
  }
  dire();
}

/* ---------- Analyse ---------- */

if (!contenu) {
  dire(`## Conclusion`);
  dire();
  dire(`Aucune des deux pistes n a abouti. La frise devra continuer de s appuyer`);
  dire(`sur le flux au fil de l eau, avec les limites que nous avons constatees.`);
} else {
  dire(`## Analyse du contenu`);
  dire();
  dire(`Provenance : ${provenance}.`);
  dire();

  const estJson = contenu.trim().startsWith("{");

  if (estJson) {
    let racine;
    try { racine = JSON.parse(contenu); } catch (e) { racine = null; dire(`JSON illisible : ${e.message}`); }
    if (racine) {
      const premier = racine.dossierParlementaire || racine;
      dire(`Cles de premier niveau : \`${Object.keys(racine).join(", ")}\``);
      dire();
      dire(`Cles du dossier : \`${Object.keys(premier).join(", ")}\``);
      dire();

      let actes = premier.actesLegislatifs;
      if (actes && actes.acteLegislatif) actes = actes.acteLegislatif;
      const liste = Array.isArray(actes) ? actes : actes ? [actes] : [];
      dire(`Actes trouves au premier niveau : ${liste.length}.`);
      dire();

      /* Les actes peuvent contenir des actes filles. On les aplatit. */
      const plat = [];
      const parcourir = (n, niveau) => {
        if (!n || typeof n !== "object") return;
        plat.push({ niveau, code: n.codeActe, libelle: n.libelleActe, date: n.dateActe, uid: n.uid });
        let f = n.actesLegislatifs;
        if (f && f.acteLegislatif) f = f.acteLegislatif;
        const enfants = Array.isArray(f) ? f : f ? [f] : [];
        enfants.forEach(e => parcourir(e, niveau + 1));
      };
      liste.forEach(a => parcourir(a, 0));

      dire(`Actes trouves en tout, sous-actes compris : ${plat.length}.`);
      dire();
      if (plat.length) {
        dire(`| Niveau | Code de l acte | Date | Libelle |`);
        dire(`|---|---|---|---|`);
        for (const a of plat) {
          const lib = (a.libelle || "").toString().slice(0, 90).replace(/\|/g, " ");
          dire(`| ${a.niveau} | \`${a.code || "?"}\` | ${a.date || "?"} | ${lib} |`);
        }
        dire();
        dire(`### Premier acte, structure brute`);
        dire();
        dire("```");
        dire(JSON.stringify(liste[0], null, 2).slice(0, 2500));
        dire("```");
      } else {
        dire(`### Extrait brut du dossier`);
        dire();
        dire("```");
        dire(JSON.stringify(premier, null, 2).slice(0, 3000));
        dire("```");
      }
    }
  } else {
    const balises = [...new Set([...contenu.matchAll(/<([A-Za-z0-9_:.-]+)>/g)].map(m => m[1]))];
    dire(`Balises rencontrees : ${balises.length}.`);
    dire();
    dire(`\`${balises.slice(0, 80).join(", ")}\``);
    dire();
    const dates = [...contenu.matchAll(/<([A-Za-z0-9_:.-]*[Dd]ate[A-Za-z0-9_:.-]*)>([^<]{1,40})</g)]
      .slice(0, 40).map(m => `${m[1]} = ${m[2]}`);
    dire(`### Balises de date`);
    dire();
    dates.length ? dates.forEach(d => dire(`- \`${d}\``)) : dire(`Aucune.`);
    dire();
    dire(`### Extrait brut`);
    dire();
    dire("```");
    dire(contenu.slice(0, 2500));
    dire("```");
  }
}

await fs.mkdir("rapports", { recursive: true });
await fs.writeFile(`rapports/sonde-${ref}.md`, l.join("\n") + "\n");
console.log(`Rapport ecrit : rapports/sonde-${ref}.md`);
