import { useEffect } from "react";
import React from "react";

const Tile = ({ tile, isMouseDown, onMouseDown, onMouseOver, onMouseUp, isSelected }) => {
  //TIMER-AREN LOGIKA
  useEffect(() => {
    let timer;

    if (tile.isNew()) {
      timer = setTimeout(() => {
        tile.new = false;
      }, 1500); // 1 segundo de duraciÃ³n del temporizador
    }

    return () => {
      clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    };
  }, [tile]);

  //SELEKZIOAREN LOGIKA
  const unselectedTileStyle = {
    opacity: isSelected ? 1 : 0.7 // Reduce la opacidad solo si no estÃ¡ seleccionado
  };
  const selectedTileStyle = {
    //transform: isMouseDown ? "scale(1.1)" : "scale(1)", // Escalar solo si el mouse estÃ¡ presionado
  };
  // Combinar estilos basado en si el Tile estÃ¡ seleccionado o no
  const combinedStyle = isSelected ? { ...unselectedTileStyle, ...selectedTileStyle } : unselectedTileStyle;
  const tileContainerClass = isSelected ? "tile-container" : "";

  //Zerikusia animazioekin eta CSS-arekin
  const classArray = ["tile"];
  classArray.push("tile" + tile.value);

  if (tile.isNew()) {
    classArray.push("scale-in");
  }
  //console.log(classArray);
  const classes = classArray.join(" ");

  return (
    <div className={tileContainerClass}>
      <span
        className={classes}
        style={combinedStyle}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
      ></span>
    </div>
  );
};

export default Tile;
