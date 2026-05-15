const InterviewVault = require('../models/InterviewVault');

const getExperiences = async (req, res) => {
  try {
    const { company, round, difficulty, search } = req.query;
    let query = { user: req.user.id };
    if (company) query.company = { $regex: company, $options: 'i' };
    if (round) query.round = round;
    if (difficulty) query.difficulty = difficulty;
    
    const experiences = await InterviewVault.find(query).sort('-createdAt');
    res.status(200).json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const experience = await InterviewVault.create(req.body);
    res.status(201).json({ success: true, data: experience, message: 'Experience added to vault' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    let exp = await InterviewVault.findById(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    if (exp.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    exp = await InterviewVault.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: exp, message: 'Experience updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const exp = await InterviewVault.findById(req.params.id);
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
    if (exp.user.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
    
    await exp.deleteOne();
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Groq = require('groq-sdk');

// AI: Generate interview questions (mock/Groq)
const generateQuestions = async (req, res) => {
  try {
    const { role, techStack, companyType, roundType } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `You are an expert technical interviewer at a top ${companyType || 'tech'} company.
Generate interview questions for a ${role} position.
The interview round is: ${roundType}.
The candidate's tech stack is: ${techStack?.join(', ') || 'general'}.

Respond STRICTLY in JSON format with this exact structure, nothing else:
{
  "questions": [
    { "question": "The question here", "category": "Technical or HR or DSA" }
  ],
  "tips": [
    "Tip 1", "Tip 2", "Tip 3", "Tip 4"
  ]
}

Generate exactly 5 questions and exactly 4 interview tips. Make the questions specific to the role and tech stack.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer that responds only in JSON.' },
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
    console.error('Groq AI Error (Questions):', error);
    res.status(500).json({ success: false, message: 'Failed to generate questions with AI' });
  }
};

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience, generateQuestions };
