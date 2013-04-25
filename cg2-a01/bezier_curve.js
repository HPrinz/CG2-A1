/*
 * Hala Basali
 * Hanna Prinz
 *
 * Module: BezierCurve
 *
 * This represents a BezierCurve that consists of 4 control points and a style. 
 * These 4 points can be used as draggers to manipulate the curve.
 */

/* requireJS module definition */
define([ "util", "vec2", "scene", "straight_line" , "tickmarks" ,"parametric_curve"], (function(Util, vec2, Scene, StraightLine, Tickmarks, ParametricCurve) {

	"use strict";

	var BezierCurve = function(minT, maxT, point0, point1, point2, point3, segments, tickmarks, style) {
		
	    // draw style for drawing the line
        this.lineStyle = style || { width: "2", color: "#0000AA" };
        
        // initial values in case either point is undefined
		this.p0 = point0 || [-1,0];
	    this.p1 = point1 || [0,1];
	    this.p2 = point2 || [0,-1];
        this.p3 = point3 || [1,0];
		
		this.funX = Math.pow((1 - t), 3) * p0[0] + 3 * Math.pow(1 - t, 2) * t * p1[0] + 3 * (1 - t) * Math.pow(t, 2) * p2[0] + Math.pow(t, 3) * p3[0];
		this.funY = Math.pow((1 - t), 3) * p0[1] + 3 * Math.pow(1 - t, 2) * t * p1[1] + 3 * (1 - t) * Math.pow(t, 2) * p2[1] + Math.pow(t, 3) * p3[1];
		
		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.minT = minT || 0;
		this.maxT = maxT || Math.PI * 2;
		
		this.lines = [];

		this.tArr = [];
		
	};
	
	/**
	 * Draw this curve into the provided 2D rendering context
	 */
	BezierCurve.prototype.draw = function (context) {
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
	
	BezierCurve.prototype.isHit = function(context, mousePos) {
		for ( var i = 0; i < this.lines.length; i++) {
			var isHit = this.lines[i].isHit(context, mousePos);
			if (isHit) {
				console.log("We hit a line!");
				return true;
			}
		}

		return false;
	}; 
	
	return BezierCurve;
	
})); // end define