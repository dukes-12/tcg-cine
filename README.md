# TCG Ciné — la collection cinéma

Collectionne, ouvre des tickets, complète ta cinémathèque. Jeu de cartes à
collectionner web (React + Vite + TypeScript + Cloudflare Pages Functions +
D1), repris de l'implémentation **TCG-PIG** (thème cochons) et rethémé
cinéma : chaque carte est un film culte, la monnaie s'appelle **bobines**,
les packs sont des séances.

Le design visuel (palette, illustrations, mise en page des cartes) est
**provisoire** — porté tel quel depuis TCG-PIG pour avoir une base
fonctionnelle. Une passe de design dédiée est prévue avec **Claude Design**
pour habiller ce squelette au thème cinéma.

## Lancer le projet

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # build de prod dans dist/
npm run preview    # sert le build de prod
```

Pour ajouter/modifier des cartes vous-même (nom, image, rareté, catégorie)
sans toucher au code : voir **[`AJOUTER_DES_CARTES.md`](./AJOUTER_DES_CARTES.md)**.

Pour la mise en place des comptes/synchronisation/échanges (Cloudflare D1) :
voir **[`LISEZ-MOI.md`](./LISEZ-MOI.md)** et **[`ADMIN.md`](./ADMIN.md)**.

## Contenu du set

`src/data/cards.json` contient un premier jet de **316 films cultes**,
répartis sur 22 catégories (Action, Comédie, Horreur, Science-fiction,
Cinéma d'auteur, Kaiju & Monstres…) et 7 raretés (Commune → Mythique, plus
une carte **Secrète** unique, quasi introuvable). Aucune image n'est
fournie pour l'instant — les affiches/photos officielles sont protégées, et
choisir des visuels (captures perso, libres de droits, fan art autorisé…)
est une décision à prendre à part. Chaque carte sans image retombe
automatiquement sur un placeholder stylé (`CardArt`), donc l'app est
jouable en l'état.

## Structure

- `src/data/` — `cards.json` (316 cartes, raretés, packs) + métadonnées de
  présentation qui n'étaient pas dans le JSON (couleurs d'encre/halo par
  rareté, dégradés de pack, avatars, dos de carte).
- `src/lib/cardVisual.ts` — le langage visuel des cartes (6 raretés × 2
  directions), porté tel quel depuis TCG-PIG.
- `src/lib/draw.ts` — algorithme de tirage (`roll` / `openPack`), avec les
  garanties de rareté par pack et le filet de sécurité.
- `src/state/store.ts` — état du jeu (Zustand), persistance `localStorage`
  de `owned` / `bobines` / `stock` / `openedCount` / `cardStyle`, avec
  synchronisation serveur pour les comptes (voir `LISEZ-MOI.md`).
- `src/screens/` — les onglets (Collection, Boutique, Ouvrir, Doublons,
  Amis, Échanges, Profil), un fichier par écran, routés par `react-router`.
- `src/components/` — `FilmCard` (le composant carte), `CardArt` (art +
  fallback placeholder), `ReelEmblem` (l'emblème bobine de film, dessiné en
  CSS, décoratif), `TabBar`, `Toast`, `CardDetailOverlay`, etc.
- `functions/` — API Cloudflare Pages Functions (comptes, amis, échanges,
  mailbox, admin) + `schema.sql` pour la base D1.

## Ce qui a changé par rapport à TCG-PIG

- **Contenu** : `cards.json` entièrement remplacé — films cultes au lieu de
  déclinaisons "cochon" de mèmes/franchises. Catégories, packs et carte
  secrète adaptés au thème.
- **Monnaie** : `glands` → `bobines` (colonne `bobines` dans `schema.sql`,
  état persisté, UI).
- **Packs** : `Sac de glands` → `Ticket simple`, `La porcherie` →
  `Séance intégrale`, `Malle Dorée` → `Coffret Palme d'or` (mêmes
  mécaniques de tirage/garanties, juste renommés).
- **Emblème décoratif** : le museau de cochon (`Snout`, deux points =
  naseaux) devient `ReelEmblem` (deux points = trous d'une bobine de film) —
  même composant CSS, sémantique changée. Utilisé pour les avatars, les dos
  de carte et le placeholder d'image manquante.
- **Avatars / dos de carte** : renommés (Projecteur, Studio, Plateau vert,
  Écran bleu, Clap doré, Pellicule, Néon…), mêmes couleurs pour l'instant —
  seront repris en même temps que le reste du design.
- **Images de cartes** : le dossier `public/assets/cards/` de TCG-PIG (37 Mo
  de photos "cochon") n'a **pas** été repris — hors sujet et non adapté au
  nouveau thème. Voir `AJOUTER_DES_CARTES.md` pour en déposer de nouvelles.
- **Historique de conception** : les fichiers de handoff de design
  d'origine (`project/`, `chats/`) n'ont pas été repris — obsolètes pour ce
  thème. Une nouvelle passe de design (Claude Design) produira ses propres
  handoffs quand elle aura lieu.
- **Analytics** : l'ID de mesure Google Analytics de TCG-PIG a été retiré
  d'`index.html` (commenté) plutôt que reporté tel quel — à reconfigurer
  avec un ID propre à ce projet si besoin.

## Prochaine étape : passe de design

Le jeu est fonctionnel mais visuellement encore identique à TCG-PIG
(couleurs, dégradés, mise en page de carte). L'étape suivante est une
session Claude Design pour :
- une identité visuelle propre au thème cinéma (palette, typographies,
  emblèmes de rareté) ;
- une véritable anatomie de carte "film" (au lieu du gabarit "cochon"
  repris tel quel) ;
- le choix des visuels de cartes (voir la note droits d'auteur ci-dessus).
