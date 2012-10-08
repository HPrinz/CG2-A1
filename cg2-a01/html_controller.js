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



define(["jquery", "straight_line", "circle"], 
       (function($, StraightLine, Circle) {

    "use strict"; 
                
    /**
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context,scene,sceneController) {
		
		/* checks if the selected object is a circle or a line and shows/ 
		 * hides radius button and input field
		*/
		var selectionHandler = function() {
			var obj = sceneController.getSelectedObject();
			
			if(obj instanceof Circle || obj instanceof StraightLine){
				//$("#colorInput").attr("value", obj.getLineColor() );
				//obj.draw(this.context);
				if (obj instanceof Circle){
						$("#radiusSubmit").show();
						$("#radiusInput").show();
						console.log("radius show");
				}else if(obj instanceof StraightLine){
						$("#radiusSubmit").hide();
						$("#radiusInput").hide();
				}
			}
		};
		
		sceneController.onSelection(selectionHandler);
		
		var changeHandler = function() {
			var obj = sceneController.getSelectedObject();
			if(obj instanceof Circle){
				$("#radiusInput").attr("value", Math.floor(obj.getRadius()));
			}
		};
		
		sceneController.onObjChange(changeHandler);

        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };
		
		// generate random Y coordinate within the canvas
        var randomRadius = function() { 
            return Math.floor((Math.random()*(context.canvas.width-10))/2)+5; 
        };
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
        
        /**
         * event handler for "new line button".
         */
        $("#btnNewLine").click( (function() {
			
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw          
        }));
		

		
		/**
         * event handler for "new circle button".
         */
		$("#btnNewCircle").click( (function() {	
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
            var currentRadius = randomRadius(); 
            var circle = new Circle( [randomX(),randomY()],
									 currentRadius,
									 style);
                                        
            scene.addObjects([circle]);
			
			// set current radius into the input field
			var radiusInput = document.getElementById("radiusInput"); 
			radiusInput.setAttribute("value", currentRadius);
			console.log("Der aktuelle Radius betraegt:" + radiusInput.getAttribute("value"));

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw     
        }));
		
		/**
         * event handler for "color submit"-Button.
         */
		$("#colorSubmit").click( (function() {
			console.log("color should change");
			var obj = sceneController.getSelectedObject();
			if(obj instanceof Circle || obj instanceof StraightLine){
				console.log("Farbe ist " + $("#colorInput").attr("value"));
				obj.setLineColor($("#colorInput").attr("value"));
				obj.draw(sceneController.context);
			}
		}));
		
		/**
         * event handler for "line submit"-Button.
         */
		$("#lineSubmit").click( (function() {
			console.log("line should change");
			var obj = sceneController.getSelectedObject();
			if(obj instanceof Circle || obj instanceof StraightLine){
				console.log("Linienbreite ist " + $("#lineWidth").attr("value"));
				obj.setLineWidth($("#lineWidth").attr("value"));
				sceneController.scene.draw(sceneController.context);
			}
		}));
    }

    // return the constructor function 
    return HtmlController;

})); 



            
