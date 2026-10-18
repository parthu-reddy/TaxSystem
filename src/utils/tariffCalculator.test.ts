import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTariffsAndTaxes,
  resolveExchangeRate,
  COUNTRY_DEFAULT_CURRENCY,
} from './tariffCalculator.ts';
import { classifyTradeDocument } from './documentClassifier.ts';

test('Tariff Calculator: Interstate domestic shipment incurs 0 customs duty but applies state tax', () => {
  const result = calculateTariffsAndTaxes({
    originCountry: 'US',
    originSubdivision: 'CA',
    destinationCountry: 'US',
    destinationSubdivision: 'TX',
    hsCode: '8471.30',
    productDescription: 'Enterprise Workstations',
    customsValue: 10000,
    currency: 'USD',
    shippingInsuranceCost: 500,
  });

  assert.equal(result.isInterstateOnly, true);
  assert.equal(result.customsDuty, 0);
  assert.equal(result.baseTariffRate, 0);
  // Texas tax rate is 8.25% of $10,000 = $825
  assert.equal(result.subdivisionSalesTaxRate, 8.25);
  assert.equal(result.subdivisionSalesTaxAmount, 825);
  assert.equal(result.totalTaxesAndTariffs, 825);
  assert.equal(result.totalLandedCost, 10500 + 825);
});

test('Tariff Calculator: India interstate shipment (MH to KA) incurs 0 customs duty and applies 18% IGST with e-Way Bill', () => {
  const result = calculateTariffsAndTaxes({
    originCountry: 'IN',
    originSubdivision: 'MH',
    destinationCountry: 'IN',
    destinationSubdivision: 'KA',
    hsCode: '1509.40',
    productDescription: 'Other virgin olive oil',
    customsValue: 25000,
    currency: 'USD',
    shippingInsuranceCost: 1200,
    reportingCurrency: 'INR',
    exchangeRate: 84.0,
  });

  assert.equal(result.isInterstateOnly, true);
  assert.equal(result.customsDuty, 0);
  assert.equal(result.customsProcessingFee, 0);
  assert.equal(result.subdivisionSalesTaxRate, 18.0);
  assert.equal(result.subdivisionSalesTaxAmount, 4500); // 18% of 25,000
  assert.equal(result.domesticTaxLabel, 'Integrated GST (IGST — Interstate Supply)');
  assert.ok(result.requiredDocuments.some((d) => d.includes('EWB-01')));
});

test('Tariff Calculator: Cross-border US to Germany applies EU VAT and duty without FTA', () => {
  const result = calculateTariffsAndTaxes({
    originCountry: 'US',
    destinationCountry: 'DE',
    hsCode: '6109.10', // T-shirts 12% duty
    productDescription: 'Cotton Apparel',
    customsValue: 20000,
    currency: 'EUR',
    shippingInsuranceCost: 1000,
  });

  assert.equal(result.isInterstateOnly, false);
  assert.equal(result.cifValue, 21000);
  assert.equal(result.baseTariffRate, 12.0);
  assert.equal(result.customsDuty, 2520); // 12% of 21000
  assert.equal(result.importVatGstRate, 19.0); // German MwSt 19%
  // Import VAT is applied on CIF + Duty + Fees
  assert.ok(result.importVatGstAmount > 0);
  assert.ok(result.totalLandedCost > 21000);
  assert.ok(result.requiredDocuments.length >= 4);
});

test('Tariff Calculator: USMCA preferential duty reduces duty to zero for eligible North America trade', () => {
  const result = calculateTariffsAndTaxes({
    originCountry: 'US',
    destinationCountry: 'MX',
    hsCode: '8703.23', // Motor vehicles 10%
    productDescription: 'Automotive components',
    customsValue: 50000,
    currency: 'USD',
    shippingInsuranceCost: 2000,
  });

  assert.equal(result.tradeAgreementApplied, 'USMCA');
  assert.equal(result.effectiveTariffRate, 0);
  assert.equal(result.customsDuty, 0);
  assert.ok(result.preferentialDutyRelief > 0);
  assert.equal(result.tradeAgreementSavings, 5200); // 10% of 52000
});

test('Exchange Rate Resolver: Resolves live API rates, custom overrides, and benchmark fallback accurately', () => {
  const liveRates = { USD: 1.0, EUR: 0.92, INR: 84.0, GBP: 0.78 };

  // Live API direct rate (USD -> EUR)
  const liveDirect = resolveExchangeRate('USD', 'EUR', liveRates);
  assert.equal(liveDirect.source, 'live_api');
  assert.equal(liveDirect.rate, 0.92);

  // Live API cross-rate (EUR -> INR)
  const liveCross = resolveExchangeRate('EUR', 'INR', liveRates);
  assert.equal(liveCross.source, 'live_api');
  assert.ok(Math.abs(liveCross.rate - 84.0 / 0.92) < 0.0001);

  // Custom rate override takes precedence over live rates
  const customOverride = resolveExchangeRate('USD', 'EUR', liveRates, 0.95);
  assert.equal(customOverride.source, 'custom');
  assert.equal(customOverride.rate, 0.95);

  // Benchmark fallback when live rates are null
  const fallback = resolveExchangeRate('USD', 'JPY', null);
  assert.equal(fallback.source, 'benchmark_fallback');
  assert.ok(fallback.rate > 100);
});

test('Tariff Calculator: Converts all duties, VAT, and landed cost into preferred reporting currency', () => {
  const result = calculateTariffsAndTaxes({
    originCountry: 'US',
    destinationCountry: 'DE',
    hsCode: '6109.10', // T-shirts 12% duty
    productDescription: 'Cotton Apparel',
    customsValue: 10000,
    currency: 'USD',
    shippingInsuranceCost: 1000,
    reportingCurrency: 'EUR',
    exchangeRate: 0.9,
  });

  assert.equal(result.reportingCurrency, 'EUR');
  assert.equal(result.exchangeRate, 0.9);
  assert.equal(result.cifValue, 11000);
  assert.equal(result.reportingAmounts.cifValue, 9900);
  assert.equal(result.customsDuty, 1320); // 12% of 11000
  assert.equal(result.reportingAmounts.customsDuty, 1188); // 1320 * 0.9
  assert.ok(Math.abs(result.reportingAmounts.totalLandedCost - result.totalLandedCost * 0.9) < 0.01);
  assert.equal(COUNTRY_DEFAULT_CURRENCY['DE'], 'EUR');
});

test('Document Classifier: Accurately identifies Bill of Lading with carrier compliance checks', () => {
  const analysis = classifyTradeDocument('ocean_bill_of_lading_vessel_maersk_9021.pdf', 'Shipped on board vessel Maersk Tokyo. Consignee: Acme Corp.');
  assert.equal(analysis.category, 'Bill of Lading');
  assert.ok(analysis.confidence >= 0.9);
  assert.equal(analysis.complianceStatus, 'Verified');
  assert.equal(analysis.complianceIssues.length, 0);
});

test('Document Classifier: Flags missing Incoterms and Tax IDs in commercial invoices', () => {
  const analysis = classifyTradeDocument('invoice_10928_goods.pdf', 'Total amount $34,000. Delivered to warehouse.');
  assert.equal(analysis.category, 'Commercial Invoice');
  assert.equal(analysis.complianceStatus, 'Attention Required');
  assert.ok(analysis.complianceIssues.some((issue) => issue.includes('Incoterm')));
  assert.ok(analysis.complianceIssues.some((issue) => issue.includes('Tax ID')));
});
