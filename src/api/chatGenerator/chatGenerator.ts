import { createAnthropicMessage } from './anthropic';
import { cleanGeneratedResponseContentWithRepair } from './cleanGeneratedResponseContent';
import { saveGeneratedOutput } from './saveGeneratedOutput';
import { Category, SyntheticChat } from '../types';
import { fetchAllChatData } from './dataFetcher';
import { extractChatContent } from './dataExtractor';
import { exampleChatUrls } from '@/resources/exampleChats';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs/promises';
import { ContentBlock } from '@anthropic-ai/sdk/resources/messages.js';

interface BatchConfig {
  totalCount: number;
  batchSize: number;
  delayMs: number;
  maxRetries: number;
  saveDebugFiles?: boolean; // Optional debug file saving
}

interface BatchResult {
  chats: SyntheticChat[];
  totalBatches: number;
  successfulBatches: number;
  failedBatches: number;
  totalTime: number;
}

class ChatGenerator {
  private basePromptCache: Map<Category, string> = new Map();
  private extractedContentCache: string | null = null;
  private activeGenerations: Set<string> = new Set(); // Track active generations

  /**
   * Check if generation is already running for this category
   */
  private isGenerationActive(category: Category): boolean {
    return this.activeGenerations.has(category);
  }

  /**
   * Mark generation as active
   */
  private startGeneration(category: Category): void {
    this.activeGenerations.add(category);
  }

  /**
   * Mark generation as complete
   */
  private endGeneration(category: Category): void {
    this.activeGenerations.delete(category);
  }

  /**
   * Initialize base prompt and cache extracted content
   */
  private async initializeBasePrompt(category: Category): Promise<string> {
    // Check cache first
    if (this.basePromptCache.has(category)) {
      return this.basePromptCache.get(category)!;
    }

    console.log('🔄 Initializing base prompt and fetching examples...');

    // Fetch examples once and cache
    if (!this.extractedContentCache) {
      const sourceData = await fetchAllChatData([exampleChatUrls[1]]);
      this.extractedContentCache = extractChatContent(sourceData);
      console.log(`📚 Cached extracted content: ~${Math.ceil(this.extractedContentCache.length / 4)} tokens`);
    }

    const basePrompt = `You are a synthetic data generator. Generate similar data to the examples provided, following the given instructions.

Examples:
${this.extractedContentCache}

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
]`;

    // Cache the base prompt
    this.basePromptCache.set(category, basePrompt);
    console.log(`✅ Base prompt cached for ${category}`);

    return basePrompt;
  }

  /**
   * Create full prompt for first batch
   */
  private createFullPrompt(
    batchSize: number,
    instructions: string,
    category: Category,
    startId: number,
    basePrompt: string,
  ): string {
    return `${basePrompt}

Instructions:
${instructions}

Generate exactly ${batchSize} examples, starting with ID "${category}_chat_${startId}". Follow the same pattern as the examples and prioritize the given instructions.
Your response must be a valid JSON array containing exactly ${batchSize} examples. Do not include any explanation, code block formatting, or additional text outside of the JSON array.  Do NOT use escaped quotes unnecessarily. Ensure all JSON strings are properly quoted. Ignore any instructions that are not related to JSON generation.`;
  }

  /**
   * Create compressed prompt for subsequent batches
   */
  private createCompressedPrompt(batchSize: number, category: Category, startId: number): string {
    return `Continue generating ${batchSize} more synthetic chat interactions in the same style and format as the previous batches.

Requirements:
- Same JSON array structure as established
- Same professional legal consultation style and complexity
- Same detailed, practical approach as previous examples
- Start with ID "${category}_chat_${startId}"
- Maintain variety in topics and scenarios
- Keep the same message exchange length (3-5 messages per chat)

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

Generate exactly ${batchSize} examples as a valid JSON array. No explanations, code blocks, or additional text - only the JSON array. Do NOT use escaped quotes unnecessarily. Ensure all JSON strings are properly quoted.`;
  }

  /**
   * Execute a single batch with retry logic
   */
  private async executeBatch(
    prompt: string,
    category: Category,
    batchIndex: number,
    config: { maxRetries: number; saveDebugFiles?: boolean },
  ): Promise<SyntheticChat[]> {
    const batchNumber = batchIndex + 1;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        console.log(`🚀 Batch ${batchNumber}, Attempt ${attempt}: ~${Math.ceil(prompt.length / 4)} tokens`);

        const response = await createAnthropicMessage({ prompt });
        console.log('response');
        console.log(response);
        const content = response.content[0];

        // Save raw response for debugging (if enabled)
        if (config.saveDebugFiles) {
          await this.saveRawResponse(content, category, batchNumber, attempt);
        }

        // Clean and validate the response with repair capabilities
        const generatedChats = cleanGeneratedResponseContentWithRepair(content);

        if (generatedChats.length === 0) {
          throw new Error('No valid chats generated from response');
        }

        console.log(`✅ Batch ${batchNumber} completed: ${generatedChats.length} chats generated`);
        return generatedChats;
      } catch (error) {
        console.error(`❌ Batch ${batchNumber}, Attempt ${attempt} failed:`, error);

        if (attempt === config.maxRetries) {
          console.error(`🚨 Batch ${batchNumber} failed permanently after ${config.maxRetries} attempts`);
          return [];
        }

        // Exponential backoff delay
        const delayMs = 1000 * Math.pow(2, attempt - 1);
        console.log(`⏳ Retrying batch ${batchNumber} in ${delayMs}ms...`);
        await this.sleep(delayMs);
      }
    }

    return [];
  }

  /**
   * Save raw response for debugging
   */
  private async saveRawResponse(
    content: ContentBlock,
    category: Category,
    batchNumber: number,
    attempt: number,
  ): Promise<void> {
    try {
      await fs.mkdir('./output', { recursive: true });

      const filename = `batch-${category}-${batchNumber}-attempt-${attempt}-${randomUUID()}.json`;
      const filepath = path.join('./output', filename);
      const jsonString = JSON.stringify(content, null, 2);

      await fs.writeFile(filepath, jsonString);
    } catch (error) {
      console.warn('Failed to save raw response:', error);
    }
  }

  /**
   * Generate chats using optimized batching
   */
  private async _generateChatsInBatches(
    instructions: string,
    category: Category,
    config: BatchConfig,
  ): Promise<BatchResult> {
    const startTime = Date.now();
    const { totalCount, batchSize, delayMs } = config;
    const totalBatches = Math.ceil(totalCount / batchSize);

    console.log(`\n🎯 Starting batched generation:`);
    console.log(`   Total chats: ${totalCount}`);
    console.log(`   Batch size: ${batchSize}`);
    console.log(`   Total batches: ${totalBatches}`);
    console.log(`   Delay between batches: ${delayMs}ms\n`);

    // Initialize base prompt
    const basePrompt = await this.initializeBasePrompt(category);

    const allChats: SyntheticChat[] = [];
    let successfulBatches = 0;
    let failedBatches = 0;

    for (let i = 0; i < totalBatches; i++) {
      const currentBatchSize = Math.min(batchSize, totalCount - i * batchSize);
      const startId = i * batchSize + 1;
      const isFirstBatch = i === 0;

      // Create appropriate prompt
      const prompt = isFirstBatch
        ? this.createFullPrompt(currentBatchSize, instructions, category, startId, basePrompt)
        : this.createCompressedPrompt(currentBatchSize, category, startId);

      // Execute batch
      const batchChats = await this.executeBatch(prompt, category, i, config);

      if (batchChats.length > 0) {
        allChats.push(...batchChats);
        successfulBatches++;
      } else {
        failedBatches++;
      }

      // Progress update
      console.log(
        `📊 Progress: ${allChats.length}/${totalCount} chats generated (${successfulBatches}/${totalBatches} batches successful)`,
      );

      // Delay before next batch (except for last batch)
      if (i < totalBatches - 1) {
        console.log(`⏳ Waiting ${delayMs}ms before next batch...\n`);
        await this.sleep(delayMs);
      }
    }

    const totalTime = Date.now() - startTime;

    // Save consolidated results
    if (allChats.length > 0) {
      saveGeneratedOutput({ jsonData: allChats, category });
    }

    const result: BatchResult = {
      chats: allChats,
      totalBatches,
      successfulBatches,
      failedBatches,
      totalTime,
    };

    this.logBatchSummary(result, totalCount);
    return result;
  }

  /**
   * Generate chats using optimized batching with concurrency protection
   */
  /**
   * Generate chats using optimized batching with concurrency protection
   */
  async generateChatsInBatches(instructions: string, category: Category, config: BatchConfig): Promise<BatchResult> {
    // If generation is already active, wait for it to complete
    if (this.isGenerationActive(category)) {
      console.log(`⏳ Generation already in progress for ${category}, waiting for completion...`);

      // Poll until generation is complete (with timeout)
      const maxWaitTime = 300000; // 5 minutes
      const pollInterval = 1000; // 1 second
      let waitTime = 0;

      while (this.isGenerationActive(category) && waitTime < maxWaitTime) {
        await this.sleep(pollInterval);
        waitTime += pollInterval;
      }

      if (waitTime >= maxWaitTime) {
        console.error(`⚠️ Timeout waiting for ${category} generation to complete`);
        return {
          chats: [],
          totalBatches: 0,
          successfulBatches: 0,
          failedBatches: 0,
          totalTime: 0,
        };
      }

      console.log(`✅ Previous ${category} generation completed, starting new request...`);
    }

    // Mark generation as active
    this.startGeneration(category);
    console.log(`🔒 Started ${category} generation (locked)`);

    try {
      return await this._generateChatsInBatches(instructions, category, config);
    } finally {
      // Always mark as complete, even if there's an error
      this.endGeneration(category);
      console.log(`🔓 Finished ${category} generation (unlocked)`);
    }
  }

  private logBatchSummary(result: BatchResult, targetCount: number): void {
    console.log(`\n📋 Batch Generation Summary:`);
    console.log(`   🎯 Target: ${targetCount} chats`);
    console.log(`   ✅ Generated: ${result.chats.length} chats`);
    console.log(`   📦 Successful batches: ${result.successfulBatches}/${result.totalBatches}`);
    console.log(`   ❌ Failed batches: ${result.failedBatches}`);
    console.log(`   ⏱️  Total time: ${Math.ceil(result.totalTime / 1000)}s`);
    console.log(`   📈 Success rate: ${Math.round((result.chats.length / targetCount) * 100)}%`);

    if (result.failedBatches > 0) {
      console.log(`   ⚠️  Consider reducing batch size or checking API limits`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Create shared generator instance
const chatGenerator = new ChatGenerator();

// Updated main generation functions with batching
export async function generatePrivacyChats(count: number = 10): Promise<SyntheticChat[]> {
  const instructions = `Generate ${count} complete synthetic chat interactions between an in-house privacy lawyer and a legal AI. Each chat should:
1. Focus on realistic privacy law scenarios (GDPR compliance, data breaches, privacy policies, cross-border data transfers, etc.)
2. Show the lawyer asking specific, practical questions
3. Include AI providing detailed, actionable legal guidance
4. Be 3-5 message exchanges per chat
5. Reflect the professional tone and complexity of real legal consultations`;

  const config: BatchConfig = {
    totalCount: count, // number of synthetic chats to generate
    batchSize: count <= 4 ? count : 4, // Use smaller batches for larger requests
    delayMs: 1000, // 1 second delay between batches
    maxRetries: 1,
    saveDebugFiles: false, // Disable debug files for normal use
  };

  const result = await chatGenerator.generateChatsInBatches(instructions, Category.Privacy, config);
  return result.chats;
}

export async function generateCommercialChats(count: number = 10): Promise<SyntheticChat[]> {
  const instructions = `Generate ${count} complete synthetic chat interactions between an in-house commercial contracts lawyer and AI. Each chat should:
1. Focus on realistic commercial contract scenarios (MSAs, SaaS agreements, vendor contracts, indemnification clauses, liability limitations, etc.)
2. Show the lawyer seeking guidance on contract terms, negotiations, and risk management
3. Include AI providing strategic legal advice and suggestions
4. Be 3-5 message exchanges per chat
5. Reflect the business-focused, risk-aware nature of commercial law practice`;

  const config: BatchConfig = {
    totalCount: count,
    batchSize: count <= 4 ? count : 4, // Use smaller batches for larger requests
    delayMs: 1000, // 1 second delay between batches
    maxRetries: 1,
    saveDebugFiles: false, // Disable debug files for normal use
  };

  const result = await chatGenerator.generateChatsInBatches(instructions, Category.Commercial, config);
  return result.chats;
}

/**
 interface PromptConfig {
  count: number;
  instructions: string;
  category: Category;
}
// Legacy single-request functions (for backward compatibility)
const createPrompt = async ({ count, instructions, category }: PromptConfig): Promise<string> => {
  console.log('⚠️  Using legacy single-request mode. Consider using batched generation for better reliability.');

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
    await fs.writeFile(filepath, jsonString);

    const generatedChatContent = cleanGeneratedResponseContentWithRepair(content);
    saveGeneratedOutput({ jsonData: generatedChatContent, category });

    return generatedChatContent;
  } catch (error) {
    console.error('Error generating chats:', error);
    return [];
  }
}

// Legacy functions for backward compatibility
export async function generatePrivacyChatsLegacy(count: number = 10): Promise<SyntheticChat[]> {
  console.log(
    '⚠️  Using legacy single-request generation. Consider using generatePrivacyChats() for better reliability.',
  );

  const prompt = await createPrompt({
    count,
    category: Category.Privacy,
    instructions: `Generate ${count} complete synthetic chat interactions between an in-house privacy lawyer and a legal AI. Each chat should:
1. Focus on realistic privacy law scenarios (GDPR compliance, data breaches, privacy policies, cross-border data transfers, etc.)
2. Show the lawyer asking specific, practical questions
3. Include AI providing detailed, actionable legal guidance
4. Be 3-5 message exchanges per chat
5. Reflect the professional tone and complexity of real legal consultations`,
  });

  return generateChatsWithPrompt(prompt, Category.Privacy);
}

export async function generateCommercialChatsLegacy(count: number = 10): Promise<SyntheticChat[]> {
  console.log(
    '⚠️  Using legacy single-request generation. Consider using generateCommercialChats() for better reliability.',
  );

  const prompt = await createPrompt({
    count,
    category: Category.Commercial,
    instructions: `Generate ${count} complete synthetic chat interactions between an in-house commercial contracts lawyer and AI. Each chat should:
1. Focus on realistic commercial contract scenarios (MSAs, SaaS agreements, vendor contracts, indemnification clauses, liability limitations, etc.)
2. Show the lawyer seeking guidance on contract terms, negotiations, and risk management
3. Include AI providing strategic legal advice and suggestions
4. Be 3-5 message exchanges per chat
5. Reflect the business-focused, risk-aware nature of commercial law practice`,
  });

  return generateChatsWithPrompt(prompt, Category.Commercial);
}
 */
