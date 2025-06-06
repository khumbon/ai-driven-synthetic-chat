import { ReportData } from '@/api/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export const useGenerateReport = (): UseMutationResult<ReportData, Error, void, unknown> => {
  const mutation = useMutation<ReportData, Error, void>({
    mutationFn: async () => {
      const res = await fetch('/api/generate-report', { method: 'POST' });
      console.log('res');
      console.log(res);
      if (!res.ok) throw new Error('Failed to generate report');
      console.log(res);
      return res.json();
    },
  });

  return mutation;
};
