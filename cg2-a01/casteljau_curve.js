/*
 * Module: casteljau_curve
 *
 * A CasteljauCurve defines a bezier curve according to the interpolation of 4 points and 
 * a variable t that defines way of interpolation.
 *
 */

/* requireJS module definition */
define([ "util", "scene" , "straight_line" , "control_polygon" ], (function(Util, Scene, StraightLine, ControlPolygon) {

	"use strict";

	/*
	 * - p0,p1,p2,p3
	 * 
	 * the four points of the control polygon. each has a x (p.e. p0[0]) and an y (p.e. p0[1]) coordinate
	 *  - drawStyle [ {radius: 5, width: 2, color: "#FF00FF", fill: false} ]
	 * 
	 * specification object for the drawing style, example see above
	 * 
	 */

	var CasteljauCurve = function(getP0, getP1, getP2, getP3, t, showControlPolygons, drawStyle) {

		console.log("new CasteljauCurve");
		
		// remember the callbacks
		this.p0 = getP0;
		this.p1 = getP1;
		this.p2 = getP2;
		this.p3 = getP3;
		this.poly0 =  new ControlPolygon(this.p0, this.p1, this.p2, this.p3, this.drawStyle);
		
		this.t = t;
		this.showControlPolygons = showControlPolygons;
		// default draw style
		this.drawStyle = {
			radius : 5,
			width : 2,
			color : "#ff0000",
			fill : false
		};

		// attribute queried by SceneController to recognize draggers
		this.isDragger = true;
	};

	/*
	 * draw the polygon as four lines
	 */
	CasteljauCurve.prototype.draw = function(context) {		
		
		this.poly0.draw(context);
		
		var p0 = this.p0;
		var p1 = this.p1;
		var p2 = this.p2;
		var p3 = this.p3;
		var t  = this.t;
		
		// defines the depth of divisions of the control polygon.
		var depth = 5;
		var style = {
				radius : 5,
				width : 2,
				color : "#0000ff",
				fill : false
		};
		
		for(var i = 0; i < depth; i++) {
			
			var a0 = (1 - t) * p0 + t * p1;
			var a1 = (1 - t) * p1 + t * p2;
			var a2 = (1 - t) * p2 + t * p3;
			
			var b0 = (1 - t) * a0 + t * a1;
			var b1 = (1 - t) * a1 + t * a2;
			
			var c0 = (1 - t) * b0 + t * b1;
			
			var poly1 = new ControlPolygon(p0, a0, b0, c0, style);
			var poly2 = new ControlPolygon(c0, b1, a2, p3, style);
//			poly1.draw(context);
//			poly2.draw(context);
			console.log("poly1: " + poly1 + ", poly2: " + poly2);
			
			if(this.showControlPolygons) {
				new StraightLine(a0, a1, style).draw(context);
				new StraightLine(a1, a2, style).draw(context);
				new StraightLine(b0, b1, style).draw(context);
			}
		}
	};
	
	/* 
     * test whether the specified mouse position "hits" this dragger
     */
	CasteljauCurve.prototype.isHit = function (context,mousePos) {    
    };
    
    CasteljauCurve.prototype.createDraggers = function() {
    	var draggers = [];
    	return draggers;
    }

	// this module exposes only the constructor for Dragger objects
	return CasteljauCurve;

}));