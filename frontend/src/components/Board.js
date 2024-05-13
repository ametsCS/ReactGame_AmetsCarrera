import React, { useState } from "react";
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import useEvent from "../hooks/useEvent";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());

  const handleKeyDown = (event) => {
    if (board.hasWon()) {
      return;
    }

    if (event.keyCode >= 37 && event.keyCode <= 40) {
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      setBoard(newBoard);
    }
  };

  useEvent("keydown", handleKeyDown);

  const cellsAndTiles = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex}>
        {row.map((col, colIndex) => {
          if (col !== null) {
              return (
                <React.Fragment key={rowIndex * board.size + colIndex}>
                  {/* <Cell key={rowIndex * board.size + colIndex} /> */} 
                  <Tile tile={col} />
                </React.Fragment>
              );
          } else {
            return <div key={rowIndex * board.size + colIndex} className="empty-cell" />;
          }
        })}
      </div>
    );
  });

 /*  const tiles = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex}>
        {row.map((col, colIndex) => {
          if (col !== null && col.value !== 0) {
            return <Tile tile={col} key={rowIndex * board.size + colIndex} />;
          } else {
            return <div key={rowIndex * board.size + colIndex} className="empty-tile" />;
          }
        })}
      </div>
    );
  }); */

  const resetGame = () => {
    setBoard(new Board());
  };

  console.log(cellsAndTiles);
  return (
    <div>
      <div className="details-box">
        <div className="resetButton" onClick={resetGame}>
          new game
        </div>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
          {cellsAndTiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default BoardView;
