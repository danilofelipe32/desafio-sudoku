
import type { Board } from './types';
import { Difficulty } from './types';

type PuzzleData = {
  puzzle: Board;
  solution: Board;
};

const parseBoard = (str: string): Board => {
    const board: Board = [];
    for (let i = 0; i < 9; i++) {
        const rowStr = str.substring(i * 9, (i + 1) * 9);
        const row = rowStr.split('').map(char => parseInt(char, 10)) as (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)[];
        board.push(row);
    }
    return board;
};


export const PUZZLES: Record<Difficulty, PuzzleData> = {
  [Difficulty.Easy]: {
    puzzle: parseBoard(
      '530070000600195000098000060800060003400803001700020006060000280000419005000080079'
    ),
    solution: parseBoard(
      '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
    ),
  },
  [Difficulty.Medium]: {
    puzzle: parseBoard(
      '003020600900305001001806400008102900700000008006708200002609500800203009005010300'
    ),
    solution: parseBoard(
      '483921657967345821251876493548132976729564138136798245372689514814253769695417382'
    ),
  },
  [Difficulty.Hard]: {
    puzzle: parseBoard(
      '800000000003600000070090200050007000000045700000100030001000068008500010090000400'
    ),
    solution: parseBoard(
      '812753649943682175675491283154237896369845721287169534521974368438526917796318452'
    ),
  },
};
