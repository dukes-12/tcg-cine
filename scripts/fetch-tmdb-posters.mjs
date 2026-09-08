#!/usr/bin/env node
/**
 * Va chercher une affiche par carte sur TMDb (The Movie Database) et la
 * dépose dans public/assets/cards/<id sur 3 chiffres>.jpg — le nom de
 * fichier que cards.json attend déjà (voir AJOUTER_DES_CARTES.md § 3).
 *
 * Nécessite une clé API TMDb (gratuite, themoviedb.org → Paramètres →
 * API) passée en variable d'environnement, jamais en dur dans ce fichier :
 *
 *   TMDB_API_KEY=xxxxx node scripts/fetch-tmdb-posters.mjs
 *
 * Options :
 *   --only=12,17,45   ne traiter que ces id (utile pour retester un raté)
 *   --force            re-télécharge même si le fichier existe déjà
 *   --dry-run          cherche et logue le match TMDb sans télécharger
 *
 * Respecte le rate limit TMDb (~50 req/s, on reste large en dessous) et
 * n'écrase jamais un fichier existant sauf --force. Les cartes sans
 * correspondance claire sont juste loguées, pas d'erreur bloquante — le
 * placeholder de CardArt prend le relais pour elles.
 *
 * Rappel légal : les affiches TMDb sont sous licence des studios/
 * distributeurs, mises à disposition par TMDb sous conditions
 * (attribution obligatoire, pas de revente). Le mentions légales de
 * l'appli doit citer TMDb (voir index.html / README) — ne pas retirer.
 */
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error('TMDB_API_KEY manquante. Usage : TMDB_API_KEY=xxxx node scripts/fetch-tmdb-posters.mjs');
  process.exit(1);
}

const args = process.argv.slice(2);
const onlyIds = args.find((a) => a.startsWith('--only='))?.slice('--only='.length).split(',').map(Number);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');

const ROOT = path.resolve(import.meta.dirname, '..');
const CARDS_JSON = path.join(ROOT, 'src/data/cards.json');
const CARDS_DIR = path.join(ROOT, 'public/assets/cards');
const IMG_BASE = 'https://image.tmdb.org/t/p/w780';

/** cards.json contient parfois des variantes non-officielles ("— édition
 *  légendaire", "(bobine du premier tirage)"…) pour des cartes de rareté
 *  élevée qui réutilisent un film déjà présent ailleurs dans le set — pas
 *  de vrai second film à chercher sur TMDb. On nettoie le nom avant la
 *  recherche plutôt que de les exclure : la plupart retrouvent le bon
 *  film une fois le suffixe retiré. */
function cleanTitle(name) {
  return name
    .replace(/\s*—.*$/, '')
    .replace(/\s*\(.*?\)\s*$/, '')
    .trim();
}

async function searchMovie(title) {
  const url = new URL('https://api.themoviedb.org/3/search/movie');
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('query', title);
  url.searchParams.set('language', 'fr-FR');
  url.searchParams.set('include_adult', 'false');
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb search ${res.status} pour "${title}"`);
  const data = await res.json();
  return data.results?.[0] ?? null;
}

async function downloadPoster(posterPath, destFile) {
  const res = await fetch(`${IMG_BASE}${posterPath}`);
  if (!res.ok || !res.body) throw new Error(`TMDb image ${res.status}`);
  await pipeline(res.body, createWriteStream(destFile));
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const catalog = JSON.parse(await readFile(CARDS_JSON, 'utf-8'));
  await mkdir(CARDS_DIR, { recursive: true });

  const cards = catalog.cards.filter((c) => c.rarity !== 7 && (!onlyIds || onlyIds.includes(c.id)));

  const misses = [];
  let done = 0;

  for (const card of cards) {
    const destFile = path.join(ROOT, 'public', card.image);
    if (!force && (await fileExists(destFile))) {
      continue;
    }

    const query = cleanTitle(card.name);
    try {
      const match = await searchMovie(query);
      if (!match?.poster_path) {
        misses.push({ id: card.id, name: card.name });
        console.log(`✗ #${card.id} "${card.name}" — aucune affiche trouvée`);
      } else if (dryRun) {
        console.log(`~ #${card.id} "${card.name}" → TMDb "${match.title}" (${match.release_date?.slice(0, 4) ?? '?'})`);
      } else {
        await downloadPoster(match.poster_path, destFile);
        done++;
        console.log(`✓ #${card.id} "${card.name}" → TMDb "${match.title}"`);
      }
    } catch (err) {
      misses.push({ id: card.id, name: card.name, error: String(err) });
      console.log(`✗ #${card.id} "${card.name}" — ${err}`);
    }

    // Large marge sous la limite TMDb (~50 req/s) : une requête toutes les
    // 120 ms, recherche + image comprises.
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(`\n${done} affiche(s) téléchargée(s), ${misses.length} à traiter à la main.`);
  if (misses.length) {
    const missFile = path.join(ROOT, 'scripts', 'tmdb-misses.json');
    await writeFile(missFile, JSON.stringify(misses, null, 2), 'utf-8');
    console.log(`Liste des ratés écrite dans ${path.relative(ROOT, missFile)} — voir AJOUTER_DES_CARTES.md pour en déposer une à la main.`);
  }
}

main();
