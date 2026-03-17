interface Props {
  onRestart: () => void;
}

export default function EndScreen({ onRestart }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">
      <div className="space-y-6 max-w-md">
        <div className="text-7xl mb-2">🎉</div>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Standup Complete!
        </h1>
        <p className="text-gray-400 text-lg">
          Great work, everyone. Go build something awesome.
        </p>
        <div className="pt-4">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-base font-semibold rounded-2xl transition-colors shadow-lg shadow-blue-900/30"
          >
            ↩ Back to Start
          </button>
        </div>
      </div>
    </div>
  );
}
