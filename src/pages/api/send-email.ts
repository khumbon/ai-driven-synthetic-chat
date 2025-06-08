import type { NextApiRequest, NextApiResponse } from 'next';
import { ReportData } from '@/api/types';
import { resend } from '@/api/sendEmail/resend';
import { LegalInsightsEmail } from '@/components/LegalInsightsEmail';

interface SendEmailRequest {
  emails: string[];
  reportData: ReportData;
  subject?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails, reportData, subject }: SendEmailRequest = req.body;

    // Validate request body
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'emails array is required and must not be empty' });
    }

    if (!reportData) {
      return res.status(400).json({ error: 'reportData is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return res.status(400).json({
        error: 'Invalid email addresses found',
        invalidEmails,
      });
    }

    console.log('validated');

    const emailSubject = subject || 'Legal AI Insights Report';

    // Send emails using Resend
    const emailPromises = emails.map(async (email) => {
      try {
        const { data, error } = await resend.emails.send({
          from: 'testEmail@mailosaur.com',
          to: email,
          subject: emailSubject,
          react: LegalInsightsEmail({ reportData }),
        });

        if (error) {
          console.error(`Failed to send email to ${email}:`, error);
          return { email, success: false, error: error.message };
        }

        console.log('data');
        console.log(data);

        return { email, success: true, messageId: data?.id };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return {
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    console.log('here');
    const results = await Promise.all(emailPromises);
    const successful = results.filter((result) => result.success);
    const failed = results.filter((result) => !result.success);

    console.log('results');
    console.log(results);

    res.status(200).json({
      message: 'Email sending completed',
      totalEmails: emails.length,
      successful: successful.length,
      failed: failed.length,
      results: results,
    });
  } catch (err) {
    console.error('Error sending emails:', err);
    res.status(500).json({
      error: 'Failed to send emails',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}
