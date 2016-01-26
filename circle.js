//will be moving the code to typescript.
//this will shaow the basic game

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
	    var T_CHANGE = 5;
	    var T_UPMS = 200;

	    var game = new Phaser.Game(newWidth, newHeight, Phaser.AUTO, 'phaser-example', { create: create, update : update });

	    var numOFCircles;
	    var circles = [];
	    var colors = ['#669BF2','#EA4335','#FBBC05','#34A853'];
	    var bmdArray = [];


	    function create(){

	    	//start with 2 circles
	    	numOFCircles = 30;

	    	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	    	game.physics.startSystem(Phaser.Physics.P2JS);
	    	game.stage.backgroundColor = '#000000';
	    	initGame();

	    	game.time.events.loop(T_UPMS, updateSprites , this);
	    	//game.physics.arcade.gravity.y = 200;
	    };

	    function initGame(){
	    	
	    	var radius = Math.floor(getMaxObjWidth()/2);
	    	var c = -1;
	    	circles.length = 0;
	    	circles.push(new Circle(newWidth/2, newHeight/2,radius,( ++c % colors.length), SHAPES.Circle));
	    	for(var i=1; i < numOFCircles; ++i){
	    		circles.push(new Circle(
	    			Math.floor(Math.random() * newWidth), 
	    			Math.floor(Math.random() * newHeight),
	    			radius,
	    			( ++c % colors.length), 
	    			SHAPES.Circle));
	    	}

	    	for(var i=0; i < circles.length; ++i){
	    		circles[i].makeSprite();
	    		game.physics.p2.enable([circles[i].sprite]);
	    		circles[i].sprite.body.collideWorldBounds = true;
	    		circles[i].sprite.body.setCircle(circles[i].radius);
	    	}

	    	circles[0].sprite.body.static = true;
	    };

	    function update(){
	    	var colorToCheck = circles[0].colorIndex;
	    	var allSame = true;
	    	for(var i=1; i < numOFCircles; ++i){

	    		if(distanceBetween(circles[0].sprite,circles[i].sprite) < 100 ){
	    			speed = 300;
	    		}
	    		else{
	    			speed = 200;
	    		}
	    		accelerateToObject(circles[i].sprite, circles[0].sprite,speed);

	    		if(circles[i].colorIndex != colorToCheck){
	    			allSame = false;
	    		}
	    	}

	    	if(allSame){
	    		clearCircles();
	    		numOFCircles++;
	    		allSame = false;
	    		initGame();
	    	}
	    }

	    var Circle = function(x,y,radius,colorIndex,shape){
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.colorIndex = colorIndex;
			this.shape = shape;
			this.sprite;

			this.touchedOnce = false;
			this.upCount;

			this.makeSprite = function(){
				var bmd = game.add.bitmapData(radius*2,radius*2);
				bmd.circle(radius, radius, radius, colors[this.colorIndex]);

				this.sprite = game.add.sprite(x, y, bmd);
				this.sprite.alpha = 0;
				game.add.tween(this.sprite).to( { alpha: 1 }, 2000, "Linear", true);

				this.sprite.inputEnabled = true;
				this.sprite.events.onInputDown.add(this.clicked, this);
			};

			this.update = function(){
				if(this.touchedOnce){
					this.upCount++;
					//console.log(this.upCount);
					if(this.upCount > T_CHANGE*1000/T_UPMS){
						this.clicked();
					}
					else{
						var sectorAngle = ((this.upCount*T_UPMS)/T_CHANGE)*0.360;
						//console.log(sectorAngle);
						var bmd = game.add.bitmapData(radius*2,radius*2);
						bmd.circle(radius, radius, radius, colors[this.colorIndex]);

						bmd.context.beginPath();
						bmd.context.strokeStyle = '#000000';
						bmd.context.fillStyle = colors[(this.colorIndex+1)%colors.length];
						bmd.context.moveTo(radius,radius);
						bmd.context.arc(radius,radius,radius,0,toRadians(sectorAngle));
						bmd.context.lineTo(radius,radius);
						bmd.context.fill();

						bmd.circle(radius, radius, radius - radius/10, colors[this.colorIndex]);

						this.sprite.loadTexture(bmd);
					}
				}
			};

			this.updateSprite = function(){
				var bmd = game.add.bitmapData(2*radius,2*radius);
				bmd.circle(radius, radius, radius, colors[this.colorIndex]);
				this.sprite.loadTexture(bmd);
			};

			this.clicked = function(){
				//console.log("++" + this.colorIndex)
				this.touchedOnce = true;
				this.upCount = 0;
				this.colorIndex = (this.colorIndex + 1) % colors.length;
				this.update();
				//this.updateSprite();
				//console.log("--" + this.colorIndex);
			};

			this.remove = function(){
				this.sprite.destroy();
			}
		};

		function updateSprites(){
			//console.log("update");
			for(var i=0; i < numOFCircles; ++i){
				circles[i].update();
			}
		}

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

		function clearCircles(){
			for(var i = 0; i < circles.length; ++i){
				circles[i].remove();
			}
			circles.length = 0;
		}

		function toRadians(deg) {
		    return deg * Math.PI / 180;
		}

}
