const BULLET_SIZE = 10;
const BULLET_SPEED = 1;

const BULLET_TIME_LIFE = 5000;

/**
* This is a class declaration
* This class is responsible for defining the bullets behavior.
* this class extends the MovableEntity class, which is responsible for defining physics behavior
* If you'd like to know more about class inheritance in javascript, see this link
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
*/
class Bullet extends MovableEntity {

	/**
	* @argument { HTMLDivElement } containerElement The DOM element that will contain the bullet
	* @argument { Map } mapInstance The map in which the bullet will spawn
	* @argument { Vector } direction The bullet's direction
	*/
	constructor (
		containerElement,
		mapInstance,
		direction,
		initialPosition = undefined
	) {
		// The `super` function will call the constructor of the parent class.
		// If you'd like to know more about class inheritance in javascript, see this link
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
		super(containerElement, BULLET_SIZE, initialPosition, direction.normalize().scale(BULLET_SPEED), direction);

		this.mapInstance = mapInstance;

		// This is so the map can execute the player's physics (see the `frame` function
		// in the `map.js` file
		mapInstance.addEntity(this);

		//The chance the bullet to be special is 1/5
		const specialBullet =  Math.floor(Math.random() * 5) == 1;
		if(specialBullet) {
			// Assigns the bullet's image to it's element
			this.rootElement.style.backgroundImage = "url('assets/bullet-bonus.svg')";
			// Set the damage that the bullet will cause. It represents the number of lifes
			//That will take from asteroid. Could be 2 to 3
			this.damage = Math.floor(Math.random() * 2) + 2;
		} else {
			this.rootElement.style.backgroundImage = "url('assets/bullet.svg')";
			this.damage =  1;		
		}
		
		this.rootElement.style.backgroundSize = this.size + 'px';
	}

	// If the bullet collides with an asteroid, delete the bullet.
	collided (object) {
		if (object instanceof Asteroid) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}

	getDamage() {
		return this.damage;
	}

	frame() {
		super.frame();
		let marginArena = 210;
		//If bullet didn't hit any asteroid, should be delete (when the arena is end)
		if(this.position.x > marginArena || this.position.x < -marginArena || this.position.y > marginArena || this.position.y < -marginArena) {
			this.mapInstance.removeEntity(this);
			this.delete();
		}
	}
}