var map = {
    init: function() {
        var myOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);

        // get all countries
        $.getJSON(query.couch + query.ddoc + '/_view/byCountry?group=true', function(data) {
            console.log(data)

        })
    }
}
