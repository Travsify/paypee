const API_URL = 'https://paypee-api.onrender.com/api';
const CONCURRENT_REQUESTS = 50;
const TOTAL_ROUNDS = 2;

async function runStressTest() {
  console.log(`🚀 STARTING PAYPEE API STRESS TEST (NATIVE FETCH)`);
  console.log(`📡 URL: ${API_URL}`);
  console.log(`🔥 Load: ${CONCURRENT_REQUESTS} concurrent requests x ${TOTAL_ROUNDS} rounds\n`);

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (let r = 1; r <= TOTAL_ROUNDS; r++) {
    console.log(`[ROUND ${r}] Dispatching ${CONCURRENT_REQUESTS} requests...`);
    
    const requests = Array(CONCURRENT_REQUESTS).fill().map(async (_, i) => {
      try {
        const start = Date.now();
        const res = await fetch(`${API_URL}/health`);
        const duration = Date.now() - start;
        
        if (res.status === 200) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
        console.error(`   ❌ Req ${i+1}: FAILED - ${err.message}`);
      }
    });

    await Promise.all(requests);
  }

  const totalTime = (Date.now() - startTime) / 1000;
  const avgTime = (totalTime * 1000) / (successCount + failCount);

  console.log(`\n==========================================`);
  console.log(`🏆 STRESS TEST COMPLETE`);
  console.log(`==========================================`);
  console.log(`✅ Successes: ${successCount}`);
  console.log(`❌ Failures:  ${failCount}`);
  console.log(`⏱️ Total Time: ${totalTime.toFixed(2)}s`);
  console.log(`📊 Avg Latency: ${avgTime.toFixed(2)}ms`);
  console.log(`🚀 Requests/sec: ${((successCount + failCount) / totalTime).toFixed(2)}`);
  console.log(`==========================================\n`);
}

runStressTest().catch(console.error);
