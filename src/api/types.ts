import { LAWYER_TASK_DURATIONS } from './analysis/calculateTimeSavings';

export interface Message {
  id: string;
  creatorId: number;
  chatId: string;
  role: string;
  content: string | null;
  version: number;
  parentId: string | null;
  tool_calls: object[] | null;
  tool_call_id: string | null;
  name: string | null;
  created: string;
  updated: string;
  metadata: object | null;
  organizationId: string;
  files?: FileInfo[];
  collections?: object[];
}

export interface FileInfo {
  id: string;
  contentType: string;
  name: string;
  size: number;
  created: string;
  updated: string;
  creatorId: number;
  isAccessControlled: boolean;
  parentCollectionId: string | null;
  metadata: object | null;
  organizationId: string;
  text: string;
}

export interface Chat {
  id: string;
  title: string;
  companyId: string | null;
  created: string;
  updated: string;
  organizationId: string;
  creatorId: number;
  isAccessControlled: boolean;
  _public: boolean;
  public: boolean;
}

export interface ChatApiResponse {
  success: boolean;
  chat?: Chat;
  chunks?: object;
}

export interface MessagesApiResponse {
  success: boolean;
  messages?: Message[];
  meta?: {
    values: Record<string, string[]>;
  };
}

export type NestedJsonArray = [number, number, [[ChatApiResponse | MessagesApiResponse], [string, number, number]][]];

export type MetaEntry = [number, number, [[{ [key: string]: number }], [string, number, number]][]];

export interface NestedJsonData {
  json: NestedJsonArray | MetaEntry;
}

export interface ChatData {
  result?: {
    data?: {
      json?: ChatApiResponse | MessagesApiResponse;
    };
  };
}

// For the new nested structure
export interface NestedChatData {
  json: ChatApiResponse | MessagesApiResponse; // Could be the nested array structure or direct response
}

export interface CombinedChat {
  chat: Chat;
  messages: Message[];
}

export interface ExtractedMessage {
  role: string;
  content: string | null;
  created: string;
  id: string;
}

export enum Category {
  Privacy = 'privacy',
  Commercial = 'commercial',
}

export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
}

export interface ExtractedChat {
  title: string;
  messages: ExtractedMessage[];
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  created: string;
}

export interface SythenticChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface SyntheticChat {
  id: string;
  title: string;
  messages: Array<SythenticChatMessage>;
  category: Category;
}

export interface GeneratedChats {
  privacyChats: SyntheticChat[];
  commercialChats: SyntheticChat[];
}

export interface UserQuestion {
  category: Category;
  chatTitle: string;
  question: string;
  timestamp: string;
}

export interface ReportSummary {
  totalConversations: number;
  totalUserQuestions: number;
  avgMessagesPerChat: string;
  avgQuestionsPerChat: string;
}

export interface TimeAnalysis {
  question: string;
  taskType: keyof typeof LAWYER_TASK_DURATIONS;
  confidence: number;
  assistantResponseTime: number; // in minutes
  typicalLawyerTime: number; // in minutes
  timeSaved: number; // in minutes
  percentageSaved: number; // 0-100
}

export interface TimeSavingsReport {
  totalQuestions: number;
  totalTimeSaved: number; // in minutes
  totalTimeSavedHours: number;
  averageResponseTime: number; // in minutes
  averageLawyerTime: number; // in minutes
  taskBreakdown: Record<
    keyof typeof LAWYER_TASK_DURATIONS,
    {
      count: number;
      totalTimeSaved: number;
      avgResponseTime: number;
    }
  >;
  analyses: TimeAnalysis[];
}

export interface PrivacyTopics {
  'GDPR & International Compliance': number;
  'AI & Privacy': number;
  'Data Breaches & Incident Response': number;
  'Employee Monitoring': number;
  'Data Sharing & Transfers': number;
  'Consent & Cookies': number;
  'Cross-Border Data Transfers': number;
  'Automated Decision-Making': number;
  'Vendor Due Diligence': number;
  'Records of Processing (Article 30)': number;
}

export interface CommercialTopics {
  'Contract Risk & Liability': number;
  'Vendor Relationship Management': number;
  'Intellectual Property & Licensing': number;
  'Service Performance & SLAs': number;
  'Payment & Financial Terms': number;
  'Software Escrow & Data Portability': number;
  'Termination & Exit Rights': number;
  'Security & Compliance Requirements': number;
  'Indemnification & Insurance': number;
  'Force Majeure & Business Continuity': number;
}

export interface ConversationStats {
  title: string;
  messageCount: number;
  userQuestions: number;
}

export interface Statistics {
  totalMessages: number;
  totalUserQuestions: number;
  avgMessagesPerChat: string;
  avgUserQuestionsPerChat: string;
  longestConversation: ConversationStats;
  mostQuestionsConversation: ConversationStats;
}
export interface ReportData {
  summary: {
    totalConversations: number;
    totalUserQuestions: number;
    avgMessagesPerChat: string; // could also be number if parsed
    avgQuestionsPerChat: string;
  };
  privacyTopics: PrivacyTopics;
  commercialContractTopics: CommercialTopics;
  patterns: {
    pattern: string;
    count: number;
  }[];
  mostCommonTerms: [string, number][];
  timeSaved: TimeSavingsReport;
  costSaved: string;
  statistics: Statistics;
}
