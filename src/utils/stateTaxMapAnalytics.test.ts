import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getFederationFiscalDataset,
  getChoroplethTileStyle,
  getMetricNumericValue,
} from './stateTaxMapAnalytics.ts';

test('State Tax Map Analytics: US dataset includes 52 jurisdictions and distinguishes NOMAD vs High-Threshold vs Dual-Trigger states', () => {
  const usData = getFederationFiscalDataset('US', {
    annualRevenue: 150000,
    annualTransactions: 120,
    taxableProfitMarginPercent: 15,
  });

  assert.equal(usData.items.length, 52);

  const ca = usData.items.find((d) => d.code === 'CA');
  const tx = usData.items.find((d) => d.code === 'TX');
  const ny = usData.items.find((d) => d.code === 'NY');
  const de = usData.items.find((d) => d.code === 'DE');

  assert.ok(ca && tx && ny && de);

  // At $150k annual revenue and 120 transactions:
  // California ($500k threshold) and Texas ($500k threshold) should NOT trigger economic nexus
  assert.equal(ca.nexusTriggered, false);
  assert.equal(ca.nexusCategory, 'High Threshold ($250k–$500k)');
  assert.equal(tx.nexusTriggered, false);

  // Delaware is a NOMAD state (0% sales tax)
  assert.equal(de.nexusCategory, 'No Sales Tax (NOMAD)');
  assert.equal(de.salesTaxRate, 0);
  assert.equal(de.simulatedAnnualSalesTax, 0);

  // Check a standard $100k Wayfair state (e.g., WA or IL) triggers nexus at $150k
  const wa = usData.items.find((d) => d.code === 'WA');
  assert.ok(wa);
  assert.equal(wa.nexusTriggered, true);
  assert.ok(wa.simulatedAnnualSalesTax > 0);
});

test('State Tax Map Analytics: Transaction count trigger activates nexus even when revenue is below $100k', () => {
  const usData = getFederationFiscalDataset('US', {
    annualRevenue: 60000,
    annualTransactions: 240,
    taxableProfitMarginPercent: 15,
  });

  // Illinois (IL) or Georgia (GA) or Virginia (VA) has $100k OR 200 transactions threshold
  const dualTriggerStates = usData.items.filter(
    (d) => d.nexusTransactionsThreshold !== null && d.nexusTransactionsThreshold <= 200
  );
  assert.ok(dualTriggerStates.length > 0);
  for (const st of dualTriggerStates) {
    assert.equal(st.nexusTriggered, true);
    assert.ok(st.nexusTriggerReason.includes('Transaction'));
  }
});

test('State Tax Map Analytics: Supports India, Canada, Australia, and Brazil federations and computes D3 choropleth styles', () => {
  for (const code of ['IN', 'CA', 'AU', 'BR']) {
    const dataset = getFederationFiscalDataset(code);
    assert.ok(dataset.items.length >= 8, `Expected at least 8 subdivisions for ${code}`);
    assert.ok(dataset.stats.maxCombinedRate > 0);
    assert.ok(dataset.stats.lowestBurdenState !== null);
    assert.ok(dataset.stats.highestBurdenState !== null);

    const sample = dataset.items[0];
    const styleCombined = getChoroplethTileStyle(sample, 'combinedRate', dataset.items);
    const styleNexus = getChoroplethTileStyle(sample, 'nexusThreshold', dataset.items);
    const styleSaas = getChoroplethTileStyle(sample, 'saasRegime', dataset.items);

    assert.ok(styleCombined.fillHex.startsWith('#'));
    assert.ok(styleNexus.badgeText.length > 0);
    assert.ok(['Taxable', 'Partial', 'Exempt'].includes(styleSaas.badgeText));
    assert.equal(typeof getMetricNumericValue(sample, 'compositeBurden'), 'number');
  }
});
