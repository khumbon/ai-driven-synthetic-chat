import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.js';
import { Category, SyntheticChat } from '../types';

enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
}

interface SyntheticChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

interface RawChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

interface RawChat {
  id: string;
  title: string;
  messages: Array<RawChatMessage>;
  category: string;
}

/**
 * Simplified version focusing on core validation
 */
export const cleanGeneratedResponseContent = (content: ContentBlock): SyntheticChat[] => {
  console.log('\n=== CLEANING GENERATED CONTENT ===');

  if (!content || content.type !== 'text') {
    throw new Error('Unexpected content');
  }

  try {
    // Basic content validation
    if (!content?.text) {
      console.error('No text content found');
      return [];
    }

    console.log('Content length:', content.text.length);

    // Extract JSON (handle markdown code blocks)
    let jsonText = content.text.trim();
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    // Parse JSON
    let rawChats: RawChat[];
    try {
      rawChats = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('First 200 chars:', jsonText.substring(0, 200));
      console.error('Last 200 chars:', jsonText.substring(Math.max(0, jsonText.length - 200)));
      return [];
    }

    // Validate array
    if (!Array.isArray(rawChats)) {
      console.error('Expected array, got:', typeof rawChats);
      return [];
    }

    // Transform chats with basic validation
    const cleanedChats: SyntheticChat[] = [];

    for (const rawChat of rawChats) {
      const cleaned = transformChat(rawChat);
      if (cleaned) {
        cleanedChats.push(cleaned);
      }
    }

    console.log(`✅ Processed ${cleanedChats.length}/${rawChats.length} chats`);
    return cleanedChats;
  } catch (error) {
    console.error('Cleaning failed:', error);
    return [];
  }
};

/**
 * Transform and validate a single chat with essential checks only
 */
function transformChat(rawChat: RawChat): SyntheticChat | null {
  // ADD THIS DEBUG LOGGING:
  console.log('🔍 Raw chat structure:', {
    id: rawChat?.id,
    title: rawChat?.title,
    messages: rawChat?.messages ? 'exists' : 'missing',
    category: rawChat?.category,
    allKeys: rawChat ? Object.keys(rawChat) : 'no object',
  });

  // Essential field validation
  if (!rawChat?.id || !rawChat?.title || !rawChat?.messages || !rawChat?.category) {
    console.warn('Chat missing required fields:', {
      id: !!rawChat?.id,
      title: !!rawChat?.title || `${rawChat?.category}-${rawChat?.id}`,
      messages: !!rawChat?.messages,
      category: !!rawChat?.category,
    });
  }

  // Category validation (flexible)
  const category = rawChat.category.toLowerCase();
  const chatCategory = category === 'privacy' ? Category.Privacy : Category.Commercial;

  // Messages validation
  if (!Array.isArray(rawChat.messages) || rawChat.messages.length === 0) {
    console.warn(`Chat ${rawChat.id} has invalid messages`);
    return null;
  }

  // Transform messages with basic validation
  const messages: SyntheticChatMessage[] = [];
  for (const msg of rawChat.messages) {
    const transformed = transformMessage(msg);
    if (transformed) {
      messages.push(transformed);
    }
  }

  if (messages.length === 0) {
    console.warn(`Chat ${rawChat.id} has no valid messages`);
    return null;
  }

  return {
    id: rawChat.id,
    title: rawChat.title || `${rawChat?.category}-${rawChat?.id}`,
    category: chatCategory,
    messages,
  };
}

/**
 * Transform message with essential validation only
 */
function transformMessage(rawMessage: RawChatMessage): SyntheticChatMessage | null {
  // Essential checks
  if (!rawMessage?.role || !rawMessage?.content) {
    return null;
  }

  // Role validation (flexible)
  const role = rawMessage.role.toLowerCase();
  if (role !== 'user' && role !== 'assistant') {
    return null;
  }

  return {
    role: role === 'user' ? ChatRole.User : ChatRole.Assistant,
    content: rawMessage.content.trim(),
    timestamp: rawMessage.timestamp || '',
  };
}

/**
 * Enhanced version with repair capabilities for production use
 */
export const cleanGeneratedResponseContentWithRepair = (content: ContentBlock): SyntheticChat[] => {
  console.log('\n=== CLEANING WITH REPAIR CAPABILITIES ===');

  // First try the simple approach
  const simpleResult = cleanGeneratedResponseContent(content);
  if (simpleResult.length > 0) {
    return simpleResult;
  }

  // If that fails, try repair strategies
  console.log('Simple cleaning failed, attempting repair...');

  if (!content || content.type !== 'text' || !content.text) {
    throw new Error('Unexpected content');
  }

  try {
    if (!content?.text) return [];

    let jsonText = content.text.trim();

    // Remove code blocks
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    // Attempt to repair truncated JSON
    const repairedJson = attemptJsonRepair(jsonText);
    if (repairedJson) {
      console.log('✅ Successfully repaired truncated JSON');

      try {
        const rawChats = JSON.parse(repairedJson);
        if (Array.isArray(rawChats)) {
          const cleanedChats: SyntheticChat[] = [];
          for (const rawChat of rawChats) {
            const cleaned = transformChat(rawChat);
            if (cleaned) cleanedChats.push(cleaned);
          }

          console.log(`🔧 Repair recovered ${cleanedChats.length} chats`);
          return cleanedChats;
        }
      } catch (e) {
        console.error('Repaired JSON still invalid:', e);
      }
    }
  } catch (error) {
    console.error('Repair attempt failed:', error);
  }

  return [];
};

/**
 * Attempt to repair truncated JSON by finding complete objects
 */
function attemptJsonRepair(jsonText: string): string | null {
  // Look for complete chat objects
  const chatPattern = /\{\s*"id":\s*"[^"]+"/g;
  const matches = Array.from(jsonText.matchAll(chatPattern));

  if (matches.length === 0) return null;

  // Find the last complete object
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    if (!match.index) continue;

    // Try to find the end of this object
    let braceCount = 0;
    let endPos = -1;

    for (let j = match.index; j < jsonText.length; j++) {
      const char = jsonText[j];
      if (char === '{') braceCount++;
      else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          endPos = j + 1;
          break;
        }
      }
    }

    if (endPos > 0) {
      // Extract complete objects and close array
      const completeSection = jsonText.substring(0, endPos);
      const repairedJson = completeSection + '\n]';

      // Quick validation
      try {
        JSON.parse(repairedJson);
        return repairedJson;
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }

  return null;
}
