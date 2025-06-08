import { generateChats } from '../chatGenerator';
import { ReportData, ReportSummary } from '../types';
import { calculateMessageStatistics } from './calculateMessageStatistics';
import { categorizeCommercialTopics, categorizePrivacyTopics } from './categoriseTitles';
import { extractUserQuestions } from './extractUserQuestions';
import { analyseQuestionPatterns } from './patternAnalysis';
import { loadChatDataFromDirectory } from './readGeneratedChatFiles';
import { calculateTimeSavings } from './calculateTimeSavings';
import { calculateCostSavings } from './calculateCostSavings';

export const generateReportData = async (): Promise<ReportData | undefined> => {
  const chats = await generateChats();

  if (!chats) {
    return;
  }
  const { privacyChats, commercialChats } = chats;

  const allChats = [...commercialChats, ...privacyChats];

  const userQuestions = extractUserQuestions(allChats);

  const privacyTopics = categorizePrivacyTopics(privacyChats);
  const commercialContractTopics = categorizeCommercialTopics(commercialChats);

  const patterns = analyseQuestionPatterns(userQuestions);

  const statistics = calculateMessageStatistics(allChats);

  const timeSaved = calculateTimeSavings(allChats);

  const costSaved = calculateCostSavings(timeSaved.totalTimeSavedHours);

  const summary: ReportSummary = {
    totalConversations: allChats.length,
    totalUserQuestions: patterns.totalQuestions,
    avgMessagesPerChat: statistics.avgMessagesPerChat,
    avgQuestionsPerChat: statistics.avgUserQuestionsPerChat,
  };
  console.log('summary', summary);
  console.log('privacyTopics', privacyTopics);
  console.log('commercialContractTopics', commercialContractTopics);
  console.log('patterns', patterns);
  console.log('totalTimeSaved', timeSaved.totalTimeSavedHours);

  return {
    summary,
    privacyTopics,
    commercialContractTopics,
    patterns: patterns.patterns,
    statistics,
    mostCommonTerms: patterns.mostCommonTerms,
    timeSaved,
    costSaved,
  };
};

export const generateReportDataFromDirectory = (): ReportData | undefined => {
  const directoryPath = 'C:/Users/khumb/OneDrive/Documents/dev/ai-driven-synthetic-chat/output';
  const loadedChats = loadChatDataFromDirectory(directoryPath);
  if (!loadedChats) {
    console.log('No synthetic chat data');
    return;
  }

  const { privacyChats, commercialContractChats, allChats } = loadedChats;

  const userQuestions = extractUserQuestions(allChats);

  const privacyTopics = categorizePrivacyTopics(privacyChats);
  const commercialContractTopics = categorizeCommercialTopics(commercialContractChats);

  const patterns = analyseQuestionPatterns(userQuestions);

  const statistics = calculateMessageStatistics(allChats);

  const timeSaved = calculateTimeSavings(allChats);

  const costSaved = calculateCostSavings(timeSaved.totalTimeSavedHours);

  const summary: ReportSummary = {
    totalConversations: allChats.length,
    totalUserQuestions: patterns.totalQuestions,
    avgMessagesPerChat: statistics.avgMessagesPerChat,
    avgQuestionsPerChat: statistics.avgUserQuestionsPerChat,
  };
  console.log('summary', summary);
  console.log('privacyTopics', privacyTopics);
  console.log('commercialContractTopics', commercialContractTopics);
  console.log('patterns', patterns);
  console.log('totalTimeSaved', timeSaved.totalTimeSavedHours);
  return {
    summary,
    privacyTopics,
    commercialContractTopics,
    patterns: patterns.patterns,
    statistics,
    mostCommonTerms: patterns.mostCommonTerms,
    timeSaved,
    costSaved,
  };
};
