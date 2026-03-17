import { useState, useEffect, useRef, useCallback } from "react";
import { StandupConfig } from "./StandupApp";

interface Props {
  config: StandupConfig;
  members: string[];
  currentIndex: number;
  onNext: () => void;
  onBack: () => void;
}

export default function StandupScreen({
  config,
  members,
  currentIndex,
  onNext,
  onBack,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(config.timerDuration);
  const [flashing, setFlashing] = useState(false);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasExpiredRef = useRef(false);

  const currentMember = members[currentIndex];
  const total = members.length;
  const progress = (timeLeft / config.timerDuration) * 100;

  // Reset timer when person changes
  useEffect(() => {
    setTimeLeft(config.timerDuration);
    setFlashing(false);
    setPaused(false);
    hasExpiredRef.current = false;
  }, [currentIndex, config.timerDuration]);

  // Countdown
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (!hasExpiredRef.current) {
            hasExpiredRef.current = true;
            setFlashing(true);
            setTimeout(() => {
              setFlashing(false);
              onNext();
            }, 2000);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, currentIndex, onNext]);

  function handleNext() {
    hasExpiredRef.current = true;
    setFlashing(false);
    onNext();
  }

  function handleBack() {
    hasExpiredRef.current = true;
    setFlashing(false);
    onBack();
  }

  // Color based on time remaining
  const pct = timeLeft / config.timerDuration;
  const barColor =
    pct > 0.5
      ? "bg-emerald-500"
      : pct > 0.25
      ? "bg-yellow-400"
      : "bg-red-500";

  const timerTextColor =
    pct > 0.5
      ? "text-emerald-400"
      : pct > 0.25
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className={`flex-1 flex flex-col transition-colors duration-300 ${
        flashing ? "bg-amber-950" : "bg-gray-950"
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="text-sm text-gray-500 font-medium">
          Daily Standup
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <span className="text-gray-500">Person</span>
          <span className="text-white text-base">{currentIndex + 1}</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{total}</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-6 px-8">
        {members.map((m, i) => (
          <div
            key={m}
            title={m}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < currentIndex
                ? "bg-emerald-500 w-6"
                : i === currentIndex
                ? "bg-blue-500 w-8"
                : "bg-gray-700 w-6"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-3xl mx-auto w-full">
        {/* Name */}
        <div
          className={`text-center mb-10 transition-all duration-300 ${
            flashing ? "animate-pulse" : ""
          }`}
        >
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2 font-semibold">
            Now speaking
          </p>
          <h1 className="text-7xl font-bold tracking-tight text-white">
            {currentMember}
          </h1>
        </div>

        {/* Timer */}
        <div className="w-full max-w-lg mb-10">
          <div className="flex items-end justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Time remaining
            </span>
            <span className={`text-3xl font-bold tabular-nums ${timerTextColor}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="w-full max-w-lg bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-10">
          <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">
            Questions
          </p>
          <ul className="space-y-3">
            {config.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 flex-shrink-0 font-medium">
                  {i + 1}
                </span>
                <span className="text-gray-200 text-sm leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 w-full max-w-lg">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="flex-1 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            ← Back
          </button>
          <button
            onClick={() => setPaused((p) => !p)}
            className="px-5 py-3.5 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm"
            title={paused ? "Resume" : "Pause"}
          >
            {paused ? "▶" : "⏸"}
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
          >
            {currentIndex === total - 1 ? "Finish →" : "Next →"}
          </button>
        </div>
      </div>

      {/* Flash overlay message */}
      {flashing && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
          <div className="bg-amber-500/20 border border-amber-500/40 rounded-2xl px-8 py-4 backdrop-blur-sm animate-pulse">
            <p className="text-amber-300 text-xl font-semibold">Time's up!</p>
          </div>
        </div>
      )}
    </div>
  );
}
