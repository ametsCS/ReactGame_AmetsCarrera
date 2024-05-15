import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BoardView from "./components/Board";
import LLMBoardView from "./components/LLM_Board";
import "./main.scss";
import "./styles.scss";

function App() {

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
    const targetElements = 150; // Número deseado de elementos en la pila

    while (pilaArray1.length < targetElements) {
      const randomIndex = Math.floor(Math.random() * possibleValues.length);
      const randomValue = possibleValues[randomIndex];
      pilaArray1.push(randomValue);
      pilaArray2.push(randomValue);
    }


  return <div className="boards-container">
          <div className="board-wrapper">
            <BoardView boardArray={boardArray} pilaArray={pilaArray1} />
          </div>
          <div className="divider"></div>
          <div className="board-wrapper">
            <LLMBoardView boardArray={boardArray} pilaArray={pilaArray2} />
          </div>
         </div>
         ;
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);