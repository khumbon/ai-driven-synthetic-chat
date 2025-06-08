import { generateSyntheticChats } from './orchestrator';
import dotenv from 'dotenv';

dotenv.config();

export const generateChats = async () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('No anthropic api key');

    return;
  }

  try {
    const syntheticChats = await generateSyntheticChats(apiKey);
    console.log('syntheticChats');
    console.log(syntheticChats);
    console.log(`Generated ${syntheticChats.privacyChats.length} privacy lawyer chats`);
    console.log(`Generated ${syntheticChats.commercialChats.length} commercial contracts lawyer chats`);
    return syntheticChats;
  } catch (error) {
    console.error('Error in main execution:', error);
  }
};
