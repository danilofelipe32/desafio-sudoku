import React from 'react';
import { Difficulty } from '../types';

interface DashboardProps {
  difficulty: Difficulty | null;
  mistakes: number;
  time: number;
  hints: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const difficultyMap: Record<Difficulty, string> = {
  [Difficulty.Easy]: 'Fácil',
  [Difficulty.Medium]: 'Médio',
  [Difficulty.Hard]: 'Difícil',
};

const Stat: React.FC<{ label: string; value: string | number; valueColor?: string }> = ({ label, value, valueColor = 'text-slate-800 dark:text-slate-200' }) => (
  <div className="flex flex-col items-center justify-center p-2">
    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-2xl font-bold ${valueColor}`}>{value}</span>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ difficulty, mistakes, time, hints }) => {
  const displayedDifficulty = difficulty ? difficultyMap[difficulty] : 'N/A';
  const mistakesColor = mistakes > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400';
  const hintsColor = hints > 0 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500';

  return (
    <div className="w-full">
      <div className="grid grid-cols-4">
        <Stat label="Dificuldade" value={displayedDifficulty} />
        <Stat label="Erros" value={mistakes} valueColor={mistakesColor} />
        <Stat label="Dicas" value={hints} valueColor={hintsColor} />
        <Stat label="Tempo" value={formatTime(time)} />
      </div>
    </div>
  );
};
