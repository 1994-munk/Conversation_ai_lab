import type { GuardrailEvent } from '@/lib/assistant/types';

const INJECTION_PATTERNS = [
  /ignore (all |any |the )?(previous|prior|above) (instructions|prompts?)/i,
  /(reveal|show|print|repeat) (your|the) (system )?(prompt|instructions)/i,
  /disregard (your|the) (rules|instructions)/i,
  /you are now\b/i,
  /developer mode/i,
];

// Order matters: long digit runs are checked as cards before the shorter phone pattern.
const PII_RULES = [
  { label: 'card number', pattern: /\b(?:\d[ -]?){13,16}\b/g, token: '[CARD]' },
  { label: 'phone number', pattern: /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, token: '[PHONE]' },
  { label: 'email address', pattern: /[\w.+-]+@[\w-]+\.[\w.-]+/g, token: '[EMAIL]' },
];

export function detectPromptInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function redactPii(text: string): { text: string; events: GuardrailEvent[] } {
  let redacted = text;
  const events: GuardrailEvent[] = [];

  for (const rule of PII_RULES) {
    const matches = redacted.match(rule.pattern);
    if (!matches) continue;
    redacted = redacted.replace(rule.pattern, rule.token);
    const plural = matches.length > 1 ? 's' : '';
    events.push({
      type: 'pii_redacted',
      detail: `Redacted ${matches.length} ${rule.label}${plural}.`,
    });
  }

  return { text: redacted, events };
}
