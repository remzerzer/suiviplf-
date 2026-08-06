name: Collecteur du dossier

on:
  workflow_dispatch:
    inputs:
      dossiers:
        description: "References des dossiers, separees par des virgules"
        required: true
        default: "DLR5L17N52428"
      sortie:
        description: "Fichier de sequence a produire"
        required: true
        default: "donnees/plf-2026-auto.json"
      reference:
        description: "Sequence saisie a la main, pour comparaison"
        required: false
        default: "donnees/plf-2026.json"
      recherche:
        description: "Chercher un dossier par son intitule. Laisser vide pour collecter."
        required: false
        default: ""

permissions:
  contents: write
  pull-requests: write

jobs:
  collecteur:
    runs-on: ubuntu-latest
    steps:
      - name: Recuperer le contenu du depot
        uses: actions/checkout@v4

      - name: Installer Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Lancer le collecteur
        run: node outils/collecteur.mjs "${{ inputs.dossiers }}" "${{ inputs.sortie }}" "${{ inputs.reference }}" "${{ inputs.recherche }}"

      - name: Ouvrir une proposition
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git config user.name "Robot de suivi PLF"
          git config user.email "actions@github.com"
          git add -A donnees rapports
          if git diff --cached --quiet; then
            echo "Aucun changement."
            exit 0
          fi
          BRANCHE="collecteur-$(date -u +%Y%m%d-%H%M%S)"
          git checkout -b "$BRANCHE"
          git commit -m "Collecte automatique"
          git push origin "$BRANCHE"
          gh pr create \
            --base main \
            --head "$BRANCHE" \
            --title "Collecte automatique du $(date -u +%d/%m/%Y)" \
            --body "Le programme a lu le ou les dossiers legislatifs demandes et traduit leurs actes en jalons.

          Ouvrez le rapport dans le dossier rapports avant de decider. Il indique, pour chaque jalon, si le document correspondant est publie ou non."
