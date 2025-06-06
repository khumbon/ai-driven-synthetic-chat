import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.js';

// Extract JSON from markdown code blocks - improved version
const extractJsonFromMarkdown = (text: string): string => {
  // First try the standard regex
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);

  if (match) {
    return match[1].trim();
  }

  // If that fails, try more aggressive cleaning
  let cleaned = text.trim();

  // Remove opening code block markers
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/, '');

  // Remove closing code block markers
  cleaned = cleaned.replace(/\s*```$/, '');

  // Remove any remaining backticks at start/end
  cleaned = cleaned.replace(/^`+/, '');
  cleaned = cleaned.replace(/`+$/, '');

  return cleaned.trim();
};

// Complete incomplete JSON by finding the last valid structure
const completeJson = (jsonString: string): string => {
  let completed = jsonString.trim();

  // First, try to identify what structure we're dealing with
  // Look for the overall structure: should be an array of chat objects

  // Strategy 1: Check if we have a complete structure that just needs closing
  const openBraces = (completed.match(/{/g) || []).length;
  const closeBraces = (completed.match(/}/g) || []).length;
  const openBrackets = (completed.match(/\[/g) || []).length;
  const closeBrackets = (completed.match(/\]/g) || []).length;

  // If brackets/braces are reasonably balanced, try minimal completion first
  const bracesDiff = openBraces - closeBraces;
  const bracketsDiff = openBrackets - closeBrackets;

  if (bracesDiff <= 3 && bracketsDiff <= 1) {
    // Try minimal completion - just add missing closing brackets/braces
    let minimal = completed;

    // Check if we're in the middle of a string that got cut off
    const lastQuoteIndex = minimal.lastIndexOf('"');
    const lastColonIndex = minimal.lastIndexOf(':');
    const lastCommaIndex = minimal.lastIndexOf(',');

    // If we end with an incomplete value (after : or ,), try to clean it up
    if (lastColonIndex > lastQuoteIndex || lastCommaIndex > lastQuoteIndex) {
      // We might have an incomplete value, remove it
      const cutoffPoint = Math.max(lastColonIndex, lastCommaIndex);
      const beforeCutoff = minimal.substring(0, cutoffPoint);

      // Check if we can find a good place to cut (end of previous complete field)
      const prevQuoteIndex = beforeCutoff.lastIndexOf('"');
      if (prevQuoteIndex > 0) {
        minimal = minimal.substring(0, prevQuoteIndex + 1);
      }
    }

    // Remove any trailing commas before closing
    minimal = minimal.replace(/,\s*$/, '');

    // Add missing closing braces
    for (let i = 0; i < bracesDiff; i++) {
      minimal += '\n  }';
    }

    // Add missing closing brackets
    for (let i = 0; i < bracketsDiff; i++) {
      minimal += '\n]';
    }

    // Clean up any trailing commas before closing brackets
    minimal = minimal.replace(/,(\s*[}\]])/g, '$1');

    // Test if this works
    try {
      JSON.parse(minimal);
      return minimal;
    } catch {
      // Minimal completion failed, fall through to more aggressive strategies
    }
  }

  // Strategy 2: Find the last complete chat object (not just message)
  // Look for pattern: "category": "some_category" }
  const lastCompleteChatRegex = /.*"category":\s*"[^"]*"\s*}/s;
  const chatMatch = completed.match(lastCompleteChatRegex);

  if (chatMatch) {
    completed = chatMatch[0];

    // Close the main array if needed
    if (!completed.trim().endsWith(']')) {
      completed += '\n]';
    }

    try {
      JSON.parse(completed);
      return completed;
    } catch {
      // Continue to next strategy
    }
  }

  // Strategy 3: Find the last complete message and build from there
  // But be more conservative - look for complete message within complete chat
  const lastCompleteMessageRegex = /.*"timestamp":\s*"[^"]*"\s*}\s*(?=\s*\])/s;
  const messageMatch = completed.match(lastCompleteMessageRegex);

  if (messageMatch) {
    let result = messageMatch[0];

    // Complete the structure: close messages array, close chat object, close main array
    if (!result.includes('\n    ]')) {
      result += '\n    ]';
    }
    if (!result.includes('\n  }')) {
      result += '\n  }';
    }
    if (!result.trim().endsWith(']')) {
      result += '\n]';
    }

    try {
      JSON.parse(result);
      return result;
    } catch {
      // Continue to fallback
    }
  }

  // Strategy 4: Fallback - balance brackets from current state (original logic)
  const missingBraces = Math.max(0, openBraces - closeBraces);
  const missingBrackets = Math.max(0, openBrackets - closeBrackets);

  for (let i = 0; i < missingBraces; i++) {
    completed += '\n  }';
  }

  for (let i = 0; i < missingBrackets; i++) {
    completed += '\n]';
  }

  // Clean up any trailing commas before closing brackets
  completed = completed.replace(/,(\s*[}\]])/g, '$1');

  return completed;
};

// Check if JSON appears complete
const isJsonComplete = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

// Parse and complete JSON from Anthropic response - with detailed debugging
export const cleanGeneratedResponseContent = (content: ContentBlock) => {
  if (content.type !== 'text') {
    throw new Error(`Unexpected content type: ${content.type}`);
  }

  //console.log('=== DEBUGGING JSON EXTRACTION ===');
  //console.log('Raw content length:', content.text.length);
  //console.log('Content ends with:', JSON.stringify(content.text.slice(-100)));

  // Extract JSON from markdown
  const cleanJsonString = extractJsonFromMarkdown(content.text);

  //console.log('Extracted JSON length:', cleanJsonString.length);
  //console.log('Extracted ends with:', JSON.stringify(cleanJsonString.slice(-100)));

  // Check if it's already complete
  if (isJsonComplete(cleanJsonString)) {
    //console.log('✅ JSON is complete');
    return JSON.parse(cleanJsonString);
  }

  // The JSON is incomplete - look at what we have
  //console.log('⚠️ JSON appears incomplete, attempting to fix...');
  //console.log('Checking structure...');

  // Check if we can find where it cuts off
  const hasBracketAtEnd = cleanJsonString.trim().endsWith(']');
  const hasBraceAtEnd = cleanJsonString.trim().endsWith('}');
  const endsWithQuote = cleanJsonString.trim().endsWith('"');

  //console.log('Ends with ]:', hasBracketAtEnd);
  //console.log('Ends with }:', hasBraceAtEnd);
  //console.log('Ends with ":', endsWithQuote);

  // Try multiple completion strategies
  let attempts = 0;
  const strategies = [
    () => {
      //console.log('Strategy 1: Smart truncation and completion');
      return completeJson(cleanJsonString);
    },
    () => {
      //console.log('Strategy 2: Remove incomplete trailing content');
      // Remove any incomplete trailing string that doesn't end with quote
      let cleaned = cleanJsonString;
      if (!endsWithQuote && !hasBraceAtEnd && !hasBracketAtEnd) {
        // Find last complete quote and cut there
        const lastQuoteIndex = cleaned.lastIndexOf('"');
        if (lastQuoteIndex > 0) {
          cleaned = cleaned.substring(0, lastQuoteIndex + 1);
        }
      }
      return completeJson(cleaned);
    },
    () => {
      //console.log('Strategy 3: Cut at last complete message');
      const lastTimestamp = cleanJsonString.lastIndexOf('"timestamp":');
      if (lastTimestamp > 0) {
        const afterTimestamp = cleanJsonString.substring(lastTimestamp);
        const nextBrace = afterTimestamp.indexOf('}');
        if (nextBrace > 0) {
          const cutPoint = lastTimestamp + nextBrace + 1;
          const truncated = cleanJsonString.substring(0, cutPoint);
          return completeJson(truncated);
        }
      }
      return completeJson(cleanJsonString);
    },
  ];

  for (const strategy of strategies) {
    try {
      attempts++;
      //console.log(`\n--- Attempt ${attempts} ---`);
      const completedJson = strategy();

      //console.log('Completed JSON length:', completedJson.length);
      //console.log('Completed ends with:', JSON.stringify(completedJson.slice(-50)));

      const parsed = JSON.parse(completedJson);
      //console.log(`✅ Strategy ${attempts} succeeded!`);
      //console.log('Parsed', Array.isArray(parsed) ? parsed.length : 'non-array', 'items');
      return parsed;
    } catch (error) {
      //console.log(`❌ Strategy ${attempts} failed:`, error);
      if (attempts === strategies.length) {
        //console.log('=== All strategies failed ===');
        //console.log('Last 500 chars of original:', cleanJsonString.slice(-500));
        throw new Error(`Unable to complete JSON after ${attempts} attempts: ${error}`);
      }
    }
  }
};
