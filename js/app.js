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
			"objectIdField": "ObjectID",
			"fields": [{
				"name": "ObjectID",
				"alias": "ObjectID",
				"type": "esriFieldTypeOID"
			}, {
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
			id: 'kittehlayer',
			infoTemplate: popupTemplate
		});
		
		// set the renderer
		var renderer = new Renderer({
			"type": "simple",
			"label": "Kitty!",
			"description": "Here be a kitteh",
			"symbol": {
				"type" : "esriSMS", 
				"style": "esriSMSCircle",
				"color": [255,255,0, 255],
				"size": 12,
				"angle" : 0, 
				"xoffset" : 0, 
				"yoffset" : 0,
				"outline" : {
					"color": [0,255,0, 255],
					"width": 1
				}
			}
		});
		
		featureLayer.setRenderer(renderer);

		return featureLayer;
	}
	
	function randomPoint (extent) {
		var x = (Math.random() * (extent.xmax - extent.xmin)) + extent.xmin;
		var y = (Math.random() * (extent.ymax - extent.ymin)) + extent.ymin;
		console.log("random points: ", x, y);
		
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
			"IMG_URL": randomImage()
		};
		
		console.log("kitty data", attributes);
		return new Graphic(geometry, attributes);
	}
	
	deferred.then(function (response) {
		try {
		
		var map = response.map;
		console.log("map loaded");
		// add random kitteh data
		var featureLayer = getTheKittehLayer();
		
		//associate the features with the popup on click
        featureLayer.on("click", function(evt) {
          map.infoWindow.setFeatures([evt.graphic]);
        });
		
		map.on('layers-add-result', function () {
			// add a new kitteh every second.
			console.log("layers added2");
			var addKittehs = window.setInterval(function () {
				try {
					var kitteh = generateTheKittehs(map),
						oldkittehs = [];
					if (featureLayer.featureSet && featureLayer.featureSet.features && featureLayer.featureSet.features.length > 998) {
						oldkittehs = featureLayer.featureSet.features.slice(999);
					}
					featureLayer.applyEdits([kitteh], null, oldkittehs.length ? [oldkittehs] : null);
					featureLayer.refresh();
					catCall();
					console.log("cat added");
				} catch(e) {
					console.log(e);
					console.log(featureLayer);
					window.clearInterval(addKittehs);
				}
				
			}, 2000);
		
		});
		
		map.addLayers([featureLayer]);
		console.log("layer added 1");
		
		} catch(e) {
			console.log(e);
		}
		
	});
});