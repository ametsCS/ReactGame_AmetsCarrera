import React from "react";

const Tile = ({ tile, id }) => {

  const handleClick = () => {
    // Mostrar la posición del tile en la consola
    console.log("Posición del tile - Fila: " + tile.row + ", Columna: " + tile.column);
  };

  //Zerikusia animazioekin eta CSS-arekin
  // 1. tile
  // 2. tile#
  // 3. position_#_#
  // 4. row_from_#_to_#
  // 5. col_from_#_to_#
  // 6. isMoving
  // 7. new
  // 8. merged

  let classArray = ["tile"];
  classArray.push("tile" + tile.value);
  if (!tile.mergedInto) {
    classArray.push(`position_${tile.row}_${tile.column}`);
  }
  if (tile.mergedInto) {
    classArray.push("merged");
  }
  if (tile.isNew()) {
    classArray.push("new");
  }
  let classes = classArray.join(" ");
  return <span className={classes} onClick={handleClick}></span>;
};

export default Tile;
