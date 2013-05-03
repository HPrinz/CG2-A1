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
define([ "util", "vec2", "scene", "straight_line", "tickmarks", "control_polygon", "point_dragger" , "parametric_curve"], (function(Util, vec2, Scene, StraightLine, Tickmarks,
		ControlPolygon, PointDragger, ParametricCurve) {

	"use strict";

	var BezierCurve = function(minT, maxT, point0, point1, point2, point3, segments, tickmarks, deCasteljau, style) {

		// draw style for drawing the line
		this.lineStyle = style || {
			width : "2",
			color : "#0000AA"
		};

		// initial values in case either point is undefined
		this.p0 = point0 || [ 100, 100 ];
		this.p1 = point1 || [ 200, 100 ];
		this.p2 = point2 || [ 50, 300 ];
		this.p3 = point3 || [ 300, 100 ];

		this.funX = function(t) {
			return (Math.pow((1 - t), 3) * point0[0]) + (3 * Math.pow((1 - t), 2) * t * point1[0])
					+ (3 * (1 - t) * Math.pow(t, 2) * point2[0]) + (Math.pow(t, 3) * point3[0]);
		};
		this.funY = function(t) {
			return (Math.pow((1 - t), 3) * point0[1]) + (3 * Math.pow((1 - t), 2) * t * point1[1])
					+ (3 * (1 - t) * Math.pow(t, 2) * point2[1]) + (Math.pow(t, 3) * point3[1]);
		};

		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.minT = minT || 0;
		this.maxT = maxT || Math.PI * 2;

		this.lines = [];

		this.tArr = [];
		this.deCasteljau = deCasteljau;
		
		this.curve = new ParametricCurve(this.funX, this.funY, minT, maxT, segments, tickmarks, style);

	};

	BezierCurve.prototype.setTickmarks = function(tick){
		this.curve.tickmarks = tick;
	};
	
	/**
	 * Draw this curve into the provided 2D rendering context
	 */
	BezierCurve.prototype.draw = function(context) {
		this.curve.draw(context);
	};

	BezierCurve.prototype.isHit = function(context, mousePos) {
		for ( var i = 0; i < this.curve.lines.length; i++) {
			var isHit = this.curve.lines[i].isHit(context, mousePos);
			if (isHit) {
				console.log("We hit a line!");
				return true;
			}
		}

		return false;
	};

	/**
	 * Return list of draggers to manipulate this line. we have 4 PointDragger, 1 ControlPolygon and Tickmarks for each b�zier curve.
     */
	BezierCurve.prototype.createDraggers = function() {

		var draggers = [];
		
		var bezier = this;
		
		var getP0 = function() {
			return bezier.p0;
		};
		var getP1 = function() {
			return bezier.p1;
		};
		var getP2 = function() {
			return bezier.p2;
		};
		var getP3 = function() {
			return bezier.p3;
		};
		var setP0 = function(dragEvent) {
			console.log("bezier: " + bezier.p0 + "/" + bezier.p1);
			bezier.p0 = dragEvent.position;
		};
		var setP1 = function(dragEvent) {
			bezier.p1 = dragEvent.position;
		};
		var setP2 = function(dragEvent) {
			bezier.p2 = dragEvent.position;
		};
		var setP3 = function(dragEvent) {
			bezier.p3 = dragEvent.position;
		};

		draggers.push(new PointDragger(getP0, setP0, bezier.drawStyle));
		draggers.push(new PointDragger(getP1, setP1, bezier.drawStyle));
		draggers.push(new PointDragger(getP2, setP2, bezier.drawStyle));
		draggers.push(new PointDragger(getP3, setP3, bezier.drawStyle));
		
		draggers.push(new ControlPolygon(getP0, getP1, getP2, getP3,  setP0, setP1, setP2, setP3, this.curve.lineStyle));
		
		
		if(this.deCasteljau) {
			var s = 2/3;
			var a0 = (1 - s) * this.p0 + s * this.p1;
			var a1 = (1 - s) * this.p1 + s * this.p2;
			var a2 = (1 - s) * this.p2 + s * this.p3;
			
			var b0 = (1 - s) * a0 + s * a1;
			var b1 = (1 - s) * a1 + s * a2;
			
			var c0 = (1 - s) * b0 + s * b1;
		}

		return draggers;
	};
	
	BezierCurve.prototype.getLineColor = function(){
		return this.curve.lineStyle.color;
	};
	
	BezierCurve.prototype.setLineColor = function(colorValue) {
		this.curve.lineStyle.color = colorValue;
	};
	
	BezierCurve.prototype.getLineWidth = function(){
		return this.curve.lineStyle.width;
	};
	
	BezierCurve.prototype.setLineWidth = function(widthValue) {
		this.curve.lineStyle.width = widthValue;
	};
	
	return BezierCurve;

})); // end define
