/* 
    Equipe: 
    José Rogério da Silva Júnior - Subturma 01C (Líder) 
    Etapa 2
*/

//Cenário
var canvasSize = 512;
var y2 = canvasSize;
var bgImg;
var y1 = 0;
var y2;
var scrollSpeed = 0.006;
var wave = 0;
var explosion;
var frame = 0

var explosionFrame = 0


//Bonus
var lifeBonus;
var laserSpeedbonus

//Personagem
var character;
var characterImg;
var cannon = 0

var hud;

//Tiros
var laserSound;
var laser = new Array(); //Array de Objetos que Grava os Tiros
delayShot = false;

//Recarga de tiros
function Delay(t) {
	setTimeout(
		() => {
			delayShot = false;
		},
		t * 100
	);
}

//Asteroides
var enemmysNumber = 1
var enemmys = new Array(); //Array de Objetos que Grava Estado e Posição dos Inimigos

//Efeito do Background
function showBg() {
	
	imageMode(CORNER);
	image(bgImg, 0, -y1, canvasSize, canvasSize);
	image(bgImg, 0, -y2, canvasSize, canvasSize);

	y1 -= scrollSpeed * (canvasSize - character.y)
	y2 -= scrollSpeed * (canvasSize - character.y)

	if (y1 < -canvasSize) {
		y1 = canvasSize;
	}
	if (y2 < -canvasSize) {
		y2 = canvasSize;
	}
}

//Carreganto das Imagens
function preload() {
	characterImg = loadImage("assets/spaceship_small_blue.png");
	bgImg = loadImage("assets/bg.png");
	asteroidImg = loadImage("assets/asteroid.png");
	// plasma = loadImage("assets/plasma.png");

	for(i = 00; i < 90; i++){
		explosionImg[i] = loadImage("assets/explosion/explosion0"+ i +".png");
	}
//Sons
	laserSound = loadSound("assets/sounds/laser1.mp3");
}

//Configuração
function setup() {
	createCanvas(canvasSize, canvasSize);
	
	//Criando Personagem
	character = new Character();
	hud = new Hud();
}

function draw() {
	clear();
	background(0)
	showBg();
	hud.update();
	hud.showAll();
	objcsUpdate();
	if (typeof explosion !== 'undefined'){
		updateExplosion()
	}
	frame++
}
//HUD
class Hud{
	constructor(){
		this.color = "#42a1f4"
	}

	update(){
		this.points = character.points
		this.hp = character.hp
		this.wave = wave
	}

	showWave(){
		fill(this.color);
		textSize(14);
		text("Onda: "+ this.wave, width - 70, 15);
	}

	showWeapon(){
		fill(this.color);
		textSize(14);
		text("Gatling Laser LV "+ character.weaponLv, width - 150, height - 10);
	}

	showPoints(){
		fill(this.color);
		textSize(14);
		text("Pontos: " + this.points, width / 2 - 30, 15);
	}

	showHpbar(){
		fill(this.color)
		rect(30, height - 17, this.hp, 15)
		textSize(12);
		fill(255);
		text("HP: ", 30, height - 20);
		fill(0)
		text(this.hp + "%", 30, height - 5);
	}
	

	
	showAll(){
		this.showWave();
		this.showPoints();
		this.showHpbar();
		this.showWeapon();
	}
}

//Asteroide 
class AsteroidN1 {
	constructor() {
		this.x = random(width);
		this.y = random(-10, -250);
		this.diameter = random(18, 90);
		this.vSpeed = character.y / 100;
		this.speed = random(1, 3) / this.diameter;
		this.direction = random(-1, 1)
	}

	move() {
		this.y += (this.speed) * (canvasSize - character.y) + wave/100
		this.x += this.direction / 2
	}

	display() {
		imageMode(CENTER);
		image(asteroidImg, this.x, this.y, this.diameter, this.diameter);

	}

}


//Explosão
class Explosion {
	constructor(x,y,diameter) {
		this.x = x;
		this.y = y;
		this.diameter = diameter
	}

	updateExplosion(){
		
		if (frame >= 2){
			image(explosionImg[explosionFrame],this.x, this.y, this.diameter * 2, this.diameter * 2)
			explosionFrame++
			Frame = 0
		}

	}
}

//BONUS
//Vida Bonus
class Lifebonus {
	constructor(x,y) {
		this.x = x
		this.y = y
		this.speed = 0.003
	}

	
	move() {
		this.y += (this.speed) * (canvasSize - character.y)
	}

	display() {
		fill(100,255,100)
		ellipse(this.x, this.y, 25, 25);
		fill(0)
		text("HP", this.x-7, this.y+5)
	}

	

	checkCollect(){

			var a = lifeBonus.x - character.x;
			var b = lifeBonus.y - character.y;
			var c = Math.sqrt((a * a) + (b * b));
	
			if (c <= 20) {
				character.setLife(10)
				lifeBonus = undefined
			}		
		
	}

}

class Laserspeedbonus {
	constructor(x,y) {
		this.x = x
		this.y = y
		this.speed = 0.003
	}

	
	move() {
		this.y += (this.speed) * (canvasSize - character.y)
	}

	display() {
		fill(100,255,100)
		ellipse(this.x, this.y, 25, 25);
		fill(0)
		text("S", this.x-7, this.y+5)
	}

	

	checkCollect(){

			var a = this.x - character.x;
			var b = this.y - character.y;
			var c = Math.sqrt((a * a) + (b * b));
	
			if (c <= 20) {
				character.laserSpeed -= 0.01
				character.weaponLv += 
				laserSpeedbonus = undefined
			}		
		
	}

}


//Tiro
class Laser {
	constructor(x) {
		this.x = character.x + x
		this.y = character.y - 15;
		this.diameter = 10;
		this.speed = 4	;
		this.laserColor = "#00FFFF"

		noStroke()
		fill(this.laserColor);
		ellipse(this.x, this.y, 15,15);

		laserSound.play();
	}

	move() {
		this.y -= this.speed
	}

	display() {
		noStroke()
		fill(this.laserColor);
		rect(this.x, this.y, 2, this.diameter);
	}

}

//Personagem
class Character {
	constructor() {
		this.x = width / 2;
		this.y = height - 60;
		this.diameter = 25;
		this.points = 0;
		this.hp = 100;
		this.speed = 5;
		this.laserSpeed = 3;
		this.weaponLv = 1
	}

	move() {
		//Controles
		//cima
		if (keyIsDown(87) && this.y > 200) {
			this.y -= this.speed / (canvasSize-character.y)/0.1;
		}
		//baixo
		else if (keyIsDown(83) && this.y < canvasSize - 20) {
			this.y += this.speed;
		}
		//desaceleração passiva
		else if(this.y<canvasSize -50){
			this.y += 1;
		}
		//esquerda
		if (keyIsDown(65) && this.x > 20) {
			this.x -= this.speed;
		}
		//direita
		else if (keyIsDown(68) && this.x < canvasSize - 20) {
			this.x += this.speed;
		}
		
		//Tiro simples
		if (keyIsDown(32) && delayShot === false && cannon == 0) {
			laser.push(new Laser(-6))
			cannon = 1
			delayShot = true;
			Delay(character.laserSpeed);
		}

		if (keyIsDown(32) && delayShot === false && cannon == 1) {
			laser.push(new Laser(+5))

			cannon = 0
			delayShot = true;
			Delay(character.laserSpeed);
		}

	}

	display() {
		imageMode(CENTER);
		image(characterImg, character.x, character.y);
	}

	setLife(x) {
		if (x < 0 || this.hp < 100)
		this.hp += x;
	}

	setPoints(x) {
		this.points += x;
	}

	setLaserspeed(x) {
		this.laserSpeed += x;
	}

	die(){
		document.location.reload()
	}

}

function objcsUpdate() {

	///Atualizar Posições dos Objetos

	//Personagem
	if (typeof character !== 'undefined') {
		character.move();
		character.display();

		if (character.y > canvasSize - 10){
			character.y -= 20
		}
	}

	if (character.hp <= 0){
		character.die()
	}

	//---Tiro
	if (laser.length > 0) {
		for (i = 0; i < laser.length; i++) {
			laser[i].move();
			laser[i].display();

			//Verificar se o Tiro Saiu da Tela e o apaga do Array de objetos
			if (laser[i].y < 0) {
				laser.splice(i, 1);
				i--;
			}

		}
	}

	//Atualiza a Posição de Todos os Inimigos

	if (enemmys.length > enemmysNumber) {
		for (i = 0; i < enemmys.length; i++) {
			enemmys[i].move();
			enemmys[i].display();

			if (enemmys[i].y > canvasSize) {
				enemmys.splice(i, 1);
				i--;
			}
		}
	} 

		//Personagem

	//Passando de onda
	else {
		for (i = 0; i < enemmysNumber; i++) {
			enemmys.push(new AsteroidN1());
		}
		enemmysNumber = enemmysNumber * 1.02
		wave++
		character.setPoints(wave*50)
	}

	//Atualizando Posição dos Bonus
	if (typeof lifeBonus !== 'undefined') {
		lifeBonus.move();
		lifeBonus.display();
	}

	if (typeof laserSpeedbonus !== 'undefined') {
		laserSpeedbonus.move();
		laserSpeedbonus.display();
	}
	//Sistema de Colisões JOGADOR-IMIGO

	for (i = 0; i < enemmys.length; i++) {
		var a = enemmys[i].x - character.x;
		var b = enemmys[i].y - character.y;
		var c = Math.sqrt((a * a) + (b * b));

		surface = character.diameter + enemmys[i].diameter;
		if (c <= surface / 2) {
			console.log("Dano sofrido");
			character.setLife(-3)
			if ( enemmys[i].y + enemmys[i].diameter > character.y){
				character.y += 10
			}
		}
	}

	//Sistema de Colisões INIMIGO-TIRO (BETA)

//Destroi Tiro e Asteroide ao colidirem
	function destroyBoth(){
		if (random(1,100) <= 20 && lifeBonus == undefined) {
			lifeBonus = new Lifebonus(enemmys[j].x,enemmys[j].y);
		}
		else if (random(1,100) <= 80 && laserSpeedbonus == undefined){
			laserSpeedbonus = new Laserspeedbonus(enemmys[j].x,enemmys[j].y);
		}
		image(explosion,enemmys[j].x, enemmys[j].y, enemmys[j].diameter * 2, enemmys[j].diameter * 2)

		character.setPoints(100);
		enemmys.splice(j, 1);
		j--;
		laser.splice(i, 1);
		i--;
	}

	if (enemmys.length !== 0 && laser.length !== 0) {
		for (i = 0; i < laser.length; i++) {
			for (j = 0; j < enemmys.length; j++) {

				if (enemmys[j] !== undefined && laser[i] !== undefined) {
					var xDistance = enemmys[j].x - laser[i].x;
					var yDistance = enemmys[j].y - laser[i].y;
					var diagonalDistance = Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
					surface = laser[i].diameter + enemmys[j].diameter;
				}
				if (diagonalDistance <= surface / 2) {
					destroyBoth();
					break
				}
			}

		}
	}
	//----FIM DO CÓDIGO----------

	if (typeof lifeBonus !== 'undefined'){
		lifeBonus.checkCollect()
	}
	if (typeof lifeBonus !== 'undefined') {
		if (lifeBonus.y > canvasSize){
			lifeBonus = undefined
		}
	}


	if (typeof laserSpeedbonus !== 'undefined'){
		laserSpeedbonus.checkCollect()
	}
	if (typeof laserSpeedbonus !== 'undefined') {
		if (laserSpeedbonus.y > canvasSize){
			laserSpeedbonus = undefined
		}
	}

}