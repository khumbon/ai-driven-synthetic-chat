import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
  Alert,
  AlertTitle,
  Divider,
  Stack,
} from '@mui/material';
import { ReportData } from '@/api/types';

export const LegalInsightsEmailPreview = ({ reportData }: { reportData: ReportData }) => {
  console.log('lah patterns');
  console.log(reportData.patterns);
  const patternData = reportData.patterns.slice(0, 5);

  const timeSavingsCalculation = {
    avgTimePerQuestion: 15,
    totalQuestions: reportData.summary.totalUserQuestions,
    totalTimeSaved: (reportData.summary.totalUserQuestions * 15) / 60,
    costSavingsPerHour: 300,
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }} color="var(--darkText)">
          Legal AI Insights Report
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }} color="var(--darkText)">
          Weekly Synthetic Chat Analysis
        </Typography>
        <Chip
          label={`📊 ${reportData.summary.totalConversations} Conversations Analyzed`}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 3 }}>
        {/* Key Metrics */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          📈 Key Performance Metrics
        </Typography>
        <Divider sx={{ mb: 3, borderColor: '#e5e7eb', borderWidth: 1 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {reportData.summary.totalUserQuestions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Legal Questions
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8fafc' }}>
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {reportData.summary.avgQuestionsPerChat}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Questions/Chat
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Time Savings */}
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            color: '#92400e',
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', color: '#92400e' }}>⏱️ Time Savings Analysis</AlertTitle>
          <Box sx={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#451a03' }}>
            <strong>Estimated Time Saved:</strong> {timeSavingsCalculation.totalTimeSaved.toFixed(1)} hours
            <br />
            <strong>Cost Savings:</strong> $
            {(timeSavingsCalculation.totalTimeSaved * timeSavingsCalculation.costSavingsPerHour).toLocaleString()}
            <br />
            <em>Based on {timeSavingsCalculation.avgTimePerQuestion} min average research time per question</em>
          </Box>
        </Alert>

        {/* Top Question Patterns */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          ❓ Most Frequent Question Types
        </Typography>

        <Stack spacing={1} sx={{ mb: 3 }}>
          {patternData.map((pattern, index) => (
            <Card
              key={index}
              sx={{
                p: 2,
                backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: index < 3 ? 'bold' : 'normal' }}>
                  {index + 1}. {pattern.pattern}
                </Typography>
                <Chip label={pattern.count} color="primary" size="small" sx={{ fontWeight: 'bold' }} />
              </Box>
            </Card>
          ))}
        </Stack>

        {/* Topic Breakdown */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          📚 Topic Distribution
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
              🔒 Privacy Law Topics
            </Typography>
            <Stack spacing={1}>
              {Object.entries(reportData.privacyTopics).map(([topic, count]) => (
                <Box key={topic} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{topic}</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {count}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="secondary" sx={{ mb: 2 }}>
              📋 Commercial Topics
            </Typography>
            <Stack spacing={1}>
              {Object.entries(reportData.commercialContractTopics).map(([topic, count]) => (
                <Box key={topic} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{topic}</Typography>
                  <Typography variant="body2" fontWeight="bold" color="secondary">
                    {count}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Top Terms */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          🔍 Most Discussed Terms
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {reportData.mostCommonTerms.slice(0, 8).map(([term, count]) => (
            <Chip
              key={term}
              label={`${term} (${count})`}
              size="small"
              sx={{
                backgroundColor: '#e0f2fe',
                color: '#0277bd',
                fontWeight: 'bold',
                border: '1px solid #b3e5fc',
              }}
            />
          ))}
        </Box>

        {/* Footer */}
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Generated automatically from AI-powered legal chat analysis
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Report Date: {new Date().toLocaleDateString('en-US')}
          </Typography>
        </Box>
      </CardContent>
    </Paper>
  );
};
