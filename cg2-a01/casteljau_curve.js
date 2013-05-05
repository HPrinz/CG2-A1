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
		
		var a0 = (1 - this.t) * this.p0 + this.t * this.p1;
		var a1 = (1 - this.t) * this.p1 + this.t * this.p2;
		var a2 = (1 - this.t) * this.p2 + this.t * this.p3;
		
		var b0 = (1 - this.t) * a0 + this.t * a1;
		var b1 = (1 - this.t) * a1 + this.t * a2;
		
		var c0 = (1 - this.t) * b0 + this.t * b1;
		
		var poly1 = new ControlPolygon(this.p0, a0, b0, c0, this.drawStyle);
		var poly2 = new ControlPolygon(c0, b1, a2, this.p3, this.drawStyle);
		poly1.draw(context);
		poly2.draw(context);

		var style = {
				radius : 5,
				width : 2,
				color : "#0000ff",
				fill : false
			};
		if(this.showControlPolygons) {
			new StraightLine(a0, a1, style).draw(context);
			new StraightLine(a1, a2, style).draw(context);
			new StraightLine(b0, b1, style).draw(context);
		}
		
		var depth = 5;
		for(var i = 0; i < depth; i++) {
			
		}

	};
	
	/* 
     * test whether the specified mouse position "hits" this dragger
     */
	CasteljauCurve.prototype.isHit = function (context,mousePos) {    
    };
    
    CasteljauCurve.prototype.createDraggers = function() {
    	
    }

	// this module exposes only the constructor for Dragger objects
	return CasteljauCurve;

}));