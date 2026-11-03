import { ArrowRight, BookOpen, ShieldAlert, Sparkles } from 'lucide-react';

const HERO_STATS = [
  { value: '9', label: 'knowledge passages with cited answers' },
  { value: '3', label: 'guardrail checks on every message' },
  { value: '11', label: 'automated evaluation cases' },
];

const MOCK_MESSAGES = [
  { role: 'user', text: 'How does a message move through the pipeline?' },
  {
    role: 'assistant',
    text: 'Every message passes through input guardrails, dialogue state resolution, retrieval, a grounded answer step, and logging.',
    source: 'Request pipeline',
  },
  { role: 'user', text: 'How is that tested?' },
  {
    role: 'assistant',
    text: 'The assistant keeps the topic from the previous turn, so this follow-up resolves to the same passage.',
    source: 'Multi-turn dialogue state',
  },
] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-slate-950 pb-24 pt-32 text-white md:pb-32 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 h-[32rem] w-[32rem] rounded-full bg-teal-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div className="motion-safe:animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Conversational AI engineering reference
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
            Multi-turn AI assistants that stay grounded, safe, and measurable.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
            A working reference for production dialogue systems: retrieval-augmented answers,
            conversation state across turns, guardrails on every message, and an evaluation loop
            that proves quality before release.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#demo"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-teal-400"
            >
              Talk to the assistant
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="#pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-600 px-6 py-3 text-sm font-bold text-white transition hover:border-slate-400 hover:bg-white/5"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Read the architecture
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-slate-800 pt-8">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold text-white">{stat.value}</dd>
                <p className="mt-1 text-xs leading-snug text-slate-400">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <div
          className="motion-safe:animate-fade-up relative"
          style={{ animationDelay: '150ms' }}
          aria-label="Preview of a multi-turn conversation"
        >
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-teal-950/50 backdrop-blur">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <span className="text-xs text-slate-400">Live preview</span>
            </div>

            <div className="mt-5 space-y-4">
              {MOCK_MESSAGES.map((message, index) => (
                <div
                  key={message.text}
                  className={`motion-safe:animate-fade-up flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                  style={{ animationDelay: `${400 + index * 350}ms` }}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'rounded-br-md bg-teal-500 text-slate-950'
                        : 'rounded-bl-md bg-slate-800 text-slate-100'
                    }`}
                  >
                    {message.text}
                    {'source' in message && (
                      <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-300">
                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                        {message.source}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
              Email addresses are redacted before the reply is generated.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
