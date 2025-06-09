import { ReportData } from '@/api/types';

export const mockReportData: ReportData = {
  summary: {
    totalConversations: 20,
    totalUserQuestions: 58,
    avgMessagesPerChat: '5.8',
    avgQuestionsPerChat: '2.9',
  },
  privacyTopics: {
    'GDPR & International Compliance': 4,
    'AI & Privacy': 1,
    'Data Breaches & Incident Response': 3,
    'Employee Monitoring': 3,
    'Data Sharing & Transfers': 2,
    'Consent & Cookies': 1,
    'Cross-Border Data Transfers': 1,
    'Automated Decision-Making': 1,
    'Vendor Due Diligence': 1,
    'Records of Processing (Article 30)': 1,
  },
  commercialContractTopics: {
    'Contract Risk & Liability': 2,
    'Vendor Relationship Management': 1,
    'Intellectual Property & Licensing': 1,
    'Service Performance & SLAs': 1,
    'Payment & Financial Terms': 1,
    'Software Escrow & Data Portability': 1,
    'Termination & Exit Rights': 1,
    'Security & Compliance Requirements': 2,
    'Indemnification & Insurance': 1,
    'Force Majeure & Business Continuity': 1,
  },
  patterns: [
    { pattern: 'Do I need to...', count: 22 },
    { pattern: 'What are the requirements for...', count: 20 },
    { pattern: 'What are the penalties/risks...', count: 13 },
    { pattern: 'What documentation should...', count: 12 },
    { pattern: "What's reasonable/fair...", count: 7 },
    { pattern: 'Can I/we...', count: 5 },
    { pattern: 'What should I include/negotiate...', count: 4 },
    { pattern: 'What happens if...', count: 3 },
    { pattern: 'How do I balance/compromise...', count: 3 },
    { pattern: 'How should I modify/draft...', count: 2 },
    { pattern: 'How do I assess/evaluate...', count: 2 },
    { pattern: 'What specific language should...', count: 2 },
  ],
  mostCommonTerms: [
    ['ai', 18],
    ['requirements', 18],
    ['compliance', 10],
    ['liability', 8],
    ['insurance', 8],
    ['security', 8],
    ['payment', 8],
    ['consent', 8],
    ['notification', 8],
    ['transfer', 7],
  ],
  timeSaved: {
    totalQuestions: 58,
    totalTimeSaved: 1595, // in minutes (26.6 hours)
    totalTimeSavedHours: 26.6,
    averageResponseTime: 2.5, // AI response time in minutes
    averageLawyerTime: 30, // typical lawyer time in minutes
    taskBreakdown: {
      'Legal Research': {
        count: 20,
        totalTimeSaved: 550,
        avgResponseTime: 2.5,
      },
      'Compliance Analysis': {
        count: 13,
        totalTimeSaved: 357.5,
        avgResponseTime: 2.5,
      },
      'Document Review': {
        count: 10,
        totalTimeSaved: 275,
        avgResponseTime: 2.5,
      },
      'Quick Answer': {
        count: 8,
        totalTimeSaved: 220,
        avgResponseTime: 2.5,
      },
      'Legal Opinion': {
        count: 3,
        totalTimeSaved: 82.5,
        avgResponseTime: 2.5,
      },
      'Risk Assessment': {
        count: 3,
        totalTimeSaved: 82.5,
        avgResponseTime: 2.5,
      },
      'Contract Drafting': {
        count: 1,
        totalTimeSaved: 27.5,
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
  costSaved: '$7,980', // Based on $300/hour lawyer rate * 26.6 hours saved
  statistics: {
    totalMessages: 116, // Total messages across all conversations (20 * 5.8)
    totalUserQuestions: 58,
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
