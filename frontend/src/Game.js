import React from 'react';
import './Game.css';
import floor from './floor.png'
import wall from './wall.png'
import gameMap from './game_map'

class Game extends React.Component {

     createBoard = () => {
         let board = [];

         gameMap.map((row) => {
             let children = [];
             row.fields.map((field) => {
                 children.push(<div className="div-table-col" id={`div-table-col_${row.row_id}_${field.col_id}`}>
                     {Field(field.field_type)}
                 </div>)
             });
             board.push(<div className="div-table-row">{children}</div>)
         });

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
    let parsedValue = value === "wall" ? wall : floor; //TODO refactor this
    return(
        <div className="Field" style={{ backgroundImage:`url(${parsedValue}`}} />
    )
}

export default Game;