const axios = require('axios');

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
if (!APIFY_TOKEN) {
  throw new Error('Missing APIFY_API_TOKEN in environment variables');
}
const syncUrl = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

async function run() {
  console.log('Sending sync search request to Apify...');
  try {
    const res = await axios.post(syncUrl, {
      mode: 'Short',
      searchQuery: 'Software Engineer in Bangalore',
      maxItems: 2
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 45000
    });

    console.log('STATUS:', res.status);
    console.log('DATA TYPE:', Array.isArray(res.data) ? 'Array' : typeof res.data);
    if (Array.isArray(res.data)) {
      console.log('COUNT:', res.data.length);
      console.log('FIRST ITEM SCHEMA KEYS:', Object.keys(res.data[0] || {}));
      console.log('FIRST ITEM DATA:', JSON.stringify(res.data[0], null, 2));
    } else {
      console.log('RESPONSE DATA:', res.data);
    }
  } catch (err) {
    console.error('ERROR OCCURRED:', err.response?.data || err.message);
  }
}

run();
