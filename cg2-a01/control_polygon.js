/*
 * Module: control_polygon
 *
 * A ControlPolygon is a drawable object that displays the frame of a BezierCurve. 
 * It has no interaction functionality.
 *
 */

/* requireJS module definition */
define([ "util", "scene" ], (function(Util, Scene) {

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

	var ControlPolygon = function(p0, p1, p2, p3, drawStyle) {

		// remember the callbacks
		this.p0 = p0;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;

		// default draw style
		this.drawStyle = drawStyle || {
			radius : 5,
			width : 2,
			color : "#ff0000",
			fill : false
		};

		this.drawstyle.color = "#ff0000";

		// attribute queried by SceneController to recognize draggers
		this.isDragger = true;

	};

	/*
	 * draw the polygon as four lines
	 */
	ControlPolygon.prototype.draw = function(context) {

		// what shape to draw
		context.beginPath();
		context.lineTo(this.p0[0], this.p0[1]);
		context.lineTo(this.p1[0], this.p1[1]);
		context.lineTo(this.p2[0], this.p2[1]);
		context.lineTo(this.p3[0], this.p3[1]);

		// draw style
		context.lineWidth = this.drawStyle.width;
		context.strokeStyle = this.drawStyle.color;

		context.stroke();
	};

	// this module exposes only the constructor for Dragger objects
	return ControlPolygon;

}));