import React from 'react';
import { EraseIcon } from './icons';
import type { CellValue } from '../types';

interface NumberPadProps {
  onNumberSelect: (num: CellValue) => void;
  onErase: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberSelect, onErase }) => {
  const numbers: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-xl shadow-lg">
        <div className="flex justify-center items-center gap-1 sm:gap-1.5 md:gap-2">
        {numbers.map((num) => (
            <button
            key={num}
            onClick={() => onNumberSelect(num)}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center text-base sm:text-xl md:text-2xl font-semibold rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 hover:bg-sky-200 dark:hover:bg-sky-800 transition-colors"
            >
            {num}
            </button>
        ))}
        <button
            onClick={onErase}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 flex items-center justify-center text-base sm:text-xl md:text-2xl font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
            <EraseIcon />
        </button>
        </div>
    </div>
  );
};