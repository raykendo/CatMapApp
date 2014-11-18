// external object: Modernizr

require([
	"esri/arcgis/utils",
	"esri/layers/FeatureLayer",
	"esri/renderers/SimpleRenderer",
	"esri/tasks/FeatureSet",
	"esri/dijit/PopupTemplate",
	"esri/geometry/Extent",
	"esri/geometry/Point",
	"esri/graphic"
], function (
	arcgisUtils, FeatureLayer, Renderer, FeatureSet, PopupTemplate, Extent, Point, Graphic
) {
	var audioSources = [
		"./audio/64007__department64__kitten12",
		"./audio/85238__cognito-perceptu__cat-pleads",
		"./audio/95517__templeofhades__cat-purrrr",
		"./audio/110011__tuberatanka__cat-meow",
		"./audio/118522__unclesigmund__meow",
		"./audio/118959__esperri__cat-purring",
		"./audio/138044__daboy291__cat-meow-once",
		"./audio/156643__yoyodaman234__catmeow1",
		"./audio/220019__chocktaw__fiji-meow-01",
		"./audio/222590__queen-westeros__cat-scream"
	],
		index = 0;
	
	var deferred = arcgisUtils.createMap("c256d4a2110847aebc43ab5b9534cd87", "map", {});
	
	function catCall () {
		var fileName = audioSources[index++ % audioSources.length];
		
		var audio = new Audio();
		audio.src = Modernizr.audio.ogg ? fileName + '.ogg' :
					Modernizr.audio.mp3 ? fileName + '.mp3' :
										  fileName + '.m4a';
		audio.play();
	}
	
	// @returns {esri.layer.FeatureLayer} Feature layer to show on the map.
	function getTheKittehLayer() {
		var layerDefinition = {
			"geometryType": "esriGeometryPoint",
			"fields": [{
				"name": "NAME",
				"type": "esriFieldTypeString",
				"alias": "Name"
			}, {
				"name": "IMG_URL",
				"type": "esriFieldTypeString",
				"alias": "Image URL"
			}]
		},
		featureCollection = {
			"layerDefinition": layerDefinition,
			"featureSet": {
				"features": [],
				"geometryType": "esriGeometryPoint"
			}
		},
		popupTemplate = new PopupTemplate({
			"title": "${NAME}",
			"content": "<img src='${IMG_URL}' title='${NAME} photo' alt='${NAME} photo' />"
		});
		
		var featureLayer = new FeatureLayer(featureCollection, {
			mode: FeatureLayer.MODE_SNAPSHOT,
			infoTemplate: popupTemplate
		});
		
		// set the renderer
		var renderer = new Renderer({
			"type": "simple",
			"label": "A Kitteh",
			"description": "Here be a kitteh",
			"symbol": {
				"type" : "esriPMS", 
				"url" : "471E7E31", 
				"imageData" : "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH3gsSDwcUN+d8fQAAAkZJREFUSMedljtoFVEQhr+7yb3GR6MJBEmjUXwgxNhYWEUEtdDCQhQsrFJoYyMIIliJKCFgkSIGRK2Mj0bB1tIm+MAHPtBCiFgoAbkxyc3NXZt/ZDI5u2oGhrM755x5/TOzC2nKgHZgl9Yy2gRsoERRiqrAFmAQaBYYaXM6zgRZqYEMmAP6gaPAIRmphjMLwEXgLtDBf9IeIAdmtF6XvOIifK29htaekowsoVdO+S+tB9z+ecmaiiQH7hdlJQpWAZPAvC4aj2l/BfAy7DWATwl9WaawPYgNoJWIqhuoKT2bnTwXuN8Tdzoy4Biw0gmbwGfnndG0y3fdyRfk9S29e+cGAYaBO8AQ0KuNrU7RtJ5POqBvSzanddKlphe4BIyY0Ss6NC/eq4P7BHALGA1VtB54p4g+qIIA9uu8RX8Z4KdebOM5sDo0XRF1aa0J/CnpsMr6CjAbKiIXiLVg4ATwUI113EVkqTnoSjd3qeORE1gU26XYWn8s7OfAzeDA6eD9nwbtC97XVZJWuudCV/vns87IjqBnFthmuRwAngDPgMMux7tdAeQJBbkcNDolDO8BO1Md3eZAWwN8SSiOPKGzmZuoyZnU7vLZBbxJ5L2IH8sIAbskrQPeJwArYquap3+boNZE1/5BaWRzZKjMQBVYC3xbhgHjt0Cnc3YRGBV1YzfLpx7X3UsMWDnWCy4b4K0wZT1NxftZGNM/gBslGM1oglYKzjzQeMgjsIs+EsAF4IgwmdD394X6ogps1E9Bn5rxIzAOXI3KfgP4hegXhlTmqgAAAABJRU5ErkJggg==", 
				"contentType" : "image/png", 
				"width" : 24, 
				"height" : 24, 
				"angle" : 0, 
				"xoffset" : 0, 
				"yoffset" : 0
			}
		});
		
		featureLayer.setRenderer(renderer);

		return featureLayer;
	}
	
	function randomPoint (extent) {
		var x = (Math.random() * (extent.xmax - extent.xmin)) + extent.xmin;
		var y = (Math.random() * (extent.ymax - extent.ymin)) + extent.ymin;
		return new Point(x, y, extent.spatialReference);
	}
	
	// names taken from http://www.petinsurance.com/healthzone/pet-articles/new-pets/top-50-wackiest-pet-names.aspx
	function randomName () {
		var list = [
			"Count Flufferton", 
			"Katy Purry",
			"Walter Croncat",
			"Tiger Ferocious",
			"Felix Thunder Paws",
			"Senor Meow",
			"Purrscilla",
			"Shakespurr",
			"Tru-Purr",
			"Fuzzy Wuzzy",
			"General Ginger Beefy",
			"Jazz Purr",
			"Mila Meowsavitch",
			"Mr. Sparkle Pants",
			"Mr. Purrkins",
			"Tybalt King Of Cats",
			"Valentino Wonder Cat",
			"Whiskerus Maximus"
		];
		return list[Math.floor(Math.random() * list.length)];
	}
	
	function randomImage () {
		return [
			"http://placekitten.com/g", 
			Math.ceil(Math.random() * 100) + 200,
			Math.ceil(Math.random() * 100) + 200
		].join("/");
	}
	
	// @param {esri.Map} map
	// @returns {esri.Graphic} a randomized cat graphic
	function generateTheKittehs(map) {
		var geometry = randomPoint(map.extent);
		
		var attributes = {
			"NAME": randomName(),
			"IMG_URL": randomImage
		};
		return new Graphic(geometry, attributes);
	}
	
	
	
	deferred.then(function (response) {
		var map = response.map;
		
		// add random kitteh data
		var layer = getTheKittehLayer();
		map.addLayer(layer);
		
		// add a new kitteh every second.
		window.setInterval(function () {
			try {
				var kitteh = generateTheKittehs(map);
				var oldKitteh = layer.featureSet.features.slice(1000);
				layer.applyEdits([kitteh], null, oldKitteh);
			} catch(e) {
				console.log(e);
			}
			
		}, 1000);
		
		
		
	});
});