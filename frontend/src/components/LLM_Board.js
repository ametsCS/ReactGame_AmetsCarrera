import React, { useState } from "react";
import { useEffect } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";

const game_Rules = process.env.GAME_RULES;

const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const LLMBoardView = ({ boardArray, pilaArray }) => {

  /* async function gameRules() {
    try {
      const gameRules = {
        role: "system", 
        content: "[[null,null,null,{value:8,row:0,column:3,markForDeletion:false,mergedInto:null,new:false},{value:8,row:0,column:4,markForDeletion:false,mergedInto:null,new:false},{value:2,row:0,column:5,markForDeletion:false,mergedInto:null,new:false},{value:256,row:0,column:6,markForDeletion:false,mergedInto:null,new:false},null,null,null],[null,null,{value:2,row:1,column:2,markForDeletion:false,mergedInto:null,new:false},{value:2,row:1,column:3,markForDeletion:false,mergedInto:null,new:false},{value:8,row:1,column:4,markForDeletion:false,mergedInto:null,new:false},{value:8,row:1,column:5,markForDeletion:false,mergedInto:null,new:false},{value:8,row:1,column:6,markForDeletion:false,mergedInto:null,new:false},{value:8,row:1,column:7,markForDeletion:false,mergedInto:null,new:false},null,null],[null,{value:8,row:2,column:1,markForDeletion:false,mergedInto:null,new:false},{value:8,row:2,column:2,markForDeletion:false,mergedInto:null,new:false},{value:2,row:2,column:3,markForDeletion:false,mergedInto:null,new:false},{value:2,row:2,column:4,markForDeletion:false,mergedInto:null,new:false},{value:8,row:2,column:5,markForDeletion:false,mergedInto:null,new:false},{value:8,row:2,column:6,markForDeletion:false,mergedInto:null,new:false},{value:2,row:2,column:7,markForDeletion:false,mergedInto:null,new:false},{value:8,row:2,column:8,markForDeletion:false,mergedInto:null,new:false},null],[{value:256,row:3,column:0,markForDeletion:false,mergedInto:null,new:false},{value:2,row:3,column:1,markForDeletion:false,mergedInto:null,new:false},{value:256,row:3,column:2,markForDeletion:false,mergedInto:null,new:false},{value:2,row:3,column:3,markForDeletion:false,mergedInto:null,new:false},{value:256,row:3,column:4,markForDeletion:false,mergedInto:null,new:false},{value:2,row:3,column:5,markForDeletion:false,mergedInto:null,new:false},{value:256,row:3,column:6,markForDeletion:false,mergedInto:null,new:false},{value:256,row:3,column:7,markForDeletion:false,mergedInto:null,new:false},{value:256,row:3,column:8,markForDeletion:false,mergedInto:null,new:false},{value:2,row:3,column:9,markForDeletion:false,mergedInto:null,new:false}],[{value:2,row:4,column:0,markForDeletion:false,mergedInto:null,new:false},{value:8,row:4,column:1,markForDeletion:false,mergedInto:null,new:false},{value:256,row:4,column:2,markForDeletion:false,mergedInto:null,new:false},{value:256,row:4,column:3,markForDeletion:false,mergedInto:null,new:false},{value:256,row:4,column:4,markForDeletion:false,mergedInto:null,new:false},{value:8,row:4,column:5,markForDeletion:false,mergedInto:null,new:false},{value:2,row:4,column:6,markForDeletion:false,mergedInto:null,new:false},{value:8,row:4,column:7,markForDeletion:false,mergedInto:null,new:false},{value:2,row:4,column:8,markForDeletion:false,mergedInto:null,new:false},{value:8,row:4,column:9,markForDeletion:false,mergedInto:null,new:false}],[{value:256,row:5,column:0,markForDeletion:false,mergedInto:null,new:false},{value:8,row:5,column:1,markForDeletion:false,mergedInto:null,new:false},{value:8,row:5,column:2,markForDeletion:false,mergedInto:null,new:false},{value:8,row:5,column:3,markForDeletion:false,mergedInto:null,new:false},{value:2,row:5,column:4,markForDeletion:false,mergedInto:null,new:false},{value:2,row:5,column:5,markForDeletion:false,mergedInto:null,new:false},{value:2,row:5,column:6,markForDeletion:false,mergedInto:null,new:false},{value:8,row:5,column:7,markForDeletion:false,mergedInto:null,new:false},{value:256,row:5,column:8,markForDeletion:false,mergedInto:null,new:false},{value:256,row:5,column:9,markForDeletion:false,mergedInto:null,new:false}],[null,{value:256,row:6,column:1,markForDeletion:false,mergedInto:null,new:false},{value:256,row:6,column:2,markForDeletion:false,mergedInto:null,new:false},{value:256,row:6,column:3,markForDeletion:false,mergedInto:null,new:false},{value:2,row:6,column:4,markForDeletion:false,mergedInto:null,new:false},{value:8,row:6,column:5,markForDeletion:false,mergedInto:null,new:false},{value:8,row:6,column:6,markForDeletion:false,mergedInto:null,new:false},{value:256,row:6,column:7,markForDeletion:false,mergedInto:null,new:false},{value:2,row:6,column:8,markForDeletion:false,mergedInto:null,new:false},null],[null,null,{value:2,row:7,column:2,markForDeletion:false,mergedInto:null,new:false},{value:8,row:7,column:3,markForDeletion:false,mergedInto:null,new:false},{value:8,row:7,column:4,markForDeletion:false,mergedInto:null,new:false},{value:2,row:7,column:5,markForDeletion:false,mergedInto:null,new:false},{value:2,row:7,column:6,markForDeletion:false,mergedInto:null,new:false},{value:256,row:7,column:7,markForDeletion:false,mergedInto:null,new:false},null,null],[null,null,null,{value:2,row:8,column:3,markForDeletion:false,mergedInto:null,new:false},{value:2,row:8,column:4,markForDeletion:false,mergedInto:null,new:false},{value:256,row:8,column:5,markForDeletion:false,mergedInto:null,new:false},{value:2,row:8,column:6,markForDeletion:false,mergedInto:null,new:false},null,null,null]] este es el tablero de un juego de unir numeros. Quiero que generes un array de respuesta donde devuelvas la mayor secuencia de numeros vecinos que hay en el tablero. Los numeros son vecinos cuando estan a a una columna o row de distancia tanto vertical, horizontal o diagonalmente. Devuelve la sequencia"
      };
      const response = await groq.chat.completions.create({
        messages: [gameRules],
        model: "Llama3-70b-8192"
      });
      console.log(response.choices[0]?.message?.content || "");
    } catch (error) {
      console.error('Error informing game rules:', error);
    }
  }

  async function makeMove(boardState) {
    try {
      const boardStateMessage = {
        role: "user",
        content: JSON.stringify(boardState) // Pasamos el estado del tablero como un string JSON
      };
      const response = await groq.chat.completions.create({
        messages: [boardStateMessage],
        model: "Llama3-70b-8192"
      });
      const move = response.choices[0]?.message?.content || "";
      console.log('Move:', move);
      return move;
    } catch (error) {
      console.error('Error making move:', error);
    }
  }

  function applyMove(boardState, move) {
    // Primero, copiamos el estado del tablero para no mutar el estado original
    let newBoardState = JSON.parse(JSON.stringify(boardState));

    // Luego, marcamos los tiles para la eliminación basándonos en el movimiento
    // Suponemos que el movimiento es una lista de tiles a eliminar
    for (let tile of move) {
      let tileInBoard = newBoardState.find(t => t.id === tile.id);
      if (tileInBoard) {
        tileInBoard.markForDeletion = true;
      }
    }

    // Finalmente, limpiamos los tiles marcados para la eliminación
    newBoardState = newBoardState.filter(tile => !tile.markForDeletion);

    return newBoardState;
  }

  useEffect(() => {
    gameRules();

    async function fetchData(content) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: content // Pasamos el contenido como atributo
            }
          ],
          model: "Llama3-70b-8192"
        });
        console.log(chatCompletion.choices[0]?.message?.content || "");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    // Llamamos a fetchData con el contenido del mensaje deseado
    //fetchData("Explain the importance of fast language models");
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  const handleEvent = async () => {
    const move = await makeMove(board);
    // Aquí puedes hacer algo con el movimiento que recibiste, como aplicarlo al estado del tablero
    const newBoardState = applyMove(board, move);
    setBoard(newBoardState);
  }; */

  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  //console.log(JSON.stringify(board.cells));
  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [isMouseDown, setIsMouseDown] = useState(false); //mouse klikatuta dagoen edo ez
  const [firstTileValue, setFirstTileValue] = useState(null); //lehenengo tilearen balioa

  const handleTileMouseDown = (tile) => {
    if (tile.value !== 0) {
      setIsMouseDown(true);
      setSelectedTiles([tile]);
      setFirstTileValue(tile.value);
    }
  };
  
  const handleTileMouseOver = (tile) => {
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
    setBoard(new Board(boardArray, pilaArray));
  };

  //console.log(board.cells);
  //console.log(cellsAndTiles);
  //console.log(selectedTiles);
  return (
    <div>
      <div className="details-box">
        <div className="resetButton" onClick={resetGame}>
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
      <div className="board">
          {cellsAndTiles}
        <GameOverlay onRestart={resetGame} board={board} />
      </div>
    </div>
  );
};

export default LLMBoardView;