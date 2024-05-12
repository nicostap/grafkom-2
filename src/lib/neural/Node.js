var activationsNames = ["Sigmoid", "Identity", "Step", "Tanh", "ReLu"]; //Used in the svg drawing

function randomGaussian(mean = 0, stdev = 1) {
	const u = 1 - Math.random();
	const v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return z * stdev + mean;
}

//The Node Class
//This is where math appends
export default class Node {
	constructor(num, lay, isOutput) {
		if (num == undefined) return;
		this.number = num;
		this.layer = lay;
		this.activationFunction = Math.floor(Math.random() * 7); //Number between 0 and 6
		this.bias = Math.random() * 2 - 1;
		this.output = isOutput || false; //is this node an Output node?

		this.inputSum = 0;
		this.outputValue = 0;
		this.outputConnections = [];
	}

	engage() { //Pass down the network the calculated output value
		if (this.layer != 0) //No activation function on input nodes
			this.outputValue = this.activation(this.inputSum + this.bias);


		this.outputConnections.forEach((conn) => {
			if (conn.enabled) //Do not pass value if connection is disabled
				conn.toNode.inputSum += conn.weight * this.outputValue; //Weighted output sum
		});
	}

	mutateBias() { //Randomly mutate the bias of this node
		let rand = Math.random();
		if (rand < 0.05) //5% chance of being assigned a new random value
			this.bias = Math.random() * 2 - 1;
		else //95% chance of being uniformly perturbed
			this.bias += randomGaussian() / 50;
	}

	mutateActivation() { //Randomly choose a new activationFunction
		this.activationFunction = Math.floor(Math.random() * 7); //Number between 0 and 6
	}

	isConnectedTo(node) { //Check if two nodes are connected
		if (node.layer == this.layer) //nodes in the same layer cannot be connected
			return false;


		if (node.layer < this.layer) { //Check parameter node connections
			node.outputConnections.forEach((conn) => {
				if (conn.toNode == this) //Is Node connected to This?
					return true;
			});
		} else { //Check this node connections
			this.outputConnections.forEach((conn) => {
				if (conn.toNode == node) //Is This connected to Node?
					return true;
			});
		}

		return false;
	}

	clone() { //Returns a copy of this node
		let node = new Node(this.number, this.layer, this.output);
		node.bias = this.bias; //Same bias
		node.activationFunction = this.activationFunction; //Same activationFunction
		return node;
	}

	activation(x) { //All the possible activation Functions
		switch (this.activationFunction) {
			case 0: //SELU
				return x < 0 ? 3 * (Math.pow(Math.E, x) - 1) : 0;
				break;
			case 1: //Identity
				return x;
				break;
			case 2: //Bipolar Sigmoid
				return 2 / (1 + Math.pow(Math.E, -x)) - 1;
				break;
			case 3: //Tanh
				return Math.tanh(x);
				break;
			case 4: //Paramteric RELU
				return x < (x / 3) ? (x / 3) : x;
				break;
			case 5: //Step
				return x < 0 ? 0 : 1;
				break;
			case 6: //RELU
				return x < 0 ? 0 : x;
				break;
			default: //Bipolar Sigmoid
				return 2 / (1 + Math.pow(Math.E, -x)) - 1;
				break;
		}
	}
}