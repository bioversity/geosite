/*
TABLES:
https://www.google.com/fusiontables/DataSource?docid=12PyyTcPiqFqSw0VYy-nzVDs4ziMQnOgpInFTw-o
https://www.google.com/fusiontables/DataSource?docid=1IevrMRdq9ZmQt10Oa8IaPJ2-wfheZkuXhzOvFTs
https://www.google.com/fusiontables/DataSource?docid=1o-UvQHmOzovOgsYMlYpDD3kj0YDd8BBePhwcANE
https://www.google.com/fusiontables/DataSource?docid=1_5eJCH58ImSCuqddaNNnCfII4EOFoKxT6IUlGMY
https://www.google.com/fusiontables/DataSource?docid=1yxw_17Lxds9hq3kwJTj-O4smnPOnuZfUjpCJ4a4
https://www.google.com/fusiontables/DataSource?docid=1g5rq1sLqXArypFIudfAXN1p5P0dMGfNmW7AwWD0
https://www.google.com/fusiontables/DataSource?docid=1bnG9YSgZJBItygxK5XgPq9MJPw1bpooGHy2tmGg
https://www.google.com/fusiontables/DataSource?docid=1wk_SgC5_qS8eZleVawsKWmfM_Wn2C4Gc1Nvhpgg
https://www.google.com/fusiontables/DataSource?docid=19V-3m1F3dVvksLwgnI3RjIPBUEqY0EZ4XxRkmxw
https://www.google.com/fusiontables/DataSource?docid=1e7Ndw0djwWaDYnqo7BMYWLw7zElTKC9-Jc227yQ
https://www.google.com/fusiontables/DataSource?docid=1NRN1z_xmDdy5XRuCfhWehz01H4MUHf39KWIEhgM
https://www.google.com/fusiontables/DataSource?docid=1r06Y-Z2pRSGM1tOPdz15TbD8bGnvvkiI0I07_qw
*/

function showOpacity () {
  $('body').css({
      "opacity": "0.40",
      "pointer-events": "none"
    });
}

function hideOpacity () {
  $('body').css({
      "opacity": "",
      "pointer-events": ""
    });
}

var get = [];
location.search.replace('?', '').split('&').forEach(function (val) {
    split = val.split("=", 2);
    get[split[0]] = split[1];
});
var query = {
    couch: 'http://192.168.20.251:5984/geosite',
    ddoc: '/_design/geosite',
    prio: {
        'Country_Name': true,
        'Genus': true,
        'Species': true,
        'ScientificName': true,
        'SAMPSTAT': true,
        'ID_MISSION': true,
        'ID_SUB_MISSION': true
    },
    urls: [],
    init: function() {
        $('input[type=text]').each(function() {
            $(this).val('');
        });
        
        query.fieldNames = biocache;

        // typeahaed
        $('.typeahead').each(function() {
            var $this = $(this)
            query.assignTypeahead($this)
        })

        $('#submit').click(function(e) {
            query.buildQuery()
        })
        $('#heatmap').click(function(e) {
            map.layer.setOptions({
                heatmap: {
                    enabled: $(this).attr('checked')
                }
            })
        })
    },
    getURLParameter: function(name) {
        return decodeURI(
                (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
        );
    },
    checkParameter: function() {
        var missionId = this.getURLParameter('missionId'); 
            
        if(missionId && missionId != "null") {
            $('.btn.btn-primary.dropdown-toggle').text('Collecting Missions');
            $('.query-group.missions').show();
            $('[placeholder="ID_MISSION"]').val(missionId);
            $("#submit").click();
        }
    },
    buildParams: function(key, group) {
        var params = {};
        for(var i in group) {
            var a = group[i]
            a.value = a.value.toLowerCase()
            if(a.operator == '=') {
                params.startkey = '["' + key + '","'+ a.value +'"]'
                params.endkey = '["' + key + '","'+ a.value +'ZZZZZZZZZZZZZZZZZZZ"]'
            }
            if(a.operator == '>') {
                params.startkey = '["' + key + '","'+ a.value +'ZZZZZZZZZZZZZZZZZZZ"]'
            }
            if(a.operator == '<') {
                params.endkey = '["' + key + '","'+ a.value +'ZZZZZZZZZZZZZZZZZZZ"]'
            }
        }
        if(!params.startkey && params.endkey) {
            // if there's just an endkey,
            // let's convert it to startkey with descending true
            params.startkey = params.endkey
            params.descending = true

            delete params.endkey

        }
        if((params.startkey && !params.endkey) || (params.endkey && !params.startkey)) {
            // an endkey or a startkey is missing, 
            // apply a limit to not read the whole database
            params.limit = 100
        }
        params.include_docs = true
        return params
    },
    buildUrl: function(groups) {

        var $api = $('.api-calls')
        $api.html('')
        query.urls = []

        var url = query.couch
        url += query.ddoc
        url += '/_view/all?'

        for(var key in groups) {

            var group = groups[key]
            var params = query.buildParams(key, group)

            url = url + $.param(params)

            query.urls.push(url)
            var ale = '<div class="alert">' + url +'</div>'
            $api.append(ale)
        }

        return url
    },
    buildQuery: function() {
        var selectedGroup = $('.control-group .dropdown-toggle').text()

        if(selectedGroup == 'Collecting Missions') {
            missions.submit()
        } else if(selectedGroup == 'Collected Samples') {
            samples.submit()
        } else if(selectedGroup == 'Linked Accessions') {
            accessions.submit()
        } else if(selectedGroup == 'Traits') {
            traits.submit()
        }

    },

    setWhere: function(where, tableId) {
        var q = {
            select: '',
            from: map.fusionTableId,
            where: where
        }
        if(tableId) {
            q.from = tableId
        }
        var queryText = 'SELECT * FROM \'' +q.from + '\' WHERE ' + where;
        query.setApiCall(queryText)
        //console.log(queryText);
        //console.log(q);

        // map.layer.setOptions({
        //     query: q
        // })
        showOpacity();
        $.getJSON('https://lsws.newtvision.com/getgeojsonp', {
            t: 'mss',
            sql: queryText
        }, function(data) {
           map.init();
           mss_callback(data);
        });

        // just run the the same COUNT(*) query to simply understand the amount
        /*
        query.runQuery('SELECT COUNT() FROM ' + q.from + ' WHERE ' + where, function(data) {
            console.log(data)
        })
        */
    },
    setApiCall: function(queryText) {
        var encodedQuery = encodeURIComponent(queryText);

        // Construct the URL
        var url = ['https://lsws.newtvision.com/geosite'];
        url.push('?sql=' + encodedQuery);
        var apiUrl = url.join('')

        query.createDownloadCsv(url, encodedQuery)
        $('.api-calls').html('<a target="_blank" href="'+apiUrl+'">'+apiUrl+'</a>')

    },
    createDownloadCsv: function(url, encodedQuery) {
        //url.push('&key=' + map.key);
        var url2 = url.slice(0);
        // this is for JSON
        /*
        */
        //console.log(url2);
        //console.log(url);
        // this is for CSV
        
        var text = 'Download CSV';
        var $a = $('<a target="_blank" href="#" class="btn btn-success">' + text + '</a>');

        $('.downlaod-csv').html($a);

        $a.click(function(e) {
            showOpacity ();
            var $btn = $(this);
            $btn.addClass('disabled').text('Downloading...');

            //url2.push('&callback=?');
            $.getJSON(url2.join(''), function(data) {
                
                var rlength = data.rows ? data.rows.length : false;

                if(rlength) {
                    var $modal = $('.modal');
                    $modal.show();
                    $modal.find('.content').html('You\'re about to download <b>'+ rlength+'</b> rows of data. Click Download to get this data.');

                    url.push('&alt=csv');
                    //$modal.find('.download-modal').prop('href', url.join(''));
                    $modal.find('.download-modal').prop('href', 'https://lsws.newtvision.com/geositecsv?sql=' + encodedQuery);
                    $modal.find('.close-modal').click(function(e) {
                        $modal.hide();

                        e.preventDefault();
                        e.stopPropagation();
                    });
                    $btn.removeClass('disabled').text(text);
                    hideOpacity ();
                } else {
                    alert('No data to download!');
                    $btn.removeClass('disabled').text(text);
                    hideOpacity ();
                }
            })

            e.stopPropagation();
            e.preventDefault();
        });
    },

    fieldNames: {},
    assignTypeahead: function($elem) {
        var fieldName = $elem.attr('placeholder')
        var fusionTableId = $elem.attr('fusionTableId')
        if(!fusionTableId) return;

        if(query.fieldNames[fieldName + fusionTableId]) {
            var source = query.fieldNames[fieldName + fusionTableId]
            $elem.typeahead({
                source: source
            })
        } else { // contact the server
            // Retrieve the unique store names using GROUP BY workaround.
            
            var queryTextTest = "SELECT '"+fieldName+"' " +
                "FROM '" + fusionTableId + "' GROUP BY '"+fieldName+"'"


            var queryText = "SELECT '"+fieldName+"', COUNT() " +
                'FROM ' + fusionTableId + " GROUP BY '"+fieldName+"'"

            var encodedQuery = encodeURIComponent(queryText);

            // Construct the URL
            var url = ['https://lsws.newtvision.com/geosite'];
            url.push('?sql=' + encodedQuery);
            //url.push('&key=' + map.key);

            $.getJSON('http://bioversity-cache.appspot.com/cache-url?callback=?', {
                url: url.join('') 
            }, function(data) {
                var results = []
                for(var i in data.rows) {
                    var row = data.rows[i]
                    if(row.length && row[0]) {
                        results.push(row[0]) 
                    }
                }
                query.fieldNames[fieldName + fusionTableId] = results
                // Use the results to create the autocomplete options.
                $elem.typeahead({
                    source: results
                })
            });
        }
    },
    runQuery: function(queryText, cb) {
        showOpacity();
        var encodedQuery = encodeURIComponent(queryText);
        //console.log(encodedQuery);
        // Construct the URL
        //var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        var url = ['https://lsws.newtvision.com/geosite'];
        url.push('?sql=' + encodedQuery);
        //url.push('&key=' + map.key);
        //url.push('&callback=?')
        $.getJSON(url.join(''), function(data) {
            hideOpacity();
            cb(data)
        });
    },
    getColumns: function(tableId, cb) {
        showOpacity();
        $.getJSON('https://lsws.newtvision.com/getcolumns', {
            t: tableId
        }, function(data) {
            hideOpacity();
            cb(data)
        });


        // $.getJSON('https://www.googleapis.com/fusiontables/v1/tables/' + tableId + '/columns?key='+map.key, function(data) {
        //     cb(data)
        // });//+'&callback=?'
    },
    getInstitutes: function(instcode, cb) {
        var instTable = '1g5rq1sLqXArypFIudfAXN1p5P0dMGfNmW7AwWD0'
        var queryText = "SELECT 'ACRONYM', 'NAME_NAT' " +
                "FROM " + instTable + " WHERE INSTCODE = '"+instcode+"'";
        showOpacity();
        query.runQuery(queryText, function(data) {
            hideOpacity();
            cb(data)
        })

    },
    load: function(on) {
        var $submit = $('#submit')
        if(on) {
            $submit.attr('disabled', true)
            $submit.val('Loading...')
        } else {
            $submit.attr('disabled', false)
            $submit.val('Submit')
        }
    }
}
