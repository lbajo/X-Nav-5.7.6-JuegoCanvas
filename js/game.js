// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// monster image

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
var num_monsters=2;
var monsters= [];

// stone image

var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";
var num_stones=2;
var stones= [];

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var princessesCaught = 0;

var monster = {
	speed:100
};

var stone = {};

// Handle keyboard controls
var keysDown = {};

var level = 1;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess

var save = function () {
	if (83 in keysDown) { //si pulsas la tecla S se guarda la partida
		localStorage.setItem("num_monsters",num_monsters);
		localStorage.setItem("num_stones",num_stones);
		localStorage.setItem("level", level);
		localStorage.setItem("princessesCaught", princessesCaught);
	}
}

var init = function () {
	if (78 in keysDown) { //si pulsas la tecla N todo vuelve a su valor inicial
		num_monsters=2;
		num_stones=2;
		level=1;
		princessesCaught=0;
		localStorage.setItem("num_monsters",num_monsters);
		localStorage.setItem("num_stones",num_stones);
		localStorage.setItem("level", level);
		localStorage.setItem("princessesCaught", princessesCaught);
	}
}

var newgame = function(){
	if (localStorage.getItem("num_monsters") != null) {
		num_monsters = localStorage.getItem("num_monsters");
	}
	if (localStorage.getItem("num_stones") != null) {
		num_stones = localStorage.getItem("num_stones");
	}
	if (localStorage.getItem("princessesCaught") != null) {
		princessesCaught = localStorage.getItem("princessesCaught");
	}
	if (localStorage.getItem("level") != null) {
		level = localStorage.getItem("level");
	}
}

var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	var s = 100;
	if(level != 1){
		s = s+50;
	}

	for(i = 0; i < num_monsters; i++){
		monsters[i] = {speed: s, x:0, y:0};
	}

	for(i = 0; i < num_stones; i++){
		stones[i] = {x:0, y:0};
	}

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 100));
	princess.y =  32 + (Math.random() * (canvas.height - 100));

	// Monsters position
	for(i = 0; i < num_monsters; i++){
		monsters[i].x = 32 + (Math.random() * (canvas.width - 100));
		monsters[i].y = 32 + (Math.random() * (canvas.height - 100));
	}

	// Stones positions
	for(i = 0; i < num_stones; i++){
		stones[i].x = 32 + (Math.random() * (canvas.width - 100));
		stones[i].y = 32 + (Math.random() * (canvas.height - 100));
	}

	// piedras , princesa y principe no pueden coincidir
	for(i = 0; i < num_stones; i++){
		if (
			(hero.x <= (stones[i].x + 16)
			&& stones[i].x <= (hero.x + 16)
			&& hero.y <= (stones[i].y + 16)
			&& stones[i].y <= (hero.y + 32))||
			(princess.x <= (stones[i].x + 16)
			&& stones[i].x <= (princess.x + 16)
			&& princess.y <= (stones[i].y + 16)
			&& stones[i].y <= (princess.y + 32))
		) {
			stones[i].x = 32 + (Math.random() * (canvas.width - 100));
			stones[i].y = 32 + (Math.random() * (canvas.height - 100));
		}
	}
};

// Update game objects
var update = function (modifier) {
	var pos_herox = hero.x;
	var pos_heroy = hero.y;

	if (38 in keysDown) { // Player holding up
		if(hero.y <= 32){
			hero.y = 32;
		}
		hero.y -= hero.speed * modifier;
		for(i = 0; i < num_monsters; i++){
			if(monsters[i].y <= 32){
				monsters[i].y = 32;
			}
			monsters[i].y -= monsters[i].speed * modifier;
		}
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y >= canvas.height - 64){
			hero.y = canvas.height - 64;
		}
		hero.y += hero.speed * modifier;
		for(i = 0; i < num_monsters; i++){
			if(monsters[i].y >= canvas.height - 64){
				monsters[i].y = canvas.height - 64;
			}
			monsters[i].y += monsters[i].speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x <= 32){
			hero.x = 32;
		}
		hero.x -= hero.speed * modifier;
		for(i = 0; i < num_monsters; i++){
			if(monsters[i].x <= 32){
				monsters[i].x = 32;
			}
			monsters[i].x -= monsters[i].speed * modifier;
		}

	}
	if (39 in keysDown) { // Player holding right
		if(hero.x >= canvas.width - 64){
			hero.x = canvas.width - 64;
		}
		hero.x += hero.speed * modifier;
		for(i = 0; i < num_monsters; i++){
			if(monsters[i].x >= canvas.width - 64){
				monsters[i].x = canvas.width - 64;
			}
			monsters[i].x += monsters[i].speed * modifier;
		}
	}



	// Are they touching? (Hero-Princess)
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;

		if(levels(princessesCaught)){
			level++;
			num_monsters++;
			num_stones++;
			save();
		}
		reset();
	}

	// Are they touching? (Hero-Monster)
	for(i = 0; i < num_stones; i++){
		if (
			hero.x <= (monsters[i].x + 16)
			&& monsters[i].x <= (hero.x + 16)
			&& hero.y <= (monsters[i].y + 16)
			&& monsters[i].y <= (hero.y + 32)
		) {
			princessesCaught=0;
			level=1;
			num_stones=2;
			num_monsters=2;
			reset();
		}
	}

	// Are they touching? (Hero-Stone)
	for(i = 0; i < num_stones; i++){
		if (
			hero.x <= (stones[i].x + 16)
			&& stones[i].x <= (hero.x + 16)
			&& hero.y <= (stones[i].y + 16)
			&& stones[i].y <= (hero.y + 32)
		) {
			hero.x = pos_herox;
			hero.y = pos_heroy;
		}
	}

};

var levels = function (score) {
	rest = score % 10;
	if(rest==0)
    	return true;
    else
    	return false;
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (monsterReady){
		for(i = 0; i < num_monsters; i++){
			ctx.drawImage(monsterImage, monsters[i].x, monsters[i].y);
		}
	}

	if (stoneReady){
		for(i = 0; i < num_stones; i++){
			ctx.drawImage(stoneImage, stones[i].x, stones[i].y);
		}
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Level: "+ level, 32, 64); //posicion de izq a der: 32, de arriba a abajo:64
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	init();
	render();
	save();

	then = now;
};

// Let's play this game!
newgame();
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
