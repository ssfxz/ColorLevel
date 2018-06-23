const color = [{r:0, g:255, b:0}, {r:255, g:0, b:0}];
const centerColor = {r:220, g:220, b:220};
const domain = [-10, 100];
let newDomain;


function gradientColor(color0, color1, count) {
	if (count <= 1) return [color0];
	let colors = [];
	const rStep = (color1.r - color0.r) / (count - 1);
	const gStep = (color1.g - color0.g) / (count - 1);
	const bStep = (color1.b - color0.b) / (count - 1);
	for (let i = 0; i < count; ++ i) {
		newColor = {r: color0.r + i * rStep,
								g: color0.g + i * gStep,
								b: color0.b + i * bStep};
		colors.push(newColor);
	}
	return colors;
}

function calcColor() {
	const center = parseInt(document.getElementById("center").value);
	const count = parseInt(document.getElementById("count").value);
	const median = document.getElementById("median").checked;
	let result = [];
	
	if (!median) {
		result = gradientColor(color[0], color[1], count);
	}
	else {
		// The core algorithm
		const min = domain[0] - center;
		const max = domain[1] - center;
		
		let floorStep = Infinity, ceilStep = Infinity;
		let leftCount, rightCount;
		
		const isOdd = (count % 2 == 1);
		const numerator = min * count + (isOdd ? (0.5 * (max - min)) : 0);
		const denominator = min - max;
		const critical = numerator / denominator;
		
		const floor = Math.floor(critical);
		const ceil = Math.ceil(critical);
		
		if (floor >= 1 || (floor >= 0 && isOdd)) {
			floorStep = -min / (floor + (isOdd ? 0.5 : 0));
		}
		if (ceil >= 1 || (ceil >= 0 && isOdd)) {
			ceilStep = max / (count - ceil - (isOdd ? 0.5 : 0));
			if (isNaN(ceilStep)) ceilStep = Infinity;
		}
		
		const step = Math.min(floorStep, ceilStep);
		const isLeftAlign = (floorStep <= ceilStep);
		
		if (isLeftAlign) {
			leftCount = Math.floor(Math.abs(min) / step);
			rightCount = count - leftCount - (isOdd ? 1 : 0);
			if (step < Infinity) {
				newDomain[1] = +(domain[0] + count * step);
			}
		}
		else {
			rightCount = Math.floor(Math.abs(max) / step);
			leftCount = count - rightCount - (isOdd ? 1 : 0);
			if (step < Infinity) {
				newDomain[0] = +(domain[1] - count * step);
			}
		}
		
		let leftColors = gradientColor(color[0], centerColor, leftCount + 1);
		let rightColors = gradientColor(color[1], centerColor, rightCount + 1);
		
		leftColors.pop();
		rightColors.pop();
		rightColors.reverse();
		
		if (isOdd) leftColors.push(centerColor);
		result = leftColors.concat(rightColors);
	}
	
	return result;
}

function rgbToHex(color) {
	const hex = ((color.r << 16) | (color.g << 8) | color.b).toString(16);
  return "#" + new Array(Math.abs(hex.length-7)).join("0") + hex;
}

function showColor(colors) {
	const container = document.getElementById("container");
	container.innerHTML = "";
	
	for (let color of colors) {
		const newDiv = document.createElement("div");
		newDiv.className = "item";
		newDiv.style.backgroundColor = rgbToHex(color);
		container.appendChild(newDiv);
	}
}

function showTicks() {
	const ticks = document.getElementById("ticks");
	ticks.innerHTML = "";

	const min = document.createElement("div");
	min.className = "tick";
	min.innerText = newDomain[0];
	min.style.left = "0px";
	ticks.appendChild(min);
	
	const max = document.createElement("div");
	max.className = "tick";
	max.innerText = newDomain[1];
	max.style.left = "500px";
	ticks.appendChild(max);
	
	const center = parseInt(document.getElementById("center").value);
	const cen = document.createElement("div");
	cen.className = "tick";
	cen.innerText = "^";
	cen.style.left = 500 / (newDomain[1] - newDomain[0]) * (center - newDomain[0]) + "px";
	ticks.appendChild(cen);
	
	if (domain[0] * domain[1] < 0 && center != 0) {
		const zero = document.createElement("div");
		zero.className = "tick";
		zero.innerText = "0";
		zero.style.left = 500 / (newDomain[1] - newDomain[0]) * Math.abs(newDomain[0]) + "px";
		ticks.appendChild(zero);
	}
}

function exec() {
	newDomain = domain.concat();
	const colors = calcColor();
	showColor(colors);
	showTicks();
}

function add() {
	const count = document.getElementById("count").value;
	if (count < 255) {
		document.getElementById("count").value ++;
	}
	exec();
}

function sub() {
	const count = document.getElementById("count").value;
	if (count > 2) {
		document.getElementById("count").value --;
	}
	exec();
}

exec();