import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTariffsAndTaxes } from './tariffCalculator.ts';
import { evaluateShipmentComplianceRisks } from './complianceRiskMonitor.ts';

test('Compliance Risk Monitor: Flags $0 CIF freight violation and CBAM carbon levy on Aluminum import to Germany', () => {
  const input = {
    originCountry: 'US',
    destinationCountry: 'DE',
    hsCode: '7601.10',
    productDescription: 'Unwrought aluminum, not alloyed',
    customsValue: 40000,
    currency: 'USD',
    shippingInsuranceCost: 0,
  };
  const calcResult = calculateTariffsAndTaxes(input);
  const riskSummary = evaluateShipmentComplianceRisks(input, calcResult);

  assert.equal(riskSummary.overallRiskLevel, 'Critical');
  assert.ok(riskSummary.criticalCount >= 2);

  // Should contain $0 CIF freight violation with set_benchmark_freight action
  const freightAlert = riskSummary.alerts.find((a) => a.id === 'cif-freight-zero');
  assert.ok(freightAlert);
  assert.equal(freightAlert.actionType, 'set_benchmark_freight');
  assert.equal(freightAlert.actionPayload, 2000); // 5% of 40000

  // Should contain EU CBAM Carbon Levy alert
  const cbamAlert = riskSummary.alerts.find((a) => a.category === 'Carbon & ESG (CBAM)');
  assert.ok(cbamAlert);
  assert.equal(cbamAlert.severity, 'Critical');

  // Should contain Anti-Dumping Duty alert since 7601.10 has antiDumpingDuty > 0
  const addAlert = riskSummary.alerts.find((a) => a.category === 'Trade Remedies & ADD/CVD');
  assert.ok(addAlert);
});

test('Compliance Risk Monitor: Flags unclaimed USMCA FTA relief on US to Canada shipment and resolves when mitigated', () => {
  const input = {
    originCountry: 'US',
    destinationCountry: 'CA',
    hsCode: '8703.80',
    productDescription: 'Electric Vehicles',
    customsValue: 50000,
    currency: 'USD',
    shippingInsuranceCost: 2500,
  };
  const calcResult = calculateTariffsAndTaxes(input);
  const riskSummary = evaluateShipmentComplianceRisks(input, calcResult);

  const ftaAlert = riskSummary.alerts.find((a) => a.actionType === 'apply_fta');
  assert.ok(ftaAlert, 'Expected unclaimed USMCA FTA alert');
  assert.equal(ftaAlert.actionPayload, 'USMCA');

  // Verify acknowledging / mitigating all alerts brings readinessScore to 100 and overallRiskLevel to Compliant
  const allIds = riskSummary.alerts.map((a) => a.id);
  const mitigatedSummary = evaluateShipmentComplianceRisks(input, calcResult, allIds);
  assert.equal(mitigatedSummary.activeAlertsCount, 0);
  assert.equal(mitigatedSummary.overallRiskLevel, 'Compliant');
  assert.equal(mitigatedSummary.readinessScore, 100);
});

test('Compliance Risk Monitor: Flags ECCN 3A090 export control on semiconductors (8542.31) and e-Way Bill on India interstate', () => {
  const semiInput = {
    originCountry: 'US',
    destinationCountry: 'SG',
    hsCode: '8542.31',
    productDescription: 'Electronic integrated circuits: Processors and controllers',
    customsValue: 18000,
    currency: 'USD',
    shippingInsuranceCost: 900,
  };
  const semiCalc = calculateTariffsAndTaxes(semiInput);
  const semiRisk = evaluateShipmentComplianceRisks(semiInput, semiCalc);

  const exportAlert = semiRisk.alerts.find((a) => a.category === 'Export Controls & Sanctions');
  assert.ok(exportAlert);
  assert.equal(exportAlert.severity, 'Critical');

  // India interstate check
  const inInput = {
    originCountry: 'IN',
    originSubdivision: 'MH',
    destinationCountry: 'IN',
    destinationSubdivision: 'KA',
    hsCode: '8471.30',
    productDescription: 'Laptops',
    customsValue: 120000,
    currency: 'INR',
    shippingInsuranceCost: 2000,
  };
  const inCalc = calculateTariffsAndTaxes(inInput);
  const inRisk = evaluateShipmentComplianceRisks(inInput, inCalc);

  const ewayAlert = inRisk.alerts.find((a) => a.id === 'in-interstate-eway-bill');
  assert.ok(ewayAlert);
  assert.equal(ewayAlert.severity, 'Critical');
});
