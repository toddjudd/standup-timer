import { useState } from 'react';
import StartScreen from './StartScreen';
import StandupScreen from './StandupScreen';
import EndScreen from './EndScreen';

export type AppScreen = 'start' | 'standup' | 'end';

export interface StandupConfig {
  questions: string[];
  timerDuration: number; // seconds
  orderMethod: 'daily-random' | 'shuffle' | 'alphabetical';
}

export const TEAM_MEMBERS = [
  'Abbie',
  'Andrew',
  'Todd',
  'Caitlin',
  'Sai',
  'Mitul',
];

const DEFAULT_QUESTIONS = [
  'What did you do yesterday?',
  'What are you working on today?',
  'Any blockers?',
  'Any shoutouts or announcements?',
];

function loadConfig(): StandupConfig {
  try {
    const saved = localStorage.getItem('standup-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        questions: parsed.questions ?? DEFAULT_QUESTIONS,
        timerDuration: parsed.timerDuration ?? 60,
        orderMethod: parsed.orderMethod ?? 'daily-random',
      };
    }
  } catch {}
  return {
    questions: DEFAULT_QUESTIONS,
    timerDuration: 60,
    orderMethod: 'daily-random',
  };
}

export function saveConfig(config: StandupConfig) {
  localStorage.setItem('standup-config', JSON.stringify(config));
}

// Seeded random number generator (mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDateSeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function getOrderedMembers(
  members: string[],
  method: StandupConfig['orderMethod'],
): string[] {
  const arr = [...members];
  if (method === 'alphabetical') {
    return arr.sort();
  }
  if (method === 'daily-random') {
    const seed = getDateSeed();
    const rand = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  // shuffle: random each time
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function StandupApp() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [config, setConfig] = useState<StandupConfig>(loadConfig);
  const [orderedMembers, setOrderedMembers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleStart(cfg: StandupConfig) {
    saveConfig(cfg);
    setConfig(cfg);
    const ordered = getOrderedMembers(TEAM_MEMBERS, cfg.orderMethod);
    setOrderedMembers(ordered);
    setCurrentIndex(0);
    setScreen('standup');
  }

  function handleNext() {
    if (currentIndex < orderedMembers.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setScreen('end');
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  function handleRestart() {
    setScreen('start');
    setCurrentIndex(0);
  }

  return (
    <div className='min-h-screen bg-gray-950 text-white flex flex-col'>
      {screen === 'start' && (
        <StartScreen config={config} onStart={handleStart} />
      )}
      {screen === 'standup' && (
        <StandupScreen
          config={config}
          members={orderedMembers}
          currentIndex={currentIndex}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {screen === 'end' && <EndScreen onRestart={handleRestart} />}
    </div>
  );
}
