const Analysis = require('../models/Analysis');
const { extractTextFromBuffer } = require('../services/textExtractorService');
const { parseResumeText } = require('../services/resumeParserService');
const { calculateAtsScore } = require('../services/atsScorerService');
const { calculateJobMatch } = require('../services/matchCalculatorService');
const { generateSuggestions } = require('../services/aiService');

/**
 * Core analysis engine shared between authenticated and guest runs
 */
const runAnalysisPipeline = async (resumeText, jobTitle, jobDescription) => {
  // 1. Non-hallucinatory section parsing
  const parsedResume = parseResumeText(resumeText);

  // 2. ATS Score calculation (formatting, action verbs, quantified metrics, section presence)
  const atsResult = calculateAtsScore(parsedResume, resumeText);

  // 3. Job Match calculation (skill taxonomy, category breakdown for Radar chart, learning links)
  const matchResult = calculateJobMatch(parsedResume, jobDescription, jobTitle);

  // 4. Suggestions generation (STAR-format "Instead of this... Write this...", AI or deterministic NLP)
  const suggestions = await generateSuggestions(
    parsedResume,
    jobTitle,
    jobDescription,
    matchResult.matchedSkills,
    matchResult.missingSkills
  );

  // If parsed sections missed anything, add to weaknesses
  const combinedWeaknesses = [...atsResult.weaknesses];
  if (parsedResume.missingSections && parsedResume.missingSections.length > 0) {
    for (const missing of parsedResume.missingSections) {
      combinedWeaknesses.unshift(`Missing critical section: "${missing}". Adding this section will significantly improve ATS parsing.`);
    }
  }

  return {
    jobTitle,
    jobDescription,
    resumeRawText: resumeText,
    atsScore: atsResult.atsScore,
    matchScore: matchResult.matchScore,
    atsDetails: atsResult.atsDetails,
    extractedData: parsedResume,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    categoryScores: matchResult.categoryScores,
    strengths: atsResult.strengths,
    weaknesses: combinedWeaknesses.slice(0, 6),
    suggestions,
  };
};

/**
 * POST /api/analysis/analyze
 * Authenticated analysis: saves to database under req.user._id
 */
const analyzeResume = async (req, res) => {
  let fileBuffer = null;

  try {
    const { jobTitle, jobDescription, resumeText: rawTextInput } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'Job title and Job description are required.' });
    }

    let extractedResumeText = '';

    if (req.file) {
      fileBuffer = req.file.buffer;
      // Extract clean text from in-memory buffer
      extractedResumeText = await extractTextFromBuffer(
        fileBuffer,
        req.file.originalname,
        req.file.mimetype
      );
      // Zero-Retention: Dereference file buffer immediately
      req.file.buffer = null;
      fileBuffer = null;
    } else if (rawTextInput && rawTextInput.trim().length > 30) {
      extractedResumeText = rawTextInput.trim();
    } else {
      return res.status(400).json({
        error: 'Please upload a resume file (PDF, DOC, DOCX) or paste your resume text.',
      });
    }

    const analysisData = await runAnalysisPipeline(extractedResumeText, jobTitle, jobDescription);

    // Save to database for logged in user
    const savedAnalysis = await Analysis.create({
      userId: req.user._id,
      isGuest: false,
      ...analysisData,
    });

    return res.status(201).json({
      message: 'Analysis completed successfully.',
      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error('[Analysis Controller Error]:', error);
    // Ensure buffer reference is dereferenced even on failure
    if (req.file) req.file.buffer = null;
    fileBuffer = null;
    return res.status(500).json({
      error: error.message || 'Failed to analyze resume. Please check file format.',
    });
  }
};

/**
 * POST /api/analysis/guest
 * Guest / Demo Mode: Analyzes 1 resume without requiring login
 */
const guestAnalyzeResume = async (req, res) => {
  let fileBuffer = null;

  try {
    const { jobTitle, jobDescription, resumeText: rawTextInput } = req.body;

    if (!jobTitle || !jobDescription) {
      return res.status(400).json({ error: 'Job title and Job description are required.' });
    }

    let extractedResumeText = '';

    if (req.file) {
      fileBuffer = req.file.buffer;
      extractedResumeText = await extractTextFromBuffer(
        fileBuffer,
        req.file.originalname,
        req.file.mimetype
      );
      // Zero-Retention: Immediately clear buffer
      req.file.buffer = null;
      fileBuffer = null;
    } else if (rawTextInput && rawTextInput.trim().length > 30) {
      extractedResumeText = rawTextInput.trim();
    } else {
      return res.status(400).json({
        error: 'Please upload a resume file (PDF, DOC, DOCX) or paste your resume text.',
      });
    }

    const analysisData = await runAnalysisPipeline(extractedResumeText, jobTitle, jobDescription);

    // Provide a guest-assigned temporary ID
    const guestResult = {
      _id: 'guest_' + Date.now(),
      isGuest: true,
      createdAt: new Date().toISOString(),
      ...analysisData,
    };

    return res.status(200).json({
      message: 'Guest analysis completed.',
      analysis: guestResult,
      isGuest: true,
    });
  } catch (error) {
    console.error('[Guest Analysis Error]:', error);
    if (req.file) req.file.buffer = null;
    fileBuffer = null;
    return res.status(500).json({
      error: error.message || 'Failed to analyze resume in guest mode.',
    });
  }
};

/**
 * GET /api/analysis
 * Returns all analyses for the authenticated user (strict privacy)
 */
const getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .select('jobTitle atsScore matchScore createdAt matchedSkills missingSkills')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ analyses });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve analysis history.' });
  }
};

/**
 * GET /api/analysis/:id
 * Retrieve a specific analysis record
 */
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ error: 'Analysis record not found.' });
    }

    return res.status(200).json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
};

/**
 * DELETE /api/analysis/:id
 * Delete a specific analysis record
 */
const deleteAnalysis = async (req, res) => {
  try {
    const deleted = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Analysis record not found or unauthorized.' });
    }

    return res.status(200).json({ message: 'Analysis deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete analysis.' });
  }
};

module.exports = {
  analyzeResume,
  guestAnalyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
};
