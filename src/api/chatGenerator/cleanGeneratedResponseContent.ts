import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.js';

// Extract JSON from markdown code blocks - improved version with better debugging
const extractJsonFromMarkdown = (text: string): string => {
  console.log('=== EXTRACTING JSON FROM MARKDOWN ===');
  console.log('Input text length:', text.length);
  console.log('First 200 chars:', JSON.stringify(text.slice(0, 200)));
  console.log('Last 200 chars:', JSON.stringify(text.slice(-200)));

  // Strategy 1: Look for standard markdown code blocks
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
  const match = text.match(codeBlockRegex);

  if (match) {
    console.log('✅ Found standard code block');
    const extracted = match[1].trim();
    console.log('Extracted length:', extracted.length);
    console.log('Extracted starts with:', JSON.stringify(extracted.slice(0, 50)));
    return extracted;
  }

  // Strategy 2: Look for JSON arrays that start with [ and try to find the end
  const arrayStartRegex = /\[\s*\{/;
  const arrayStartMatch = text.search(arrayStartRegex);

  if (arrayStartMatch !== -1) {
    console.log('✅ Found JSON array start at position:', arrayStartMatch);
    let jsonContent = text.substring(arrayStartMatch);

    // Try to find the end by balancing brackets
    let bracketCount = 0;
    let endPos = -1;

    for (let i = 0; i < jsonContent.length; i++) {
      const char = jsonContent[i];
      if (char === '[') bracketCount++;
      else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          endPos = i + 1;
          break;
        }
      }
    }

    if (endPos > 0) {
      jsonContent = jsonContent.substring(0, endPos);
      console.log('✅ Found complete JSON array, length:', jsonContent.length);
      return jsonContent;
    } else {
      console.log('⚠️ Found array start but no clean end, using full content');
      return jsonContent;
    }
  }

  // Strategy 3: Aggressive cleaning - remove markdown formatting
  let cleaned = text.trim();
  console.log('📝 Applying aggressive cleaning...');

  // Remove various markdown code block patterns
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/, '');
  cleaned = cleaned.replace(/\s*```$/, '');
  cleaned = cleaned.replace(/^`+/, '');
  cleaned = cleaned.replace(/`+$/, '');

  // Remove any leading/trailing whitespace or newlines
  cleaned = cleaned.trim();

  // If it starts with a backslash, try to remove escaped characters
  if (cleaned.startsWith('\\')) {
    console.log('⚠️ Content starts with backslash, attempting to unescape...');
    // Try to unescape common patterns
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\\t/g, '\t');
    cleaned = cleaned.replace(/\\r/g, '\r');
    cleaned = cleaned.replace(/\\\\/g, '\\');

    // If it still starts with backslash, remove leading backslashes
    cleaned = cleaned.replace(/^\\+/, '');
  }

  console.log('Cleaned length:', cleaned.length);
  console.log('Cleaned starts with:', JSON.stringify(cleaned.slice(0, 50)));
  console.log('Cleaned ends with:', JSON.stringify(cleaned.slice(-50)));

  return cleaned;
};

// Complete incomplete JSON by finding the last valid structure
const completeJson = (jsonString: string): string => {
  console.log('=== COMPLETING JSON ===');
  console.log('Input length:', jsonString.length);
  console.log('Input starts with:', JSON.stringify(jsonString.slice(0, 100)));

  const completed = jsonString.trim();

  // Quick validation - make sure it looks like JSON
  if (!completed.startsWith('[') && !completed.startsWith('{')) {
    console.log('❌ Content does not start with [ or {');
    throw new Error('Content does not appear to be JSON - starts with: ' + JSON.stringify(completed.slice(0, 20)));
  }

  // Count brackets and braces for basic structure validation
  const openBraces = (completed.match(/{/g) || []).length;
  const closeBraces = (completed.match(/}/g) || []).length;
  const openBrackets = (completed.match(/\[/g) || []).length;
  const closeBrackets = (completed.match(/\]/g) || []).length;

  console.log('Bracket/brace counts:', { openBraces, closeBraces, openBrackets, closeBrackets });

  const bracesDiff = openBraces - closeBraces;
  const bracketsDiff = openBrackets - closeBrackets;

  // Strategy 1: If reasonably balanced, try minimal completion
  if (bracesDiff >= 0 && bracesDiff <= 5 && bracketsDiff >= 0 && bracketsDiff <= 2) {
    console.log('📝 Attempting minimal completion...');
    let minimal = completed;

    // Remove any incomplete trailing content
    const trimPatterns = [
      /,\s*$/, // trailing comma
      /:\s*$/, // incomplete key-value pair
      /"\s*$/, // incomplete string at end (but not if it's a complete field)
    ];

    for (const pattern of trimPatterns) {
      if (pattern.test(minimal)) {
        console.log('Trimming pattern:', pattern);
        minimal = minimal.replace(pattern, '');
      }
    }

    // Add missing closing braces and brackets
    for (let i = 0; i < bracesDiff; i++) {
      minimal += '\n  }';
    }
    for (let i = 0; i < bracketsDiff; i++) {
      minimal += '\n]';
    }

    // Clean up formatting
    minimal = minimal.replace(/,(\s*[}\]])/g, '$1');

    try {
      JSON.parse(minimal);
      console.log('✅ Minimal completion succeeded');
      return minimal;
    } catch (error) {
      console.log('❌ Minimal completion failed:', error);
    }
  }

  // Strategy 2: Find last complete chat object
  console.log('📝 Looking for last complete chat object...');
  const chatCompleteRegex = /"category":\s*"[^"]*"\s*}\s*(?:,\s*)?(?=\s*[\]\}]|$)/g;
  let lastChatMatch;
  let match;

  while ((match = chatCompleteRegex.exec(completed)) !== null) {
    lastChatMatch = match;
  }

  if (lastChatMatch) {
    const cutPoint = lastChatMatch.index + lastChatMatch[0].length;
    let truncated = completed.substring(0, cutPoint);

    // Ensure proper closing
    if (!truncated.trim().endsWith(']')) {
      truncated += '\n]';
    }

    try {
      JSON.parse(truncated);
      console.log('✅ Chat object completion succeeded');
      return truncated;
    } catch (error) {
      console.log('❌ Chat object completion failed:', error);
    }
  }

  // Strategy 3: Find last complete message
  console.log('📝 Looking for last complete message...');
  const messageCompleteRegex = /"timestamp":\s*"[^"]*"\s*}/g;
  let lastMessageMatch;

  while ((match = messageCompleteRegex.exec(completed)) !== null) {
    lastMessageMatch = match;
  }

  if (lastMessageMatch) {
    const cutPoint = lastMessageMatch.index + lastMessageMatch[0].length;
    let truncated = completed.substring(0, cutPoint);

    // Complete the structure
    if (!truncated.includes('    ]')) {
      truncated += '\n    ]';
    }
    if (!truncated.includes('  },')) {
      truncated += ',\n    "category": "privacy"\n  }';
    }
    if (!truncated.trim().endsWith(']')) {
      truncated += '\n]';
    }

    // Clean formatting
    truncated = truncated.replace(/,(\s*[}\]])/g, '$1');

    try {
      JSON.parse(truncated);
      console.log('✅ Message completion succeeded');
      return truncated;
    } catch (error) {
      console.log('❌ Message completion failed:', error);
    }
  }

  // Strategy 4: Fallback - simple bracket balancing
  console.log('📝 Fallback: simple bracket balancing...');
  let fallback = completed;

  for (let i = 0; i < Math.max(0, bracesDiff); i++) {
    fallback += '\n  }';
  }
  for (let i = 0; i < Math.max(0, bracketsDiff); i++) {
    fallback += '\n]';
  }

  fallback = fallback.replace(/,(\s*[}\]])/g, '$1');

  console.log('Fallback result length:', fallback.length);
  return fallback;
};

// Check if JSON appears complete
const isJsonComplete = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    console.log('✅ JSON is valid and complete');
    return parsed;
  } catch (error) {
    console.log('❌ JSON is incomplete:', error);
    return false;
  }
};

// Main function with comprehensive error handling
export const cleanGeneratedResponseContent = (content: ContentBlock) => {
  console.log('\n=== STARTING JSON CLEANING PROCESS ===');

  if (content.type !== 'text') {
    throw new Error(`Unexpected content type: ${content.type}`);
  }

  console.log('Raw content length:', content.text.length);

  try {
    // Step 1: Extract JSON from markdown
    const extractedJson = extractJsonFromMarkdown(content.text);

    if (!extractedJson) {
      throw new Error('No JSON content could be extracted from the response');
    }

    // Step 2: Check if already complete
    if (isJsonComplete(extractedJson)) {
      const parsed = JSON.parse(extractedJson);
      console.log('✅ JSON was already complete, parsed successfully');
      console.log('Result type:', Array.isArray(parsed) ? `array with ${parsed.length} items` : typeof parsed);
      return parsed;
    }

    // Step 3: Attempt completion
    console.log('\n=== ATTEMPTING JSON COMPLETION ===');
    const completedJson = completeJson(extractedJson);

    const parsed = JSON.parse(completedJson);
    console.log('✅ JSON completion successful');
    console.log('Result type:', Array.isArray(parsed) ? `array with ${parsed.length} items` : typeof parsed);
    return parsed;
  } catch (error) {
    console.log('\n=== CLEANUP FAILED ===');
    console.log('Error:', error);
    console.log('Raw content sample (first 500 chars):');
    console.log(JSON.stringify(content.text.slice(0, 500)));
    console.log('\nRaw content sample (last 500 chars):');
    console.log(JSON.stringify(content.text.slice(-500)));

    throw new Error(`JSON cleanup failed: ${error}`);
  }
};
