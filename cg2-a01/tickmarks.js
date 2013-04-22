/*
 * Module: control_polygon
 *
 * A ControlPolygon is a drawable object that displays the frame of a BezierCurve. 
 * It has no interaction functionality.
 *
 */

/* requireJS module definition */
define([ "util", "scene", "straight_line" ], (function(Util, Scene, StraightLine) {

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

	var Tickmarks = function(straightLine) {

		// remember the callbacks
		this.straightLine = straightLine;
//		straightLine.lineStyle.width = "2";
		
		// attribute queried by SceneController to recognize draggers
		this.isDragger = true;

	};

	/*
	 * draw the polygon as four lines
	 */
	Tickmarks.prototype.draw = function(context) {

		this.straightLine.draw(context);
	};

	// this module exposes only the constructor for Dragger objects
	return Tickmarks;

}));