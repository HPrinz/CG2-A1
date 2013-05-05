/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

/* requireJS module definition */

define([ "jquery", "straight_line", "circle", "parametric_curve" , "bezier_curve", "casteljau_curve"], (function($, StraightLine, Circle, ParametricCurve, BezierCurve, CasteljauCurve) {

	"use strict";

	/**
	 * define callback functions to react to changes in the HTML page and provide them with a closure defining context
	 * and scene
	 */
	var HtmlController = function(context, scene, sceneController) {

		/**
		 * 
		 * this is called when a object is selected. It checks if the selected object is a circle or a line and shows/
		 * hides radius button and input field
		 */
		var selectionHandler = function() {
			changeHandler();
			var obj = sceneController.getSelectedObject();
			if (obj instanceof Circle || obj instanceof StraightLine || obj.lines[0] instanceof StraightLine) {
				if (obj instanceof Circle) {
					$("#radiusInput").show();
				} else{
					$("#radiusInput").hide();
				}
			}
		};

		sceneController.onSelection(selectionHandler);

		/**
		 * this is called when a object is changed
		 */
		var changeHandler = function() {

			var obj = sceneController.getSelectedObject();

			if (obj instanceof Circle || obj instanceof StraightLine) {
				$("#colorInput").attr("value", obj.getLineColor());
				$("#lineWidth").attr("value", Math.floor(obj.getLineWidth()));

				if (obj instanceof Circle) {
					$("#radiusInput").attr("value", Math.floor(obj.getRadius()));
				}
			}
			else if (obj instanceof ParametricCurve){
				$("#colorInput").attr("value", obj.lines[0].getLineColor());
				$("#lineWidth").attr("value", Math.floor(obj.lines[0].getLineWidth()));
			} 
			else if (obj instanceof BezierCurve){
				$("#colorInput").attr("value", obj.getLineColor());
				$("#lineWidth").attr("value", Math.floor(obj.getLineWidth()));
			}
		};

		sceneController.onObjChange(changeHandler);

		// generate random X coordinate within the canvas
		var randomX = function() {
			return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
		};

		// generate random Y coordinate within the canvas
		var randomY = function() {
			return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
		};

		// generate random Y coordinate within the canvas
		var randomRadius = function() {
			return Math.floor((Math.random() * (context.canvas.width - 10)) / 2) + 5;
		};

		// generate random color in hex notation
		var randomColor = function() {

			// convert a byte (0...255) to a 2-digit hex string
			var toHex2 = function(byte) {
				var s = byte.toString(16); // convert to hex string
				if (s.length == 1)
					s = "0" + s; // pad with leading 0
				return s;
			};

			var r = Math.floor(Math.random() * 25.9) * 10;
			var g = Math.floor(Math.random() * 25.9) * 10;
			var b = Math.floor(Math.random() * 25.9) * 10;

			// convert to hex notation
			return "#" + toHex2(r) + toHex2(g) + toHex2(b);
		};

		/**
		 * event handler for new line-button.
		 */
		$("#btnNewLine").click((function() {

			// create the actual line and add it to the scene
			var style = {
				width : Math.floor(Math.random() * 3) + 1,
				color : randomColor()
			};

			var line = new StraightLine([ randomX(), randomY() ], [ randomX(), randomY() ], style);
			scene.addObjects([ line ]);

			$("#lineWidth").attr("value", line.getLineWidth());

			// deselect all objects, then select the newly created object
			sceneController.deselect();
			sceneController.select(line); // this will also redraw
		}));

		/**
		 * event handler for new circle-button.
		 */
		$("#btnNewCircle").click((function() {
			// create the actual line and add it to the scene
			var style = {
				width : Math.floor(Math.random() * 20) + 1,
				color : randomColor()
			};
			var circle = new Circle([ randomX(), randomY() ], randomRadius(), style);
			scene.addObjects([ circle ]);

			// set current radius into the input field
			$("#radiusInput").attr("value", circle.getRadius());
			console.log("The radius of the current circle is: " + $("#radiusInput").attr("value") + ".");

			// deselect all objects, then select the newly created object
			sceneController.deselect();
			sceneController.select(circle); // this will also redraw
		}));

		/**
		 * event handler for color-Change.
		 */
		$("#colorInput").change((function() {
			console.log("color should change");
			var obj = sceneController.getSelectedObject();
			if (obj instanceof Circle || obj instanceof StraightLine|| obj instanceof ParametricCurve || obj instanceof BezierCurve) {
				console.log("Farbe ist " + $("#colorInput").attr("value"));
				obj.setLineColor($("#colorInput").attr("value"));
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			}
		}));

		/**
		 * event handler for line width-Change.
		 */
		$("#lineWidth").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof Circle || obj instanceof StraightLine || obj instanceof ParametricCurve || obj instanceof BezierCurve) {
				obj.setLineWidth($("#lineWidth").attr("value"));
				sceneController.deselect();
				sceneController.select(obj); // this will also redraw
			}
		}));

		/**
		 * event handler for Radius-Change.
		 */
		$("#radiusInput").change((function() {
			console.log("radius should change");

			var obj = sceneController.getSelectedObject();
			if (obj instanceof Circle) {
				// PARSEINT! Sonst werden die Werte von Circle.center[] und Circle.radius einfach aneinandergereiht. Also statt 2+2= 4 dann 2+"2" = 22
				obj.setNewRadius(parseInt($("#radiusInput").attr("value")));
				sceneController.deselect();
				sceneController.select(obj); // this will
				// also redraw
			}
		}));

		/**
		 * event handler for Clear-Button.
		 */
		$("#btnClear").click((function() {
			console.log("radius should change");

			scene.clear();
			sceneController.deselect();
			
		}));
		
		/**
		 * event handler for New Curve-Button.
		 */
		$("#btnNewCurve").click((function() {
			console.log("new Parametric curve");

			var style = {
				width : Math.floor(Math.random() * 20) + 1,
				color : randomColor()
			};
			
			var xInput = function(t){
				return eval($("#xInput").attr("value"));
			};
			var yInput = function(t){
				return eval($("#yInput").attr("value"));
			};
			
			
			var minT = parseFloat($("#minTInput").attr("value"));
			var maxT = parseFloat($("#maxTInput").attr("value"));
			var segments = parseInt($("#segmentsInput").attr("value"));
			
			if (maxT <= minT){
				var temp = minT;
				minT = maxT;
				maxT = temp;
				$("#minTInput").attr("value", minT);
				$("#maxTInput").attr("value", maxT);
			}	
			var tickmarks = false;

			// if the checkbox is checked, the attribute checked will be "checked" else the attribute will be undefined
			if ($("#tickMarkBox").attr("checked") === "checked") {				
				tickmarks = true;
			}
			var pc = new ParametricCurve(xInput, yInput, minT, maxT, segments, tickmarks, style);
			scene.addObjects([ pc ]);
			sceneController.deselect();
			sceneController.select(pc);
		}));
		
		$("#tickMarkBox").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve || obj instanceof BezierCurve) {
				// PARSEINT! Sonst werden die Werte von Circle.center[] und Circle.radius einfach aneinandergereiht. Also statt 2+2= 4 dann 2+"2" = 22
				if ($("#tickMarkBox").attr("checked") == "checked"){
					obj.setTickmarks(true);
				}else{
					obj.setTickmarks(false);
				}
				sceneController.deselect();
				sceneController.select(obj); // this will
				// also redraw
			}
		}));
		
		
		$("#xInput").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve){
				obj.setXInput($("#xInput").val());
				sceneController.deselect();
				sceneController.select(obj);
			}
		}));

		$("#yInput").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve){
				obj.setYInput($("#YInput").val());
				sceneController.deselect();
				sceneController.select(obj);
			}
		}));
		
		$("#minTInput").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve){
				obj.minT = ($("#minTInput").val());
				sceneController.deselect();
				sceneController.select(obj);
			}
		}));
		
		$("#maxTInput").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve){
				obj.maxT = ($("#maxTInput").val());
				sceneController.deselect();
				sceneController.select(obj);
			}
		}));

		$("#segmentsInput").change((function() {
			var obj = sceneController.getSelectedObject();
			if (obj instanceof ParametricCurve || obj instanceof BezierCurve){
				// TODO tickmarks anpassen!
			}
		}));
		
		$("#btnNewBezier").click((function() {
			console.log("new Bezier curve");
			
			var segments = parseInt($("#segmentsInput").attr("value"));

			var tickmarks = false;			
			// if the checkbox is checked, the attribute checked will be "checked" else the attribute will be undefined
			if ($("#tickMarkBox").attr("checked") == "checked") {				
				tickmarks = true;			
			}
			
			var p0 = [parseInt($("#p0x").val()), parseInt($("#p0y").val())];
			var p1 = [parseInt($("#p1x").val()), parseInt($("#p1y").val())];
			var p2 = [parseInt($("#p2x").val()), parseInt($("#p2y").val())];
			var p3 = [parseInt($("#p3x").val()), parseInt($("#p3y").val())];
			
			var style = {
					width : Math.floor(Math.random() * 20) + 1,
					color : randomColor()
			};
			
//			var bc = new BezierCurve(minT, maxT, randomPoint, randomPoint, randomPoint, randomPoint, segments, tickmarks, style);
			var bc = new BezierCurve(p0, p1, p2, p3, segments, tickmarks, style);

			console.log("Bezier curve: " + bc);
			scene.addObjects([ bc ]);
			sceneController.deselect();
			sceneController.select(bc);
		}));
		
		$("#btnNewCasteljau").click((function() {
			console.log("new Casteljau curve");
			
			var segments = parseInt($("#segmentsInput").attr("value"));

			var tickmarks = false;			
			// if the checkbox is checked, the attribute checked will be "checked" else the attribute will be undefined
			if ($("#tickMarkBox").attr("checked") == "checked") {				
				tickmarks = true;			
			}
			
			var showControlPolygons = false;
			if ($("#showControlPolygons").attr("checked") == "checked") {				
				showControlPolygons = true;			
			}
			
			var p0 = [parseInt($("#p0x").val()), parseInt($("#p0y").val())];
			var p1 = [parseInt($("#p1x").val()), parseInt($("#p1y").val())];
			var p2 = [parseInt($("#p2x").val()), parseInt($("#p2y").val())];
			var p3 = [parseInt($("#p3x").val()), parseInt($("#p3y").val())];
			
			var style = {
					width : Math.floor(Math.random() * 20) + 1,
					color : randomColor()
			};
			
			var t = 2/3;
			var cc = new CasteljauCurve(p0, p1, p2, p3, t, showControlPolygons, style);

			console.log("Casteljau curve: " + cc);
			scene.addObjects([ cc ]);
			sceneController.deselect();
			sceneController.select(cc);
		}));
	};

	// return the constructor function
	return HtmlController;

}));
