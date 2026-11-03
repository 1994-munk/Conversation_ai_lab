import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-bold text-slate-900">Conversational AI Lab</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <li>
              <a href="#capabilities" className="transition hover:text-teal-700">Capabilities</a>
            </li>
            <li>
              <a href="#pipeline" className="transition hover:text-teal-700">Architecture</a>
            </li>
            <li>
              <a href="#demo" className="transition hover:text-teal-700">Live demo</a>
            </li>
            <li>
              <a href="#evals" className="transition hover:text-teal-700">Evaluations</a>
            </li>
          </ul>
        </nav>
        <p className="text-center text-sm text-slate-500 md:text-right">
          Built as a reference for production conversational AI.
        </p>
      </div>
    </footer>
  );
}
