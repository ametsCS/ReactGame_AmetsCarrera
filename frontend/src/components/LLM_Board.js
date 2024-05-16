import React, { useState } from "react";
import { useEffect } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";
import { Disadvantages } from "../helper/Disadvantages";


const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const LLMBoardView = ({ boardArray, pilaArray, yourTurn, onTurnEnd, onWin, isWinner, onLose, isLoser, onLossEnd, isLossEnd }) => {

  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [LLM_model, setLLMModel] = useState("Llama3-70b-8192");

  const modelDegradation = () => {
    const currentModel = LLM_model;
    const nextModel = currentModel === "Llama3-70b-8192" ? "Gemma-7b-It" : "Llama3-70b-8192";
    setLLMModel(nextModel);
  };

  const gameRules = async () => {
    try {
      const gameRulesData = {
        role: "system",
        content: jsonString + " select one of those 3 arrays and return just the array without text"
      };
      const response = await groq.chat.completions.create({
        messages: [gameRulesData],
        model: LLM_model
      });
      let erantzuna = response.choices[0]?.message?.content || "";
      //console.log(erantzuna);
      completeSelectedTiles(erantzuna);
    } catch (error) {
      console.error('Error informing game rules:', error);
    }
  };
  
  useEffect(() => {
    if (yourTurn && isWinner === null) {
      gameRules();
    }
  }, [yourTurn]);


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
    //console.log(selectedTiles); 
    board.clearMarkedTiles(selectedTiles); 
    setTimeout(() => {
        setSelectedTiles([]);
        emaitza();
        setTimeout(() => {
            if (isLoser!==false){
              onTurnEnd();
            }else{
              tresMasGrandes = encontrarLosTresMasGrandes(tablero);
              jsonString = tresMasGrandes.map(JSON.stringify).join('\t');
              gameRules();
            }
        }, 2000);
    }, 3000);
  }
    
  function emaitza(){
    if (board.hasWon()) {
      onWin();
    }else if (board.hasLost() && isLoser===false) {
      onLossEnd();
    }
    else if (board.hasLost()) {
      onLose();
    }
  };


  let tablero = board.cells;

  function encontrarLosTresMasGrandes(tablero) {
    const secuencias = [];
    const visitados = new Set();

    for (let fila = 0; fila < tablero.length; fila++) {
      for (let columna = 0; columna < tablero[fila].length; columna++) {
        if (tablero[fila][columna] !== null && tablero[fila][columna].value !== 0 && !visitados.has(`${fila},${columna}`)) {
          const secuenciaActual = [];
          encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual);
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
    const direcciones = [
      [-1, 0], [1, 0], // Vertical
      [0, -1], [0, 1], // Horizontal
      [-1, 1], [1, -1] // Diagonal
    ];
    const vecinos = [];
    direcciones.forEach(([df, dc]) => {
      const nuevoFila = fila + df;
      const nuevoColumna = columna + dc;
      if (nuevoFila >= 0 && nuevoFila < tablero.length && nuevoColumna >= 0 && nuevoColumna < tablero[0].length) {
        vecinos.push([nuevoFila, nuevoColumna]);
      }
    });
    return vecinos;
  }

  function encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual) {
    const valor = tablero[fila][columna].value;
    secuenciaActual.push([fila, columna]);
    visitados.add(`${fila},${columna}`);
    
    const vecinosDisponibles = vecinos(tablero, fila, columna);
    vecinosDisponibles.forEach(([vecinoFila, vecinoColumna]) => {
      if (tablero[vecinoFila][vecinoColumna] !== null && tablero[vecinoFila][vecinoColumna].value === valor && tablero[vecinoFila][vecinoColumna].value !== 0 && !visitados.has(`${vecinoFila},${vecinoColumna}`)) {
        encontrarSecuencia(tablero, vecinoFila, vecinoColumna, visitados, secuenciaActual);
      }
    });
  }

  function secuenciaEsContinua(secuencia, tablero) {
    if (secuencia.length < 2) return true;
    const visitados = new Set(secuencia.map(([fila, columna]) => `${fila},${columna}`));
    for (let i = 0; i < secuencia.length; i++) {
      const [fila, columna] = secuencia[i];
      const tieneVecino = vecinos(tablero, fila, columna).some(([vecinoFila, vecinoColumna]) => visitados.has(`${vecinoFila},${vecinoColumna}`));
      if (!tieneVecino) {
        return false;
      }
    }
    return true;
  }

  let tresMasGrandes = encontrarLosTresMasGrandes(tablero);
  let jsonString = tresMasGrandes.map(JSON.stringify).join('\t');
  //console.log(jsonString);



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
  

  //console.log(isWinner);
  //console.log(board.cells);
  //console.log(cellsAndTiles);
  //console.log(selectedTiles);
  return (
    <div>
      <div className="details-box">
      <div className="disadvantages-box">
        <Disadvantages onModelDegradation={modelDegradation}/> 
      </div>
      <div className={`score-box ${board.won ? 'score-box-win' : board.lost ? 'score-box-lose' : ''}`}>
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
        <div className={`objective-box ${board.won ? 'objective-box-win' : board.lost ? 'objective-box-lose' : ''}`}>
          <div className="objective-header">OBJECTIVE</div>
          <div>{board.objective}</div>
        </div>
      </div>
      <div
        className={`turn-indicator ${yourTurn ? 'active' : 'inactive'}`}
      >
        LLM ({LLM_model})
      </div>
      <div className="board">
        {cellsAndTiles}
        <GameOverlay win={isWinner} lose={isLoser} lossEnd={isLossEnd}/>
      </div>
    </div>
  );
};

export default LLMBoardView;