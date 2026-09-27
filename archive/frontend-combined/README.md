# Frontend HTML/CSS/JavaScript

Cette version est indépendante d’Astro et ne nécessite aucune installation.

- Ouvrir `index.html` directement dans un navigateur.
- Les styles sont dans `css/styles.css`.
- Les contenus vérifiés sont dans `js/data.js`.
- Les comportements partagés sont dans `js/app.js`.
- Les médias sont séparés dans `images/usa/` et `images/haiti/`.
- Le portfolio feuilletable est dans `portfolio.html` et utilise `page-flip` en local.
- Les médias publiés sont générés avec un bord long de 3840 px et une compression WebP haute qualité.

La provenance des médias est documentée dans `../content-sources/web-asset-manifest.json`. Ne jamais déplacer un média d’un marché vers l’autre sans preuve explicite dans le document source.

Le formulaire stocke temporairement les demandes dans `localStorage`. Le branchement Supabase/Resend/Turnstile doit être réalisé côté serveur avant la production.
