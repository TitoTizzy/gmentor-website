# Marie Gaëlle Mentor

Ce dépôt contient un site public unique pour Marie Gaëlle Mentor. Il réunit son parcours et ses projets en Haïti et aux États-Unis, avec une interface disponible en anglais, français et créole haïtien.

## Site public

Le site statique est servi directement depuis la racine du dépôt :

- `index.html` : accueil unique
- `about.html` : parcours professionnel complet
- `projects.html` et `project.html` : réalisations des deux pays
- `portfolio.html` : portfolio feuilletable
- `contact.html` : prise de contact
- `css/`, `js/`, `images/` et `assets/` : ressources partagées

Les médias restent classés dans `images/usa/` et `images/haiti/` afin de préserver leur provenance. Aux États-Unis, l’activité est présentée sous le nom `Marie Mentor Residential Design & Planning LLC`, avec la mention `NOT A LICENSED ARCHITECT`. En Haïti, Marie Gaëlle Mentor est présentée comme architecte licenciée.

## Commandes

- `npm run qa:sites` : contrôle le site unifié sur ordinateur et mobile
- `npm run build` : valide et construit l’application Astro associée
- `npm run test` : exécute les tests unitaires
- `npm run test:e2e` : exécute les tests navigateur

L’application Astro et les fichiers Supabase sont conservés pour les fonctions serveur. Les sources documentaires restent dans `content-sources/` et ne sont pas publiées comme pages du site.
