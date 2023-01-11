// question grid
let table;

// game number
// let gameId = 0;

// puzzle
let puzzle = [];

// solution
let solution = [];

//  functionality --> remaining number
let remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9];

// variable checking  "Sudoku Solver"  if it is solving the puzzle
let checsolved = false;
let cansolve = true;


// functionality --> timer
let timer = 0;
let pauseTimer = false;
let intervalid;
let gameOn = false;

// variable to maintain coins earned
var coins=50;

// For audio

var audio = new Audio('../sound effects/silent-wood.mp3');

function audio1(){
    var audio1 = new Audio('../sound effects/wining_coin.mp3');
    audio1.play();
}

function audio2(){
    var audio2 = new Audio('../sound effects/hint.mp3');
    audio2.play();
}

function audio3(){
    var audio3 = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    audio3.play();
}



// const highScoreString = localStorage.getItem(HIGH_SCORES);
// const highScores = JSON.parse(highScoreString) ?? [];

showDialogClick('dialog');

function newGame(difficulty) {

    //generating random positions for numbers for puzzle
    const grid = randomgridder();

    //Function call to make the rows and blocks and columns to solve the random grid jo create kiya
    const rows = grid;
    // console.log("rows")
    // console.log(rows)
    const cols = columnreturn(grid);
    // console.log("cols")
    // console.log(cols)
    const blocks = blockreturn(grid);
    // console.log("blocks")
    // console.log(blocks)

    //Grid Solving Code
    //check the allowed digit in each cell and then make them
    const possnumb = possnumbgen(rows, cols, blocks);

    solution = gridsovle(possnumb, rows, true);

    //new game so resetting the timer and remaining numbers
    timer = 0;
    for (const i in remaining)
        remaining[i] = 9;

    // Generating the number of empty cells on the basis of difficulty
    //Very Easy -->  59
    //Easy --> 64
    //Normal --> 69
    //Hard --> 74
    //Expert --> 79
    puzzle = gridgen(solution, difficulty);

    // game start when the difficulty = between 0 and  4
    gameOn = difficulty < 5 && difficulty >= 0;

    //Frontend Update
    displaypuzzle(puzzle);
    remainingtabelupd();

    //Starting the timer since all conditions have been met
    if (gameOn)
        startTimer();
}
// functionality --> random grid generation
function randomgridder() {
    let row;
    let i;
    const randmat = [];
    // random row and column for numbers
    for (i = 1; i <= 9; i++) {
        row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        let accept = true;
        for (let j = 0; j < randmat.length; j++) {

            // Since random hai, check possibility if number already present or not
            if (randmat[j][0] === i | (randmat[j][1] === row & randmat[j][2] === col)) {
                accept = false;
                i--;
                break;
            }
        }
        if (accept) {
            randmat.push([i, row, col]);
            // console.log("randmat")
            // console.log(randmat)
        }
    }

    // make a new empty grid as the answer
    const answer = [];
    for (i = 0; i < 9; i++) {
        row = "000000000";
        answer.push(row);
    }

    // put the numbers generated in the answer grid
    for (i = 0; i < randmat.length; i++) {
        answer[randmat[i][1]] = characterreplacement(answer[randmat[i][1]], randmat[i][2], randmat[i][0]);
    }
    // console.log("answer")
    // console.log(answer)
    return answer;
}

// columns returning function
function columnreturn(grid) {
    const result = ["", "", "", "", "", "", "", "", ""];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)
            result[j] += grid[i][j];
    }
    return result;
}

// block returning function
function blockreturn(grid) {
    const ans = ["", "", "", "", "", "", "", "", ""];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)
            ans[Math.floor(i / 3) * 3 + Math.floor(j / 3)] += grid[i][j];
    }
    return ans;
}

// character replacing function
function characterreplacement(string, index, char) {
    if (index > string.length - 1){
        // console.log("string")
        // console.log(string)
        return string;
    }
    // console.log("string.substr(0, index) + char + string.substr(index + 1)")
    // console.log(string.substr(0, index))
    // console.log(char)
    // console.log(string.substr(index + 1))
    // console.log(string.substr(0, index) + char + string.substr(index + 1))
    return string.substr(0, index) + char + string.substr(index + 1);
}
// functionality --> valid numbers return in each cell
function possnumbgen(rows, columns, blocks) {
    const possiblenum = [];
    // in each cell find numbers that are not present in a row , a column or a block
    // if cell is filled , valid number already present
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            possiblenum[i * 9 + j] = "";
            if (rows[i][j] != 0) {
                possiblenum[i * 9 + j] += rows[i][j];
            }
            else {
                for (var k = '1'; k <= '9'; k++) {
                    if (!rows[i].includes(k))
                        if (!columns[j].includes(k))
                            if (!blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)].includes(k))
                                possiblenum[i * 9 + j] += k;
                }
            }
        }
    }
    // console.log("possiblenum")
    // console.log(possiblenum)
    return possiblenum;
}

function gridsovle(possibleNumber, rows, startFromZero) {
    const solution = [];

    // Sudoku Solver using backtracking algorithm
    //  1 -->  find valid numbers  that can be  in each empty cell
    //  2 --> generate all possible rows that are valid in the first row depend on the allowed numbers
    //` 3 --> take one row from valid  rows and put it in the first row
    //  4 -->jump to the next row and find all valid numbers that fit in each cell over there.
    //  5 --> generate all possible rows that fit in this row then return step 3 until  you reach the last row or there are not  any possible rows remaining
    //  6 -->  if next row does not have any possible left then jump to the previous row and try the next possibility from possibility rows' list
    //  7 -->  if the last row has reached and a row fit in it has found then the grid has solved

    const result = stepup(0, possibleNumber, rows, solution, startFromZero);
    if (result === 1)
        return solution;
}

// functionality --> return current row number in the grid
function stepup(level, possibleNumber, rows, solution, startFromZero) {
    const x = possibleNumber.slice(level * 9, (level + 1) * 9);
    const y = rowgen(x);
    if (y.length === 0)
        return 0;

    // Check if the solution is unique
    const start = startFromZero ? 0 : y.length - 1;
    const stop = startFromZero ? y.length - 1 : 0;
    const step = startFromZero ? 1 : -1;
    let condition = startFromZero ? (start <= stop) : (start >= stop);

    for (let num = start; condition; num += step) {
        condition = startFromZero ? (num + step <= stop) : (num + step >= stop);
        for (let i = level + 1; i < 9; i++)
            solution[i] = rows[i];
        solution[level] = y[num];
        if (level < 8) {
            const cols = columnreturn(solution);
            const blocks = blockreturn(solution);

            const poss = possnumbgen(solution, cols, blocks);
            if (stepup(level + 1, poss, rows, solution, startFromZero) === 1)
                return 1;
        }
        if (level == 8)
            return 1;
    }
    return -1;
}

// functionality --> row generation
function rowgen(posnum) {
    const ans = [];

    function step(level, posrow) {
        if (level === 9) {
            ans.push(posrow);
            return;
        }

        for (const i in posnum[level]) {
            if (posrow.includes(posnum[level][i]))
                continue;
            step(level + 1, posrow + posnum[level][i]);
            // console.log("posrow + posnum[level][i]")
            // console.log(posrow + posnum[level][i])
        }
    }

    step(0, "");

    return ans;
}

// based on grid's difficulty make grid with empty cells
function gridgen(grid, difficulty) {

        // difficulty:
        // expert   : 0
        // hard     : 1
        // Normal   : 2
        // easy     : 3
        // very easy: 4

    // empty_cell_count = 5 * difficulty + 20
    // when difficulty = 13, empty_cell_count = 85 > (81 total cells count)
    // then puzzle is displayed with entirely solved
    if (!(difficulty < 5 && difficulty > -1))
        difficulty = 13;
    let remainedValues = 81;
    const puzzle = grid.slice(0);

    function valueclearance(grid, x, y, remainedValues) {
        function symmetricfinder(x, y) {
            const symmetricx = 8 - x;  //Symmetry
            const symmetricy = 8 - y;
            return [symmetricx, symmetricy];
        }

        const sym = symmetricfinder(x, y);
        if (grid[y][x] !== 0) {
            grid[y] = characterreplacement(grid[y], x, "0")
            remainedValues--;
            if (x != sym[0] && y != sym[1]) {
                grid[sym[1]] = characterreplacement(grid[sym[1]], sym[0], "0")
                remainedValues--;
            }
        }
        return remainedValues;
    }

    while (remainedValues > (difficulty * 5 + 20)) {
        const x = Math.floor(Math.random() * 9);
        const y = Math.floor(Math.random() * 9);
        remainedValues = valueclearance(puzzle, x, y, remainedValues);
    }
    return puzzle;
}

// view grid in html page
function displaypuzzle(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            cellclasscon(table.rows[i].cells[j].getElementsByTagName('input')[0]);
            if (grid[i][j] === "0") {
                input.disabled = false;
                input.value = "";
            }
            else {
                input.disabled = true;
                input.value = grid[i][j];
                remaining[grid[i][j] - 1]--;
            }
        }
    }
}

// read current grid which is made
function readinp() {
    const result = [];
    for (let i = 0; i < 9; i++) {
        result.push("");
        for (let j = 0; j < 9; j++) {
            const input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            if (input.value === "" || input.value.length > 1 || input.value === "0") {
                input.value = ""
                result[i] += "0";
            }
            else
                result[i] += input.value;
        }
    }
    return result;
}
// Main function to check the inputted values
//  0 --> for value can not be changed
//  1 --> for correct value
//  2 --> for value that isn't causing problem to other numbers
//  3 --> for value that creates problems with  value in its row, column or block
//  4 --> for incorrect input
function valuechecking(value, row, column, block, defval, corrval) {
    if (value === "" || value === '0')
        return 0;
    if (!(value > '0' && value < ':'))
        return 4;
    if (value === defval)
        return 0;
    if ((row.indexOf(value) !== row.lastIndexOf(value))
        || (column.indexOf(value) !== column.lastIndexOf(value))
        || (block.indexOf(value) !== block.lastIndexOf(value))) {
        audio3();
        return 3;
    }
    if (value !== corrval)
        return 2;
    return 1;
}

//updating the class of the cell
function cellclasscon(input, className) {

    input.classList.remove("right-cell");
    input.classList.remove("worning-cell");
    input.classList.remove("wrong-cell");

    if (className !== undefined)
        input.classList.add(className);
}

// functionality --> update value of remaining numbers in html page
function remainingtabelupd() {
    for (var i = 1; i < 10; i++) {
        var item = document.getElementById("remain-" + i);
        item.innerText = remaining[i - 1];
        item.classList.remove("red");
        item.classList.remove("gray");
        if (remaining[i - 1] === 0)
            item.classList.add("gray");
        else if (remaining[i - 1] < 0 || remaining[i - 1] > 9)
            item.classList.add("red");
    }
}
                                //Timer functions
// start stopwatch timer
function startTimer() {
    const timerDiv = document.getElementById("timer");
    clearInterval(intervalid);

    // change stopwatch value every one second on page
    pauseTimer = false;
    intervalid = setInterval(function () {
        if (!pauseTimer) {
            timer++;
            const min = Math.floor(timer / 60);
            const sec = timer % 60;
            timerDiv.innerText = (("" + min).length < 2 ? ("0" + min) : min) + ":" + (("" + sec).length < 2 ? ("0" + sec) : sec);
        }
    }, 1000);
}

// input: changeUI boolean      true to allow function to change UI
// return
//  0 when everything is going right
//  1 when grid is  solved
//  2 when invalid input
//  3 when no solution
function solveSudoku(flaguichange) {
    puzzle = readinp();
    const columns = columnreturn(puzzle);
    const blocks = blockreturn(puzzle);

    // check if there is any issues with conditions
    let errors = 0;
    let correct = 0;

    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[i].length; j++) {
            const result = valuechecking(puzzle[i][j], puzzle[i], columns[j], blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)], -1, -1);
            correct = correct + ((result === 2) ? 1 : 0);
            errors = errors + ((result > 2) ? 1 : 0);
            cellclasscon(table.rows[i].cells[j].getElementsByTagName('input')[0], result > 2 ? "wrong-cell" : undefined)
        }
    }

    // check if wrong input daala
    if (errors > 0) {
        cansolve = false;
        return 2;
    }

    cansolve = true;
    checsolved = true;

    // checking if the grid is already solved
    if (correct === 81) {
        return 1;
    }
    //read the present time on screen
    let time = Date.now();
    solution = gridsovle(possnumbgen(puzzle, columns, blocks), puzzle, true);

    // displaying the  result
    time = Date.now() - time;

    if (flaguichange)
        document.getElementById("timer").innerText = Math.floor(time / 1000) + "." + ("000" + (time % 1000)).slice(-3);


    if (solution === undefined) {
        checsolved = false;
        cansolve = false;
        return 3;
    }

    if (flaguichange) {
        remaining = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        remainingtabelupd();
        displaypuzzle(solution);
    }
    return 0;
}

//functionality -->  hiding the  more option menu
function hideMoreOptionMenu() {
    const moreOptionList = document.getElementById("more-option-list");
    if (moreOptionList.style.visibility === "visible") {
        moreOptionList.style.maxWidth = "40px";
        moreOptionList.style.minWidth = "40px";
        moreOptionList.style.maxHeight = "10px";
        moreOptionList.style.opacity = "0";
        setTimeout(function () {
            moreOptionList.style.visibility = "hidden";
        }, 175);
    }
}

// function --> dialogue to display on opening the game.html
window.onload = function () {

    let i;
// give the table values
    table = document.getElementById("puzzle-grid");
    // UI ---> add rippling effect to all buttons
    const rippleButtons = document.getElementsByClassName("button");
    for (i = 0; i < rippleButtons.length; i++) {
        rippleButtons[i].onmousedown = function (e) {

            const a = e.pageX - this.offsetLeft;
            const b = e.pageY - this.offsetTop;

            const rippleItem = document.createElement("div");
            rippleItem.classList.add('ripple');
            rippleItem.setAttribute("style", "left: " + a + "px; top: " + b + "px");

            const rippleColor = this.getAttribute('ripple-color');
            if (rippleColor)
                rippleItem.style.background = rippleColor;
            this.appendChild(rippleItem);

            // setting time limit to the ripple effect
            setTimeout(function () {
                rippleItem.parentElement.removeChild(rippleItem);
            }, 1500);
        };
    }
    for (i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const input = table.rows[i].cells[j].getElementsByTagName('input')[0];
            //functionality --> remove color from cell on change anf then update the remaining number ka table
            input.onchange = function () {
                console.log("here")
                //calling function to change color
                cellclasscon(this);

                function checkInput(input) {
                    console.log(input.value)
                    if(isNaN(input.value[0])){
                        input.value = "";
                        alert("only numbers [1-9] and question mark '?' are allowed!!");
                        input.focus()
                    }
                    if (input.value[0] < '1' || input.value[0] > '9') {
                        if (input.value != "?" && input.value != "؟") {
                            input.value = "";
                            alert("only numbers [1-9] and question mark '?' are allowed!!");
                            input.focus()
                        }
                    }
                }
                checkInput(this);
                // check new input and update the remaining numbers ka table
                if (this.value > 0 && this.value < 10)
                    remaining[this.value - 1]--;
                if (this.oldvalue !== "") {
                    if (this.oldvalue > 0 && this.oldvalue < 10)
                        remaining[this.oldvalue - 1]++;
                }

                cansolve = true;
                remainingtabelupd();
            };

            input.onfocus = function () {
                this.oldvalue = this.value;
            };
        }
    }
}

// functionality --> function to hide the dialog which is opened in the window
window.onclick = function (event) {
    const d1 = document.getElementById("dialog");
    const d2 = document.getElementById("about-dialog");
    const m1 = document.getElementById("more-option-list");

    if (event.target == d1) {
        hideDialogButtonClick("dialog");
    } else if (event.target == d2) {
        hideDialogButtonClick("about-dialog");
    } else if (m1.style.visibility == "visible") {
        hideMoreOptionMenu();
    }
}

// displaying -->  hamburger menu
function HamburgerButtonClick() {
    const div = document.getElementById("hamburger-menu");
    const menu = document.getElementById("nav-menu");
    div.style.display = "block";
    div.style.visibility = "visible";
    setTimeout(function () {
        div.style.opacity = 1;
        menu.style.left = 0;
    }, 50);
}

// start new game
function startgameclickbutton() {
    const difficulties = document.getElementsByName('difficulty');
    // setting 5 to difficulty to assume it is solved
    let difficulty = 5;

    for (let i = 0; i < difficulties.length; i++) {
        if (difficulties[i].checked) {
            newGame(4 - i);
            difficulty = i;
            break;
        }
    }

    hideDialogButtonClick('dialog');
    // gameId++;
    document.getElementById("game-difficulty-label").innerText = "Game Status";
    document.getElementById("game-difficulty").innerHTML = "Unsolved";
    if(difficulty==0){
        coins=50;
        coin_update();
    } 
    else if(difficulty==1){
        coins=40;
        coin_update();
    }
    else if(difficulty==2){
        coins=30;
        coin_update();
    }
    else if(difficulty==3){
        coins=20;
        coin_update();
    }
    else if(difficulty==4){
        coins=10;
        coin_update();
    }
    // for new game
    document.getElementById("timer-label").innerText = "Time";
    document.getElementById("timer").innerText = "00:00";
    document.getElementById("game-difficulty-label").innerText = "Game difficulty";

    document.getElementById("game-difficulty").innerText = difficulty < difficulties.length ? difficulties[difficulty].value : "Unsolved";
}

// pause \ continue button click function
function pausebuttonclick() {
    const icon = document.getElementById("pause-icon");
    const label = document.getElementById("pause-text");

    // change icon and label of the button and hide or show the grid
    if (pauseTimer) {
        icon.innerText = "pause";
        label.innerText = "Pause";
        table.style.opacity = 1;
    }
    else {
        icon.innerText = "play_arrow";
        label.innerText = "Continue";
        table.style.opacity = 0;
    }

    pauseTimer = !pauseTimer;
}

// check grid if correct
function checkbutton() {

    if (gameOn) {
        // penalty of 1 minute
        timer += 60;
        let currentGrid = [];

        currentGrid = readinp();

        const columns = columnreturn(currentGrid);
        const blocks = blockreturn(currentGrid);

        let errors = 0;
        let corrects = 0;

        for (let i = 0; i < currentGrid.length; i++) {
            for (let j = 0; j < currentGrid[i].length; j++) {
                if (currentGrid[i][j] === "0")
                    continue;

                const result = valuechecking(currentGrid[i][j], currentGrid[i], columns[j], blocks[Math.floor(i / 3) * 3 + Math.floor(j / 3)], puzzle[i][j], solution[i][j]);

                cellclasscon(table.rows[i].cells[j].getElementsByTagName('input')[0], result === 1 ? "right-cell" : (result === 2 ? "worning-cell" : (result === 3 ? "wrong-cell" : undefined)));

                if (result === 1 || result === 0) {
                    corrects++;
                } else if (result === 3) {
                    errors++;
                }
            }
        }

        // if all values are correct, and they equal original values then game over and the puzzle has been solved
        // else not solved
        if (corrects === 81) {
            gameOn = false;
            pauseTimer = true;
            document.getElementById("game-difficulty-label").innerText = "Game Status";
            document.getElementById("game-difficulty").innerText = "Solved";

            clearInterval(intervalid);
            alert("Congratulations, the puzzle has been solved. 5 coins earned. ");
            //game solved, 5 coins earned
            coins+=5;
            coin_update();
            audio1();
        }
        else if (errors === 0 && corrects === 0) {
            alert("Congrats, You solved it, but this is not the solution that I want.");
        }
    }
}

// restart game
function restartbutton() {

    if (gameOn) {
        // reset remaining number table
        for (const i in remaining)
            remaining[i] = 9;
        displaypuzzle(puzzle);
        remainingtabelupd();

        // restart the timer
        // -1 because it takes 1 second to update to finally it will start from 0
        timer = -1;
    }
}

// surrender
function surrendersolve() {
    if (gameOn) {
        for (const i in remaining)
            remaining[i] = 9;
        displaypuzzle(solution);
        remainingtabelupd();
        gameOn = false;
        pauseTimer = true;
        clearInterval(intervalid);

        // change game status to solved
        audio3();
        document.getElementById("game-difficulty-label").innerText = "Game Status";
        document.getElementById("game-difficulty").innerText = "Surrendered";
    }
}

//hint function to first check coin balance>2
function hintbutton_1() {
    if(coins>=2){
        audio2();
        if (confirm("2 coins and 1 min penalty for hint.") == true) {
            coins-=2;
            coin_update();
            hintbutton();
            
        }
    }
    else{
        alert("Less coins for a hint.");
        
    }
}

// hint
function hintbutton() {

    let index;
// put correct value in a random cell
    let input;
    if (gameOn) {

        let i;
        const empty_cells_list = [];
        const wrong_cells_list = [];
        for (i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                input = table.rows[i].cells[j].getElementsByTagName('input')[0];
                if (input.value == "" || input.value.length > 1 || input.value == "0") {
                    empty_cells_list.push([i, j])
                }
                else {
                    if (input.value !== solution[i][j])
                        wrong_cells_list.push([i, j])
                }
            }
        }

        // if grid solved then stop the game
        if (empty_cells_list.length === 0 && wrong_cells_list.length === 0) {
            gameOn = false;
            pauseTimer = true;
            document.getElementById("game-difficulty-label").innerText = "Game Status";
            document.getElementById("game-difficulty").innerText = "Solved";
            clearInterval(intervalid);
            alert("Congratulations, the puzzle has been solved ");
            const name = prompt("You got a high score! Enter name:");
        }
        else {
            timer += 60;
            if ((Math.random() < 0.5 && empty_cells_list.length > 0) || wrong_cells_list.length === 0) {
                index = Math.floor(Math.random() * empty_cells_list.length);
                input = table.rows[empty_cells_list[index][0]].cells[empty_cells_list[index][1]].getElementsByTagName('input')[0];
                input.oldvalue = input.value;
                input.value = solution[empty_cells_list[index][0]][empty_cells_list[index][1]];
                remaining[input.value - 1]--;
            }
            else {
                index = Math.floor(Math.random() * wrong_cells_list.length);
                input = table.rows[wrong_cells_list[index][0]].cells[wrong_cells_list[index][1]].getElementsByTagName('input')[0];
                input.oldvalue = input.value;
                remaining[input.value - 1]++;
                input.value = solution[wrong_cells_list[index][0]][wrong_cells_list[index][1]];
                remaining[input.value - 1]--;
            }
            remainingtabelupd();
        }
        // hint given cell ko blink karo
        let count = 0;
        for (i = 0; i < 6; i++) {
            setTimeout(function () {
                if (count % 2 === 0)
                    input.classList.add("right-cell");
                else
                    input.classList.remove("right-cell");
                count++;
            }, i * 500)
        }
    }
    
}
//functionality --> displaying the dialogue box whenever wanted
function showDialogClick(dialogId) {
    hideHamburgerClick();

    const dialog = document.getElementById(dialogId);
    const dialogBox = document.getElementById(dialogId + "-box");
    dialogBox.focus();
    dialog.style.opacity = 0;
    dialogBox.style.marginTop = "-500px";
    dialog.style.display = "block";
    dialog.style.visibility = "visible";
    setTimeout(function () {
        dialog.style.opacity = 1;
        dialogBox.style.marginTop = "64px";
    }, 200);
}

function hideDialogButtonClick(dialogId) {
    const dialog = document.getElementById(dialogId);
    const dialogBox = document.getElementById(dialogId + "-box");
    dialog.style.opacity = 0;
    dialogBox.style.marginTop = "-500px";

    setTimeout(function () {
        dialog.style.visibility = "collapse";
        //dialog.style.display = "none";
    }, 500);
}

function hideHamburgerClick() {
    const div = document.getElementById("hamburger-menu");
    const menu = document.getElementById("nav-menu");
    menu.style.left = "-256px";

    setTimeout(function () {
        div.style.opacity = 0;
        //divstyle.display = "none";
        div.style.visibility = "collapse";
    }, 200);
}
// solving the sudoku
function menusudoku() {
    hideHamburgerClick();
    if (gameOn) {
        gameOn = false;
        clearInterval(intervalid);
    }
    solution = [];
    cansolve = true;
    checsolved = false;
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid.push("");
        for (let j = 0; j < 9; j++) {
            grid[i] += "0";
        }
    }
    displaypuzzle(grid);
    remaining = [9, 9, 9, 9, 9, 9, 9, 9, 9];
    remainingtabelupd();
    document.getElementById("moreoption-sec").style.display = "none";
    document.getElementById("pause-btn").style.display = "none";
    document.getElementById("check-btn").style.display = "none";
    document.getElementById("isunique-btn").style.display = "block";
    document.getElementById("solve-btn").style.display = "block";

    document.getElementById("timer-label").innerText = "Solve time";
    document.getElementById("timer").innerText = "00:00";
    document.getElementById("game-difficulty-label").innerText = "Is unique";
    document.getElementById("game-difficulty").innerText = "Unknown";
    document.getElementById("game-number").innerText = "#Soduko_Solver"

    document.getElementById("puzzle-grid").rows[0].cells[0].getElementsByTagName('input')[0].focus();
}
//functionality --> solving the grid
function solveButtonClick() {
    if (gameOn) {
        gameOn = false;
        clearInterval(intervalid);
    }
    const result = solveSudoku(true);
    switch (result) {
        case 0:
            alert("SOLVED");
            break;
        case 1:
            alert("This grid is already solved")
            break;
        case 2:
            alert("This grid can't be solved because of an invalid input")
            break;
        case 3:
            alert("This grid has no solution");
            break;
    }
}

function isUniqueButtonClick() {
    if (!checsolved) {
        if (cansolve)
            solveSudoku(false);
    }
    if (!checsolved) {
        alert("Can't check this grid because it is unsolvable!");
        return;
    }
    const columns = columnreturn(puzzle);
    const blocks = blockreturn(puzzle);
    const solution2 = gridsovle(possnumbgen(puzzle, columns, blocks), puzzle, false);

    let unique = true;
    for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[i].length; j++) {
            if (solution[i][j] !== solution2[i][j]) {
                unique = false;
                break;
            }
            if (!unique)
                break;
        }
    }

    //display the result
    document.getElementById("game-difficulty").innerText = unique ? "Yes" : "No";
}

window.onpaint = coin_update();
window.onpaint=document.getElementById("sound").innerHTML=`<img src="../speaker.png" alt="speaker" />`;

function coin_update(){
    // coins= 50;
    document.getElementById("coins_display").innerHTML="Available Coins : "+ coins;
    audio.play();
}

function muteMe() {
    if(audio.muted==false){
        audio.muted = true;
        audio.pause();
        document.getElementById("sound").innerHTML=`<img src="../mute.png" alt="mute" />`;
    }
    else{
        audio.play();
        document.getElementById("sound").innerHTML=`<img src="../speaker.png" alt="speaker" />`;
        audio.muted=false;

    }
}
