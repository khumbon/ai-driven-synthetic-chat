import { SyntheticChat } from '../types';

interface PrivacyTopics {
  'GDPR & International Compliance': number;
  'AI & Privacy': number;
  'Data Breaches & Incident Response': number;
  'Employee Monitoring': number;
  'Data Sharing & Transfers': number;
  'Consent & Cookies': number;
}

interface CommercialTopics {
  'Contract Risk & Liability': number;
  'Vendor Relationship Management': number;
  'Intellectual Property & Licensing': number;
  'Service Performance & SLAs': number;
  'Payment & Financial Terms': number;
}

// Keyword definitions for categorization
const categoryKeywords: Record<keyof PrivacyTopics, string[]> = {
  'GDPR & International Compliance': ['gdpr', 'compliance', 'international'],
  'AI & Privacy': ['ai', 'artificial intelligence'],
  'Data Breaches & Incident Response': ['breach', 'incident'],
  'Employee Monitoring': ['employee', 'monitoring', 'workplace'],
  'Data Sharing & Transfers': ['sharing', 'transfer', 'third-party'],
  'Consent & Cookies': ['cookie', 'consent'],
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
  'Contract Risk & Liability': ['liability', 'indemnification', 'risk', 'warranty'],
  'Vendor Relationship Management': ['vendor', 'assignment', 'force majeure', 'change of control'],
  'Intellectual Property & Licensing': ['ip', 'intellectual property', 'licensing'],
  'Service Performance & SLAs': ['sla', 'service level', 'performance'],
  'Payment & Financial Terms': ['payment', 'invoice', 'financial'],
};

// Topic categorization function
export const categorizeCommercialTopics = (commercialChats: SyntheticChat[]): CommercialTopics => {
  const categories: CommercialTopics = {
    'Contract Risk & Liability': 0,
    'Vendor Relationship Management': 0,
    'Intellectual Property & Licensing': 0,
    'Service Performance & SLAs': 0,
    'Payment & Financial Terms': 0,
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
