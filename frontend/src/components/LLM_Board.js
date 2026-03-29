import React, { useState } from "react";
import { useEffect } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";
import { LLM_helper } from "../helper/LLM_helper";
import { Disadvantages } from "../helper/Disadvantages";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "/react-game-api");
const PRIMARY_MODEL_ID = "llama-3.3-70b-versatile";
const DEGRADED_MODEL_ID = "llama-3.1-8b-instant";
const PRIMARY_MODEL_LABEL = "Llama 3.3 70B";
const DEGRADED_MODEL_LABEL = "Llama 3.1 8B";

const LLMBoardView = ({ boardArray, pilaArray, yourTurn, onTurnEnd, onWin, isWinner, onLose, isLoser, onLossEnd, isLossEnd }) => {

  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [triggerEffect, setTriggerEffect] = useState(false); // LLM deia egiteko state

  const LLM_makeMove = async (candidateSequences) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/llm-move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          candidateSequences,
          instruction: contentString,
          model: LLM_model
        })
      });

      if (!response.ok) {
        throw new Error("LLM move request failed");
      }

      const data = await response.json();
      completeSelectedTiles(data.move);
    } catch (error) {
      console.error('Error informing LLM move:', error);
    }
  };
  
  useEffect(() => {
    if ((yourTurn && isWinner === null && (isLoser===false || isLoser===null))) { 
      const candidateSequences = calculateSequences();
      LLM_makeMove(candidateSequences);
    }
  }, [yourTurn, triggerEffect]);


  useEffect(() => {
    if (selectedTiles.length > 1) {
      removeSelectedTiles();
    }
  }, [selectedTiles]);


  function completeSelectedTiles(erantzuna) {
    const erantzunaArray = erantzuna.map(coordenada => ({ fila: coordenada[0], columna: coordenada[1] }));
    
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
            if((board.hasLost() && isLoser===false) || board.won===true){
              return;
            }else if (isLoser===true){
              onTurnEnd();
            }else if (isLoser===null){
              onTurnEnd();
            }else if (isLoser===false){
              setTriggerEffect(prev => !prev); // LLM deia egiteko
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

  function calculateSequences(){
    return LLM_helper.encontrarLosTresMasGrandes(board.cells, isMaxPathDegradation);
  }


  const [LLM_model, setLLMModel] = useState(PRIMARY_MODEL_ID);
  const [isMaxPathDegradation, setIsMaxPathDegradation] = useState(false);
  const [contentString, setContentString] = useState(" There are 3 different arrays in here, select just the SECOND LONGEST one of these arrays, and return just the array without any text or explanation. The length of the array is defined by the number of elements in it.");

  const modelDegradation = () => {
    const currentModel = LLM_model;
    const nextModel = currentModel === PRIMARY_MODEL_ID ? DEGRADED_MODEL_ID : PRIMARY_MODEL_ID;
    setLLMModel(nextModel);
  };

  function informationPenalty() {
    const currentContent = contentString;
    const nextContent = currentContent === " There are 3 different arrays in here, select just the SECOND LONGEST one of these arrays, and return just the array without any text or explanation. The length of the array is defined by the number of elements in it. " ? "  There are 3 different arrays in here, select just the SHORTEST one of these arrays, and return just the array without any text or explanation. The length of the array is defined by the number of elements in it. " : "  There are 3 different arrays in here, select just the SECOND LONGEST one of these arrays, and return just the array without any text or explanation. The length of the array is defined by the number of elements in it. ";
    setContentString(nextContent);
  };

  const maxPathDegradation = () => {
    setIsMaxPathDegradation(!isMaxPathDegradation);
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
        <div className="disadvantages-box">
          <Disadvantages onModelDegradation={modelDegradation} onMaxPathDegradation={maxPathDegradation} onInformationPenalty={informationPenalty}/> 
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
      <div className={`turn-indicator ${yourTurn ? 'active' : 'inactive'}`}>
        LLM ({LLM_model === PRIMARY_MODEL_ID ? PRIMARY_MODEL_LABEL : DEGRADED_MODEL_LABEL})
      </div>
      <div className="board">
        {cellsAndTiles}
        <GameOverlay win={isWinner} lose={isLoser} lossEnd={isLossEnd}/>
      </div>
    </div>
  );
};

export default LLMBoardView;
