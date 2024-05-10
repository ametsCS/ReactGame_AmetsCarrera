/*import React, { useState } from 'react';

const Groq = require("groq-sdk");

export const Consulta = () => {
    preguntar = async (consulta) => {
        try {
            const groq = new Groq({
                apiKey: process.env.REACT_APP_GROQ_API_KEY,
                dangerouslyAllowBrowser: true
            });
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: consulta
                    }
                ],
                model: "Llama3-70b-8192"
            });
            console.log(chatCompletion.choices[0]?.message?.content || "");
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <input type="text" value={consulta} />
            <button onClick={preguntar}>Enviar</button>
            <div>{respuesta}</div>
        </div>

    );
};

*/