const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const radioBtns = document.querySelectorAll('input[type="radio"]');
const colorPicker = document.getElementById("colorPicker");
const colorRadio = document.getElementById("color");
const positionBtn = document.getElementById("positionBtn");
const slider = document.getElementById("transparencySlider");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const custom_alert = document.querySelector(".alert");

//PAGE

radioBtns.forEach((radio) => {
	radio.addEventListener("change", (e) => {
		if (e.target.id === "color") {
			colorPicker.classList.remove("inactive");
		} else {
			colorPicker.classList.add("inactive");
		}
	});
});

//CANVAS

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;

let isDrawing = false;

let rect = canvas.getBoundingClientRect();

let changingPosition = false;
let originPosition = {
	x: canvas.width / 2,
	y: canvas.height / 2,
};

canvas.addEventListener("mousedown", (e) => {
	if (changingPosition) return;

	isDrawing = true;
});

canvas.addEventListener("mouseup", (e) => {
	isDrawing = false;
});

canvas.addEventListener("mousemove", (e) => {
	if (!isDrawing) return;

	if (colorRadio.checked) {
		ctx.strokeStyle = hexToRGBA(colorPicker.value);
	} else {
		ctx.strokeStyle = getRandomHSLA();
	}

	let { x: mouseX, y: mouseY } = getMousePos(e);
	let { x: originX, y: originY } = originPosition;

	drawLine(mouseX, mouseY, originX, originY);
});

canvas.addEventListener("click", (e) => {
	if (changingPosition) {
		originPosition = getMousePos(e);
		changingPosition = false;
		custom_alert.classList.remove("active");
	}

	console.log(e);
});

const drawLine = (mouseX, mouseY, originX, originY) => {
	ctx.beginPath();
	ctx.moveTo(originX, originY);
	ctx.lineTo(mouseX, mouseY);
	ctx.stroke();
	ctx.closePath();
};

/*Generate RGB color given hexadecimal form*/
const hexToRGBA = (hex) => {
	let r = parseInt(hex.substring(1, 3), 16);
	let g = parseInt(hex.substring(3, 5), 16);
	let b = parseInt(hex.substring(5, 7), 16);
	let a = slider.value; //transparency
	return `rgb(${r}, ${g}, ${b}, ${a})`;
};

/*Generate a random HSLA color and return it as a string*/
const getRandomHSLA = () => {
	let h = Math.floor(Math.random() * 361);
	let s = Math.floor(Math.random() * 20) + 80;
	let l = Math.floor(Math.random() * 20) + 40;
	let a = slider.value; //transparency
	return `hsla(${h}, ${s}%, ${l}%, ${a})`;
};

/*Get mouse position relative to the Canvas*/
const getMousePos = (e) => {
	return {
		x: Math.round(e.clientX - rect.left),
		y: Math.round(e.clientY - rect.top),
	};
};

/*Get mouse clicked position relative to the Canvas*/

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth * 0.8;
	canvas.height = window.innerHeight * 0.7;

	rect = canvas.getBoundingClientRect();

	originPosition = {
		x: canvas.width / 2,
		y: canvas.height / 2,
	};
});

//BUTTONS

positionBtn.addEventListener("click", () => {
	changingPosition = true;
	custom_alert.classList.add("active");
});

clearBtn.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
});

downloadBtn.addEventListener("click", () => {
	let link = document.createElement("a");
	link.download = "my-drawing.png";
	link.href = canvas.toDataURL();
	link.click();
	link.delete;
});
