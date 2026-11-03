import { Info } from 'lucide-react';
import AssistantChat from '@/components/demo/AssistantChat';
import EvalDashboard from '@/components/demo/EvalDashboard';

export default function DemoSection() {
  return (
    <section id="demo" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Live demo</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Ask a question, then follow up on it
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Conversations are saved to a database, so your history is still here after a reload.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <AssistantChat />
          <div id="evals" className="scroll-mt-24">
            <EvalDashboard />
          </div>
        </div>

        <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
          Replies are drawn from a fixed knowledge base by a deterministic engine, so every answer is
          traceable to its source. The production design swaps in an open-weight language model for
          generation while keeping the same guardrails and evaluation steps.
        </p>
      </div>
    </section>
  );
}
