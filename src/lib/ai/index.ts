/**
 * AI Service Layer - Abstract AI integration
 * Supports multiple AI providers (OpenAI, Anthropic, etc.)
 */

import { supabase } from '@/integrations/supabase/client';

export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIConfig {
    provider: 'openai' | 'anthropic' | 'custom';
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

/**
 * Send message to AI chatbot with rate limiting
 */
export const sendAIMessage = async (
  messages: AIMessage[],
  config?: AIConfig
): Promise<{ response?: string; error?: Error }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Rate limiting
    if (user) {
      const { checkRateLimit, RATE_LIMITS } = await import('@/lib/rate-limit');
      const rateLimit = await checkRateLimit(user.id, RATE_LIMITS.AI_CHAT);
      
      if (!rateLimit.allowed) {
        return { 
          error: new Error(`Rate limit exceeded. Please try again after ${new Date(rateLimit.resetAt).toLocaleTimeString()}`) 
        };
      }
    }

    // Use Supabase Edge Function for AI chat
    const { data, error } = await supabase.functions.invoke('ai-chat', {
      body: {
        messages,
        config: config || {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 1000,
        },
      },
    });

    if (error) {
      const { handleApiError } = await import('@/lib/error-handling');
      return { error: handleApiError(error, 'AI Chat') };
    }

    // Save conversation if user is authenticated
    if (user && data?.response) {
      const userMessage = messages[messages.length - 1]?.content || '';
      await saveBotConversation(user.id, userMessage, data.response);
    }

    return { response: data?.response || data?.message || data?.choices?.[0]?.message?.content };
  } catch (error) {
    const { handleApiError } = await import('@/lib/error-handling');
    return { error: handleApiError(error, 'AI Chat') };
  }
};

/**
 * Get AI bot response with context
 */
export const getBotResponse = async (
    userMessage: string,
    context?: Record<string, any>
): Promise<string> => {
    const systemPrompt = `You are a helpful assistant for this platform. 
You help users with questions about the platform, subscriptions, features, and general inquiries.
Be friendly, professional, and concise.
${context ? `Context: ${JSON.stringify(context)}` : ''}`;

    const messages: AIMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
    ];

    const { response, error } = await sendAIMessage(messages);

    if (error) {
        return 'I apologize, but I encountered an error. Please try again later or contact support through the secure form.';
    }

    return response || 'I apologize, but I could not generate a response. Please try again.';
};

/**
 * Train bot on platform content
 */
export const trainBotOnContent = async (content: string): Promise<{ success: boolean; error?: Error }> => {
    try {
        // Store training content in database for context
        const { error } = await supabase
            .from('bot_training_content')
            .insert({
                content,
                created_at: new Date().toISOString(),
            });

        if (error) {
            // Table might not exist, that's okay for now
            console.warn('Bot training content table may not exist:', error);
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

/**
 * Get bot conversation history
 */
export const getBotHistory = async (userId: string, limit = 50) => {
    try {
        const { data, error } = await supabase
            .from('bot_conversations')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return [];
        }

        return data || [];
    } catch {
        return [];
    }
};

/**
 * Save bot conversation
 */
export const saveBotConversation = async (
    userId: string,
    userMessage: string,
    botResponse: string
): Promise<void> => {
    try {
        await supabase
            .from('bot_conversations')
            .insert({
                user_id: userId,
                user_message: userMessage,
                bot_response: botResponse,
                created_at: new Date().toISOString(),
            });
    } catch (error) {
        console.warn('Failed to save bot conversation:', error);
    }
};

