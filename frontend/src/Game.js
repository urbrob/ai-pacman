import React from 'react';
import './Game.css';
import floor from './floor.png'
import wall from './wall.png'
import gameMap from './game_map'
import pacman_transparent_img from './img/Pacman_transparent.png'
import red_ghost_transparent_img from './img/Red_Ghost_transparent.png'

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const mapImages = importAll(require.context('./img/map'));

class Game extends React.Component {

    // replace it with your docker-machine default ip address ('docker-machine ip default' in CLI)
    pacmanApiUri = "http://192.168.99.100:5678";

    pacman = {
        "row": 1,
        "col": 1
    };
    ghost_red = {
        row: 6,
        col: 6
    };
    lastPressedButton = "";
    gameInterval = null;

    createBoard = () => {
        let board = [];

        gameMap.map((row) => {
            let children = [];
            row.fields.map((field) => {
                children.push(<div className="div-table-col" id={`div-table-col_${row.row_id}_${field.col_id}`}>
                    {Field(field.img, 'div-table-col_' + row.row_id + '_' + field.col_id)}
                </div>)
            });
            board.push(<div className="div-table-row">{children}</div>)
        });

        return <div className="div-table">{board}</div>;
    };

    handleKeyPressed = (event) => {
        if(event.key === "Enter") {
            this.startGame();
        } else this.lastPressedButton = event.key;
        // } else if(event.key === "ArrowRight") this.move("right");
        // else if(event.key === "ArrowLeft") this.move("left");
        // else if(event.key === "ArrowUp") this.move("up");
        // else if(event.key === "ArrowDown") this.move("down");
    };

    move = (direct) => {
        const dataToPost = {
            direction: direct
        };

        if(direct !== "no_move") {
            document.getElementById('div-table-col_' + this.pacman.row + '_'
                + this.pacman.col + '_field').innerHTML = '';
        }

        fetch(this.pacmanApiUri + '/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToPost)
        })
            .then(response => response.json())
            .then(data => {
                this.pacman.row = data.pacman.row;
                this.pacman.col = data.pacman.col;
                if(data.ghost_red.row !== this.ghost_red.row || data.ghost_red.col !== this.ghost_red.col) {
                    document.getElementById('div-table-col_' + this.ghost_red.row + '_'
                        + this.ghost_red.col + '_field').innerHTML = '';
                }
                this.ghost_red.row = data.ghost_red.row;
                this.ghost_red.col = data.ghost_red.col;
                document.getElementById('div-table-col_' + this.pacman.row + '_'
                    + this.pacman.col + '_field').innerHTML = '<img src="' + pacman_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_' + this.ghost_red.row + '_'
                    + this.ghost_red.col + '_field').innerHTML = '<img src="' + red_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';

                if(data.state === "lose") this.startGame();
            });
    };

    startGame = () => {
        if(this.gameInterval) clearInterval(this.gameInterval);

        fetch(this.pacmanApiUri + '/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({action: 'startGame'})
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('div-table-col_' + this.pacman.row + '_'
                    + this.pacman.col + '_field').innerHTML = '';
                document.getElementById('div-table-col_' + this.ghost_red.row + '_'
                    + this.ghost_red.col + '_field').innerHTML = '';

                this.pacman.row = data.pacman.row;
                this.pacman.col = data.pacman.col;
                this.ghost_red.row = data.ghost_red.row;
                this.ghost_red.col = data.ghost_red.col;
                document.getElementById('div-table-col_1_1_field').innerHTML = '<img src="' + pacman_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_6_6_field').innerHTML = '<img src="' + red_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
            });

        this.gameInterval = setInterval(this.gameLife, 300);
    };

    gameLife = () => {
        if(this.lastPressedButton === "ArrowRight") this.move("right");
        else if(this.lastPressedButton === "ArrowLeft") this.move("left");
        else if(this.lastPressedButton === "ArrowUp") this.move("up");
        else if(this.lastPressedButton === "ArrowDown") this.move("down");
        else this.move("no_move");

        this.lastPressedButton = ""
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
    //let parsedValue = value === "wall" ? wall : floor; //TODO refactor this
    let img = mapImages[value];
    return(
        <div className="Field" style={{ backgroundImage:`url(${img}`}} id={id + "_field"}/>
    )
}

export default Game;