var script = document.createElement('script');
var queryInit = false;
if (Boolean(get['ID_MISSION'])){
    queryInit = "f=ID_MISSION&v="+get['ID_MISSION'];
}
if (Boolean(get['ID_SUB_MISSION'])){
    queryInit = "f=ID_SUB_MISSION&v="+get['ID_SUB_MISSION'];
}
if (Boolean(get['NEW_ID_SAMPLE'])){
    queryInit = "f=NEW_ID_SAMPLE&v="+get['NEW_ID_SAMPLE'];
}

if(!queryInit){
    script.src = 'js/getgeojsonp.group.js';    
}else{
    script.src = 'https://lsws.newtvision.com/getgeojsonp?t=mss&'+queryInit;  
}

document.getElementsByTagName('head')[0].appendChild(script);

var map = {
    mapObject: null,
    layer: null,
    key: 'AIzaSyAgymWVxqul11-hNQpNvgjL1ZzQsq-d8WI',
    fusionTableId: '1sfPdnErQ8ZubgZaHEa7FrYmsp63VELha6JERUj8',
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
        
        // var queryInit = "";
        // if (Boolean(get['ID_MISSION'])){
        //     var queryInit = "'ID_MISSION'='"+get['ID_MISSION']+"'";
        // }
        // if (Boolean(get['ID_SUB_MISSION'])){
        //     var queryInit = "'ID_SUB_MISSION'='"+get['ID_SUB_MISSION']+"'";
        // }
        // if (Boolean(get['NEW_ID_SAMPLE'])){
        //     var queryInit = "'NEW_ID_SAMPLE'='"+get['NEW_ID_SAMPLE']+"'";
        // }
        
        // map.layer = new google.maps.FusionTablesLayer({
        //     query: {
        //         select: '',
        //         from: map.fusionTableId,
        //         where: queryInit
        //     },
        //     map: map.mapObject,
        //     suppressInfoWindows: true,
        //     options: {
        //         styleId: 2,
        //         templateId: 2

        //     }
            
        // })
        // var infoWindow = new google.maps.InfoWindow()

        // this runs whenever we click on a red dot
        //google.maps.event.addListener(map.layer, 'click', function(e) {
            //infowindow.click(infoWindow, e)
            /*
            var row = e.row
            infoWindow.setOptions({
                content: e.infoWindowHtml,
                position: e.latLng,
                pixelOffset: e.pixelOffset
            })
            infoWindow.open(map.mapObject)
            */

            //console.log(row)
            /*
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
            */
        //})
    }
}
var infoWindowCB = new google.maps.InfoWindow();

function mss_callback(response) {
  showOpacity ();
  lastRLength = response.features.length;
  map.mapObject.data.addGeoJson(response);
  map.mapObject.data.setStyle(function(feature) {
    return  { 
        icon: 'http://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png'
      }
  });
  map.mapObject.data.addListener('click', function(event) {
    infowindow.click(infoWindowCB, event);
  });

  hideOpacity ();
}
