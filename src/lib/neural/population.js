//The Population Class
//Here is where the power of all the classes
//comes together to destroy the game score records

import Player from './player';
import Genome from './genome';
import Node from './node';
import Connection from './connection';

export default class Population {
	static import(json) {
		if (!json) throw 'No import found!';
		let data = JSON.parse(json);
		let input = new Population();
		input.size = data.size;
		input.generation = data.generation;
		input.matingPool = data.matingPool;
		input.bestFitness = data.bestFitness;
		input.population = [];
		for (let i = 0; i < data.population.length; i++) {
			let inputPlayer = new Player();
			inputPlayer.fitness = data.population[i].fitness;
			inputPlayer.score = data.population[i].score;
			inputPlayer.lifespan = data.population[i].lifespan;
			inputPlayer.dead = data.population[i].dead;
			inputPlayer.decisions = data.population[i].decisions;
			inputPlayer.vision = data.population[i].vision;

			let inputGenome = new Genome();
			inputGenome.inputs = data.population[i].brain.inputs;
			inputGenome.outputs = data.population[i].brain.outputs;
			inputGenome.id = data.population[i].brain.id;
			inputGenome.layers = data.population[i].brain.layers;
			inputGenome.nextNode = data.population[i].brain.nextNode;

			inputGenome.nodes = [];
			inputGenome.connections = [];
			for (let j = 0; j < data.population[i].brain.nodes.length; j++) {
				let inputNode = new Node();
				inputNode.number = data.population[i].brain.nodes[j].number;
				inputNode.layer = data.population[i].brain.nodes[j].layer;
				inputNode.activationFunction = data.population[i].brain.nodes[j].activationFunction;
				inputNode.bias = data.population[i].brain.nodes[j].bias;
				inputNode.output = data.population[i].brain.nodes[j].output;
				inputNode.inputSum = data.population[i].brain.nodes[j].inputSum;
				inputNode.outputValue = data.population[i].brain.nodes[j].outputValue;

				inputNode.outputConnections = [];

				for (let k = 0; k < data.population[i].brain.nodes[k].outputConnections.length; k++) {
					let inputConnection = new Connection();
					inputConnection.weight = data.population[i].brain.nodes[k].outputConnections[k].weight;
					inputConnection.enabled = data.population[i].brain.nodes[k].outputConnections[k].enabled;
					inputConnection.fromNodeNumber = data.population[i].brain.nodes[k].outputConnections[k].fromNodeNumber;
					inputConnection.toNodeNumber = data.population[i].brain.nodes[k].outputConnections[k].toNodeNumber;
					inputNode.outputConnections.push(inputConnection);
					inputGenome.connections.push(inputConnection);
				}
				inputGenome.nodes.push(inputNode);
			}

			for (let k = 0; k < inputGenome.connections.length; k++) {
				inputGenome.connections[k].fromNode = inputGenome.nodes[inputGenome.connections[k].fromNodeNumber];
				inputGenome.connections[k].toNode = inputGenome.nodes[inputGenome.connections[k].toNodeNumber];
			}

			inputPlayer.brain = inputGenome;
			input.population.push(inputPlayer);
		}

		let inputPlayer = new Player();
		inputPlayer.fitness = data.bestPlayer.fitness;
		inputPlayer.score = data.bestPlayer.score;
		inputPlayer.lifespan = data.bestPlayer.lifespan;
		inputPlayer.dead = data.bestPlayer.dead;
		inputPlayer.decisions = data.bestPlayer.decisions;
		inputPlayer.vision = data.bestPlayer.vision;

		let inputGenome = new Genome();
		inputGenome.inputs = data.bestPlayer.brain.inputs;
		inputGenome.outputs = data.bestPlayer.brain.outputs;
		inputGenome.id = data.bestPlayer.brain.id;
		inputGenome.layers = data.bestPlayer.brain.layers;
		inputGenome.nextNode = data.bestPlayer.brain.nextNode;

		inputGenome.nodes = [];
		inputGenome.connections = [];
		for (let j = 0; j < data.bestPlayer.brain.nodes.length; j++) {
			let inputNode = new Node();
			inputNode.number = data.bestPlayer.brain.nodes[j].number;
			inputNode.layer = data.bestPlayer.brain.nodes[j].layer;
			inputNode.activationFunction = data.bestPlayer.brain.nodes[j].activationFunction;
			inputNode.bias = data.bestPlayer.brain.nodes[j].bias;
			inputNode.output = data.bestPlayer.brain.nodes[j].output;
			inputNode.inputSum = data.bestPlayer.brain.nodes[j].inputSum;
			inputNode.outputValue = data.bestPlayer.brain.nodes[j].outputValue;

			inputNode.outputConnections = [];

			for (let k = 0; k < data.bestPlayer.brain.nodes[k].outputConnections.length; k++) {
				let inputConnection = new Connection();
				inputConnection.weight = data.bestPlayer.brain.nodes[k].outputConnections[k].weight;
				inputConnection.enabled = data.bestPlayer.brain.nodes[k].outputConnections[k].enabled;
				inputConnection.fromNodeNumber = data.bestPlayer.brain.nodes[k].outputConnections[k].fromNodeNumber;
				inputConnection.toNodeNumber = data.bestPlayer.brain.nodes[k].outputConnections[k].toNodeNumber;
				inputNode.outputConnections.push(inputConnection);
				inputGenome.connections.push(inputConnection);
			}
			inputGenome.nodes.push(inputNode);
		}

		for (let i = 0; i < inputGenome.connections.length; i++) {
			inputGenome.connections[i].fromNode = inputGenome.nodes[inputGenome.connections[i].fromNodeNumber];
			inputGenome.connections[i].toNode = inputGenome.nodes[inputGenome.connections[i].toNodeNumber];
		}

		inputPlayer.brain = inputGenome;
		input.bestPlayer = inputPlayer;

		console.log('Successful import!');
		return input;
	}

	constructor(size) {
		this.size = size;
		this.population = [];
		this.bestPlayer;
		this.bestFitness = 0;

		this.generation = 0;
		this.matingPool = [];

		if (size == undefined) return;
		for (let i = 0; i < size; i++) {
			this.population.push(new Player(i));
			this.population[i].brain.generateNetwork();
			this.population[i].brain.mutate();
		}
	}

	static mapNumber(val, min, max) {
		return (val - min) / (max - min);
	}

	update(inputs) {
		let decisions = [];
		for (let i = 0; i < this.population.length; i++) {
			if (!this.population[i].dead) {
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

	done() {
		for (let i = 0; i < this.population.length; i++) {
			if (!this.population[i].dead) {
				return false;
			}
		}

		return true;
	}

	naturalSelection() {
		this.calculateFitness();

		let averageSum = this.getAverageScore();
		console.log('Average score : ' + averageSum);
		let children = [];

		this.fillMatingPool();
		for (let i = 0; i < this.population.length; i++) {
			let parent1 = this.selectPlayer();
			let parent2 = this.selectPlayer();
			if (parent1.fitness > parent2.fitness)
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

	calculateFitness() {
		let currentMax = 0;
		this.population.forEach((element) => {
			element.calculateFitness();
			if (element.fitness > this.bestFitness) {
				this.bestFitness = element.fitness;
				this.bestPlayer = element.clone();
				this.bestPlayer.brain.id = "BestGenome";
			}

			if (element.fitness > currentMax)
				currentMax = element.fitness;
		});

		//Normalize
		this.population.forEach((element, elementN) => {
			element.fitness /= currentMax;
		});
	}

	fillMatingPool() {
		this.matingPool.splice(0, this.matingPool.length);
		this.population.forEach((element, elementN) => {
			let n = element.fitness * 100;
			for (let i = 0; i < n; i++)
				this.matingPool.push(elementN);
		});
	}

	selectPlayer() {
		let rand = Math.floor(Math.random() * this.matingPool.length);
		return this.population[this.matingPool[rand]];
	}

	getAverageScore() {
		let avSum = 0;
		this.population.forEach((element) => {
			avSum += element.score;
		});

		return avSum / this.population.length;
	}
}
