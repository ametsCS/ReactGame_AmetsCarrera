export class LLM_helper {

    static vecinos(tablero, fila, columna) {
        const direcciones = [
          [-1, 0], [1, 0], // Vertical
          [0, -1], [0, 1], // Horizontal
          [-1, 1], [1, -1], 
          [-1, -1], [1, 1] // Diagonal
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
    
      static encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual, isMaxPathDegradation) {
        const valor = tablero[fila][columna].value;
        secuenciaActual.push([fila, columna]);
        visitados.add(`${fila},${columna}`);
        
        const vecinosDisponibles = this.vecinos(tablero, fila, columna);
        vecinosDisponibles.forEach(([vecinoFila, vecinoColumna]) => {
          if (tablero[vecinoFila][vecinoColumna] !== null && tablero[vecinoFila][vecinoColumna].value === valor && !visitados.has(`${vecinoFila},${vecinoColumna}`)) {
            this.encontrarSecuencia(tablero, vecinoFila, vecinoColumna, visitados, secuenciaActual, isMaxPathDegradation);
          }
        });
        //Gatazka 2
        if (isMaxPathDegradation && secuenciaActual.length > 8) {
          secuenciaActual.pop();
        }
      }
    
      static secuenciaEsContinua(secuencia, tablero) {
        if (secuencia.length === 0) return false;
    
        const visitados = new Set();
        const queue = [secuencia[0]]; // Iniciamos la búsqueda desde el primer elemento de la secuencia
        visitados.add(`${secuencia[0][0]},${secuencia[0][1]}`);
    
        while (queue.length > 0) {
          const [fila, columna] = queue.shift();
          const vecinosDisponibles = this.vecinos(tablero, fila, columna);
    
          vecinosDisponibles.forEach(([vecinoFila, vecinoColumna]) => {
            if (tablero[vecinoFila][vecinoColumna] !== null && 
                tablero[vecinoFila][vecinoColumna].value === tablero[fila][columna].value && 
                !visitados.has(`${vecinoFila},${vecinoColumna}`) &&
                secuencia.some(([sf, sc]) => sf === vecinoFila && sc === vecinoColumna)) {
              visitados.add(`${vecinoFila},${vecinoColumna}`);
              queue.push([vecinoFila, vecinoColumna]);
            }
          });
        }
    
        return visitados.size === secuencia.length;
      }
    
      static encontrarLosTresMasGrandes(tablero, isMaxPathDegradation) {
        const secuencias = [];
        const visitados = new Set();
    
        for (let fila = 0; fila < tablero.length; fila++) {
          for (let columna = 0; columna < tablero[fila].length; columna++) {
            if (tablero[fila][columna] !== null && tablero[fila][columna].value !== 0 && !visitados.has(`${fila},${columna}`)) {
              const secuenciaActual = [];
              this.encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual, isMaxPathDegradation);
              if (this.secuenciaEsContinua(secuenciaActual, tablero)) {
                secuencias.push(secuenciaActual);
              }
            }
          }
        }
    
        secuencias.sort((a, b) => b.length - a.length);
        return secuencias.slice(0, 3);
      }
  }