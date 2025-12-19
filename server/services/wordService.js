/**
 * Word Document (.docx) Extraction Service
 * Converts .docx files to structured article data
 */

const mammoth = require('mammoth');

/**
 * Extract article content from Word document
 * @param {Buffer} fileBuffer - Word file buffer
 * @returns {Promise<Object>} - Extracted article data
 */
async function extractWordContent(fileBuffer) {
  try {
    if (!fileBuffer) {
      throw new Error('No file buffer provided');
    }

    // Convert .docx to HTML
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    const html = result.value;

    // Convert HTML to plain text (basic extraction)
    const plainText = html
      .replace(/<[^>]*>/g, '\n') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&lt;/g, '<') // Decode entities
      .replace(/&gt;/g, '>') // Decode entities
      .replace(/&amp;/g, '&') // Decode entities
      .replace(/\n\n+/g, '\n') // Remove multiple newlines
      .trim();

    // Split content into lines
    const lines = plainText.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      throw new Error('No content extracted from Word document');
    }

    // Extract structured data from content
    const extractedData = extractStructuredData(lines, html);

    return {
      success: true,
      data: extractedData,
      rawHtml: html,
      rawText: plainText
    };

  } catch (error) {
    console.error('Word extraction error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to extract content from Word document'
    };
  }
}

/**
 * Extract structured article data from content lines
 * Tries to intelligently parse title, summary, and content
 * @param {Array<String>} lines - Content lines
 * @param {String} html - Original HTML
 * @returns {Object} - Structured article data
 */
function extractStructuredData(lines, html) {
  let title = '';
  let summary = '';
  let content = '';

  // First line is typically the title
  if (lines.length > 0) {
    title = lines[0].substring(0, 150) || 'Untitled Article'; // Cap at 150 chars
  }

  // Second line could be summary (if it's short)
  if (lines.length > 1 && lines[1].length < 200) {
    summary = lines[1];
  }

  // Remaining lines form the content
  if (lines.length > 2) {
    content = lines.slice(2).join('\n');
  } else if (lines.length > 1) {
    content = lines.slice(1).join('\n');
  }

  // If summary wasn't extracted, create one from content
  if (!summary && content) {
    const contentLines = content.split('\n');
    summary = contentLines[0].substring(0, 200);
  }

  // Use HTML for richer content preservation
  let richContent = html
    .replace(/<p>/g, '\n') // Add line breaks for paragraphs
    .replace(/<\/p>/g, '') // Remove closing p tags
    .replace(/<br\s*\/?>/g, '\n') // Convert br to newline
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&lt;/g, '<') // Decode entities
    .replace(/&gt;/g, '>') // Decode entities
    .replace(/&amp;/g, '&') // Decode entities
    .replace(/\n\n+/g, '\n') // Remove multiple newlines
    .trim();

  return {
    title: title || 'Untitled Article',
    summary: summary || 'No summary available',
    content: richContent || content,
    contentLanguage: detectLanguage(content) // 'en' or 'kn'
  };
}

/**
 * Detect language of content
 * Simple detection: if contains Kannada characters, mark as 'kn', else 'en'
 * @param {String} text - Text to analyze
 * @returns {String} - 'en' or 'kn'
 */
function detectLanguage(text) {
  // Kannada Unicode range: U+0C80 to U+0CFF
  const kannadaPattern = /[\u0C80-\u0CFF]/g;
  const matches = text.match(kannadaPattern);
  
  // If more than 10% of characters are Kannada, classify as Kannada
  if (matches && matches.length > text.length * 0.1) {
    return 'kn';
  }
  return 'en';
}

module.exports = {
  extractWordContent,
  extractStructuredData,
  detectLanguage
};
