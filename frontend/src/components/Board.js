import React, { useState } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";

const BoardView = () => {
  const [board, setBoard] = useState(new Board()); //tableroa sortu

  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [isMouseDown, setIsMouseDown] = useState(false); //mouse klikatuta dagoen edo ez
  const [firstTileValue, setFirstTileValue] = useState(null); //lehenengo tilearen balioa

  const handleTileMouseDown = (tile) => {
    setIsMouseDown(true);
    setSelectedTiles([tile]);
    setFirstTileValue(tile.value); // Almacenar el valor del primer Tile seleccionado
  };

  const handleTileMouseOver = (tile) => {
    if (isMouseDown && tile.value === firstTileValue && !selectedTiles.some(selectedTile => selectedTile.row === tile.row && selectedTile.column === tile.column)) {
      // Verificar si hay algún Tile en selectedTiles
      if (selectedTiles.length > 0) {
        const lastTile = selectedTiles[selectedTiles.length - 1];
        // Verificar si el nuevo Tile es vecino del último Tile en selectedTiles
        if (Math.abs(tile.row - lastTile.row) <= 1 && Math.abs(tile.column - lastTile.column) <= 1) {
          setSelectedTiles((prevTiles) => [...prevTiles, tile]);
        }
      } else {
        // Si no hay ningún Tile en selectedTiles, agregar el nuevo Tile directamente
        setSelectedTiles((prevTiles) => [...prevTiles, tile]);
      }
    }
  };
  
  const handleTileMouseUp = () => {
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


  const resetGame = () => {
    setBoard(new Board());
  };

  //console.log(cellsAndTiles);
  //console.log(selectedTiles);
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
