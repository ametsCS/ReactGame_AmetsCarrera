import React, { useState } from "react";
import { useEffect } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";


const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const LLMBoardView = ({ boardArray, pilaArray }) => {

  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak

  useEffect(() => {
    async function gameRules() {
        try {
            const gameRules = {
                role: "system",
                content: jsonString + " select one of those 3 arrays and return just the array without text"
            };
            const response = await groq.chat.completions.create({
                messages: [gameRules],
                model: "Llama3-70b-8192"
            });
            let erantzuna = response.choices[0]?.message?.content || "";
            console.log(erantzuna);
            completeSelectedTiles(erantzuna);
        } catch (error) {
            console.error('Error informing game rules:', error);
        }
    }

    gameRules();
}, []);

useEffect(() => {
  if (selectedTiles.length > 1) {
    removeSelectedTiles();
  }
}, [selectedTiles]);


  function completeSelectedTiles(erantzuna) {
    //sortu array bat LLM-an emaitzakin
    let erantzunaArray = JSON.parse(erantzuna).map(coordenada => ({ fila: coordenada[0], columna: coordenada[1] }));
    
    setSelectedTiles(prevSelectedTiles => {
      // Obtener una copia de los valores actuales en selectedTiles
      const updatedSelectedTiles = [...prevSelectedTiles];
        erantzunaArray.forEach(casilla => {
              const valorCasilla = board.cells[casilla.fila][casilla.columna];
              updatedSelectedTiles.push(valorCasilla);
          });
        return updatedSelectedTiles;
    });
  } 

  function removeSelectedTiles() {
    console.log(selectedTiles); 
    board.clearMarkedTiles(selectedTiles); 
    setTimeout(() => {
        setSelectedTiles([]);
    }, 3000);
}
    
    
let tablero = board.cells;

function encontrarLosTresMasGrandes(tablero) {
  const secuencias = [];
  const visitados = new Set();

  for (let fila = 0; fila < tablero.length; fila++) {
      for (let columna = 0; columna < tablero[fila].length; columna++) {
          if (tablero[fila][columna] !== null && !visitados.has(`${fila},${columna}`)) {
              const secuenciaActual = [];
              encontrarSecuencia(tablero, fila, columna, null, visitados, secuenciaActual, []);
              if (secuenciaEsContinua(secuenciaActual, tablero)) {
                  secuencias.push(secuenciaActual);
              }
          }
      }
  }

  secuencias.sort((a, b) => b.length - a.length);
  return secuencias.slice(0, 3);
}

function vecinos(tablero, fila, columna) {
  const vecinos = [];
  if (tablero && tablero.length > 0 && tablero[0] && tablero[0].length > 0) {
      for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
              if (i === 0 && j === 0) continue;
              const vecinoFila = fila + i;
              const vecinoColumna = columna + j;
              if (vecinoFila >= 0 && vecinoFila < tablero.length && vecinoColumna >= 0 && vecinoColumna < tablero[0].length) {
                  vecinos.push([vecinoFila, vecinoColumna]);
              }
          }
      }
  }
  return vecinos;
}

function encontrarSecuencia(tablero, fila, columna, direccionAnterior, visitados, secuenciaActual, movimientosPrevios) {
  if (tablero[fila][columna] !== null && !visitados.has(`${fila},${columna}`)) {
      const valor = tablero[fila][columna].value;
      secuenciaActual.push([fila, columna]);
      visitados.add(`${fila},${columna}`);
      const vecinosDisponibles = vecinos(tablero, fila, columna).filter(vecino => !movimientosPrevios.includes(`${vecino[0]},${vecino[1]}`));
      for (const [vecinoFila, vecinoColumna] of vecinosDisponibles) {
          if (tablero[vecinoFila][vecinoColumna] !== null && tablero[vecinoFila][vecinoColumna].value === valor && (!direccionAnterior || (vecinoFila - fila === direccionAnterior[0] && vecinoColumna - columna === direccionAnterior[1]))) {
              encontrarSecuencia(tablero, vecinoFila, vecinoColumna, [vecinoFila - fila, vecinoColumna - columna], visitados, secuenciaActual, [...movimientosPrevios, `${fila},${columna}`]);
          }
      }
  }
}

function secuenciaEsContinua(secuencia, tablero) {
  const visitados = new Set();
  for (let i = 0; i < secuencia.length; i++) {
      const [fila, columna] = secuencia[i];
      const clave = `${fila},${columna}`;
      if (visitados.has(clave) || !vecinos(tablero, fila, columna).some(vecino => secuencia.some(tile => tile[0] === vecino[0] && tile[1] === vecino[1]))) {
          return false;
      }
      visitados.add(clave);
  }
  return true;
}

// Encontrar las tres secuencias más grandes
const tresMasGrandes = encontrarLosTresMasGrandes(tablero);
const jsonString = tresMasGrandes.map(JSON.stringify).join('\t');
console.log(jsonString);



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