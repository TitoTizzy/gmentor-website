# Déploiement des deux sites

Le dépôt contient deux applications web autonomes. Elles ne sont plus générées depuis un frontend commun :

- sites/usa/ est le site anglais de mariegaellementor.com. Il contient uniquement le profil, les projets et les images USA.
- sites/haiti/ est le site de haiti.mariegaellementor.com. Il contient les expériences USA et Haïti avec le sélecteur de marché.

Créer deux projets d’hébergement à partir de ce dépôt :

1. Projet mgm-usa : dossier racine sites/usa, aucun build requis, domaine mariegaellementor.com.
2. Projet mgm-haiti : dossier racine sites/haiti, aucun build requis, domaine haiti.mariegaellementor.com.

Chaque projet doit être publié depuis son propre dossier. Le site USA ne doit jamais utiliser sites/haiti comme racine ou comme source d’assets.

## Entrées GitHub Pages

- \`index.html\` redirige vers le site USA.
- \`indexhaiti.html\` redirige vers le site Haïti.
- \`frontend/index.html\` est uniquement une redirection de compatibilité pour les anciens liens USA.

## Application Astro

1. Créer le projet Supabase et appliquer la migration puis le seed.
2. Créer deux comptes administrateurs et inscrire au moins un facteur TOTP pour chacun.
3. Créer les clés Cloudflare Turnstile pour mariegaellementor.com et haiti.mariegaellementor.com.
4. Vérifier le domaine d’envoi dans Resend.
5. Importer le dépôt dans Vercel et ajouter toutes les variables de `.env.example`.
6. Déployer avec la commande de build `pnpm build`.
7. Ajouter les domaines requis, puis vérifier les URL canonical, le sitemap et les emails.

Les originaux restent dans les buckets privés. Seul le bucket `public-watermarked` est lisible publiquement. La génération des copies optimisées et filigranées doit être effectuée dans une fonction serveur dédiée avant toute mise en production avec des médias réels.
