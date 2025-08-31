import React from 'react';
import type { Board, CellPosition } from '../types';

interface SudokuBoardProps {
  board: Board;
  initialBoard: Board | null;
  onCellSelect: (row: number, col: number) => void;
  selectedCell: CellPosition | null;
  wrongCells: Set<string>;
  conflictingCells: Set<string>;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({ board, initialBoard, onCellSelect, selectedCell, wrongCells, conflictingCells }) => {
  const getCellClasses = (row: number, col: number): string => {
    const classes = ['w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-mono cursor-pointer transition-colors duration-150'];
    const isInitial = initialBoard && initialBoard[row][col] !== 0;
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col;
    const isInSameRowCol = selectedCell && !isSelected && (selectedCell.row === row || selectedCell.col === col);
    const isInSameBox = selectedCell && !isSelected && (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && Math.floor(selectedCell.col / 3) === Math.floor(col / 3));
    const isWrong = wrongCells.has(`${row}-${col}`);
    const isConflicting = conflictingCells.has(`${row}-${col}`);

    // Base cell style
    classes.push('bg-white dark:bg-slate-900/70');

    // Highlighting
    if (isSelected) {
      classes.push('bg-sky-200 dark:bg-sky-900 ring-2 ring-sky-500 z-10');
    } else if (isInSameRowCol || isInSameBox) {
      classes.push('bg-sky-50 dark:bg-sky-900/50');
    }
    
    // Text color
    if (isInitial) {
        classes.push('text-slate-800 dark:text-slate-200 font-bold');
    } else {
        classes.push('text-blue-600 dark:text-blue-400');
    }

    // Conflicting cell style
    if (isConflicting && !isInitial) {
        classes.push('!bg-yellow-200 dark:!bg-yellow-700/60');
    }

    // Wrong cell style (takes precedence over conflicting)
    if(isWrong && !isInitial) {
        classes.push('!bg-red-200 dark:!bg-red-800/80 !text-red-700 dark:!text-red-300');
    }

    // Grid lines
    const isThickBottom = row % 3 === 2 && row !== 8;
    const isThickRight = col % 3 === 2 && col !== 8;

    if (isThickBottom) {
      // Thicker lines for the major grid divisions
      classes.push('border-b-2 border-b-slate-500 dark:border-b-slate-400');
    } else if (row !== 8) {
      // Thin light gray lines for other internal divisions
      classes.push('border-b border-slate-200 dark:border-slate-700');
    }

    if (isThickRight) {
      // Thicker lines for the major grid divisions
      classes.push('border-r-2 border-r-slate-500 dark:border-r-slate-400');
    } else if (col !== 8) {
      // Thin light gray lines for other internal divisions
      classes.push('border-r border-slate-200 dark:border-slate-700');
    }

    return classes.join(' ');
  };

  return (
    <div className="grid grid-cols-9 border-2 border-slate-500 dark:border-slate-400 rounded-lg shadow-2xl overflow-hidden">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={getCellClasses(rowIndex, colIndex)}
            onClick={() => onCellSelect(rowIndex, colIndex)}
            aria-label={`Célula na linha ${rowIndex + 1}, coluna ${colIndex + 1}, valor ${cell === 0 ? 'vazio' : cell}`}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onCellSelect(rowIndex, colIndex);
              }
            }}
          >
            {cell !== 0 ? cell : ''}
          </div>
        ))
      )}
    </div>
  );
};