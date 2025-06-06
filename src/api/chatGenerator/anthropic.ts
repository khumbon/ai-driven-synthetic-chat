import Anthropic from '@anthropic-ai/sdk';

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
  const anthropic = getAnthropic();

  return anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens || 10000,
    messages: [{ role: 'user', content: prompt }],
  });
};
