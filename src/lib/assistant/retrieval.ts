import { KNOWLEDGE_BASE } from '@/lib/assistant/knowledgeBase';
import { contentTerms } from '@/lib/assistant/text';
import type { KnowledgeDoc, RetrievalHit } from '@/lib/assistant/types';

// Standard BM25 parameters.
const K1 = 1.5;
const B = 0.75;

interface IndexedDoc {
  doc: KnowledgeDoc;
  termFrequency: Map<string, number>;
  length: number;
}

function indexDocuments(docs: KnowledgeDoc[]): IndexedDoc[] {
  return docs.map((doc) => {
    // The title is repeated so title matches weigh more than body matches.
    const terms = contentTerms(`${doc.title} ${doc.title} ${doc.body}`);
    const termFrequency = new Map<string, number>();
    for (const term of terms) {
      termFrequency.set(term, (termFrequency.get(term) ?? 0) + 1);
    }
    return { doc, termFrequency, length: terms.length };
  });
}

// Coverage is the share of distinct query terms found in a passage. The assistant
// abstains when coverage is low, which keeps unsupported answers out of the reply.
export function searchKnowledgeBase(query: string, limit = 3): RetrievalHit[] {
  const queryTerms = [...new Set(contentTerms(query))];
  if (queryTerms.length === 0) return [];

  const docs = indexDocuments(KNOWLEDGE_BASE);
  const averageLength = docs.reduce((sum, d) => sum + d.length, 0) / docs.length;
  const docCount = docs.length;

  const documentFrequency = new Map<string, number>();
  for (const term of queryTerms) {
    documentFrequency.set(term, docs.filter((d) => d.termFrequency.has(term)).length);
  }

  return docs
    .map((indexed): RetrievalHit => {
      let score = 0;
      let matched = 0;
      for (const term of queryTerms) {
        const tf = indexed.termFrequency.get(term) ?? 0;
        if (tf === 0) continue;
        matched += 1;
        const df = documentFrequency.get(term) ?? 0;
        const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
        const lengthNorm = K1 * (1 - B + (B * indexed.length) / averageLength);
        score += idf * ((tf * (K1 + 1)) / (tf + lengthNorm));
      }
      return { doc: indexed.doc, score, coverage: matched / queryTerms.length };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
