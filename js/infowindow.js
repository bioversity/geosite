infowindow = {
    pdfLink: function(missionId) {
        var form = '<div style="margin-top: 20px;"><form method="post" action="http://www.central-repository.cgiar.org/index.php?id=2391" target="_blank">\
              <input type="hidden" size="45" value="'+missionId+'" name="user_alfsearch_pi1[search1][missionID]">\
              <input type="hidden" value="Search" name="user_alfsearch_pi1[search1][submit]">\
              <div style="margin:auto; text-align: center;margin-top:-18px;">\
              <style>\
                .pdf-link:hover {\
                   color: #ff3333; \
                }\
              </style>\
                  <img src="http://www.central-repository.cgiar.org/alfresco/images/filetypes/pdf.gif" style="vertical-align:middle;"/><input class="pdf-link" type="submit" value="View pdf files for this mission" style="background: none repeat scroll 0% 0% transparent; border: 0pt none; cursor: pointer; color: #336699;"/>\
              </div>\
          </form></div>';

        return form;
        
    },
    click: function(iw, e) {
        var row = e.row
        var html = infowindow.pdfLink(row.ID_MISSION.value)
        html += e.infoWindowHtml
        iw.setOptions({
            content: html,
            position: e.latLng,
            pixelOffset: e.pixelOffset
        })
        iw.open(map.mapObject)
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
    }
}
