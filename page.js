let index = 0;
let buffer = "";

function setImage () {
	document.getElementById("imageContainer").children[0].poster = "/image/" + index.toString();
	document.getElementById("imageContainer").children[0].src = "/image/" + index.toString();
	document.getElementById("imageContainer").children[0].paused = true;
}

function next () {
	index++;
	setImage();
}

function prev () {
	index--;
	setImage();
}

document.addEventListener('keydown', function(e) {
	document.body.style.cursor = "none";
	switch (e.key) {
		case "ArrowRight":
			document.getElementById("imageContainer").children[0].pause();
			next();
			break;
		case "ArrowLeft":
			document.getElementById("imageContainer").children[0].pause();
			prev();
			break;
		case " ":
			if (document.getElementById("imageContainer").children[0].paused) {
				document.getElementById("imageContainer").children[0].play();
			} else {
				document.getElementById("imageContainer").children[0].pause();
			}
			break;
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

document.addEventListener('mousemove', function(e) {
	document.body.style.cursor = "auto";
});
