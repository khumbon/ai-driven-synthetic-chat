import { useMutation } from '@tanstack/react-query';

export const useGenerateChats = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/generate-chats', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate chats');
      console.log(res);
      return res;
    },
  });
};
