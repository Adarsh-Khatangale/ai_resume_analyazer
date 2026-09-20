const { extractSkillsFromText } = require('./skillTaxonomyService');

/**
 * Parses resume text into structured sections without hallucinating missing data.
 * Identifies Contact Info, Education, Skills, Experience, Projects, and Certifications.
 */
const parseResumeText = (rawText) => {
  if (!rawText) return null;

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Extract Contact Info
  const contactInfo = extractContactInfo(rawText, lines);

  // 2. Identify Section Headers and Segments
  const sections = segmentSections(rawText);

  // 3. Extract Skills (taxonomic + explicit skill section)
  const taxonomicSkills = extractSkillsFromText(rawText).map((s) => s.name);
  let sectionSkills = [];
  if (sections.skillsText) {
    sectionSkills = extractSkillsFromSection(sections.skillsText);
  }
  const allSkills = Array.from(new Set([...taxonomicSkills, ...sectionSkills]));

  // 4. Extract Education
  const education = extractEducation(sections.educationText);

  // 5. Extract Experience & Bullets
  const experience = extractExperience(sections.experienceText);

  // 6. Extract Projects
  const projects = extractProjects(sections.projectsText);

  // 7. Extract Certifications
  const certifications = extractCertifications(sections.certificationsText);

  // 8. Track Missing Sections (Strict No-Hallucination Policy)
  const missingSections = [];
  if (!sections.experienceText || experience.length === 0) missingSections.push('Work Experience');
  if (!sections.educationText || education.length === 0) missingSections.push('Education');
  if (allSkills.length === 0) missingSections.push('Skills');
  if (!sections.projectsText || projects.length === 0) missingSections.push('Projects');
  if (!sections.certificationsText || certifications.length === 0) missingSections.push('Certifications');

  return {
    contactInfo,
    skills: allSkills,
    education,
    experience,
    projects,
    certifications,
    missingSections,
    rawText,
  };
};

/**
 * Extract Contact Information via strict regex patterns
 */
const extractContactInfo = (text, lines) => {
  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}/);
  const phone = phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7 ? phoneMatch[0] : '';

  // LinkedIn
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  // GitHub
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // Portfolio / Website
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?!linkedin|github)[a-zA-Z0-9.-]+\.(?:dev|me|io|com|org|net)\b/i);
  const portfolio = portfolioMatch ? portfolioMatch[0] : '';

  // Name (heuristic: first non-header, non-contact line of resume, < 40 chars)
  let name = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('Resume') &&
      !line.includes('Curriculum') &&
      !/^(experience|education|skills|projects|summary)/i.test(line)
    ) {
      name = line;
      break;
    }
  }

  return {
    name,
    email,
    phone,
    linkedin,
    github,
    portfolio,
    location: extractLocation(text),
  };
};

const extractLocation = (text) => {
  const locationMatch = text.match(/(?:Location|Address)?\s*[:|-]?\s*([A-Za-z\s]+,\s*[A-Za-z]{2,}(?:\s+\d{5})?)/);
  if (locationMatch) return locationMatch[1].trim();
  
  // Common city, country patterns
  const cityMatch = text.match(/\b([A-Z][a-zA-Z\s]+,\s*(?:USA|India|Canada|UK|United States|Germany|Australia))\b/);
  return cityMatch ? cityMatch[1].trim() : '';
};

/**
 * Segment text into standard resume sections
 */
const segmentSections = (text) => {
  const sectionKeywords = [
    { key: 'summaryText', regex: /(?:^|\n)\s*(?:Professional\s+)?(?:Summary|Profile|Objective|About\s+Me)\b[:\s]*/i },
    { key: 'experienceText', regex: /(?:^|\n)\s*(?:Work\s+|Professional\s+|Relevant\s+)?(?:Experience|Employment|History|Work\s+History)\b[:\s]*/i },
    { key: 'educationText', regex: /(?:^|\n)\s*(?:Education|Academic\s+Background|Qualifications|Degrees)\b[:\s]*/i },
    { key: 'skillsText', regex: /(?:^|\n)\s*(?:Technical\s+Skills|Core\s+Competencies|Skills\s+&\s+Tools|Skills|Technologies)\b[:\s]*/i },
    { key: 'projectsText', regex: /(?:^|\n)\s*(?:Projects|Personal\s+Projects|Academic\s+Projects|Key\s+Projects)\b[:\s]*/i },
    { key: 'certificationsText', regex: /(?:^|\n)\s*(?:Certifications|Licenses|Credentials|Certificates)\b[:\s]*/i },
  ];

  const markers = [];

  for (const item of sectionKeywords) {
    const match = item.regex.exec(text);
    if (match) {
      markers.push({
        key: item.key,
        index: match.index,
        headerLength: match[0].length,
      });
    }
  }

  markers.sort((a, b) => a.index - b.index);

  const sections = {
    summaryText: '',
    experienceText: '',
    educationText: '',
    skillsText: '',
    projectsText: '',
    certificationsText: '',
  };

  for (let i = 0; i < markers.length; i++) {
    const current = markers[i];
    const startIndex = current.index + current.headerLength;
    const endIndex = i + 1 < markers.length ? markers[i + 1].index : text.length;
    sections[current.key] = text.substring(startIndex, endIndex).trim();
  }

  return sections;
};

const extractSkillsFromSection = (skillsText) => {
  if (!skillsText) return [];
  const tokens = skillsText
    .split(/[,•|\n;·/]+/)
    .map((s) => s.replace(/^[-*•\s]+/, '').trim())
    .filter((s) => s.length > 1 && s.length < 35 && !/^(skills|technologies|tools|languages):?$/i.test(s));
  return Array.from(new Set(tokens));
};

const extractEducation = (eduText) => {
  if (!eduText) return [];
  const lines = eduText.split('\n').map((l) => l.trim()).filter(Boolean);
  const educationList = [];

  const degreeRegex = /(?:Bachelor|Master|B\.S\.|M\.S\.|B\.Tech|M\.Tech|Ph\.D|Associate|Diploma|Degree|BSc|MSc)/i;
  const yearRegex = /(?:19|20)\d{2}(?:\s*-\s*(?:(?:19|20)\d{2}|Present))?/;

  for (const line of lines) {
    if (degreeRegex.test(line) || /University|College|Institute|School/i.test(line)) {
      const yearMatch = line.match(yearRegex);
      educationList.push({
        degree: line.replace(yearRegex, '').trim(),
        institution: line.includes('at') ? line.split('at')[1].trim() : '',
        year: yearMatch ? yearMatch[0] : '',
      });
    }
  }

  if (educationList.length === 0 && lines.length > 0) {
    educationList.push({
      degree: lines[0],
      institution: lines[1] || '',
      year: '',
    });
  }

  return educationList.slice(0, 4);
};

const extractExperience = (expText) => {
  if (!expText) return [];
  const lines = expText.split('\n').map((l) => l.trim()).filter(Boolean);
  const experienceList = [];
  let currentExp = null;

  const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(?:19|20)\d{2}\s*[-–—to]+\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(?:19|20)\d{2})/i;

  for (const line of lines) {
    const hasDate = dateRegex.test(line);
    const isBullet = /^[-•*·>]/.test(line) || /^\d+\./.test(line);

    if (hasDate && !isBullet) {
      if (currentExp) experienceList.push(currentExp);
      const dateMatch = line.match(dateRegex);
      currentExp = {
        role: line.replace(dateRegex, '').replace(/[|•–-]$/, '').trim(),
        company: '',
        duration: dateMatch ? dateMatch[0] : '',
        bullets: [],
      };
    } else if (currentExp) {
      if (isBullet) {
        currentExp.bullets.push(line.replace(/^[-•*·>\s]+/, '').trim());
      } else if (line.length > 30) {
        currentExp.bullets.push(line);
      }
    }
  }

  if (currentExp) {
    experienceList.push(currentExp);
  }

  return experienceList;
};

const extractProjects = (projText) => {
  if (!projText) return [];
  const lines = projText.split('\n').map((l) => l.trim()).filter(Boolean);
  const projects = [];

  for (const line of lines) {
    if (line.length > 5 && line.length < 80 && !/^[-•*]/.test(line)) {
      projects.push({
        name: line,
        description: '',
        technologies: [],
      });
    }
  }

  return projects.slice(0, 5);
};

const extractCertifications = (certsText) => {
  if (!certsText) return [];
  return certsText
    .split('\n')
    .map((l) => l.replace(/^[-•*·\s]+/, '').trim())
    .filter((l) => l.length > 3 && l.length < 100)
    .slice(0, 8);
};

module.exports = {
  parseResumeText,
};
