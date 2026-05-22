const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an expert technical interviewer that responds only in JSON.' },
        { role: 'user', content: 'You are an expert technical interviewer at a top MNC company.\nGenerate interview questions for a Data Scientist position.\nThe interview round is: Technical Round 1.\nThe candidate\'s tech stack is: Ai ml.\n\nRespond STRICTLY in JSON format with this exact structure, nothing else:\n{\n  "questions": [\n    { "question": "The question here", "category": "Technical or HR or DSA" }\n  ],\n  "tips": [\n    "Tip 1", "Tip 2", "Tip 3", "Tip 4"\n  ]\n}\n\nGenerate exactly 5 questions and exactly 4 interview tips. Make the questions specific to the role and tech stack.' }
      ],
      model: 'llama-3.1-8b-instant',
      response_format: { type: 'json_object' }
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('ERROR:', error);
  }
}
main();
