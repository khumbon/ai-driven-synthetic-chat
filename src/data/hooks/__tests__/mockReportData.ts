import { ReportData } from '@/api/types';

export const mockReportData: ReportData = {
  summary: {
    totalConversations: 12,
    totalUserQuestions: 35,
    avgMessagesPerChat: '5.8',
    avgQuestionsPerChat: '2.9',
  },
  privacyTopics: {
    'GDPR & International Compliance': 2,
    'AI & Privacy': 0,
    'Data Breaches & Incident Response': 2,
    'Employee Monitoring': 2,
    'Data Sharing & Transfers': 1,
    'Consent & Cookies': 0,
    'Cross-Border Data Transfers': 0,
    'Automated Decision-Making': 0,
    'Vendor Due Diligence': 0,
    'Records of Processing (Article 30)': 0,
  },
  commercialContractTopics: {
    'Contract Risk & Liability': 1,
    'Vendor Relationship Management': 0,
    'Intellectual Property & Licensing': 0,
    'Service Performance & SLAs': 0,
    'Payment & Financial Terms': 0,
    'Software Escrow & Data Portability': 0,
    'Termination & Exit Rights': 0,
    'Security & Compliance Requirements': 1,
    'Indemnification & Insurance': 0,
    'Force Majeure & Business Continuity': 0,
  },
  patterns: [
    { pattern: 'Do I need to...', count: 13 },
    { pattern: 'What are the requirements for...', count: 12 },
    { pattern: 'What are the penalties/risks...', count: 8 },
    { pattern: 'What documentation should...', count: 7 },
    { pattern: "What's reasonable/fair...", count: 4 },
    { pattern: 'Can I/we...', count: 3 },
    { pattern: 'What should I include/negotiate...', count: 2 },
    { pattern: 'What happens if...', count: 2 },
    { pattern: 'How do I balance/compromise...', count: 2 },
    { pattern: 'How should I modify/draft...', count: 1 },
    { pattern: 'How do I assess/evaluate...', count: 1 },
    { pattern: 'What specific language should...', count: 1 },
  ],
  mostCommonTerms: [
    ['ai', 11],
    ['requirements', 11],
    ['compliance', 6],
    ['liability', 5],
    ['insurance', 5],
    ['security', 5],
    ['payment', 5],
    ['consent', 5],
    ['notification', 5],
    ['transfer', 4],
  ],
  timeSaved: {
    totalQuestions: 35,
    totalTimeSaved: 978, // in minutes (16.3 hours)
    totalTimeSavedHours: 16.3,
    averageResponseTime: 2.5, // AI response time in minutes
    averageLawyerTime: 30, // typical lawyer time in minutes (adjusted to reach 16.3 hours)
    taskBreakdown: {
      'Legal Research': {
        count: 12,
        totalTimeSaved: 330, // 12 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Compliance Analysis': {
        count: 8,
        totalTimeSaved: 220, // 8 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Document Review': {
        count: 6,
        totalTimeSaved: 165, // 6 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Quick Answer': {
        count: 5,
        totalTimeSaved: 137.5, // 5 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Legal Opinion': {
        count: 2,
        totalTimeSaved: 55, // 2 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Risk Assessment': {
        count: 2,
        totalTimeSaved: 55, // 2 * (30 - 2.5)
        avgResponseTime: 2.5,
      },
      'Contract Drafting': {
        count: 0,
        totalTimeSaved: 0,
        avgResponseTime: 2.5,
      },
      'Policy Review': {
        count: 0,
        totalTimeSaved: 0,
        avgResponseTime: 2.5,
      },
      'Negotiation Strategy': {
        count: 0,
        totalTimeSaved: 0,
        avgResponseTime: 2.5,
      },
      'Template Creation': {
        count: 0,
        totalTimeSaved: 0,
        avgResponseTime: 2.5,
      },
    },
    analyses: [
      {
        question: 'What are the GDPR requirements for AI data processing?',
        taskType: 'Legal Research',
        confidence: 0.9,
        assistantResponseTime: 2.5,
        typicalLawyerTime: 30,
        timeSaved: 27.5,
        percentageSaved: 91.7,
      },
      {
        question: 'How should I assess compliance with employee monitoring laws?',
        taskType: 'Compliance Analysis',
        confidence: 0.85,
        assistantResponseTime: 2.5,
        typicalLawyerTime: 30,
        timeSaved: 27.5,
        percentageSaved: 91.7,
      },
      {
        question: 'Do I need employee consent for monitoring software?',
        taskType: 'Legal Opinion',
        confidence: 0.95,
        assistantResponseTime: 2.5,
        typicalLawyerTime: 30,
        timeSaved: 27.5,
        percentageSaved: 91.7,
      },
    ],
  },
  costSaved: '$4,890', // Based on $300/hour lawyer rate * 16.3 hours saved
  statistics: {
    totalMessages: 70, // Total messages across all conversations
    totalUserQuestions: 35,
    avgMessagesPerChat: '5.8',
    avgUserQuestionsPerChat: '2.9',
    longestConversation: {
      title: 'GDPR Compliance Strategy for AI Implementation',
      messageCount: 18,
      userQuestions: 8,
    },
    mostQuestionsConversation: {
      title: 'Contract Risk Assessment and Liability Review',
      messageCount: 16,
      userQuestions: 9,
    },
  },
};
