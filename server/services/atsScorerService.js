/**
 * ATS-Style Scorer Service
 * Computes an estimated ATS score (0-100) based on section completeness,
 * formatting readability, bullet point structure, action verbs, and quantifiable metrics.
 */

const ACTION_VERBS = [
  'spearheaded', 'architected', 'engineered', 'developed', 'designed', 'built',
  'optimized', 'implemented', 'accelerated', 'automated', 'streamlined',
  'reduced', 'increased', 'generated', 'led', 'mentored', 'delivered',
  'refactored', 'collaborated', 'orchestrated', 'deployed', 'scaled', 'maintained'
];

const calculateAtsScore = (parsedResume, rawText) => {
  let sectionPresenceScore = 0;
  let formattingScore = 0;
  let metricImpactScore = 0;
  let keywordScore = 0;

  const strengths = [];
  const weaknesses = [];

  // ================= 1. SECTION COMPLETENESS (Max 30 pts) =================
  const contact = parsedResume.contactInfo || {};
  if (contact.email && contact.phone) {
    sectionPresenceScore += 6;
    strengths.push('Complete contact information identified (Email and Phone found).');
  } else {
    weaknesses.push('Incomplete contact details. Ensure both email and phone number are clearly visible at the top.');
  }

  if (contact.linkedin || contact.github || contact.portfolio) {
    sectionPresenceScore += 2;
  }

  if (parsedResume.experience && parsedResume.experience.length > 0) {
    sectionPresenceScore += 8;
  } else {
    weaknesses.push('No standard Work Experience section detected. Use clear headers like "Work Experience" or "Professional Experience".');
  }

  if (parsedResume.education && parsedResume.education.length > 0) {
    sectionPresenceScore += 6;
  } else {
    weaknesses.push('No Education section detected. Standard ATS parsers look for explicit degree and institution names.');
  }

  if (parsedResume.skills && parsedResume.skills.length >= 5) {
    sectionPresenceScore += 5;
    strengths.push(`Strong skills section with ${parsedResume.skills.length} recognized competencies.`);
  } else {
    weaknesses.push('Low technical skill count. List core competencies under a dedicated "Skills" header.');
  }

  if ((parsedResume.projects && parsedResume.projects.length > 0) || (parsedResume.certifications && parsedResume.certifications.length > 0)) {
    sectionPresenceScore += 3;
    strengths.push('Dedicated projects or certifications section adds industry credibility.');
  }

  // ================= 2. FORMATTING & READABILITY (Max 25 pts) =================
  const words = rawText.trim().split(/\s+/);
  const wordCount = words.length;

  if (wordCount >= 300 && wordCount <= 1200) {
    formattingScore += 12;
    strengths.push(`Optimal resume length (${wordCount} words) suitable for single or two-page ATS scanning.`);
  } else if (wordCount < 300) {
    formattingScore += 5;
    weaknesses.push(`Resume text is brief (${wordCount} words). Add detailed project or work impact bullets.`);
  } else {
    formattingScore += 6;
    weaknesses.push(`Resume text is long (${wordCount} words). Condense older experiences to keep it under 2 pages.`);
  }

  // Bullet point count
  let allBullets = [];
  if (parsedResume.experience) {
    for (const exp of parsedResume.experience) {
      if (exp.bullets && exp.bullets.length > 0) {
        allBullets.push(...exp.bullets);
      }
    }
  }

  // Also check raw lines starting with bullets
  const rawBulletMatches = rawText.match(/^[-•*·>]\s+.+$/gm) || [];
  const totalBullets = Math.max(allBullets.length, rawBulletMatches.length);

  if (totalBullets >= 6) {
    formattingScore += 13;
    strengths.push(`Good structure with ${totalBullets} bulleted achievement statements.`);
  } else if (totalBullets >= 2) {
    formattingScore += 7;
    weaknesses.push('Limited bullet points detected. ATS parsers strongly favor concise bulleted achievements over paragraphs.');
  } else {
    formattingScore += 2;
    weaknesses.push('No bullet points found. Break down your experience into bulleted impact points.');
  }

  // ================= 3. METRIC IMPACT & ACTION VERBS (Max 25 pts) =================
  const rawLower = rawText.toLowerCase();
  
  // Count action verbs
  let actionVerbHits = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(rawLower)) {
      actionVerbHits++;
    }
  }

  if (actionVerbHits >= 5) {
    metricImpactScore += 12;
    strengths.push('Strong use of proactive, results-oriented action verbs throughout experience.');
  } else if (actionVerbHits >= 2) {
    metricImpactScore += 7;
  } else {
    metricImpactScore += 3;
    weaknesses.push('Weak action verb usage. Begin bullets with powerful verbs like Spearheaded, Engineered, Automated, or Optimized.');
  }

  // Count quantifiable numbers / metrics (% , $, numbers, 'X%', '2x', '30%')
  const metricMatches = rawText.match(/(\b\d+%\b|\$\d+[\d,]*|\b\d+x\b|\b\d{2,}\b\+?|\b\d+\s*(?:users|clients|customers|ms|seconds|minutes|hours|days))/gi) || [];
  const uniqueMetrics = new Set(metricMatches).size;

  if (uniqueMetrics >= 4) {
    metricImpactScore += 13;
    strengths.push(`Excellent quantifiable impact with ${uniqueMetrics} measurable results (% improvements, scale metrics).`);
  } else if (uniqueMetrics >= 1) {
    metricImpactScore += 7;
    weaknesses.push('Only a few quantifiable metrics found. Use numbers to prove impact (e.g., "Reduced latency by 35%").');
  } else {
    metricImpactScore += 2;
    weaknesses.push('Missing measurable outcomes. Quantify achievements with percentages, revenue, latency, or team scale.');
  }

  // ================= 4. SKILL & CONTENT DENSITY (Max 20 pts) =================
  const recognizedCount = (parsedResume.skills || []).length;
  if (recognizedCount >= 10) {
    keywordScore += 20;
  } else if (recognizedCount >= 6) {
    keywordScore += 14;
  } else {
    keywordScore += 8;
  }

  const totalAtsScore = Math.min(
    100,
    Math.max(15, sectionPresenceScore + formattingScore + metricImpactScore + keywordScore)
  );

  return {
    atsScore: totalAtsScore,
    atsDetails: {
      formattingScore: Math.round((formattingScore / 25) * 100),
      sectionPresenceScore: Math.round((sectionPresenceScore / 30) * 100),
      metricImpactScore: Math.round((metricImpactScore / 25) * 100),
      keywordScore: Math.round((keywordScore / 20) * 100),
      lengthWordCount: wordCount,
      bulletCount: totalBullets,
      disclaimer: 'This is an estimated ATS-style score based on standard parser behavior.',
    },
    strengths: strengths.slice(0, 5),
    weaknesses: weaknesses.slice(0, 5),
  };
};

module.exports = {
  calculateAtsScore,
  ACTION_VERBS,
};
