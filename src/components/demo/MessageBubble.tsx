import { BookOpen, Info, ShieldAlert, ShieldX, type LucideIcon } from 'lucide-react';
import type { AssistantTurn, GuardrailEvent } from '@/lib/assistant/types';

const GUARDRAIL_STYLES: Record<GuardrailEvent['type'], { label: string; className: string; icon: LucideIcon }> = {
  prompt_injection: {
    label: 'Prompt injection refused',
    className: 'border-rose-200 bg-rose-50 text-rose-800',
    icon: ShieldX,
  },
  pii_redacted: {
    label: 'Personal data redacted',
    className: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: ShieldAlert,
  },
  low_confidence: {
    label: 'Abstained',
    className: 'border-slate-300 bg-slate-100 text-slate-700',
    icon: Info,
  },
};

interface MessageBubbleProps {
  turn: AssistantTurn;
}

export default function MessageBubble({ turn }: MessageBubbleProps) {
  const isUser = turn.role === 'user';

  return (
    <div className={`flex motion-safe:animate-fade-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-md bg-slate-900 text-white'
              : 'rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm'
          }`}
        >
          {turn.content}
        </div>

        {!isUser && (turn.intent || turn.sources.length > 0 || turn.guardrails.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {turn.intent && (
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
                Intent: {turn.intent}
              </span>
            )}
            {turn.sources.map((source) => (
              <span
                key={source.id}
                className="flex items-center gap-1.5 rounded-full border border-teal-200 px-2.5 py-1 text-xs font-medium text-teal-800"
              >
                <BookOpen className="h-3 w-3" aria-hidden="true" />
                {source.title}
              </span>
            ))}
            {turn.guardrails.map((event, index) => {
              const style = GUARDRAIL_STYLES[event.type];
              const Icon = style.icon;
              return (
                <span
                  key={`${event.type}-${index}`}
                  title={event.detail}
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style.className}`}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {style.label}
                </span>
              );
            })}
          </div>
        )}

        {!isUser && turn.latencyMs !== undefined && (
          <p className="text-xs text-slate-500">
            Reply generated in {turn.latencyMs.toFixed(2)} ms
          </p>
        )}
      </div>
    </div>
  );
}
