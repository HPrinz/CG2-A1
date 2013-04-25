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
define([ "util", "vec2", "scene", "straight_line", "tickmarks" ], (function(Util, vec2, Scene, StraightLine, Tickmarks) {

	"use strict";

	/**
	 * A simple ParametricCurve thats radius can be scaled by one point. It can be move by its center point Parameters: -
	 * center: array object representing [x,y] coordinates of center point - radius: number representing the radius of
	 * the ParametricCurve - lineStyle: object defining width and color attributes for line drawing, begin of the form {
	 * width: 2, color: "#00FF00" }
	 */

	var ParametricCurve = function(funX, funY, minT, maxT, segments, tickmarks, style) {

		 console.log("Creating ParametricCurve with functions x(t)=" + funX + ", y(t)=" + funY + ", defined in [" + maxT + "|" + minT
				+ "], with " + segments + " segments and tickmarks shown? " + tickmarks + ".");

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

		this.tArr = [];
	};

	ParametricCurve.prototype.setTickmarks = function(tick){
		this.tickmarks = tick;
	};
	
	/**
	 * Draw this line into the provided 2D rendering context
	 */
	ParametricCurve.prototype.draw = function(context) {

		// reset
		this.tArr = [];

		var segmentDistance = Math.abs((this.maxT - this.minT) / this.segments);

		// draw actual line
		context.beginPath();

		// calculating all t's
		for ( var i = 0; i <= this.segments; i++) {
			this.tArr.push(this.minT + (i * segmentDistance));
		}

		// drawing all points
		for ( var j = 0; j < this.tArr.length; j++) {

			// console.log("tArr = " + this.tArr);

			// calculating new point
			var t = this.tArr[j];
			var x = eval(this.funX);
			var y = eval(this.funY);

			// draw the line to it
			context.lineTo(x, y);

			// for isHit()
			if (j != 0) {
				
				// calculate last point
				t = this.tArr[j - 1];
				var beforeX = eval(this.funX);
				var beforeY = eval(this.funY);

				// save as StraightLine for the isHit()-function without drawing the line!
				var line = new StraightLine([ beforeX, beforeY ], [ x, y ], this.lineStyle);
				this.lines.push(line);
			}
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

		for ( var i = 0; i < this.lines.length; i++) {
			var isHit = this.lines[i].isHit(context, mousePos);
			if (isHit) {
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

		var draggers = [];

		// set tickmarks if its set and if we are not at the first or last point
		if (this.tickmarks) {
			for ( var j = 1; j < this.tArr.length; j++) {

				// calculate current point
				var t = this.tArr[j];
				var x = eval(this.funX);
				var y = eval(this.funY);

				// calculate last point
				t = this.tArr[j - 1];
				var beforeX = eval(this.funX);
				var beforeY = eval(this.funY);

				// calculate next point
				t = this.tArr[j + 1];
				var afterX = eval(this.funX);
				var afterY = eval(this.funY);

				// tangente von x = PunktDanach - PunktDavor / n (zum Kürzen)
				var tangenteX = (afterX - beforeX) / 8;
				var tangenteY = (afterY - beforeY) / 8;

				// normale von [x, y] = [-y, x]
				var normaleX = -tangenteY;
				var normaleY = tangenteX;

				// connect two points for the normale: One over and one under the curve
				var pointOverCurve = [ x + normaleX, y + normaleY ];
				var pointUnderCurve = [ x - normaleX, y - normaleY ];

				var mark = new StraightLine(pointOverCurve, pointUnderCurve, {
					width : "1",
					color : "#DF013A"
				});

				draggers.push(new Tickmarks(mark));
			}
		}

		return draggers;
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
