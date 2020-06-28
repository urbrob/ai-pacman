import React from 'react';
import './Game.css';
import floor from './floor.png'
import wall from './wall.png'
import gameMap from './game_map'
import pacman_transparent_img from './img/Pacman_transparent.png'
import red_ghost_transparent_img from './img/Red_Ghost_transparent.png'
import cyan_ghost_transparent_img from './img/Cyan_Ghost_transparent.png'
import pink_ghost_transparent_img from './img/Pink_Ghost_transparent.png'
import orange_ghost_transparent_img from './img/Orange_Ghost_transparent.png'

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
    ghost_cyan = {
        row: 12,
        col: 12
    };
    ghost_pink = {
        row: 6,
        col: 12
    };
    ghost_orange = {
        row: 12,
        col: 6
    };
    lastPressedButton = "";
    gameInterval = null;
    gameType = "";

    createMenu = () => {
      return <div id="div-menu">
          <div className="div-menu-button">
            <button className="button" onClick={() => {
                    this.hideMenuAndStartGame("player")
            }}>PLAYER VS GHOSTS</button>
          </div>
          <div className="div-menu-button">
              <button className="button" onClick={ () => {
                  this.hideMenuAndStartGame("ai")
              }}>AI VS GHOSTS</button>
          </div>
      </div>
    };

    hideMenuAndStartGame(type) {
        document.getElementById("div-menu").style.display = "none";
        document.getElementById("div-table").style.display = "table";
        this.gameType = type;
        if(this.gameType === "player")
            document.getElementById("Game-div").focus();
        this.startGame();
    }

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

        return <div className="div-table" id="div-table">{board}</div>;
    };

    handleKeyPressed = (event) => {
        if(event.key === "Enter") {
            this.startGame();
        } else this.lastPressedButton = event.key;
    };

    move = (direct) => {
        const dataToPost = {
            direction: direct
        };

        if(direct !== "no_move") {
            this.clearUnitPosition(this.pacman);
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
                    this.clearUnitPosition(this.ghost_red);
                }
                this.ghost_red.row = data.ghost_red.row;
                this.ghost_red.col = data.ghost_red.col;

                if(data.ghost_cyan.row !== this.ghost_cyan.row || data.ghost_cyan.col !== this.ghost_cyan.col) {
                    this.clearUnitPosition(this.ghost_cyan);
                }
                this.ghost_cyan.row = data.ghost_cyan.row;
                this.ghost_cyan.col = data.ghost_cyan.col;

                if(data.ghost_pink.row !== this.ghost_pink.row || data.ghost_pink.col !== this.ghost_pink.col) {
                    this.clearUnitPosition(this.ghost_pink);
                }
                this.ghost_pink.row = data.ghost_pink.row;
                this.ghost_pink.col = data.ghost_pink.col;

                if(data.ghost_orange.row !== this.ghost_orange.row || data.ghost_orange.col !== this.ghost_orange.col) {
                    this.clearUnitPosition(this.ghost_orange);
                }
                this.ghost_orange.row = data.ghost_orange.row;
                this.ghost_orange.col = data.ghost_orange.col;

                document.getElementById('div-table-col_' + this.pacman.row + '_'
                    + this.pacman.col + '_field').innerHTML = '<img src="' + pacman_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_' + this.ghost_red.row + '_'
                    + this.ghost_red.col + '_field').innerHTML = '<img src="' + red_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_' + this.ghost_cyan.row + '_'
                    + this.ghost_cyan.col + '_field').innerHTML = '<img src="' + cyan_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_' + this.ghost_pink.row + '_'
                    + this.ghost_pink.col + '_field').innerHTML = '<img src="' + pink_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_' + this.ghost_orange.row + '_'
                    + this.ghost_orange.col + '_field').innerHTML = '<img src="' + orange_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';

                if(data.state === "lose") {
                    document.getElementById("div-menu").style.display = "block";
                    document.getElementById("div-table").style.display = "none";
                }
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
                this.clearUnitPosition(this.pacman);
                this.clearUnitPosition(this.ghost_red);
                this.clearUnitPosition(this.ghost_cyan);
                this.clearUnitPosition(this.ghost_pink);
                this.clearUnitPosition(this.ghost_orange);

                this.pacman.row = data.pacman.row;
                this.pacman.col = data.pacman.col;
                this.ghost_red.row = data.ghost_red.row;
                this.ghost_red.col = data.ghost_red.col;
                this.ghost_cyan.row = data.ghost_cyan.row;
                this.ghost_cyan.col = data.ghost_cyan.col;
                this.ghost_pink.row = data.ghost_pink.row;
                this.ghost_pink.col = data.ghost_pink.col;
                this.ghost_orange.row = data.ghost_orange.row;
                this.ghost_orange.col = data.ghost_orange.col;
                document.getElementById('div-table-col_1_1_field').innerHTML = '<img src="' + pacman_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_6_6_field').innerHTML = '<img src="' + red_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_12_12_field').innerHTML = '<img src="' + cyan_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_6_12_field').innerHTML = '<img src="' + pink_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
                document.getElementById('div-table-col_12_6_field').innerHTML = '<img src="' + orange_ghost_transparent_img + '" width="25px" height="25px" align="top"/>';
            });

        this.gameInterval = setInterval(this.gameLife, 300);
    };

    clearUnitPosition = (unit) => {
        document.getElementById('div-table-col_' + unit.row + '_'
            + unit.col + '_field').innerHTML = '';
    };

    gameLife = () => {
        if(this.gameType === "player") {
            if (this.lastPressedButton === "ArrowRight") this.move("right");
            else if (this.lastPressedButton === "ArrowLeft") this.move("left");
            else if (this.lastPressedButton === "ArrowUp") this.move("up");
            else if (this.lastPressedButton === "ArrowDown") this.move("down");
            else this.move("no_move");

            this.lastPressedButton = ""
        } else {
            //TODO implementacja tylko getujaca ruchy bo to ai
        }
    };

    render() {
        return (
            <div className="Game" id="Game-div" onKeyDown={this.handleKeyPressed} tabIndex="0">
                {this.createMenu()}
                {this.createBoard()}
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