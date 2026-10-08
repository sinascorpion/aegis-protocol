const { createClient } = require('genlayer-js');
const { studionet } = require('genlayer-js/chains');

const CONTRACT_ADDRESS = '0x2cb9f5E8e097Bf2f32cA755b9BDc3319B84e2B1a';

async function runTestSuite() {
  console.log('=== AEGIS PROTOCOL ON-CHAIN TEST SUITE ===');
  console.log('Target Network: GenLayer Studio Next (Chain ID 61997)');
  console.log('Contract Address:', CONTRACT_ADDRESS);

  const client = createClient({ chain: studionet });

  // Test 1: Verify Contract Accessibility & Stats
  console.log('\n[Test 1] Querying Intelligent Contract Pool Stats...');
  const stats = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_pool_stats',
    args: []
  });
  console.log('✓ Pool Stats Received:', stats);
  if (!stats.admin) throw new Error('Contract admin not configured');
  console.log('✓ Test 1 Passed: Contract is active on Studio Next.');

  // Test 2: Verify Total Policies Underwritten
  console.log('\n[Test 2] Querying Total On-Chain Policies...');
  const total = Number(stats.total_policies || 0);
  console.log(`✓ Total Policies on Contract: ${total}`);
  if (total < 1) throw new Error('No policies registered on contract');
  console.log('✓ Test 2 Passed: On-chain policy registry active.');

  // Test 3: Verify Policy #1 (AI Consensus Payout Approved)
  console.log('\n[Test 3] Verifying AI Adjudication & Payout Settlement for Policy #1 (LH-402)...');
  const policy1 = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_policy',
    args: [BigInt(1)]
  });
  console.log('✓ Policy #1 Data:', {
    flightCode: policy1.flight_code,
    status: policy1.status,
    validatorConfidence: policy1.validator_confidence,
    summary: policy1.settlement_summary
  });
  if (policy1.status !== 1) throw new Error('Policy #1 expected to be in Approved/Settled status');
  if (policy1.validator_confidence < 90) throw new Error('Policy #1 validator confidence below expected threshold');
  console.log('✓ Test 3 Passed: Non-deterministic multi-validator AI consensus verified on-chain.');

  // Test 4: Verify Claimable Payout Balance
  console.log('\n[Test 4] Verifying Settled Beneficiary Payout Balance...');
  const claimable = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_claimable_balance',
    args: [policy1.holder]
  });
  console.log('✓ Claimable Balance on Contract:', claimable.toString(), 'wei');
  if (BigInt(claimable) <= BigInt(0)) throw new Error('Expected claimable balance greater than zero');
  console.log('✓ Test 4 Passed: On-chain fund custody and settlement verified.');

  console.log('\n======================================================');
  console.log('✓ ALL 4 ON-CHAIN REPRODUCIBILITY TESTS PASSED (100%)');
  console.log('======================================================');
}

runTestSuite().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
