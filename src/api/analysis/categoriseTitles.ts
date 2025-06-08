import { CommercialTopics, PrivacyTopics, SyntheticChat } from '../types';

// Keyword definitions for categorization
const categoryKeywords: Record<keyof PrivacyTopics, string[]> = {
  'GDPR & International Compliance': [
    'gdpr',
    'compliance',
    'international',
    'supervisory authority',
    'ico',
    'dpo',
    'data protection officer',
    'article 30',
    'lawful basis',
    'legitimate interest',
    'ccpa',
    'cpra',
    'virginia cdpa',
    'colorado cpa',
  ],
  'AI & Privacy': [
    'ai',
    'artificial intelligence',
    'machine learning',
    'automated decision',
    'profiling',
    'algorithm',
    'recommendation engine',
    'predictive analytics',
    'explainable ai',
    'bias testing',
    'article 22',
  ],
  'Data Breaches & Incident Response': [
    'breach',
    'incident',
    'notification',
    '72 hours',
    'article 33',
    'article 34',
    'ransomware',
    'unauthorized access',
    'data security',
    'forensic',
  ],
  'Employee Monitoring': [
    'employee',
    'monitoring',
    'workplace',
    'keystroke',
    'surveillance',
    'performance tracking',
    'wellness tracking',
    'hr data',
  ],
  'Data Sharing & Transfers': [
    'sharing',
    'transfer',
    'third-party',
    'processor',
    'controller',
    'data processing agreement',
    'dpa',
    'joint controller',
  ],
  'Consent & Cookies': [
    'cookie',
    'consent',
    'tracking',
    'analytics',
    'marketing pixel',
    'google analytics',
    'facebook pixel',
    'consent banner',
    'opt-out',
  ],
  'Cross-Border Data Transfers': [
    'sccs',
    'standard contractual clauses',
    'transfer impact assessment',
    'tia',
    'adequacy decision',
    'privacy shield',
    'data privacy framework',
    'cloud act',
    'fisa',
    'third country',
    'safeguards',
  ],
  'Automated Decision-Making': [
    'automated decision',
    'profiling',
    'article 22',
    'human intervention',
    'right to explanation',
    'algorithmic',
    'scoring',
    'credit decision',
  ],
  'Vendor Due Diligence': [
    'vendor',
    'due diligence',
    'soc 2',
    'iso 27001',
    'security assessment',
    'audit rights',
    'subprocessor',
    'certification',
  ],
  'Records of Processing (Article 30)': [
    'ropa',
    'records of processing',
    'article 30',
    'data mapping',
    'processing activities',
    'retention periods',
    'data inventory',
  ],
};

// Topic categorization function
export const categorizePrivacyTopics = (privacyChats: SyntheticChat[]): PrivacyTopics => {
  const categories: PrivacyTopics = {
    'GDPR & International Compliance': 0,
    'AI & Privacy': 0,
    'Data Breaches & Incident Response': 0,
    'Employee Monitoring': 0,
    'Data Sharing & Transfers': 0,
    'Consent & Cookies': 0,
    'Cross-Border Data Transfers': 0,
    'Automated Decision-Making': 0,
    'Vendor Due Diligence': 0,
    'Records of Processing (Article 30)': 0,
  };

  const categorizeChat = (chat: SyntheticChat): void => {
    const title = chat.title.toLowerCase();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((keyword) => title.includes(keyword))) {
        categories[category as keyof PrivacyTopics]++;
      }
    }
  };

  privacyChats.forEach(categorizeChat);
  return categories;
};

// Keyword definitions for commercial topic categorization
const commercialCategoryKeywords: Record<keyof CommercialTopics, string[]> = {
  'Contract Risk & Liability': [
    'liability',
    'cap',
    'limitation',
    'damages',
    'consequential',
    'incidental',
    'indirect damages',
    'liability cap',
    'exposure',
    'risk allocation',
  ],
  'Vendor Relationship Management': [
    'vendor',
    'supplier',
    'msa',
    'master service agreement',
    'relationship',
    'governance',
    'performance management',
    'vendor management',
  ],
  'Intellectual Property & Licensing': [
    'ip',
    'intellectual property',
    'licensing',
    'copyright',
    'trademark',
    'work for hire',
    'ownership',
    'derivative works',
    'trade secrets',
  ],
  'Service Performance & SLAs': [
    'sla',
    'service level',
    'performance',
    'uptime',
    'availability',
    'response time',
    'service credits',
    'performance metrics',
    'kpi',
  ],
  'Payment & Financial Terms': [
    'payment',
    'invoice',
    'financial',
    'pricing',
    'fees',
    'cost',
    'billing',
    'revenue share',
    'royalty',
    'milestone payments',
  ],
  'Software Escrow & Data Portability': [
    'escrow',
    'source code',
    'data portability',
    'backup',
    'business continuity',
    'data export',
    'transition',
    'knowledge transfer',
  ],
  'Termination & Exit Rights': [
    'termination',
    'exit',
    'wind down',
    'notice period',
    'termination fee',
    'end of term',
    'expiration',
    'renewal',
    'cancellation',
  ],
  'Security & Compliance Requirements': [
    'security',
    'compliance',
    'encryption',
    'access control',
    'audit',
    'penetration testing',
    'vulnerability',
    'cyber insurance',
    'incident response',
  ],
  'Indemnification & Insurance': [
    'indemnification',
    'indemnify',
    'hold harmless',
    'insurance',
    'coverage',
    'defend',
    'third party claims',
    'cyber liability',
    'errors and omissions',
  ],
  'Force Majeure & Business Continuity': [
    'force majeure',
    'acts of god',
    'pandemic',
    'government action',
    'business continuity',
    'disaster recovery',
    'supply chain disruption',
  ],
};

// Topic categorization function
export const categorizeCommercialTopics = (commercialChats: SyntheticChat[]): CommercialTopics => {
  const categories: CommercialTopics = {
    'Contract Risk & Liability': 0,
    'Vendor Relationship Management': 0,
    'Intellectual Property & Licensing': 0,
    'Service Performance & SLAs': 0,
    'Payment & Financial Terms': 0,
    'Software Escrow & Data Portability': 0,
    'Termination & Exit Rights': 0,
    'Security & Compliance Requirements': 0,
    'Indemnification & Insurance': 0,
    'Force Majeure & Business Continuity': 0,
  };

  const categorizeChat = (chat: SyntheticChat): void => {
    const title = chat.title.toLowerCase();

    for (const [category, keywords] of Object.entries(commercialCategoryKeywords)) {
      if (keywords.some((keyword) => title.includes(keyword))) {
        categories[category as keyof CommercialTopics]++;
      }
    }
  };

  commercialChats.forEach(categorizeChat);
  return categories;
};
