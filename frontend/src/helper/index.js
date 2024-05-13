var rotateLeft = function (matrix) {
  var rows = matrix.length;
  var columns = matrix[0].length;
  var res = [];
  for (var row = 0; row < rows; ++row) {
    res.push([]);
    for (var column = 0; column < columns; ++column) {
      res[row][column] = matrix[column][columns - row - 1];
    }
  }
  return res;
};

class Tile {
  constructor(value, row, column) {
    this.value = value || 0;
    this.row = row || -1;
    this.column = column || -1;
    this.oldRow = -1;
    this.oldColumn = -1;
    this.markForDeletion = false;
    this.mergedInto = null;
    this.id = this.id++ || 0;
  }
  moveTo(row, column) {
    this.oldRow = this.row;
    this.oldColumn = this.column;
    this.row = row;
    this.column = column;
  }
  isNew() {
    return this.oldRow === -1 && !this.mergedInto;
  }
  hasMoved() {
    return (
      (this.fromRow() !== -1 &&
        (this.fromRow() !== this.toRow() ||
          this.fromColumn() !== this.toColumn())) ||
      this.mergedInto
    );
  }
  fromRow() {
    return this.mergedInto ? this.row : this.oldRow;
  }
  fromColumn() {
    return this.mergedInto ? this.column : this.oldColumn;
  }
  toRow() {
    return this.mergedInto ? this.mergedInto.row : this.row;
  }
  toColumn() {
    return this.mergedInto ? this.mergedInto.column : this.column;
  }
}

class Board {
  constructor() {
    this.tiles = [];
    this.cells = [];
    this.score = 0;
    this.size = 9; // Changed size to 9 as per the hexagonal structure
    this.fourProbability = 0.1;
    this.deltaX = [-1, 0, 1, 0];
    this.deltaY = [0, -1, 0, 1];
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
    //this.addRandomTiles();
    this.fillBoardWithTiles();
    this.setPositions();
    this.won = false;
  }
  addTile(args) {
    var res = new Tile(args);
    this.tiles.push(res);
    return res;
  }


  moveLeft() {
    var hasChanged = false;
    for (var row = 0; row < this.size; ++row) {
      var currentRow = this.cells[row].filter((tile) => tile.value !== 0);
      var resultRow = [];
      for (var target = 0; target < this.size; ++target) {
        var targetTile = currentRow.length
          ? currentRow.shift()
          : this.addTile();
        if (currentRow.length > 0 && currentRow[0].value === targetTile.value) {
          var tile1 = targetTile;
          targetTile = this.addTile(targetTile.value);
          tile1.mergedInto = targetTile;
          var tile2 = currentRow.shift();
          tile2.mergedInto = targetTile;
          targetTile.value += tile2.value;
          this.score += tile1.value + tile2.value;
        }
        resultRow[target] = targetTile;
        this.won |= targetTile.value === 2048;
        hasChanged |= targetTile.value !== this.cells[row][target].value;
      }
      this.cells[row] = resultRow;
    }
    return hasChanged;
  }
  setPositions() {
    this.cells.forEach((row, rowIndex) => {
      row.forEach((tile, columnIndex) => {
        if (tile !== null) {
          tile.oldRow = tile.row;
          tile.oldColumn = tile.column;
          tile.row = rowIndex;
          tile.column = columnIndex;
          tile.markForDeletion = false;
        }
      });
    });
  }
  addRandomTiles() {
    var emptyCells = [];
    for (var r = 0; r < this.size; ++r) {
      for (var c = 0; c < this.size; ++c) {
        if (this.cells[r][c] !== null && this.cells[r][c].value === 0) {
          emptyCells.push({ r: r, c: c });
        }
      }
    }
    if (emptyCells.length > 0) {
      var index = Math.floor(Math.random() * emptyCells.length);
      var cell = emptyCells[index];
      var newValue = Math.random() < this.fourProbability ? 4 : 2;
      this.cells[cell.r][cell.c] = this.addTile(newValue, cell.r, cell.c);
    }
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
  move(direction) {
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    this.clearOldTiles();
    for (var i = 0; i < direction; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    var hasChanged = this.moveLeft();
    for (let i = direction; i < 4; ++i) {
      this.cells = rotateLeft(this.cells);
    }
    if (hasChanged) {
      this.addRandomTiles();
    }
    this.setPositions();
    return this;
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
    for (var i = 0; i < this.cells.length; i++) {
      for (var j = 0; j < this.cells[i].length; j++) {
        var tile = this.cells[i][j];
        if (tile === null || this.canMove(i, j)) {
          return false;
        }
      }
    }
    return true;
  }
  
  canMove(row, column) {
    var tile = this.cells[row][column];
    var directions = [
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 }
    ];
    for (var i = 0; i < directions.length; i++) {
      var direction = directions[i];
      var newRow = row + direction.dx;
      var newColumn = column + direction.dy;
      if (newRow >= 0 && newRow < this.cells.length && newColumn >= 0 && newColumn < this.cells[newRow].length) {
        var neighbour = this.cells[newRow][newColumn];
        if (neighbour === null || neighbour.value === tile.value) {
          return true;
        }
      }
    }
    return false;
  }
}

export { Board };