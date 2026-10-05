# Rêve — récits en vers

Plateforme Next.js 16 pour lire les œuvres de Rêve, les aimer et en parler (commentaires façon TikTok :
réponses, cœurs, stickers, écrits partagés, photos). Sans inscription ni connexion pour les lecteurs.

## Démarrer

1. Lancer MySQL dans XAMPP.
2. `npm install`
3. `npm run db:setup` : crée la base `reve` (visible dans phpMyAdmin) et ajoute les trois premiers récits.
4. `npm run dev`, puis ouvrir http://localhost:3000

Le schéma est aussi dans `database/schema.sql` (importable dans phpMyAdmin).

## Espace auteur

http://localhost:3000/admin : mot de passe défini dans `.env.local` (`ADMIN_PASSWORD`). **Changez-le.**
Depuis l'atelier : ajouter, modifier, dépublier ou supprimer un récit, modérer les commentaires.
La couverture est générée d'après le texte (motif + palette), et vous pouvez l'ajuster.

## Où sont les choses

- `app/(site)` : accueil, bibliothèque, page de lecture
- `app/admin` : atelier de l'auteur
- `app/api` : likes, commentaires, envoi de photos, administration
- `components/Cover.tsx` : générateur de couvertures aquarelle (SVG)
- `components/Stickers.tsx` : stickers maison
- `storage/uploads` : photos partagées par les lecteurs
