// scripts/mergeCountries.js
import fs from 'fs';

// Read existing taxDatabase.ts
let content = fs.readFileSync('src/data/taxDatabase.ts', 'utf8');

// Read additional countries from populateAllCountries.js
const popContent = fs.readFileSync('scripts/populateAllCountries.js', 'utf8');
const startIdx = popContent.indexOf('const additionalCountries = [');
const endIdx = popContent.lastIndexOf('console.log(');

// Evaluate additional countries array
const snippet = popContent.slice(startIdx + 'const additionalCountries = ['.length, endIdx).trim();
const additionalCountries = eval('[' + snippet);

console.log('Parsed additional countries:', additionalCountries.length);

// Extract existing codes
const existingCodes = new Set();
const codeRegex = /code:\s*'([A-Z]{2})'/g;
let match;
while ((match = codeRegex.exec(content)) !== null) {
  existingCodes.add(match[1]);
}

const toAdd = additionalCountries.filter(c => !existingCodes.has(c.code));
console.log('Countries to add:', toAdd.length);

// Format countries as TypeScript objects
const formattedEntries = toAdd.map(c => {
  return `  {
    code: '${c.code}',
    name: '${c.name}',
    region: '${c.region}',
    currency: '${c.currency}',
    currencySymbol: '${c.currencySymbol}',
    corporateTaxRate: ${c.corporateTaxRate.toFixed(1)},
    vatGstRate: ${c.vatGstRate.toFixed(1)},
    withholdingDividends: ${c.withholdingDividends.toFixed(1)},
    withholdingRoyalties: ${c.withholdingRoyalties.toFixed(1)},
    withholdingInterest: ${c.withholdingInterest.toFixed(1)},
    ${c.digitalServicesTax ? `digitalServicesTax: ${c.digitalServicesTax.toFixed(1)},` : ''}
    cbamApplicable: ${c.cbamApplicable},
    hasPillarTwo: ${c.hasPillarTwo},
    taxYearEnd: '${c.taxYearEnd}',
    statutoryAuthority: '${c.statutoryAuthority.replace(/'/g, "\\'")}',
    authorityWebsite: '${c.authorityWebsite}',
    legalGazetteUrl: '${c.legalGazetteUrl}',
    statuteReference: '${c.statuteReference.replace(/'/g, "\\'")}',
    officialEvidenceNote: '${c.officialEvidenceNote.replace(/'/g, "\\'")}',
    tradeAgreements: ${JSON.stringify(c.tradeAgreements)},
    servicesTaxInfo: {
      vatGstOnServices: ${c.servicesTaxInfo.vatGstOnServices.toFixed(1)},
      b2bRule: '${c.servicesTaxInfo.b2bRule}',
      b2cDigitalServicesTaxable: ${c.servicesTaxInfo.b2cDigitalServicesTaxable},
      b2cDigitalServicesRate: ${c.servicesTaxInfo.b2cDigitalServicesRate.toFixed(1)},
      ${c.servicesTaxInfo.digitalServicesTaxRate ? `digitalServicesTaxRate: ${c.servicesTaxInfo.digitalServicesTaxRate.toFixed(1)},` : ''}
      ${c.servicesTaxInfo.digitalServicesTaxName ? `digitalServicesTaxName: '${c.servicesTaxInfo.digitalServicesTaxName.replace(/'/g, "\\'")}',` : ''}
      ${c.servicesTaxInfo.dstThresholdGlobal ? `dstThresholdGlobal: '${c.servicesTaxInfo.dstThresholdGlobal}',` : ''}
      ${c.servicesTaxInfo.dstThresholdLocal ? `dstThresholdLocal: '${c.servicesTaxInfo.dstThresholdLocal}',` : ''}
      withholdingTaxOnServices: ${c.servicesTaxInfo.withholdingTaxOnServices.toFixed(1)},
      treatyReliefAvailable: ${c.servicesTaxInfo.treatyReliefAvailable},
      reverseChargeApplies: ${c.servicesTaxInfo.reverseChargeApplies},
      foreignRegistrationThreshold: '${c.servicesTaxInfo.foreignRegistrationThreshold.replace(/'/g, "\\'")}',
      servicesStatuteNote: '${c.servicesTaxInfo.servicesStatuteNote.replace(/'/g, "\\'")}',
      servicesEvidenceUrl: '${c.servicesTaxInfo.servicesEvidenceUrl}'
    }
  }`;
}).join(',\n');

// Insert before the closing bracket of GLOBAL_TAX_DATABASE: CountryTaxInfo[] = [ ... ];
const closingBracketIdx = content.lastIndexOf('];');
if (closingBracketIdx === -1) {
  throw new Error('Closing bracket not found in taxDatabase.ts');
}

const updatedContent = content.slice(0, closingBracketIdx).trimEnd() + ',\n' + formattedEntries + '\n];\n';
fs.writeFileSync('src/data/taxDatabase.ts', updatedContent, 'utf8');
console.log('Successfully updated taxDatabase.ts!');
