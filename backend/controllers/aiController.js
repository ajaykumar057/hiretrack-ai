const Application = require('../models/Application');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// AI Resume Match Score
const resumeMatchScore = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) and technical recruiter. 
Analyze the compatibility between the provided Resume and Job Description.
Provide actionable suggestions to improve the resume.

Respond STRICTLY in JSON format with this exact structure, nothing else:
{
  "compatibilityScore": 85,
  "atsScore": 80,
  "matchedKeywords": ["react", "node"],
  "missingKeywords": ["aws", "docker"],
  "suggestions": ["Add more metrics to your experience section"],
  "breakdown": {
    "keywordMatch": 80,
    "readability": 90,
    "formatting": 85,
    "experience": 80
  }
}

Resume:
${resumeText}

Job Description:
${jobDescription}`;

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
    console.error('Groq AI Error (Resume Match):', error);
    res.status(500).json({ success: false, message: 'Failed to analyze resume with AI' });
  }
};

// AI Career Insights
const getCareerInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require('mongoose');
    const uid = mongoose.Types.ObjectId.createFromHexString(userId);

    const apps = await Application.find({ user: userId }).sort('-createdAt').limit(20);
    
    if (apps.length === 0) {
      return res.status(200).json({ success: true, data: [
        { type: 'info', icon: '🚀', title: 'Get Started', message: 'Start tracking your applications to unlock AI-powered insights about your job search performance.' }
      ]});
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const appsSummary = apps.map(a => `- ${a.company}: ${a.role} (${a.status}) applied on ${a.appliedDate ? new Date(a.appliedDate).toLocaleDateString() : 'unknown'}`).join('\n');

    const prompt = `You are an expert career coach AI. Analyze the user's recent job applications and provide exactly 3-4 highly personalized and actionable insights or tips based on their data. Look at their success rate, the roles they apply for, and the status of applications.

The user's recent applications:
${appsSummary}

Respond STRICTLY in JSON format with the following structure:
{
  "insights": [
    {
      "type": "info" | "success" | "warning" | "tip",
      "icon": "🚀" | "🎯" | "📊" | "💬" | "🏢" | "📅" | "🔗" | "⏰",
      "title": "Short title",
      "message": "Detailed insight message (1-2 sentences)"
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career coach that responds only in JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content);

    res.status(200).json({ success: true, data: result.insights });
  } catch (error) {
    console.error('Groq AI Error (Insights):', error);
    res.status(500).json({ success: false, message: 'Failed to generate career insights with AI' });
  }
};

module.exports = { resumeMatchScore, getCareerInsights };
