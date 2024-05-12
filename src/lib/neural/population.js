//The Population Class
//Here is where the power of all the classes
//comes together to destroy the game score records

import Player from './player';

export default class Population{
	constructor(size){
		this.size = size;
		this.population = [];
		this.bestPlayer;
		this.bestFitness = 0;

		this.generation = 0;
		this.matingPool = [];

		for(let i = 0; i < size; i++){
			this.population.push(new Player(i));
			this.population[i].brain.generateNetwork();
			this.population[i].brain.mutate();
		}
	}

	static mapNumber(val, min, max) {
		return (val - min) / (max - min);
	}

	update(inputs){
		let decisions = [];
		for(let i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				this.population[i].setInput(inputs[i]);
				this.population[i].feedForward();
				decisions.push(this.population[i].decisions);
			} else {
				decisions.push([]);
			}
		}
		return decisions;
	}

	addScore(score, isAlive, index) {
		this.population[index].addScore(score, isAlive);
	}

	done(){
		for(let i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				return false;
			}
		}
		
		return true;
	}
	
	naturalSelection(){
		this.calculateFitness();

		let averageSum = this.getAverageScore();
		console.log('Average score : ' + averageSum);
		let children = [];
		
		this.fillMatingPool();
		for(let i = 0; i < this.population.length; i++){
			let parent1 = this.selectPlayer();
			let parent2 = this.selectPlayer();
			if(parent1.fitness > parent2.fitness)
				children.push(parent1.crossover(parent2));
			else
				children.push(parent2.crossover(parent1));
		}

		this.population.splice(0, this.population.length);
		this.population = children.slice(0);
		this.generation++;
		this.population.forEach((element) => { 
			element.brain.generateNetwork();
		});	

		console.log("Generation " + this.generation);

		this.bestPlayer.lifespan = 0;
		this.bestPlayer.dead = false;
		this.bestPlayer.score = 1;
	}

	calculateFitness(){
		let currentMax = 0;
		this.population.forEach((element) => { 
			element.calculateFitness();
			if(element.fitness > this.bestFitness){
				this.bestFitness = element.fitness;
				this.bestPlayer = element.clone();
				this.bestPlayer.brain.id = "BestGenome";
			}

			if(element.fitness > currentMax)
				currentMax = element.fitness;
		});

		//Normalize
		this.population.forEach((element, elementN) => { 
			element.fitness /= currentMax;
		});
	}

	fillMatingPool(){
		this.matingPool.splice(0, this.matingPool.length);
		this.population.forEach((element, elementN) => { 
			let n = element.fitness * 100;
			for(let i = 0; i < n; i++)
				this.matingPool.push(elementN);
		});
		console.log(this.matingPool.length);
	}

	selectPlayer(){
		let rand = Math.floor(Math.random() *  this.matingPool.length);
		return this.population[this.matingPool[rand]];
	}

	getAverageScore(){
		let avSum = 0;
		this.population.forEach((element) => { 
			avSum += element.score;
		});

		return avSum / this.population.length;
	}
}
