# Déploiement des deux sites

Le même dépôt produit deux sites statiques réellement séparés :

- npm run build:usa génère dist-site/ pour mariegaellementor.com. Ce build contient uniquement le profil, les projets et les images USA, en anglais.
- npm run build:haiti génère dist-site/ pour haiti.mariegaellementor.com. Ce build contient les marchés USA et Haïti avec le sélecteur de marché.
- npm run build:sites génère les deux variantes dans dist-sites/usa/ et dist-sites/haiti/ pour la vérification locale.

Créer deux projets d’hébergement à partir de ce dépôt :

1. Projet mgm-usa : commande npm run build:usa, dossier de sortie dist-site, domaine mariegaellementor.com.
2. Projet mgm-haiti : commande npm run build:haiti, dossier de sortie dist-site, domaine haiti.mariegaellementor.com.

Ne pas pointer les deux domaines vers un seul artefact : cela remettrait les données Haïti dans les fichiers téléchargés par les visiteurs USA.

## Application Astro

1. Créer le projet Supabase et appliquer la migration puis le seed.
2. Créer deux comptes administrateurs et inscrire au moins un facteur TOTP pour chacun.
3. Créer les clés Cloudflare Turnstile pour mariegaellementor.com et haiti.mariegaellementor.com.
4. Vérifier le domaine d’envoi dans Resend.
5. Importer le dépôt dans Vercel et ajouter toutes les variables de `.env.example`.
6. Déployer avec la commande de build `pnpm build`.
7. Ajouter les domaines requis, puis vérifier les URL canonical, le sitemap et les emails.

Les originaux restent dans les buckets privés. Seul le bucket `public-watermarked` est lisible publiquement. La génération des copies optimisées et filigranées doit être effectuée dans une fonction serveur dédiée avant toute mise en production avec des médias réels.
