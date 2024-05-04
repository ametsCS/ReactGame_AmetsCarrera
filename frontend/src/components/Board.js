// Board.js
import React, { useState } from "react";
import Cell from "./Cell";
import Tile from "./Tile";
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

  const hexagonRows = [
    [5, -25],
    [6, -50],
    [7, -25],
    [8, 0],
    [9, 25],
    [8, 0],
    [7, -25],
    [6, -50],
    [, -25]
  ];

  const cells = [];
for (let row = 0; row < hexagonRows.length; row++) {
  const [numHexagons, marginLeft] = hexagonRows[row];
  const hexagons = [];
  for (let col = 0; col < numHexagons; col++) {
    // Modify this line to include the number for each hexagon
    hexagons.push(
      <Cell key={row * 9 + col} number={row * numHexagons + col} />);
  }
  cells.push(
    <div className="row" key={row} style={{ marginLeft }}>
      {hexagons}
    </div>
  );
}


  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => {
      return <Tile tile={tile} key={index} />;
    });

  const resetGame = () => {
    setBoard(new Board());
  };

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
        {cells}
        {tiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default BoardView;
