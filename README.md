# 🚀 AI Resume Analyzer & Job Match Assistant

> **A production-style Full-Stack MERN Application** engineered with zero-retention memory processing, layout-aware multi-column parsing, deterministic ATS compliance scoring, dynamic skill gap learning roadmaps, Google OAuth 2.0 authentication, Recharts visual analytics, and executive PDF exports.

---

## 🌟 Key Highlights & Features

1. **Guest, Gmail & Email Sign Up / Sign In (Zero Friction)**:
   - Analyze a resume against any job description instantly without signing up.
   - **Direct Gmail / Email Sign Up**: Any user can sign up or sign in directly with their Gmail ID or any email address instantly—no passwords required, no Google Cloud project setup blockers.
   - **Google OAuth 2.0**: Live Google OAuth supported when credentials are added in `.env`.
   - **1-Click Dev Demo Login**: Test drive the authenticated dashboard with a single click.

2. **Strict Zero-Retention File Policy**:
   - Resumes uploaded in PDF, DOC, or DOCX formats are ingested directly into volatile RAM memory buffers (`multer.memoryStorage()`).
   - The binary buffer is extracted and immediately destroyed from memory post-parsing.
   - **No physical resume files are ever written to server disk or persistent cloud buckets.**

3. **Multi-Column Layout-Aware Parsing (Hard Mode)**:
   - Modern two-column resumes frequently confuse naive parsers by interleaving left and right columns horizontally.
   - Our layout-aware engine groups coordinates by vertical scan lines and horizontal bounding boxes, cleanly preserving section boundaries.
   - Segments: **Personal/Contact Info**, **Education**, **Skills**, **Experience & Bullets**, **Projects**, and **Certifications**.
   - **No-Hallucination Policy**: Never invents missing credentials. If a core section is absent, it is explicitly flagged as a weakness.

4. **Dual ATS & Job Match Scoring Engine**:
   - **ATS Score (0–100)**: Evaluates formatting readability, section presence, length/word count balance, bullet structure, action verb power, and quantifiable metric impact (percentages, dollar amounts, scale).
   - **Job Match Score (0–100%)**: Strictly compares candidate competencies against job description requirements using our curated **350+ Technology Skill Taxonomy** and TF-IDF term weighting.
   - Rendered using animated circular SVG gauges with status tiers.

5. **Actionable Skill Gap Diagnostics & "Where to Learn" Links**:
   - Filterable view: **Skills You Have** vs. **Skills Required** vs. **Missing Skills**.
   - For every missing skill (e.g., *Docker*, *Kubernetes*, *GraphQL*), generates dynamic, 1-click learning search links to top YouTube beginner tutorials and official documentation.

6. **Actionable Bullet Rewrites ("Instead of this... Write this...")**:
   - Analyzes weak, passive resume bullets (e.g., *"Worked on features"*).
   - Generates high-impact replacements following the **Google XYZ framework** (*"Accomplished [X] as measured by [Y], by doing [Z]"*).
   - Includes 1-click clipboard copying and recruitment rationale explanations.

7. **Visual Analytics with Recharts**:
   - **Radar Chart**: Compares candidate proficiencies vs. target job expectations across 6 dimensions (*Frontend*, *Backend*, *Database*, *DevOps/Cloud*, *AI & Data*, *Soft Skills*).

8. **Executive PDF Report Download**:
   - Generates and downloads a clean, printable executive PDF report detailing scores, ATS breakdown, skill matches/gaps, and bullet improvement checklists.

9. **Security & GDPR "Right to be Forgotten"**:
   - Helmet security headers, CORS protection, and IP rate limiters.
   - Secure HttpOnly JWT cookies (no plain passwords).
   - **"Delete My Account & All Data"** button in settings completely wipes the user profile and cascades deletion of all stored analyses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js 18, Vite, Tailwind CSS (Dark/Light mode), Recharts, Framer Motion, React Dropzone, Lucide Icons, jsPDF, React-Toastify |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Passport.js (Google OAuth 2.0), JWT (`jsonwebtoken`), Cookie-Parser |
| **Document Processing** | Multer (in-memory storage), `pdf-parse` (layout-aware pager), `mammoth` (DOCX extraction) |
| **Security & Privacy** | Helmet, CORS, Express-Rate-Limit, Zero-Retention Memory Purge |
| **AI / NLP** | Deterministic NLP Engine (350+ skills taxonomy, regex boundaries, TF-IDF weighting, bullet analyzers) + Pluggable OpenAI/Gemini integration |

---

## 📂 Folder Structure

```
AI Resume Analyzer/
├── client/                     # Vite + React 18 Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   │   ├── Navbar.jsx              # Responsive header & theme toggle
│   │   │   ├── Footer.jsx              # Zero-retention guarantee & copyright
│   │   │   ├── ErrorBoundary.jsx       # Graceful crash handler
│   │   │   ├── ResumeDropzone.jsx      # Drag & drop upload with validation
│   │   │   ├── CircularGauge.jsx       # Animated ATS & Match gauges
│   │   │   ├── SkillsRadarChart.jsx    # Recharts radar skill comparison
│   │   │   ├── SkillGapSection.jsx     # Have vs Need + Learning links
│   │   │   ├── SuggestionsBox.jsx      # "Instead of this... Write this..."
│   │   │   ├── SkeletonLoader.jsx      # Shimmer states during analysis
│   │   │   ├── GuestBanner.jsx         # Post-scan Google conversion prompt
│   │   │   ├── DeleteAccountModal.jsx  # GDPR account & data deletion
│   │   │   └── ReportDownloadButton.jsx# PDF report generation trigger
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # Google OAuth & guest session state
│   │   │   └── ThemeContext.jsx        # Dark/Light mode theme state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero & ATS system explanation
│   │   │   ├── DashboardPage.jsx       # KPI cards & recent scan history
│   │   │   ├── AnalyzePage.jsx         # Role, JD & resume upload form
│   │   │   ├── ResultsPage.jsx         # Full interactive scorecard
│   │   │   ├── HistoryPage.jsx         # Filterable historical scans
│   │   │   └── SettingsPage.jsx        # Profile & privacy wipeout
│   │   ├── services/
│   │   │   ├── api.js                  # Axios client with interceptors
│   │   │   └── pdfExport.js            # jsPDF executive document builder
│   │   ├── utils/
│   │   │   └── sampleData.js           # 1-click pre-fill sample resume & JD
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── config/
│   │   ├── db.js               # MongoDB connect with in-memory fallback
│   │   ├── passport.js         # Google OAuth 2.0 strategy & JWT utils
│   │   └── security.js         # Helmet, CORS, and rate limiting
│   ├── controllers/
│   │   ├── authController.js   # OAuth, demo login, session & logout
│   │   ├── analysisController.js # Authenticated & guest resume parsing
│   │   └── userController.js   # Profile stats & GDPR account deletion
│   ├── middlewares/
│   │   ├── auth.js             # JWT verification & optional guest auth
│   │   └── upload.js           # Multer memory storage (zero retention)
│   ├── models/
│   │   ├── User.js             # User account schema
│   │   └── Analysis.js         # Embedded analysis results schema
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── analysisRoutes.js   # /api/analysis endpoints
│   │   └── userRoutes.js       # /api/user endpoints
│   ├── services/
│   │   ├── textExtractorService.js   # Multi-column layout parser
│   │   ├── resumeParserService.js    # Non-hallucinatory section segmenter
│   │   ├── skillTaxonomyService.js   # 350+ skills & dynamic learning links
│   │   ├── atsScorerService.js       # ATS calculation & action verbs
│   │   ├── matchCalculatorService.js # Match %, radar categories & gaps
│   │   └── aiService.js              # Deterministic NLP & pluggable LLM
│   ├── tests/
│   │   └── analyzer.test.js    # Comprehensive backend test suite
│   ├── .env                    # Local environment variables
│   ├── server.js               # Express application entry
│   └── package.json
│
├── .env.example
├── package.json                # Root package for concurrently running both
└── README.md
```

---

## ⚡ Step-by-Step Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- *(Optional)* Local MongoDB instance. If not installed, the application automatically launches an in-memory MongoDB database so you can start developing instantly!

### 2. Clone or Enter the Project Directory
```bash
cd "AI Resume Analyazer"
```

### 3. Install All Dependencies
Install dependencies for both client and server:
```bash
# Install root, backend, and frontend packages in one command:
npm run install:all
```
*(Or navigate to `server/` and run `npm install`, then `client/` and run `npm install`)*

### 4. Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
# Windows PowerShell:
Copy-Item .env.example server/.env
```
Default `server/.env` contents:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=super_secret_jwt_key_resume_analyzer_2025_secure_token
SESSION_SECRET=session_secret_key_resume_ai_38492048293

# Google OAuth (Optional: If omitted, use "1-Click Dev Demo Login")
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Optional AI Key (Defaults to high-impact deterministic NLP engine if empty)
OPENAI_API_KEY=
```

### 5. Run the Application Concurrently
Start both the Express API and the Vite frontend:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🔑 Google Cloud OAuth Configuration Guide

To enable live Google Sign-In with real Google accounts:

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **AI Resume Analyzer**.
3. Navigate to **APIs & Services** → **OAuth consent screen**:
   - User Type: **External**.
   - App Name: **AI Resume Analyzer**.
   - User Support Email & Developer Contact: Your email.
   - Scopes: Add `.../auth/userinfo.email` and `.../auth/userinfo.profile`.
4. Navigate to **Credentials** → **Create Credentials** → **OAuth client ID**:
   - Application Type: **Web application**.
   - Name: **AI Resume Analyzer Client**.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback`
5. Copy your **Client ID** and **Client Secret** into `server/.env`:
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-yourSecretKey
   ```
6. Restart your server (`npm run dev`).

> [!NOTE]
> Don't want to set up Google Cloud right now? Just click **"Dev Demo Login"** on the Navbar or Login prompt to access the full authenticated dashboard with sample history instantly!

---

## 🧠 How the System Works (Pipeline Explanation)

```
[Resume PDF/DOCX] + [Job Description]
       │
       ▼
[1. Multer RAM Buffer] ──> (Extracted to text) ──> [Buffer Destroyed from RAM]
       │
       ▼
[2. Layout-Aware Parser]
       ├── Y-coordinate line clustering (prevents 2-column cross-contamination)
       ├── RFC Regex contact extraction (Email, Phone, LinkedIn, GitHub)
       └── Section segmenter (Experience, Education, Skills, Projects, Certifications)
       │
       ▼
[3. Dual Scorer & Taxonomy Matcher]
       ├── ATS Scorer: formatting (word count, bullets) + action verbs + quantified metrics
       ├── 350+ Skill Taxonomy: matches technologies across 6 key domains
       └── Match Calculator: (Overlap / Total Required) + Title keyword weight
       │
       ▼
[4. AI / Deterministic NLP Engine]
       ├── Identifies missing skill gaps & creates dynamic YouTube/Docs learning links
       ├── Formulates Google XYZ STAR bullet transformations ("Instead of... Write this...")
       └── Audits strengths & flags unmentioned core sections
       │
       ▼
[5. Visual Output & Export]
       ├── Interactive Recharts Radar Chart + Circular Score Gauges
       ├── MongoDB persistence (if logged in) or local guest state
       └── 1-Click Executive PDF Report Generation (jsPDF)
```

---

## 🧪 Running Automated Tests

Run the test suite to verify the text extraction, section parser, skill taxonomy, and match scoring logic:
```bash
npm run test:server
```
Expected output:
```
🧪 Starting AI Resume Analyzer Test Suite...
  ✅ Extracted skills correctly: React.js, TypeScript, Node.js, MongoDB, Docker, AWS
  ✅ Generated learning link: https://www.youtube.com/results?search_query=Docker+tutorial+for+beginners
  ✅ Section segmentation verified without hallucination.
  ✅ ATS Score calculated: 79/100 with 3 strengths.
  ✅ Match Score: 77%. Matched: React.js, TypeScript, Node.js, AWS. Missing: GraphQL, Kubernetes
  ✅ Generated Suggestions: [Instead of] -> [Write this]
🎉 ALL 6 TEST SUITES PASSED PERFECTLY!
```

---

## 📜 Zero-Retention & Privacy Policy

- **No Disk Storage**: Resume files are never written to any filesystem directory.
- **Immediate Dereferencing**: The in-memory buffer is nullified immediately after text extraction.
- **Account Deletion (GDPR Article 17)**: Users can permanently erase their profile and all scan history with a single click in **Settings** → **"Delete My Account & All Data"**.

---

## 📄 License
MIT © AI Resume Analyzer Team. Built for ambitious developers and job seekers worldwide.
