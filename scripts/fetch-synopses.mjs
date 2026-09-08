#!/usr/bin/env node
/**
 * Va chercher un synopsis par carte sur TMDb et le dépose dans le champ
 * `synopsis` de cards.json. Même clé API que fetch-tmdb-posters.mjs :
 *
 *   TMDB_API_KEY=xxxxx node scripts/fetch-synopses.mjs
 *
 * Options :
 *   --only=12,17,45   ne traiter que ces id
 *   --force            re-récupère même si `synopsis` est déjà rempli
 *
 * Résout l'id TMDb par recherche du titre nettoyé (même heuristique que
 * fetch-tmdb-posters.mjs : le résultat le plus populaire parmi ceux qui
 * ont une affiche — /search/movie ne trie pas par pertinence). Essaie le
 * synopsis en français d'abord, retombe sur l'anglais si vide (beaucoup de
 * fiches TMDb n'ont pas de traduction française). La carte secrète et les
 * cartes sans correspondance claire sont laissées de côté — pas d'erreur
 * bloquante, juste un log.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) {
  console.error('TMDB_API_KEY manquante. Usage : TMDB_API_KEY=xxxx node scripts/fetch-synopses.mjs');
  process.exit(1);
}

const args = process.argv.slice(2);
const onlyIds = args.find((a) => a.startsWith('--only='))?.slice('--only='.length).split(',').map(Number);
const force = args.includes('--force');

const ROOT = path.resolve(import.meta.dirname, '..');
const CARDS_JSON = path.join(ROOT, 'src/data/cards.json');

function cleanTitle(name) {
  return name.replace(/\s*—.*$/, '').replace(/\s*\(.*?\)\s*$/, '').trim();
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
  const withPoster = (data.results ?? []).filter((r) => r.poster_path);
  if (withPoster.length === 0) return data.results?.[0] ?? null;
  return withPoster.reduce((best, r) => (r.popularity > best.popularity ? r : best));
}

async function fetchOverview(tmdbId) {
  const getOverview = async (lang) => {
    const url = new URL(`https://api.themoviedb.org/3/movie/${tmdbId}`);
    url.searchParams.set('api_key', API_KEY);
    url.searchParams.set('language', lang);
    const res = await fetch(url);
    if (!res.ok) return '';
    const data = await res.json();
    return (data.overview ?? '').trim();
  };
  const fr = await getOverview('fr-FR');
  if (fr) return fr;
  return await getOverview('en-US');
}

async function main() {
  const catalog = JSON.parse(await readFile(CARDS_JSON, 'utf-8'));
  const cards = catalog.cards.filter((c) => c.rarity !== 7 && (!onlyIds || onlyIds.includes(c.id)));

  let done = 0;
  const misses = [];

  for (const card of cards) {
    if (!force && card.synopsis) continue;
    try {
      const match = await searchMovie(cleanTitle(card.name));
      if (!match) {
        misses.push({ id: card.id, name: card.name });
        console.log(`✗ #${card.id} "${card.name}" — aucune correspondance`);
        continue;
      }
      const overview = await fetchOverview(match.id);
      if (!overview) {
        misses.push({ id: card.id, name: card.name });
        console.log(`✗ #${card.id} "${card.name}" — pas de synopsis`);
        continue;
      }
      card.synopsis = overview;
      done++;
      console.log(`✓ #${card.id} "${card.name}"`);
    } catch (err) {
      misses.push({ id: card.id, name: card.name, error: String(err) });
      console.log(`✗ #${card.id} "${card.name}" — ${err}`);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  await writeFile(CARDS_JSON, JSON.stringify(catalog, null, 2) + '\n', 'utf-8');
  console.log(`\n${done} synopsis récupéré(s), ${misses.length} sans correspondance.`);
}

main();
