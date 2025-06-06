import { initializeAnthropic } from './anthropic';
import { generatePrivacyChats, generateCommercialChats } from './chatGenerator';
import { GeneratedChats } from '../types';

//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateSyntheticChats(
  apiKey: string,
  privacyCount: number = 10,
  commercialCount: number = 10,
): Promise<GeneratedChats> {
  // Initialize Anthropic instance
  initializeAnthropic(apiKey);

  console.log('Generating privacy lawyer chats...');
  const privacyChats = await generatePrivacyChats(privacyCount);

  //await delay(60000);

  console.log('Generating commercial contracts lawyer chats...');
  const commercialChats = await generateCommercialChats(commercialCount);

  return {
    privacyChats,
    commercialChats,
  };
}
