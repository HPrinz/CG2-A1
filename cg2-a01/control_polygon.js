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

	var ControlPolygon = function(getP0, getP1, getP2, getP3, setP0, setP1, setP2, setP3, drawStyle) {

		console.log("new ControlPolygon")
		
		// remember the callbacks
		this.getP0 = getP0;
		this.setP0 = setP0;
		this.getP1 = getP1;
		this.setP1 = setP1;
		this.getP2 = getP2;
		this.setP2 = setP2;
		this.getP3 = getP3;
		this.setP3 = setP3;
		
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
		
		// what are my current positions?
		var p0 = this.getP0();
		var p1 = this.getP1();
		var p2 = this.getP2();
		var p3 = this.getP3();

//		console.log("p0 = " + p0 + ", p1 = " + p1+ ", p2 = " + p2 + ", p3 = " + p3);
		
		// what shape to draw
		context.beginPath();
		context.lineTo(p0[0], p0[1]);
		context.lineTo(p1[0], p1[1]);
		context.lineTo(p2[0], p2[1]);
		context.lineTo(p3[0], p3[1]);
		
		// draw style
		context.lineWidth = this.drawStyle.width;
		context.strokeStyle = this.drawStyle.color;

		context.stroke();
	};
	
	/* 
     * test whether the specified mouse position "hits" this dragger
     */
	ControlPolygon.prototype.isHit = function (context,mousePos) {
    
		// what are my current positions?
		var p0 = this.getP0();
		var p1 = this.getP1();
		var p2 = this.getP2();
		var p3 = this.getP3();
    
        // check whether distance between mouse and dragger's center
        // is at max (radius+1) 
        var dx0 = mousePos[0] - p0[0];
        var dy0 = mousePos[1] - p0[1];
        var r0 = this.drawStyle.radius+1;
        return (dx0*dx0 + dy0*dy0) <= (r0*r0);   
        
        var dx1 = mousePos[0] - p1[0];
        var dy1 = mousePos[1] - p1[1];
        var r1 = this.drawStyle.radius+1;
        return (dx1*dx1 + dy1*dy1) <= (r1*r1);   
        
        var dx2 = mousePos[0] - p2[0];
        var dy2 = mousePos[1] - p2[1];
        var r2 = this.drawStyle.radius+1;
        return (dx2*dx2 + dy2*dy2) <= (r2*r2);   
        
        var dx3 = mousePos[0] - p3[0];
        var dy3 = mousePos[1] - p3[1];
        var r3 = this.drawStyle.radius+1;
        return (dx3*dx3 + dy3*dy3) <= (r3*r3);   
    };
        
    /*
     * Event handler triggered by a SceneController when mouse
     * is being dragged
     */
    ControlPolygon.prototype.mouseDrag = function (dragEvent) {
    
        // change position of the associated original (!) object
        this.setP0(dragEvent);
    };

	// this module exposes only the constructor for Dragger objects
	return ControlPolygon;

}));