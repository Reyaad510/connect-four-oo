/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(width = 7, height = 6) {
    this.width = width;
    this.height = height;
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.currPlayer = 1; // active player: 1 or 2
    this.makeBoard();
    this.makeHtmlBoard();
  }

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    const { width, height, board } = this;
    for (let y = 0; y < height; y++) {
      /* Codw below creates a new array that specifies the length of the new array
       
      and will do it "y" more times whatever the height is
      */
      board.push(Array.from({ length: width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const { width, height } = this;
    const board = document.getElementById("board");

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    // Outer loop for each row (y-axis)
    for (let y = 0; y < height; y++) {
      // Create a new table row for each iteration
      const row = document.createElement("tr");

      // Inner loop for each cell in the row (x-axis)
      for (let x = 0; x < width; x++) {
        const cell = document.createElement("td"); // Create a new table cell for each iteration
        cell.setAttribute("id", `${y}-${x}`); // Set the id attribute of the cell using y and x coordinates
        row.append(cell); // Append the cell to the current row
      }

      board.append(row); // Append the row to the board
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    const { board, endGame, currPlayer } = this;
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    console.log(y);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
      return endGame("Tie!");
    }

    // switch players
    this.currPlayer = currPlayer === 1 ? 2 : 1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const { width, height, board, currPlayer } = this;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < height &&
          x >= 0 &&
          x < width &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

new Game();

/*
makeBoard()
[
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined]
]


makeHtmlBoard()
<div id="board">
  <tr id="column-top">
    <td id="0"></td>
    <td id="1"></td>
    <td id="2"></td>
    <td id="3"></td>
    <td id="4"></td>
    <td id="5"></td>
    <td id="6"></td>
  </tr>
  <tr>
    <td id="0-0"></td>
    <td id="0-1"></td>
    <td id="0-2"></td>
    <td id="0-3"></td>
    <td id="0-4"></td>
    <td id="0-5"></td>
    <td id="0-6"></td>
  </tr>
  <tr>
    <td id="1-0"></td>
    <td id="1-1"></td>
    <td id="1-2"></td>
    <td id="1-3"></td>
    <td id="1-4"></td>
    <td id="1-5"></td>
    <td id="1-6"></td>
  </tr>
  <tr>
    <td id="2-0"></td>
    <td id="2-1"></td>
    <td id="2-2"></td>
    <td id="2-3"></td>
    <td id="2-4"></td>
    <td id="2-5"></td>
    <td id="2-6"></td>
  </tr>
  <tr>
    <td id="3-0"></td>
    <td id="3-1"></td>
    <td id="3-2"></td>
    <td id="3-3"></td>
    <td id="3-4"></td>
    <td id="3-5"></td>
    <td id="3-6"></td>
  </tr>
  <tr>
    <td id="4-0"></td>
    <td id="4-1"></td>
    <td id="4-2"></td>
    <td id="4-3"></td>
    <td id="4-4"></td>
    <td id="4-5"></td>
    <td id="4-6"></td>
  </tr>
  <tr>
    <td id="5-0"></td>
    <td id="5-1"></td>
    <td id="5-2"></td>
    <td id="5-3"></td>
    <td id="5-4"></td>
    <td id="5-5"></td>
    <td id="5-6"></td>
  </tr>
</div>
*/
