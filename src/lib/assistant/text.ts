const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'from', 'by', 'as', 'at',
  'is', 'are', 'be', 'do', 'does', 'how', 'what', 'why', 'when', 'where', 'which', 'who',
  'you', 'your', 'we', 'our', 'i', 'me', 'my', 'can', 'could', 'would', 'should', 'will',
  'about', 'into', 'than', 'then', 'also', 'more', 'there', 'please', 'tell',
]);

const FOLLOW_UP_PRONOUNS = new Set(['it', 'its', 'that', 'this', 'they', 'them', 'those', 'these']);

export function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

// Crude prefix stemmer: "evaluation", "evaluate" and "evaluated" all share the term "evalua".
export function contentTerms(text: string): string[] {
  return tokenize(text)
    .filter((token) => !STOPWORDS.has(token))
    .map((token) => token.slice(0, 6));
}

export function hasFollowUpPronoun(text: string): boolean {
  return tokenize(text).some((token) => FOLLOW_UP_PRONOUNS.has(token));
}
