import React, { useState, useEffect, useCallback } from 'react';
import { SudokuBoard } from './components/SudokuBoard';
import { NumberPad } from './components/NumberPad';
import { Confetti } from './components/Confetti';
import { Dashboard } from './components/Dashboard';
import { PUZZLES } from './constants';
import type { Board, CellValue, CellPosition, Difficulty } from './types';
import { Difficulty as DifficultyEnum } from './types';
import { InfoModal } from './components/InfoModal';
import { InfoIcon } from './components/icons';

type GameState = 'MENU' | 'PLAYING' | 'SOLVED';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [initialBoard, setInitialBoard] = useState<Board | null>(null);
  const [solution, setSolution] = useState<Board | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [conflictingCells, setConflictingCells] = useState<Set<string>>(new Set());
  const [time, setTime] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);


  useEffect(() => {
    let timerId: number | undefined;
    if (gameState === 'PLAYING') {
      timerId = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(timerId);
    };
  }, [gameState]);

  const startGame = useCallback((selectedDifficulty: Difficulty) => {
    const { puzzle, solution: puzzleSolution } = PUZZLES[selectedDifficulty];
    const deepCopiedPuzzle = puzzle.map(row => [...row]) as Board;
    
    setDifficulty(selectedDifficulty);
    setInitialBoard(deepCopiedPuzzle);
    setBoard(deepCopiedPuzzle);
    setSolution(puzzleSolution);
    setSelectedCell(null);
    setWrongCells(new Set());
    setConflictingCells(new Set());
    setTime(0);
    setHintsRemaining(3);
    setGameState('PLAYING');
  }, []);

  const checkWinCondition = useCallback((currentBoard: Board) => {
    if (!currentBoard) return false;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] === 0) {
          return false;
        }
      }
    }
    return wrongCells.size === 0 && conflictingCells.size === 0;
  }, [wrongCells, conflictingCells]);
  
  // Effect to find conflicting cells
  useEffect(() => {
    if (!board) return;

    const newConflicts = new Set<string>();
    
    const findConflictsInUnit = (unit: {val: CellValue, r: number, c: number}[]) => {
        const counts = new Map<CellValue, {r: number, c: number}[]>();
        unit.forEach(cell => {
            if (cell.val !== 0) {
                if (!counts.has(cell.val)) {
                    counts.set(cell.val, []);
                }
                counts.get(cell.val)!.push({r: cell.r, c: cell.c});
            }
        });

        for (const cells of counts.values()) {
            if (cells.length > 1) {
                cells.forEach(cell => newConflicts.add(`${cell.r}-${cell.c}`));
            }
        }
    };

    // Check rows
    for (let r = 0; r < 9; r++) {
        const rowUnit = board[r].map((val, c) => ({ val, r, c }));
        findConflictsInUnit(rowUnit);
    }

    // Check columns
    for (let c = 0; c < 9; c++) {
        const colUnit = board.map((row, r) => ({ val: row[c], r, c }));
        findConflictsInUnit(colUnit);
    }

    // Check 3x3 boxes
    for (let boxR = 0; boxR < 3; boxR++) {
        for (let boxC = 0; boxC < 3; boxC++) {
            const boxUnit = [];
            for (let r = boxR * 3; r < boxR * 3 + 3; r++) {
                for (let c = boxC * 3; c < boxC * 3 + 3; c++) {
                    boxUnit.push({ val: board[r][c], r, c });
                }
            }
            findConflictsInUnit(boxUnit);
        }
    }

    setConflictingCells(newConflicts);

  }, [board]);


  useEffect(() => {
    if (board && checkWinCondition(board)) {
      setGameState('SOLVED');
      setSelectedCell(null);
    }
  }, [board, checkWinCondition]);

  const handleCellSelect = (row: number, col: number) => {
    if (gameState !== 'PLAYING') return;
    if (initialBoard && initialBoard[row][col] !== 0) {
      return; // Cannot select pre-filled cells
    }
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: CellValue) => {
    if (!selectedCell || !board || !solution) return;

    const { row, col } = selectedCell;
    const newBoard = board.map(r => [...r]) as Board;
    newBoard[row][col] = num;

    const newWrongCells = new Set(wrongCells);
    const cellKey = `${row}-${col}`;

    if (solution[row][col] !== num && num !== 0) {
      newWrongCells.add(cellKey);
    } else {
      newWrongCells.delete(cellKey);
    }

    setBoard(newBoard);
    setWrongCells(newWrongCells);
  };

  const handleErase = () => {
    if (!selectedCell || !board) return;

    const { row, col } = selectedCell;
    if (initialBoard && initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]) as Board;
    newBoard[row][col] = 0;
    
    const newWrongCells = new Set(wrongCells);
    newWrongCells.delete(`${row}-${col}`);

    setBoard(newBoard);
    setWrongCells(newWrongCells);
  };
  
  const handleHint = () => {
    if (hintsRemaining <= 0 || !board || !solution || gameState !== 'PLAYING') return;

    let targetCell: CellPosition | null = null;

    // Priority 1: Use the currently selected cell if it's empty or wrong
    if (selectedCell) {
        const { row, col } = selectedCell;
        if (board[row][col] === 0 || board[row][col] !== solution[row][col]) {
            targetCell = selectedCell;
        }
    }

    // Priority 2: Find the first empty cell if no suitable cell is selected
    if (!targetCell) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] === 0) {
                    targetCell = { row: r, col: c };
                    break;
                }
            }
            if (targetCell) break;
        }
    }

    // If a target cell was found, apply the hint
    if (targetCell) {
        const { row, col } = targetCell;
        const correctValue = solution[row][col];

        const newBoard = board.map(r => [...r]) as Board;
        newBoard[row][col] = correctValue;

        // Remove from wrong cells if it was there
        const newWrongCells = new Set(wrongCells);
        newWrongCells.delete(`${row}-${col}`);

        setBoard(newBoard);
        setWrongCells(newWrongCells);
        setHintsRemaining(prev => prev - 1);
        setSelectedCell(null); // Deselect after hint
    }
};

  const restartGame = () => {
    setGameState('MENU');
    setDifficulty(null);
    setBoard(null);
    setInitialBoard(null);
    setSolution(null);
    setConflictingCells(new Set());
    setTime(0);
    setHintsRemaining(3);
  };
  
  const DifficultyButton: React.FC<{level: Difficulty, label: string, color: string}> = ({level, label, color}) => (
      <button
        onClick={() => startGame(level)}
        className={`w-full md:w-48 text-lg font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200 ${color}`}
      >
        {label}
      </button>
  );

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4 font-sans relative">
      {gameState === 'SOLVED' && <Confetti />}

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

      <button 
        onClick={() => setIsInfoModalOpen(true)}
        className="absolute top-4 right-4 text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
        aria-label="Como jogar"
      >
        <InfoIcon />
      </button>

      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">
          Desafio de Lógica Sudoku
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
          Treine seu cérebro com o clássico quebra-cabeça numérico.
        </p>
      </header>

      {gameState === 'MENU' && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold">Escolha a Dificuldade</h2>
          <div className="flex flex-col md:flex-row gap-4">
             <DifficultyButton level={DifficultyEnum.Easy} label="Fácil" color="bg-green-500 hover:bg-green-600 text-white" />
             <DifficultyButton level={DifficultyEnum.Medium} label="Médio" color="bg-yellow-500 hover:bg-yellow-600 text-white" />
             <DifficultyButton level={DifficultyEnum.Hard} label="Difícil" color="bg-red-500 hover:bg-red-600 text-white" />
          </div>
        </div>
      )}

      {(gameState === 'PLAYING' || gameState === 'SOLVED') && board && (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">
            <Dashboard
                difficulty={difficulty}
                mistakes={wrongCells.size}
                time={time}
                hints={hintsRemaining}
            />
            <main className="my-6">
              <SudokuBoard
                  board={board}
                  initialBoard={initialBoard}
                  onCellSelect={handleCellSelect}
                  selectedCell={selectedCell}
                  wrongCells={wrongCells}
                  conflictingCells={conflictingCells}
              />
            </main>
            <div className="flex flex-col gap-4 w-full">
                {gameState === 'PLAYING' ? (
                <>
                    <NumberPad onNumberSelect={handleNumberInput} onErase={handleErase} />
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleHint}
                            disabled={hintsRemaining === 0}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                        >
                            Dica ({hintsRemaining})
                        </button>
                        <button
                            onClick={restartGame}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors duration-200"
                            >
                            Novo Jogo
                        </button>
                    </div>
                </>
                ) : (
                <div className="text-center bg-green-100 dark:bg-green-900/50 p-6 rounded-xl shadow-lg flex flex-col gap-4">
                    <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">Parabéns!</h2>
                    <p className="text-green-700 dark:text-green-300 mt-2 text-lg">Você resolveu o quebra-cabeça!</p>
                     <button
                        onClick={restartGame}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors duration-200 mt-2"
                        >
                        Jogar Novamente
                    </button>
                </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
