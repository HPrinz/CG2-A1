/*
 * Hala Basali
 * Hanna Prinz
 *
 * Module: BezierCurve
 *
 * This represents a BezierCurve that consists of 4 control points and a style. 
 * These 4 points can be used as draggers to manipulate the curve.
 * A Control Polygon is shown around the curve.
 */

/* requireJS module definition */
define([ "util", "vec2", "scene", "straight_line", "tickmarks", "control_polygon", "point_dragger" , "parametric_curve"], (function(Util, vec2, Scene, StraightLine, Tickmarks,
		ControlPolygon, PointDragger, ParametricCurve) {

	"use strict";

	/**
	 * - p0,p1,p2,p3: 
	 * the four points influencing the form of the bezier curve. Each has a x (p.e. p0[0]) and an y (p.e. p0[1]) coordinate.
	 * p0 is the curve's starting point, p3 is the curve's end point
	 * 
	 * - segements: the number of segments that define how "round" the curve will be
	 * 
	 * - tickmarks: wether to show the tickmarks between the segments
	 * 
	 * - style: the curve's style
	 */
	var BezierCurve = function(p0, p1, p2, p3, segments, tickmarks, style) {

		// draw style for drawing the line
		this.lineStyle = style || {
			width : "2",
			color : "#0000AA"
		};

		// initial values in case either point is undefined
		this.p0 = p0 || [ 100, 100 ];
		this.p1 = p1 || [ 200, 100 ];
		this.p2 = p2 || [ 50, 300 ];
		this.p3 = p3 || [ 300, 100 ];

		// for closure
		var _bezier = this;
		
		// setting the functions to reuse the algorithms of the prametric curve
		this.funX = function(t) {
			return (Math.pow((1 - t), 3) * _bezier.p0[0]) + (3 * Math.pow((1 - t), 2) * t * _bezier.p1[0])
					+ (3 * (1 - t) * Math.pow(t, 2) * _bezier.p2[0]) + (Math.pow(t, 3) * _bezier.p3[0]);
		};
		this.funY = function(t) {
			return (Math.pow((1 - t), 3) * _bezier.p0[1]) + (3 * Math.pow((1 - t), 2) * t * _bezier.p1[1])
					+ (3 * (1 - t) * Math.pow(t, 2) * _bezier.p2[1]) + (Math.pow(t, 3) * _bezier.p3[1]);
		};

		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.minT = 0;
		this.maxT = 1;

		this.lines = [];
		this.tArr = [];
		
		//the curve that we will delegate to for other functions (avoid dublicate Code)
		this.curve = new ParametricCurve(this.funX, this.funY, minT, maxT, segments, tickmarks, style);

	};
	
	/**
	 * Draw this curve into the provided 2D rendering context
	 */
	BezierCurve.prototype.draw = function(context) {
		//delegating to parametric curve
		this.curve.draw(context);
	};

	/**
	 * Test whether the mouse position is on the Bezier
	 */
	BezierCurve.prototype.isHit = function(context, mousePos) {
		//delegating to parametric curve
		this.curve.isHit(context, mousePos);
	};

	/**
	 * Return list of draggers to manipulate this curve. we have 4 PointDragger and 1 ControlPolygon for each Bezier curve.
     */
	BezierCurve.prototype.createDraggers = function() {
		
		var draggers = [];
		
		//closure
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
		
		draggers.push(new ControlPolygon(getP0, getP1, getP2, getP3));

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
	
	BezierCurve.prototype.setTickmarks = function(tick){
		this.curve.tickmarks = tick;
	};
	
	return BezierCurve;

})); // end define
