import React from 'react';
import './Game.css';
import test from './test.png'

class Game extends React.Component {

     createBoard = () => {
         let board = [];

         for(let i = 0; i < 10; i++) {
             let children = [];
             for(let j = 0; j < 10; j++) {
                 children.push(<div className="div-table-col" id={`div-table-col_${i}_${j}`}>
                     {Field(test)}
                 </div>)
             }
             board.push(<div className="div-table-row">{children}</div>)
         }
         return <div className="div-table">{board}</div>;
     };

    render() {
        return (
            <div className="Game">
                {this.createBoard()}
            </div>
        )
    }
}

function Field(value) {
    return(
        <div className="Field" style={{ backgroundImage:`url(${value}`}} />
    )
}

export default Game;