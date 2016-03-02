var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'jormungand', { preload: preload, create: create, update: update,render : render });

function preload() {
    //game.load.image('head','assets/circle_head.png');
    //game.load.image('body','assets/circle.png');
	game.load.image('head_s','assets/circle_head_small.png');
    game.load.image('body_s','assets/circle_small.png');
	game.load.image('tile','assets/tile.png');
	game.load.image('food','assets/food.png');
}

var snakeHead;
var snakeSection = new Array();
var snakePath = new Array();
var numSnakeSections = 10; //1-3000
var scaleX = 0.5; //0.3 - 1
var scaleY = scaleX;
var speed = 3; //2-5
var ang_speed = 200 //200-600
var snakeSpacer = 5; //5-15
var maxSnakeSections = 1000;
//scale / speed / spacer
//	 /  2 /  3 / 4 / 5
//1.0/ 15 / 10 / 7 / 6
//0.7/ 12 /  8 / 6 / 5
//0.5/  8 /  5 / 4 / 3
//0.3/  4 /  3 / 3 / 2

function create() {
	
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 600, 600);
	//game.world.setBounds(0, 0, 2400, 1800);
	tilesprite = game.add.tileSprite(0, 0, 2400, 1800, 'tile');
    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(game.world.centerX, game.world.centerY, 'head_s');
    snakeHead.scale.setTo(scaleX,scaleY);
    snakeHead.anchor.setTo(0.5, 0.5);
    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
	game.camera.follow(snakeHead, Phaser.Camera.FOLLOW_LOCKON);
	//snakeBody = game.add.group();

    for (var i = 0; i <= numSnakeSections; i++)
    {
        snakeSection[i] = game.add.sprite(snakeHead.x, snakeHead.y, 'body_s');
        snakeSection[i].scale.setTo(scaleX,scaleY);
        snakeSection[i].anchor.setTo(0.5, 0.5);
		game.physics.enable(snakeSection[i], Phaser.Physics.ARCADE);
    }
    for (var i = 0; i <= snakeSpacer*maxSnakeSections; i++)
    {
        snakePath[i] = new Phaser.Point(snakeHead.x, snakeHead.y);
    }
	foodPool = game.add.group();
	createFood(1);
	snakeHead.bringToTop();
}

function update() {
	if (snakeHead.alive)
	{
		game.physics.arcade.overlap(snakeHead, foodPool, eat);
		moveHead();	
		moveBody();
		if (cursors.left.isDown)
		{
			snakeHead.body.angularVelocity = - ang_speed;
		}
		else if (cursors.right.isDown)
		{
			snakeHead.body.angularVelocity = ang_speed;
		}
		else
		{
			snakeHead.body.angularVelocity = 0;
		}
		checkDeath();
	}
}

function pass() {
	return true;
}

function createFood(n) {
	for (var i = 0; i < n; i++)
	{
		randomX = Math.floor((Math.random() * game.world.width));
		randomY = Math.floor((Math.random() * game.world.height));
		foodPool.create(randomX, randomY, 'food');
		console.log(randomX, randomY, i);
	}
	game.physics.enable(foodPool, Phaser.Physics.ARCADE);
	
}

function eat(head, food) {
	//console.log('food');
	food.kill();
	snakeGrow();
	createFood(1)

}

function snakeGrow() {
	numSnakeSections++;
	//console.log(numSnakeSections, numSnakeSections*snakeSpacer);
	snakeSection[numSnakeSections] = game.add.sprite(snakePath[numSnakeSections*snakeSpacer].x, snakePath[numSnakeSections*snakeSpacer].y, 'body_s');
	snakeSection[numSnakeSections].scale.setTo(scaleX,scaleY);
    snakeSection[numSnakeSections].anchor.setTo(0.5, 0.5);
}
	
function moveHead() {
	var angle = ((Math.PI*2)*snakeHead.angle)/360;
	snakeHead.x += speed*Math.cos(angle);
	snakeHead.y += speed*Math.sin(angle);
}

function moveBody() {
	// Everytime the snake head moves, insert the new location at the start of the array, 
	// and knock the last position off the end
	var part = snakePath.pop();
	part.setTo(snakeHead.x, snakeHead.y);
	snakePath.unshift(part);
	for (var i = 0; i <= numSnakeSections; i++)
	{
		snakeSection[i].x = snakePath[i*snakeSpacer].x;
		snakeSection[i].y = snakePath[i*snakeSpacer].y;
	}
}

function checkDeath() {
	// Check world bounds death
	if ((snakeHead.y > game.world.bounds.height - snakeHead.height/2) ||
		(snakeHead.y < 0 + snakeHead.height/2) ||
		(snakeHead.x > game.world.bounds.width - snakeHead.width/2) ||
		(snakeHead.x < 0 + snakeHead.width/2))
	{
		killSnake();
	}
}

function killSnake(){
	if (game.camera.target)
	{
		game.camera.follow(null);
	}
	for (var i = 0; i <= numSnakeSections; i++)
	{
		snakeSection[i].kill();
	}
	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
	var gameOver = game.add.text(game.world.centerX, game.world.centerY, "Game Over", style);
	gameOver.anchor.setTo(0.5, 0.5);
	game.add.tween(game.camera).to({x: gameOver.x - (game.camera.width / 2),
									y: gameOver.y - (game.camera.height / 2) },
									750, Phaser.Easing.Quadratic.InOut, true);
	snakeHead.kill();
}

function render() {

    //game.debug.spriteInfo(snakeHead, 32, 32);
	//game.debug.spriteBounds(snakeHead);
}