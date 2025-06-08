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
import { Download, Mail, TrendingUp, Schedule, QuestionAnswer, Description, CheckCircle } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Lottie from 'lottie-react';
import { EmailInput } from '@/components/EmailInput';
import { LegalInsightsEmail } from '@/components';
import { useGenerateChats, useGenerateReport } from '@/data/hooks';
import { theme } from '@/styles/theme';
import robotTypingAnimation from '@/assets/robotTypingAnimation.json';

// Mock data
/*const reportData: ReportData = {
  summary: {
    totalConversations: 18,
    totalUserQuestions: 41,
    avgMessagesPerChat: '4.3',
    avgQuestionsPerChat: '2.3',
  },
  privacyTopics: {
    'GDPR & International Compliance': 3,
    'AI & Privacy': 3,
    'Data Breaches & Incident Response': 1,
    'Employee Monitoring': 1,
    'Data Sharing & Transfers': 1,
    'Consent & Cookies': 1,
  },
  commercialContractTopics: {
    'Contract Risk & Liability': 3,
    'Vendor Relationship Management': 4,
    'Intellectual Property & Licensing': 2,
    'Service Performance & SLAs': 1,
    'Payment & Financial Terms': 1,
  },
  patterns: [
    { pattern: 'Do I need to...', count: 12 },
    { pattern: 'How should I modify/draft...', count: 10 },
    { pattern: 'Please draft...', count: 7 },
    { pattern: "What's reasonable/fair...", count: 5 },
    { pattern: 'What should I include/negotiate...', count: 3 },
    { pattern: 'What are the requirements for...', count: 3 },
    { pattern: 'Can I/we...', count: 3 },
    { pattern: 'What happens if...', count: 2 },
  ],
  mostCommonTerms: [
    ['data', 12],
    ['vendor', 11],
    ['ai', 11],
    ['consent', 7],
    ['privacy', 6],
    ['contract', 5],
    ['liability', 5],
    ['clause', 5],
    ['agreement', 4],
    ['employee', 4],
  ],
};*/

// Main Home Component
const Home: React.FC = () => {
  const [emailGenerated, setEmailGenerated] = useState(false);
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

  console.log('isReportPending');
  console.log(isReportPending);
  const handleGenerateChats = () => {
    mutateGenerateChats();
  };

  const handleGenerateEmail = async () => {
    mutateGenerateReport();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setEmailGenerated(true);
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
                          10.3h
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
                          $3,090
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

                    {emailGenerated && (
                      <Button variant="outlined" onClick={handleDownloadEmail} startIcon={<Download />}>
                        Download HTML
                      </Button>
                    )}
                  </Stack>
                </Box>

                {/* Loading State */}
                {isReportPending ||
                  (isReportPending && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                      <CircularProgress sx={{ mr: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Generating email report...
                      </Typography>
                    </Box>
                  ))}

                {/* Email Preview */}
                {(emailGenerated || !isReportPending) && reportData && (
                  <Box id="email-preview">
                    <LegalInsightsEmail data={reportData} />
                  </Box>
                )}

                {emailGenerated && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle />
                      Email report generated successfully! You can now download it or send it to recipients.
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

                {!emailGenerated ? (
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

          {/* Quick Charts */}
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
