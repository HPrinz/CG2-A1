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
define([ "util", "vec2", "scene", "straight_line" ], (function(Util, vec2, Scene, StraightLine) {

	"use strict";

	/**
	 * A simple ParametricCurve thats radius can be scaled by one point. It can be move by its center point Parameters: -
	 * center: array object representing [x,y] coordinates of center point - radius: number representing the radius of
	 * the ParametricCurve - lineStyle: object defining width and color attributes for line drawing, begin of the form {
	 * width: 2, color: "#00FF00" }
	 */

	var ParametricCurve = function(funX, funY, minT, maxT, segments, tickmarks, style) {

//		console.log("Creating ParametricCurve with functions x(t)=" + funX + ", y(t)=" + funY + ", defined in [" + maxT + "|" + minT
//				+ "], with " + segments + " segments and tickmarks shown? " + tickmarks + ".");

		// draw style for drawing the line
		this.lineStyle = style || {
			width : "2",
			color : "#AA00AA"
		};

		// convert to Vec2 just in case the points were given as arrays
		this.funX = funX || 1;
		this.funY = funY || 5;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.lines = [];
	};

	/**
	 * Draw this line into the provided 2D rendering context
	 */
	ParametricCurve.prototype.draw = function(context) {
		// draw actual line
		context.beginPath();
		
//		console.log("segments = " + this.segments + "\n minT = " + this.minT + " maxT = " + this.maxT);
		
		var segmentDistance = Math.abs((this.maxT - this.minT)/this.segments);
		
//		console.log("segmentsDistance = " + segmentDistance);
		
		// draw the first point
		var t = this.minT;
		var x = eval(this.funX);
		var y = eval(this.funY);
		context.lineTo(x, y);

		//draw all other points
		for ( t = this.minT + segmentDistance; t <= this.maxT; t = t + segmentDistance) {
			
			// calculating last point
			t = t - segmentDistance;
			var xBefore = eval(this.funX);
			var yBefore = eval(this.funY);
			t = t + segmentDistance;
			
			//calculating new point
			var x = eval(this.funX);
			var y = eval(this.funY);

			//draw the line
			context.lineTo(x, y);
			
//			// set tickmarks
//			if(this.tickmarks == true) {
//				// funX
//				var xPrev = x - segmentDistance;
//				var xNext = x + segmentDistance;
//				var diffX = (xNext - xPrev) / 2;
//				// funY
//				var yPrev = y - segmentDistance;
//				var yNext = y + segmentDistance;
//				var diffY = (yNext - yPrev) / 2;
//				
//				var line = new StraightLine([diffX - 1, diffY - 1], [diffX + 1, diffY + 1], this.lineStyle);
//				   console.log("creating straight line from [" + 
//		                    (diffX - 1) + "," + (diffY - 1) + "] to [" +
//		                    (diffX + 1) + "," + (diffY + 1) + "].");
//				   
//				   scene.addObjects([ line ]);
//					sceneController.deselect();
//					sceneController.select(line);
//			}
			
			// save as StraightLine for the isHit()-function without drawing the line!
			var line = new StraightLine([xBefore, yBefore], [x,y],this.lineStyle);
			this.lines.push(line);

		}
		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;

		// actually start drawing
		context.stroke();

	};

	/**
	 * Test whether the mouse position is on the ParametricCurve's radius(+/- 10)
	 */
	ParametricCurve.prototype.isHit = function(context, mousePos) {

		 for(var i = 0; i < this.lines.length; i++) {
			 var isHit = this.lines[i].isHit(context, mousePos);
			 if (isHit){
				 console.log("We hit a line!");
				 return true;
			 }
		 }
		
		return false;
	};

	/**
	 * Return list of draggers to manipulate this line. we have 1 PointDragger and 1 RadiusDragger for each
	 * ParametricCurve.
	 */
	ParametricCurve.prototype.createDraggers = function() {
		return [];
	};

	ParametricCurve.prototype.getLineColor = function() {
		return this.lineStyle.color;
	};

	ParametricCurve.prototype.setLineColor = function(colorValue) {
		this.lineStyle.color = colorValue;
	};

	ParametricCurve.prototype.getLineWidth = function() {
		return this.lineStyle.width;
	};

	ParametricCurve.prototype.setLineWidth = function(widthValue) {
		this.lineStyle.width = widthValue;
	};

	ParametricCurve.prototype.getRadius = function() {
		return this.radius;
	};

	ParametricCurve.prototype.setNewRadius = function(newRadius) {
		this.radius = newRadius;
	};

	// this module only exports the constructor for ParametricCurve objects
	return ParametricCurve;

}));
