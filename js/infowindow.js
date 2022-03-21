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
    makePILinks: function(html) {
        var reg = /PI [\d]+/g
        if(html.match(reg)) {
            html = html.replace(reg, function(PI) {
                return '<a href="http://www.ars-grin.gov/cgi-bin/npgs/acc/search.pl?accid='+PI+'">'+PI+'</a>'
            })
        }
        if(html.match(/CN [\d]+/g)) {
            html = html.replace(reg, function(CN) {
                return '<a href="http://pgrc3.agr.gc.ca/cgi-bin/npgs/html/acc_search.pl?accid='+CN+'">'+CN+'</a>'
            }) 
            
        }
        return html
    },
    makeID_MISSIONLinks: function(html, missionId) {
        var reg = "<b>ID_MISSION:<\/b> "+missionId+"<br>"
        if(html.match(reg)) {
            html = html.replace(reg,'<b>ID_MISSION:<\/b> <a href="index.html?ID_MISSION='+missionId+'">'+missionId+'</a><br>')
        }
        return html
    },
    makeID_SUB_MISSIONLinks: function(html, submissionId) {
        var reg = "<b>ID_SUB_MISSION:<\/b> "+submissionId+"<br>"
        if(html.match(reg)) {
            html = html.replace(reg,'<b>ID_SUB_MISSION:<\/b> <a href="index.html?ID_SUB_MISSION='+submissionId+'">'+submissionId+'</a><br>')
        }
        return html
    },
    makeNEW_ID_SAMPLELinks: function(html, newIdsample) {
        var reg = "<b>NEW_ID_SAMPLE:<\/b> "+newIdsample+"<br>"
        if(html.match(reg)) {
            html = html.replace(reg,'<b>NEW_ID_SAMPLE:<\/b> <a href="index.html?NEW_ID_SAMPLE='+newIdsample+'">'+newIdsample+'</a><br>')
        }
        return html
    },
    click: function(iw, e) {
        // var row = e.feature.h == undefined ? e.feature.i : e.feature.h;
        var row = e.feature.j;
        var html = infowindow.pdfLink(row.ID_MISSION)

        for (var key in row){
            html += "<b>"+key+":<\/b> "+row[key]+"<br>"
        }

        //html += e.infoWindowHtml
        html = infowindow.makePILinks(html)
        html = infowindow.makeID_MISSIONLinks(html, row.ID_MISSION)
        html = infowindow.makeID_SUB_MISSIONLinks(html, row.ID_SUB_MISSION)
        html = infowindow.makeNEW_ID_SAMPLELinks(html, row.NEW_ID_SAMPLE)
        iw.setOptions({
            content: html,
            position: e.latLng,
            pixelOffset: e.pixelOffset
        })
        iw.open(map.mapObject)
        //console.log(row)
        /*
        var instcode = row.INSTCODE.split(';')

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
