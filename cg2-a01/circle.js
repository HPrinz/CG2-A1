/*
 * Hala Basali
 * Hanna Prinz
 *
 * Module: circle
 *
 * This represents a circle that has a center, a radius and a style. 
 * It can be hit at the radius line and it's radius can be scaled by a dragger.
 * Also the middlepoint can be dragged to another point.
 */

/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "radius_dragger"], 
       (function(Util,vec2,Scene,PointDragger,RadiusDragger) {
       
    "use strict";

    /**
     *  A simple circle thats radius can be scaled by one point.
	 * It can be move by its center point
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

	/**
     * Draw this line into the provided 2D rendering context
	 */
    Circle.prototype.draw = function(context) {
        // draw actual line
        context.beginPath();
        
        // set points to be drawn
     
        context.arc(this.center[0], this.center[1], // position
                    this.radius,    // radius
                    0.0, Math.PI*2, // start and end angle
                    true); 
        // set drawing style
		context.closePath();
		
		context.lineWidth   = this.lineStyle.width;
        context.strokeStyle = this.lineStyle.color;
        context.fillStyle   = this.lineStyle.color;
		
        // actually start drawing
        context.stroke(); 
    };
	
	/**
	 * Test whether the mouse position is on the circle's radius(+/- 10)
	 */
    Circle.prototype.isHit = function(context,mousePos) {
    
        // check whether the mouse is at the radius +/- 10
        var dx = mousePos[0] - this.center[0];
        var dy = mousePos[1] - this.center[1];
		var condition1 = Math.sqrt(dx*dx + dy*dy) <= (this.radius+10);
		var condition2 = Math.sqrt(dx*dx + dy*dy) >= (this.radius-10); 
        return condition1 && condition2;
    };
	
    /**
	 * Return list of draggers to manipulate this line. we have 1 PointDragger and 1 RadiusDragger for each circle.
     */
	Circle.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
        var draggers = [];
		
        // create closure and callbacks for dragger
        var _circle = this;
        // preparing PointDragger
		var getCenter = function() { return _circle.center; };
        var setCenter = function(dragEvent) { _circle.center = dragEvent.position; };
		// preparing RadiusDragger
		var getRadius = function() { 
			return [_circle.center[0], _circle.center[1] + _circle.radius]; };
		var setRadius = function(dragEvent) {
			// with Math.pow(zahl,exponent) we calculate zahl^exponet
			var quadX = Math.pow((_circle.center[0] - dragEvent.position[0]), 2);
			var quadY = Math.pow((_circle.center[1] - dragEvent.position[1]), 2);
			var pytagoras = Math.sqrt( quadX + quadY);
			_circle.radius = pytagoras;
		};
        draggers.push( new PointDragger(getCenter, setCenter, draggerStyle) );
		draggers.push( new RadiusDragger(getRadius, setRadius, draggerStyle) );
        
        return draggers;
    };
	
	Circle.prototype.getLineColor = function(){
		return this.lineStyle.color;
	};
	
	Circle.prototype.setLineColor = function(colorValue){
		this.lineStyle.color = colorValue;
	};
	
	Circle.prototype.getLineWidth = function(){
		return this.lineStyle.width;
	};
	
	Circle.prototype.setLineWidth = function(widthValue){
		this.lineStyle.width = widthValue;
	};
	
	Circle.prototype.getRadius = function(){
		return this.radius;
	};
	
	Circle.prototype.setNewRadius = function(newRadius){
		this.radius = newRadius;
	};
    
    // this module only exports the constructor for Circle objects
    return Circle;

}));
