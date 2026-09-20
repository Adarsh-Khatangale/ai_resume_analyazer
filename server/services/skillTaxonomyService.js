/**
 * Comprehensive Skill Taxonomy Database
 * Maps standard skill names, categories, regex aliases, and high-impact learning queries.
 */

const SKILL_TAXONOMY = [
  // ================= FRONTEND =================
  { name: 'React.js', category: 'Frontend', aliases: ['react', 'reactjs', 'react.js', 'react js'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'vue.js', 'vue 3', 'vue 2'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs', 'angular 2+', 'angular.js'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next.js', 'next js'] },
  { name: 'TypeScript', category: 'Frontend', aliases: ['typescript', 'ts'] },
  { name: 'JavaScript', category: 'Frontend', aliases: ['javascript', 'js', 'es6', 'es6+', 'vanilla js'] },
  { name: 'HTML5', category: 'Frontend', aliases: ['html', 'html5', 'semantic html'] },
  { name: 'CSS3', category: 'Frontend', aliases: ['css', 'css3', 'modern css'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap', 'bootstrap 5', 'bootstrap 4'] },
  { name: 'Sass / SCSS', category: 'Frontend', aliases: ['sass', 'scss'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { name: 'Zustand', category: 'Frontend', aliases: ['zustand'] },
  { name: 'GraphQL', category: 'Frontend', aliases: ['graphql', 'apollo client', 'apollo'] },
  { name: 'Webpack / Vite', category: 'Frontend', aliases: ['vite', 'webpack', 'parcel', 'turbopack', 'rollup'] },
  { name: 'Responsive Design', category: 'Frontend', aliases: ['responsive web design', 'mobile first design', 'responsive design'] },
  { name: 'Web Accessibility (a11y)', category: 'Frontend', aliases: ['accessibility', 'a11y', 'wcag', 'aria'] },
  { name: 'Framer Motion', category: 'Frontend', aliases: ['framer motion', 'framer-motion'] },

  // ================= BACKEND =================
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'nodejs', 'node.js', 'node js'] },
  { name: 'Express.js', category: 'Backend', aliases: ['express', 'expressjs', 'express.js', 'express js'] },
  { name: 'NestJS', category: 'Backend', aliases: ['nestjs', 'nest.js', 'nest js'] },
  { name: 'Python', category: 'Backend', aliases: ['python', 'python 3', 'py'] },
  { name: 'Django', category: 'Backend', aliases: ['django', 'django rest framework', 'drf'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fastapi', 'fast api'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask'] },
  { name: 'Java', category: 'Backend', aliases: ['java', 'core java', 'java 8', 'java 11', 'java 17'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring boot', 'springboot', 'spring framework'] },
  { name: 'C# / .NET', category: 'Backend', aliases: ['c#', '.net', '.net core', 'dotnet', 'asp.net', 'c sharp'] },
  { name: 'Go (Golang)', category: 'Backend', aliases: ['golang', 'go lang', 'go'] },
  { name: 'Ruby on Rails', category: 'Backend', aliases: ['ruby', 'ruby on rails', 'rails'] },
  { name: 'PHP / Laravel', category: 'Backend', aliases: ['php', 'laravel', 'symfony'] },
  { name: 'RESTful APIs', category: 'Backend', aliases: ['rest api', 'restful api', 'rest apis', 'restful web services', 'rest'] },
  { name: 'Microservices', category: 'Backend', aliases: ['microservices', 'micro-services', 'microservice architecture'] },
  { name: 'gRPC', category: 'Backend', aliases: ['grpc', 'protocol buffers', 'protobuf'] },
  { name: 'WebSockets', category: 'Backend', aliases: ['websocket', 'websockets', 'socket.io'] },

  // ================= DATABASE =================
  { name: 'MongoDB', category: 'Database', aliases: ['mongodb', 'mongo', 'mongoose', 'nosql'] },
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgresql', 'postgres', 'psql'] },
  { name: 'MySQL', category: 'Database', aliases: ['mysql', 'mariadb'] },
  { name: 'Redis', category: 'Database', aliases: ['redis', 'caching', 'redis cache'] },
  { name: 'SQL', category: 'Database', aliases: ['sql', 'relational database', 'rdbms'] },
  { name: 'SQLite', category: 'Database', aliases: ['sqlite'] },
  { name: 'Elasticsearch', category: 'Database', aliases: ['elasticsearch', 'elastic search', 'elk stack'] },
  { name: 'DynamoDB', category: 'Database', aliases: ['dynamodb', 'amazon dynamodb'] },
  { name: 'Cassandra', category: 'Database', aliases: ['cassandra', 'apache cassandra'] },
  { name: 'Prisma / TypeORM', category: 'Database', aliases: ['prisma', 'typeorm', 'hibernate', 'sequelize'] },

  // ================= CLOUD & DEVOPS =================
  { name: 'Docker', category: 'DevOps / Cloud', aliases: ['docker', 'containerization', 'containers'] },
  { name: 'Kubernetes', category: 'DevOps / Cloud', aliases: ['kubernetes', 'k8s'] },
  { name: 'AWS', category: 'DevOps / Cloud', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloudformation'] },
  { name: 'Google Cloud Platform (GCP)', category: 'DevOps / Cloud', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { name: 'Microsoft Azure', category: 'DevOps / Cloud', aliases: ['azure', 'microsoft azure'] },
  { name: 'CI/CD Pipelines', category: 'DevOps / Cloud', aliases: ['ci/cd', 'cicd', 'github actions', 'gitlab ci', 'jenkins'] },
  { name: 'Terraform', category: 'DevOps / Cloud', aliases: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'Linux / Bash', category: 'DevOps / Cloud', aliases: ['linux', 'unix', 'bash', 'shell scripting', 'ubuntu'] },
  { name: 'Nginx', category: 'DevOps / Cloud', aliases: ['nginx', 'apache web server', 'reverse proxy'] },
  { name: 'Monitoring (Prometheus/Grafana)', category: 'DevOps / Cloud', aliases: ['prometheus', 'grafana', 'datadog', 'new relic'] },

  // ================= AI, ML & DATA =================
  { name: 'Machine Learning', category: 'AI & Data', aliases: ['machine learning', 'ml', 'deep learning'] },
  { name: 'Artificial Intelligence (AI)', category: 'AI & Data', aliases: ['artificial intelligence', 'ai', 'generative ai', 'genai', 'llm', 'llms'] },
  { name: 'PyTorch', category: 'AI & Data', aliases: ['pytorch', 'torch'] },
  { name: 'TensorFlow', category: 'AI & Data', aliases: ['tensorflow', 'keras'] },
  { name: 'Natural Language Processing (NLP)', category: 'AI & Data', aliases: ['nlp', 'natural language processing', 'transformers', 'bert'] },
  { name: 'OpenAI API / LangChain', category: 'AI & Data', aliases: ['openai', 'openai api', 'langchain', 'llamaindex', 'rag'] },
  { name: 'Pandas / NumPy', category: 'AI & Data', aliases: ['pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn'] },
  { name: 'Data Analysis', category: 'AI & Data', aliases: ['data analysis', 'data science', 'exploratory data analysis'] },

  // ================= TESTING & TOOLS =================
  { name: 'Git & GitHub', category: 'Tools & Testing', aliases: ['git', 'github', 'gitlab', 'version control'] },
  { name: 'Jest / Vitest', category: 'Tools & Testing', aliases: ['jest', 'vitest', 'unit testing'] },
  { name: 'Cypress / Playwright', category: 'Tools & Testing', aliases: ['cypress', 'playwright', 'selenium', 'e2e testing'] },
  { name: 'Postman / Swagger', category: 'Tools & Testing', aliases: ['postman', 'swagger', 'openapi'] },
  { name: 'Jira / Agile / Scrum', category: 'Tools & Testing', aliases: ['jira', 'agile', 'scrum', 'kanban', 'sprint'] },
  { name: 'Figma', category: 'Tools & Testing', aliases: ['figma', 'ui/ux', 'wireframing', 'prototyping'] },

  // ================= SOFT SKILLS & LEADERSHIP =================
  { name: 'Problem Solving', category: 'Soft Skills', aliases: ['problem solving', 'critical thinking', 'analytical skills'] },
  { name: 'Cross-Functional Collaboration', category: 'Soft Skills', aliases: ['collaboration', 'cross-functional', 'team player', 'teamwork'] },
  { name: 'Communication Skills', category: 'Soft Skills', aliases: ['communication', 'verbal communication', 'written communication', 'presentation'] },
  { name: 'Leadership & Mentorship', category: 'Soft Skills', aliases: ['leadership', 'mentoring', 'mentorship', 'team lead', 'code reviews'] },
  { name: 'Time Management', category: 'Soft Skills', aliases: ['time management', 'prioritization', 'multitasking'] },
  { name: 'Adaptability', category: 'Soft Skills', aliases: ['adaptability', 'fast learner', 'growth mindset'] },
];

/**
 * Extracts recognized skills from text using boundary-safe regex matching
 * @param {string} text
 * @returns {Array<{ name: string, category: string }>}
 */
const extractSkillsFromText = (text) => {
  if (!text) return [];

  const lowerText = ' ' + text.toLowerCase() + ' ';
  const detectedSkills = [];
  const seenSkillNames = new Set();

  for (const item of SKILL_TAXONOMY) {
    let matched = false;

    for (const alias of item.aliases) {
      // Escape special characters for regex
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Look for boundary-safe match (spaces, punctuation, newlines)
      const pattern = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');

      if (pattern.test(lowerText)) {
        matched = true;
        break;
      }
    }

    if (matched && !seenSkillNames.has(item.name)) {
      seenSkillNames.add(item.name);
      detectedSkills.push({
        name: item.name,
        category: item.category,
      });
    }
  }

  return detectedSkills;
};

/**
 * Builds learning resource URL & query for a skill
 * @param {string} skillName
 */
const getLearningLinkForSkill = (skillName) => {
  const query = `${encodeURIComponent(skillName)}+tutorial+for+beginners`;
  return {
    learningQuery: `${skillName} tutorial for beginners`,
    learningUrl: `https://www.youtube.com/results?search_query=${query}`,
    courseraUrl: `https://www.coursera.org/search?query=${encodeURIComponent(skillName)}`,
    docsUrl: `https://www.google.com/search?q=${encodeURIComponent(skillName)}+official+documentation`,
  };
};

module.exports = {
  SKILL_TAXONOMY,
  extractSkillsFromText,
  getLearningLinkForSkill,
};
