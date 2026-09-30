# Déploiement du site unique

Marie Gaëlle Mentor dispose désormais d’un seul site public réunissant ses activités en Haïti et aux États-Unis. Le domaine principal est `mariegaellementor.com`.

## Site statique

Le site est servi depuis la racine du dépôt, sans étape de compilation :

1. Publier la branche principale depuis la racine.
2. Configurer `mariegaellementor.com` comme domaine principal.
3. Rediriger l’ancien sous-domaine `haiti.mariegaellementor.com` vers `https://mariegaellementor.com` au niveau de l’hébergeur ou du DNS.
4. Vérifier que `index.html`, `about.html`, `projects.html`, `portfolio.html` et `contact.html` répondent directement.

Le site détecte la langue du navigateur au premier accès et permet ensuite de choisir EN, FR ou KR. Le thème clair ou sombre et la langue sont mémorisés localement.

## Application Astro

L’application Astro reste disponible pour les fonctions serveur et l’administration :

1. Appliquer la migration et le seed Supabase.
2. Créer les comptes administrateurs et activer au moins un facteur TOTP.
3. Configurer Cloudflare Turnstile et le domaine d’envoi Resend.
4. Ajouter les variables de `.env.example` dans Vercel.
5. Déployer avec `npm run build`.

Les originaux restent dans les buckets privés. Seules les copies web optimisées et autorisées doivent être publiées.
