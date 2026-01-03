import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string | null;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  receiver?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useMessages = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async ({ receiverId, subject, content }: { receiverId: string; subject?: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: receiverId,
        subject,
        content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message sent');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const inbox = messages?.filter(m => m.receiver_id === userId) || [];
  const sent = messages?.filter(m => m.sender_id === userId) || [];
  const unreadCount = inbox.filter(m => !m.read).length;

  return {
    messages,
    inbox,
    sent,
    unreadCount,
    isLoading,
    sendMessage: sendMessage.mutate,
    markAsRead: markAsRead.mutate,
  };
};
