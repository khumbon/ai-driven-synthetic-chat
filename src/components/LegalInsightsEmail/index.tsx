import React, { useMemo } from 'react';
import { Body, Container, Section, Row, Column, Heading, Text, Hr } from '@react-email/components';
import { ReportData, TimeSavingsReport } from '@/api/types';

interface LegalInsightsEmailProps {
  reportData: ReportData;
}

// Safe task breakdown processing
const getTaskBreakdownData = ({ timeSaved }: { timeSaved: TimeSavingsReport }) => {
  try {
    const taskBreakdown = timeSaved.taskBreakdown;
    if (!taskBreakdown || typeof taskBreakdown !== 'object') {
      console.log('No valid taskBreakdown data');
      return [];
    }

    const entries = Object.entries(taskBreakdown);
    console.log('TaskBreakdown entries:', entries);

    const filtered = entries.filter(([taskType, taskData]) => {
      const isValid =
        taskData && typeof taskData === 'object' && typeof taskData.count === 'number' && taskData.count > 0;
      console.log(`Task ${taskType} valid:`, isValid, taskData);
      return isValid;
    });

    const mapped = filtered.map(([taskType, taskData]) => ({
      name: taskType,
      count: taskData.count,
      timeSaved: ((taskData.totalTimeSaved || 0) / 60).toFixed(1),
      avgResponseTime: (taskData.avgResponseTime || 0).toFixed(1),
    }));

    const sorted = mapped.sort((a, b) => b.count - a.count);
    const result = sorted.slice(0, 5);

    console.log('Final task breakdown result:', result);
    return result;
  } catch (error) {
    console.error('Error in getTaskBreakdownData:', error);
    return [];
  }
};

// Safe privacy topics processing
const getTopPrivacyTopics = ({
  privacyTopics,
}: {
  privacyTopics: ReportData['privacyTopics'];
}): {
  topic: string;
  count: number;
}[] => {
  try {
    if (!privacyTopics) return [];

    return Object.entries(privacyTopics)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  } catch (error) {
    console.error('Error in getTopPrivacyTopics:', error);
    return [];
  }
};

// Safe commercial topics processing
const getTopCommercialTopics = ({
  commercialContractTopics,
}: {
  commercialContractTopics: ReportData['commercialContractTopics'];
}) => {
  try {
    if (!commercialContractTopics) return [];

    return Object.entries(commercialContractTopics)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
  } catch (error) {
    console.error('Error in getTopCommercialTopics:', error);
    return [];
  }
};

// Safe progress bar creation
const createProgressBar = (percentage: number, width: number = 200) => {
  const safePercentage = Math.max(0, Math.min(100, isNaN(percentage) ? 0 : percentage));
  return {
    background: `linear-gradient(to right, #10b981 0%, #10b981 ${safePercentage}%, #e5e7eb ${safePercentage}%, #e5e7eb 100%)`,
    width: `${width}px`,
    height: '8px',
    borderRadius: '4px',
  };
};

export const LegalInsightsEmail = ({ reportData }: LegalInsightsEmailProps) => {
  // Safe data extraction with defaults
  const summary = reportData.summary || {};
  const totalConversations = summary.totalConversations || 0;
  const totalUserQuestions = summary.totalUserQuestions || 0;

  const timeSaved = reportData.timeSaved || {};
  const averageResponseTime = timeSaved.averageResponseTime || 0;
  const averageLawyerTime = timeSaved.averageLawyerTime || 0;
  const totalTimeSavedHours = timeSaved.totalTimeSavedHours || 0;

  // Calculate efficiency gain safely
  const efficiencyGain = averageLawyerTime > 0 ? (1 - averageResponseTime / averageLawyerTime) * 100 : 0;

  console.log('Calculated efficiencyGain:', efficiencyGain);

  // Get calculated data
  const taskBreakdownData = getTaskBreakdownData({ timeSaved });
  const topPrivacyTopics = useMemo(
    () => getTopPrivacyTopics({ privacyTopics: reportData?.privacyTopics }),
    [reportData?.privacyTopics],
  );
  const topCommercialTopics = useMemo(
    () =>
      getTopCommercialTopics({
        commercialContractTopics: reportData?.commercialContractTopics,
      }),
    [reportData?.commercialContractTopics],
  );
  const patterns = reportData.patterns || [];
  const mostCommonTerms = reportData.mostCommonTerms || [];

  console.log('All processed data:', {
    taskBreakdownData,
    topPrivacyTopics,
    topCommercialTopics,
    patterns: patterns.length,
    mostCommonTerms: mostCommonTerms.length,
  });

  return (
    <>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Legal AI Insights Report</Heading>
            <Text style={subtitle}>Comprehensive analysis of AI-powered legal assistance</Text>
            <Text style={periodText}>Analysis Period: {new Date().toLocaleDateString()}</Text>
          </Section>

          {/* Executive Summary */}
          <Section style={section}>
            <Heading style={h2}>📋 Executive Summary</Heading>
            <div style={summaryCard}>
              <Text style={summaryText}>
                This report analyzes <strong>{totalConversations} legal conversations</strong> containing{' '}
                <strong>{totalUserQuestions} questions</strong>. Our AI assistant has delivered significant efficiency
                gains, saving an average of <strong>{efficiencyGain.toFixed(1)}%</strong> of the time typically required
                for legal research and analysis.
              </Text>
            </div>
          </Section>

          {/* Key Metrics Section */}
          <Section style={section}>
            <Heading style={h2}>📊 Key Performance Metrics</Heading>
            <Row>
              <Column style={metricColumn}>
                <div style={metricCard}>
                  <Text style={metricNumber}>{totalConversations}</Text>
                  <Text style={metricLabel}>Total Conversations</Text>
                </div>
              </Column>
              <Column style={metricColumn}>
                <div style={metricCard}>
                  <Text style={metricNumber}>{totalUserQuestions}</Text>
                  <Text style={metricLabel}>Legal Questions</Text>
                </div>
              </Column>
            </Row>
            <Row>
              <Column style={metricColumn}>
                <div style={metricCard}>
                  <Text style={metricNumber}>
                    {totalTimeSavedHours > 0 ? `${totalTimeSavedHours.toFixed(1)}h` : '--'}
                  </Text>
                  <Text style={metricLabel}>Total Time Saved</Text>
                </div>
              </Column>
              <Column style={metricColumn}>
                <div style={metricCard}>
                  <Text style={metricNumber}>{reportData.costSaved || '--'}</Text>
                  <Text style={metricLabel}>Total Cost Savings</Text>
                </div>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          {/* Efficiency Analysis */}
          {averageLawyerTime > 0 && (
            <>
              <Section style={section}>
                <Heading style={h2}>⚡ Efficiency Analysis</Heading>
                <div style={efficiencyCard}>
                  <Text style={efficiencyTitle}>AI vs Traditional Legal Research</Text>
                  <Row>
                    <Column>
                      <Text style={timeMetric}>
                        <strong>AI Response Time:</strong> {averageResponseTime.toFixed(1)} min
                      </Text>
                    </Column>
                    <Column>
                      <Text style={timeMetric}>
                        <strong>Typical Lawyer Time:</strong> {averageLawyerTime.toFixed(1)} min
                      </Text>
                    </Column>
                  </Row>

                  <div style={{ marginTop: '16px' }}>
                    <Text style={progressLabel}>Efficiency Improvement</Text>
                    <div style={createProgressBar(efficiencyGain)}></div>
                    <Text style={progressText}>{efficiencyGain.toFixed(1)}% faster than traditional methods</Text>
                  </div>

                  <div style={efficiencyHighlight}>
                    <Text style={efficiencyText}>
                      🚀 <strong>{efficiencyGain.toFixed(1)}% faster</strong> than traditional legal research
                    </Text>
                  </div>
                </div>
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* Task Breakdown */}
          {taskBreakdownData.length > 0 && (
            <>
              <Section style={section}>
                <Heading style={h2}>📋 Task Type Analysis</Heading>
                {taskBreakdownData.map((task, index) => (
                  <div key={index} style={enhancedTaskItem}>
                    <Row>
                      <Column style={{ width: '45%' }}>
                        <Text style={taskName}>{task.name}</Text>
                      </Column>
                      <Column style={{ width: '20%' }}>
                        <Text style={taskCount}>{task.count} tasks</Text>
                      </Column>
                      <Column style={{ width: '20%' }}>
                        <Text style={taskTime}>{task.timeSaved}h saved</Text>
                      </Column>
                      <Column style={{ width: '15%' }}>
                        <Text style={avgTime}>{task.avgResponseTime}m avg</Text>
                      </Column>
                    </Row>
                    <div style={createProgressBar((task.count / (timeSaved.totalQuestions || 1)) * 100, 200)}></div>
                  </div>
                ))}
              </Section>
              <Hr style={hr} />
            </>
          )}

          {/* Privacy Topics */}
          {topPrivacyTopics.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>📝 Privacy Law Topics</Heading>
              <div style={topicSection}>
                <Text style={topicSectionTitle}>🔒 Most Discussed Areas</Text>
                {topPrivacyTopics.map((item, index) => {
                  const maxCount = Math.max(...topPrivacyTopics.map((t) => t.count)) || 1;
                  return (
                    <div key={index} style={topicItem}>
                      <Row>
                        <Column style={{ width: '70%' }}>
                          <Text style={topicName}>{item.topic}</Text>
                        </Column>
                        <Column style={{ width: '30%' }}>
                          <Text style={topicCount}>{item.count} discussions</Text>
                        </Column>
                      </Row>
                      <div style={createProgressBar((item.count / maxCount) * 100, 150)}></div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Commercial Topics */}
          {topCommercialTopics.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>📄 Commercial Contract Topics</Heading>
              <div style={topicSection}>
                <Text style={topicSectionTitle}>📄 Most Discussed Areas</Text>
                {topCommercialTopics.map((item, index) => {
                  const maxCount = Math.max(...topCommercialTopics.map((t) => t.count)) || 1;
                  return (
                    <div key={index} style={topicItem}>
                      <Row>
                        <Column style={{ width: '70%' }}>
                          <Text style={topicName}>{item.topic}</Text>
                        </Column>
                        <Column style={{ width: '30%' }}>
                          <Text style={topicCount}>{item.count} discussions</Text>
                        </Column>
                      </Row>
                      <div style={createProgressBar((item.count / maxCount) * 100, 150)}></div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Question Patterns */}
          {patterns.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>🔍 Most Common Question Patterns</Heading>
                {patterns.slice(0, 5).map((pattern, index) => {
                  const maxCount = Math.max(...patterns.map((p) => p.count)) || 1;
                  return (
                    <div key={index} style={enhancedPatternItem}>
                      <Row>
                        <Column style={{ width: '75%' }}>
                          <Text style={patternText}>
                            <strong>{pattern.pattern}</strong>
                          </Text>
                        </Column>
                        <Column style={{ width: '25%' }}>
                          <Text style={patternCount}>{pattern.count} questions</Text>
                        </Column>
                      </Row>
                      <div style={createProgressBar((pattern.count / maxCount) * 100, 180)}></div>
                    </div>
                  );
                })}
              </Section>
            </>
          )}

          {/* Common Terms */}
          {mostCommonTerms.length > 0 && (
            <>
              <Hr style={hr} />
              <Section style={section}>
                <Heading style={h2}>⚖️ Most Frequently Used Legal Terms</Heading>
                <Row>
                  {mostCommonTerms.slice(0, 6).map(([term, count], index) => {
                    const maxCount = Math.max(...mostCommonTerms.map(([, c]) => c)) || 1;
                    return (
                      <Column key={index} style={termColumn}>
                        <div style={enhancedTermCard}>
                          <Text style={termText}>{term}</Text>
                          <Text style={termCount}>{count}</Text>
                          <div style={createProgressBar((count / maxCount) * 100, 60)}></div>
                        </div>
                      </Column>
                    );
                  })}
                </Row>
              </Section>
            </>
          )}

          {/* Recommendations */}
          <Hr style={hr} />
          <Section style={section}>
            <Heading style={h2}>💡 Key Insights & Recommendations</Heading>
            <div style={recommendationsCard}>
              <div style={recommendationItem}>
                <Text style={recommendationText}>
                  🎯 <strong>High Impact Areas:</strong> Focus on{' '}
                  {topPrivacyTopics[0]?.topic?.toLowerCase() || 'key areas'} and{' '}
                  {topCommercialTopics[0]?.topic?.toLowerCase() || 'commercial topics'} training to maximize AI
                  efficiency gains.
                </Text>
              </div>
              <div style={recommendationItem}>
                <Text style={recommendationText}>
                  ⏱️ <strong>Time Optimization:</strong> Current {efficiencyGain.toFixed(1)}% efficiency improvement
                  suggests potential for {Math.max(0, 100 - efficiencyGain).toFixed(1)}% additional optimization.
                </Text>
              </div>
              <div style={recommendationItem}>
                <Text style={recommendationText}>
                  📈 <strong>Scaling Opportunity:</strong> Expanding AI usage could yield significant benefits across
                  the organization.
                </Text>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This report was generated automatically by our Legal AI system on {new Date().toLocaleDateString()}. For
              questions, additional analysis, or detailed breakdowns, please contact your legal technology team.
            </Text>
          </Section>
        </Container>
      </Body>
    </>
  );
};

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

const header = {
  textAlign: 'center' as const,
  padding: '24px 20px',
  background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
  color: '#ffffff',
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  color: '#ffffff',
};

const h2 = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  color: '#1e40af',
};

const subtitle = {
  fontSize: '16px',
  margin: '0 0 8px 0',
  color: '#e0e7ff',
};

const periodText = {
  fontSize: '14px',
  margin: '0',
  color: '#c7d2fe',
  fontStyle: 'italic',
};

const section = {
  padding: '24px 20px',
};

const summaryCard = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  borderLeft: '4px solid #1e40af',
};

const summaryText = {
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  color: '#374151',
};

const metricColumn = {
  width: '50%',
  padding: '8px',
};

const metricCard = {
  backgroundColor: '#f1f5f9',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  border: '1px solid #e2e8f0',
};

const metricNumber = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
  color: '#1e40af',
};

const metricLabel = {
  fontSize: '12px',
  margin: '0',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '0',
};

const efficiencyCard = {
  backgroundColor: '#f0fdf4',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #bbf7d0',
};

const efficiencyTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  color: '#166534',
};

const timeMetric = {
  fontSize: '14px',
  margin: '4px 0',
  color: '#374151',
};

const progressLabel = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#166534',
  margin: '0 0 4px 0',
};

const progressText = {
  fontSize: '11px',
  color: '#166534',
  margin: '4px 0 0 0',
};

const efficiencyHighlight = {
  backgroundColor: '#dcfce7',
  padding: '12px',
  borderRadius: '6px',
  marginTop: '12px',
  textAlign: 'center' as const,
};

const efficiencyText = {
  fontSize: '16px',
  margin: '0',
  color: '#166534',
};

const topicSection = {
  marginBottom: '20px',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
};

const topicSectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
  color: '#1e40af',
};

const topicItem = {
  padding: '8px 0',
  borderBottom: '1px solid #f1f5f9',
};

const topicName = {
  fontSize: '13px',
  margin: '0 0 4px 0',
  color: '#374151',
  fontWeight: '500',
};

const topicCount = {
  fontSize: '12px',
  margin: '0',
  color: '#64748b',
  textAlign: 'right' as const,
  fontWeight: 'bold',
};

const enhancedPatternItem = {
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9',
};

const patternText = {
  fontSize: '14px',
  margin: '0 0 4px 0',
  color: '#374151',
};

const patternCount = {
  fontSize: '12px',
  margin: '0',
  color: '#64748b',
  fontWeight: 'bold',
  textAlign: 'right' as const,
};

const enhancedTaskItem = {
  padding: '12px 0',
  borderBottom: '1px solid #f1f5f9',
};

const taskName = {
  fontSize: '14px',
  margin: '0 0 4px 0',
  color: '#374151',
  fontWeight: '500',
};

const taskCount = {
  fontSize: '12px',
  margin: '0',
  color: '#64748b',
  textAlign: 'center' as const,
};

const taskTime = {
  fontSize: '12px',
  margin: '0',
  color: '#059669',
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const avgTime = {
  fontSize: '11px',
  margin: '0',
  color: '#6b7280',
  textAlign: 'right' as const,
};

const termColumn = {
  width: '33.33%',
  padding: '4px',
};

const enhancedTermCard = {
  backgroundColor: '#fef3c7',
  padding: '10px 8px',
  borderRadius: '6px',
  textAlign: 'center' as const,
  border: '1px solid #fbbf24',
};

const termText = {
  fontSize: '12px',
  margin: '0 0 2px 0',
  color: '#92400e',
  fontWeight: '500',
};

const termCount = {
  fontSize: '10px',
  margin: '0 0 4px 0',
  color: '#b45309',
  fontWeight: 'bold',
};

const recommendationsCard = {
  backgroundColor: '#eff6ff',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #bfdbfe',
};

const recommendationItem = {
  marginBottom: '12px',
};

const recommendationText = {
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  color: '#1e40af',
};

const footer = {
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '0 0 8px 8px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
};

const footerText = {
  fontSize: '12px',
  margin: '0',
  color: '#64748b',
  lineHeight: '16px',
};
