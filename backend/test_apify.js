const axios = require('axios');

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
if (!APIFY_TOKEN) {
  throw new Error('Missing APIFY_API_TOKEN in environment variables');
}
const ACTOR_URL = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/runs?token=${APIFY_TOKEN}`;

async function main() {
  try {
    console.log('Starting async Apify LinkedIn search run...');
    const response = await axios.post(ACTOR_URL, {
      profileScraperMode: 'short',
      queries: ['Ajay Kumar'],
      maxItems: 4
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('APIFY RESPONSE STATUS:', response.status);
    console.log('APIFY RESPONSE DATA:', JSON.stringify(response.data, null, 2).slice(0, 1500));
  } catch (error) {
    console.error('ERROR OCCURRED:', error.response?.data || error.message);
  }
}

main();
