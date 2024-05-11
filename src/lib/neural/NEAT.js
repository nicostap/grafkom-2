/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

import activation from './ActivationFunction.js';
import crossover from './Crossover.js';
import mutate from './Mutate.js';
import Creature from './Creature.js';

const RANDOM = crossover.RANDOM;
const _RANDOM = mutate.RANDOM;
export { NEAT, activation, crossover, mutate };

class NEAT {
	static mapNumber(val, min, max) {
		return (val - min) / (max - min);
	}

	bestCreature;

	constructor(config) {
		this.creatures = [];
		this.oldCreatures = [];
		this.model = config.model;
		this.exportModel = [];
		this.populationSize = config.populationSize || 500;
		this.mutationRate = config.mutationRate || 0.05;
		this.crossoverMethod = config.crossoverMethod || RANDOM;
		this.mutationMethod = config.mutationMethod || _RANDOM;
		this.generation = 0;

		for (let i = 0; i < this.model.length; i++) {
			let data = Object.assign({}, this.model[i]);
			if (this.model[i].activationfunc) {
				data.activationfunc = data.activationfunc.name;
				this.exportModel.push(data);
			} else {
				this.exportModel.push(data);
			}
		}

		for (let i = 0; i < this.populationSize; i++) {
			this.creatures.push(new Creature(this.model));
		}

		this.mutate = function () {
			for (let i = 0; i < this.populationSize; i++) {
				let genes = this.creatures[i].flattenGenes();
				genes = this.mutationMethod(genes, this.mutationRate);
				this.creatures[i].setFlattenedGenes(genes);
			}
		};

		this.crossover = function () {
			let index = 0;
			let max = -99999;
			for (let i = 0; i < this.creatures.length; i++) {
				if (this.creatures[i].score > max) {
					max = this.creatures[i].score;
					index = i;
				}
			}
			this.bestCreature = this.creatures[index].clone();
			this.oldCreatures = [];
			for(let i = 0; i < this.creatures.length; i++)
				this.oldCreatures.push(this.creatures[i].clone());
			for (let i = 0; i < this.populationSize; i++) {
				let parentx = this.pickCreature();
				let parenty = this.pickCreature();
				let genes = this.crossoverMethod(parentx.flattenGenes(), parenty.flattenGenes());
				this.creatures[i].setFlattenedGenes(genes);
			}
		};

		this.pickCreature = function () {
			let sum = 0;
			for (let i = 0; i < this.oldCreatures.length; i++) {
				sum += Math.pow(this.oldCreatures[i].score, 2);
			}

			for (let i = 0; i < this.oldCreatures.length; i++) {
				this.oldCreatures[i].fitness = Math.pow(this.oldCreatures[i].score, 2) / sum;
			}
			let index = 0;
			let r = Math.random();
			while (r > 0) {
				r -= this.oldCreatures[index].fitness;
				index += 1;
			}
			index -= 1;
			return this.oldCreatures[index];
		};

		this.setFitness = function (fitness, index) {
			this.creatures[index].score = fitness;
		};

		this.feedForward = function () {
			for (let i = 0; i < this.creatures.length; i++) {
				this.creatures[i].feedForward();
			}
		};

		this.doGen = function () {
			this.crossover();
			this.mutate();
			this.generation++;
			console.log('Generation: ' + this.generation);
		};

		this.getDecisions = function () {
			let result = [];

			for (let i = 0; i < this.creatures.length; i++) {
				result.push(this.creatures[i].decision());
			}
			return result;
		};

		this.setInputs = function (array, index) {
			this.creatures[index].setInputs(array);
		};

		this.export = function (index) {
			let data = [];
			data.push(JSON.parse(JSON.stringify(this.exportModel)));
			data.push([]);
			if (index) {
				data[1].push(this.creatures[index].flattenGenes());
			} else {
				for (let i = 0; i < this.populationSize; i++) {
					data[1].push(this.creatures[i].flattenGenes());
				}
			}
			return data;
		};

		this.import = function (data) {
			if (JSON.stringify(data[0]) === JSON.stringify(this.exportModel)) {
				console.log('Importing ' + data[1].length + ' creature(s)');
				for (let i = 0; i < data[1].length; i++) {
					let newCreature = new Creature(this.model);
					newCreature.setFlattenedGenes(data[1][i]);
					this.creatures.push(newCreature);
					this.populationSize++;
				}
			} else {
				throw "Invalid model!";
			}
		};
	}
}