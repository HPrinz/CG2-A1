/*
 * Hala Basali
 * Hanna Prinz
 *
 * Module: ParametricCurve
 *
 * This represents a ParametricCurve that has a center, a radius and a style. 
 * It can be hit at the radius line and it's radius can be scaled by a dragger.
 * Also the middlepoint can be dragged to another point.
 */

/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "radius_dragger"], 
       (function(Util,vec2,Scene,PointDragger,RadiusDragger) {
       
    "use strict";

    /**
     *  A simple ParametricCurve thats radius can be scaled by one point.
	 * It can be move by its center point
     *  Parameters:
     *  - center: array object representing [x,y] coordinates of center point
	 *  - radius: number representing the radius of the ParametricCurve
     *  - lineStyle: object defining width and color attributes for line drawing, 
     *       begin of the form { width: 2, color: "#00FF00" }
     */ 

    var ParametricCurve = function(funX, funY, minT, maxT, segments, tickmarks, style) {

        console.log("Creating ParametricCurve with functions x(t)=" + 
                    funX + ", y(t)=" + funY + ", defined in [" +
                    maxT + "|" + minT + "], with " + segments + 
					" segments and tickmarks shown? " + tickmarks + ".");
        
        // draw style for drawing the line
        this.lineStyle = style || { width: "2", color: "#AA00AA" };

        // convert to Vec2 just in case the points were given as arrays
        this.funX = funX || 1;
        this.funY = funY || 5;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
    };

	/**
     * Draw this line into the provided 2D rendering context
	 */
    ParametricCurve.prototype.draw = function(context) {
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
	 * Test whether the mouse position is on the ParametricCurve's radius(+/- 10)
	 */
    ParametricCurve.prototype.isHit = function(context,mousePos) {
    
        // check whether the mouse is at the radius +/- 10
        var dx = mousePos[0] - this.center[0];
        var dy = mousePos[1] - this.center[1];
		var condition1 = Math.sqrt(dx*dx + dy*dy) <= (this.radius+10);
		var condition2 = Math.sqrt(dx*dx + dy*dy) >= (this.radius-10); 
        return condition1 && condition2;
    };
	
    /**
	 * Return list of draggers to manipulate this line. we have 1 PointDragger and 1 RadiusDragger for each ParametricCurve.
     */
	ParametricCurve.prototype.createDraggers = function() {
    
        var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true };
        var draggers = [];
		
        // create closure and callbacks for dragger
        var _ParametricCurve = this;
        // preparing PointDragger
		var getCenter = function() { return _ParametricCurve.center; };
        var setCenter = function(dragEvent) { _ParametricCurve.center = dragEvent.position; };
		// preparing RadiusDragger
		var getRadius = function() { return [_ParametricCurve.center[0], _ParametricCurve.center[1]+_ParametricCurve.radius]; };
		var setRadius = function(dragEvent) {
			// with Math.pow(zahl,exponent) we calculate zahl^exponet
			var quadX = Math.pow((_ParametricCurve.center[0] - dragEvent.position[0]), 2);
			var quadY = Math.pow((_ParametricCurve.center[1] - dragEvent.position[1]), 2);
			var pytagoras = Math.sqrt( quadX + quadY);
			_ParametricCurve.radius = pytagoras;
		};
        
		console.log("createDraggers. Radius = " + _ParametricCurve.radius);
        return draggers;
    };
	
	ParametricCurve.prototype.getLineColor = function(){
		return this.lineStyle.color;
	};
	
	ParametricCurve.prototype.setLineColor = function(colorValue){
		this.lineStyle.color = colorValue;
	};
	
	ParametricCurve.prototype.getLineWidth = function(){
		return this.lineStyle.width;
	};
	
	ParametricCurve.prototype.setLineWidth = function(widthValue){
		this.lineStyle.width = widthValue;
	};
	
	ParametricCurve.prototype.getRadius = function(){
		return this.radius;
	};
	
	ParametricCurve.prototype.setNewRadius = function(newRadius){
		this.radius = newRadius;
	};
    
    // this module only exports the constructor for ParametricCurve objects
    return ParametricCurve;

}));
