
class Tile {
  constructor(value, row, column) {
    this.value = value || 0;
    this.row = row || 0;
    this.column = column || 0;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.new = false;
  }

  isNew() {
    return this.new===true;
  }

}

class Board {
  constructor() {
    this.tiles = [];
    this.cells = [];
    this.pila = [];
    this.score = 0;
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
    this.fillBoardWithTiles();
    this.createPila();
    this.won = false;
  }

  addTile(value, row, column) {
    var res = new Tile(value, row, column);
    this.tiles.push(res);
    return res;
  }


  fillBoardWithTiles() {
    const possibleValues = [2, 4, 8];
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        if (tile !== null && tile.value === 0) {
          var randomIndex = Math.floor(Math.random() * possibleValues.length);
          var randomValue = possibleValues[randomIndex];
          this.cells[rowIndex][columnIndex] = this.addTile(randomValue, rowIndex, columnIndex);
        }
      });
    }); 
    //console.log(this.cells);
  }


  createPila() {
    const possibleValues = [2, 4, 8];
    const pila = [];
    const minElements = 100;
    const maxElements = 200; // Establecer un máximo para evitar un bucle infinito en caso de problemas
    let count = 0;

    while (pila.length < minElements && count < maxElements) {
      const randomIndex = Math.floor(Math.random() * possibleValues.length);
      const randomValue = possibleValues[randomIndex];
      pila.push(randomValue);
      count++;
    }

    this.pila = pila;
  }


  clearMarkedTiles = (tilesToRemove) => {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile && tilesToRemove.some((t) => t === tile)) {
          // Obtener el último número de la pila
          const replacementValue = this.pila.pop();
          let newTile = this.addTile(replacementValue, rowIndex, colIndex);
          newTile.new = true;
          this.cells[rowIndex][colIndex] = newTile;
        }
      });
    });
  };


  
  hasWon() {
    return this.won;
  }


  hasLost() {

  }


}

export { Board };