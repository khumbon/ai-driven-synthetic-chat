import { SyntheticChat, UserQuestion } from '../types';

export const extractUserQuestions = (chats: SyntheticChat[]): UserQuestion[] => {
  return chats.flatMap((chat) =>
    chat.messages
      .filter((message) => message.role === 'user')
      .map((message) => ({
        category: chat.category,
        chatTitle: chat.title,
        question: message.content,
        timestamp: message.timestamp,
      })),
  );
};
