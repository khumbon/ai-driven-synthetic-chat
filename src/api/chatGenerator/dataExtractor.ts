import { CombinedChat, ExtractedChat, ExtractedMessage } from '../types';

export function extractChatContent(combinedChats: CombinedChat[]): string {
  const extractedChats: ExtractedChat[] = combinedChats
    .map((combinedChat): ExtractedChat | null => {
      const { chat, messages } = combinedChat;

      if (!chat || !messages || messages.length === 0) {
        console.log('Invalid combined chat data');
        return null;
      }

      return {
        title: chat.title,
        messages: messages.map(
          (msg): ExtractedMessage => ({
            role: msg.role,
            content: msg.content,
            created: msg.created,
            id: msg.id,
          }),
        ),
      };
    })
    .filter((chat): chat is ExtractedChat => chat !== null);

  return JSON.stringify(extractedChats, null, 2);
}
