
import React, { useState, useEffect } from 'react';

import Board from './Board'

const defaults = props => {
  const history = [{
    squares: Array(9).fill(null)
  }]
  return {
    history,
    stepNumber: 0,
    xIsNext: true,
    currentBoard: history[history.length - 1],
    gameState: 'open',
    ...props
  }
}

const Game = props => {

  const [state, setState] = useState(defaults())

  const getPlayerSide = () => {
    return state.xIsNext ? 'X' : 'O'
  }

  const getCurrentBoard = () => {
    return state.history[state.stepNumber]
  }

  const handleClick = index => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const currentBoard = getCurrentBoard();
    const squares = currentBoard.squares.slice();

    if (calculateWinner(squares) || squares[index]) {
      return;
    }

    squares[index] = getPlayerSide();

    console.log("click:", index, squares[index])

    setState({
      ...state,
      history: history.concat([{
        squares,
      }]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext
    });
  }

  useEffect(() => {
    setState({
      ...state,
      currentBoard: getCurrentBoard()
    })
  }, [state.stepNumber])

  const jumpTo = (step) => {
    setState({
      ...state,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  

  // anytime 
  useEffect(() => {
    const {winner, gameState, draw} = state

    const getStatus = () => {
      switch(gameState) {
        case 'open':
          const p = getPlayerSide()
          return `Next Player: ${p}`
        case 'draw':
          return `Draw, Try again! ${draw}`
        case 'ended':
            return `Winner: ${winner}`
        default:
          return 'invalid game state.'
      }
    }

    setState({
      ...state,
      status: getStatus()
    })
  }, [state.winner, state.gameState])
  
  useEffect(() => {
    const winner = calculateWinner(state.currentBoard.squares);
    setState({
      ...state,
      winner
    })
  }, [state.currentBoard])

  console.log(state)

  const moves = state.history.map((step, move) => {
    if(move > state.stepNumber) return;
    const desc = move > 0 ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={state.currentBoard.squares}
          onClick={handleClick}
        />
      </div>
      <div className="game-info">
        <div>{state.status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game