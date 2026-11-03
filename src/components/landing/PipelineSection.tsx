import { Database, Gauge, Layers, Lock, MessageSquareText, Shield, Sparkles, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PipelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    icon: Shield,
    title: 'Input guardrails',
    description: 'Prompt-injection attempts are refused and personal data is redacted before anything else runs.',
  },
  {
    icon: Workflow,
    title: 'Dialogue state',
    description: 'The topic and source of the previous turn are used to resolve short follow-up questions.',
  },
  {
    icon: Database,
    title: 'Hybrid retrieval',
    description: 'Passages are ranked by lexical relevance and the assistant abstains when coverage is weak.',
  },
  {
    icon: MessageSquareText,
    title: 'Grounded answer',
    description: 'Replies quote a retrieved passage and cite it, so every claim can be traced to its source.',
  },
  {
    icon: Lock,
    title: 'Stored exchange',
    description: 'User and assistant turns are saved with intent, sources, and guardrail events for review.',
  },
  {
    icon: Gauge,
    title: 'Evaluation loop',
    description: 'A golden set runs on demand and each score is saved, so quality trends are visible over time.',
  },
];

const STACK = [
  'PyTorch',
  'LangGraph',
  'Pydantic AI',
  'vLLM',
  'Qdrant',
  'DeepEval',
  'LoRA fine-tuning',
  'Sequence encoders',
];

const DECISIONS = [
  {
    title: 'Abstain instead of guessing',
    body: 'Low retrieval coverage returns an honest "not found" reply. A wrong confident answer costs more trust than a missing one.',
  },
  {
    title: 'Redact before storage',
    body: 'Personal data is removed before a message is answered or saved, so logs never hold raw identifiers.',
  },
  {
    title: 'Evaluate on a fixed set',
    body: 'The same golden questions run every time, which makes score changes attributable to code changes.',
  },
];

export default function PipelineSection() {
  return (
    <section id="pipeline" className="scroll-mt-20 bg-slate-50 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Architecture</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Every message passes through six checked stages
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Each stage is a small, testable step. Any one of them can be replaced or monitored
            without touching the rest.
          </p>
        </div>

        <ol className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STEPS.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Stage {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Layers className="h-5 w-5 text-teal-700" aria-hidden="true" />
              Production reference stack
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The tools the production design is built on. The browser demo reproduces the same
              stages without a model so every answer is traceable.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-900 p-8 text-white">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-teal-300" aria-hidden="true" />
              Engineering decisions
            </h3>
            <dl className="mt-6 space-y-6">
              {DECISIONS.map((decision) => (
                <div key={decision.title}>
                  <dt className="font-bold text-teal-200">{decision.title}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-300">{decision.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
