import { Quicksand } from 'next/font/google';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

const font = Quicksand({ subsets: ['latin'] });

const GridBox = styled.div`
  display: grid;
`;

export default function Home() {
  const [buttons, setButtons] = useState([]);
  const [winner, setWinner] = useState([null, null]);
  const [turn, setTurn] = useState(0);
  const initialTicTacToeState = [[null, null, null], [null, null, null], [null, null, null]];
  const [ticTacToeState, setTicTacToeState] = useState(initialTicTacToeState);

  // Generating buttons using for loops
  useEffect(() => {
    // Helper function to check if all elements in a row are the same and not null
    const rowSame = () => {
      for (let i = 0; i < 3; i++) {
        let flag = true;

        for (let j = 1; j < 3; j++) {
          if (ticTacToeState[i][j] == null || ticTacToeState[i][j] !== ticTacToeState[i][j - 1]) {
            flag = false;
            break;
          }
        }

        if (flag) {
          return i;
        }
      }
      return false;
    };

    // Helper function to check if all elements in a col are the same and not null
    const colSame = () => {
      for (let i = 0; i < 3; i++) {
        let flag = true;

        for (let j = 1; j < 3; j++) {
          if (ticTacToeState[j][i] == null || ticTacToeState[j - 1][i] !== ticTacToeState[j][i]) {
            flag = false;
            break;
          }
        }

        if (flag) {
          return i;
        }
      }
      return false;
    };

    // Helper function to check if all elements in a principle diagonal are the same and not null
    const diagSame = () => {
      let flag = true;

      for (let i = 1; i < 3; i++) {
        if (ticTacToeState[i][i] == null || ticTacToeState[i][i] !== ticTacToeState[i - 1][i - 1]) {
          flag = false;
          break;
        }
      }

      return flag;
    };

    // Helper function to check if all elements in a secondary diagonal are the same and not null
    const secDiagSame = () => {
      let flag = true;

      for (let i = 1; i < 3; i++) {
        if (ticTacToeState[i][2 - i] == null || ticTacToeState[i][2 - i] !== ticTacToeState[i - 1][2 - (i - 1)]) {
          flag = false;
          break;
        }
      }

      return flag;
    };

    // Helper function to check if any row has the same elements and update the game state if won
    const isWon = () => {
      const rWin = rowSame();
      if (rWin !== false) {
        setWinner(ticTacToeState[rWin][0]);
        return true;
      }
      const cWin = colSame();
      if (cWin !== false) {
        setWinner(ticTacToeState[0][cWin]);
        return true;
      }
      const dWin = diagSame();
      if (dWin) {
        setWinner(ticTacToeState[0][0]);
        return true;
      }
      const sdWin = secDiagSame();
      if (sdWin) {
        setWinner(ticTacToeState[0][2]);
        return true;
      }
      return false;
    };

    // Click handler for the buttons
    const click = (e) => {
      if (!isWon()) {
        const value = e.target.value.split('-');
        const i = value[0];
        const j = value[1];

        // Check if the cell is empty before updating
        if (!ticTacToeState[i][j]) {
          // Create a new copy of the ticTacToeState array to avoid directly mutating the state
          const newTicTacToeState = [...ticTacToeState];
          newTicTacToeState[i][j] = turn % 2 === 0 ? 'X' : 'O';
          setTicTacToeState(newTicTacToeState);
          setTurn((prev) => prev + 1);
          isWon();
        }
      }
    };

    // Generate the buttons and store them in the state
    const allButtons = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        allButtons.push(
          <button
            className='w-20 h-20 bg-yellow-100 border-2 border-black border-collapse rounded-lg overflow-hidden font-bold text-4xl'
            value={`${i}-${j}`}
            key={`${i}-${j}`} // Unique key for each button
            onClick={click}
          >
            {!!ticTacToeState[i][j] && ticTacToeState[i][j]}
          </button>
        );
      }
    }
    setButtons([...allButtons]);

    // Dependency array for useEffect should only contain turn
  }, [ticTacToeState, turn]);


  return (
    <main className={`pt-20 flex flex-col items-center gap-8 w-fit m-auto ${font.className}`}>
      <div>
        <h1 className='text-center'>Tic Tac Toe</h1>
      </div>

      <div className={`flex flex-col items-center gap-16 w-fit m-auto`}>
        <GridBox className='grid grid-cols-3 grid-rows-3 w-fit overflow-hidden gap-2'>
          {buttons}
        </GridBox>

        <button className='font-bold text-lg rounded-lg bg-slate-200 hover:bg-slate-900 p-4 pt-[0.5rem] pb-[0.5rem] hover:text-slate-100 self-end' onClick={() => {
          setTicTacToeState([...initialTicTacToeState]);
        }}>
          Reset
        </button>
      </div>
    </main>
  );
}
