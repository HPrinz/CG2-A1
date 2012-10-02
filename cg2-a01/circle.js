/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
    "use strict";

    /**
     *  A simple circle that can be scaled 
     *  by one point.
     *  Parameters:
     *  - center: array object representing [x,y] coordinates of center point
	 *  - radius: number representing the radius of the circle
     *  - lineStyle: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var Circle = function(center, radius, lineStyle) {

        console.log("Creating circle with center point[" + 
                    center[0] + "," + center[1] + "] and radius " +
                    radius + ".");
        
        // draw style for drawing the line
        this.lineStyle = lineStyle || { width: "2", color: "#AA00AA" };

        // convert to Vec2 just in case the points were given as arrays
        this.center = center || [0,0];
        this.radius = radius || 10;
        
    };

    // draw this line into the provided 2D rendering context
    Circle.prototype.draw = function(context) {

	
		var center = this.center;
        // draw actual line
        context.beginPath();
        
        // set points to be drawn
     
        context.arc(center[0], center[1], // position
                    this.radius,    // radius
                    0.0, Math.PI*2, // start and end angle
                    true); 
        // set drawing style
		context.lineWidth = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;
        context.fillStyle   = this.lineStyle.color;
		
        // actually start drawing
        context.stroke(); 
        
    };

    // test whether the mouse position is on this line segment
    Circle.prototype.isHit = function(context,pos) {
    
        // what is my current position?
        var center = this.getCenter();
    
        // check whether distance between mouse and dragger's center
        // is at max (radius+1) 
        var dx = mousePos[0] - center[0];
        var dy = mousePos[1] - center[1];
        var r = this.center + this.radius+2;
        return (dx*dx + dy*dy) <= (r*2);           

    };
    
    // return list of draggers to manipulate this line
    Circle.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
        var draggers = [];
		
        // create closure and callbacks for dragger
        var center = this;
        var getCenter = function() { return center; };
        var setCenter = function(dragEvent) { center = dragEvent.position; };
        draggers.push( new PointDragger(getCenter, setCenter, draggerStyle) );
        
        return draggers;
        
    };
    
    // this module only exports the constructor for Circle objects
    return Circle;

})); // define

    
