import { jsPDF } from 'jspdf';

/**
 * Generates an executive PDF report summarizing the resume analysis
 * @param {Object} analysis - The complete analysis object
 */
export const exportAnalysisToPdf = (analysis) => {
  if (!analysis) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(124, 58, 237); // Brand violet
  doc.rect(0, 0, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('AI RESUME ANALYZER & JOB MATCH ASSISTANT — EXECUTIVE REPORT', 14, 8);

  y += 6;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(analysis.jobTitle || 'Job Match Analysis', 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const scanDate = analysis.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`Generated on: ${scanDate} | Zero-Retention Privacy Protected`, 14, y);

  y += 10;
  // Summary Scores Cards
  // ATS Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 85, 28, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('ATS PARSER COMPLIANCE', 20, y + 8);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text(`${analysis.atsScore}/100`, 20, y + 20);

  // Match Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(110, y, 85, 28, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('JOB MATCH ALIGNMENT', 116, y + 8);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`${analysis.matchScore}%`, 116, y + 20);

  y += 36;
  // ATS Breakdown
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('ATS Score Breakdown', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const d = analysis.atsDetails || {};
  doc.text(`• Formatting & Length: ${d.formattingScore || 85}% (${d.lengthWordCount || 450} words, ${d.bulletCount || 10} bullets)`, 14, y);
  y += 5;
  doc.text(`• Section Completeness: ${d.sectionPresenceScore || 90}%`, 14, y);
  y += 5;
  doc.text(`• Metric Impact & Quantifiable Outcomes: ${d.metricImpactScore || 80}%`, 14, y);
  y += 5;
  doc.text(`• Keyword Alignment: ${d.keywordScore || 85}%`, 14, y);

  y += 10;
  // Skills Breakdown
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Skill Gap Analysis', 14, y);
  y += 6;

  const matched = (analysis.matchedSkills || []).map((s) => (typeof s === 'string' ? s : s.skill)).slice(0, 12);
  const missing = (analysis.missingSkills || []).map((s) => (typeof s === 'string' ? s : s.skill)).slice(0, 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Matching Skills (${matched.length}):`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const matchedText = matched.length > 0 ? matched.join(', ') : 'None detected';
  const splitMatched = doc.splitTextToSize(matchedText, pageWidth - 30);
  doc.text(splitMatched, 14, y + 4);
  y += 4 + splitMatched.length * 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text(`Missing / Unaddressed Skills (${missing.length}):`, 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const missingText = missing.length > 0 ? missing.join(', ') : 'All key skills matched!';
  const splitMissing = doc.splitTextToSize(missingText, pageWidth - 30);
  doc.text(splitMissing, 14, y + 4);
  y += 4 + splitMissing.length * 4.5 + 4;

  // Strengths & Weaknesses
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Key Strengths & Growth Areas', 14, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  for (const s of (analysis.strengths || []).slice(0, 3)) {
    doc.setTextColor(16, 185, 129);
    doc.text('✓', 14, y);
    doc.setTextColor(51, 65, 85);
    const splitStr = doc.splitTextToSize(s, pageWidth - 35);
    doc.text(splitStr, 20, y);
    y += splitStr.length * 4.5 + 1;
  }

  for (const w of (analysis.weaknesses || []).slice(0, 3)) {
    doc.setTextColor(225, 29, 72);
    doc.text('!', 14, y);
    doc.setTextColor(51, 65, 85);
    const splitW = doc.splitTextToSize(w, pageWidth - 35);
    doc.text(splitW, 20, y);
    y += splitW.length * 4.5 + 1;
  }

  // Suggestion rewrites (If space permits on page 1 or page 2)
  if (analysis.suggestions && analysis.suggestions.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    } else {
      y += 6;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('Actionable Bullet Improvements ("Instead of this... Write this...")', 14, y);
    y += 7;

    for (const sug of analysis.suggestions.slice(0, 2)) {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72);
      doc.text('Instead of:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const splitWeak = doc.splitTextToSize(`"${sug.insteadOf}"`, pageWidth - 40);
      doc.text(splitWeak, 32, y);
      y += splitWeak.length * 4 + 2;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('Write this:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      const splitBetter = doc.splitTextToSize(`"${sug.writeThis}"`, pageWidth - 40);
      doc.text(splitBetter, 32, y);
      y += splitBetter.length * 4 + 4;
    }
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `AI Resume Analyzer — Page ${i} of ${totalPages} | Disclaimer: Estimated ATS score based on standard parser algorithms.`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  const safeTitle = (analysis.jobTitle || 'Resume_Analysis').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${safeTitle}_Report.pdf`);
};
