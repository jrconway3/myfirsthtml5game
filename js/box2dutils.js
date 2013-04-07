/**
  * My First HTML5 Game
  *
  * Based on tutorial by Anderson Rodrigues
  * http://net.tutsplus.com/tutorials/html-css-techniques/build-your-first-game-with-html5/
  *
  * @author David A Conway Jr.
  */


/**
  * Initialize Game
  */
function initGame(){
    // Create 2 Big Platforms
    createBox(world, 3, 230, 60, 180, true, 'ground');
    createBox(world, 560, 360, 50, 50, true, 'ground');
      
    // create small platforms  
    for (var i = 0; i < 5; i++){  
        createBox(world, 150+(80*i), 360, 5, 40+(i*15), true, 'ground');      
    }  
      
    // create player ball  
    var ballSd = new b2CircleDef();  
        ballSd.density = 0.1;
        ballSd.radius = 12;
        ballSd.restitution = 0.5;
        ballSd.friction = 1;
        ballSd.userData = 'player';
    var ballBd = new b2BodyDef();  
        ballBd.linearDamping = .03;
        ballBd.allowSleep = false;
        ballBd.AddShape(ballSd);
        ballBd.position.Set(20,0);
        player.object = world.CreateBody(ballBd);
}  


function drawWorld(world, context) {  
    for (var j = world.m_jointList; j; j = j.m_next) {  
        drawJoint(j, context);  
    }  
    for (var b = world.m_bodyList; b; b = b.m_next) {  
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {  
            drawShape(s, context);  
        }  
    }  
}  
function drawJoint(joint, context) {  
    var b1 = joint.m_body1;  
    var b2 = joint.m_body2;  
    var x1 = b1.m_position;  
    var x2 = b2.m_position;  
    var p1 = joint.GetAnchor1();  
    var p2 = joint.GetAnchor2();  
    context.strokeStyle = '#00eeee';  
    context.beginPath();  
    switch (joint.m_type) {  
    case b2Joint.e_distanceJoint:  
        context.moveTo(p1.x, p1.y);  
        context.lineTo(p2.x, p2.y);  
        break;  
  
    case b2Joint.e_pulleyJoint:  
        // TODO  
        break;  
  
    default:  
        if (b1 == world.m_groundBody) {  
            context.moveTo(p1.x, p1.y);  
            context.lineTo(x2.x, x2.y);  
        }  
        else if (b2 == world.m_groundBody) {  
            context.moveTo(p1.x, p1.y);  
            context.lineTo(x1.x, x1.y);  
        }  
        else {  
            context.moveTo(x1.x, x1.y);  
            context.lineTo(p1.x, p1.y);  
            context.lineTo(x2.x, x2.y);  
            context.lineTo(p2.x, p2.y);  
        }  
        break;  
    }  
    context.stroke();  
}  
function drawShape(shape, context) {  
    context.strokeStyle = '#000000';  
    context.beginPath();  
    switch (shape.m_type) {  
    case b2Shape.e_circleShape:  
        {  
            var circle = shape;  
            var pos = circle.m_position;  
            var r = circle.m_radius;  
            var segments = 16.0;  
            var theta = 0.0;  
            var dtheta = 2.0 * Math.PI / segments;  
            // draw circle  
            context.moveTo(pos.x + r, pos.y);  
            for (var i = 0; i < segments; i++) {  
                var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));  
                var v = b2Math.AddVV(pos, d);  
                context.lineTo(v.x, v.y);  
                theta += dtheta;  
            }  
            context.lineTo(pos.x + r, pos.y);  
      
            // draw radius  
            context.moveTo(pos.x, pos.y);  
            var ax = circle.m_R.col1;  
            var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);  
            context.lineTo(pos2.x, pos2.y);  
        }  
        break;  
    case b2Shape.e_polyShape:  
        {  
            var poly = shape;  
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));  
            context.moveTo(tV.x, tV.y);  
            for (var i = 0; i < poly.m_vertexCount; i++) {  
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));  
                context.lineTo(v.x, v.y);  
            }  
            context.lineTo(tV.x, tV.y);  
        }  
        break;  
    }  
    context.stroke();  
}  
function createWorld() {  
    var worldAABB = new b2AABB();  
    worldAABB.minVertex.Set(-1000, -1000);  
    worldAABB.maxVertex.Set(1000, 1000);  
    var gravity = new b2Vec2(0, 300);  
    var doSleep = true;  
    var world = new b2World(worldAABB, gravity, doSleep);  
    return world;  
}  
  
function createGround(world) {  
    var groundSd = new b2BoxDef();  
    groundSd.extents.Set(1000, 50);  
    groundSd.restitution = 0.2;  
    var groundBd = new b2BodyDef();  
    groundBd.AddShape(groundSd);  
    groundBd.position.Set(-500, 340);  
    return world.CreateBody(groundBd)  
}  
  
function createBall(world, x, y) {  
    var ballSd = new b2CircleDef();  
    ballSd.density = 1.0;  
    ballSd.radius = 20;  
    ballSd.restitution = 1.0;  
    ballSd.friction = 0;  
    var ballBd = new b2BodyDef();  
    ballBd.AddShape(ballSd);  
    ballBd.position.Set(x,y);  
    return world.CreateBody(ballBd);  
}  
  
function createBox(world, x, y, width, height, fixed, userData) {  
    if (typeof(fixed) == 'undefined') fixed = true;  
    var boxSd = new b2BoxDef();  
    if (!fixed) boxSd.density = 1.0;  
      
    boxSd.userData = userData;  
      
    boxSd.extents.Set(width, height);  
    var boxBd = new b2BodyDef();  
    boxBd.AddShape(boxSd);  
    boxBd.position.Set(x,y);  
    return world.CreateBody(boxBd)  
}