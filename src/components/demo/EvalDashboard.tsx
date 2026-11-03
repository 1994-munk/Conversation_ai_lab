import { useEffect, useState } from 'react';
import { CheckCircle2, Play, XCircle } from 'lucide-react';
import { runEvalSuite, type EvalRunResult } from '@/lib/assistant/evals';
import { loadEvalRuns, saveEvalRun, type EvalRunSummary } from '@/lib/assistantRepository';

const LOAD_ERROR = 'Evaluation history could not be loaded.';
const SAVE_ERROR = 'The run finished, but it could not be saved to history.';

export default function EvalDashboard() {
  const [result, setResult] = useState<EvalRunResult | null>(null);
  const [history, setHistory] = useState<EvalRunSummary[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadEvalRuns()
      .then((rows) => {
        if (!cancelled) setHistory(rows);
      })
      .catch(() => {
        if (!cancelled) setError(LOAD_ERROR);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const runSuite = async () => {
    setIsRunning(true);
    setError(null);
    const run = runEvalSuite();
    setResult(run);
    try {
      await saveEvalRun(run);
      setHistory(await loadEvalRuns());
    } catch {
      setError(SAVE_ERROR);
    } finally {
      setIsRunning(false);
    }
  };

  const percent = result ? Math.round(result.score * 100) : null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Evaluation suite</h3>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-600">
            Runs a fixed set of questions with known expected sources and safety outcomes, then
            saves the score so changes can be compared over time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void runSuite()}
          disabled={isRunning}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70"
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          {isRunning ? 'Running...' : 'Run suite'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {result && percent !== null && (
        <div className="mt-8">
          <div className="flex items-end gap-4 border-b border-slate-200 pb-6">
            <p className="text-5xl font-bold tracking-tight text-slate-900">{percent}%</p>
            <p className="pb-2 text-sm font-medium text-slate-600">
              {result.passed} of {result.total} cases passed
            </p>
          </div>

          <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
            {result.results.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item.passed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-label="Passed" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700" aria-label="Failed" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{item.question}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <p className="text-sm font-bold text-slate-900">Score history</p>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600">Runs you start will appear here.</p>
        ) : (
          <div className="mt-4 flex h-32 items-end gap-2" role="img" aria-label="Recent evaluation scores">
            {history.map((run) => (
              <div key={run.id} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-teal-500 transition-all duration-500"
                  style={{ height: `${Math.max(run.score * 96, 4)}px` }}
                  title={`${Math.round(run.score * 100)}% on ${new Date(run.createdAt).toLocaleString()}`}
                />
                <span className="text-[11px] font-medium text-slate-600">
                  {Math.round(run.score * 100)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
