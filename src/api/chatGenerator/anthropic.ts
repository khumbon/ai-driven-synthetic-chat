import Anthropic from '@anthropic-ai/sdk';
import { ErrorObject } from '@anthropic-ai/sdk/resources/shared.js';

let anthropicInstance: Anthropic | null = null;

export const initializeAnthropic = (apiKey: string): Anthropic => {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({ apiKey });
  }
  return anthropicInstance;
};

export const getAnthropic = (): Anthropic => {
  if (!anthropicInstance) {
    throw new Error('Anthropic instance not initialized. Call initializeAnthropic() first.');
  }
  return anthropicInstance;
};

export const createAnthropicMessage = ({ prompt, maxTokens }: { prompt: string; maxTokens?: number }) => {
  try {
    const anthropic = getAnthropic();

    const response = anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens || 20000,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1, // Lower temperature for more consistent JSON
    });

    return response;
  } catch (err) {
    const error: ErrorObject = err as ErrorObject;
    console.error('Anthropic API Error:', {
      message: error.message,
      type: error.type,
      error: error,
    });
    throw error;
  }
};
