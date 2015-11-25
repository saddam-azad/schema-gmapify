;(function ( $, window, document, undefined ) {
	"use strict";

	$.gmapify = function(element, options) {

		var defaults = {
			canvas: "",
			datasource: "",
			dataitems: "li",
			zoom: 14,
			scrollwheel: false
		};

		var plugin = this;
	    plugin.settings = {};
	    plugin.data = {};

	    // to reference to the actual DOM element, use: element
	    // to reference to the jQuery version of DOM element, use: $element
	    var $element = $(element);

		plugin.init = function() {
		    plugin.settings = $.extend({}, defaults, options);

			// Get the place markup, and define the places and infoWindowContent
			var metalist = $(this.settings.datasource).find(this.settings.dataitems);
			var places = [];
			var infoWindowContent = [];
			
			$(metalist).each(function() {
				var place_name = $(this).find("a span.name").html();
				var place_latitude = $(this).find('.location span[property="latitude"]').attr('content');
				var place_longitude = $(this).find('.location span[property="longitude"]').attr('content');

				var place_streetAddress = $(this).find('a span[itemprop="streetAddress"]').html();
				var place_description = $(this).find('a span[itemprop="description"]').html();
				if (typeof place_description === "undefined") { place_description = ""; }

				infoWindowContent.push(['<div class="info_content">' +
					"<h3>" + place_name + "</h3>" +
					"<h4>" + place_streetAddress + "</h4>" +
					"<p>" + place_description + "</p>" +
					"</div>"]);

				places.push([place_name, place_latitude, place_longitude]);
			});

			// Define the bounds of the map
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < places.length; i++) {
				bounds.extend( new google.maps.LatLng(places[i][1], places[i][2]) );
				
			}

			// Create the map
			var mapOptions = {
				// center: new google.maps.LatLng(bounds.getCenter().G, bounds.getCenter().K),
				center: bounds.getCenter(),
				zoom: plugin.settings.zoom,
				scrollwheel: plugin.settings.scrollwheel,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		    };

			var map = new google.maps.Map($(plugin.settings.canvas)[0], mapOptions);
			map.setTilt(45);
			map.fitBounds(bounds);
			
			// Display multiple places on a map
			var infoWindow = new google.maps.InfoWindow(), marker, clickity;

			google.maps.event.addListener(map, "click", function() {
				infoWindow.close();
			});


			// Loop through our array of markers & place each one on the map 
			// Define the markers using google.maps.Marker
			for (i = 0; i < places.length; i++) {
			// $.each(places, function(i) {
				var place = places[i];
				var content = infoWindowContent[i][0];
				var latitude = parseFloat(place[1]);
				var longitude = parseFloat(place[2]);
				var latlong = new google.maps.LatLng(latitude, longitude);

				// Creates a marker
				marker = new google.maps.Marker({
					position: latlong,
					map: map,
					content: content
				});

				// Assigns a click function to each marker
				marker.addListener("click", function() {
					infoWindow.setContent(this.content);
					infoWindow.open(map, this);
					// map.setCenter(this.getPosition());
				});

			}
			
			
			// When the places in the sidebar are clicked, highlight marker.
			$(metalist).find("a").on("click", function() {
				$(metalist).each(function() {
					$(this).find("a").removeClass("active");
				});
				$(this).addClass("active");

				i = $(this).parent().index();
				var place = places[i];
				var content = infoWindowContent[i][0];
				var latitude = parseFloat(place[1]);
				var longitude = parseFloat(place[2]);
				var latlong = new google.maps.LatLng(latitude, longitude);

				marker = new google.maps.Marker({
					map: map,
					content: content,
					position: latlong
				});

				google.maps.event.addListener(marker, "click", function() {
					infoWindow.setContent(this.content);
					infoWindow.open(map, this);
					// map.setCenter(marker.getPosition());
				});

				google.maps.event.trigger(marker, "click");
			});

			
			
		    google.maps.event.addListenerOnce(map, "idle", function(){
		        i = 0;
				var place = places[i];
				var content = infoWindowContent[i][0];
				var latitude = parseFloat(place[1]);
				var longitude = parseFloat(place[2]);
				var latlong = new google.maps.LatLng(latitude, longitude);

				marker = new google.maps.Marker({
					map: map,
					content: content,
					position: latlong
				});

				google.maps.event.addListener(marker, "click", function() {
					infoWindow.setContent(content);
					infoWindow.open(map, this);
				});

				google.maps.event.trigger(marker, "click");
		    });
		    
		    /**
		    // Center the map when the window is resized
		    var center = map.getCenter();
		    google.maps.event.addDomListener(window, 'resize', function() {
				map.setCenter(center);
		    });
		    /**/

		    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
		    var boundsListener = google.maps.event.addListener((map), "bounds_changed", function(event) {
		        this.setZoom(plugin.settings.zoom);
		        google.maps.event.removeListener(boundsListener);
		    });
		    /**/
			
		}; // end plugin.init

		// initialize
		if ( $(options.canvas).length > 0 ) {			
			plugin.init();
		}
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