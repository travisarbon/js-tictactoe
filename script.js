/**
 * Created by Travis on 7/21/2016.
 */
$(document).ready(function(){
    (function(){
        var game = {

            piece : "X",
            win : false,
            aiTurn : 0,
            aiPlayer : "computer",
            aiPiece : "O",
            aiPlaced : false,
            aiMoves : [],
            oWin : false,
            xWin: false,
            playerWins: 0,
            computerWins: 0,
            draw : false,
            draws : 0,
            boardSpots : [
                {   "name": "topLeft",
                    "display": $("#top-left"),
                    "filled": false,
                    "piece": ""},
                {   "name": "topCenter",
                    "display": $("#top-center"),
                    "filled": false,
                    "piece": ""},
                {   "name": "topRight",
                    "display": $("#top-right"),
                    "filled": false,
                    "piece": ""},
                {   "name": "middleLeft",
                    "display": $("#middle-left"),
                    "filled": false,
                    "piece": ""},
                {   "name": "middleCenter",
                    "display": $("#middle-center"),
                    "filled": false,
                    "piece": ""},
                {   "name": "middleRight",
                    "display": $("#middle-right"),
                    "filled": false,
                    "piece": ""},
                {   "name": "bottomLeft",
                    "display": $("#bottom-left"),
                    "filled": false,
                    "piece": ""},
                {   "name": "bottomCenter",
                    "display": $("#bottom-center"),
                    "filled": false,
                    "piece": ""},
                {   "name": "bottomRight",
                    "display": $("#bottom-right"),
                    "filled": false,
                    "piece": ""}
            ],

            init : function(){
                this.cacheDOM();
                this.bindEvents();
            },

            cacheDOM : function(){
                this.$el = $("#game");
                this.$topLeft = this.$el.find("#top-left");
                this.$topCenter = this.$el.find("#top-center");
                this.$topRight = this.$el.find("#top-right");
                this.$middleLeft = this.$el.find("#middle-left");
                this.$middleCenter = this.$el.find("#middle-center");
                this.$middleRight = this.$el.find("#middle-right");
                this.$bottomLeft = this.$el.find("#bottom-left");
                this.$bottomCenter = this.$el.find("#bottom-center");
                this.$bottomRight = this.$el.find("#bottom-right");
                this.$backing = this.$el.find("#backing");
                this.$board = this.$el.find("#board");
                this.$controls = this.$el.find("#controls");
                this.$scoreboard = this.$el.find("#scoreboard");
                this.$xButton = this.$el.find("#x-button");
                this.$oButton = this.$el.find("#o-button");
                this.$resetButton = this.$el.find("#reset-button");
            },

            bindEvents : function(){
                this.$topLeft.on("click", {position: 0}, this.placePiece.bind(this));
                this.$topCenter.on("click", {position: 1}, this.placePiece.bind(this));
                this.$topRight.on("click", {position: 2}, this.placePiece.bind(this));
                this.$middleLeft.on("click", {position: 3}, this.placePiece.bind(this));
                this.$middleCenter.on("click", {position: 4}, this.placePiece.bind(this));
                this.$middleRight.on("click", {position: 5}, this.placePiece.bind(this));
                this.$bottomLeft.on("click", {position: 6}, this.placePiece.bind(this));
                this.$bottomCenter.on("click", {position: 7}, this.placePiece.bind(this));
                this.$bottomRight.on("click", {position: 8}, this.placePiece.bind(this));
                this.$xButton.on("click", {value : "X"}, this.switchPiece.bind(this));
                this.$oButton.on("click", {value : "O"}, this.switchPiece.bind(this));
                this.$resetButton.on("click", this.resetGame.bind(this));
            },

            switchPiece : function(event){
                if(event.data.value === "X"){
                    this.piece = "X";
                    this.aiPiece = "O";
                    this.resetGame();
                    console.log("piece", this.piece);
                    console.log("player", this.player);
                } else if(event.data.value === "O"){
                    this.piece = "O";
                    this.aiPiece = "X";
                    this.resetGame();
                    document.getElementById("o-button").checked = true;
                    console.log("piece", this.piece);
                    console.log("player", this.player);
              }
            },

            placePiece : function(event){
                var position = this.boardSpots[event.data.position];
                if(position.filled == false) {
                    this.boardSpots[event.data.position].piece = this.piece;
                    this.boardSpots[event.data.position].filled = true;
                    this.renderPiece(position.display, this.piece);
                    var board = [];
                    for(var i = 0; i < this.boardSpots.length; i++){
                        board.push(this.boardSpots[i]);
                    }
                    console.log("GLOBAL BOARD", this.boardSpots);
                    console.log("NEW BOARD", board);
                    this.runAI(board);
                    if(this.aiMoves.length !== 0){
                        this.aiPlays();
                    }
                    this.aiTurn = 0;
                    this.aiPlaced = false;
                }
            },

            renderPiece: function(display, piece){
                display.html("<p>" + piece + "</p>");
                console.log(this.player);
                this.cleanBoard();
            },

            resetGame : function(){
                for(var i = 0; i < this.boardSpots.length; i++){
                    this.boardSpots[i].filled = false;
                    this.boardSpots[i].display.html(" ");
                    this.boardSpots[i].piece = "";
                }
                this.win = false;
                this.xWin = false;
                this.oWin = false;
                this.draw = false;
                if(this.piece == "O"){
                    var board = [];
                    for(var j = 0; j < this.boardSpots.length; j++){
                        board.push(this.boardSpots[j]);
                    }
                    this.blockHuman();
                    this.runAI(board);
                    if(this.aiMoves.length !== 0){
                        this.aiPlays();
                    }
                    this.aiPlaced = false;
                }
                console.log(this.boardSpots);
            },

            runAI : function(newBoard){
                console.log(this.aiMoves);
                this.blockHuman();
                var i = this.aiTurn;
                    if (this.aiPlaced == false && this.aiTurn <= 8) {
                        console.log("Global Board", this.boardSpots, "New Board", newBoard);
                        if (this.aiPlayer === "computer") {
                            console.log(this.aiPlayer);
                            if (newBoard[i].filled == false) {
                                newBoard[i].piece = this.aiPiece;
                                this.winCondition(newBoard);
                                if (this.win == true) {
                                    console.log("AI PLAYS AND WINS", i);
                                    this.aiMoves.push(10 + this.aiTurn);
                                    console.log(this.aiMoves);
                                    this.aiPlaced = true;
                                } else {
                                    console.log("AI PLAYS AND GAME CONTINUES", i);
                                    newBoard[i].piece = this.aiPiece;
                                    this.aiMoves.push(this.aiTurn);
                                    this.aiPlayer = "human";
                                    this.aiTurn += 1;
                                    this.runAI(newBoard);
                                }
                            } else if (newBoard[i].filled == true) {
                                console.log("THE SPACE IS FULL AND AI MOVES ON", i);
                                this.aiMoves.push(this.aiTurn);
                                this.aiTurn += 1;
                                this.runAI(newBoard);
                            }
                        } else if (this.aiPlayer === "human") {
                            if (newBoard[i].filled == false) {
                                newBoard[i].piece = this.piece;
                                this.winCondition(newBoard);
                                if (this.win == true) {
                                    console.log("HUMAN SIDE PLAYS AND AI LOSES", i);
                                    newBoard[i].piece = this.piece;
                                    this.aiMoves.push(this.aiTurn - 10);
                                    this.aiPlayer = "computer";
                                    this.aiTurn += 1;
                                    this.runAI(newBoard);
                                } else {
                                    console.log("HUMAN SIDE PLAYS AND GAME CONTINUES", i);
                                    newBoard[i].piece = this.piece;
                                    this.aiMoves.push(this.aiTurn - 5);
                                    this.aiPlayer = "computer";
                                    this.aiTurn += 1;
                                    this.runAI(newBoard);
                                }
                            } else if (newBoard[i].filled == true) {
                                console.log("THE SPACE IS FULL AND AI MOVES ON", i);
                                this.aiMoves.push(this.aiTurn);
                                this.aiTurn += 1;
                                this.runAI(newBoard);
                            }
                        }
                    }
            },

            blockHuman : function(){
                var humanPositions = [];
                for(var i = 0; i < this.boardSpots.length; i++){
                    if(this.boardSpots[i].piece === this.piece && this.boardSpots[i].filled == true){
                        humanPositions.push(i);
                    }
                }
                if(humanPositions.indexOf(1) !== -1 && humanPositions.indexOf(2) !== -1 && this.boardSpots[0].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(0);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(2) !== -1 && this.boardSpots[1].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(1);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(1) !== -1 && this.boardSpots[2].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(2);
                } else if(humanPositions.indexOf(4) !== -1 && humanPositions.indexOf(5) !== -1 && this.boardSpots[3].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(3);
                } else if(humanPositions.indexOf(3) !== -1 && humanPositions.indexOf(5) !== -1 && this.boardSpots[4].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(4);
                } else if(humanPositions.indexOf(3) !== -1 && humanPositions.indexOf(4) !== -1 && this.boardSpots[5].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(5);
                } else if(humanPositions.indexOf(7) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[6].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(6);
                } else if(humanPositions.indexOf(6) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[7].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(7);
                } else if(humanPositions.indexOf(6) !== -1 && humanPositions.indexOf(7) !== -1 && this.boardSpots[8].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(8);
                } else if(humanPositions.indexOf(3) !== -1 && humanPositions.indexOf(6) !== -1 && this.boardSpots[0].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(0);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(6) !== -1 && this.boardSpots[3].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(3);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(3) !== -1 && this.boardSpots[6].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(6);
                } else if(humanPositions.indexOf(4) !== -1 && humanPositions.indexOf(7) !== -1 && this.boardSpots[1].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(1);
                } else if(humanPositions.indexOf(1) !== -1 && humanPositions.indexOf(7) !== -1 && this.boardSpots[4].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(4);
                } else if(humanPositions.indexOf(1) !== -1 && humanPositions.indexOf(4) !== -1 && this.boardSpots[7].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(7);
                } else if(humanPositions.indexOf(5) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[2].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(2);
                } else if(humanPositions.indexOf(2) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[5].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(5);
                } else if(humanPositions.indexOf(2) !== -1 && humanPositions.indexOf(5) !== -1 && this.boardSpots[8].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(8);
                } else if(humanPositions.indexOf(4) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[0].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(0);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(8) !== -1 && this.boardSpots[4].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(4);
                } else if(humanPositions.indexOf(0) !== -1 && humanPositions.indexOf(4) !== -1 && this.boardSpots[8].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(8);
                } else if(humanPositions.indexOf(4) !== -1 && humanPositions.indexOf(6) !== -1 && this.boardSpots[2].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(2);
                } else if(humanPositions.indexOf(2) !== -1 && humanPositions.indexOf(6) !== -1 && this.boardSpots[4].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(4);
                } else if(humanPositions.indexOf(2) !== -1 && humanPositions.indexOf(4) !== -1 && this.boardSpots[6].filled == false){
                    this.aiPlaced = true;
                    this.placeAI(6);
                }
                    },

            aiPlays :function() {
                var sortedMoves = [];
                for (var i = 0; i < this.aiMoves.length; i++) {
                    sortedMoves.push(this.aiMoves[i]);
                }
                console.log("AI MOVES", this.aiMoves);
                sortedMoves.sort(function (a, b) {
                    return b - a;
                });
                console.log("SORTED", sortedMoves);
                var j = this.aiMoves.indexOf(sortedMoves[0]);
                console.log("INDEX", j);
                this.placeAI(j);
            },

            placeAI : function(j){
                if(this.boardSpots[j].filled == false){
                    this.boardSpots[j].filled = true;
                    this.boardSpots[j].piece = this.aiPiece;
                    this.renderPiece(this.boardSpots[j].display, this.aiPiece);
                    this.aiMoves = [];
                    this.cleanBoard();
                } else if(j == -1){
                    j = 8;
                    this.boardSpots[j].filled = true;
                    this.boardSpots[j].piece = this.aiPiece;
                    this.renderPiece(this.boardSpots[j].display, this.aiPiece);
                    this.aiMoves = [];
                    this.cleanBoard();
                } else this.placeAI(j - 1);
            },

            cleanBoard : function(){
                for(var i = 0; i < this.boardSpots.length; i++){
                    if(this.boardSpots[i].filled == false){
                        this.boardSpots[i].piece = "";
                    }
                }
                console.log("CLEANED BOARD", this.boardSpots);
                this.updateScoreboard();
                if(this.win == true || this.draw == true){
                    this.resetGame();
                }
            },

            winCondition : function(board){

                if(board[0].piece === "X" && board[1].piece === "X" && board[2].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[3].piece === "X" && board[4].piece === "X" && board[5].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[6].piece === "X" && board[7].piece === "X" && board[8].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[0].piece === "X" && board[3].piece === "X" && board[6].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[1].piece === "X" && board[4].piece === "X" && board[7].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[2].piece === "X" && board[5].piece === "X" && board[8].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[0].piece === "X" && board[4].piece === "X" && board[8].piece === "X"){
                    this.win = true;
                    this.xWin = true;
                } else if(board[6].piece === "X" && board[4].piece === "X" && board[2].piece === "X") {
                    this.win = true;
                    this.xWin = true;
                }

                if(board[0].piece === "O" && board[1].piece === "O" && board[2].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[3].piece === "O" && board[4].piece === "O" && board[5].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[6].piece === "O" && board[7].piece === "O" && board[8].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[0].piece === "O" && board[3].piece === "O" && board[6].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[1].piece === "O" && board[4].piece === "O" && board[7].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[2].piece === "O" && board[5].piece === "O" && board[8].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[0].piece === "O" && board[4].piece === "O" && board[8].piece === "O"){
                    this.win = true;
                    this.oWin = true;
                } else if(board[6].piece === "O" && board[4].piece === "O" && board[2].piece === "O") {
                    this.win = true;
                    this.oWin = true;

                }
            },

            updateScoreboard : function(){
                this.win = false;
                this.xWin = false;
                this.oWin = false;
                this.draw = false;
                this.winCondition(this.boardSpots);
                console.log("UPDATING SCOREBOARD", this.boardSpots);
                if (this.piece == "X" && this.xWin == true) {
                    this.aiPlaced = true;
                    this.playerWins++;
                    this.$scoreboard.html("Wins: Player " + this.playerWins + ", Computer: " + this.computerWins + ", Draw: " + this.draws);
                } else if (this.piece == "O" && this.oWin == true) {
                    this.aiPlaced = true;
                    this.playerWins++;
                    this.$scoreboard.html("Wins: Player " + this.playerWins + ", Computer: " + this.computerWins + ", Draw: " + this.draws);
                } else if (this.aiPiece == "X" && this.xWin == true) {
                    this.aiPlaced = true;
                    this.computerWins++;
                    this.$scoreboard.html("Wins: Player " + this.playerWins + ", Computer: " + this.computerWins + ", Draw: " + this.draws);
                } else if (this.aiPiece == "O" && this.oWin == true) {
                    this.aiPlaced = true;
                    this.computerWins++;
                    this.$scoreboard.html("Wins: Player " + this.playerWins + ", Computer: " + this.computerWins + ", Draw: " + this.draws);
                } else if (this.win == false){
                    this.checkForDraw();
                    if(this.draw == true){
                        this.draws++;
                        this.$scoreboard.html("Wins: Player " + this.playerWins + ", Computer: " + this.computerWins + ", Draw: " + this.draws);
                    }
                }
            },

            checkForDraw : function(){
                var filledCounter = 0;
                for(var i = 0; i < this.boardSpots.length; i++){
                    if(this.boardSpots[i].filled == true){
                        filledCounter++;
                    }
                }
                if(filledCounter == 9){
                    this.draw = true;
                    this.aiPlaced = true;
                }
            }
        };

        game.init();
    })();
});