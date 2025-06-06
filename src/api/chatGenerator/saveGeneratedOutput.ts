import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { Category } from '../types';

interface SaveInput {
  jsonData: object;
  directory?: string;
  category: Category;
}
// Save JSON to file with UUID filename
export const saveGeneratedOutput = async ({ jsonData, directory = './output', category }: SaveInput) => {
  try {
    // Create directory if it doesn't exist
    await fs.mkdir(directory, { recursive: true });

    // Generate UUID filename
    const filename = `${category}-${randomUUID()}.json`;
    const filepath = path.join(directory, filename);

    // Convert to formatted JSON string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Write to file
    await fs.writeFile(filepath, jsonString, 'utf8');

    console.log(`JSON saved successfully: ${filepath}`);
  } catch (error) {
    console.error('Failed to save JSON file:', error);
    throw error;
  }
};
