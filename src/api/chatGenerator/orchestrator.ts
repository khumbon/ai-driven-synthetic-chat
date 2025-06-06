import { initializeAnthropic } from './anthropic';
import { fetchAllChatData } from './dataFetcher';
import { extractChatContent } from './dataExtractor';
import { generatePrivacyChats, generateCommercialChats } from './chatGenerator';
import { GeneratedChats } from '../types';

//const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateSyntheticChats(
  apiKey: string,
  urls: string[],
  privacyCount: number = 10,
  commercialCount: number = 10,
): Promise<GeneratedChats> {
  // Initialize Anthropic instance
  initializeAnthropic(apiKey);

  console.log('Fetching source data from URLs...');
  const sourceData = await fetchAllChatData(urls);
  const extractedContent = extractChatContent(sourceData);

  console.log('Generating privacy lawyer chats...');
  const privacyChats = await generatePrivacyChats(extractedContent, privacyCount);

  //await delay(60000);

  console.log('Generating commercial contracts lawyer chats...');
  const commercialChats = await generateCommercialChats(extractedContent, commercialCount);

  return {
    privacyChats,
    commercialChats,
  };
}
