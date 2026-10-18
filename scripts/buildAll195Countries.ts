// scripts/buildAll195Countries.ts
import fs from 'fs';

// Load existing countries from scripts/buildComprehensiveTaxDatabase.js if possible
let rawScript = fs.readFileSync('scripts/buildComprehensiveTaxDatabase.js', 'utf8');

// We have the 70 detailed countries defined in allCountriesRaw array in scripts/buildComprehensiveTaxDatabase.js.
// Let's extract allCountriesRaw object definitions or parse them cleanly.
const matchStart = rawScript.indexOf('const allCountriesRaw = [');
const matchEnd = rawScript.lastIndexOf('console.log(');
const countriesSnippet = rawScript.slice(matchStart + 'const allCountriesRaw = ['.length, matchEnd).trim();

console.log('Snippet length:', countriesSnippet.length);
