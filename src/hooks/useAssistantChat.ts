import { useCallback, useEffect, useState } from 'react';
import { respond } from '@/lib/assistant/engine';
import type { AssistantTurn } from '@/lib/assistant/types';
import {
  clearMessages,
  getSessionId,
  loadMessages,
  saveExchange,
} from '@/lib/assistantRepository';

const THINKING_DELAY_MS = 450;

const LOAD_ERROR = 'Your earlier conversation could not be loaded. You can still ask questions.';
const SAVE_ERROR = 'Your reply is shown, but it could not be saved for later visits.';
const CLEAR_ERROR = 'The conversation could not be cleared. Please try again.';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAssistantChat() {
  const [messages, setMessages] = useState<AssistantTurn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMessages(getSessionId())
      .then((rows) => {
        if (!cancelled) setMessages(rows);
      })
      .catch(() => {
        if (!cancelled) setError(LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const send = useCallback(
    async (rawInput: string) => {
      const input = rawInput.trim();
      if (!input || isThinking) return;

      setError(null);
      setIsThinking(true);
      await delay(THINKING_DELAY_MS);

      const response = respond(input, messages);
      const userTurn: AssistantTurn = {
        role: 'user',
        content: response.userContent,
        sources: [],
        guardrails: [],
      };
      const assistantTurn: AssistantTurn = {
        role: 'assistant',
        content: response.content,
        intent: response.intent,
        sources: response.sources,
        guardrails: response.guardrails,
        latencyMs: response.latencyMs,
      };

      try {
        const saved = await saveExchange(getSessionId(), userTurn, assistantTurn);
        setMessages((prev) => [...prev, ...saved]);
      } catch {
        setMessages((prev) => [...prev, userTurn, assistantTurn]);
        setError(SAVE_ERROR);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, isThinking],
  );

  const clear = useCallback(async () => {
    setError(null);
    try {
      await clearMessages(getSessionId());
      setMessages([]);
    } catch {
      setError(CLEAR_ERROR);
    }
  }, []);

  return { messages, isLoading, isThinking, error, send, clear };
}
