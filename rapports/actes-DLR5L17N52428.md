# Actes decisifs du dossier DLR5L17N52428

Contenu complet des actes qui determinent le sens d une etape.
Ce rapport ne modifie ni la frise ni la sequence.

Actes trouves au total dans le dossier : 253.

## Vue d ensemble

| Code | Date | Libelle | Type technique |
|---|---|---|---|
| `AN1-DEPOT` | 2025-10-14 | 1er dépôt d'une initiative. | DepotInitiative_Type |
| `AN1-DEBATS-DEC` | 2025-11-21 | Décision | Decision_Type |
| `SN1-DEPOT` | 2025-11-24 | Dépôt d'une initiative en navette | DepotInitiativeNavette_Type |
| `SN1-DEBATS-DEC` | 2025-12-15 | Décision | Decision_Type |
| `CMP-SAISIE` | 2025-12-15 | Convocation d'une CMP | RenvoiCMP_Type |
| `CMP-DEC` | 2026-01-02 | Décision de la CMP | Decision_Type |
| `ANNLEC-DEPOT` | 2025-12-15 | Dépôt d'une initiative en navette | DepotInitiativeNavette_Type |
| `ANNLEC-DGVT` | 2026-01-20 | Dépôt d'une déclaration du gouvernement | DeclarationGouvernement_Type |
| `ANNLEC-MOTION` | 2026-01-20 | Motion de censure | DepotMotionCensure_Type |
| `ANNLEC-MOTION-VOTE` | 2026-01-23 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANNLEC-MOTION` | 2026-01-20 | Motion de censure | DepotMotionCensure_Type |
| `ANNLEC-MOTION-VOTE` | 2026-01-23 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANNLEC-DGVT` | 2026-01-23 | Dépôt d'une déclaration du gouvernement | DeclarationGouvernement_Type |
| `ANNLEC-MOTION` | 2026-01-23 | Motion de censure | DepotMotionCensure_Type |
| `ANNLEC-MOTION-VOTE` | 2026-01-27 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANNLEC-MOTION` | 2026-01-23 | Motion de censure | DepotMotionCensure_Type |
| `ANNLEC-MOTION-VOTE` | 2026-01-27 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANNLEC-DEBATS-DEC` | 2026-01-27 | Décision | Decision_Type |
| `SNNLEC-DEBATS-DEC` | 2026-01-29 | Décision | Decision_Type |
| `ANLDEF-DEPOT` | 2026-01-29 | Dépôt d'une initiative en navette | DepotInitiativeNavette_Type |
| `ANLDEF-DGVT` | 2026-01-30 | Dépôt d'une déclaration du gouvernement | DeclarationGouvernement_Type |
| `ANLDEF-MOTION-VOTE` | 2026-02-02 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANLDEF-MOTION-VOTE` | 2026-02-02 | Décision sur une motion de censure | DecisionMotionCensure_Type |
| `ANLDEF-DEBATS-DEC` | 2026-02-02 | Décision | Decision_Type |
| `CC-SAISIE-PM` | 2026-02-04 | Saisine du conseil constitutionnel | SaisineConseilConstit_Type |
| `CC-CONCLUSION` | 2026-02-19 | Conclusion du conseil constitutionnel | ConclusionEtapeCC_Type |
| `PROM-PUB` | 2026-02-19 | Promulgation d'une loi | Promulgation_Type |

## Contenu integral

### 1. `AN1-DEPOT` du 2025-10-14

Chemin dans l arbre : ? > AN1.

```json
{
  "@xsi:type": "DepotInitiative_Type",
  "uid": "L17-VD228033DI",
  "codeActe": "AN1-DEPOT",
  "libelleActe": {
    "nomCanonique": "1er dépôt d'une initiative.",
    "libelleCourt": "1er dépôt d'une initiative."
  },
  "organeRef": "PO838901",
  "dateActe": "2025-10-14T00:00:00.000+02:00",
  "actesLegislatifs": null,
  "texteAssocie": "PRJLANR5L17B1906"
}
```

### 2. `AN1-DEBATS-DEC` du 2025-11-21

Chemin dans l arbre : ? > AN1 > AN1-DEBATS.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD228892DEC",
  "codeActe": "AN1-DEBATS-DEC",
  "libelleActe": {
    "nomCanonique": "Décision",
    "libelleCourt": "Décision"
  },
  "organeRef": "PO838901",
  "dateActe": "2025-11-21T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TSORTF07",
    "libelle": "rejeté"
  },
  "reunionRef": "RUANR5L17S2026IDS29940",
  "voteRefs": {
    "voteRef": "VTANR5L17V4241"
  },
  "textesAssocies": {
    "texteAssocie": {
      "typeTexte": "BTA",
      "refTexteAssocie": "PRJLANR5L17BTA0180"
    }
  }
}
```

### 3. `SN1-DEPOT` du 2025-11-24

Chemin dans l arbre : ? > SN1.

```json
{
  "@xsi:type": "DepotInitiativeNavette_Type",
  "uid": "L17-VD228893DIN",
  "codeActe": "SN1-DEPOT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une initiative en navette",
    "libelleCourt": "Dépôt d'une initiative en navette"
  },
  "organeRef": "PO78718",
  "dateActe": "2025-11-24T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "texteAssocie": "PRJLSNR5S479B0138",
  "provenance": "PO838901",
  "depotInitialLectureDefinitiveRef": null
}
```

### 4. `SN1-DEBATS-DEC` du 2025-12-15

Chemin dans l arbre : ? > SN1 > SN1-DEBATS.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD229392DEC",
  "codeActe": "SN1-DEBATS-DEC",
  "libelleActe": {
    "nomCanonique": "Décision",
    "libelleCourt": "Décision"
  },
  "organeRef": "PO78718",
  "dateActe": "2025-12-15T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TSORTF05",
    "libelle": "modifié"
  },
  "reunionRef": null,
  "voteRefs": null,
  "textesAssocies": {
    "texteAssocie": {
      "typeTexte": "BTA",
      "refTexteAssocie": "PRJLSNR5S479BTA0029"
    }
  }
}
```

### 5. `CMP-SAISIE` du 2025-12-15

Chemin dans l arbre : ? > CMP.

```json
{
  "@xsi:type": "RenvoiCMP_Type",
  "uid": "L17-VD229406CMPS",
  "codeActe": "CMP-SAISIE",
  "libelleActe": {
    "nomCanonique": "Convocation d'une CMP",
    "libelleCourt": "Convocation d'une CMP"
  },
  "organeRef": "PO876895",
  "dateActe": "2025-12-15T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "initiateur": {
    "acteurs": {
      "acteur": {
        "acteurRef": "PA643210",
        "mandatRef": "PM873637"
      }
    }
  }
}
```

### 6. `CMP-DEC` du 2026-01-02

Chemin dans l arbre : ? > CMP.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD229406DEC",
  "codeActe": "CMP-DEC",
  "libelleActe": {
    "nomCanonique": "Décision de la CMP",
    "libelleCourt": "Décision de la CMP"
  },
  "organeRef": "PO876895",
  "dateActe": "2026-01-02T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TCCMP02",
    "libelle": "Désaccord"
  },
  "reunionRef": null,
  "voteRefs": null
}
```

### 7. `ANNLEC-DEPOT` du 2025-12-15

Chemin dans l arbre : ? > ANNLEC.

```json
{
  "@xsi:type": "DepotInitiativeNavette_Type",
  "uid": "L17-VD229397DIN",
  "codeActe": "ANNLEC-DEPOT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une initiative en navette",
    "libelleCourt": "Dépôt d'une initiative en navette"
  },
  "organeRef": "PO838901",
  "dateActe": "2025-12-15T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "texteAssocie": "PRJLANR5L17B2247",
  "provenance": "PO876895",
  "depotInitialLectureDefinitiveRef": null
}
```

### 8. `ANNLEC-DGVT` du 2026-01-20

Chemin dans l arbre : ? > ANNLEC.

```json
{
  "@xsi:type": "DeclarationGouvernement_Type",
  "uid": "L17-VD229941",
  "codeActe": "ANNLEC-DGVT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une déclaration du gouvernement",
    "libelleCourt": "Dépôt d'une déclaration du gouvernement"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-20T00:00:00.000+01:00",
  "actesLegislatifs": "[2 actes filles]",
  "texteAssocie": "DECLANR5L17B2247-N0",
  "typeDeclaration": {
    "fam_code": "Art.49.3",
    "libelle": "Déclaration engageant la responsabilité du Gouvernement devant l'Assemblée nationale sur le vote d'un texte"
  }
}
```

### 9. `ANNLEC-MOTION` du 2026-01-20

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT.

```json
{
  "@xsi:type": "DepotMotionCensure_Type",
  "uid": "L17-VD229943",
  "codeActe": "ANNLEC-MOTION",
  "libelleActe": {
    "nomCanonique": "Motion de censure",
    "libelleCourt": "Motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-20T00:00:00.000+01:00",
  "actesLegislatifs": "[1 actes filles]",
  "texteAssocie": "MIONANR5L17B2247-N16",
  "dateRetrait": null
}
```

### 10. `ANNLEC-MOTION-VOTE` du 2026-01-23

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT > ANNLEC-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230014",
  "codeActe": "ANNLEC-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-23T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5154"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 11. `ANNLEC-MOTION` du 2026-01-20

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT.

```json
{
  "@xsi:type": "DepotMotionCensure_Type",
  "uid": "L17-VD229947",
  "codeActe": "ANNLEC-MOTION",
  "libelleActe": {
    "nomCanonique": "Motion de censure",
    "libelleCourt": "Motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-20T00:00:00.000+01:00",
  "actesLegislatifs": "[1 actes filles]",
  "texteAssocie": "MIONANR5L17B2247-N17",
  "dateRetrait": null
}
```

### 12. `ANNLEC-MOTION-VOTE` du 2026-01-23

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT > ANNLEC-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230015",
  "codeActe": "ANNLEC-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-23T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5155"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 13. `ANNLEC-DGVT` du 2026-01-23

Chemin dans l arbre : ? > ANNLEC.

```json
{
  "@xsi:type": "DeclarationGouvernement_Type",
  "uid": "L17-VD230009",
  "codeActe": "ANNLEC-DGVT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une déclaration du gouvernement",
    "libelleCourt": "Dépôt d'une déclaration du gouvernement"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-23T00:00:00.000+01:00",
  "actesLegislatifs": "[2 actes filles]",
  "texteAssocie": "DECLANR5L17B2247-N1",
  "typeDeclaration": {
    "fam_code": "Art.49.3",
    "libelle": "Déclaration engageant la responsabilité du Gouvernement devant l'Assemblée nationale sur le vote d'un texte"
  }
}
```

### 14. `ANNLEC-MOTION` du 2026-01-23

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT.

```json
{
  "@xsi:type": "DepotMotionCensure_Type",
  "uid": "L17-VD230011",
  "codeActe": "ANNLEC-MOTION",
  "libelleActe": {
    "nomCanonique": "Motion de censure",
    "libelleCourt": "Motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-23T00:00:00.000+01:00",
  "actesLegislatifs": "[1 actes filles]",
  "texteAssocie": "MIONANR5L17B2247-N18",
  "dateRetrait": null
}
```

### 15. `ANNLEC-MOTION-VOTE` du 2026-01-27

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT > ANNLEC-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230214",
  "codeActe": "ANNLEC-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-27T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5193"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 16. `ANNLEC-MOTION` du 2026-01-23

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT.

```json
{
  "@xsi:type": "DepotMotionCensure_Type",
  "uid": "L17-VD230012",
  "codeActe": "ANNLEC-MOTION",
  "libelleActe": {
    "nomCanonique": "Motion de censure",
    "libelleCourt": "Motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-23T00:00:00.000+01:00",
  "actesLegislatifs": "[1 actes filles]",
  "texteAssocie": "MIONANR5L17B2247-N19",
  "dateRetrait": null
}
```

### 17. `ANNLEC-MOTION-VOTE` du 2026-01-27

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DGVT > ANNLEC-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230215",
  "codeActe": "ANNLEC-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-27T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5194"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 18. `ANNLEC-DEBATS-DEC` du 2026-01-27

Chemin dans l arbre : ? > ANNLEC > ANNLEC-DEBATS.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD230094DEC",
  "codeActe": "ANNLEC-DEBATS-DEC",
  "libelleActe": {
    "nomCanonique": "Décision",
    "libelleCourt": "Décision"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-27T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TSORTF06",
    "libelle": "considéré comme adopté par l'Assemblée nationale en application de l'article 49, alinéa 3 de la Constitution"
  },
  "reunionRef": "RUANR5L17S2026IDS30188",
  "voteRefs": null,
  "textesAssocies": {
    "texteAssocie": [
      {
        "typeTexte": "BTA",
        "refTexteAssocie": "PRJLANR5L17BTA0218"
      },
      {
        "typeTexte": "TAP",
        "refTexteAssocie": "PRJLANR5L17TAP0218"
      }
    ]
  }
}
```

### 19. `SNNLEC-DEBATS-DEC` du 2026-01-29

Chemin dans l arbre : ? > SNNLEC > SNNLEC-DEBATS.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD230162DEC",
  "codeActe": "SNNLEC-DEBATS-DEC",
  "libelleActe": {
    "nomCanonique": "Décision",
    "libelleCourt": "Décision"
  },
  "organeRef": "PO78718",
  "dateActe": "2026-01-29T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TSORTF07",
    "libelle": "rejeté"
  },
  "reunionRef": null,
  "voteRefs": null,
  "textesAssocies": {
    "texteAssocie": {
      "typeTexte": "BTA",
      "refTexteAssocie": "PRJLSNR5S479BTA0048"
    }
  }
}
```

### 20. `ANLDEF-DEPOT` du 2026-01-29

Chemin dans l arbre : ? > ANLDEF.

```json
{
  "@xsi:type": "DepotInitiativeNavette_Type",
  "uid": "L17-VD230165DIN",
  "codeActe": "ANLDEF-DEPOT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une initiative en navette",
    "libelleCourt": "Dépôt d'une initiative en navette"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-29T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "texteAssocie": "PRJLANR5L17BTA0218",
  "provenance": "PO78718",
  "depotInitialLectureDefinitiveRef": "PRJLANR5L17B2410"
}
```

### 21. `ANLDEF-DGVT` du 2026-01-30

Chemin dans l arbre : ? > ANLDEF.

```json
{
  "@xsi:type": "DeclarationGouvernement_Type",
  "uid": "L17-VD230176",
  "codeActe": "ANLDEF-DGVT",
  "libelleActe": {
    "nomCanonique": "Dépôt d'une déclaration du gouvernement",
    "libelleCourt": "Dépôt d'une déclaration du gouvernement"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-01-30T00:00:00.000+01:00",
  "actesLegislatifs": "[2 actes filles]",
  "texteAssocie": "DECLANR5L17B2410-N0",
  "typeDeclaration": {
    "fam_code": "Art.49.3",
    "libelle": "Déclaration engageant la responsabilité du Gouvernement devant l'Assemblée nationale sur le vote d'un texte"
  }
}
```

### 22. `ANLDEF-MOTION-VOTE` du 2026-02-02

Chemin dans l arbre : ? > ANLDEF > ANLDEF-DGVT > ANLDEF-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230315",
  "codeActe": "ANLDEF-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-02-02T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5284"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 23. `ANLDEF-MOTION-VOTE` du 2026-02-02

Chemin dans l arbre : ? > ANLDEF > ANLDEF-DGVT > ANLDEF-MOTION.

```json
{
  "@xsi:type": "DecisionMotionCensure_Type",
  "uid": "L17-VD230316",
  "codeActe": "ANLDEF-MOTION-VOTE",
  "libelleActe": {
    "nomCanonique": "Décision sur une motion de censure",
    "libelleCourt": "Décision sur une motion de censure"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-02-02T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "voteRefs": {
    "voteRef": "VTANR5L17V5285"
  },
  "decision": {
    "fam_code": "TSORTMOT02",
    "libelle": "Motion rejetée"
  },
  "odSeancejRef": null
}
```

### 24. `ANLDEF-DEBATS-DEC` du 2026-02-02

Chemin dans l arbre : ? > ANLDEF > ANLDEF-DEBATS.

```json
{
  "@xsi:type": "Decision_Type",
  "uid": "L17-VD230233DEC",
  "codeActe": "ANLDEF-DEBATS-DEC",
  "libelleActe": {
    "nomCanonique": "Décision",
    "libelleCourt": "Décision"
  },
  "organeRef": "PO838901",
  "dateActe": "2026-02-02T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TSORTF06",
    "libelle": "considéré comme adopté par l'Assemblée nationale en application de l'article 49, alinéa 3 de la Constitution"
  },
  "reunionRef": null,
  "voteRefs": null,
  "textesAssocies": {
    "texteAssocie": [
      {
        "typeTexte": "BTA",
        "refTexteAssocie": "PRJLANR5L17BTA0227"
      },
      {
        "typeTexte": "TAP",
        "refTexteAssocie": "PRJLANR5L17TAP0227"
      }
    ]
  }
}
```

### 25. `CC-SAISIE-PM` du 2026-02-04

Chemin dans l arbre : ? > CC.

```json
{
  "@xsi:type": "SaisineConseilConstit_Type",
  "uid": "L17-VD230264CCS4148",
  "codeActe": "CC-SAISIE-PM",
  "libelleActe": {
    "nomCanonique": "Saisine du conseil constitutionnel",
    "libelleCourt": "Saisine du conseil constitutionnel"
  },
  "organeRef": "PO873634",
  "dateActe": "2026-02-04T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "casSaisine": {
    "fam_code": "TSCCONT02",
    "libelle": "Premier Ministre"
  },
  "initiateurs": {
    "acteurRef": "PA643210"
  },
  "motif": "En application de l'article 61§2 de la Constitution"
}
```

### 26. `CC-CONCLUSION` du 2026-02-19

Chemin dans l arbre : ? > CC.

```json
{
  "@xsi:type": "ConclusionEtapeCC_Type",
  "uid": "L17-VD230264CCC",
  "codeActe": "CC-CONCLUSION",
  "libelleActe": {
    "nomCanonique": "Conclusion du conseil constitutionnel",
    "libelleCourt": "Conclusion du conseil constitutionnel"
  },
  "organeRef": "PO76034",
  "dateActe": "2026-02-19T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "statutConclusion": {
    "fam_code": "TCD02",
    "libelle": "Partiellement conforme"
  },
  "urlConclusion": "http://www.conseil-constitutionnel.fr/decision/2026/2026901DC.htm",
  "numDecision": "901",
  "anneeDecision": "2026"
}
```

### 27. `PROM-PUB` du 2026-02-19

Chemin dans l arbre : ? > PROM.

```json
{
  "@xsi:type": "Promulgation_Type",
  "uid": "L17-VD230684PL",
  "codeActe": "PROM-PUB",
  "libelleActe": {
    "nomCanonique": "Promulgation d'une loi",
    "libelleCourt": "Promulgation d'une loi"
  },
  "organeRef": "PO717136",
  "dateActe": "2026-02-19T00:00:00.000+01:00",
  "actesLegislatifs": null,
  "texteLoiRef": "PRJLANR5L17BTA0227",
  "infoJO": {
    "typeJO": "JO_LOI_DECRET",
    "dateJO": "2026-02-20+01:00",
    "pageJO": null,
    "numJO": "43",
    "urlLegifrance": "http://www.legifrance.gouv.fr/WAspad/UnTexteDeJorf?numjo=CPPX2524517L",
    "referenceNOR": "CPPX2524517L"
  },
  "urlEcheancierLoi": null,
  "codeLoi": "2026-103",
  "titreLoi": "de finances pour 2026"
}
```

## Tous les codes rencontres

| Code | Occurrences | Libelle |
|---|---|---|
| `AN1` | 1 | 1ère lecture (1ère assemblée saisie) |
| `AN1-COM` | 1 | Travaux des commissions |
| `AN1-COM-AVIS` | 7 | Travaux d'une commission saisie pour avis |
| `AN1-COM-AVIS-NOMIN` | 14 | Nomination de rapporteur budgétaire |
| `AN1-COM-AVIS-RAPPORT` | 7 | Dépôt de rapport |
| `AN1-COM-AVIS-REUNION` | 62 | Réunion de commission |
| `AN1-COM-AVIS-SAISIE` | 7 | Saisine pour avis d'une commission |
| `AN1-COM-FOND` | 1 | Travaux de la commission saisie au fond |
| `AN1-COM-FOND-NOMIN` | 4 | Nomination de rapporteur |
| `AN1-COM-FOND-RAPPORT` | 1 | Dépôt de rapport |
| `AN1-COM-FOND-REUNION` | 21 | Réunion de commission |
| `AN1-COM-FOND-SAISIE` | 1 | Renvoi en commission au fond |
| `AN1-DEBATS` | 1 | Discussion en séance publique |
| `AN1-DEBATS-DEC` | 1 | Décision |
| `AN1-DEBATS-SEANCE` | 36 | Discussion en séance publique |
| `AN1-DEPOT` | 1 | 1er dépôt d'une initiative. |
| `ANLDEF` | 1 | Lecture définitive |
| `ANLDEF-COM` | 1 | Travaux des commissions |
| `ANLDEF-COM-FOND` | 1 | Travaux de la commission saisie au fond |
| `ANLDEF-COM-FOND-RAPPORT` | 1 | Dépôt de rapport |
| `ANLDEF-COM-FOND-REUNION` | 1 | Réunion de commission |
| `ANLDEF-COM-FOND-SAISIE` | 1 | Renvoi en commission au fond |
| `ANLDEF-DEBATS` | 1 | Discussion en séance publique |
| `ANLDEF-DEBATS-DEC` | 1 | Décision |
| `ANLDEF-DEBATS-SEANCE` | 2 | Discussion en séance publique |
| `ANLDEF-DEPOT` | 1 | Dépôt d'une initiative en navette |
| `ANLDEF-DGVT` | 1 | Dépôt d'une déclaration du gouvernement |
| `ANLDEF-MOTION` | 2 | Motion de censure |
| `ANLDEF-MOTION-VOTE` | 2 | Décision sur une motion de censure |
| `ANNLEC` | 1 | Nouvelle Lecture |
| `ANNLEC-COM` | 1 | Travaux des commissions |
| `ANNLEC-COM-FOND` | 1 | Travaux de la commission saisie au fond |
| `ANNLEC-COM-FOND-RAPPORT` | 1 | Dépôt de rapport |
| `ANNLEC-COM-FOND-REUNION` | 9 | Réunion de commission |
| `ANNLEC-COM-FOND-SAISIE` | 1 | Renvoi en commission au fond |
| `ANNLEC-DEBATS` | 1 | Discussion en séance publique |
| `ANNLEC-DEBATS-DEC` | 1 | Décision |
| `ANNLEC-DEBATS-SEANCE` | 12 | Discussion en séance publique |
| `ANNLEC-DEPOT` | 1 | Dépôt d'une initiative en navette |
| `ANNLEC-DGVT` | 2 | Dépôt d'une déclaration du gouvernement |
| `ANNLEC-MOTION` | 4 | Motion de censure |
| `ANNLEC-MOTION-VOTE` | 4 | Décision sur une motion de censure |
| `CC` | 1 | Conseil constitutionnel |
| `CC-CONCLUSION` | 1 | Conclusion du conseil constitutionnel |
| `CC-SAISIE-AN` | 3 | Saisine du conseil constitutionnel |
| `CC-SAISIE-PM` | 1 | Saisine du conseil constitutionnel |
| `CMP` | 1 | Commission Mixte Paritaire |
| `CMP-COM` | 1 | Commission Mixte Paritaire |
| `CMP-COM-NOMIN` | 1 | Nomination de rapporteur |
| `CMP-COM-RAPPORT-AN` | 1 | Dépôt du rapport d'une CMP |
| `CMP-COM-RAPPORT-SN` | 1 | Dépôt du rapport d'une CMP |
| `CMP-DEC` | 1 | Décision de la CMP |
| `CMP-SAISIE` | 1 | Convocation d'une CMP |
| `PROM` | 1 | Promulgation de la loi |
| `PROM-PUB` | 1 | Promulgation d'une loi |
| `SN1` | 1 | 1ère lecture (2ème assemblée saisie) |
| `SN1-COM` | 1 | Travaux des commissions |
| `SN1-COM-FOND` | 1 | Travaux de la commission saisie au fond |
| `SN1-COM-FOND-NOMIN` | 1 | Nomination de rapporteur |
| `SN1-COM-FOND-RAPPORT` | 1 | Dépôt de rapport |
| `SN1-COM-FOND-SAISIE` | 1 | Renvoi en commission au fond |
| `SN1-DEBATS` | 1 | Discussion en séance publique |
| `SN1-DEBATS-DEC` | 1 | Décision |
| `SN1-DEPOT` | 1 | Dépôt d'une initiative en navette |
| `SNNLEC` | 1 | Nouvelle Lecture |
| `SNNLEC-COM` | 1 | Travaux des commissions |
| `SNNLEC-COM-FOND` | 1 | Travaux de la commission saisie au fond |
| `SNNLEC-COM-FOND-RAPPORT` | 1 | Dépôt de rapport |
| `SNNLEC-COM-FOND-SAISIE` | 1 | Renvoi en commission au fond |
| `SNNLEC-DEBATS` | 1 | Discussion en séance publique |
| `SNNLEC-DEBATS-DEC` | 1 | Décision |
| `SNNLEC-DEPOT` | 1 | Dépôt d'une initiative en navette |

