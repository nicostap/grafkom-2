//The Player Class
//The interface between our 
//NeuralNetwork and the game 

import Genome from './genome';

let genomeInputsN = 8;
let genomeOutputN = 4;

export default class Player{
	constructor(id){
		this.fitness;
		this.score = 1;
		this.lifespan = 1;
		this.dead = false;
		this.decisions = []; // Current Output values
		this.vision = []; // Current input values
		if(id == undefined) return;
		this.brain = new Genome(genomeInputsN, genomeOutputN, id);
	}

	clone() { // Returns a copy of this player
		let clone = new Player();
		clone.brain = this.brain.clone();
		return clone;
	}

	crossover(parent){ //Produce a child
		let child = new Player();
		if(parent.fitness < this.fitness)
			child.brain = this.brain.crossover(parent.brain);
		else
			child.brain = parent.brain.crossover(this.brain);

		child.brain.mutate()
		return child;
	}


	//Game stuff
	setInput(array){
		this.vision = array;
	}

	feedForward(){
		this.decisions = this.brain.feedForward(this.vision);
	}

	addScore(score, isAlive){
		this.dead = !isAlive;
		if(this.dead) return;
		this.score += score;
	}

	setScore(score, isAlive){
		this.dead = !isAlive;
		if(this.dead) return;
		this.score = score;
	}

	calculateFitness(){
		this.fitness = (10000 / (this.score * this.score));
		if(this.dead) this.fitness *= 0.01;
		this.fitness *= this.brain.calculateWeight();
	}
}