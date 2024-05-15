import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BoardView from "./components/Board";
import LLMBoardView from "./components/LLM_Board";
import "./main.scss";
import "./styles.scss";

function App() {

  return <div className="boards-container">
          <div className="board-wrapper">
            <BoardView />
          </div>
          <div className="divider"></div>
          <div className="board-wrapper">
            <LLMBoardView />
          </div>
         </div>
         ;
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
