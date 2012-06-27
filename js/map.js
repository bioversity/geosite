var map = {
    mapObject: null,
    layer: null,
    fusionTableId: '1BkkVW7dnbu2x87E_8vN9AZt8AGyytl5iTAyc8vk',
    init: function(country) {
        var myOptions = {
            center: new google.maps.LatLng(22.105998799750566, -58.0078125),
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.RIGHT_TOP
            },
            panControl: false
        };
        map.mapObject = new google.maps.Map(document.getElementById("map_canvas"), myOptions)

        map.layer = new google.maps.FusionTablesLayer({
            query: {
                select: '',
                from: map.fusionTableId
            },
            map: map.mapObject
        })
    }
}
