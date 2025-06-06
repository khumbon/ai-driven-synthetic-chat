import { Chat, ChatApiResponse, ChatData, CombinedChat, Message, MessagesApiResponse, NestedChatData } from '../types';

export async function fetchChatData(url: string): Promise<(ChatData | NestedChatData)[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
}

export async function fetchAllChatData(urls: string[]): Promise<CombinedChat[]> {
  const allCombinedChats: CombinedChat[] = [];

  for (const url of urls) {
    const urlData = await fetchChatData(url);

    // Combine chat and messages from this single URL's data
    const combinedChat = combineUrlData(urlData);
    if (combinedChat) {
      allCombinedChats.push(combinedChat);
    }
  }

  return allCombinedChats;
}

function extractFromNestedStructure(data: NestedChatData): ChatApiResponse | MessagesApiResponse | null {
  // Handle the nested array structure like [3,0,[[{"success":true,"messages":[...]}]]]
  if (Array.isArray(data.json) && data.json.length >= 3) {
    const nestedData = data.json[2]; // The third element contains the actual data
    if (Array.isArray(nestedData) && nestedData.length > 0) {
      const innerArray = nestedData[0];
      if (Array.isArray(innerArray) && innerArray.length > 0) {
        const potentialResponse = innerArray[0];
        // Type guard to check if it's a valid API response
        if (typeof potentialResponse === 'object' && potentialResponse !== null && 'success' in potentialResponse) {
          return potentialResponse as ChatApiResponse | MessagesApiResponse;
        }
      }
    }
  }
  return null;
}

function combineUrlData(urlData: (ChatData | NestedChatData)[]): CombinedChat | null {
  let chatInfo: Chat | null = null;
  let messagesInfo: Message[] | null = null;

  // Look through all items from this URL to find chat and messages
  for (const item of urlData) {
    let apiResponse: ChatApiResponse | MessagesApiResponse | null = null;

    // Handle both old and new data structures
    if ('result' in item && item.result?.data?.json) {
      // Old structure
      apiResponse = item.result.data.json;
    } else if ('json' in item) {
      // New nested structure
      apiResponse = extractFromNestedStructure(item);
    }

    if (!apiResponse?.success) continue;

    // Check if this is a chat response
    if ('chat' in apiResponse && apiResponse.chat && !('messages' in apiResponse)) {
      chatInfo = apiResponse.chat;
    }

    // Check if this is a messages response
    if ('messages' in apiResponse && apiResponse.messages && Array.isArray(apiResponse.messages)) {
      messagesInfo = apiResponse.messages;
    }
  }

  // Return combined object if we have both parts
  if (chatInfo && messagesInfo && messagesInfo.length > 0) {
    return {
      chat: chatInfo,
      messages: messagesInfo,
    };
  }

  console.log('Missing data - chat:', !!chatInfo, 'messages:', !!messagesInfo);
  return null;
}
