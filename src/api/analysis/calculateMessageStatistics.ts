import { ConversationStats, Statistics, SyntheticChat } from '../types';

// Statistics calculation functions
export const calculateConversationStats = (chats: SyntheticChat[]): ConversationStats[] => {
  return chats.map((chat) => ({
    title: chat.title,
    messageCount: chat.messages.length,
    userQuestions: chat.messages.filter((msg) => msg.role === 'user').length,
  }));
};

export const calculateMessageStatistics = (chats: SyntheticChat[]): Statistics => {
  const messageStats = calculateConversationStats(chats);

  const totalMessages = messageStats.reduce((sum, chat) => sum + chat.messageCount, 0);
  const totalUserQuestions = messageStats.reduce((sum, chat) => sum + chat.userQuestions, 0);

  const findMaxBy = <T>(array: T[], selector: (item: T) => number): T => {
    return array.reduce((max, current) => (selector(current) > selector(max) ? current : max));
  };

  return {
    totalMessages,
    totalUserQuestions,
    avgMessagesPerChat: chats.length > 0 ? (totalMessages / chats.length).toFixed(1) : '0.0',
    avgUserQuestionsPerChat: chats.length > 0 ? (totalUserQuestions / chats.length).toFixed(1) : '0.0',
    longestConversation:
      messageStats.length > 0
        ? findMaxBy(messageStats, (s) => s.messageCount)
        : { title: '', messageCount: 0, userQuestions: 0 },
    mostQuestionsConversation:
      messageStats.length > 0
        ? findMaxBy(messageStats, (s) => s.userQuestions)
        : { title: '', messageCount: 0, userQuestions: 0 },
  };
};
