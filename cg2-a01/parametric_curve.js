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
	 * A simple ParametricCurve thats radius can be scaled by one point. It can be move by its center point Parameters: 
	 * 
	 * - center: array object representing [x,y] coordinates of center point 
	 * 
	 * - radius: number representing the radius of the ParametricCurve 
	 * 
	 * - lineStyle: object defining width and color attributes for line drawing, begin of the form {
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
		this.funX = funX ;
		this.funY = funY ;
		this.minT = minT || 0;
		this.maxT = maxT || 1;
		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.lines = [];
		this.marks = [];
		this.tArr = [];
	};
	
	/**
	 * Draw this curve into the provided 2D rendering context - with or without tickmarks
	 */
	ParametricCurve.prototype.draw = function(context) {

		//calculate the length of the straightLines
		var segmentDistance = Math.abs((this.maxT - this.minT) / this.segments);

		// draw actual line
		context.beginPath();

		// reset
		this.tArr = [];
		// calculating all t's
		for ( var i = 0; i <= this.segments; i++) {
			this.tArr.push(this.minT + (i * segmentDistance));
		}

		// drawing all points
		for ( var j = 0; j < this.tArr.length; j++) {

			// calculating new point
			var t = this.tArr[j];
			var x = this.funX(t);
			var y = this.funY(t);

			// if its not the first segment
			if (j != 0) {

				// calculate last point
				t = this.tArr[j - 1];
				var beforeX = this.funX(t);
				var beforeY = this.funY(t);

				var line = new StraightLine([ beforeX, beforeY ], [ x, y ], this.lineStyle);
				line.draw(context);
								
				this.lines.push(line);

				//create the tickmarks
				if (this.tickmarks) {

					// if its not the last segment
					if (j <= this.tArr.length - 2) {
						// calculate next point
						t = this.tArr[j + 1];
						var afterX = this.funX(t);
						var afterY = this.funY(t);
						
						// tangente von x = PunktDanach - PunktDavor / n (zum K�rzen)
						var tangenteX = (afterX - beforeX) / 10;
						var tangenteY = (afterY - beforeY) / 10;

						// normale von [x, y] = [-y, x]
						var normaleX = -tangenteY;
						var normaleY = tangenteX;

						// connect two points for the normale: One over and one under the curve
						var pointOverCurve = [ x + normaleX, y + normaleY ];
						var pointUnderCurve = [ x - normaleX, y - normaleY ];

						var line = new StraightLine(pointOverCurve, pointUnderCurve, {
							width : "1",
							color : "#DF013A"
						});

						line.draw(context);
					}
				}
			}
		}

		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;

		// actually start drawing
		context.stroke();

	};

	/**
	 * Test whether the mouse position is on one of the lines that create the ParametricCurve
	 */
	ParametricCurve.prototype.isHit = function(context, mousePos) {

		for ( var i = 0; i < this.lines.length; i++) {
			var isHit = this.lines[i].isHit(context, mousePos);
			if (isHit) {
				return true;
			}
		}
		return false;
	};

	// the parametric curve has no draggers
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
	ParametricCurve.prototype.getXInput = function() {
		return this.funX;
	};

	ParametricCurve.prototype.setXInput = function(value) {
		this.funX = value;
	};
	
	ParametricCurve.prototype.getYInput = function() {
		return this.funY;
	};

	ParametricCurve.prototype.setYInput = function(value) {
		this.funY = value;
	};
	
	ParametricCurve.prototype.setTickmarks = function(tick) {
		this.tickmarks = tick;
	};

	// this module only exports the constructor for ParametricCurve objects
	return ParametricCurve;
}));
