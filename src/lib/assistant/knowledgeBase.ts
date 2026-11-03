import type { KnowledgeDoc } from '@/lib/assistant/types';

// Passages the assistant can cite. Each answer is grounded in exactly one of these.
export const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'pipeline',
    topic: 'pipeline',
    title: 'Request pipeline',
    body: 'Every message passes through input guardrails, dialogue state resolution, retrieval, a grounded answer step, and logging. Each stage is a separate function so it can be tested, replaced, or monitored on its own.',
  },
  {
    id: 'retrieval',
    topic: 'retrieval',
    title: 'Hybrid retrieval',
    body: 'Retrieval ranks knowledge passages with BM25 lexical scoring and abstains when query coverage is low. In production the lexical pass is combined with dense embeddings stored in Qdrant and reordered by a cross-encoder reranker.',
  },
  {
    id: 'dialogue',
    topic: 'dialogue',
    title: 'Multi-turn dialogue state',
    body: 'The assistant keeps the topic and cited source from the previous turn. Short follow-up questions such as how is that tested are resolved against that topic, so context carries across turns.',
  },
  {
    id: 'guardrails',
    topic: 'guardrails',
    title: 'Safety guardrails',
    body: 'Inputs are checked for prompt injection attempts, which are refused before retrieval runs. Email addresses, phone numbers, and card-like numbers are redacted before a message is answered or stored.',
  },
  {
    id: 'evaluation',
    topic: 'evaluation',
    title: 'Evaluation loops',
    body: 'A golden set of questions with expected sources is run on demand to measure answer quality. Each run reports retrieval hit rate and guardrail accuracy, and results are saved so changes can be compared over time.',
  },
  {
    id: 'monitoring',
    topic: 'monitoring',
    title: 'Continuous monitoring',
    body: 'Every reply records its latency, intent, cited sources, and guardrail events. Dashboards and alerts on these fields catch quality regressions, unusual safety triggers, and slow responses in production.',
  },
  {
    id: 'serving',
    topic: 'serving',
    title: 'Open-weight model serving',
    body: 'Open-weight models are fine-tuned with parameter-efficient methods such as LoRA on curated conversation data, then served with vLLM for batched, high-throughput inference.',
  },
  {
    id: 'ranking',
    topic: 'ranking',
    title: 'Ranking and recommendation models',
    body: 'Ranking work starts from a measurable problem: define relevance labels, train a sequence encoder or cross-encoder, and track answer acceptance or click-through lift after release.',
  },
  {
    id: 'stack',
    topic: 'stack',
    title: 'Engineering stack',
    body: 'Python services use PyTorch for models, LangGraph for multi-turn orchestration, Pydantic AI for typed outputs, Qdrant for vector search, vLLM for inference, and DeepEval for automated LLM tests.',
  },
];
