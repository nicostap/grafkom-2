/*
	Author: ExtensionShoe
	Date: 30/08/2019
	License: MIT
*/

export default class Node {
	constructor() {
		this.value = 0;
		this.weights = [];

		this.initWeights = function (count) {
			for (let i = 0; i < count; i++) {
				this.weights.push((Math.random() * 2) - 1);
			}
		};
	}

	clone() {
		let clone = new Node();
		clone.value = this.value;
		clone.weights = this.weights.slice();
		return clone;
	}
}