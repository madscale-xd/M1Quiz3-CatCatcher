//initialize the whole thing
var config = {
    type: Phaser.AUTO,
    width: 1470,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//some variables for the game conditions
let jarreColor = "transparent";             //stores Jarre's color
let alertShown = false;                     //flag for making the alert show only once
let musicLoaded = false;                    //flag for preventing the infinite calling of the music-loading function
var game = new Phaser.Game(config);

function preload ()    
{
    //all images for the backgrounds and sprites
    this.load.image('paper','./assets/images/paper.jpg');
    this.load.image('redbg','./assets/images/redbg.jpg');
    this.load.image('yellowbg','./assets/images/yellowbg.jpg');
    this.load.image('sunset','./assets/images/sunset.jpg');
    this.load.image('jarre','./assets/images/jarre.png');
    this.load.image('jarreRed','./assets/images/jarreRed.png');
    this.load.image('jarreOrange','./assets/images/jarreOrange.png');
    this.load.image('jarreYellow','./assets/images/jarreYellow.png');
    this.load.image('sun','./assets/images/sun.png');
    this.load.image('sunRed','./assets/images/sunRed.png');
    this.load.image('sunOrange','./assets/images/sunOrange.png');
    this.load.image('sunYellow','./assets/images/sunYellow.png');
    this.load.image('paintRed','./assets/images/paintRed.png');
    this.load.image('paintYellow','./assets/images/paintYellow.png');
    this.load.image('grass1','./assets/images/grass1.png');
    this.load.image('grass2','./assets/images/grass2.png');
    this.load.image('grass3','./assets/images/grass3.png');
}

function create ()
{
    //background
    background = this.add.image(0,0,'paper');

    //platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(100, 240, 'grass3').setScale(2,2).refreshBody();
    platforms.create(1400, 240, 'grass3').setScale(2,2).refreshBody();
    platforms.create(1200, 710, 'grass2');
    platforms.create(200, 610, 'grass1');
    platforms.create(770, 460, 'grass3');

    //player
    player = this.physics.add.sprite(310,15,"jarre").setScale(0.35,0.35);
    this.physics.add.collider(player, platforms);
    player.setCollideWorldBounds(true);
    cursors = this.input.keyboard.createCursorKeys();

    //sun
    sun = this.physics.add.sprite(1300,115,"sun").setScale(0.5);
    this.physics.add.collider(sun,platforms);

    //red paint
    red = this.physics.add.sprite(150,470,"paintRed").setScale(0.5);
    this.physics.add.collider(red,platforms);

    //yellow paint
    yellow = this.physics.add.sprite(1220,575,"paintYellow").setScale(0.5);
    this.physics.add.collider(yellow,platforms);
}

function update ()
{
    //player controls
    if(cursors.left.isDown){
        player.x -= 2;
        player.flipX = true;
    }

    if(cursors.right.isDown){
        player.x += 2;
        player.flipX = false;
    }

    if(cursors.up.isDown && player.body.touching.down){     //allows proper jumping with cooldowns
        player.setVelocityY(-500); 
    }

    //collisions that trigger the functions below, integral to the flow of the gameplay
    this.physics.add.overlap(player,sun,SunCheck);
    this.physics.add.overlap(player,red,redPaint);
    this.physics.add.overlap(player,yellow,yellowPaint);
}

//changes the color of Jarre to red when touching the red paint blob, or orange when already yellow
function redPaint(){
    alertShown = false;
    if(jarreColor == "transparent"){
        player.setTexture('jarreRed');
        jarreColor = "red";
    }else if(jarreColor == "yellow"){
        player.setTexture('jarreOrange');
        jarreColor = "orange";
    }
    red.destroy();
}

//changes the color of Jarre to yellow when touching the yellow paint blob, or orange when already red
function yellowPaint(){
    alertShown = false;
    if(jarreColor == "transparent"){
        player.setTexture('jarreYellow');
        jarreColor = "yellow";
    }else if(jarreColor == "red"){
        player.setTexture('jarreOrange');
        jarreColor = "orange";
    }
    yellow.destroy();
}

//when Jarre collides with the Sun, shows a different alert/plays different music based on Jarre's color
//Jarre's color is dictated by the value of the jarreColor string
function SunCheck(){
    if(jarreColor == "transparent"){
        if(alertShown == false){
            alert("THE SUN SHOULD NOT BE TRANSPARENT!");
            alertShown = true;
        }
    }
    else if (jarreColor == "red") {
        sun.setTexture('sunRed');
        if (!alertShown) {
            alert("THE SUN'S COLOR IS NOT RED!");
            alertShown = true;
        }
        background.setTexture('redbg');
        background.x = 750;
        background.y = 360;
        sun.setTexture('sunRed');
        if (!musicLoaded) {
            bgMusic.src = "./assets/audio/redtaytay.mp3";
            bgMusic.load();
            musicLoaded = true; 
        }
    }
    else if(jarreColor == "yellow"){
        if(alertShown == false){
            alert("THE SUN'S COLOR IS NOT YELLOW!");
            alertShown = true;
        }
        background.setTexture('yellowbg');
        background.x = 750;
        background.y = 430;
        sun.setTexture('sunYellow');
        if(!musicLoaded){
            bgMusic.src = "./assets/audio/yellowsub.mp3";
            bgMusic.load();
            musicLoaded = true;
        }
    }
    else if(jarreColor == "orange"){
        if(alertShown == false){
            alert("YOU'RE RIGHT! THE SUN'S COLOR IS ORANGE!");
            alertShown = true;
        }
        background.setTexture('sunset');
        background.x = 750;
        background.y = 360;
        sun.destroy();
        bgMusic.src = "./assets/audio/ride.mp3";
        bgMusic.load();
    }
}