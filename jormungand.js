var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'jormungand', { preload: preload, create: create, update: update,render : render });

function preload() {
    game.load.image('head','assets/circle_head.png');
    game.load.image('body','assets/circle.png');
	game.load.image('head_s','assets/circle_head_small.png');
    game.load.image('body_s','assets/circle_small.png');
	game.load.image('tile','assets/tile.png');

}

var snakeHead;
var snakeSection = new Array();
var snakePath = new Array();
var numSnakeSections = 10; //1-3000
var scaleX = 0.3; //0.3 - 1
var scaleY = scaleX;
var speed = 5; //2-5
var ang_speed = 200 //200-600
var snakeSpacer = 2; //5-15
//scale / speed / spacer
//	 /  2 /  3 / 4 / 5
//1.0/ 15 / 10 / 7 / 6
//0.7/ 12 /  8 / 6 / 5
//0.5/  8 /  5 / 4 / 3
//0.3/  4 /  3 / 3 / 2

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //game.world.setBounds(0, 0, 800, 600);
	game.world.setBounds(0, 0, 2400, 1800);
	tilesprite = game.add.tileSprite(0, 0, 2400, 1800, 'tile');
    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(400, 300, 'head_s');
    snakeHead.scale.setTo(scaleX,scaleY);
    snakeHead.anchor.setTo(0.5, 0.5);
	snakeHead.outOfBoundsKill = true;
	snakeHead.checkWorldBounds = true;
	
    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
    snakeHead.events.onOutOfBounds.add(killSnake, this);
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400+(snakeHead.height*i), 300, 'body_s');
        snakeSection[i].scale.setTo(scaleX,scaleY);
        snakeSection[i].anchor.setTo(0.5, 0.5);
		//game.physics.enable(snakeSection[i], Phaser.Physics.ARCADE);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= snakeSpacer*numSnakeSections; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }
	snakeHead.bringToTop();
	game.camera.follow(snakeHead, Phaser.Camera.FOLLOW_LOCKON);
	//snakeHead.body.collideWorldBounds = true
	

}

function update() {

	//speed += 1;
	
	// Everytime the snake head moves, insert the new location at the start of the array, 
	// and knock the last position off the end

	//n = 1;
	var angle = ((Math.PI*2)*snakeHead.angle)/360;
	snakeHead.x += speed*Math.cos(angle);
	snakeHead.y += speed*Math.sin(angle);
	var part = snakePath.pop();
	
	part.setTo(snakeHead.x, snakeHead.y);

	snakePath.unshift(part);
	//game.physics.arcade.moveToObject(snakeSection[1], snakeHead, speed*60);
	//console.log(snakeSection[1].y, snakeSection[2].y);
	for (var i = 1; i <= numSnakeSections - 1; i++)
	{
		//section = snakeSection[i];
		//previous = snakeSection[i-1];
		//console.log(i);
		//console.log(section.y, previous.velocity);
		//game.physics.arcade.moveToObject(section, previous, speed*60)
		snakeSection[i].x = snakePath[i*snakeSpacer].x;
		snakeSection[i].y = snakePath[i*snakeSpacer].y;
	}
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
	//n += 1

}

function killSnake(){
	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
	var gameOver = game.add.text(game.world.centerX, game.world.centerY, "Game Over", style);
	gameOver.anchor.setTo(0.5, 0.5);
	for (var i = 1; i <= numSnakeSections-1; i++)
	{
		snakeSection[i].kill();
	}
	if (game.camera.target)
	{
		game.camera.follow(null);
	}
	game.add.tween(game.camera).to({x: gameOver.x - (game.camera.width / 2),
									y: gameOver.y - (game.camera.height / 2) },
									750, Phaser.Easing.Quadratic.InOut, true);
}

function render() {

    //game.debug.spriteInfo(snakeHead, 32, 32);
	//game.debug.spriteBounds(snakeHead);
}