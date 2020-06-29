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
    dbSaveMoveUri = "http://192.168.99.100:5000/api/save_move";
    aiApiUri = "http://192.168.99.100:5000/api/predict_move";

    pacman = {
        "row": 1,
        "col": 1,
        img: pacman_transparent_img
    };
    ghost_red = {
        row: 6,
        col: 6,
        img: red_ghost_transparent_img
    };
    ghost_cyan = {
        row: 12,
        col: 12,
        img: cyan_ghost_transparent_img
    };
    ghost_pink = {
        row: 6,
        col: 12,
        img: pink_ghost_transparent_img
    };
    ghost_orange = {
        row: 12,
        col: 6,
        img: orange_ghost_transparent_img
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

        if(direct !== "no_move") {
            this.clearUnitPosition(this.pacman);
        }

        fetch(this.pacmanApiUri + '/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ direction: direct })
        })
            .then(response => response.json())
            .then(data => {

                this.updateFrontendWithReceivedData(data);
                this.saveMoveToDatabase(direct);
            });
    };

    fetchAIMove = () => {
        fetch(this.aiApiUri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pacman: {x: this.pacman.col, y: this.pacman.row},
                ghost_1: {x: this.ghost_red.col, y: this.ghost_red.row},
                ghost_2: {x: this.ghost_cyan.col, y: this.ghost_cyan.row},
                ghost_3: {x: this.ghost_pink.col, y: this.ghost_pink.row},
                ghost_4: {x: this.ghost_orange.col, y: this.ghost_orange.row}
            })
        })
            .then(response => response.json())
            .then(data => {

                this.move(data.direction);
            });
    };

    updateFrontendWithReceivedData = (data) => {
        if(this.checkUnitPositionChanged(this.pacman, data,this.pacman)) {
            this.clearUnitPosition(this.pacman);
        }

        if(this.checkUnitPositionChanged(this.ghost_red, data,this.ghost_red)) {
            this.clearUnitPosition(this.ghost_red);
        }
        if(this.checkUnitPositionChanged(this.ghost_cyan, data,this.ghost_cyan)) {
            this.clearUnitPosition(this.ghost_cyan);
        }
        if(this.checkUnitPositionChanged(this.ghost_pink, data,this.ghost_pink)) {
            this.clearUnitPosition(this.ghost_pink);
        }
        if(this.checkUnitPositionChanged(this.ghost_orange, data,this.ghost_orange)) {
            this.clearUnitPosition(this.ghost_orange);
        }

        this.updateAllUnitPositions(data);
        this.renderAllUnitsPositions();

        if(data.state === "lose") {
            if(this.gameInterval) clearInterval(this.gameInterval);
            document.getElementById("div-menu").style.display = "block";
            document.getElementById("div-table").style.display = "none";
        }
    };

    saveMoveToDatabase = (direct) => {
        if(direct !== "no_move") {
            let directForDb = "w";
            if (direct === "down") directForDb = "s";
            else if (direct === "left") directForDb = "a";
            else if (direct === "right") directForDb = "d";


            fetch(this.dbSaveMoveUri, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pacman: {x: this.pacman.col, y: this.pacman.row},
                    ghost_1: {x: this.ghost_red.col, y: this.ghost_red.row},
                    ghost_2: {x: this.ghost_cyan.col, y: this.ghost_cyan.row},
                    ghost_3: {x: this.ghost_pink.col, y: this.ghost_pink.row},
                    ghost_4: {x: this.ghost_orange.col, y: this.ghost_orange.row},
                    direction: directForDb
                })
            }).then(res => res.json())
                .then(data => console.log("Saving move to database: " + data));
        }
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
                this.clearAllUnitsPositions();
                this.updateAllUnitPositions(data);
                this.renderAllUnitsPositions();
            });

        this.gameInterval = setInterval(this.gameLife, 300);
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
            this.fetchAIMove();
        }
    };

    clearUnitPosition = (unit) => {
        document.getElementById('div-table-col_' + unit.row + '_'
            + unit.col + '_field').innerHTML = '';
    };

    renderUnitPosition = (unit) => {
        document.getElementById('div-table-col_' + unit.row + '_'
            + unit.col + '_field').innerHTML = '<img src="' + unit.img + '" width="25px" height="25px" align="top"/>';
    };

    updateUnitPositions = (unit, receivedData) => {
      unit.row = receivedData.row;
      unit.col = receivedData.col;
    };

    clearAllUnitsPositions = () => {
        this.clearUnitPosition(this.pacman);
        this.clearUnitPosition(this.ghost_red);
        this.clearUnitPosition(this.ghost_cyan);
        this.clearUnitPosition(this.ghost_pink);
        this.clearUnitPosition(this.ghost_orange);
    };

    renderAllUnitsPositions = () => {
        this.renderUnitPosition(this.pacman);
        this.renderUnitPosition(this.ghost_red);
        this.renderUnitPosition(this.ghost_cyan);
        this.renderUnitPosition(this.ghost_pink);
        this.renderUnitPosition(this.ghost_orange);
    };

    updateAllUnitPositions = (data) => {
        this.updateUnitPositions(this.pacman, data.pacman);
        this.updateUnitPositions(this.ghost_red, data.ghost_red);
        this.updateUnitPositions(this.ghost_cyan, data.ghost_cyan);
        this.updateUnitPositions(this.ghost_pink, data.ghost_pink);
        this.updateUnitPositions(this.ghost_orange, data.ghost_orange);
    };

    checkUnitPositionChanged = (unit, receivedData) => {
        return receivedData.row !== unit.row || receivedData.col !== unit.col
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