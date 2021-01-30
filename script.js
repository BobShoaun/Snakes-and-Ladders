class Tile {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Ladder {
	constructor(startX, startY, endX, endY) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
	}
	getAngle() {
		return Math.atan((this.endY - this.startY) / (this.endX - this.startX));
	}
	getLength() {
		return Math.sqrt(Math.pow(this.endY - this.startY, 2) + Math.pow(this.endX - this.startX, 2));
	}
}

const height = 10;
const width = 10;

let board = initializeBoard();
let player = new Player(0, 0);
let player2 = new Player(4, 0);
let ladders = [new Ladder(1, 0, 4, 3), new Ladder(6, 4, 9, 9), new Ladder(5, 0, 4, 8), new Ladder(7, 2, 2, 9)];
// let snakes = [new Ladder()]



renderBoard();

function restart() {
  document.getElementById("win").hidden = true;
  player.x = 0;
  player.y = 0;
  renderBoard();
}

function initializeBoard() {
	let board = [];
	for (let y = 0; y < height; y++) {
		let array = [];
		for (let x = 0; x < width; x++) {
			array.push(new Tile(x, y));
		}
		board.push(array);
	}
	return board;
}

function initializeLadders() {}

function renderBoard() {
	let output = document.getElementById("board");
	output.innerHTML = "";
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");

			if (player.x == x && player.y == y) {
				// tile.classList.add("player");
        let playerDiv = document.createElement("div");
        playerDiv.classList.add('player');
				tile.appendChild(playerDiv);
      }
      
      // if (player2.x == x && player2.y == y) {
			// 	tile.classList.add("player");
			// 	// tile.innerHTML = "hello";
			// 	let playerDiv = document.createElement("div");
			// 	tile.appendChild(playerDiv);
			// }

			ladders.forEach(ladder => {
				if (ladder.startX == x && ladder.startY == y) {
					// tile.classList.add("ladder-start");
          let ladderDiv = document.createElement("div");
          ladderDiv.classList.add('ladder-start');
					tile.appendChild(ladderDiv);
          
          // ladder orientation and rotation
					ladderDiv.style.width = `${ladder.getLength() * 67}px`;
					let translation = "translate(35px, -10px)";
					let angle = (ladder.getAngle() * 180) / Math.PI;
					if (angle < 0) {
						angle += 180;
						translation = "translate(15px, -40px)";
					}

					ladderDiv.style.transform = `rotate(${angle}deg) ${translation}`;
					// console.log((ladder.getAngle() * 180) / Math.PI);
				}
				if (ladder.endX == x && ladder.endY == y) {
					tile.classList.add("ladder-end");
				}
			});

			let coords = document.createElement("p");
			coords.innerText = `${board[y][x].x}${board[y][x].y}`;
			coords.classList.add("coords");
			tile.appendChild(coords);

			output.append(tile);
		}
	}
}

async function rollDice() {
	let result = Math.floor(Math.random() * 6) + 1;
	// result = 1;
  document.getElementById("dice-results").innerText = `dice: ${result}`;
  document.getElementById("roll-dice").disabled = true;
	for (let i = 0; i < result; i++) {
		await new Promise(resolve => setTimeout(resolve, 200));
		movePlayer();
		// setTimeout(movePlayer, 200 * i);
    checkWin();
  }
  document.getElementById("roll-dice").disabled = false;
  
	// console.log("finished moving player");
	checkLadder();
	return result;
}

function movePlayer() {
	if (player.y % 2 == 0) {
		// at even row
		if (player.x >= width - 1) {
			// reached boundary, wrap
			player.y++;
		} else {
			player.x++;
		}
	} else {
		if (player.x <= 0) {
			// reached boundary at front, wrap
			player.y++;
		} else {
			player.x--;
		}
	}
	renderBoard();
}

function checkLadder() {
	// console.log("chekcing ladder");
	ladders.forEach(ladder => {
		if (ladder.startX == player.x && ladder.startY == player.y) {
			player.x = ladder.endX;
			player.y = ladder.endY;
			renderBoard();
		}
	});
}

function checkWin() {
	if (height % 2 == 0) {
		// player wins when they are at x = 0
		if (player.y >= height - 1 && player.x <= 0) {
			console.log("WIN");
			document.getElementById("win").hidden = false;
		}
	} else {
		// player wins at x = width - 1
		if (player.y >= height - 1 && player.x >= width - 1) {
			console.log("WIN");
			document.getElementById("win").hidden = false;
		}
	}
}
