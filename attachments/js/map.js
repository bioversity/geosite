var map = {
    mapObject: null,
    geocoder: null,
    addCountryMarker: function(country, obj) {
        var latLng = new google.maps.LatLng(obj.lat, obj.lng)
        var size = obj.numMissions
        var text = obj.numMissions + ' missions!'

        new CircleOverlay(latLng, size, text, map.mapObject)
        /*
        var circle = new google.maps.Circle({
            map: map.mapObject,
            center: latLng,
            fillColor: '#5e99cd',
            fillOpacity: 1,
            strokeColor: '#e3e3e3',
            strokeWeight: 3,
            radius: (obj.numMissions * 10000)
         });
        */

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
          center: new google.maps.LatLng(0, 0),
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_TOP
          },
          panControl: false
        };
        map.geocoder = geocoder = new google.maps.Geocoder();
        map.mapObject = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        // get all countries
        $.getJSON(query.couch + query.ddoc + '/_view/byCountry?group=true', function(data) {
            var countries = {}
            for(var i in data.rows) {
                var row = data.rows[i]
                if(!countries[row.key[0]]) {
                    countries[row.key[0]] = {}
                }
                var obj = countries[row.key[0]]
                obj.numMissions = obj.numMissions ? ++obj.numMissions : 1
                obj.samples = obj.samples ? obj.samples + row.value.samples : row.value.samples
                obj.lat = row.value.lat || (obj.lat || 0)
                obj.lng = row.value.lng || (obj.lng || 0)
            }

            for(var c in countries) {
                map.addCountryMarker(c, countries[c])
            }
        })
    }
}

CircleOverlay = function(latLng, size, text, mapObject) {
    this.latLng_ = latLng
    this.setMap(mapObject)
}

CircleOverlay.prototype = new google.maps.OverlayView()

CircleOverlay.prototype.onAdd = function() {
    this.div_ = $('<div class="circle"><div class="outer-circle"></div><div class="middle-circle"></div><div class="inner-circle">Text In Circle</div></div>')    
    this.div_.css('position', 'absolute')
    var panes = this.getPanes()
    panes.overlayLayer.appendChild(this.div_.get(0))
}

CircleOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection()
    var pos = overlayProjection.fromLatLngToDivPixel(this.latLng_);

    var $div = this.div_
    $div.css('left', pos.x + 'px')
    $div.css('top', pos.y + 'px')
}
