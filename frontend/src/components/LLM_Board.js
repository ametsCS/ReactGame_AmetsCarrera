import React, { useState } from "react";
import { useEffect } from "react";
import Tile from "./Tile";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";
import { LLM_helper } from "../helper/LLM_helper";
import { Disadvantages } from "../helper/Disadvantages";


const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const LLMBoardView = ({ boardArray, pilaArray, yourTurn, onTurnEnd, onWin, isWinner, onLose, isLoser, onLossEnd, isLossEnd }) => {

  const [board, setBoard] = useState(new Board(boardArray, pilaArray)); //tableroa sortu
  const [selectedTiles, setSelectedTiles] = useState([]); //hautatutako tileak
  const [triggerEffect, setTriggerEffect] = useState(false); // LLM deia egiteko state

  let jsonString = "";

  const LLM_makeMove = async () => {
    try {
      const makeMoveData = {
        role: "system",
        content: jsonString + contentString
      };
      const response = await groq.chat.completions.create({
        messages: [makeMoveData],
        model: LLM_model
      });
      let erantzuna = response.choices[0]?.message?.content || "";
      //console.log(erantzuna);
      completeSelectedTiles(erantzuna);
    } catch (error) {
      console.error('Error informing LLM move:', error);
    }
  };
  
  useEffect(() => {
    if ((yourTurn && isWinner === null && (isLoser===false || isLoser===null))) { 
      calculateSequences();
      LLM_makeMove();
    }
  }, [yourTurn, triggerEffect]);


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
    let tresMasGrandes = LLM_helper.encontrarLosTresMasGrandes(board.cells, isMaxPathDegradation);
    jsonString = tresMasGrandes.map(JSON.stringify).join('\t');
    //console.log(jsonString);
  }


  const [LLM_model, setLLMModel] = useState("Llama3-70b-8192");
  const [isMaxPathDegradation, setIsMaxPathDegradation] = useState(false);
  const [contentString, setContentString] = useState(" select one of those 3 arrays, the biggest one, and return just the array without text ");

  const modelDegradation = () => {
    const currentModel = LLM_model;
    const nextModel = currentModel === "Llama3-70b-8192" ? "Gemma-7b-It" : "Llama3-70b-8192";
    setLLMModel(nextModel);
  };

  function informationPenalty() {
    const currentContent = contentString;
    const nextContent = currentContent === " select one of those 3 arrays, the biggest one, and return just the array without text " ? " select one of those 3 arrays, the smallest one, and return just the array without text " : " select one of those 3 arrays, the biggest one, and return just the array without text ";
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