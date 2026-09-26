# Déploiement Vercel

1. Créer le projet Supabase et appliquer la migration puis le seed.
2. Créer deux comptes administrateurs et inscrire au moins un facteur TOTP pour chacun.
3. Créer les clés Cloudflare Turnstile pour `gaellementor.com`.
4. Vérifier le domaine d’envoi dans Resend.
5. Importer le dépôt dans Vercel et ajouter toutes les variables de `.env.example`.
6. Déployer avec la commande de build `pnpm build`.
7. Ajouter `gaellementor.com`, puis vérifier les URL canonical, le sitemap et les emails.

Les originaux restent dans les buckets privés. Seul le bucket `public-watermarked` est lisible publiquement. La génération des copies optimisées et filigranées doit être effectuée dans une fonction serveur dédiée avant toute mise en production avec des médias réels.
