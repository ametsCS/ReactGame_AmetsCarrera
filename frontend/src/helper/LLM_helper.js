export class LLM_helper {

    static vecinos(tablero, fila, columna) {
      const direcciones = [
        [-1, 0], [1, 0], // Vertical
        [0, -1], [0, 1], // Horizontal
        [-1, 1], [1, -1] // Diagonal
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
  
    static encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual) {
      const valor = tablero[fila][columna].value;
      secuenciaActual.push([fila, columna]);
      visitados.add(`${fila},${columna}`);
      
      const vecinosDisponibles = this.vecinos(tablero, fila, columna);
      vecinosDisponibles.forEach(([vecinoFila, vecinoColumna]) => {
        if (tablero[vecinoFila][vecinoColumna] !== null && tablero[vecinoFila][vecinoColumna].value === valor && tablero[vecinoFila][vecinoColumna].value !== 0 && !visitados.has(`${vecinoFila},${vecinoColumna}`)) {
          this.encontrarSecuencia(tablero, vecinoFila, vecinoColumna, visitados, secuenciaActual);
        }
      });
    }
  
    static secuenciaEsContinua(secuencia, tablero) {
      if (secuencia.length < 2) return true;
      const visitados = new Set(secuencia.map(([fila, columna]) => `${fila},${columna}`));
      for (let i = 0; i < secuencia.length; i++) {
        const [fila, columna] = secuencia[i];
        const tieneVecino = this.vecinos(tablero, fila, columna).some(([vecinoFila, vecinoColumna]) => visitados.has(`${vecinoFila},${vecinoColumna}`));
        if (!tieneVecino) {
          return false;
        }
      }
      return true;
    }
  
    static encontrarLosTresMasGrandes(tablero) {
      const secuencias = [];
      const visitados = new Set();
  
      for (let fila = 0; fila < tablero.length; fila++) {
        for (let columna = 0; columna < tablero[fila].length; columna++) {
          if (tablero[fila][columna] !== null && tablero[fila][columna].value !== 0 && !visitados.has(`${fila},${columna}`)) {
            const secuenciaActual = [];
            this.encontrarSecuencia(tablero, fila, columna, visitados, secuenciaActual);
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