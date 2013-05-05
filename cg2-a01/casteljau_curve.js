/*
 * Module: casteljau_curve
 *
 * A CasteljauCurve defines a bezier curve according to the interpolation of 4 points and 
 * a variable t that defines way of interpolation.
 *
 */

/* requireJS module definition */
define([ "util", "scene", "straight_line", "control_polygon" ], (function(Util, Scene, StraightLine, ControlPolygon) {

	"use strict";

	/*
	 * - p0,p1,p2,p3
	 * 
	 * the four points of the control polygon. each has a x (p.e. p0[0]) and an y (p.e. p0[1]) coordinate - drawStyle
	 * [ {radius: 5, width: 2, color: "#FF00FF", fill: false} ]
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
		this.t = t;

		var _casteljau = this;

		var getP0 = function() {
			return _casteljau.p0;
		};

		var getP1 = function() {
			return _casteljau.p1;
		};

		var getP2 = function() {
			return _casteljau.p2;
		};

		var getP3 = function() {
			return _casteljau.p3;
		};

		this.poly0 = new ControlPolygon(getP0, getP1, getP2, getP3, _casteljau.drawStyle);

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

		var depth = 5;
		var style = {
			radius : 5,
			width : 2,
			color : "#0000ff",
			fill : false
		};

		var _casteljau = this;
		for ( var i = 0; i < depth; i++) {

			var getP0 = function() {
				return _casteljau.p0;
			};
			var getA0 = function() {
				return (1 - _casteljau.t) * _casteljau.p0 + _casteljau.t * _casteljau.p1;
			};
			var getA1 = function() {
				return (1 - _casteljau.t) * _casteljau.p1 + _casteljau.t * _casteljau.p2;
			};
			var getA2 = function() {
				return (1 - _casteljau.t) * _casteljau.p2 + _casteljau.t * _casteljau.p3;
			};
			var getB0 = function() {
				return (1 - _casteljau.t) * getA0() + _casteljau.t * getA1();
			};
			var getB1 = function() {
				return (1 - _casteljau.t) * getA1() + _casteljau.t * getA2();
			};
			var getC0 = function() {
				return (1 - _casteljau.t) * getB0() + _casteljau.t * getB1();
			};
			var getP3 = function() {
				return _casteljau.p3;
			};

			var poly1 = new ControlPolygon(getP0, getA0, getB0, getC0, _casteljau.drawStyle);
			var poly2 = new ControlPolygon(getC0, getB0, getA2, getP3, _casteljau.drawStyle);
			// poly1.draw(context);
			// poly2.draw(context);
			console.log("poly1: " + poly1 + ", poly2: " + poly2);

			if (this.showControlPolygons) {
				new StraightLine(getA0(), getA1(), style).draw(context);
				new StraightLine(getA1(), getA2(), style).draw(context);
				new StraightLine(getB0(), getB1(), style).draw(context);
			}
		}

	};

	/*
	 * test whether the specified mouse position "hits" this dragger
	 */
	CasteljauCurve.prototype.isHit = function(context, mousePos) {
	};

	CasteljauCurve.prototype.createDraggers = function() {
		var draggers = [];
		return draggers;
	};

	// this module exposes only the constructor for Dragger objects
	return CasteljauCurve;

}));