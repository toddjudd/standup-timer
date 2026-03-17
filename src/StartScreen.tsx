import { useState, useRef } from 'react';
import { StandupConfig } from './StandupApp';

interface Props {
  config: StandupConfig;
  onStart: (config: StandupConfig) => void;
}

export default function StartScreen({ config, onStart }: Props) {
  const [questions, setQuestions] = useState<string[]>(config.questions);
  const [timerDuration, setTimerDuration] = useState(config.timerDuration);
  const [orderMethod, setOrderMethod] = useState<StandupConfig['orderMethod']>(
    config.orderMethod,
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function addQuestion() {
    const q = newQuestion.trim();
    if (!q) return;
    setQuestions((prev) => [...prev, q]);
    setNewQuestion('');
  }

  function removeQuestion(i: number) {
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));
  }

  function startEdit(i: number) {
    setEditingIndex(i);
    setEditingValue(questions[i]);
  }

  function commitEdit(i: number) {
    const val = editingValue.trim();
    if (val) {
      setQuestions((prev) => prev.map((q, idx) => (idx === i ? val : q)));
    }
    setEditingIndex(null);
  }

  function handleDragStart(i: number) {
    dragIndex.current = i;
  }

  function handleDragEnter(i: number) {
    dragOverIndex.current = i;
  }

  function handleDragEnd() {
    if (dragIndex.current === null || dragOverIndex.current === null) return;
    if (dragIndex.current === dragOverIndex.current) return;
    const arr = [...questions];
    const [moved] = arr.splice(dragIndex.current, 1);
    arr.splice(dragOverIndex.current, 0, moved);
    setQuestions(arr);
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  function handleStart() {
    const cfg: StandupConfig = { questions, timerDuration, orderMethod };
    onStart(cfg);
  }

  return (
    <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
      <div className='w-full max-w-2xl space-y-10'>
        {/* Header */}
        <div className='text-center'>
          <div className='inline-flex items-center gap-2 mb-3'>
            <span className='text-3xl'>☀️</span>
          </div>
          <h1 className='text-4xl font-bold tracking-tight text-white'>
            Daily Standup
          </h1>
          <p className='text-gray-400 mt-2 text-lg'>
            Configure your standup before you begin
          </p>
        </div>

        {/* Questions */}
        <section className='bg-gray-900 rounded-2xl p-6 space-y-4 border border-gray-800'>
          <h2 className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
            Standup Questions
          </h2>
          <ul className='space-y-2'>
            {questions.map((q, i) => (
              <li
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragEnter={() => handleDragEnter(i)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className='flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3 group cursor-grab active:cursor-grabbing border border-gray-700 hover:border-gray-600 transition-colors'
              >
                <span className='text-gray-500 select-none text-lg'>⠿</span>
                {editingIndex === i ? (
                  <input
                    autoFocus
                    className='flex-1 bg-transparent outline-none text-white text-sm'
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => commitEdit(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEdit(i);
                      if (e.key === 'Escape') setEditingIndex(null);
                    }}
                  />
                ) : (
                  <span
                    className='flex-1 text-sm text-gray-200 cursor-text'
                    onDoubleClick={() => startEdit(i)}
                  >
                    {q}
                  </span>
                )}
                <button
                  onClick={() => startEdit(i)}
                  className='opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-400 transition-all text-xs px-1'
                  title='Edit'
                >
                  ✏️
                </button>
                <button
                  onClick={() => removeQuestion(i)}
                  className='opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all text-xs px-1'
                  title='Remove'
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className='flex gap-2 mt-2'>
            <input
              type='text'
              placeholder='Add a question…'
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
              className='flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors'
            />
            <button
              onClick={addQuestion}
              disabled={!newQuestion.trim()}
              className='px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors'
            >
              Add
            </button>
          </div>
        </section>

        {/* Timer & Order */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Timer */}
          <section className='bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4'>
            <h2 className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
              Timer Per Person
            </h2>
            <div className='flex items-center gap-4'>
              <input
                type='range'
                min={15}
                max={300}
                step={15}
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className='flex-1 accent-blue-500'
              />
              <span className='text-2xl font-bold text-white w-16 text-right tabular-nums'>
                {timerDuration}s
              </span>
            </div>
            <div className='flex justify-between text-xs text-gray-500'>
              <span>15s</span>
              <span>5 min</span>
            </div>
          </section>

          {/* Order */}
          <section className='bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4'>
            <h2 className='text-sm font-semibold uppercase tracking-widest text-gray-400'>
              Speaking Order
            </h2>
            <div className='space-y-2'>
              {(
                [
                  {
                    value: 'daily-random',
                    label: 'Daily Random',
                    desc: 'Same order all day',
                  },
                  {
                    value: 'shuffle',
                    label: 'Shuffle',
                    desc: 'Random each time',
                  },
                  {
                    value: 'alphabetical',
                    label: 'Alphabetical',
                    desc: 'A → Z',
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border transition-colors ${
                    orderMethod === opt.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type='radio'
                    name='order'
                    value={opt.value}
                    checked={orderMethod === opt.value}
                    onChange={() => setOrderMethod(opt.value)}
                    className='accent-blue-500'
                  />
                  <div>
                    <div className='text-sm font-medium text-white'>
                      {opt.label}
                    </div>
                    <div className='text-xs text-gray-500'>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={questions.length === 0}
          className='w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-900/30'
        >
          Start Standup →
        </button>
      </div>
    </div>
  );
}
