import { input } from "../input.js";

console.log(findMarkerIndex());

function findMarkerIndex() {
	for (let i = 4; i < input.length; i++) {
		const sequence = input.slice(i - 4, i);	
		if (!sequence.split("").find((_char, index) => sequence.indexOf(sequence[index]) !== index)) {
			return i;
		};
	}
}
