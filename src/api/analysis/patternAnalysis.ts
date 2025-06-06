import { UserQuestion } from '../types';

const QUESTION_PATTERNS = [
  { key: 'How do I handle/structure...', triggers: ['how do i', 'how should i', 'how to'] },
  { key: 'What should I include/negotiate...', triggers: ['what should', 'what specific'] },
  { key: 'What are the requirements for...', triggers: ['what are', 'requirements'] },
  { key: 'How should I modify/draft...', triggers: ['draft', 'modify', 'structure'] },
  { key: 'What happens if...', triggers: ['what happens', 'what if'] },
  { key: 'Can I/we...', triggers: ['can we', 'can i', 'are we able'] },
  { key: "What's reasonable/fair...", triggers: ['reasonable', 'fair', 'appropriate'] },
  { key: 'Do I need to...', triggers: ['do we need', 'do i need', 'should we'] },
  { key: 'Please draft...', triggers: ['please draft', 'draft the', 'help with drafting'] },
];

const COMMON_TERMS = [
  'gdpr',
  'ccpa',
  'compliance',
  'liability',
  'indemnification',
  'contract',
  'agreement',
  'data',
  'privacy',
  'breach',
  'consent',
  'ai',
  'artificial intelligence',
  'force majeure',
  'termination',
  'warranty',
  'sla',
  'payment',
  'vendor',
  'licensing',
  'intellectual property',
  'monitoring',
  'cookies',
  'transfer',
  'security',
  'negotiation',
  'clause',
  'damages',
  'processing',
  'personal data',
  'international',
  'healthcare',
  'employee',
  'third party',
  'notification',
  'rights',
  'assignment',
  'limitation',
  'remedies',
];

export const analyseQuestionPatterns = (questionChats: UserQuestion[]) => {
  const patternCounts = new Map<string, number>();
  const termCounts = new Map<string, number>();

  QUESTION_PATTERNS.forEach((pattern) => patternCounts.set(pattern.key, 0));

  questionChats.forEach((questionChat) => {
    QUESTION_PATTERNS.forEach((pattern) => {
      if (pattern.triggers.some((trigger) => questionChat.question.includes(trigger))) {
        patternCounts.set(pattern.key, (patternCounts.get(pattern.key) || 0) + 1);
      }
    });

    COMMON_TERMS.forEach((term) => {
      if (questionChat.question.includes(term)) {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
      }
    });
  });

  const patterns = Array.from(patternCounts.entries())
    .filter(([, count]) => count > 0)
    .map(([pattern, count]) => ({ pattern, count }))
    .sort((a, b) => b.count - a.count);

  const mostCommonTerms = Array.from(termCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return {
    patterns,
    mostCommonTerms,
    totalQuestions: questionChats.length,
  };
};
