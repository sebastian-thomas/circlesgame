var circleGame = function(){

        var targetWidth = 480; // the width of the game we want
        var targetHeight = 720;
        var deviceRatio = (window.innerWidth/window.innerHeight);
        var newRatio = (targetHeight/targetWidth)*deviceRatio;

        var newWidth = targetWidth*newRatio;
        var newHeight = targetHeight;

	    //var width = window.innerWidth * window.devicePixelRatio;
	    //var height = window.innerHeight * window.devicePixelRatio;

	    //Game Constants
	    var MAX_OBJS = 50;
	    var SHAPES = {Circle:0, Square:1, Triangle:2};

	    var game = new Phaser.Game(newWidth, newHeight, Phaser.AUTO, 'phaser-example', { create: create, update : update });

	    var numOFCircles;
	    var circles = [];
	    var colors = ['#669BF2','#EA4335','#FBBC05','#34A853'];
	    var bmdArray = [];


	    function create(){
	    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    	game.physics.startSystem(Phaser.Physics.P2JS);
	    	game.stage.backgroundColor = '#000000';
	    	initGame();

	    	for(var i=0; i<numOFCircles; ++i){
	    		game.physics.p2.enable([circles[i].sprite]);
	    		circles[i].sprite.body.collideWorldBounds = true;
	    		circles[i].sprite.body.setCircle(circles[i].radius);
	    	}
	    	circles[0].sprite.body.static = true;
	    	//game.physics.arcade.gravity.y = 200;
	    };

	    function initGame(){
	    	numOFCircles = 4;

	    	var radius = Math.floor(getMaxObjWidth()/2);

	    	var c1 = new Circle(100,150,radius,0, SHAPES.Circle);
	    	var c2 = new Circle(100,450,radius,1, SHAPES.Circle);
	    	var c3 = new Circle(300,150,radius,2, SHAPES.Circle);
	    	var c4 = new Circle(400,450,radius,3, SHAPES.Circle);

	    	circles.push(c1);
	    	circles.push(c2);
	    	circles.push(c3);
	    	circles.push(c4);

	    	for(var i=0; i < circles.length; ++i){
	    		circles[i].makeSprite();
	    	}
	    };

	    function update(){
	    	for(var i=1; i < numOFCircles; ++i){
	    		if(distanceBetween(circles[0].sprite,circles[i].sprite) < 100 ){
	    			speed = 300;
	    		}
	    		else{
	    			speed = 200;
	    		}
	    		accelerateToObject(circles[i].sprite, circles[0].sprite,speed);
	    	}
	    }

	    var Circle = function(x,y,radius,colorIndex,shape){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.colorIndex = colorIndex;
			this.shape = shape;
			this.sprite;

			this.makeSprite = function(){
				var bmd = game.add.bitmapData(radius*2,radius*2);
				bmd.circle(radius, radius, radius, colors[this.colorIndex]);
				this.sprite = game.add.sprite(x, y, bmd);
				this.sprite.alpha = 0;
				game.add.tween(this.sprite).to( { alpha: 1 }, 2000, "Linear", true);

				this.sprite.inputEnabled = true;
				this.sprite.events.onInputDown.add(this.clicked, this);
			};

			this.updateSprite = function(){
				var bmd = game.add.bitmapData(2*radius,2*radius);
				bmd.circle(radius, radius, radius, colors[this.colorIndex]);
				this.sprite.loadTexture(bmd);
			};

			this.clicked = function(){
				//console.log("++" + this.colorIndex)
				this.colorIndex = (this.colorIndex + 1) % colors.length;
				this.updateSprite();
				//console.log("--" + this.colorIndex);
			};
		};

		function distanceBetween(spriteA,spriteB){
		    var dx = spriteA.body.x - spriteB.body.x;  //distance ship X to planet X
		    var dy = spriteA.body.y - spriteB.body.y;  //distance ship Y to planet Y
		    var dist = Math.sqrt(dx*dx + dy*dy);     //pythagoras ^^  (get the distance to each other)
		    return dist;
		}

		function accelerateToObject(obj1, obj2, speed) {
			//console.log(obj1.body);
		    if (typeof speed === 'undefined') { speed = 20; }
		    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
		    obj1.body.rotation = angle + game.math.degToRad(180);  // correct angle if wanted
		    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
		    obj1.body.force.y = Math.sin(angle) * speed;
		}

		function getMaxObjWidth(){
			var totalArea = newWidth * (newHeight - 0.1*newHeight);
			var areaObj = totalArea / MAX_OBJS;
			var maxWidth = Math.floor(Math.sqrt(areaObj))
			console.log("Maxobj width : "+ maxWidth);
			return maxWidth;
		}

}
