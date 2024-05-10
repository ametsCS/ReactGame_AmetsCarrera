import React from "react";

const Cell = ({ id, number, onClick }) => {
  return (
    <div className="cell">
      <button className="hexagon-button" onClick={() => console.log('Click: '+number)}>
        {number}
      </button>
    </div>
  );
};

export default Cell;
