import { SyntheticChat, TimeAnalysis, TimeSavingsReport } from '../types';

// Define task types and their typical completion times for lawyers (in minutes)
export const LAWYER_TASK_DURATIONS = {
  'Contract Drafting': 120, // 2 hours for basic contract clauses
  'Legal Research': 90, // 1.5 hours for complex legal research
  'Policy Review': 60, // 1 hour for policy analysis
  'Compliance Analysis': 75, // 1.25 hours for compliance assessment
  'Risk Assessment': 45, // 45 minutes for risk evaluation
  'Legal Opinion': 90, // 1.5 hours for legal advice
  'Document Review': 30, // 30 minutes for document analysis
  'Negotiation Strategy': 60, // 1 hour for strategy development
  'Quick Answer': 15, // 15 minutes for simple questions
  'Template Creation': 90, // 1.5 hours for template development
} as const;

// Patterns to identify different types of legal tasks
const TASK_PATTERNS = [
  {
    type: 'Contract Drafting' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['draft', 'create agreement', 'write contract', 'prepare clause', 'template'],
    keywords: ['contract', 'agreement', 'clause', 'provision', 'terms'],
  },
  {
    type: 'Legal Research' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['research', 'find law', 'legal precedent', 'case law', 'statute'],
    keywords: ['requirements', 'law', 'regulation', 'compliance', 'jurisdiction'],
  },
  {
    type: 'Policy Review' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['review policy', 'analyze policy', 'policy compliance', 'gdpr compliance'],
    keywords: ['policy', 'gdpr', 'ccpa', 'privacy', 'data protection'],
  },
  {
    type: 'Compliance Analysis' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['compliance', 'regulatory', 'meet requirements', 'legal obligations'],
    keywords: ['compliance', 'regulatory', 'requirements', 'obligations', 'standards'],
  },
  {
    type: 'Risk Assessment' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['risk', 'liability', 'exposure', 'what happens if'],
    keywords: ['risk', 'liability', 'damages', 'exposure', 'consequences'],
  },
  {
    type: 'Legal Opinion' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['should i', 'can we', 'is it legal', 'advice', 'recommend'],
    keywords: ['advice', 'opinion', 'recommend', 'suggest', 'approach'],
  },
  {
    type: 'Document Review' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['review', 'analyze document', 'check contract', 'examine'],
    keywords: ['review', 'analyze', 'examine', 'assessment', 'evaluation'],
  },
  {
    type: 'Negotiation Strategy' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['negotiate', 'strategy', 'how to approach', 'counter'],
    keywords: ['negotiate', 'strategy', 'approach', 'counter', 'terms'],
  },
  {
    type: 'Template Creation' as keyof typeof LAWYER_TASK_DURATIONS,
    triggers: ['template', 'standard form', 'boilerplate', 'framework'],
    keywords: ['template', 'framework', 'standard', 'boilerplate', 'structure'],
  },
];

interface TaskIdentification {
  taskType: keyof typeof LAWYER_TASK_DURATIONS;
  confidence: number; // 0-1 scale
}

// Function to calculate time difference between timestamps
const calculateResponseTime = (userTimestamp: string, assistantTimestamp: string): number => {
  const userTime = new Date(userTimestamp);
  const assistantTime = new Date(assistantTimestamp);
  const diffMs = assistantTime.getTime() - userTime.getTime();
  return Math.max(diffMs / (1000 * 60), 0.1); // Convert to minutes, minimum 0.1 minutes
};

// Function to identify task type from question content
const identifyTaskType = (question: string): TaskIdentification => {
  const lowerQuestion = question.toLowerCase();
  let bestMatch: TaskIdentification = {
    taskType: 'Quick Answer',
    confidence: 0.3,
  };

  for (const pattern of TASK_PATTERNS) {
    let score = 0;

    // Check trigger phrases (higher weight)
    const triggerMatches = pattern.triggers.filter((trigger) => lowerQuestion.includes(trigger.toLowerCase())).length;
    score += triggerMatches * 0.4;

    // Check keywords (lower weight)
    const keywordMatches = pattern.keywords.filter((keyword) => lowerQuestion.includes(keyword.toLowerCase())).length;
    score += keywordMatches * 0.2;

    // Length-based complexity adjustment
    if (question.length > 200) score += 0.1;
    if (question.length > 500) score += 0.1;

    if (score > bestMatch.confidence) {
      bestMatch = {
        taskType: pattern.type,
        confidence: Math.min(score, 1.0),
      };
    }
  }

  return bestMatch;
};

// Function to analyze time savings from chat data
export const calculateTimeSavings = (chats: SyntheticChat[]): TimeSavingsReport => {
  const analyses: TimeAnalysis[] = [];
  const taskBreakdown: Record<
    keyof typeof LAWYER_TASK_DURATIONS,
    {
      count: number;
      totalTimeSaved: number;
      avgResponseTime: number;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  > = {} as any;

  // Initialize task breakdown
  Object.keys(LAWYER_TASK_DURATIONS).forEach((taskType) => {
    taskBreakdown[taskType as keyof typeof LAWYER_TASK_DURATIONS] = {
      count: 0,
      totalTimeSaved: 0,
      avgResponseTime: 0,
    };
  });

  chats.forEach((chat) => {
    const messages = chat.messages;

    for (let i = 0; i < messages.length - 1; i += 2) {
      const userMessage = messages[i];
      const assistantMessage = messages[i + 1];

      if (userMessage?.role === 'user' && assistantMessage?.role === 'assistant') {
        const taskId = identifyTaskType(userMessage.content);
        const responseTime = calculateResponseTime(userMessage.timestamp, assistantMessage.timestamp);
        const lawyerTime = LAWYER_TASK_DURATIONS[taskId.taskType];
        const timeSaved = lawyerTime - responseTime;
        const percentageSaved = (timeSaved / lawyerTime) * 100;

        const analysis: TimeAnalysis = {
          question: userMessage.content.substring(0, 100) + (userMessage.content.length > 100 ? '...' : ''),
          taskType: taskId.taskType,
          confidence: taskId.confidence,
          assistantResponseTime: responseTime,
          typicalLawyerTime: lawyerTime,
          timeSaved: timeSaved,
          percentageSaved: percentageSaved,
        };

        analyses.push(analysis);

        // Update task breakdown
        const breakdown = taskBreakdown[taskId.taskType];
        breakdown.count++;
        breakdown.totalTimeSaved += timeSaved;
        breakdown.avgResponseTime =
          (breakdown.avgResponseTime * (breakdown.count - 1) + responseTime) / breakdown.count;
      }
    }
  });

  // Calculate totals
  const totalTimeSaved = analyses.reduce((sum, analysis) => sum + analysis.timeSaved, 0);
  const totalTimeSavedHours = totalTimeSaved / 60;
  const averageResponseTime =
    analyses.reduce((sum, analysis) => sum + analysis.assistantResponseTime, 0) / analyses.length;
  const averageLawyerTime = analyses.reduce((sum, analysis) => sum + analysis.typicalLawyerTime, 0) / analyses.length;

  return {
    totalQuestions: analyses.length,
    totalTimeSaved,
    totalTimeSavedHours,
    averageResponseTime,
    averageLawyerTime,
    taskBreakdown,
    analyses,
  };
};
