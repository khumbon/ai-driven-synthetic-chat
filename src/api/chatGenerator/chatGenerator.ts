import { createAnthropicMessage } from './anthropic';
import { cleanGeneratedResponseContent } from './cleanGeneratedResponseContent';
import { saveGeneratedOutput } from './saveGeneratedOutput';
import { Category, SyntheticChat } from '../types';

const createPrivacyPrompt = (sourceData: string, count: number): string => {
  return `
Based on the following real legal chat data, generate ${count} complete synthetic chat interactions between an in-house privacy lawyer and a legal AI. 

Source data for context of how a chat interaction would be:
${sourceData}

Each chat should:
1. Focus on realistic privacy law scenarios (GDPR compliance, data breaches, privacy policies, cross-border data transfers, etc.)
2. Show the lawyer asking specific, practical questions
3. Include AI providing detailed, actionable legal guidance
4. Be 3-5 message exchanges per chat
5. Reflect the professional tone and complexity of real legal consultations

Return the response as a JSON array with this structure:
[
  {
    "id": "privacy_chat_1",
    "title": "Chat title",
    "messages": [
      {"role": "user", "content": "...", "timestamp": "2024-06-15T10:00:00Z"},
      {"role": "assistant", "content": "...", "timestamp": "2024-06-15T10:01:00Z"}
    ],
    "category": "privacy"
  }
]
`;
};

function createCommercialPrompt(sourceData: string, count: number): string {
  return `
Based on the following real legal chat data, generate ${count} complete synthetic chat interactions between an in-house commercial contracts lawyer and AI.

Source data for context of how a chat interaction would be:
${sourceData}

Each chat should:
1. Focus on realistic commercial contract scenarios (MSAs, SaaS agreements, vendor contracts, indemnification clauses, liability limitations, etc.)
2. Show the lawyer seeking guidance on contract terms, negotiations, and risk management
3. Include AI providing strategic legal advice and drafting suggestions
4. Be 3-5 message exchanges per chat
5. Reflect the business-focused, risk-aware nature of commercial law practice

Return the response as a JSON array with this structure:
[
  {
    "id": "commercial_chat_1", 
    "title": "Chat title",
    "messages": [
      {"role": "user", "content": "...", "timestamp": "2024-06-15T10:00:00Z"},
      {"role": "assistant", "content": "...", "timestamp": "2024-06-15T10:01:00Z"}
    ],
    "category": "commercial"
  }
]
`;
}

async function generateChatsWithPrompt(prompt: string, category: Category): Promise<SyntheticChat[]> {
  try {
    const response = await createAnthropicMessage({ prompt });

    const content = response.content[0];
    console.log('⚠️ Anthropic Response');
    console.log(content);

    const generatedChatContent = cleanGeneratedResponseContent(content);

    await saveGeneratedOutput({ jsonData: generatedChatContent, category });
    return generatedChatContent;
  } catch (error) {
    console.error('Error generating chats:', error);
    return [];
  }
}

export async function generatePrivacyChats(sourceData: string, count: number = 10): Promise<SyntheticChat[]> {
  const prompt = createPrivacyPrompt(sourceData, count);
  return generateChatsWithPrompt(prompt, Category.Privacy);
}

export async function generateCommercialChats(sourceData: string, count: number = 10): Promise<SyntheticChat[]> {
  const prompt = createCommercialPrompt(sourceData, count);
  return generateChatsWithPrompt(prompt, Category.Commercial);
}
