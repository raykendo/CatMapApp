// external object: Modernizr

require([
	"esri/arcgis/utils",
	"esri/geometry/Extent",
	"esri/geometry/Point"
], function (
	arcgisUtils, Extent, Point
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
	
	// load the kitteh data
	function getTheKittehs(map) {
		var worldExtent = new Extent({
			"xmin":-20037508.342788905,
			"ymin":-103676511.13576749,
			"xmax":20037508.342788905,
			"ymax":103676511.13576749,
			"spatialReference":{"wkid":102100}
		});
		
		
	};
	
	deferred.then(function (response) {
		var map = response.map;
		
		// add random kitteh data
		
		
		// add map events that make call the catCall function
		map.on("update-end", catCall);
	});
});