import { useEffect } from "react";
import React, { useState } from "react";  

const Tile = ({ tile, isMouseDown, onMouseDown, onMouseOver, onMouseUp, isSelected }) => {

  const [isNewTimer, setIsNewTimer] = useState(null);

  //TIMER-AREN LOGIKA
  useEffect(() => {
    if (tile.isNew()) {
      const timer = setTimeout(() => {
        tile.new = false;
        setIsNewTimer(null);
      }, 1500); // 1 segundo de duración del temporizador

      setIsNewTimer(timer);
    }
    return () => {
      clearTimeout(isNewTimer); // Limpiar el temporizador al desmontar el componente
    };
  }, [tile]);


  //SELEKZIOAREN LOGIKA
  const unselectedTileStyle = {
    opacity: isSelected ? 1 : 0.7, // Reduce la opacidad solo si no está seleccionado
  };
  const selectedTileStyle = {
    //transform: isMouseDown ? "scale(1.1)" : "scale(1)", // Escalar solo si el mouse está presionado
  };
  // Combinar estilos basado en si el Tile está seleccionado o no
  let combinedStyle = isSelected ? { ...unselectedTileStyle, ...selectedTileStyle } : unselectedTileStyle;
  let tileContainerClass = isSelected ? "tile-container" : "";


  //Zerikusia animazioekin eta CSS-arekin

  let classArray = ["tile"];
  classArray.push("tile" + tile.value);

  if (tile.isNew()) {
    classArray.push("scale-in");
  }
  //console.log(classArray);  
  let classes = classArray.join(" ");
  
  return <div className={tileContainerClass}>
            <span
              className={classes}
              style={combinedStyle}
              onMouseDown={onMouseDown}
              onMouseOver={onMouseOver}
              onMouseUp={onMouseUp}>
            </span>
        </div>
};

export default Tile;
