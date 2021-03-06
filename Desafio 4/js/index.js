// This is the container of all Entities
const movableEntityContainer = document.getElementById('movable-entity-container');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const dynamiteElement = document.getElementById('dynamite');

// Represents the amount of levels that the game will have
// When the player wins the last level, the game ends
const LAST_LEVEL = 1;

const map = new GameMap(movableEntityContainer, levelElement, LAST_LEVEL, dynamiteElement);
const player = new Player(movableEntityContainer, scoreElement);

// This is the game frame function. It is responsible for updating everything in the game.
function frame () {
	map.frame();
}

// This function will run every time the player presses a key
document.body.addEventListener('keydown', event => {
	// if that key is the spacebar, the player will try to throw it's hook.
	if (event.key === ' ') player.throwHook();
});

document.body.addEventListener("click", event => {
	const dynamite = parseInt(dynamiteElement.innerHTML);
	//The user should have dynamite 
	if(dynamite <= 0) return;
	player.drop();
	//Even if in the game a object it's not being pulled, the user will lost dynamites
	dynamiteElement.innerHTML = dynamite - 1;
})

// Registers the frame function to run at every frame.
// if you'd like to know more about intervals, see this link
// https://javascript.info/settimeout-setinterval
const intervalHandler = setInterval(frame);
