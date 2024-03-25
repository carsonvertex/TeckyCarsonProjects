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

    //patternmode-button
    let pbutton = createButton('Draw Mode / Pattern Mode');
    pbutton.parent(document.querySelector("#MODE"));
    pbutton.position();
    pbutton.mouseClicked(mode);




    //Select color
    // mySelect = createSelect();
    // mySelect.position();
    // mySelect.parent(document.querySelector("#colorselector"))

    // // Add color options.
    // mySelect.option('red');
    // mySelect.option('green');
    // mySelect.option('blue');
    // mySelect.selected('red');
}


//start pause
let isStopped = false;
function tf() {

    if (isStopped !== true) {
        console.log("Pause");
        noLoop();
        isStopped = true;
        document.getElementById("Status").innerHTML=("Game Paused")
        
    } else {
        console.log("Resume")
        loop();
        isStopped = false;
        document.getElementById("Status").innerHTML=("Game Resumed")
       
    }
}

//pattern mode button
let drawmode = true;
function mode() {

    if (drawmode === true) {
        console.log("Pattern Mode");
        document.getElementById("DraworPattern").innerHTML=("Pattern Mode")
       

        drawmode = false;
    } else {
        console.log("Draw Mode")
        drawmode = true;
        document.getElementById("DraworPattern").innerHTML=("Draw Mode")
    }
}

//Select Color
SelectedColor = "red";
document.getElementById('Red').addEventListener("click", () => {
    document.getElementById('ColorButton').innerHTML = "Red"
    SelectedColor = "red";
    console.log("Red");
    
    
});
document.getElementById('Blue').addEventListener("click", () => {
    document.getElementById('ColorButton').innerHTML = "Blue"
    SelectedColor = "blue";
    console.log("Blue");
    
    
});document.getElementById('Green').addEventListener("click", () => {
    document.getElementById('ColorButton').innerHTML = "Green"
    SelectedColor = "green";
    console.log("Red");
    
    
});


function draw() {
    draw2();

    background('255');

    // var ctx = ();
    // ctx.canvas.width  = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;


    let c = SelectedColor;



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


    // Reset Rules
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
    // Clear board

    // patterns();
    cleanboard();
    function cleanboard() {
        document.getElementById('clean').addEventListener("click", () => {
            for (let i = 0; i < columns; i++) {
                for (let j = 0; j < rows; j++) {
                    // let someVariables = <condictions> : <when_true> : <when_false>;
                    // currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if

                    currentBoard[i][j] = 0; // one line if
                    nextBoard[i][j] = 0;
                    loop();
                }
            }
        });
    }


    //Slidervalue to FPS
    let fpsValue = slider.value();
    frameRate(fpsValue);

    fill(0);
    textSize(20);

    text('FPS: ' + fpsValue, 10, 40);

}



// resize
// function windowResized() {
//     resizeCanvas(windowWidth - 80, windowHeight - 100)
//     /*Calculate the number of columns and rows */
//     columns = floor(width / unitLength);
//     rows = floor(height / unitLength);

//     /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
//     for (let i = 0; i < columns; i++) {
//         if (!currentBoard[i]) {
//             currentBoard[i] = [];
//             nextBoard[i] = [];
//         }
//     }
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
    noLoop();
    console.log("Pause");
    document.getElementById("Status").innerHTML=("Game Paused")
    isStopped = true;
    const x = Math.floor(mouseX / unitLength);

    const y = Math.floor(mouseY / unitLength);
    console.log(mouseX, mouseY, x, y)
    currentBoard[x][y] = 1;
    fill("purple")
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

// initial board pattern
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // let someVariables = <condictions> : <when_true> : <when_false>;
            // currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if

            currentBoard[i][j] = 0; // one line if
            nextBoard[i][j] = 0;
            loop();
        }
    }
}
//random spawn

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

randominit();
function randominit() {
    document.getElementById('randominit').addEventListener("click", () => {
        randomSpawnLife()


    })

}

//pattern
const gliderPattern =
    `.O
..O
OOO`;

const GreyCounter =
    `......O......
.....O.O.....
....O.O.O....
.O..O...O..O.
O.O.O...O.O.O
.O..O...O..O.
....O.O.O....
.....O.O.....
......O......`;

const Spider =
    `......O...OOO.....OOO...O......
...OO.OOOOO.OO...OO.OOOOO.OO...
.O.OO.O.....O.O.O.O.....O.OO.O.
O...O.O...OOOOO.OOOOO...O.O...O
....OOO.....OO...OO.....OOO....
.O..O.OOO.............OOO.O..O.
...O.......................O...`;
SelectedPattern = gliderPattern;
document.getElementById('Glider').addEventListener("click", () => {
    document.getElementById('patternbutton').innerHTML = "Glider"

    console.log("Glider");
    SelectedPattern = gliderPattern;
    
});
document.getElementById('GreyCounter').addEventListener("click", () => {
    console.log("Greycounter")
    document.getElementById('patternbutton').innerHTML = "Grey Counter"
    SelectedPattern = GreyCounter;
});
document.getElementById('Spider').addEventListener("click", () => {
    console.log("Spider")
    document.getElementById('patternbutton').innerHTML = "Spider"
    SelectedPattern = Spider;
});

function insertPattern(x, y) {

    let parsedArray = SelectedPattern.split('\n')
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
    if (!drawmode)
        insertPattern(x, y)
}


function mouseReleased() {
    if (isStopped === false)
        loop();
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
}



//Cursor

// import { neonCursor } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'

// neonCursor({
//   el: document.getElementById('app'),
//   shaderPoints: 16,
//   curvePoints: 80,
//   curveLerp: 0.5,
//   radius1: 5,
//   radius2: 30,
//   velocityTreshold: 10,
//   sleepRadiusX: 100,
//   sleepRadiusY: 100,
//   sleepTimeCoefX: 0.0025,
//   sleepTimeCoefY: 0.0025
// })

function openPopup() {
    var popup = document.getElementById("popup");
    popup.classList.add("show");
  }
  
  function closePopup() {
    var popup = document.getElementById("popup");
    popup.classList.remove("show");
  }
  
  var openButton = document.getElementById("openButton");
  openButton.addEventListener("click", openPopup);