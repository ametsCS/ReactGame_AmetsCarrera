import React from "react";
import TryAgainLogo from "../assets/img/try-again.gif";
import Patch from "../assets/img/patch.gif";
const GameOverlay = ({ onRestart, board }) => {
  if (board.hasWon()) {
    return (
      <div className="winner" onClick={onRestart}>
        <img
          src={Patch}
          alt="You Win!"
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </div>
    );;
  } else if (board.hasLost()) {
    return (
      <div className="gameOver" onClick={onRestart}>
        <img
          src={TryAgainLogo}
          alt="Try Again"
          style={{
            width: "100%",
            height: "100%",
            cursor: "pointer",
          }}
        />
      </div>
    );
  }
  return null;
};

export default GameOverlay;
