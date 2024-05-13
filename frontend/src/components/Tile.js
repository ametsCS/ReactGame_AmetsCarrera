import React, { useState } from "react";

const Tile = ({ tile, isMouseDown, onMouseDown, onMouseOver, onMouseUp }) => {

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
  return <span
            className={classes}
            onMouseDown={onMouseDown}
            onMouseOver={onMouseOver}
            onMouseUp={onMouseUp}>
          </span>;
};

export default Tile;
