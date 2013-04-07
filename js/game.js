/**
  * My First HTML5 Game
  *
  * Based on tutorial by Anderson Rodrigues
  * http://net.tutsplus.com/tutorials/html-css-techniques/build-your-first-game-with-html5/
  *
  * @author David A Conway Jr.
  */


    // some variables that we gonna use in this demo  
    var initId = 0;
    var player = function(){
        this.object = null;
        this.canJump = false;
    };
    var world;
    var ctx;
    var canvasWidth;
    var canvasHeight;
    var keys = [];

    /**
      * Make Step
      */
    function step() {
        // Check Position
        if (player.object.GetCenterPosition().y > canvasHeight){
            player.object.SetCenterPosition(new b2Vec2(20,0),0)
        }
        else if (player.object.GetCenterPosition().x > canvasWidth-50){
            showWin();
            return;
        }

        handleInteractions();

        var stepping = false;
        var timeStep = 1.0/60;
        var iteration = 1;
        // 1
        world.Step(timeStep, iteration);

        // 2
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawWorld(world, ctx);

        // 3
        setTimeout('step()', 10);
    }

    /**
      * Show Win
      */
    function showWin(){  
        ctx.fillStyle    = '#000';  
        ctx.font         = '30px verdana';  
        ctx.textBaseline = 'top';  
        ctx.fillText('Stage 1 Complete.', 200, 150);
    }

    /**
      * Handle Interactions
      */
    function handleInteractions(){
        // up arrow
        // 1
        var collision = world.m_contactList;  
        player.canJump = false;  
        if (collision != null){  
            if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){  
                if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){  
                    var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                    var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());  
                    if (playerObj.y < groundObj.y){  
                        player.canJump = true;  
                    }  
                }  
            }  
        }

        // 2  
        var vel = player.object.GetLinearVelocity();

        // 3  
        if (keys[38] && player.canJump){  
            vel.y = -150;     
        }

        // 4  
        // left/right arrows  
        if (keys[37]){  
            vel.x = -60;  
        }  
        else if (keys[39]){  
            vel.x = 60;  
        }

        // 5  
        player.object.SetLinearVelocity(vel);  
    }

    // HTML5 onLoad event  
    Event.observe(window, 'load', function() {  
        world = createWorld(); // box2DWorld   
        ctx = $('game').getContext('2d'); // 2  
        var canvasElm = $('game');  
        canvasWidth = parseInt(canvasElm.width);  
        canvasHeight = parseInt(canvasElm.height);  
        initGame(); // 3  
        step(); // 4
          
        // 5
        window.addEventListener('keydown',handleKeyDown,true);   
        window.addEventListener('keyup',handleKeyUp,true);
    });


    /**
      * Handle Movements
      */
    function handleKeyDown(evt){
        keys[evt.keyCode] = true;  
    }  
    function handleKeyUp(evt){  
        keys[evt.keyCode] = false;  
    }  
      
    // Disable Vertical Scrolling
    document.onkeydown=function(event){
        return event.keyCode!=38 && event.keyCode!=40
    }