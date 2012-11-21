var map = {
    mapObject: null,
    layer: null,
    key: 'AIzaSyAgymWVxqul11-hNQpNvgjL1ZzQsq-d8WI',
    fusionTableId: '13k5H9qSRevZesV7OMStdmJRdVyjpuQemnFT6XWo',
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
            map: map.mapObject,
            suppressInfoWindows: true
            
        })
        var infoWindow = new google.maps.InfoWindow()


        // this runs whenever we click on a red dot
        google.maps.event.addListener(map.layer, 'click', function(e) {
            var row = e.row
            infoWindow.setOptions({
                content: e.infoWindowHtml,
                position: e.latLng,
                pixelOffset: e.pixelOffset
            })
            infoWindow.open(map.mapObject)

            console.log(row)
            var instcode = row.INSTCODE.value.split(';')

            for(var i in instcode) {
                query.getInstitutes(instcode, function(data) {
                    var content = e.infoWindowHtml
                    content += '<h3>Institutes</h3>'
                    if(data.rows) {
                        for(var i in data.rows[0]) {
                            content += '<b>' + data.columns[i] + ':</b> ' + data.rows[0][i] + '<br>'
                        }
                    }
                    if(data.rows) {
                        infoWindow.setOptions({
                            content: content
                        })
                    }
                })
            }
        })
    }
}
