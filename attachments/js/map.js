var map = {
    mapObject: null,
    geocoder: null,
    addCountryMarker: function(country, obj) {
        var latLng = new google.maps.LatLng(obj.lat, obj.lng)
        var size = obj.numMissions
        var text = obj.numMissions

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
    this.size_ = size
    this.text_ = text
    this.setMap(mapObject)
}

CircleOverlay.prototype = new google.maps.OverlayView()

CircleOverlay.prototype.setSizeCircle_ = function(numMissions, width) {
    // size should be multiple of 20 ALWAYS
    size = Math.round(numMissions/20)
    if(size == 0) size = 1
    size = (size * 20) * width

    var $circle = this.circle_.circle
    var $outer = this.circle_.outer
    var $middle = this.circle_.middle
    var $inner = this.circle_.inner

    $circle.css('width', size + 'px')    
    $circle.css('height', size + 'px')    

    var outer = size
    $outer.css('width', outer + 'px')    
    $outer.css('height', outer + 'px')    

    var half = outer /2
    $outer.css('-webkit-border-radius', half + 'px')
    $outer.css('-moz-border-radius', half + 'px')
    $outer.css('border-radius', half + 'px')

    $middle.css('width', outer + 'px')    
    $middle.css('height', outer + 'px')    

    $middle.css('-webkit-border-radius', half + 'px')
    $middle.css('-moz-border-radius', half + 'px')
    $middle.css('border-radius', half + 'px')

    var perc = Math.round(((outer * 10) / 100))
    var inner = outer - perc
    var margin  = (outer /2) - (inner/2) + 1
    $inner.css('width', inner + 'px')    
    $inner.css('height', inner + 'px')    
    $inner.css('margin', margin + 'px')
    $inner.css('line-height', inner + 'px')

    // font size is 10% of size
    $inner.css('font-size', (perc * 4) + 'px')

    var half = inner/2
    $inner.css('-webkit-border-radius', half + 'px')
    $inner.css('-moz-border-radius', half + 'px')
    $inner.css('border-radius', half + 'px')

    return outer
}
CircleOverlay.prototype.onAdd = function() {
    this.circle_ = {
        circle: $('<div class="circle"></div>'),
        outer: $('<div class="outer-circle"></div>'),
        middle: $('<div class="middle-circle"></div>'),
        inner: $('<div class="inner-circle"></div>')
    }
    this.circle_.inner.text(this.text_)

    this.circle_.circle.append(this.circle_.outer)
    this.circle_.circle.append(this.circle_.middle)
    this.circle_.circle.append(this.circle_.inner)

    this.circle_.circle.css('position', 'absolute')
    var panes = this.getPanes()
    panes.overlayLayer.appendChild(this.circle_.circle.get(0))
}

CircleOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection()
    var pos = overlayProjection.fromLatLngToDivPixel(this.latLng_);
    var width = Math.round(overlayProjection.getWorldWidth() / 1000)

    width = this.setSizeCircle_(this.size_, width) / 2

    var $circle = this.circle_.circle
    $circle.css('left', (pos.x - width) + 'px')
    $circle.css('top', (pos.y - width) + 'px')
}
