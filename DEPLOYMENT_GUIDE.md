# GitHub Pages Deployment

Dit project is geconfigureerd om automatisch te worden gedeployed naar GitHub Pages via GitHub Actions.

## Hoe te gebruiken:

1.  **Maak een nieuwe repository op GitHub.**
2.  **Push je code naar GitHub:**
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/JOUW_GEBRUIKERSNAAM/JOUW_REPO_NAAM.git
    git push -u origin main
    ```
3.  **Activeer GitHub Pages:**
    -   Ga naar de **Settings** van je repository op GitHub.
    -   Klik op **Pages** in het linkermenu.
    -   Onder **Build and deployment** > **Source**, selecteer **GitHub Actions**.

Zodra je dit hebt gedaan, zal GitHub automatisch je site bouwen en deployen telkens wanneer je naar de `main` branch pusht.

## Belangrijke opmerking:
Dit project is volledig client-side en gebruikt geen externe API's (zoals Gemini). Je hoeft dus geen API keys of secrets te configureren op GitHub.

*Let op: Omdat dit een client-side app is, wordt alles direct in de browser afgehandeld.*
