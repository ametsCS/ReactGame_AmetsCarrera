import React from 'react';
import './HexagonalBoard.css';

function HexagonalBoard() {
    // Array bidimensional para representar el tablero hexagonal
    const board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    return (
        <div className="HexagonalBoard">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, cellIndex) => (
                        <div
                            key={cellIndex}
                            className="hexagon"
                            style={{
                                backgroundColor: cell === 0 ? 'white' : 'black',
                            }}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default HexagonalBoard;
