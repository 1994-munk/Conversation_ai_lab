import { useEffect, useState } from 'react';
import { Bot, MessageSquare } from 'lucide-react';

const NAV_LINKS = [
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#pipeline', label: 'Architecture' },
  { href: '#demo', label: 'Live demo' },
  { href: '#evals', label: 'Evaluations' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              scrolled ? 'bg-teal-600 text-white' : 'bg-white text-teal-700'
            }`}
          >
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <span
            className={`text-base font-bold transition-colors ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}
          >
            Conversational AI Lab
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-teal-500 ${
                  scrolled ? 'text-slate-600' : 'text-slate-200'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#demo"
          className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-400 active:translate-y-0"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Try the assistant
        </a>
      </nav>
    </header>
  );
}
