import { ReportData } from '@/api/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

interface SendEmailsRequest {
  emails: string[];
  reportData: ReportData;
  subject?: string;
}

interface SendEmailsResponse {
  message: string;
  totalEmails: number;
  successful: number;
  failed: number;
  results: {
    email: string;
    success: boolean;
    error?: string;
    messageId?: string;
  }[];
}

export const useSendEmails = (): UseMutationResult<SendEmailsResponse, Error, SendEmailsRequest, unknown> => {
  const mutation = useMutation<SendEmailsResponse, Error, SendEmailsRequest>({
    mutationFn: async ({ emails, reportData, subject }: SendEmailsRequest) => {
      const res = await fetch('/api/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails,
          reportData,
          subject,
        }),
      });

      console.log('res');
      console.log(res);

      if (!res.ok) throw new Error('Failed to send emails');

      console.log(res);
      return res.json();
    },
  });

  return mutation;
};
