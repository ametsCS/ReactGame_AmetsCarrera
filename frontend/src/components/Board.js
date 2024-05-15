import React, { useState } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";

const BoardView = ({ boardArray, pilaArray, yourTurn, onTurnEnd, onNewGame }) => {
  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  //console.log(JSON.stringify(board.cells));

  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [isMouseDown, setIsMouseDown] = useState(false); //mouse klikatuta dagoen edo ez
  const [firstTileValue, setFirstTileValue] = useState(null); //lehenengo tilearen balioa

  const handleTileMouseDown = (tile) => {
    if (!yourTurn || tile.value === 0) return;
      setIsMouseDown(true);
      setSelectedTiles([tile]);
      setFirstTileValue(tile.value);
  };

  const handleTileMouseOver = (tile) => {
    if(!yourTurn) return;
    if (isMouseDown && tile.value === firstTileValue && tile.value !== 0 &&
        !selectedTiles.some(selectedTile => selectedTile.row === tile.row && selectedTile.column === tile.column)) {
      if (selectedTiles.length > 0) {
        const lastTile = selectedTiles[selectedTiles.length - 1];
        if (Math.abs(tile.row - lastTile.row) <= 1 && Math.abs(tile.column - lastTile.column) <= 1) {
          setSelectedTiles((prevTiles) => [...prevTiles, tile]);
        }
      } else {
        setSelectedTiles((prevTiles) => [...prevTiles, tile]);
      }
    }
  };
  
  const handleTileMouseUp = () => {
    if (!yourTurn) return;
    setIsMouseDown(false);
    setFirstTileValue(null); // Reiniciar el valor del primer Tile cuando se suelta el mouse
    
    if (selectedTiles.length > 1) {
      // Establecer markForDeletion en true para los tiles en selectedTiles
      setSelectedTiles((prevSelectedTiles) => {
        return prevSelectedTiles.map((tile) => {
          return { ...tile, markForDeletion: true };
        });
      });

      board.clearMarkedTiles(selectedTiles); // Eliminar los tiles marcados
    }
    setSelectedTiles([]); // Limpiar selectedTiles
    //console.log(board.cells);
    setTimeout(() => {
      onTurnEnd(); // Cambiar el turno
    }, 2500); // Cambia el valor de 3000 al tiempo de retraso deseado en milisegundos
  };
  


  //lehenengo beidatu zutabeak eta gero errenkadak
  const cellsAndTiles = [];
  for (let colIndex = 0; colIndex < board.size+1; colIndex++) {
  const column = [];
  for (let rowIndex = 0; rowIndex < board.size; rowIndex++) {
    const tile = board.cells[rowIndex][colIndex];
    if (tile !== null) {
      column.push(<Tile tile={tile} key={rowIndex * board.size + colIndex} 
                  isSelected={selectedTiles.some(
                    (selectedTile) =>
                      selectedTile.row === tile.row && selectedTile.column === tile.column
                  )}
                  isMouseDown={isMouseDown}
                  onMouseDown={() => handleTileMouseDown(tile)}
                  onMouseOver={() => handleTileMouseOver(tile)}
                  onMouseUp={handleTileMouseUp}
                  />);
    } else {
      column.push(<div key={rowIndex * board.size + colIndex} className="empty-cell" />);
    }
  }
  cellsAndTiles.push(<div key={colIndex}>{column}</div>);
}


  //console.log(board.cells);
  //console.log(cellsAndTiles);
  //console.log(selectedTiles);
  return (
    <div>
      <div className="details-box">
        <div className="resetButton" onClick={onNewGame}>
          NEW GAME
        </div>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
        <div className="objective-box">
          <div className="objective-header">OBJECTIVE</div>
          <div>{board.objective}</div>
        </div>
      </div>
      <div
        className={`turn-indicator ${yourTurn ? 'active' : 'inactive'}`}
      >
        YOUR TURN
      </div>
      <div className="board">
        {cellsAndTiles}
        <GameOverlay board={board} />
      </div>
    </div>
  );
};

export default BoardView;
