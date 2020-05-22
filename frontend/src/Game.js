import React from 'react';
import './Game.css';
import floor from './floor.png'
import wall from './wall.png'
import gameMap from './game_map'

class Game extends React.Component {

    current = {
        "row": 1,
        "col": 1
    };

    createBoard = () => {
        let board = [];

        gameMap.map((row) => {
            let children = [];
            row.fields.map((field) => {
                children.push(<div className="div-table-col" id={`div-table-col_${row.row_id}_${field.col_id}`}>
                    {Field(field.field_type, 'div-table-col_' + row.row_id + '_' + field.col_id)}
                </div>)
            });
            board.push(<div className="div-table-row">{children}</div>)
        });

        return <div className="div-table">{board}</div>;
    };

    handleKeyPressed = (event) => {
        if(event.key === "Enter") {
            this.startGame();
        } else if(event.key === "ArrowRight") this.move("right");
        else if(event.key === "ArrowLeft") this.move("left");
        else if(event.key === "ArrowUp") this.move("up");
        else if(event.key === "ArrowDown") this.move("down");
    };

    move = (direction) => {
        document.getElementById('div-table-col_' + this.current.row + '_'
            + this.current.col + '_field').innerText = '';
        let previous = {
            "row": this.current.row,
            "col": this.current.col
        };

        if(direction === "right") this.current.col += 1;
        else if(direction === "left") this.current.col -= 1;
        else if(direction === "up") this.current.row -= 1;
        else if(direction === "down")this.current.row += 1;

        if(!this.validateMove(this.current.row, this.current.col)) {
            this.current.row = previous.row;
            this.current.col = previous.col;
        }

        document.getElementById('div-table-col_' + this.current.row + '_'
            + this.current.col + '_field').innerText = 'x';

        let uri = "http://10.7.232.168:5678/game";
        fetch(uri, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: {
                "col": this.current.col,
                "row": this.current.row
            }
        }).then((res) => console.log(res))
    };

    validateMove = (row, col) => {
        let field = gameMap.find(rowMap => rowMap.row_id === row).fields
            .find(colMap => colMap.col_id === col).field_type;
        return (field && field === "floor")
    };

    startGame = () => {
        document.getElementById('div-table-col_1_1_field').innerText = 'x';
    };

    render() {
        return (
            <div className="Game" id="Game-div" onKeyDown={this.handleKeyPressed} tabIndex="0">
                {this.createBoard()}
                {this.startGame}
            </div>
        )
    }
}

function Field(value, id) {
    let parsedValue = value === "wall" ? wall : floor; //TODO refactor this
    return(
        <div className="Field" style={{ backgroundImage:`url(${parsedValue}`}} id={id + "_field"}/>
    )
}

export default Game;