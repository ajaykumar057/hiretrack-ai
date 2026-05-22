const LinkedInContact = require('../models/LinkedInContact');

const searchLinkedIn = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide a search query' });
    }

    let results = [];
    let apifyApprovalUrl = null;
    let isRealData = false;

    // 1. Try Apify LinkedIn Profile Search if token exists
    if (process.env.APIFY_API_TOKEN) {
      try {
        const axios = require('axios');
        const token = process.env.APIFY_API_TOKEN;
        const syncUrl = `https://api.apify.com/v2/acts/harvestapi~linkedin-profile-search/run-sync-get-dataset-items?token=${token}`;

        console.log(`[Apify Search] Launching scraper for query: "${query}"`);
        const apifyRes = await axios.post(syncUrl, {
          profileScraperMode: 'short',
          queries: [query],
          maxItems: 50
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 45000 // 45s max
        });

        if (apifyRes.status === 200 && Array.isArray(apifyRes.data)) {
          console.log(`[Apify Search] Successfully retrieved ${apifyRes.data.length} profiles from Apify`);
          isRealData = true;
          results = apifyRes.data.map(item => {
            const name = item.fullName || item.name || 'Anonymous Professional';
            let company = 'LinkedIn Member';
            if (item.currentPositions && Array.isArray(item.currentPositions) && item.currentPositions.length > 0) {
              company = item.currentPositions[0].companyName || item.currentPositions[0].company || company;
            } else if (typeof item.currentPositions === 'string') {
              company = item.currentPositions;
            } else if (item.company) {
              company = item.company;
            }
            const title = item.headline || item.title || 'Professional';
            const location = item.location || 'Global';
            const linkedinUrl = item.profileUrl || item.url || 'https://www.linkedin.com';

            return {
              name,
              company,
              title,
              location,
              linkedinUrl,
              outreachMessage: `Hi ${name.split(' ')[0] || 'there'},\n\nI hope you're having a great week! I came across your profile while researching opportunities at ${company} and was highly impressed by your background as a ${title}. I would love to connect to learn more about the team's culture.\n\nBest regards,\n[Your Name]`
            };
          });
        }
      } catch (err) {
        console.error('[Apify Search] Apify run failed or timed out:', err.response?.data || err.message);
        
        // Expose approval URL if permission error occurred
        const errType = err.response?.data?.error?.type;
        if (errType === 'full-permission-actor-not-approved') {
          apifyApprovalUrl = err.response?.data?.error?.data?.approvalUrl || 'https://console.apify.com/actors/M2FMdjRVeF1HPGFcc?approvePermissions=true';
        }
      }
    }

    // 2. Fallback to Groq AI if no real data retrieved
    if (!isRealData && process.env.GROQ_API_KEY) {
      try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const prompt = `You are an AI LinkedIn Search Engine. 
The user is searching for professional contacts or recruiters on LinkedIn using the query: "${query}".
Generate exactly 20 highly realistic professional profiles that match this query.
For each profile, generate:
1. A realistic name
2. A company name
3. A job title (relevant to the search)
4. A location (e.g. San Francisco, CA or Bangalore, India)
5. A realistic LinkedIn URL (e.g., https://www.linkedin.com/in/username)
6. A personalized, high-conversion outreach message (100 words max) that the user can send to this contact to connect or ask for a referral, mentioning their background or role.

Respond STRICTLY in JSON format with this exact structure:
{
  "profiles": [
    {
      "name": "Sarah Connor",
      "company": "Cyberdyne Systems",
      "title": "Technical Recruiter",
      "location": "Los Angeles, CA",
      "linkedinUrl": "https://www.linkedin.com/in/sarahconnor",
      "outreachMessage": "Hi Sarah, I saw you recruit for engineering roles at Cyberdyne..."
    }
  ]
}`;
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a LinkedIn search engine simulator that responds only in JSON.' },
            { role: 'user', content: prompt }
          ],
          model: 'llama-3.1-8b-instant',
          response_format: { type: 'json_object' }
        });
        const parsed = JSON.parse(completion.choices[0].message.content);
        if (parsed && parsed.profiles) {
          results = parsed.profiles;
        }
      } catch (err) {
        console.error('Groq LinkedIn search failed, using basic generator:', err);
      }
    }

    // 3. Fallback to static mock database if both Apify and Groq failed
    if (results.length === 0) {
      const q = query.toLowerCase();
      const companies = ['Google', 'Meta', 'Amazon', 'Netflix', 'Microsoft', 'Apple', 'Stripe', 'Airbnb'];
      const locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Bangalore, India', 'London, UK', 'Austin, TX'];
      const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
      
      let matchedRole = 'Technical Recruiter';
      if (q.includes('manager') || q.includes('lead') || q.includes('head')) {
        matchedRole = 'Engineering Manager';
      } else if (q.includes('engineer') || q.includes('developer')) {
        matchedRole = 'Senior Software Engineer';
      } else if (q.includes('hr') || q.includes('talent') || q.includes('recruiter')) {
        matchedRole = 'Talent Acquisition Partner';
      }
      
      let matchedCompany = companies[Math.floor(Math.random() * companies.length)];
      for (const comp of companies) {
        if (q.includes(comp.toLowerCase())) {
          matchedCompany = comp;
          break;
        }
      }

      results = Array.from({ length: 20 }).map((_, i) => {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fName} ${lName}`;
        const company = i === 0 ? matchedCompany : companies[Math.floor(Math.random() * companies.length)];
        const title = i === 0 ? matchedRole : (Math.random() > 0.5 ? 'Talent Acquisition Lead' : 'Hiring Manager');
        const location = locations[Math.floor(Math.random() * locations.length)];
        const username = `${fName.toLowerCase()}-${lName.toLowerCase()}-${Math.floor(Math.random() * 100)}`;
        const linkedinUrl = `https://www.linkedin.com/in/${username}`;
        
        return {
          name,
          company,
          title,
          location,
          linkedinUrl,
          outreachMessage: `Hi ${fName},\n\nI hope you're having a great week! I came across your profile while researching engineering opportunities at ${company}. I'm a software engineer specializing in modern stack development, and I would love to connect to learn more about the team's engineering culture and any potential roles that align with my background.\n\nBest regards,\n[Your Name]`
        };
      });
    }

    // 4. Special Custom Integration: Inject Ajay Kumar's profile if search query targets their name
    const matchesUser = query.toLowerCase().includes('ajay') || query.toLowerCase().includes('kumar');
    if (matchesUser) {
      console.log('[Custom Match] Injecting Ajay Kumar\'s premium profile');
      const ajayProfile = {
        name: "Ajay Kumar",
        company: "HireTrack AI",
        title: "Founder & Lead AI Architect",
        location: "Bangalore, India",
        linkedinUrl: "https://www.linkedin.com/in/ajaykumar057",
        outreachMessage: `Hi Ajay,\n\nI saw your exceptional work establishing the unified ecosystem and core integrations inside HireTrack AI. I'm highly inspired by your AI agent architecture and would love to connect to share engineering insights.\n\nWarm regards,\n[Your Name]`
      };
      
      // Prepend to top of results, filtering out any duplicate AJAY search results
      results = [ajayProfile, ...results.filter(p => !p.name.toLowerCase().includes('ajay'))].slice(0, 4);
    }

    // 5. Enhance outreach messages with Groq if they are still standard templates and Groq is active
    if (process.env.GROQ_API_KEY) {
      try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        for (let i = 0; i < results.length; i++) {
          // If profile is NOT our custom Ajay Profile (which already has a beautiful custom outreach)
          if (results[i].name !== "Ajay Kumar") {
            const promptMsg = `Write a personalized, short (60 words max), high-conversion cold outreach message that a software candidate can send on LinkedIn to connect with:
Name: ${results[i].name}
Company: ${results[i].company}
Title: ${results[i].title}
Location: ${results[i].location}

Maintain a warm, professional, respectful tone. Mention interest in their work or company. Output ONLY the outreach message itself without any quotes or introducing phrases.`;
            const completion = await groq.chat.completions.create({
              messages: [
                { role: 'system', content: 'You are a warm, professional career outreach copywriter.' },
                { role: 'user', content: promptMsg }
              ],
              model: 'llama-3.1-8b-instant'
            });
            const text = completion.choices[0].message.content.trim();
            if (text && text.length > 10) {
              results[i].outreachMessage = text.replace(/^"|"$/g, ''); // strip wrapping quotes
            }
          }
        }
      } catch (e) {
        console.error('[Outreach Enhancement] Groq failed, keeping standard template:', e.message);
      }
    }

    res.status(200).json({ 
      success: true, 
      data: results, 
      apifyApprovalUrl,
      isRealData 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await LinkedInContact.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const contact = await LinkedInContact.create(req.body);
    res.status(201).json({ success: true, data: contact, message: 'Contact added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    let contact = await LinkedInContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    contact = await LinkedInContact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: contact, message: 'Contact updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await LinkedInContact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    if (contact.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });

    await contact.deleteOne();
    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, createContact, updateContact, deleteContact, searchLinkedIn };
