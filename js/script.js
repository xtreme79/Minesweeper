var context;
var bombs = [];
var clickedSquares = [];
var myX;
var myY;
var clickedSquareX;
var clickedSquareY;
var question_mark;
var number;
var empty_box;
var bomb;
var time = 0;
var clickedBomb;

/* Our grid with 10 rows and 10 columns. Each box has a width and height of 30 px */
var gridSettings = {
    rows: 10,
    cols: 10,
    width: 30,
    height: 30
};

/*Global window */
window.onload = function () {
    var canvas = document.getElementById("game-canvas");
    context = canvas.getContext("2d");

    userTime();
    init();
};

/* Our pictures and Array with bombs */
function init() {
    question_mark = new Image();
    number = new Image();
    empty_box = new Image();
    bomb = new Image();

    question_mark.src = "img/question_mark.png";
    number.src = "img/number.png";
    empty_box.src = "img/empty_box.png";
    bomb.src = "img/bomb.png";

	question_mark.addEventListener('load', onImageLoad);

    for (var i = 0; i < 10; i++) {
        bombs[i] = [
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10)
        ];
        //console.log("Bombs " + bombs[i]);
    }
}

/* Wait until all images are loaded */
function onImageLoad(e) {
    drawCanvas();
	};

/* Draws the canvas */
function drawCanvas() {

    context.clearRect(0, 0, 320, 320);

    for (var i = 0; i < gridSettings.rows; i++) {
        for (var n = 0; n < gridSettings.cols; n++) {
            var x = n * gridSettings.width;
            var y = i * gridSettings.height;

            var beenClicked = [0, false];

            if (clickedSquares.length > 0) {
                for (var k = 0; k < clickedSquares.length; k++) {
                    if (clickedSquares[k][0] == n && clickedSquares[k][1] == i) {
                        beenClicked = [k, true];
                    }
                }
            }

            if (beenClicked[1] === true) {
                /* Surrounding value greater than zero */
                if (clickedSquares[(beenClicked[0])][2] > 0) {
                    context.drawImage(number, x, y);
                } else {
                    context.drawImage(empty_box, x, y);
                }
            } else {
                context.drawImage(question_mark, x, y);

            }
        }
    }

    for (i in clickedSquares) {
        /* Surrounding value greater than zero */
        if (clickedSquares[i][2] > 0) {
            context.font = "20px arial";
            /* Text string, X value, Y value. +9 and +21 are pixel adjustment for the number */
            context.fillText(clickedSquares[i][2], clickedSquares[i][0] * gridSettings.width + 9, clickedSquares[i][1] * gridSettings.height + 21);
            console.log(clickedSquares[i][2], clickedSquares[i][0] * gridSettings.width + 9, clickedSquares[i][1] * gridSettings.height + 21);
        }
    }
}

window.onclick = function (e) {
    myX = e.pageX;
    myY = e.pageY;

    /* Which square is clicked on X, Y? */
    if (Math.floor(myX / gridSettings.width) < gridSettings.cols && Math.floor(myY / gridSettings.height) < gridSettings.rows) {
        clickedSquareX = Math.floor(myX / gridSettings.width);
        clickedSquareY = Math.floor(myY / gridSettings.height);

        //console.log(clickedSquareX + "," + clickedSquareY);
    }

    clickedBomb = false;

    /* Checks if the user clicks on a bomb */
    for (var i = 0; i < 10; i++) {
        if (clickedSquareX == bombs[i][0] && clickedSquareY == bombs[i][1]) {
            //console.log(bombs[i][0] + ", " + bombs[i][1]);
            clickedBomb = true;
            gameOver();
        }
    }

    /* If there is not a bomb, check the surrounding squares. */
    if (clickedBomb === false && myX < gridSettings.rows * gridSettings.width && myY < gridSettings.cols * gridSettings.height) {
        //console.log(clickedSquares.length);
        clickPass(clickedSquareX, clickedSquareY);
        if (clickedSquares.length == 89) {
            youWin();
        }
    }
};

/* A simple timer function */
function userTime() {
    timeController = setTimeout(function () {
        var timer = document.getElementById("timer-container");
        time++;
        timer.innerHTML = "Time: " + time + " seconds";
        userTime();
    }, 1000);
}

/* Array with surrounding squares, starts at 12 a clock */
function clickPass(x, y) {
    var boxesToCheck = [
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1]
    ];

    var numOfBombsSurrounding = 0;

    for (i in boxesToCheck) {
        for (var n = 0; n < 10; n++) {
            if (checkBomb(n, x + boxesToCheck[i][0], y + boxesToCheck[i][1]) === true) {
                numOfBombsSurrounding++;
            }
        }
    }

    var clicked = false;

    for (c in clickedSquares) {
        if (clickedSquares[c][0] == x && clickedSquares[c][1] == y) {
            clicked = true;
        }
    }

    if (clicked == false) {
        clickedSquares[(clickedSquares.length)] = [x, y, numOfBombsSurrounding];
    }

    if (numOfBombsSurrounding == 0) {
        for (i in boxesToCheck) {
            if (x + boxesToCheck[i][0] >= 0 && x + boxesToCheck[i][0] <= 9 && y + boxesToCheck[i][1] >= 0 && y + boxesToCheck[i][1] <= 9) {
                var x1 = x + boxesToCheck[i][0];
                var y1 = y + boxesToCheck[i][1];

                var alreadyClicked = false;
                for (n in clickedSquares) {
                    if (clickedSquares[n][0] == x1 && clickedSquares[n][1] == y1) {
                        alreadyClicked = true;
                    }
                }
                if (alreadyClicked == false) {
                    clickPass(x1, y1)
                }
            }
        }
    }

    drawCanvas();
}

function checkBomb(i, x, y) {
    if (bombs[i][0] == x && bombs[i][1] == y) {
        return true;
    } else {
        return false;
    }
}

function gameOver() {
    context.drawImage(bomb, clickedSquareX * gridSettings.width, clickedSquareY * gridSettings.height);

    information = document.getElementById("information-text");
    information.style.display = "block";
    information.innerHTML = "Game over" + "<br>";
    information.innerHTML += '<button type="button" onClick="newGame();">New game</button>';

    clearInterval(timeController); //Stop timer

    information.onclick = function (e) {
        e.stopPropagation();
    }
}

function youWin() {
    information = document.getElementById("information-text");
    information.style.display = "block";
    information.style.fontSize = "25px";
    information.innerHTML = "Congratulations you beat the game!" + "<br>";
    information.innerHTML += '<button type="button" onClick="newGame();">New game</button>';

	clearInterval(timeController); //Stop timer

    information.onclick = function (e) {
        e.stopPropagation();
    }
}

function newGame() {
    document.getElementById("information-text").style.display = "none";
    bombs = [];
    clickedSquares = [];
    time = 0;
	userTime();
    init();
}