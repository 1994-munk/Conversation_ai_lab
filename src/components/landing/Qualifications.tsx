import {
  BarChart3,
  Brain,
  GitBranch,
  Layers,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';

interface Capability {
  icon: LucideIcon;
  title: string;
  summary: string;
  evidence: string;
  href: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: GitBranch,
    title: 'Multi-turn conversational systems',
    summary:
      'Conversations are designed as stateful pipelines, so follow-up questions resolve against earlier turns instead of starting over.',
    evidence: 'Dialogue state carried between turns, with a visible citation trail.',
    href: '#demo',
  },
  {
    icon: Layers,
    title: 'RAG and context management',
    summary:
      'Answers are grounded in retrieved passages. The assistant abstains when retrieval coverage is too low rather than guessing.',
    evidence: 'BM25 retrieval over a knowledge base with coverage-based abstention.',
    href: '#demo',
  },
  {
    icon: Target,
    title: 'Ranking and retrieval models',
    summary:
      'Retrieval quality is framed as a measurable problem: labelled questions, expected sources, and a hit rate tracked over time.',
    evidence: 'Golden set of questions scored for top-two source hit rate.',
    href: '#evals',
  },
  {
    icon: BarChart3,
    title: 'Evaluation, monitoring and guardrails',
    summary:
      'Every message runs through safety checks, and every evaluation run is stored so regressions show up as a trend, not a surprise.',
    evidence: 'Prompt-injection refusal, PII redaction, and saved evaluation history.',
    href: '#evals',
  },
  {
    icon: Brain,
    title: 'Open-weight model training and serving',
    summary:
      'The production design covers LoRA fine-tuning of open-weight models and high-throughput serving with vLLM, documented as a reference architecture.',
    evidence: 'Architecture and stack reference, including model serving choices.',
    href: '#pipeline',
  },
  {
    icon: Users,
    title: 'Technical leadership',
    summary:
      'Design decisions are written down with their trade-offs so reviews, handovers, and mentoring have a shared reference.',
    evidence: 'Engineering decisions recorded alongside the architecture.',
    href: '#pipeline',
  },
];

export default function Qualifications() {
  return (
    <section id="capabilities" className="scroll-mt-20 bg-white py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-teal-700">Capabilities</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Where this project meets the brief
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Each area below is backed by working code in this project, not only a description.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <a
              key={capability.title}
              href={capability.href}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8 transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white transition group-hover:bg-teal-700">
                <capability.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-lg font-bold text-slate-900">{capability.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{capability.summary}</p>
              <p className="mt-6 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-700">
                <span className="font-bold text-teal-800">Evidence: </span>
                {capability.evidence}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
