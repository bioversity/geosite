var map = {
    mapCanvas: null,
    geocoder: null,
    addCountryMarker: function(country, numMissions) {
        /*
        map.geocoder.geocode( { 'address': country}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            //map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
        */
    },
    init: function() {
        var myOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map.geocoder = geocoder = new google.maps.Geocoder();
        map.mapCanvas = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        // get all countries
        $.getJSON(query.couch + query.ddoc + '/_view/byCountry?group=true', function(data) {
            var countries = {}
            for(var i in data.rows) {
                var row = data.rows[i]
                countries[row.key[0]] = countries[row.key[0]] ? ++countries[row.key[0]] : 1
            }

            for(var c in countries) {
                map.addCountryMarker(c, countries[c])
            }
        })
    }
}
