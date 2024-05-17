
class Tile {
  constructor(value, row, column) {
    this.value = value || 0;
    this.row = row || 0;
    this.column = column || 0;
    this.markForDeletion = false;
    this.new = false;
  }

  isNew() {
    return this.new===true;
  }

}

class Board {
  constructor(boardArray,pilaArray) {
    this.tiles = [];
    this.cells = [];
    this.pila = pilaArray;
    this.score = 0;
    this.objective = 200;
    this.size = 9; // Changed size to 9 as per the hexagonal structure
    this.cells = [ // Define the hexagonal structure
      [null, null, null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), null, null, null],
      [null, null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), null, null],
      [null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), null],
      [this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile()],
      [this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile()],
      [this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile()],
      [null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), null],
      [null, null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), this.addTile(), null, null],
      [null, null, null, this.addTile(), this.addTile(), this.addTile(), this.addTile(), null, null, null]
    ];
    this.fillBoardWithTiles(boardArray);
    this.won = false;
    this.lost = false;
  }

  addTile(value, row, column) {
    var res = new Tile(value, row, column);
    this.tiles.push(res);
    return res;
  }


  fillBoardWithTiles(boardArray) {
    let index = 0;
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        if (tile !== null && tile.value === 0) {
          const randomValue = boardArray[index];
          this.cells[rowIndex][columnIndex] = this.addTile(randomValue, rowIndex, columnIndex);
          index += 1;
        }
      });
    });
  }


  clearMarkedTiles = (tilesToRemove) => {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile && tilesToRemove.some((t) => t === tile)) {
          // Obtener el último número de la pila
          let replacementValue = this.pila.pop();
          let newTile = this.addTile(replacementValue, rowIndex, colIndex);
          newTile.new = true;
          this.cells[rowIndex][colIndex] = newTile;
        }
      });
    });
    this.calculateScore(tilesToRemove);
  };


  calculateScore = (tilesToRemove) => {
    const bonusFactor = tilesToRemove.length;
    const score = (bonusFactor - 1) + (bonusFactor - 2);
    this.score += score;
  };

  
  hasWon() {
    if (this.score >= 200) {
      this.won = true;
      return this.won;
    }
  }


  hasLost() {
    let hasNeighbor = false;

    this.cells.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile && tile.value !== 0) {
                const directions = [
                    { di: 0, dj: -1 }, // izquierda
                    { di: 1, dj: -1 }, // arriba-izquierda
                    { di: -1, dj: -1 },  // abajo-izquierda
                    { di: 0, dj: 1 },  // derecha
                    { di: 1, dj: 1 },  // arriba-derecha
                    { di: -1, dj: 1 }, // abajo-derecha
                    { di: 1, dj: 0 }, // arriba
                    { di: -1, dj: 0 }, // abajo
                ];

                // Verificar si hay al menos un tile vecino del mismo valor para el tile actual
                for (const dir of directions) {
                    const ni = rowIndex + dir.di;
                    const nj = colIndex + dir.dj;

                    // Verificar si las coordenadas del vecino están dentro de los límites del tablero
                    if (this.cells[ni] && this.cells[ni][nj] && this.cells[ni][nj].value === tile.value) {
                        hasNeighbor = true;
                        return; // Salir del bucle si se encuentra al menos un vecino del mismo valor
                    }
                }
            }
        });
    });
    this.lost = !hasNeighbor;
    return !hasNeighbor;
}


}
export { Board };