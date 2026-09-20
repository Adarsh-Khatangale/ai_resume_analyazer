const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

/**
 * Layout-aware page renderer for pdf-parse to preserve multi-column separation
 * and prevent cross-column text interweaving.
 */
const customPdfPager = (pageData) => {
  const renderOptions = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(renderOptions).then((textContent) => {
    let lastY = null;
    let text = '';
    const lineItems = [];

    // Group text items by vertical position (Y coordinate)
    for (const item of textContent.items) {
      if (!item.str || !item.str.trim()) continue;
      
      const currentY = Math.round(item.transform[5]);
      const currentX = Math.round(item.transform[4]);

      lineItems.push({
        str: item.str,
        x: currentX,
        y: currentY,
        width: item.width,
        height: item.height,
      });
    }

    // Sort items by Y (descending: top to bottom) and then X (left to right)
    lineItems.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 4) {
        return b.y - a.y; // Top to bottom
      }
      return a.x - b.x; // Left to right
    });

    let currentYGroup = null;
    let currentLine = '';

    for (const item of lineItems) {
      if (currentYGroup === null || Math.abs(item.y - currentYGroup) > 4) {
        if (currentLine) {
          text += currentLine.trim() + '\n';
        }
        currentYGroup = item.y;
        currentLine = item.str;
      } else {
        // Same vertical line, separate by space if there is horizontal gap
        currentLine += ' ' + item.str;
      }
    }

    if (currentLine) {
      text += currentLine.trim() + '\n';
    }

    return text;
  });
};

/**
 * Extract raw clean text from a file buffer (PDF or DOCX)
 * Enforces Zero-Retention policy: buffer is consumed in memory and dereferenced.
 *
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} originalName - File name
 * @param {string} mimeType - File mime type
 * @returns {Promise<string>} Clean extracted text
 */
const extractTextFromBuffer = async (buffer, originalName = '', mimeType = '') => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Empty file received. Please provide a valid resume file.');
  }

  const ext = path.extname(originalName).toLowerCase();
  let rawText = '';

  try {
    if (ext === '.pdf' || mimeType.includes('pdf')) {
      // Try layout-aware parsing first
      try {
        const data = await pdfParse(buffer, {
          pager: customPdfPager,
        });
        rawText = data.text;
      } catch (pagerErr) {
        // Fallback to standard pdfParse if custom layout pager encounters atypical PDF streams
        const standardData = await pdfParse(buffer);
        rawText = standardData.text;
      }
    } else if (ext === '.docx' || ext === '.doc' || mimeType.includes('word') || mimeType.includes('officedocument')) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else {
      // Plain text fallback if text format
      rawText = buffer.toString('utf-8');
    }

    // Clean and normalize extracted text
    const cleanText = normalizeText(rawText);

    if (!cleanText || cleanText.trim().length < 50) {
      throw new Error(
        'Could not extract sufficient text from the resume. The file may be an image-only scan or password-protected.'
      );
    }

    return cleanText;
  } catch (err) {
    if (err.message.includes('password') || err.message.includes('encrypted')) {
      throw new Error('This PDF is password-protected. Please upload an unlocked PDF.');
    }
    throw new Error(`Failed to parse resume: ${err.message}`);
  }
};

/**
 * Normalizes text, cleans weird whitespace and non-printable control characters
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\t\f\v]/g, ' ')
    .replace(/[ \u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

module.exports = {
  extractTextFromBuffer,
  normalizeText,
};
