const gameContainer = document.getElementById('game');

let COLORS = [];

// start game
let startBtn = document.querySelector('#start');
startBtn.addEventListener('click', function() {
	window.scrollTo(0, document.body.scrollHeight);
});
//https://stackoverflow.com/questions/11715646/scroll-automatically-to-the-bottom-of-the-page

// randomize colors
function randomizeColors(num) {
	let counter = 0;
	let r;
	let g;
	let b;
	let randomColor;
	while (counter < num / 2) {
		r = Math.floor(Math.random() * 256);
		g = Math.floor(Math.random() * 256);
		b = Math.floor(Math.random() * 256);
		randomColor = `rgb(${r},${g},${b})`;
		COLORS.push(randomColor);
		COLORS.push(randomColor);
		counter++;
	}
}

randomizeColors(10);

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);
		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// TODO: Implement this function!
let counter = 0;
let countScore = 0;
let displayScore = document.querySelector('#displayScore');
let numOfCards = COLORS.length;
let displayBestScore = document.querySelector('#bestScore');
let firstGuess = '';
let secondGuess = '';

function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	let div = event.target;
	if (counter < 2) {
		counter++;
		countScore++;
		displayScore.innerText = countScore;

		div.style.background = event.target.className;
		div.removeEventListener('click', handleCardClick, false);
		compareCards(div);
	}
	if (numOfCards === 0) {
		bestScore(countScore);
		displayBestScore.innerText = localStorage.getItem('countScore');
	}
}

// find matching cards
function compareCards(card) {
	firstGuess === '' ? (firstGuess = card) : (secondGuess = card);
	if (firstGuess && secondGuess) {
		if (firstGuess.className === secondGuess.className) {
			setTimeout(clearSet, 1000);
			numOfCards -= 2;
		} else {
			setTimeout(function() {
				firstGuess.style.background = '';
				secondGuess.style.background = '';
				firstGuess.addEventListener('click', handleCardClick);
				secondGuess.addEventListener('click', handleCardClick);
				clearSet();
			}, 1000);
		}
	}
}

// after making 2 guesses, will clear cycle
function clearSet() {
	firstGuess = '';
	secondGuess = '';
	counter = 0;
}

// clear everything else (not in clearSet)
function clearSet2() {
	countScore = 0;
	displayScore.innerText = 0;
	numOfCards = COLORS.length;
	gameContainer.innerHTML = '';
	shuffledColors = shuffle(COLORS);
	createDivsForColors(shuffledColors);
}

// reset game
let reset = document.querySelector('#reset');
let mode;

reset.addEventListener('click', function() {
	clearSet();
	clearSet2();
	if (mode === 'medium') {
		for (let card of gameContainer.childNodes) {
			card.style.height = '150px';
			card.style.width = '20%';
		}
	}
	if (mode === 'hard') {
		for (let card of gameContainer.childNodes) {
			card.style.height = '150px';
			card.style.width = '15%';
		}
	}
});

// store best score into localStorage
function bestScore(score) {
	if (localStorage.getItem('countScore')) {
		let oldScore = localStorage.getItem('countScore');
		let lowestScore = Math.min(oldScore, score);
		localStorage.setItem('countScore', lowestScore);
	} else {
		localStorage.setItem('countScore', score);
	}
}

// when the DOM loads
createDivsForColors(shuffledColors);
if (localStorage.getItem('countScore')) {
	displayBestScore.innerText = localStorage.getItem('countScore');
}

// select difficulty level
let easy = document.querySelector('#easy');
let medium = document.querySelector('#medium');
let hard = document.querySelector('#hard');

easy.addEventListener('click', function() {
	COLORS = [];
	randomizeColors(10);
	clearSet();
	clearSet2();
	mode = 'easy';
});
medium.addEventListener('click', function() {
	COLORS = [];
	randomizeColors(12);
	clearSet();
	clearSet2();
	for (let card of gameContainer.childNodes) {
		card.style.height = '150px';
		card.style.width = '20%';
	}
	mode = 'medium';
});
hard.addEventListener('click', function() {
	COLORS = [];
	randomizeColors(18);
	clearSet();
	clearSet2();
	for (let card of gameContainer.childNodes) {
		card.style.height = '150px';
		card.style.width = '15%';
	}
	mode = 'hard';
});
