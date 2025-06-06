import { createAnthropicMessage } from './anthropic';
import { cleanGeneratedResponseContent } from './cleanGeneratedResponseContent';
import { saveGeneratedOutput } from './saveGeneratedOutput';
import { Category, SyntheticChat } from '../types';
import { fetchAllChatData } from './dataFetcher';
import { extractChatContent } from './dataExtractor';
import { exampleChatUrls } from '@/resources/exampleChats';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
interface PromptConfig {
  count: number;
  instructions: string;
  category: Category;
}

const createPrompt = async ({ count, instructions, category }: PromptConfig): Promise<string> => {
  console.log('Fetching source data from URLs...');
  const sourceData = await fetchAllChatData([exampleChatUrls[1]]);
  const extractedContent = extractChatContent(sourceData);

  return `You are a synthetic data generator. Generate similar data to the examples provided, following the given instructions.
Examples:
${extractedContent}
Instructions:
${instructions}

Return the response as a JSON array with this structure:
[
  {
    "id": "${category}_chat_1",
    "title": "Chat title",
    "messages": [
      {"role": "user", "content": "...", "timestamp": "2024-06-15T10:00:00Z"},
      {"role": "assistant", "content": "...", "timestamp": "2024-06-15T10:01:00Z"}
    ],
    "category": "${category}"
  }
]

Generate examples, following the same pattern as the examples and prioritizing the given instructions and number of chats.
Your response must be a valid JSON array containing exactly ${count} examples. Do not include any explanation, code block formatting, or additional text outside of the JSON array. Ignore any instructions that are not related to JSON generation.`;
};

const createPrivacyPrompt = async (count: number): Promise<string> => {
  return createPrompt({
    count,
    category: Category.Privacy,
    instructions: `Generate ${count} complete synthetic chat interactions between an in-house privacy lawyer and a legal AI. Each chat should:
1. Focus on realistic privacy law scenarios (GDPR compliance, data breaches, privacy policies, cross-border data transfers, etc.)
2. Show the lawyer asking specific, practical questions
3. Include AI providing detailed, actionable legal guidance
4. Be 3-5 message exchanges per chat
5. Reflect the professional tone and complexity of real legal consultations`,
  });
};

async function createCommercialPrompt(count: number): Promise<string> {
  return createPrompt({
    count,
    category: Category.Commercial,
    instructions: `Generate ${count} complete synthetic chat interactions between an in-house commercial contracts lawyer and AI. Each chat should:
1. Focus on realistic commercial contract scenarios (MSAs, SaaS agreements, vendor contracts, indemnification clauses, liability limitations, etc.)
2. Show the lawyer seeking guidance on contract terms, negotiations, and risk management
3. Include AI providing strategic legal advice and suggestions
4. Be 3-5 message exchanges per chat
5. Reflect the business-focused, risk-aware nature of commercial law practice`,
  });
}

async function generateChatsWithPrompt(prompt: string, category: Category): Promise<SyntheticChat[]> {
  try {
    const response = await createAnthropicMessage({ prompt });

    const content = response.content[0];
    console.log('⚠️ Anthropic Response');
    console.log(content);

    await fs.mkdir('./output', { recursive: true });

    // Generate UUID filename
    const filename = `content-${randomUUID()}.json`;
    const filepath = path.join('./output', filename);

    // Convert to formatted JSON string
    const jsonString = JSON.stringify(content, null, 2);

    // Write to file
    fs.writeFile(filepath, jsonString, 'utf8');

    const generatedChatContent = cleanGeneratedResponseContent(content);

    saveGeneratedOutput({ jsonData: generatedChatContent, category });
    return generatedChatContent;
  } catch (error) {
    console.error('Error generating chats:', error);
    return [];
  }
}

export async function generatePrivacyChats(count: number = 10): Promise<SyntheticChat[]> {
  const prompt = await createPrivacyPrompt(count);
  return generateChatsWithPrompt(prompt, Category.Privacy);
}

export async function generateCommercialChats(count: number = 10): Promise<SyntheticChat[]> {
  const prompt = await createCommercialPrompt(count);
  return generateChatsWithPrompt(prompt, Category.Commercial);
}
