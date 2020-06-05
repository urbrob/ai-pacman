import React from 'react';
import './Game.css';
import floor from './floor.png'
import wall from './wall.png'
import gameMap from './game_map'

class Game extends React.Component {

    // replace it with your docker-machine default ip address ('docker-machine ip default' in CLI)
    pacmanApiUri = "http://192.168.99.100:5678";

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

    move = (direct) => {
        const dataToPost = {
            direction: direct
        };

        document.getElementById('div-table-col_' + this.current.row + '_'
            + this.current.col + '_field').innerText = '';

        fetch(this.pacmanApiUri + '/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToPost)
        })
            .then(response => response.json())
            .then(data => {
                this.current.row = data.row;
                this.current.col = data.col;
                document.getElementById('div-table-col_' + this.current.row + '_'
                    + this.current.col + '_field').innerText = 'x';
            });
    };

    startGame = () => {

        fetch(this.pacmanApiUri + '/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'startGame'})
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('div-table-col_' + this.current.row + '_'
                    + this.current.col + '_field').innerText = '';

                this.current.row = data.row;
                this.current.col = data.col;
                document.getElementById('div-table-col_1_1_field').innerText = 'x';
            });
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