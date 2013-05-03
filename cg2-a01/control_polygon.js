/*
 * Module: control_polygon
 *
 * A ControlPolygon is a drawable object that displays the frame of a BezierCurve. 
 * It has no interaction functionality.
 *
 */

/* requireJS module definition */
define([ "util", "scene" , "straight_line" , "point_dragger" ], (function(Util, Scene, StraightLine, PointDragger) {

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

	var ControlPolygon = function(getP0, getP1, getP2, getP3, drawStyle) {

		console.log("new ControlPolygon");
		
		// remember the callbacks
		this.getP0 = getP0;
		this.getP1 = getP1;
		this.getP2 = getP2;
		this.getP3 = getP3;
		
		// default draw style
		this.drawStyle = {
			radius : 5,
			width : 2,
			color : "#ff0000",
			fill : false
		};

		this.drawStyle.color = "#ff0000";

		// attribute queried by SceneController to recognize draggers
		this.isDragger = true;
	};

	/*
	 * draw the polygon as four lines
	 */
	ControlPolygon.prototype.draw = function(context) {		
		
		new StraightLine(this.getP0(), this.getP1(), this.drawStyle).draw(context);
		new StraightLine(this.getP1(), this.getP2(), this.drawStyle).draw(context);
		new StraightLine(this.getP2(), this.getP3(), this.drawStyle).draw(context);
	};
	
	/* 
     * test whether the specified mouse position "hits" this dragger
     */
	ControlPolygon.prototype.isHit = function (context,mousePos) {    
    };

	// this module exposes only the constructor for Dragger objects
	return ControlPolygon;

}));