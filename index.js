let unitLength;
const boxColor = ('red');
const strokeColor = "green";
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */

let currentBoard;
let nextBoard;

function setup() {
    /* Set the canvas to be under the element #canvas*/
    W = floor(windowWidth);
    H = floor(windowHeight);
    unitLength = (windowWidth - 20) / 70
    const canvas = createCanvas(W - 20, unitLength * 20);
    canvas.parent(document.querySelector("#canvas"));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
    }
    init(); // Set the initial values of the currentBoard and nextBoard

    // Create SLider

    slider = createSlider(1, 120, 30);
    slider.parent(document.querySelector("#slider"));
    slider.position();
    slider.size(500);

    //start-stop-button
    let button = createButton('Start/Pause');
    button.parent(document.querySelector("#startstop"));
    button.position();
    button.mouseClicked(tf);

    //Select color
    mySelect = createSelect();
    mySelect.position();
    mySelect.parent(document.querySelector("#colorselector"))

    // Add color options.
    mySelect.option('red');
    mySelect.option('green');
    mySelect.option('blue');
    mySelect.selected('red');
}


//start pause
let isStopped = true;
function tf() {

    if (isStopped === true) {
        console.log("Pause");
        noLoop();
        isStopped = false;
    } else {
        console.log("Resume")
        loop();
        isStopped = true;
    }
}



function draw() {
draw2();

    background('255');

    // var ctx = ();
    // ctx.canvas.width  = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;


    let c = mySelect.selected();



    generate();

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                if (nextBoard[i][j] == 1) {
                    fill("white")
                } else {
                    fill(c);

                }
            } else {
                fill('black');
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }

    resetRules();


    function resetRules() {
        document.getElementById('reset').addEventListener("click", () => {
            lone = 2;
            over = 3;
            reProduct = 3;
            document.getElementById("loneInput").value = "2";
            document.getElementById("overInput").value = "3";
            document.getElementById("reProductinput").value = "3";
            console.log('Reset all the rules');
        });
    }



    //Slidervalue to FPS
    let fpsValue = slider.value();
    frameRate(fpsValue);

    fill(0);
    textSize(20);

    text('FPS: ' + fpsValue, 10, 40);

}



//resize
// function resizeCanvas() {
//     //resize canvas
//     if (window.innerHeight >= (9 * window.innerWidth / 16)) {
//         canvas.width = window.innerWidth;
//         canvas.height = Math.floor(9 * canvas.width / 16);
//     }
//     else {
//         canvas.height = window.innerHeight;
//         canvas.width = Math.floor(16 * canvas.height / 9);
//     }
//     ctx = canvas.getContext("2d");
// }

//Set Rules
let lone = 2;
let over = 3;
let reProduct = 3;

function updateLone() {
    const loneInput = document.getElementById('loneInput');
    lone = parseInt(loneInput.value) || 2;
    console.log('Updated value for lone:', lone);
}

function updateOver() {
    const overInput = document.getElementById('overInput');
    over = parseInt(overInput.value) || 2;
    console.log('Updated value for over:', over);
}

function updatereProduct() {
    const reProductinput = document.getElementById('reProductinput');
    reProduct = parseInt(reProductinput.value) || 3;
    console.log('Updated value for reProduct:', reProduct);
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors +=
                        currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }



            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < lone) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > over) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == reProduct) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }

    const x = Math.floor(mouseX / unitLength);

    const y = Math.floor(mouseY / unitLength);
    console.log(mouseX, mouseY, x, y)
    currentBoard[x][y] = 1;
    // fill(c);
    // if (c = "red") {
    //     fill("red");
    // } else if (c = "green") {
    //     fill("green")
    // } else if (c = "blue") {
    //     fill("blue")
    // };

    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}
//random init

function randomSpawnLife() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] != 1) {
                currentBoard[i][j] = random() > 0.8 ? 1 : 0;
                nextBoard[i][j] = 0;
            }
        }
    }
}
function init() {
    randomSpawnLife()
    // for (let i = 0; i < columns; i++) {
    //     for (let j = 0; j < rows; j++) {
    //         // let someVariables = <condictions> : <when_true> : <when_false>;
    //         // currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if

    //         currentBoard[i][j] = 0; // one line if
    //         nextBoard[i][j] = 0;
    //     }
    // }


    // currentBoard[0][3] = 1
    // currentBoard[1][3] = 1
    // currentBoard[2][3] = 1
    // currentBoard[2][2] = 1
    // currentBoard[1][1] = 1

}

//pattern
const gliderPattern =
    `.O
..O
OOO`;

function insertPattern(x, y) {
    let parsedArray = gliderPattern.split('\n')
    console.log(parsedArray)
    for (let j in parsedArray) {
        console.log(j, "th row", parsedArray[j])
        for (let i in parsedArray[j]) {
            console.log(i, j, parsedArray[j][i])

            if (parsedArray[j][i] == 'O') {
                console.log("insert 1 at x+", i, "y+", j)

                currentBoard[x + Number(i)][y + Number(j)] = 1
                fill("purple");
                rect((x + i) * unitLength, (y + j) * unitLength, unitLength, unitLength)
            }
        }
    }
}

function mousePressed() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    insertPattern(x, y)
}


function mouseReleased() {
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
}

