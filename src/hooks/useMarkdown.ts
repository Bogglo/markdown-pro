import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * useMarkdown Hook
 * Takes markdown string and returns sanitized HTML.
 * Optimized with useMemo to only re-parse when input changes.
 */
export const useMarkdown = (markdown: string) => {
  const html = useMemo(() => {
    if (!markdown) return '';
    
    try {
      // Parse markdown to HTML
      const rawHtml = marked.parse(markdown) as string;
      
      // Sanitize to prevent XSS (Cross-Site Scripting)
      return DOMPurify.sanitize(rawHtml);
    } catch (e) {
      console.error('Markdown parsing error:', e);
      return '<p style="color: red;">Error parsing markdown content.</p>';
    }
  }, [markdown]);

  return { html };
};
