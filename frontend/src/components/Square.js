import React from 'react'

// Componente Square: representa un cuadrado en el tablero
export function Square({ value }) {
  return (
    // Renderiza un botón con el valor del cuadrado y llama a la función onSquareClick cuando se hace clic
    <button className="hexagono" onClick={() => console.log('Click: '+value)}>
      {value}
    </button>
  );
}
