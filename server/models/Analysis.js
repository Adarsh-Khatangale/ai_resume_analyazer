const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resumeRawText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    atsDetails: {
      formattingScore: { type: Number, default: 0 },
      sectionPresenceScore: { type: Number, default: 0 },
      metricImpactScore: { type: Number, default: 0 },
      keywordScore: { type: Number, default: 0 },
      lengthWordCount: { type: Number, default: 0 },
      bulletCount: { type: Number, default: 0 },
      disclaimer: {
        type: String,
        default: 'This is an estimated ATS-style score based on standard parser behavior.',
      },
    },
    extractedData: {
      contactInfo: {
        name: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        location: { type: String, default: '' },
      },
      skills: [{ type: String }],
      education: [
        {
          institution: { type: String, default: '' },
          degree: { type: String, default: '' },
          year: { type: String, default: '' },
        },
      ],
      experience: [
        {
          role: { type: String, default: '' },
          company: { type: String, default: '' },
          duration: { type: String, default: '' },
          bullets: [{ type: String }],
        },
      ],
      projects: [
        {
          name: { type: String, default: '' },
          description: { type: String, default: '' },
          technologies: [{ type: String }],
        },
      ],
      certifications: [{ type: String }],
      missingSections: [{ type: String }],
    },
    matchedSkills: [
      {
        skill: { type: String, required: true },
        category: { type: String, default: 'General' },
      },
    ],
    missingSkills: [
      {
        skill: { type: String, required: true },
        category: { type: String, default: 'General' },
        learningQuery: { type: String, default: '' },
        learningUrl: { type: String, default: '' },
      },
    ],
    categoryScores: [
      {
        category: { type: String, required: true },
        candidateScore: { type: Number, required: true },
        requiredScore: { type: Number, required: true },
        fullMark: { type: Number, default: 100 },
      },
    ],
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    suggestions: [
      {
        section: { type: String, default: 'Experience' },
        insteadOf: { type: String, required: true },
        writeThis: { type: String, required: true },
        rationale: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Analysis', analysisSchema);
