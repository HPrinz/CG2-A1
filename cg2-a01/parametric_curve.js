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
define([ "util", "vec2", "scene" ], (function(Util, vec2, Scene, PointDragger,
		RadiusDragger) {

	"use strict";

	/**
	 * A simple ParametricCurve thats radius can be scaled by one point. It can
	 * be move by its center point Parameters: - center: array object
	 * representing [x,y] coordinates of center point - radius: number
	 * representing the radius of the ParametricCurve - lineStyle: object
	 * defining width and color attributes for line drawing, begin of the form {
	 * width: 2, color: "#00FF00" }
	 */

	var ParametricCurve = function(funX, funY, minT, maxT, segments, tickmarks,
			style) {

		console.log("Creating ParametricCurve with functions x(t)=" + funX
				+ ", y(t)=" + funY + ", defined in [" + maxT + "|" + minT
				+ "], with " + segments + " segments and tickmarks shown? "
				+ tickmarks + ".");

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
	};

	/**
	 * Draw this line into the provided 2D rendering context
	 */
	ParametricCurve.prototype.draw = function(context) {
		// draw actual line
		context.beginPath();

		for ( var t = this.minT; t <= this.maxT; t++) {

			var x = eval(this.funX);
			var y = eval(this.funY);

			context.lineTo(x, y);

		}
		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;

		// actually start drawing
		context.stroke();

		// function fun1(x) {return Math.sin(x); }
		// function fun2(x) {return Math.cos(3*x);}

		// function draw() {
		// var canvas = document.getElementById("canvas");
		// if (null==canvas || !canvas.getContext) return;

		// var axes={}, ctx=canvas.getContext("2d");
		// axes.x0 = .5 + .5*canvas.width; // x0 pixels from left to x=0
		// axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
		// axes.scale = 40; // 40 pixels from x=0 to x=1
		// axes.doNegativeX = true;

		// showAxes(ctx,axes);
		// funGraph(ctx,axes,fun1,"rgb(11,153,11)",1);
		// funGraph(ctx,axes,fun2,"rgb(66,44,255)",2);
		// }

		// function funGraph (ctx,axes,func,color,thick) {
		// var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
		// var iMax = Math.round((ctx.canvas.width-x0)/dx);
		// var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
		// ctx.beginPath();
		// ctx.lineWidth = thick;
		// ctx.strokeStyle = color;

		// for (var i=iMin;i<=iMax;i++) {
		// xx = dx*i; yy = scale*func(xx/scale);
		// if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
		// else ctx.lineTo(x0+xx,y0-yy);
		// }
		// ctx.stroke();
		// }

		// function showAxes(ctx,axes) {
		// var x0=axes.x0, w=ctx.canvas.width;
		// var y0=axes.y0, h=ctx.canvas.height;
		// var xmin = axes.doNegativeX ? 0 : x0;
		// ctx.beginPath();
		// ctx.strokeStyle = "rgb(128,128,128)";
		// ctx.moveTo(xmin,y0); ctx.lineTo(w,y0); // X axis
		// ctx.moveTo(x0,0); ctx.lineTo(x0,h); // Y axis
		// ctx.stroke();
		// }

	};

	/**
	 * Test whether the mouse position is on the ParametricCurve's radius(+/-
	 * 10)
	 */
	ParametricCurve.prototype.isHit = function(context, mousePos) {

		// check whether the mouse is at the radius +/- 10
		var dx = mousePos[0] - this.center[0];
		var dy = mousePos[1] - this.center[1];
		var condition1 = Math.sqrt(dx * dx + dy * dy) <= (this.radius + 10);
		var condition2 = Math.sqrt(dx * dx + dy * dy) >= (this.radius - 10);
		return condition1 && condition2;
	};


	/**
	 * Return list of draggers to manipulate this line. we have 1 PointDragger
	 * and 1 RadiusDragger for each ParametricCurve.
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
