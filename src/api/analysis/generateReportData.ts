import { ReportSummary } from '../types';
import { calculateMessageStatistics } from './calculateMessageStatistics';
import { categorizeCommercialTopics, categorizePrivacyTopics } from './categoriseTitles';
import { extractUserQuestions } from './extractUserQuestions';
import { analyseQuestionPatterns } from './patternAnalysis';
import { loadChatDataFromDirectory } from './readGeneratedChatFiles';

export const generateReportData = () => {
  const directoryPath = 'C:/Users/khumb/OneDrive/Documents/dev/ai-driven-synthetic-chat/output';
  const loadedChats = loadChatDataFromDirectory(directoryPath);
  if (!loadedChats) {
    console.log('No synthetic chat data');
    return null;
  }

  const { privacyChats, commercialContractChats, allChats } = loadedChats;

  const userQuestions = extractUserQuestions(allChats);

  const privacyTopics = categorizePrivacyTopics(privacyChats);
  const commercialContractTopics = categorizeCommercialTopics(commercialContractChats);

  const patterns = analyseQuestionPatterns(userQuestions);

  const statistics = calculateMessageStatistics(allChats);

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
  return {
    summary,
    privacyTopics,
    commercialContractTopics,
    patterns: patterns.patterns,
    statistics,
    mostCommonTerms: patterns.mostCommonTerms,
  };
};
