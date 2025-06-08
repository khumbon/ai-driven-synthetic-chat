import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  LinearProgress,
  Container,
  Stack,
  ThemeProvider,
  CssBaseline,
  Backdrop,
} from '@mui/material';
import {
  Download,
  Mail,
  TrendingUp,
  Schedule,
  QuestionAnswer,
  Description,
  CheckCircle,
  Timer,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Lottie from 'lottie-react';
import { EmailInput } from '@/components/EmailInput';
import { LegalInsightsEmail } from '@/components';
import { useGenerateChats, useGenerateReport } from '@/data/hooks';
import { theme } from '@/styles/theme';
import robotTypingAnimation from '@/assets/robotTypingAnimation.json';

// Colors for the task breakdown chart
const CHART_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#EC4899',
  '#6366F1',
];

// Main Home Component
const Home = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [emailsSent, setEmailsSent] = useState(false);

  const { mutate: mutateGenerateChats } = useGenerateChats();
  const {
    mutate: mutateGenerateReport,
    data: reportData,
    isPending: isReportPending,
    isError: isReportError,
    error: reportError,
  } = useGenerateReport();

  if (reportError) {
    console.log('reportError', reportError);
  }

  const handleGenerateChats = () => {
    mutateGenerateChats();
  };

  const handleGenerateEmail = async () => {
    mutateGenerateReport();
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    setEmailsSent(false);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSending(false);
    setEmailsSent(true);
    setTimeout(() => setEmailsSent(false), 5000);
  };

  const handleDownloadEmail = () => {
    const emailContent = document.getElementById('email-preview')?.innerHTML;
    const blob = new Blob(
      [
        `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Legal Insights Report</title>
      </head>
      <body>
        ${emailContent}
      </body>
      </html>
    `,
      ],
      { type: 'text/html' },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-insights-report.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare task breakdown data for pie chart
  const getTaskBreakdownData = () => {
    if (!reportData?.timeSaved.taskBreakdown) return [];

    return Object.entries(reportData.timeSaved.taskBreakdown)
      .filter(([, data]) => data.count > 0)
      .map(([taskType, data]) => ({
        name: taskType,
        value: data.count,
        timeSaved: (data.totalTimeSaved / 60).toFixed(1), // Convert to hours
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 task types
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--darkBackground)' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 6 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }} color="var(--darkText)">
              Legal AI Insights Dashboard
            </Typography>
            <Typography variant="h6" color="var(--darkText)">
              Generate comprehensive reports from synthetic legal chat analysis
            </Typography>
          </Box>

          {/* Stats Cards */}
          {reportData && (
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Total Conversations
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {reportData.summary.totalConversations}
                        </Typography>
                      </Box>
                      <QuestionAnswer color="primary" sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Legal Questions
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="secondary">
                          {reportData.summary.totalUserQuestions}
                        </Typography>
                      </Box>
                      <Description color="secondary" sx={{ fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Time Saved
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#9333ea' }}>
                          {reportData.timeSaved?.totalTimeSavedHours
                            ? `${reportData.timeSaved.totalTimeSavedHours.toFixed(1)}h`
                            : reportData.timeSaved.totalTimeSaved
                              ? `${reportData.timeSaved.totalTimeSaved.toFixed(1)}h`
                              : '--'}
                        </Typography>
                      </Box>
                      <Schedule sx={{ color: '#9333ea', fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Cost Savings
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#ea580c' }}>
                          {reportData.costSaved ?? '--'}
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ color: '#ea580c', fontSize: 40 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={3}>
            {/* Email Preview Section */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Email Report Preview
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateChats}
                      disabled={isReportPending}
                      startIcon={isReportPending ? <CircularProgress size={20} /> : <Mail />}
                    >
                      {isReportPending ? 'Generating chats...' : 'Generate Chats'}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleGenerateEmail}
                      disabled={isReportPending}
                      startIcon={isReportPending ? <CircularProgress size={20} /> : <Mail />}
                    >
                      {isReportPending ? 'Generating email...' : 'Generate Email'}
                    </Button>

                    {reportData && (
                      <Button variant="outlined" onClick={handleDownloadEmail} startIcon={<Download />}>
                        Download HTML
                      </Button>
                    )}
                  </Stack>
                </Box>

                {/* Loading State */}
                {isReportPending && (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                    <CircularProgress sx={{ mr: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Generating email report...
                    </Typography>
                  </Box>
                )}

                {/* Email Preview */}
                {!isReportPending && reportData && !isReportError && (
                  <Box id="email-preview">
                    <LegalInsightsEmail data={reportData} />
                  </Box>
                )}

                {reportData && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      Email report generated successfully! You can now download it or send it to recipients.
                    </Box>
                  </Alert>
                )}
                {isReportError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      Error generating email report. Try again.
                    </Box>
                  </Alert>
                )}
              </Paper>
            </Grid>

            {/* Email Sending Section */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Send Email Report
                </Typography>

                {!reportData && !isReportError && !isReportPending ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Mail sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Generate the email report first to enable sending
                    </Typography>
                  </Box>
                ) : (
                  <EmailInput
                    emails={emails}
                    setEmails={setEmails}
                    onSendEmails={handleSendEmails}
                    isSending={isSending}
                  />
                )}

                {/* Success Message */}
                {emailsSent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      <Typography variant="body2" fontWeight="medium">
                        Emails sent successfully to {emails.length} recipient{emails.length !== 1 ? 's' : ''}!
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Enhanced Charts Section */}
          {reportData && (
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Question Pattern Distribution
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.patterns.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="pattern"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={10}
                          stroke="var(--text)"
                        />
                        <YAxis stroke="var(--text)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: 'var(--text)',
                          }}
                        />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                    Top Legal Terms
                  </Typography>
                  <Stack spacing={2}>
                    {reportData.mostCommonTerms.slice(0, 6).map(([term, count]) => (
                      <Box key={term} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {term}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(Number(count) / Number(reportData.mostCommonTerms[0][1])) * 100}
                            sx={{
                              width: 100,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e5e7eb',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: '#3B82F6',
                              },
                            }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
                            {count}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Grid>

              {/* Time Savings Analysis */}
              {reportData.timeSaved && (
                <>
                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Task Type Distribution
                      </Typography>
                      <Box sx={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getTaskBreakdownData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              fontSize={10}
                            >
                              {getTaskBreakdownData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name, props) => [
                                `${value} questions`,
                                `${props.payload.timeSaved}h saved`,
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Time Efficiency Metrics
                      </Typography>
                      <Stack spacing={3}>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Average AI Response Time
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {reportData.timeSaved.averageResponseTime.toFixed(1)} min
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={10} // Low percentage since AI is fast
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e5e7eb',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: '#10B981',
                              },
                            }}
                          />
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Typical Lawyer Time
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {reportData.timeSaved.averageLawyerTime.toFixed(1)} min
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#e5e7eb',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: '#EF4444',
                              },
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            p: 2,
                            bgcolor: 'primary.light',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Timer sx={{ color: 'primary.main' }} />
                          <Box>
                            <Typography variant="body2" fontWeight="bold" color="primary.main">
                              Efficiency Gain
                            </Typography>
                            <Typography variant="caption" color="primary.dark">
                              {(
                                (1 -
                                  reportData.timeSaved.averageResponseTime / reportData.timeSaved.averageLawyerTime) *
                                100
                              ).toFixed(1)}
                              % faster than traditional legal research
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </Container>

        {/* Lottie Animation Overlay */}
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          open={isReportPending}
        >
          <Box sx={{ width: 300, height: 300 }}>
            <Lottie
              animationData={robotTypingAnimation}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'medium' }}>
            Generating Legal Insights Report...
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Please wait while our AI analyzes the legal conversations
          </Typography>
        </Backdrop>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
