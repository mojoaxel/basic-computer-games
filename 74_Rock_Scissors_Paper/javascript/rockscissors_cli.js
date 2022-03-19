#!/usr/bin/env node

// ===========================================================================
// input/output helpers

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

function print(...messages) {
	process.stdout.write(messages.join("") + "\n");
}

function tab(count) {
	return " ".repeat(count);
}

async function input(message = '') {
	return new Promise((resolve, reject) => {
		rl.question(`${message} `, resolve);
	});
}

// ===========================================================================
// The actual game starts here

let userWins = 0;
let computerWins = 0;
let ties = 0;

// 30 INPUT "HOW MANY GAMES";Q
// 40 IF Q<11 THEN 60
// 50 PRINT "SORRY, BUT WE AREN'T ALLOWED TO PLAY THAT MANY.": GOTO 30
// 60 FOR G=1 TO Q
const getGameCount = async () =>  {
	let gameCount = await input("HOW MANY GAMES");
	if (gameCount > 10) {
		print("SORRY, BUT WE AREN'T ALLOWED TO PLAY THAT MANY.");
		return await getGameCount();
	}
	return gameCount;
}

// #90 PRINT "3=ROCK...2=SCISSORS...1=PAPER"
// #100 INPUT "1...2...3...WHAT'S YOUR CHOICE";K
// #110 IF (K-1)*(K-2)*(K-3)<>0 THEN PRINT "INVALID.": GOTO 90
const getUserInput = async () => {
	print("3=ROCK...2=SCISSORS...1=PAPER");
	const K = await input("1...2...3...WHAT'S YOUR CHOICE");
	if (K < 1 || K > 3) {
		print("INVALID.");
		return await getUserInput();
	}
	return K;
}

async function game() {
	// 10 PRINT TAB(21);"GAME OF ROCK, SCISSORS, PAPER"
	// 20 PRINT TAB(15);"CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY"
	// 25 PRINT:PRINT:PRINT
	print(tab(21), 'GAME OF ROCK, SCISSORS, PAPER');
	print(tab(15), 'CREATIVE COMPUTING  MORRISTOWN, NEW JERSEY');
	print('\n');


	let gameCount = await getGameCount();

	const playGame = async (gameNumber) => {
		// 70 PRINT: PRINT "GAME NUMBER";G
		print("\nGAME NUMBER ", gameNumber);

		const ROCK = 3;
		const SCISSORS = 2;
		const PAPER = 1;

		const usersChoice = await getUserInput();

		// 80 X=INT(RND(1)*3+1)
		const computersChoice = Math.floor(Math.random()*3) + 1;

		// 120 PRINT "THIS IS MY CHOICE..."
		// 130 ON X GOTO 140,150,160
		// 140 PRINT "...PAPER": GOTO 170
		// 150 PRINT "...SCISSORS": GOTO 170
		// 160 PRINT "...ROCK"
		print("THIS IS MY CHOICE...", 
			computersChoice === PAPER ? "...PAPER" : 
				computersChoice === SCISSORS ? "...SCISSORS" : 
					"...ROCK");


		// 170 IF X=K THEN 250
		// 180 IF X>K THEN 230
		// 190 IF X=1 THEN 210
		// 200 PRINT "YOU WIN!!!":H=H+1: GOTO 260
		// 210 IF K<>3 THEN 200
		// 220 PRINT "WOW!  I WIN!!!":C=C+1:GOTO 260
		// 230 IF K<>1 OR X<>3 THEN 220
		// 240 GOTO 200
		// 250 PRINT "TIE GAME.  NO WINNER."
		if (computersChoice == usersChoice) {
			print("TIE GAME.  NO WINNER.");
			ties++;
		} else if (
			(computersChoice == ROCK && usersChoice == SCISSORS) ||
			(computersChoice == PAPER && usersChoice == ROCK) ||
			(computersChoice == SCISSORS && usersChoice == PAPER)
		) {
			print("WOW!  I WIN!!!");
			computerWins++;
		} else {
			print("YOU WIN!!!");
			userWins++;
		}
	}

	for (let gameNumber = 1; gameNumber <= gameCount; gameNumber++) {
		await playGame(gameNumber);
		// 260 NEXT G
	}

	// 270 PRINT: PRINT "HERE IS THE FINAL GAME SCORE:"
	// 280 PRINT "I HAVE WON";C;"GAME(S)."
	// 290 PRINT "YOU HAVE WON";H;"GAME(S)."
	// 300 PRINT "AND";Q-(C+H20);"GAME(S) ENDED IN A TIE."
	print("\nHERE IS THE FINAL GAME SCORE:");
	print(`I HAVE WON ${computerWins} GAME(S).`);
	print(`YOU HAVE WON ${userWins} GAME(S).`);
	print(`AND ${ties} GAME(S) ENDED IN A TIE.`);

	// 310 PRINT: PRINT "THANKS FOR PLAYING!!"
	print("\nTHANKS FOR PLAYING!!");
	
	// 320 END
	process.exit(0);
}
game();
