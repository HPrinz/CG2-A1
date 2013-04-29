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
define([ "util", "vec2", "scene", "straight_line", "tickmarks", "control_polygon", "point_dragger" ], (function(Util, vec2, Scene, StraightLine, Tickmarks,
		ControlPolygon, PointDragger) {

	"use strict";

	var BezierCurve = function(minT, maxT, point0, point1, point2, point3, segments, tickmarks, style) {

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
			return (Math.pow((1 - t), 3) * this.p0[0]) + (3 * Math.pow((1 - t), 2) * t * this.p1[0])
					+ (3 * (1 - t) * Math.pow(t, 2) * this.p2[0]) + (Math.pow(t, 3) * this.p3[0]);
		};
		this.funY = function(t) {
			return (Math.pow((1 - t), 3) * this.p0[1]) + (3 * Math.pow((1 - t), 2) * t * this.p1[1])
					+ (3 * (1 - t) * Math.pow(t, 2) * this.p2[1]) + (Math.pow(t, 3) * this.p3[1]);
		};

		this.segments = segments || 5;
		this.tickmarks = tickmarks;
		this.minT = minT || 0;
		this.maxT = maxT || Math.PI * 2;

		this.lines = [];

		this.tArr = [];

	};

	BezierCurve.prototype.setTickmarks = function(tick){
		this.tickmarks = tick;
	};
	
	/**
	 * Draw this curve into the provided 2D rendering context
	 */
	BezierCurve.prototype.draw = function(context) {
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
			var x = this.funX(t);
			var y = this.funY(t);

			// draw the line to it
			context.lineTo(x, y);

			// for isHit()
			if (j != 0) {

				// calculate last point
				t = this.tArr[j - 1];
				var beforeX = this.funX(t);
				var beforeY = this.funY(t);

				// save as StraightLine for the isHit()-function without drawing the line!
				var line = new StraightLine([ beforeX, beforeY ], [ x, y ], this.lineStyle);
				this.lines.push(line);
			}
		}

		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;

		// actually start drawing
		context.stroke();
		
		 for ( var j = 0; j < this.marks.length; j++){
		 this.marks[j].draw(context);
		 }
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

	/**
	 * Return list of draggers to manipulate this line. we have 4 PointDragger, 1 ControlPolygon and Tickmarks for each bézier curve.
     */
	BezierCurve.prototype.createDraggers = function() {

		var draggers = [];

		var curve = this;
		
		var getP0 = function() {
			return curve.p0;
		};
		var getP1 = function() {
			return curve.p1;
		};
		var getP2 = function() {
			return curve.p2;
		};
		var getP3 = function() {
			return curve.p3;
		};
		var setP0 = function(dragEvent) {
			curve.p0 = dragEvent.position;
		};
		var setP1 = function(dragEvent) {
			curve.p1 = dragEvent.position;
		};
		var setP2 = function(dragEvent) {
			curve.p2 = dragEvent.position;
		};
		var setP3 = function(dragEvent) {
			curve.p3 = dragEvent.position;
		};

		draggers.push(new PointDragger(getP0, setP0, curve.drawStyle));
		draggers.push(new PointDragger(getP1, setP1, curve.drawStyle));
		draggers.push(new PointDragger(getP2, setP2, curve.drawStyle));
		draggers.push(new PointDragger(getP3, setP3, curve.drawStyle));
		
		draggers.push(new ControlPolygon(getP0, getP1, getP2, getP3,  setP0, this.lineStyle));
		

		// set tickmarks if its set and if we are not at the first or last point
		if (this.tickmarks) {
			for ( var j = 1; j < this.tArr.length; j++) {

				// calculate current point
				var t = this.tArr[j];
				var x = this.funX(t);
				var y = this.funY(t);

				// calculate last point
				t = this.tArr[j - 1];
				var beforeX = this.funX(t);
				var beforeY = this.funY(t);

				// calculate next point
				t = this.tArr[j + 1];
				var afterX = this.funX(t);
				var afterY = this.funY(t);

				// tangente von x = PunktDanach - PunktDavor / n (zum Kürzen)
				var tangenteX = (afterX - beforeX) / 8;
				var tangenteY = (afterY - beforeY) / 8;

				// normale von [x, y] = [-y, x]
				var normaleX = -tangenteY;
				var normaleY = tangenteX;

				// connect two points for the normale: One over and one under the curve
				var pointOverCurve = [ x + normaleX, y + normaleY ];
				var pointUnderCurve = [ x - normaleX, y - normaleY ];

				draggers.push(new Tickmarks(pointOverCurve, pointUnderCurve));
			}
		}

		return draggers;
	};
	
	BezierCurve.prototype.getLineColor = function(){
		return this.lineStyle.color;
	};
	
	BezierCurve.prototype.setLineColor = function(colorValue) {
		this.lineStyle.color = colorValue;
	};
	
	BezierCurve.prototype.getLineWidth = function(){
		return this.lineStyle.width;
	};
	
	BezierCurve.prototype.setLineWidth = function(widthValue) {
		this.lineStyle.width = widthValue;
	};
	
	return BezierCurve;

})); // end define
