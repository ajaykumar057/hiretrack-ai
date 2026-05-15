const Groq = require('groq-sdk');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const axios = require('axios');

const analyzeResume = async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
      }
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else if (req.body.resumeId) {
      const resume = await Resume.findById(req.body.resumeId);
      if (!resume) return res.status(404).json({ success: false, message: 'Saved resume not found' });
      if (resume.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
      
      const response = await axios.get(resume.url, { responseType: 'arraybuffer' });
      const pdfData = await pdfParse(response.data);
      resumeText = pdfData.text;
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ success: false, message: 'Please provide a resume PDF or text' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const targetRole = req.body.targetRole || 'Software Engineer';

    const prompt = `You are an expert AI Career Coach and ATS Simulator.
Analyze this resume for the role of: ${targetRole}.

Respond STRICTLY in JSON format exactly like this:
{
  "atsScore": 82,
  "careerPotential": 84,
  "strengths": ["Strong technical skills", "Good project descriptions"],
  "weaknesses": ["Missing quantitative metrics", "Format could be better"],
  "missingSkills": ["Docker", "CI/CD", "System Design"],
  "keywordAnalysis": [
    { "keyword": "React", "status": "Found" },
    { "keyword": "Node.js", "status": "Found" },
    { "keyword": "Leadership", "status": "Missing" }
  ],
  "roleCompatibility": [
    { "role": "Frontend Engineer", "match": 88 },
    { "role": "Backend Engineer", "match": 75 },
    { "role": "Full Stack Engineer", "match": 82 }
  ],
  "industryReadiness": {
    "Frontend": 85,
    "Backend": 70,
    "Architecture": 60,
    "AI_ML": 40
  },
  "aiInsights": [
    "Your resume is heavily focused on frontend technologies.",
    "Adding quantified achievements may improve ATS score."
  ],
  "suggestions": [
    "Add measurable achievements to your latest role",
    "Include links to deployed projects"
  ]
}

Resume text:
${resumeText.substring(0, 4000)} // Limiting to prevent token limits
`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an ATS analyzer that responds only in JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Resume Intelligence Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to analyze resume' });
  }
};

module.exports = { analyzeResume };
