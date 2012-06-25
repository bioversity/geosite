var map = {
    mapObject: null,
    mc: null, // marker cluster
    geocoder: null,
    dragend: false, // callback called when a drag is performed on the map
    currWindow: false,
    circleOverlays: [],
    addCountryMarker: function(country, obj) {
        var latLng = new google.maps.LatLng(obj.lat, obj.lng)
        var size = obj.numMissions
        var text = obj.numMissions

        new CircleOverlay(latLng, size, text, map.mapObject)
    },
    init: function(country) {
        var myOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: 4,
          mapTypeId: google.maps.MapTypeId.TERRAIN,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_TOP
          },
          panControl: false
        };
        map.geocoder = new google.maps.Geocoder();
        map.mapObject = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        google.maps.event.addListener(map.mapObject, 'click', function(event) {
            map.geocoder.geocode( { 'location': event.latLng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var country = results[results.length - 1].formatted_address
                    window.location.hash = '/' + country
                } else {
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            })
        })

    },
    getMissions: function(country, cb) {
        // call couch and get all samples for this country
        country = country.toLowerCase()
        $.getJSON(query.couch + query.ddoc + '/_view/byCountry?startkey=["'+country+'"]&endkey=["'+country+'",{}]&group=true', function(data) {
            cb(data) 
        })
    },
    showMissions: function(data) {
        for(var x in map.circleOverlays) {
            var c = map.circleOverlays[x]
            c.setMap(null)
        }
        map.circleOverlays = []
        if(map.currWindow) map.currWindow.close()
        var bounds = new google.maps.LatLngBounds()
        for(var i in data.rows) {
            var value = data.rows[i].value
            var key = data.rows[i].key
            var subMissionId = key[1]
            if(!value.lat && !value.lng) { // lat and lng are 0 for this mission - show it in the country anyway
                continue;
            }
            var latLng = new google.maps.LatLng(value.lat, value.lng)

            bounds.extend(latLng)

            var circle = new CircleOverlay(latLng, value.samples, value.samples, map.mapObject)
            map.circleOverlays.push(circle)

            map.bindMouse('<h2>'+subMissionId.toUpperCase() + '</h2><p><b>'+value.samples+'</b> samples recorded under this mission</p><p><i>Click to see the samples</i></p>', circle)

        }
        map.mapObject.fitBounds(bounds)
    },
    getRandomCountry: function(cb) {
        $.getJSON(query.couch + query.ddoc + '/_view/byCountry?group_level=1', function(data) {
            var countries = []
            for(var i in data.rows) {
                countries.push(data.rows[i].key[0]) 
            }
            countries.sort(function() {return 0.5 - Math.random()})
            var randomCountry = countries[0]
            cb(randomCountry)
        })
    },
    bindMouse: function(content, circleOverlay) {
        google.maps.event.addListener(circleOverlay, 'mouseover', function() {
            if(map.currWindow && map.currWindow.getContent() == content) {
                return;
            }
            if(map.currWindow && map.currWindow.getContent() != content) {
                map.currWindow.close()
            }

            var infowindow = new google.maps.InfoWindow({
                content: content
            })
            infowindow.setPosition(circleOverlay.latLng_)
            infowindow.open(map.mapObject)

            map.currWindow = infowindow
        })
    },
    showMarkers: function(url, cb) {
        $.getJSON(url, function(data) {
            var countries = {}
            var markers = []
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
        })
    }
}

CircleOverlay = function(latLng, size, text, mapObject) {
    this.latLng_ = latLng
    this.size_ = size
    this.text_ = text
    this.setMap(mapObject)
    this.circleSize_ = 40
}

CircleOverlay.prototype = new google.maps.OverlayView()

CircleOverlay.prototype.setSizeCircle_ = function() {
    var size = this.circleSize_

    var $circle = this.circle_.circle
    var $outer = this.circle_.outer
    var $middle = this.circle_.middle
    var $inner = this.circle_.inner


    $circle.css('width', size + 'px')    
    $circle.css('height', size + 'px')    

    if(this.size_ <= 10) {
        $inner.css('background-color', '#5BB75B')    
    } else if(this.size_ <= 100) {
        $inner.css('background-color', '#0074CC')    
    }

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

    this.setSizeCircle_()

    var panes = this.getPanes()

    var domCircle = this.circle_.circle.get(0)
    panes.overlayMouseTarget.appendChild(domCircle)

    var me = this
    google.maps.event.addDomListener(domCircle, 'click', function() {
        google.maps.event.trigger(me, 'click');
    });
    google.maps.event.addDomListener(domCircle, 'mouseover', function() {
        google.maps.event.trigger(me, 'mouseover');
    });
    google.maps.event.addDomListener(domCircle, 'mouseout', function() {
        google.maps.event.trigger(me, 'mouseout');
    });

}

CircleOverlay.prototype.draw = function() {
    var overlayProjection = this.getProjection()
    var pos = overlayProjection.fromLatLngToDivPixel(this.latLng_);
    //var width = Math.round(overlayProjection.getWorldWidth() / 1000)

    width = this.circleSize_ / 2

    var $circle = this.circle_.circle
    $circle.css('left', (pos.x - width) + 'px')
    $circle.css('top', (pos.y - width) + 'px')
}
CircleOverlay.prototype.onRemove = function() {
    $(this.circle_.circle).remove()
    this.circle_ = null
}
