const assert = require('assert');
const { extractSkillsFromText, getLearningLinkForSkill } = require('../services/skillTaxonomyService');
const { parseResumeText } = require('../services/resumeParserService');
const { calculateAtsScore } = require('../services/atsScorerService');
const { calculateJobMatch } = require('../services/matchCalculatorService');
const { generateSuggestions } = require('../services/aiService');

async function runTests() {
  console.log('🧪 Starting AI Resume Analyzer Test Suite...\n');

  // Test 1: Skill Taxonomy Extraction
  console.log('Test 1: Skill Taxonomy Extraction');
  const sampleText = 'Looking for a Senior Full Stack Engineer experienced with React.js, TypeScript, Node.js, MongoDB, Docker, and AWS.';
  const extracted = extractSkillsFromText(sampleText);
  const skillNames = extracted.map((s) => s.name);
  assert(skillNames.includes('React.js'), 'Should detect React.js');
  assert(skillNames.includes('TypeScript'), 'Should detect TypeScript');
  assert(skillNames.includes('Node.js'), 'Should detect Node.js');
  assert(skillNames.includes('MongoDB'), 'Should detect MongoDB');
  assert(skillNames.includes('Docker'), 'Should detect Docker');
  assert(skillNames.includes('AWS'), 'Should detect AWS');
  console.log('  ✅ Extracted skills correctly: ' + skillNames.join(', '));

  // Test 2: Dynamic Learning Link Generation
  console.log('\nTest 2: Dynamic Learning Link Generation');
  const learning = getLearningLinkForSkill('Docker');
  assert(learning.learningUrl.includes('youtube.com'), 'Should provide valid YouTube search URL');
  assert(learning.learningQuery.includes('Docker'), 'Query should reference skill name');
  console.log('  ✅ Generated learning link: ' + learning.learningUrl);

  // Test 3: Resume Section Segmentation & Contact Info (No Hallucinations)
  console.log('\nTest 3: Resume Section Parsing (Non-Hallucinatory)');
  const sampleResume = `
Jane Doe
jane.doe@example.com | +1 (555) 234-5678 | San Francisco, CA
https://linkedin.com/in/janedoe | https://github.com/janedoe

PROFESSIONAL SUMMARY
Senior Software Engineer with 5+ years of experience building scalable distributed systems and cloud services.

WORK EXPERIENCE
Senior Full Stack Engineer at TechCorp (2021 - Present)
• Spearheaded migration from legacy monolith to microservices using Node.js and Docker, reducing deployment cycle time by 45%.
• Architected high-performance React frontends with TypeScript, boosting conversion rate by 22% across 500k monthly active users.
• Optimized PostgreSQL query performance, cutting p95 database response latency by 35%.

EDUCATION
Bachelor of Science in Computer Science at University of California, Berkeley (2017 - 2021)

SKILLS
React.js, TypeScript, Node.js, Express.js, PostgreSQL, Docker, AWS, Git, CI/CD
`;

  const parsed = parseResumeText(sampleResume);
  assert.strictEqual(parsed.contactInfo.email, 'jane.doe@example.com');
  assert(parsed.contactInfo.phone.length > 7, 'Phone number should be parsed');
  assert(parsed.skills.includes('React.js'), 'Should parse React.js');
  assert(parsed.skills.includes('PostgreSQL'), 'Should parse PostgreSQL');
  assert(parsed.experience.length > 0, 'Experience section should be found');
  assert.strictEqual(parsed.missingSections.includes('Work Experience'), false, 'Work Experience should not be marked missing');
  assert.strictEqual(parsed.missingSections.includes('Certifications'), true, 'Certifications should be flagged missing without hallucination');
  console.log('  ✅ Section segmentation verified without hallucination.');

  // Test 4: ATS Score & Metric Impact
  console.log('\nTest 4: ATS Scoring & Action Verbs');
  const ats = calculateAtsScore(parsed, sampleResume);
  assert(ats.atsScore >= 70, `Expected high ATS score for quality resume, received: ${ats.atsScore}`);
  assert(ats.atsDetails.metricImpactScore > 50, 'Should award high score for % numbers and metrics');
  assert(ats.strengths.length > 0, 'Should identify strengths');
  console.log(`  ✅ ATS Score calculated: ${ats.atsScore}/100 with ${ats.strengths.length} strengths.`);

  // Test 5: Job Match Score & Skill Gap Analysis
  console.log('\nTest 5: Job Match & Skill Gaps');
  const jobDescription = `
We are looking for a Senior Full Stack Engineer.
Must have deep experience with React.js, TypeScript, Node.js, and Kubernetes.
Experience with GraphQL and AWS is highly desirable.
`;
  const match = calculateJobMatch(parsed, jobDescription, 'Senior Full Stack Engineer');
  assert(match.matchScore > 50, `Expected strong match score, got: ${match.matchScore}%`);
  const matchedSkillNames = match.matchedSkills.map((s) => s.skill);
  const missingSkillNames = match.missingSkills.map((s) => s.skill);
  assert(matchedSkillNames.includes('React.js'), 'React.js should be matched');
  assert(matchedSkillNames.includes('TypeScript'), 'TypeScript should be matched');
  assert(missingSkillNames.includes('Kubernetes'), 'Kubernetes should be identified as missing skill');
  console.log(`  ✅ Match Score: ${match.matchScore}%. Matched: ${matchedSkillNames.join(', ')}. Missing: ${missingSkillNames.join(', ')}`);

  // Test 6: AI / Deterministic STAR Suggestions
  console.log('\nTest 6: AI / Deterministic Suggestions Generation');
  const suggestions = await generateSuggestions(parsed, 'Senior Full Stack Engineer', jobDescription, match.matchedSkills, match.missingSkills);
  assert(suggestions.length > 0, 'Should produce at least one suggestion');
  assert(suggestions[0].insteadOf && suggestions[0].writeThis, 'Should follow "Instead of this... Write this..." format');
  console.log('  ✅ Generated Suggestions:');
  console.log(`     [Instead of]: "${suggestions[0].insteadOf}"`);
  console.log(`     [Write this]: "${suggestions[0].writeThis}"`);

  console.log('\n🎉 ALL 6 TEST SUITES PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
