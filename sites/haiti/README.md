# Marie Gaëlle Mentor | Portail global

Site autonome pour `haiti.mariegaellementor.com`. Il réunit les profils et projets Haïti et USA dans un même portail global, sans sélecteur de marché. Le domaine d'entrée détermine le portail présenté.

- Ouvrir `index.html` directement dans un navigateur.
- Les styles sont dans `css/styles.css`.
- Les contenus vérifiés sont dans `js/data.js`.
- Les comportements sont dans `js/app.js`.
- Les médias sont séparés dans `images/usa/` et `images/haiti/`.
- Le portfolio feuilletable est dans `portfolio.html` et utilise `page-flip` en local.
- Les médias publiés sont générés avec un bord long de 3840 px et une compression WebP haute qualité.

La provenance des médias est documentée dans `../../content-sources/web-asset-manifest.json`. Ne jamais attribuer un média Haïti à un projet USA, ni l’inverse.

Le formulaire stocke temporairement les demandes dans `localStorage`. Le branchement Supabase/Resend/Turnstile doit être réalisé côté serveur avant la production.
