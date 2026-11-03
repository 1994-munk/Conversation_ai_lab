import { supabase } from '@/lib/supabase';
import type { EvalRunResult } from '@/lib/assistant/evals';
import type { AssistantTurn, GuardrailEvent, SourceRef } from '@/lib/assistant/types';

const SESSION_STORAGE_KEY = 'assistant-demo-session-id';

interface MessageRow {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent: string | null;
  sources: SourceRef[] | null;
  guardrails: GuardrailEvent[] | null;
  latency_ms: number | null;
  created_at: string;
}

export interface EvalRunSummary {
  id: string;
  score: number;
  passed: number;
  total: number;
  createdAt: string;
}

function requireClient() {
  if (!supabase) throw new Error('Database connection is not configured.');
  return supabase;
}

export function getSessionId(): string {
  const existing = localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(SESSION_STORAGE_KEY, created);
  return created;
}

function toTurn(row: MessageRow): AssistantTurn {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    intent: row.intent ?? undefined,
    sources: Array.isArray(row.sources) ? row.sources : [],
    guardrails: Array.isArray(row.guardrails) ? row.guardrails : [],
    latencyMs: row.latency_ms ?? undefined,
    createdAt: row.created_at,
  };
}

export async function loadMessages(sessionId: string): Promise<AssistantTurn[]> {
  const { data, error } = await requireClient()
    .from('assistant_messages')
    .select('id, role, content, intent, sources, guardrails, latency_ms, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data as MessageRow[] | null ?? []).map(toTurn);
}

export async function saveExchange(
  sessionId: string,
  userTurn: AssistantTurn,
  assistantTurn: AssistantTurn,
): Promise<AssistantTurn[]> {
  const rows = [userTurn, assistantTurn].map((turn) => ({
    session_id: sessionId,
    role: turn.role,
    content: turn.content,
    intent: turn.intent ?? null,
    sources: turn.sources,
    guardrails: turn.guardrails,
    latency_ms: turn.latencyMs ?? null,
  }));
  const { data, error } = await requireClient()
    .from('assistant_messages')
    .insert(rows)
    .select('id, role, content, intent, sources, guardrails, latency_ms, created_at');
  if (error) throw error;
  return (data as MessageRow[] | null ?? []).map(toTurn);
}

export async function clearMessages(sessionId: string): Promise<void> {
  const { error } = await requireClient()
    .from('assistant_messages')
    .delete()
    .eq('session_id', sessionId);
  if (error) throw error;
}

export async function saveEvalRun(result: EvalRunResult): Promise<void> {
  const { error } = await requireClient().from('eval_runs').insert({
    score: result.score,
    passed: result.passed,
    total: result.total,
    details: result.results,
  });
  if (error) throw error;
}

export async function loadEvalRuns(limit = 10): Promise<EvalRunSummary[]> {
  const { data, error } = await requireClient()
    .from('eval_runs')
    .select('id, score, passed, total, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  const rows = (data ?? []) as Array<{
    id: string;
    score: number;
    passed: number;
    total: number;
    created_at: string;
  }>;
  return rows
    .map((row) => ({
      id: row.id,
      score: Number(row.score),
      passed: row.passed,
      total: row.total,
      createdAt: row.created_at,
    }))
    .reverse();
}
