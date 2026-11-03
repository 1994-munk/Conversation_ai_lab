export type GuardrailType = 'prompt_injection' | 'pii_redacted' | 'low_confidence';

export interface GuardrailEvent {
  type: GuardrailType;
  detail: string;
}

export interface SourceRef {
  id: string;
  title: string;
}

export interface KnowledgeDoc {
  id: string;
  topic: string;
  title: string;
  body: string;
}

export interface RetrievalHit {
  doc: KnowledgeDoc;
  score: number;
  coverage: number;
}

export interface AssistantTurn {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  sources: SourceRef[];
  guardrails: GuardrailEvent[];
  latencyMs?: number;
  createdAt?: string;
}

export interface AssistantResponse {
  content: string;
  intent: string;
  sources: SourceRef[];
  guardrails: GuardrailEvent[];
  userContent: string;
  latencyMs: number;
}
