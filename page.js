let index = 0;
let buffer = "";
let counter = 0;
let zoom = 1;
let posX = 0;
let posY = 0;
let pan = false;

function setTransform () {
	document.getElementById("previewContainer").style.transform = "translate(" + posX.toString() + "px, " + posY.toString() + "px)";
	document.getElementById("mainPreview").style.transform = "scale(" + zoom.toString() + ")";
}

function resetTransform () {
	zoom = 1;
	posX = (window.innerWidth - document.getElementById("mainPreview").scrollWidth) / 2;
	posY = 0;
	setTransform();

	document.body.style.cursor = "none";
}

function setImage () {
	let imageContainer = document.getElementById("mainPreview");

	imageContainer.pause();
	imageContainer.poster = "/image/" + index.toString() + "?cache=" + (++counter).toString();
	imageContainer.src = "/image/" + index.toString() + "?cache=" + counter.toString();
	imageContainer.paused = true;

	resetTransform();
}

function next () {
	index++;
	setImage();
}

function prev () {
	index--;
	setImage();
}

document.addEventListener("keydown", function(e) {
	document.body.style.cursor = "none";
	switch (e.key) {
		case "ArrowRight":
			next();
			break;
		case "ArrowLeft":
			prev();
			break;
		case " ":
			if (document.getElementById("mainPreview").paused) {
				document.getElementById("mainPreview").play();
			} else {
				document.getElementById("mainPreview").pause();
			}
			break;
		case "n":
			document.getElementById("skip").src = "/skip/" + (index + 1).toString()
		case "Escape":
			buffer = "";
			break;
		case "Enter":
			index = buffer.toString();
			buffer = "";
			setImage();
			break;
		default:
			buffer += e.key;
	}
});

document.addEventListener("mousemove", function(e) {
	if (Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY) > 5) {
		document.body.style.cursor = "auto";
	}
	if (pan) {
		posX += e.movementX;
		posY += e.movementY;
		setTransform();
	}
});

document.addEventListener("mousedown", function(e) {
	if ((e.buttons & 2) != 0) {
		resetTransform();
	} else if ((e.buttons & 1) != 0) {
		pan = true;
	}
});

document.addEventListener("mouseup", function(e) {
	pan = false;
});

document.addEventListener("wheel", function(e) {
	let prevZoom = zoom;
	zoom -= (e.deltaY / 500) * zoom;
	zoom = Math.max(0.1, zoom);
	zoom = Math.min(15, zoom);

	posX += (1 - zoom / prevZoom) * (e.clientX - posX);
	posY += (1 - zoom / prevZoom) * (e.clientY - posY);

	setTransform();
	document.getElementById("previewContainer").style.transformOrigin = "top left";
	document.getElementById("mainPreview").style.transformOrigin = "top left";
});

document.addEventListener("contextmenu", e => e.preventDefault());

const container = document.querySelector("video");

const observer = new ResizeObserver(function() {
	posX = (window.innerWidth - container.scrollWidth) / 2;
	setTransform();
});

observer.observe(container);
