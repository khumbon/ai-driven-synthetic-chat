import path from 'path';
import { Category, SyntheticChat } from '../types';
import * as fs from 'fs';

interface FileLoadResult {
  filePath: string;
  success: boolean;
  chatCount: number;
  category?: Category;
  error?: string;
}

const determineCategoryFromFilename = (filePath: string): Category | undefined => {
  const fileName = path.basename(filePath).toLowerCase();

  // Check for privacy prefixes
  if (fileName.startsWith(Category.Privacy)) {
    return Category.Privacy;
  }

  // Check for commercial prefixes
  if (fileName.startsWith(Category.Commercial)) {
    return Category.Commercial;
  }

  // If no clear prefix, analyze content as fallback
  return undefined;
};

const readJsonFile = (filePath: string): SyntheticChat[] => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${(error as Error).message}`);
  }
};

// Load chats from a single file with full data
const loadChatsFromFile = (filePath: string): { chats: SyntheticChat[]; result: FileLoadResult } => {
  try {
    const data = readJsonFile(filePath);

    // Assign category based on filename
    const category = determineCategoryFromFilename(filePath);

    const result: FileLoadResult = {
      filePath,
      success: true,
      chatCount: data.length,
      category,
    };

    return { chats: data, result };
  } catch (error) {
    const result: FileLoadResult = {
      filePath,
      success: false,
      chatCount: 0,
      error: (error as Error).message,
    };

    return { chats: [], result };
  }
};

// Load multiple chat files
export const loadMultipleChatFiles = (filePaths: string[]) => {
  const fileResults = [];
  const allChats: SyntheticChat[] = [];
  const privacyChats: SyntheticChat[] = [];
  const commercialContractChats: SyntheticChat[] = [];
  const errors: string[] = [];

  let successfulFiles = 0;

  for (const filePath of filePaths) {
    const { chats, result } = loadChatsFromFile(filePath);

    fileResults.push(result);

    if (result.success) {
      if (result.category === Category.Privacy) {
        privacyChats.push(...chats);
      } else if (result.category === Category.Commercial) {
        commercialContractChats.push(...chats);
      }
      allChats.push(...chats);
      successfulFiles++;
      console.log(`✅ Loaded ${chats.length} chats from ${filePath} (${result.category} - determined from filename)`);
    } else {
      errors.push(`${filePath}: ${result.error}`);
      console.error(`❌ Failed to load ${filePath}: ${result.error}`);
    }
  }
  return {
    success: successfulFiles > 0,
    totalFiles: filePaths.length,
    successfulFiles,
    failedFiles: filePaths.length - successfulFiles,
    privacyChats,
    commercialContractChats,
    allChats,
    fileResults,
    errors,
  };
};

// Load from directory pattern
export const loadChatDataFromDirectory = (directoryPath: string, pattern: RegExp = /\.json$/) => {
  console.log(fs.readdirSync(directoryPath));
  try {
    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => pattern.test(file))
      .map((file) => path.join(directoryPath, file));

    if (files.length === 0) {
      console.warn(`⚠️  No files matching pattern found in ${directoryPath}`);
      return null;
    }

    console.log(`🔍 Found ${files.length} files in ${directoryPath}`);
    return loadMultipleChatFiles(files);
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error('Error reading directory:', errorMessage);
    return null;
  }
};
