var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'jormungand', { preload: preload, create: create, update: update,render : render });

function preload() {
    game.load.image('head','assets/circle_head.png');
    game.load.image('body','assets/circle.png');
	game.load.image('head_s','assets/circle_head_small.png');
    game.load.image('body_s','assets/circle_small.png');
	game.load.image('tile','assets/tile.png');

}

var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 3; //number of snake body sections
var scaleX = 0.7;
var scaleY = 0.7;
var speed = 11;
var snakeSpacer = 90/speed; //15; //parameter that sets the spacing between sections
//var n = 1;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //game.world.setBounds(0, 0, 800, 600);
	game.world.setBounds(0, 0, 2400, 1800);
	tilesprite = game.add.tileSprite(0, 0, 2400, 1800, 'tile');
    cursors = game.input.keyboard.createCursorKeys();

    snakeHead = game.add.sprite(400, 300, 'head_s');
    snakeHead.scale.setTo(scaleX,scaleY);
    snakeHead.anchor.setTo(0.5, 0.5);

    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
    
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400+(snakeHead.height*i), 300, 'body_s');
        snakeSection[i].scale.setTo(scaleX,scaleY);
        snakeSection[i].anchor.setTo(0.5, 0.5);
		game.physics.enable(snakeSection[i], Phaser.Physics.ARCADE);
    }
    
    //  Init snakePath array
    for (var i = 0; i <= snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }
	snakeHead.bringToTop();
	game.camera.follow(snakeHead, Phaser.Camera.FOLLOW_LOCKON);
	snakeHead.body.collideWorldBounds = true;
	

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
	game.physics.arcade.moveToObject(snakeSection[1], snakeHead, speed*60);
	//console.log(snakeSection[1].y, snakeSection[2].y);
	for (var i = 2; i <= numSnakeSections - 1; i++)
	{
		section = snakeSection[i];
		previous = snakeSection[i-1];
		//console.log(i);
		//console.log(section.y, previous.velocity);
		game.physics.arcade.moveToObject(section, previous, speed*60)
		//snakeSection[i].x = snakePath[i*Math.floor(snakeSpacer/numSnakeSections)].x;
		//snakeSection[i].y = snakePath[i*Math.floor(snakeSpacer/numSnakeSections)].y;
	}
    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }
	else
	{
	    snakeHead.body.angularVelocity = 0;
	}
	//n += 1

}

function render() {

    //game.debug.spriteInfo(snakeHead, 32, 32);
	//game.debug.spriteBounds(snakeHead);
}