# Architecte Marie Gaëlle Mentor

Ce dépôt contient deux sites web autonomes pour Marie Gaëlle Mentor, ainsi qu'une application Astro expérimentale conservée pour les fonctions serveur et l'administration.

## Sites publics

- `sites/usa/` : site anglais réservé aux activités aux États-Unis, destiné à `mariegaellementor.com`.
- `sites/haiti/` : site Haïti contenant les parcours et projets Haïti et USA, destiné à `haiti.mariegaellementor.com`.

Les deux dossiers possèdent leurs propres pages HTML, CSS, JavaScript, contenus et médias. Ils peuvent être déployés ou déplacés dans deux dépôts distincts sans reconstruction.

## Installation

1. Installer Node.js 20 ou plus récent et pnpm.
2. Copier `.env.example` vers `.env` et renseigner les variables.
3. Exécuter `pnpm install`.
4. Appliquer `supabase/migrations/202609220001_initial_schema.sql`, puis `supabase/seed.sql` dans Supabase.
5. Démarrer le site avec `pnpm dev`.

## Commandes

- `pnpm dev` : développement local
- `pnpm typecheck` : validation Astro et TypeScript
- `pnpm test` : tests unitaires
- `pnpm test:e2e` : tests navigateur
- `pnpm build` : build Vercel
- `npm run qa:sites` : contrôle les deux sites statiques sur ordinateur et mobile

## Fonctionnalités intégrées

- Pages publiques multi-pages et responsive
- Préférences USA/Haïti, anglais/français/créole et sombre/clair
- Projets filtrables et pages individuelles
- Formulaire de contact validé par Zod, compatible Turnstile, Supabase et Resend
- Consentement statistique explicite
- Administration protégée par Supabase et niveau MFA `aal2`
- Schéma PostgreSQL, RLS, stockage privé/public et suppression différée
- Structure de lecteur PDF interactif prête à recevoir les fichiers filigranés
- SEO, sitemap, canonical, `hreflang`, favicon et page 404

Les visuels de projet générés sont temporaires et signalés comme tels. Ils ne doivent pas être confondus avec les projets réels de Mme Mentor.

Voir aussi [Déploiement](docs/DEPLOYMENT.md), [Rôles et permissions](docs/ROLES_AND_PERMISSIONS.md) et [Contenus attendus](docs/CONTENT_TODO.md).
