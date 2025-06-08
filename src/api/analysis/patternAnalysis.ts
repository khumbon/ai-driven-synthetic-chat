import { UserQuestion } from '../types';

const QUESTION_PATTERNS = [
  { key: 'How do I handle/structure...', triggers: ['how do i', 'how should i', 'how to', 'how can i'] },
  { key: 'What should I include/negotiate...', triggers: ['what should', 'what specific', 'what key'] },
  { key: 'What are the requirements for...', triggers: ['what are', 'requirements', 'obligations', 'what must'] },
  { key: 'How should I modify/draft...', triggers: ['draft', 'modify', 'structure', 'revise', 'update'] },
  { key: 'What happens if...', triggers: ['what happens', 'what if', 'what about'] },
  { key: 'Can I/we...', triggers: ['can we', 'can i', 'are we able', 'is it possible'] },
  { key: "What's reasonable/fair...", triggers: ['reasonable', 'fair', 'appropriate', 'standard', 'typical'] },
  { key: 'Do I need to...', triggers: ['do we need', 'do i need', 'should we', 'must we'] },
  { key: 'Please draft/help with...', triggers: ['please draft', 'draft the', 'help with drafting', 'help me draft'] },
  { key: 'How do I assess/evaluate...', triggers: ['assess', 'evaluate', 'analyze', 'review'] },
  { key: 'What documentation should...', triggers: ['documentation', 'document', 'record', 'maintain'] },
  { key: 'What are the penalties/risks...', triggers: ['penalties', 'fines', 'risks', 'liability', 'exposure'] },
  { key: 'Can you walk me through...', triggers: ['walk me through', 'explain the process', 'step by step'] },
  { key: 'How do I balance/compromise...', triggers: ['balance', 'compromise', 'middle ground', 'alternative'] },
  { key: 'What specific language should...', triggers: ['specific language', 'contract language', 'clause language'] },
];

const COMMON_TERMS = [
  // Privacy terms
  'gdpr',
  'ccpa',
  'cpra',
  'compliance',
  'data protection',
  'personal data',
  'processing',
  'controller',
  'processor',
  'consent',
  'legitimate interest',
  'breach',
  'notification',
  'dpo',
  'supervisory authority',
  'article 30',
  'cross-border',
  'transfer',
  'sccs',
  'adequacy decision',
  'cookies',
  'tracking',
  'profiling',
  'automated decision',
  'ai',
  'machine learning',
  'employee monitoring',
  'vendor due diligence',
  'audit rights',

  // Commercial terms
  'liability',
  'indemnification',
  'contract',
  'agreement',
  'vendor',
  'sla',
  'service level',
  'termination',
  'payment',
  'pricing',
  'intellectual property',
  'licensing',
  'escrow',
  'force majeure',
  'security',
  'encryption',
  'performance',
  'uptime',
  'damages',
  'limitation',
  'warranty',
  'insurance',
  'cyber liability',
  'source code',
  'data portability',
  'business continuity',

  // Legal/procedural terms
  'negotiation',
  'clause',
  'provision',
  'safeguards',
  'rights',
  'obligations',
  'requirements',
  'implementation',
  'documentation',
  'assessment',
  'review',
  'audit',
  'monitoring',
  'compliance',
  'penalties',
  'enforcement',
  'remedies',
  'mitigation',
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
