/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

import Layer from './Layer.js';

export default class Network {
	constructor(model) {
		this.layers = [];

		for (let i = 0; i < model.length; i++) { // Init all the layers.
			this.layers.push(new Layer(model[i].nodeCount, model[i].type, model[i].activationfunc));
		}

		for (let i = 0; i < this.layers.length - 1; i++) { // Connect the layers to each other.
			this.layers[i].connect(this.layers[i + 1].nodes.length);
		}

		this.feedForward = function () {
			for (let i = 0; i < this.layers.length - 1; i++) {
				this.layers[i].feedForward(this.layers[i + 1]);
			}
		};
	}
}