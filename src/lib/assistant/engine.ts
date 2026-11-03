import { KNOWLEDGE_BASE } from '@/lib/assistant/knowledgeBase';
import { detectPromptInjection, redactPii } from '@/lib/assistant/guardrails';
import { searchKnowledgeBase } from '@/lib/assistant/retrieval';
import { contentTerms, hasFollowUpPronoun } from '@/lib/assistant/text';
import type {
  AssistantResponse,
  AssistantTurn,
  GuardrailEvent,
  KnowledgeDoc,
  SourceRef,
} from '@/lib/assistant/types';

const MIN_COVERAGE = 0.5;
const SOURCES_PER_ANSWER = 2;

const REFUSAL =
  'I cannot follow instructions that try to override how I work. Ask a question about the pipeline, retrieval, guardrails, evaluation, or monitoring.';
const ABSTAIN =
  'I could not find that in the knowledge base. Try asking about retrieval, guardrails, evaluation, monitoring, or serving.';

// The most recent cited source is the topic a follow-up question refers back to.
function activeSourceId(history: AssistantTurn[]): string | undefined {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const turn = history[i];
    if (turn.role === 'assistant') return turn.sources[0]?.id;
  }
  return undefined;
}

// Produces one reply without any network call, so every answer can be traced to a passage.
export function respond(input: string, history: AssistantTurn[]): AssistantResponse {
  const started = performance.now();
  const elapsed = () => Math.round((performance.now() - started) * 100) / 100;

  if (detectPromptInjection(input)) {
    const guardrails: GuardrailEvent[] = [
      { type: 'prompt_injection', detail: 'Message tried to override the assistant instructions.' },
    ];
    return {
      content: REFUSAL,
      intent: 'blocked',
      sources: [],
      guardrails,
      userContent: input,
      latencyMs: elapsed(),
    };
  }

  const pii = redactPii(input);
  const text = pii.text;
  const guardrails: GuardrailEvent[] = [...pii.events];

  const hits = searchKnowledgeBase(text);
  const best = hits[0];
  const sourceId = activeSourceId(history);
  const activeDoc = KNOWLEDGE_BASE.find((doc) => doc.id === sourceId);
  const isFollowUp =
    Boolean(activeDoc) && (hasFollowUpPronoun(text) || contentTerms(text).length <= 1);

  if (best && best.coverage >= MIN_COVERAGE) {
    return {
      content: best.doc.body,
      intent: best.doc.topic,
      sources: hits.slice(0, SOURCES_PER_ANSWER).map((hit) => toSourceRef(hit.doc)),
      guardrails,
      userContent: text,
      latencyMs: elapsed(),
    };
  }

  if (isFollowUp && activeDoc) {
    return {
      content: activeDoc.body,
      intent: activeDoc.topic,
      sources: [toSourceRef(activeDoc)],
      guardrails,
      userContent: text,
      latencyMs: elapsed(),
    };
  }

  guardrails.push({
    type: 'low_confidence',
    detail: 'No knowledge passage matched the question closely enough.',
  });
  return {
    content: ABSTAIN,
    intent: 'unknown',
    sources: [],
    guardrails,
    userContent: text,
    latencyMs: elapsed(),
  };
}

function toSourceRef(doc: KnowledgeDoc): SourceRef {
  return { id: doc.id, title: doc.title };
}
