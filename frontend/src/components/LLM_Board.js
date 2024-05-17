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
    if ((yourTurn && isWinner === null && (isLoser===false || isLoser===null)) || triggerEffect) {
      calculateSequences();
      LLM_makeMove();
      setTriggerEffect(false); 
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
            if(isLossEnd===true || board.won===true){
              return;
            }else if (isLoser===true){
              onTurnEnd();
            }else if (isLoser===null){
              onTurnEnd();
            }else if (isLoser===false){
              setTriggerEffect(true); // LLM deia egiteko
            }
        }, 2000);
    }, 3000);
  }
    
  function emaitza(){
    if (board.hasWon()) {
      onWin();
    }else if (board.hasLost() && isLoser===false) {
      onLossEnd();
      onLose();
    }
    else if (board.hasLost()) {
      onLose();
    }
  };

  function calculateSequences(){
    let tresMasGrandes = LLM_helper.encontrarLosTresMasGrandes(board.cells);
    jsonString = tresMasGrandes.map(JSON.stringify).join('\t');
    //console.log(jsonString);
  }


  const [LLM_model, setLLMModel] = useState("Llama3-70b-8192");

  const modelDegradation = () => {
    const currentModel = LLM_model;
    const nextModel = currentModel === "Llama3-70b-8192" ? "Gemma-7b-It" : "Llama3-70b-8192";
    setLLMModel(nextModel);
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
          <Disadvantages onModelDegradation={modelDegradation}/> 
        </div>
        <div className={`score-box ${isWinner ? 'score-box-win' : isLoser ? 'score-box-lose' : ''}`}>
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
        <div className={`objective-box ${isWinner ? 'objective-box-win' : isLoser ? 'objective-box-lose' : ''}`}>
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