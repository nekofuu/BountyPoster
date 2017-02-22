//TODO: When adding Bounty Text to the poster,
//		use numObj.toLocaleString() to insert
//		the get the string with commas added

//FIX: The picture currently gets downsampled
//		regardless of size causing poor quality
//		at higher percent scale

//TODO: 

//Canvas Variables
var canvas = document.getElementById("poster");
var ctx = canvas.getContext('2d');

//Get control fields
var Ctrls = {
	Name: document.getElementById('posterName'),
	Bounty: document.getElementById('posterBounty'),
	File: document.getElementById('imgFile'),
	Downsample: document.getElementById('downsample'),
	Scale: document.getElementById('imageScale'),
	PosX: document.querySelectorAll('.position')[0],
	PosY: document.querySelectorAll('.position')[1],
	Wanted: document.getElementById('wantedLevel')
}

var Info = {
	OrigW: 0,
	OrigH: 0,
	OrigX: 41,
	OrigY: 119,
	PosX: 41,
	PosY: 119,
}

//Image Variables
var posterBackground = new Image();
var posterTexture = new Image();
var posterImg = new Image();
//Virtual Canvas
var vc = document.createElement('canvas');
var vctx = vc.getContext('2d');

posterBackground.src =	"assets/images/posterBackground.png";
posterTexture.src = "assets/images/posterTexture.png";

function Draw() {
    ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw();
    ctx.restore();
	
	ctx.save();
	ctx.drawImage(posterBackground, 0, 0);
	ctx.globalCompositeOperation = "multiply";
	ctx.drawImage(posterTexture, 0, 0);
	ctx.restore();
}


////////////////////////
// DRAW POTRAIT IMAGE //
////////////////////////
function draw() {
	//Corner of Portrait hole @ 44, 131
	handleImage();
	ctx.drawImage(vc, Info.PosX, Info.PosY);
}

//CONTROLS
Ctrls.Scale.onchange = function() {
	var scaleText = document.getElementById("scalePercent");
	scaleText.textContent = (this.value) + "%";	
	Draw();
}

Ctrls.PosX.onchange = function() {
	var tmp = Number(this.value);

	Info.PosX = Info.OrigX + tmp;

	Draw();
}

Ctrls.PosY.onchange = function() {
	var tmp = Number(this.value);

	Info.PosY = Info.OrigY + tmp;

	Draw();
}

Ctrls.Bounty.onchange = function() {
	if (this.value < 0) {
		this.value = 0;
	}

	Draw();
}

Ctrls.File.onchange = function(ev) {
	var file = ev.target.files[0];
	handleFile(file);

	var scaleText = document.getElementById("scalePercent");
	scaleText.textContent = (Ctrls.Scale.value) + "%";	
}

Ctrls.Downsample.onchange = function() {
	Draw();
}

function handleFile(file) {
	var imageType = /image.*/;

	if (file.type.match(imageType)) {
		var reader = new FileReader();

		reader.onloadend = function(event) {

			posterImg.onload = function(ev) {
				vc.height = ev.target.height;
				vc.width = ev.target.width;

				vctx.drawImage(ev.target, 0, 0);

				Draw();
			}

			posterImg.src = event.target.result;
		}

		reader.readAsDataURL(file);
	}

	Ctrls.Scale.value = 100;
	Ctrls.PosX = 0;
	Ctrls.PosY = 0;
}

function handleImage() {
	if (Number(Ctrls.Downsample.value) > 0) {
		var oc = document.createElement('canvas');
		var octx = oc.getContext('2d');
		//Set size of off-screen canvas to half-size
		oc.width = posterImg.width * 0.5;
		oc.height = posterImg.height * 0.5;
		//Set the virtual canvas to the current scale
		vc.width = posterImg.width * (Ctrls.Scale.value / 100);
		vc.height = posterImg.height * (Ctrls.Scale.value / 100);

		octx.drawImage(posterImg, 0, 0, oc.width, oc.height);

		if (Number(Ctrls.Downsample.value) === 2) {
			octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

			return vctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, vc.width, vc.height);
		}

		return vctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, vc.width, vc.height);
		
		
	} else if (Number(Ctrls.Downsample.value) === 0) {
		var tmpWidth = posterImg.width * (Ctrls.Scale.value / 100);
		var tmpHeight = posterImg.height * (Ctrls.Scale.value / 100);

		vc.width = tmpWidth;
		vc.height = tmpHeight;

		return vctx.drawImage(posterImg, 0, 0, tmpWidth, tmpHeight);
	}
}