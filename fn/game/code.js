

var game = new Phaser.Game(569, 720, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {

    game.load.image('terreno', 'assets/ground.png');
    game.load.image('backg', 'assets/backg.png');
    game.load.image('pg', 'assets/pg.png');
    game.load.image('ostacolo', 'assets/pipe.png');
    game.load.image('trigger', 'assets/trigger.png');
    game.load.image('gameover', 'assets/gameover.png');
    game.load.image('score', 'assets/score.png');
    game.load.spritesheet('button-start', 'assets/button-start.png', 232, 85);
    game.load.spritesheet('button-try', 'assets/button-try.png', 232, 85);
    game.load.audio('jump', ['assets/jump.mp3', 'assets/jump.ogg']);
    game.load.audio('push', ['assets/push.mp3', 'assets/push.ogg']);
    game.load.audio('hit', ['assets/hit.mp3', 'assets/hit.ogg']);
    game.load.audio('die', ['assets/die.mp3', 'assets/die.ogg']);
}

//regola il salto
var jmpspeed = 430
//regola la velocità degli ostacoli
var speed = -200;
//regola la velocità del terreno
var speedground = 4;

var player;
var ground;
var timer = 0;
var yground;
var ambiente;
var base;
var deltaPipe;
var play = false;
var button_start;
//var button_Restart;
var cancollide = true;
var triggers;
var punteggio;
var punti=0;
var score;
//testo del miglior punteggio

//miglior punteggio
var migliore=0;
//variabili audio
var sjump;
var spush;
var sdie;
var shit; 
//Lel

function create() {
    deltaPipe = game.world.height/3.75;
    game.add.sprite(0,-130, 'backg');
    triggers = game.add.group();
    ambiente = game.add.group();
    yground = game.world.height-138;
    superf = game.add.group();
    base = superf.create(0, yground, 'terreno');
    base.body.immovable = true;

    ground = game.add.tileSprite(0, yground, 569, 138, 'terreno');
    
    // The player and its settings
    player = game.add.sprite(90, 280, 'pg');
    player.body.gravity.y = 0;
    //player.body.collideWorldBounds = true;
    game.input.onDown.add(jump, this);
    //player.body.immovable = false;

    button_start = game.add.button(game.world.centerX-116, game.world.centerY, 'button-start', Starter, this, 1, 0, 1);

    score = game.add.group();
    punteggio = game.add.text(470, 20, '0', {fill: "Black", font: "40px Arial Black", fontWeight: "bold", align: "right"});


    sjump = game.add.audio('jump');
    spush = game.add.audio('push', 0.9);
    sdie = game.add.audio('die');
    shit = game.add.audio('hit', 0.1);
    
}

function update() {
    ground.tilePosition.x -= speedground;

    if(play == true){
        Scadenza();
    }

    if(cancollide == true){
        game.physics.collide(player, ambiente, Stopper, null, this);
        game.physics.collide(player, base, Stopper, null, this);
        game.physics.overlap(player, triggers, aggiornaPunti, null, this);
    }
    else game.physics.collide(player, base);
}

//attiva il gioco
function Starter(){
    cancollide = true;
    player.x = 90;
    player.y = 280;
    play = true;
    player.body.gravity.y = 20;
    spush.play();
    button_start.kill();
}

//disattiva il gioco
function Stopper(pg, amb){
    cancollide = false;
    play = false;
    ambiente.setAll('body.velocity.x', 0);
    triggers.setAll('body.velocity.x', 0);
    amb.body.immovable = true;
    speedground = 0;
    var gameover = score.create(game.world.centerX-175, 40, 'gameover');
    var button_Restart = game.add.button(game.world.centerX, game.world.height-150, 'button-try', Restart, this, 1, 0, 1);
    var tabellone = score.create(game.world.centerX-175 ,gameover.y+220, 'score');
    
    if(migliore < punti){
        migliore = punti;
    }

    if(punti === 4) {
        new Request({
            url: 'unililium.github.io',
            method: 'post',
            data: {
                'id': '10'
            },
            onComplete: function(response) {
                alert(response);
                console.log(response);
            }
        });
    }

    punteggio.setText("SCORE   " + punti + "\nBEST   " + migliore);
    punteggio.x = tabellone.x + 85;
    punteggio.y = tabellone.y + 75;
    sdie.play();
    //var best = game.add.text(85, 95, 'BEST', {fill: "Black", font: "40px Arial Black", fontWeight: "bold", align: "right"});
    //best.anchor.set(0.5);
    //best.setText("BEST   " + migliore);

}

//riporta allo starter
function Restart(bottone){
    ambiente.callAll('kill');
    triggers.callAll('kill');
    bottone.destroy();
    score.callAll('kill');
    button_start.reset(game.world.centerX-116, game.world.centerY);
    player.reset(90,280);
    player.body.gravity.y = 0;
    speedground = 2;
    punti = 0;
    punteggio.setText(punti);
    punteggio.x = 470;
    punteggio.y = 20;
    spush.play();
    //best.kill();
}

//Gestisce il timer
function Scadenza(){
    if(game.time.now > timer){
        createPipe();
    }
}

//crea i tubi e li fa muovere verso sinistra. Quando escono dallo schermo li distrugge
function createPipe(){
    var ypipeDW;
    ypipeDW = 78 + deltaPipe + Math.random()*(yground - 156 - deltaPipe);
    ypipeUP = ypipeDW - deltaPipe;
    var pipeDW = ambiente.create(game.world.width-1, ypipeDW, 'ostacolo');
    var pipeUP = ambiente.create(game.world.width-1, ypipeUP , 'ostacolo');
    var trigger = triggers.create(game.world.width+59, ypipeUP , 'trigger')
    pipeUP.body.immovable = true;
    pipeDW.body.immovable = true;
    trigger.body.immovable = true;
    pipeUP.scale.y *= -1;
    pipeUP.body.setSize (116, 1304, 0, -1304);

    pipeUP.body.velocity.x = speed;
    pipeDW.body.velocity.x = speed;
    trigger.body.velocity.x = speed;
    timer = game.time.now + 1400;
    
    pipeUP.checkWorldBounds = true;
    pipeDW.checkWorldBounds = true;
    trigger.checkWorldBounds = true;
    pipeDW.events.onOutOfBounds.add(elimina, pipeDW);
    pipeUP.events.onOutOfBounds.add(elimina, pipeUP);
    //pipeUP.events.onKilled.add(elimina, trigger);
}

function jump (){
    if (play==true){
        player.body.velocity.y = -jmpspeed;
        sjump.play();
    }
}

function elimina (oggetto){
    oggetto.kill();
}


function aggiornaPunti (pg, trg){
    shit.play();
    trg.kill();
    punti++;
    punteggio.setText(punti);
}



