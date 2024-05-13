
class Tile {
  constructor(value, row, column) {
    this.value = value || 0;
    this.row = row || 0;
    this.column = column || 0;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.new = false;
    this.id = this.id++ || 0;
  }
  isNew() {
    return this.new===true;
  }
}

class Board {
  constructor() {
    this.tiles = [];
    this.cells = [];
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
    console.log(this.cells);
  }
  clearOldTiles() {
    this.tiles = this.tiles.filter((tile) => tile.markForDeletion === false);
    this.tiles.forEach((tile) => {
      tile.markForDeletion = true;
    });
  }
  hasWon() {
    return this.won;
  }
  hasLost() {

  }
}

export { Board };