import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import BoardView from "./components/Board";
import "./main.scss";
import "./styles.scss";
//import { Consulta } from './components/Consulta';

const Groq = require("groq-sdk");

function App() {
  useEffect(() => {
    async function fetchData() {
      try {
        const groq = new Groq({
          apiKey: process.env.REACT_APP_GROQ_API_KEY,
          dangerouslyAllowBrowser: true
        });
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: "Explain the importance of fast language models"
            }
          ],
          model: "Llama3-70b-8192"
        });
        //console.log(chatCompletion.choices[0]?.message?.content || "");    JARRI BERRIZ
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  /**   
  useEffect(() => {
  async function fetchData(content) {
    try {
      const groq = new Groq({
        apiKey: process.env.REACT_APP_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });
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
  fetchData("Explain the importance of fast language models");
}, []); // Empty dependency array ensures that this effect runs only once, similar to componentDidMount

  */

  return <BoardView />;
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);
