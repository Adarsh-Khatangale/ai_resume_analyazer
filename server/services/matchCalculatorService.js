const { extractSkillsFromText, getLearningLinkForSkill } = require('./skillTaxonomyService');

/**
 * Calculates Job Match Score (0-100%), skill gap analysis, and category breakdown for Radar Chart.
 */
const calculateJobMatch = (parsedResume, jobDescription, jobTitle = '') => {
  const fullJdText = `${jobTitle} ${jobDescription}`;

  // 1. Extract required skills from Job Description
  const jdSkillObjects = extractSkillsFromText(fullJdText);
  const jdSkillNames = jdSkillObjects.map((s) => s.name);

  // 2. Extract candidate skills from Resume
  const candidateSkillNames = (parsedResume.skills || []).map((s) => s.toLowerCase());

  // 3. Classify matching vs missing skills
  const matchedSkills = [];
  const missingSkills = [];

  for (const jdSkill of jdSkillObjects) {
    const isMatched = candidateSkillNames.some(
      (cs) => cs === jdSkill.name.toLowerCase() || jdSkill.name.toLowerCase().includes(cs) || cs.includes(jdSkill.name.toLowerCase())
    );

    if (isMatched) {
      matchedSkills.push({
        skill: jdSkill.name,
        category: jdSkill.category,
      });
    } else {
      const learning = getLearningLinkForSkill(jdSkill.name);
      missingSkills.push({
        skill: jdSkill.name,
        category: jdSkill.category,
        learningQuery: learning.learningQuery,
        learningUrl: learning.learningUrl,
        courseraUrl: learning.courseraUrl,
        docsUrl: learning.docsUrl,
      });
    }
  }

  // 4. Calculate Job Match Score (0-100%)
  let matchScore = 0;
  if (jdSkillNames.length > 0) {
    const skillMatchRatio = matchedSkills.length / jdSkillNames.length;
    // Job Title Keyword Alignment Bonus
    const titleTokens = jobTitle.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    const resumeLower = parsedResume.rawText ? parsedResume.rawText.toLowerCase() : '';
    let titleHitRatio = 0;
    if (titleTokens.length > 0) {
      const matchedTitleTokens = titleTokens.filter((token) => resumeLower.includes(token));
      titleHitRatio = matchedTitleTokens.length / titleTokens.length;
    }

    // Weighted composite: 80% Skill alignment, 20% Title/Contextual keyword overlap
    matchScore = Math.round(skillMatchRatio * 80 + titleHitRatio * 20);
    matchScore = Math.min(100, Math.max(5, matchScore));
  } else {
    // If JD is ultra-brief, evaluate based on resume's rich technical competencies
    const count = (parsedResume.skills || []).length;
    matchScore = Math.min(85, Math.max(30, count * 5));
  }

  // 5. Category Breakdown for Radar Chart
  const categories = ['Frontend', 'Backend', 'Database', 'DevOps / Cloud', 'AI & Data', 'Soft Skills'];
  const categoryScores = categories.map((cat) => {
    const jdInCat = jdSkillObjects.filter((s) => s.category === cat);
    const matchedInCat = matchedSkills.filter((s) => s.category === cat);

    let candidateScore = 0;
    let requiredScore = 70; // baseline expected proficiency

    if (jdInCat.length > 0) {
      requiredScore = 90;
      candidateScore = Math.round((matchedInCat.length / jdInCat.length) * 100);
    } else {
      // Check if candidate has skills in this category anyway
      const candidateCatSkills = (parsedResume.skills || []).filter((s) => {
        const item = jdSkillObjects.find((x) => x.name.toLowerCase() === s.toLowerCase());
        return item && item.category === cat;
      });
      candidateScore = candidateCatSkills.length > 0 ? Math.min(85, candidateCatSkills.length * 25) : 30;
      requiredScore = 40;
    }

    return {
      category: cat,
      candidateScore: Math.min(100, Math.max(10, candidateScore)),
      requiredScore,
      fullMark: 100,
    };
  });

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    categoryScores,
    totalRequiredSkills: jdSkillNames.length,
    totalMatchedSkills: matchedSkills.length,
  };
};

module.exports = {
  calculateJobMatch,
};
