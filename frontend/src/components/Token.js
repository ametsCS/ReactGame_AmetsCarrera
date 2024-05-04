import React from 'react';

class Token extends React.Component {
  render() {
    const { value, position } = this.props;
    const style = {
      position: 'absolute',
      top: `${position.row * 115.47}px`, // adjust as needed
      left: `${position.col * 100}px`, // adjust as needed
    };

    return (
      <div className="token" style={style}>
        {value}
      </div>
    );
  }
}

export default Token;