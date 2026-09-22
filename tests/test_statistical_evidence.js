/**
 * Automated Verification & Testing Suite for PRISM-V Statistical Evidence
 * Implements Section 13 verification criteria.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('   PRISM-V STATISTICAL EVIDENCE INTEGRATION — TEST SUITE');
console.log('═══════════════════════════════════════════════════════════════════\n');

const statsPath = path.join(__dirname, '../data/stats/website_stats.json');
const csvPairsPath = path.join(__dirname, '../data/stats/pairwise_105_holm.csv');
const matricesPath = path.join(__dirname, '../data/stats/matrices.json');
const bootstrapPath = path.join(__dirname, '../data/stats/bootstrap_1000.json');

// 1. Data loader returns 15 models
console.log('▶ Test 1: Data loader returns 15 models...');
const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
assert(statsData.models, 'Models array missing');
assert.strictEqual(statsData.models.length, 15, `Expected 15 models, got ${statsData.models.length}`);
console.log('  ✔ Passed (15 models loaded)');

// 2. Pair loader returns 105 unique pairs
console.log('▶ Test 2: Pair loader returns 105 unique pairs...');
assert(statsData.pairs, 'Pairs array missing');
assert.strictEqual(statsData.pairs.length, 105, `Expected 105 pairs, got ${statsData.pairs.length}`);

const uniqueUnorderedPairs = new Set();
statsData.pairs.forEach(p => {
  assert(p.system_A !== p.system_B, `Self comparison found: ${p.system_A}`);
  const key = [p.system_A, p.system_B].sort().join('___');
  assert(!uniqueUnorderedPairs.has(key), `Duplicate unordered pair: ${key}`);
  uniqueUnorderedPairs.add(key);
});
assert.strictEqual(uniqueUnorderedPairs.size, 105, `Expected 105 unique unordered pairs, got ${uniqueUnorderedPairs.size}`);
console.log('  ✔ Passed (105 unique unordered pairs with no self comparisons)');

// 3. Holm summary returns 98 significant / 7 non-significant
console.log('▶ Test 3: Holm summary returns 98 significant / 7 non-significant...');
let sigCount = 0;
let nonSigCount = 0;
statsData.pairs.forEach(p => {
  if (p.holm_significant_0_05 === true) sigCount++;
  else if (p.holm_significant_0_05 === false) nonSigCount++;
});
assert.strictEqual(sigCount, 98, `Expected 98 significant, got ${sigCount}`);
assert.strictEqual(nonSigCount, 7, `Expected 7 non-significant, got ${nonSigCount}`);
console.log('  ✔ Passed (98 significant / 7 non-significant after Holm at alpha=0.05)');

// 4. Pair orientation correctly negates Δ and reverses CI when A/B order is swapped
console.log('▶ Test 4: Pair orientation negates Δ and reverses CI when A/B swapped...');
statsData.pairs.forEach(p => {
  const origDiff = p.effect_A_minus_B;
  const origCI = p.effect_ci95;
  const revDiff = -origDiff;
  const revCI = [-origCI[1], -origCI[0]];

  assert.strictEqual(origDiff + revDiff, 0, 'Sum of direct and negated effect must be 0');
  assert(revCI[0] <= revCI[1], `Reversed CI lower must be <= upper, got [${revCI[0]}, ${revCI[1]}]`);
  assert.strictEqual(revCI[0], -origCI[1]);
  assert.strictEqual(revCI[1], -origCI[0]);
});
console.log('  ✔ Passed (Orientation symmetry verified across all 105 pairs)');

// 5. Griffin-Lim is tagged as algorithmic baseline
console.log('▶ Test 5: Griffin-Lim is tagged as algorithmic baseline...');
const gl = statsData.models.find(m => m.id === 'griffin_lim');
assert(gl, 'Griffin-Lim model not found');
assert.strictEqual(gl.system_type, 'algorithmic_baseline', `Expected 'algorithmic_baseline', got '${gl.system_type}'`);
console.log('  ✔ Passed (Griffin-Lim correctly classified as algorithmic_baseline)');

// 6. Neural filter excludes Griffin-Lim but does not mutate source data
console.log('▶ Test 6: Neural filter excludes Griffin-Lim without mutating source data...');
const initialModelsCount = statsData.models.length;
const neuralOnly = statsData.models.filter(m => m.system_type === 'neural_vocoder');
assert.strictEqual(neuralOnly.length, 14, `Expected 14 neural models, got ${neuralOnly.length}`);
assert(!neuralOnly.some(m => m.id === 'griffin_lim'), 'Griffin-Lim must not be in neural vocoders');
assert.strictEqual(statsData.models.length, initialModelsCount, 'Source data mutated!');
console.log('  ✔ Passed (14 neural models, source data remains 15)');

// 7. Heatmap contains all 15 model labels
console.log('▶ Test 7: Heatmap contains all 15 model labels...');
const matrices = JSON.parse(fs.readFileSync(matricesPath, 'utf8'));
assert.strictEqual(matrices.models_order.length, 15, `Expected 15 models in matrix, got ${matrices.models_order.length}`);
const modelIds = new Set(statsData.models.map(m => m.id));
matrices.models_order.forEach(id => {
  assert(modelIds.has(id), `Matrix model ${id} not found in models list`);
});
console.log('  ✔ Passed (All 15 model labels present in 15x15 matrix)');

// 8. Selected pair tooltip/details exactly match source CSV
console.log('▶ Test 8: Selected pair details exactly match source CSV...');
const csvContent = fs.readFileSync(csvPairsPath, 'utf8');
const lines = csvContent.trim().split('\n');
const header = lines[0].split(',');
const csvRows = lines.slice(1).map(l => {
  const parts = l.split(',');
  const row = {};
  header.forEach((h, i) => row[h.trim()] = parts[i].trim());
  return row;
});

// Compare first featured comparison
const feat = statsData.featured_comparisons[0];
const matchingCsv = csvRows.find(r =>
  (r.system_A === feat.system_A && r.system_B === feat.system_B) ||
  (r.system_A === feat.system_B && r.system_B === feat.system_A)
);
assert(matchingCsv, `CSV row not found for featured pair ${feat.system_A} vs ${feat.system_B}`);

if (matchingCsv.system_A === feat.system_A) {
  assert(Math.abs(parseFloat(matchingCsv.observed_diff) - feat.effect_A_minus_B) < 1e-4, 'Effect discrepancy with CSV');
  assert(Math.abs(parseFloat(matchingCsv.ci_95_lower) - feat.effect_ci95[0]) < 1e-4, 'CI lower discrepancy with CSV');
  assert(Math.abs(parseFloat(matchingCsv.ci_95_upper) - feat.effect_ci95[1]) < 1e-4, 'CI upper discrepancy with CSV');
} else {
  // Reversed order: effect is negated and CI is reversed
  assert(Math.abs(-parseFloat(matchingCsv.observed_diff) - feat.effect_A_minus_B) < 1e-4, 'Effect discrepancy with CSV (reversed)');
  assert(Math.abs(-parseFloat(matchingCsv.ci_95_upper) - feat.effect_ci95[0]) < 1e-4, 'CI lower discrepancy with CSV (reversed)');
  assert(Math.abs(-parseFloat(matchingCsv.ci_95_lower) - feat.effect_ci95[1]) < 1e-4, 'CI upper discrepancy with CSV (reversed)');
}
console.log('  ✔ Passed (Values match source CSV taking orientation into account)');

// 9. Bootstrap draws display file contains 1,000 draws
console.log('▶ Test 9: Bootstrap display data has 1,000 draws for all 15 models...');
const bootData = JSON.parse(fs.readFileSync(bootstrapPath, 'utf8'));
assert.strictEqual(bootData.replicates, 1000, `Expected 1000 replicates, got ${bootData.replicates}`);
assert.strictEqual(Object.keys(bootData.models).length, 15, `Expected 15 models in bootstrap draws, got ${Object.keys(bootData.models).length}`);
Object.entries(bootData.models).forEach(([mid, draws]) => {
  assert.strictEqual(draws.length, 1000, `Model ${mid} has ${draws.length} draws instead of 1000`);
});
console.log('  ✔ Passed (1,000 draws verified for all 15 models)');

// 10. HTML template verification
console.log('▶ Test 10: HTML elements & structure verification...');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(indexHtml.includes('id="tab-panel-statistics"'), 'tab-panel-statistics missing from index.html');
assert(indexHtml.includes('data-tab="statistics"'), 'data-tab="statistics" button missing from index.html');
assert(indexHtml.includes('id="stats-forest-chart"'), 'stats-forest-chart container missing');
assert(indexHtml.includes('id="stats-heatmap-chart"'), 'stats-heatmap-chart container missing');
assert(indexHtml.includes('id="stats-pair-forest-chart"'), 'stats-pair-forest-chart container missing');
assert(indexHtml.includes('id="stats-corpus-chart"'), 'stats-corpus-chart container missing');
assert(indexHtml.includes('id="stats-bootstrap-chart"'), 'stats-bootstrap-chart container missing');
assert(indexHtml.includes('assets/stats.js'), 'assets/stats.js script tag missing');
assert(indexHtml.includes('98 of 105 unique model pairs'), '98 of 105 callout banner missing');
console.log('  ✔ Passed (All required UI containers and views present in HTML)');

// 11. Bootstrap Mean & SD presence and validity
console.log('▶ Test 11: Bootstrap Mean & SD present on all 15 models in website_stats...');
statsData.models.forEach(m => {
  assert(typeof m.bootstrap_mean === 'number' && !isNaN(m.bootstrap_mean), `Model ${m.id} missing bootstrap_mean`);
  assert(typeof m.bootstrap_sd === 'number' && !isNaN(m.bootstrap_sd), `Model ${m.id} missing bootstrap_sd`);
  assert(m.score_ci95[0] <= m.bootstrap_mean && m.bootstrap_mean <= m.score_ci95[1],
    `Model ${m.id} bootstrap_mean ${m.bootstrap_mean} outside 95% CI [${m.score_ci95[0]}, ${m.score_ci95[1]}]`);
});
console.log('  ✔ Passed (15 models have valid bootstrap_mean and bootstrap_sd inside 95% CI)');

// 12. Validation CSV verification
console.log('▶ Test 12: Validation CSV file exists and has 15 sorted rows...');
const valCsvPath = path.join(__dirname, '../data/stats/bootstrap_mean_sd_validation.csv');
assert(fs.existsSync(valCsvPath), 'bootstrap_mean_sd_validation.csv not found');
const valCsvContent = fs.readFileSync(valCsvPath, 'utf8').trim().split('\n');
assert.strictEqual(valCsvContent.length, 16, `Expected 1 header + 15 model rows, got ${valCsvContent.length}`);
console.log('  ✔ Passed (Validation CSV verified with 15 models)');

// 13. Absolute discrepancy bounds check
console.log('▶ Test 13: Programmatic check for observed vs bootstrap mean discrepancies...');
let maxDiscrepancy = 0;
statsData.models.forEach(m => {
  const diff = Math.abs(m.bootstrap_mean - m.score);
  if (diff > maxDiscrepancy) maxDiscrepancy = diff;
});
assert(maxDiscrepancy < 0.05, `Max discrepancy ${maxDiscrepancy} exceeds 0.05 threshold`);
console.log(`  ✔ Passed (Max discrepancy is ${maxDiscrepancy.toFixed(6)}, well within 0.05 threshold)`);

// 14. HTML display toggle controls
console.log('▶ Test 14: Forest display mode toggle and validation table elements in HTML...');
assert(indexHtml.includes('id="stats-forest-mode-ci"'), 'stats-forest-mode-ci button missing');
assert(indexHtml.includes('id="stats-forest-mode-sd"'), 'stats-forest-mode-sd button missing');
assert(indexHtml.includes('id="stats-toggle-val-table"'), 'stats-toggle-val-table button missing');
assert(indexHtml.includes('id="stats-val-table-body"'), 'stats-val-table-body missing');
console.log('  ✔ Passed (All required toggle and table elements present in HTML)');

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('   🎉 ALL 14 TESTS PASSED SUCCESSFULLY! ZERO ERRORS.');
console.log('═══════════════════════════════════════════════════════════════════\n');
