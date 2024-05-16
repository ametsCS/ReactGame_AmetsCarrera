import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import BoardView from "./components/Board";
import LLMBoardView from "./components/LLM_Board";
import "./main.scss";
import "./styles.scss";

function App() {

  const [yourTurn, setYourTurn] = useState(true);
  const [winStatus, setWinStatus] = useState({ board1Won: null, board2Won: null });
  const [loseStatus, setLoseStatus] = useState({ board1Lost: null, board2Lost: null });

  const toggleTurn = () => {
    setYourTurn(prevTurn => !prevTurn);
  };

  const declareWinner = (boardNumber) => {
    if (boardNumber === 1) {
      setWinStatus({ board1Won: true, board2Won: false });
    } else {
      setWinStatus({ board1Won: false, board2Won: true });
    }
  };

  const declareLoser = (boardNumber) => {
    if (boardNumber === 1) {
      setLoseStatus({ board1Lost: true, board2Lost: false });
    } else {
      setLoseStatus({ board1Lost: false, board2Lost: true });
    }
  };

  //sortu board-eko balioak bientzat berdinak
  const possibleValues = [2, 8, 256];
  const boardArray = [];
  
  for (let i = 0; i < 66; i++) {
    const randomIndex = Math.floor(Math.random() * possibleValues.length);
    const randomValue = possibleValues[randomIndex];
    boardArray.push(randomValue);
  }

  //sortu bakoitzarentzat pila bat, baina biak balio berdinekin
    let pilaArray1 = [];
    let pilaArray2 = [];
    const targetElements = 0; // Número deseado de elementos en la pila

    while (pilaArray1.length < targetElements) {
      const randomIndex = Math.floor(Math.random() * possibleValues.length);
      const randomValue = possibleValues[randomIndex];
      pilaArray1.push(randomValue);
      pilaArray2.push(randomValue);
    }

    const onNewGame = () => {
      const root = document.getElementById('root');
      ReactDOM.createRoot(root).render(<App />)
      setYourTurn(true);
    };

  return <div className="boards-container">
          <div className="board-wrapper">
            <BoardView 
              boardArray={boardArray} 
              pilaArray={pilaArray1} 
              yourTurn={yourTurn} 
              onTurnEnd={toggleTurn} 
              onNewGame={onNewGame}        
              onWin={() => declareWinner(1)}
              isWinner={winStatus.board1Won}
              onLose={() => declareLoser(1)}
              isLoser={loseStatus.board1Lost}
            />
          </div>
          <div className="divider"></div>
          <div className="board-wrapper">
            <LLMBoardView 
               boardArray={boardArray} 
               pilaArray={pilaArray2} 
               yourTurn={!yourTurn} 
               onTurnEnd={toggleTurn}   
               onWin={() => declareWinner(2)} 
               isWinner={winStatus.board2Won}    
               onLose={() => declareLoser(2)} 
               isLoser={loseStatus.board2Lost}      
              />
          </div>
         </div>
         ;
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
