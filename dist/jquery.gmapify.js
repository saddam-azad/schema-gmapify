/*
 *  jquery-gmapify - v
 *  Integrate Google Maps with multiple pointers with data provided in markup.
 *  http://www.saddamazad.com
 *
 *  Made by Saddam Azad
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

	$.gmapify = function(element, options) {

		var defaults = {
			meta: "#map-meta",
			metalist: "li",
			zoom: 12,
			scrollwheel: false
		};

		var plugin = this;
	    plugin.settings = {};

	    // to reference to the actual DOM element, use: element
	    // to reference to the jQuery version of DOM element, use: $element
	    var $element = $(element);

		plugin.init = function() {
		    plugin.settings = $.extend({}, defaults, options);

			
			// Get the location markup, and define the markers and infoWindowContent
			var locations = $(this.settings.meta).find(this.settings.metalist);
			var markers = [];
			var infoWindowContent = [];

			$(locations).each(function() {
				var marker_name = $(this).find("a span.name").html();
				var marker_latitude = $(this).find('.location span[property="latitude"]').attr('content');
				var marker_longitude = $(this).find('.location span[property="longitude"]').attr('content');

				var marker_streetAddress = $(this).find('a span[itemprop="streetAddress"]').html();
				var marker_description = $(this).find('a span[itemprop="description"]').html();
				if (typeof marker_description === "undefined") { marker_description = ""; }

				infoWindowContent.push(['<div class="info_content">' +
					"<h3>" + marker_name + "</h3>" +
					"<h4>" + marker_streetAddress + "</h4>" +
					"<p>" + marker_description + "</p>" +
					"</div>"]);

				markers.push([marker_name, marker_latitude, marker_longitude]);
			});

			console.log(markers[0][1]);

			// Create the map
			var bounds = new google.maps.LatLngBounds();
			var mapOptions = {
		      // center: new google.maps.LatLng(44.5403, -78.5463),
		      center: new google.maps.LatLng(markers[0][1], markers[0][2]),
		      zoom: 12,
		      scrollwheel: false,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

			var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
			map.setTilt(45);

			// Display multiple markers on a map
			var infoWindow = new google.maps.InfoWindow(), marker, i;

			google.maps.event.addListener(map, "click", function() {
				infoWindow.close();
			});

			// Loop through our array of markers & place each one on the map 
			// Define the markers using google.maps.Marker
			for (var j = 0; j < markers.length; j++) {
				marker = markers[j];

				var content = infoWindowContent[j][0];
				var latitude = parseFloat(marker[1]);
				var longitude = parseFloat(marker[2]);

				var gmarker = new google.maps.Marker({
					position: new google.maps.LatLng(latitude, longitude),
					map: map,
					content: content
				});

				google.maps.event.addListener(gmarker, "click", function() {
		            infoWindow.setContent(content);
		            infoWindow.open(map, gmarker);
		        });
			}

			// When the locations in the sidebar are clicked, highlight marker.
			$(locations).find("a").on("click", function() {
				// console.log("click");
				i = $(this).parent().index();
				displayMarker(i, markers, infoWindowContent);
			});


		    google.maps.event.addListenerOnce(map, "idle", function(){
		        // do something only the first time the map is loaded
		        displayMarker(0, markers, infoWindowContent);
		    });

		    // Center the map when the window is resized
		    var center = map.getCenter();
		    google.maps.event.addDomListener(window, 'resize', function() {
				map.setCenter(center);
		    });

		    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
		    var boundsListener = google.maps.event.addListener((map), "bounds_changed", function(event) {
		        this.setZoom(12);
		        google.maps.event.removeListener(boundsListener);
		    });
		    /**/
			
		}; // end plugin.init

		
		var displayMarker = function(i, markers, infoWindowContent) {
				
			var marker = markers[i];
			var content = infoWindowContent[i][0];
			var latitude = marker[1];
			var longitude = marker[2];
			var latlong = new google.maps.LatLng(latitude, longitude);

			var kmarker = new google.maps.Marker({
				map: map,
				content: content,
				position: latlong
			});

			google.maps.event.addListener(kmarker, "click", function() {
				infoWindow.setContent(content);
				infoWindow.open(map, kmarker);
			});

			google.maps.event.trigger(marker, "click");

		}; // end displayMarker
		/**/


		// initialize
		plugin.init();
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
    $.fn.gmapify = function(options) {
        return this.each(function() {
            if (undefined === $(this).data('gmapify')) {
                var plugin = new $.gmapify(this, options);
                $(this).data('gmapify', plugin);
            }
        });
    };

})(jQuery);