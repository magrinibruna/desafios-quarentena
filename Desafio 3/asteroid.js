const MIN_ASTEROID_SIZE = 20;
const MAX_ASTEROID_SIZE = 50;

const MIN_ASTEROID_LIFE = 1;
const MAX_ASTEROID_LIFE = 3;

const MAX_ASTEROID_ROTATION_SPEED = 1;

const  AMOUNT_VARIATIONS_ASTEROIDS = 3;

const SCORE_TEXT = "Destroyd Asteroids: "

/**
* This is a class declaration
* This class is responsible for defining the Asteroids's behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Asteroid extends MovableEntity {
	constructor (
		containerElement,
		mapInstance,
		initialPosition,
		scoreElement,
		backgroundImage = undefined,
		size = undefined
	) {
		size = size == undefined ? Asteroid.getRandomSize() : size;
		const direction = Asteroid.getRandomDirection();

		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, size, initialPosition, initialPosition.scale(-0.001), direction);

		this.mapInstance = mapInstance;
		this.rotationSpeed = Asteroid.getRandomRotationSpeed();

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		// initializes the asteroid's life to it's maximum.
		this.life = this.calculateMaxLife();

		// Finds a random image to assign to the asteroid's element
		const asteroidImageIndex = Math.floor(Math.random() * AMOUNT_VARIATIONS_ASTEROIDS) + 1;
		this.rootElement.style.backgroundImage = backgroundImage == undefined ? `url('assets/asteroid-${asteroidImageIndex}.svg')` : backgroundImage;
		this.rootElement.style.backgroundSize = size + 'px';

		//Keeps the number of destroyed asteroids
		this.scoreElement = scoreElement;
	}

	/**
	* Creates a random size for an asteroid
	*
	* Also, this is a static method, which means it does not belong to an object, but to the class itself.
	* if you'd like to know more abou static methods, see this link:
	* https://medium.com/@yyang0903/static-objects-static-methods-in-es6-1c026dbb8bb1
	* @returns { number }
	*/
	static getRandomSize () {
		return Math.floor(Math.random() * (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE) + MIN_ASTEROID_SIZE);
	}

	/**
	* Creates a random direction for an asteroid
	* @returns { Vector }
	*/
	static getRandomDirection () {
		return new Vector(Math.random(), Math.random());
	}

	/**
	* Creates a random rotation speed to an asteroid
	* @returns { number }
	*/
	static getRandomRotationSpeed () {
		return (Math.random() - 0.5) * 2 * MAX_ASTEROID_ROTATION_SPEED;
	}

	/**
	* Calculates the max life of the asteroid based on it's size. The larger the asteroid,
	* the larger it's life.
	* @returns { number }
	*/
	calculateMaxLife () {
		const sizePercentage = (this.size - MIN_ASTEROID_SIZE) / (MAX_ASTEROID_SIZE - MIN_ASTEROID_SIZE);
		return Math.round(sizePercentage * (MAX_ASTEROID_LIFE - MIN_ASTEROID_LIFE) + MIN_ASTEROID_LIFE);
	}

	/**
	* This function will check if an asteroid should spawn at the current game frame.
	* @returns { boolean }
	*/
	shouldBabyAsteroidSpawn () {
		// Note that the formula considers how long the gave have been going.
		// the longed the game, the higher the chance to spawn more asteroids.

		//The chance the asteroid to have a baby asteroid when destroyd is 1/10
		return Math.floor(Math.random() * 10) == 1;
	}

	/**
	* Uppon collision with a bullet, reduces the asteroid's life. If the asteroid
	* has zero life, destroy it.
	* @argument { MovableObject } object
	*/
	collided (object) {
		// the instanceof operator will check if an object was created by a class, or one of it's children.
		// If you'd like to know more about the instanceof operator, see this link:
		// https://www.geeksforgeeks.org/instanceof-operator-in-javascript/

		if(object instanceof Bullet) {
			this.life = this.life - object.getDamage();
			if (this.life <= 0) {
				this.scoreElement.innerHTML = SCORE_TEXT + (parseInt(this.scoreElement.innerHTML.split(":")[1]) + 1);
				if(this.shouldBabyAsteroidSpawn()) new Asteroid(this.containerElement, this.mapInstance, this.position, this.scoreElement, `url('assets/dinosaur.svg')`, 40);
				this.mapInstance.removeEntity(this);
				this.delete();
			}
		}
		
		//If it is a bomb, the asteroid should exploded
		if(object instanceof Bomb) {
			this.scoreElement.innerHTML = SCORE_TEXT + (parseInt(this.scoreElement.innerHTML.split(":")[1]) + 1);
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}

	/*
	* This function should be called every game frame. It will not only update the
	* asteroid's physics, but also rotate it based on it's rotation speed.
	*/
	frame () {
		super.frame();
		this.setDirection(this.direction.rotate(this.rotationSpeed));
	}
}