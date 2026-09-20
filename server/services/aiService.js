/**
 * AI & Deterministic NLP Service
 * Generates tailored strengths, weaknesses, and concrete "Instead of this... Write this..." suggestions.
 * Defaults to a high-impact deterministic engine, with optional OpenAI/Gemini integration if keys exist.
 */

const generateSuggestions = async (parsedResume, jobTitle, jobDescription, matchedSkills, missingSkills) => {
  // If OpenAI key is present, attempt LLM call with deterministic fallback
  if (process.env.OPENAI_API_KEY) {
    try {
      return await generateOpenAISuggestions(parsedResume, jobTitle, jobDescription, matchedSkills, missingSkills);
    } catch (err) {
      console.warn('[AI Service] OpenAI API error, using deterministic NLP engine:', err.message);
    }
  }

  // Deterministic NLP Suggestion Engine
  return generateDeterministicSuggestions(parsedResume, jobTitle, matchedSkills, missingSkills);
};

const generateDeterministicSuggestions = (parsedResume, jobTitle, matchedSkills, missingSkills) => {
  const suggestions = [];

  // Extract user's actual bullets if present
  let candidateBullets = [];
  if (parsedResume.experience) {
    for (const exp of parsedResume.experience) {
      if (exp.bullets && exp.bullets.length > 0) {
        candidateBullets.push(...exp.bullets);
      }
    }
  }

  // Top missing skill to suggest embedding
  const topMissing = missingSkills.slice(0, 3).map((s) => s.skill);

  // Pattern 1: Passive "Worked on" / "Responsible for" rewrite
  const passiveBullet = candidateBullets.find((b) =>
    /\b(worked on|responsible for|helped with|participated in|handled)\b/i.test(b)
  );

  if (passiveBullet) {
    const cleanOrig = passiveBullet.replace(/^[•\-*]\s*/, '').trim();
    suggestions.push({
      section: 'Work Experience',
      insteadOf: cleanOrig,
      writeThis: `Spearheaded design and delivery of critical ${jobTitle || 'software'} modules, boosting system reliability by 24% and accelerating release cycles across cross-functional teams.`,
      rationale: 'Replaces passive responsibility phrasing with "Spearheaded" and embeds measurable efficiency improvements.',
    });
  } else {
    suggestions.push({
      section: 'Work Experience',
      insteadOf: 'Responsible for maintaining web application and updating features.',
      writeThis: `Engineered and deployed 15+ modern web components using ${matchedSkills[0]?.skill || 'React.js'}, driving a 30% reduction in user drop-off rate.`,
      rationale: 'Uses active verb "Engineered", references core technical skills, and attributes clear business outcome (30% drop-off reduction).',
    });
  }

  // Pattern 2: Missing Skill Integration Suggestion
  if (topMissing.length > 0) {
    suggestions.push({
      section: 'Projects / Experience',
      insteadOf: 'Built a full stack project with database integration and authentication.',
      writeThis: `Architected an end-to-end full-stack platform incorporating ${topMissing.join(' and ')}, featuring containerized deployments and automated CI/CD testing pipelines.`,
      rationale: `Directly targets key job requirement (${topMissing.join(', ')}), demonstrating practical implementation and modern DevOps practices.`,
    });
  }

  // Pattern 3: Quantifiable Metrics & Scale
  suggestions.push({
    section: 'Achievements',
    insteadOf: 'Improved database performance and fixed query bugs.',
    writeThis: 'Optimized complex query execution paths and implemented Redis caching, reducing p95 API response times from 850ms to 120ms (85% speedup).',
    rationale: 'Replaces vague "improved" with concrete before-and-after benchmarks (850ms to 120ms), following the Google XYZ resume standard.',
  });

  // Pattern 4: Leadership / Collaboration
  suggestions.push({
    section: 'Leadership & Collaboration',
    insteadOf: 'Collaborated with team members during daily standup meetings.',
    writeThis: 'Championed Agile development sprints and code reviews for a team of 6 engineers, enhancing team velocity by 20% and reducing post-release defect rates.',
    rationale: 'Demonstrates mentorship and proactive engineering standards rather than passive attendance.',
  });

  return suggestions;
};

/**
 * Optional OpenAI API Call (Strictly typed JSON output)
 */
const generateOpenAISuggestions = async (parsedResume, jobTitle, jobDescription, matchedSkills, missingSkills) => {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are a Principal Technical Recruiter and ATS Optimization Expert.
Analyze this resume for target role: "${jobTitle}".
Job Description:
${jobDescription.substring(0, 1500)}

Candidate Skills: ${(parsedResume.skills || []).slice(0, 15).join(', ')}
Missing Skills: ${missingSkills.slice(0, 5).map((s) => s.skill).join(', ')}

Provide 3 concrete, high-impact bullet improvements in JSON format matching this schema:
[
  {
    "section": "Work Experience",
    "insteadOf": "Weak passive example bullet from candidate or standard resume",
    "writeThis": "Rewritten high-impact bullet following the Google XYZ formula (Accomplished [X] as measured by [Y], by doing [Z])",
    "rationale": "Clear explanation of why this change boosts ATS score and hiring manager interest"
  }
]`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  const content = response.choices[0].message.content.trim();
  const parsed = JSON.parse(content.replace(/```json|```/g, ''));
  return parsed;
};

module.exports = {
  generateSuggestions,
};
