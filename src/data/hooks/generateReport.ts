import { ReportData } from '@/api/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const useGenerateReport = (): UseMutationResult<ReportData, Error, void> => {
  return useMutation<ReportData, Error, void>({
    mutationFn: async () => {
      const res = await fetch('/api/generate-report', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate report');
      console.log(res);
      return res.json();
    },
  });
};
