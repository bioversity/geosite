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
https://www.google.com/fusiontables/DataSource?docid=13k5H9qSRevZesV7OMStdmJRdVyjpuQemnFT6XWo
https://www.google.com/fusiontables/DataSource?docid=1e7Ndw0djwWaDYnqo7BMYWLw7zElTKC9-Jc227yQ
https://www.google.com/fusiontables/DataSource?docid=1NRN1z_xmDdy5XRuCfhWehz01H4MUHf39KWIEhgM
https://www.google.com/fusiontables/DataSource?docid=1r06Y-Z2pRSGM1tOPdz15TbD8bGnvvkiI0I07_qw
*/
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
        /*
        $('.add-query').live('click', function(e) {
            var $this = $(this)
            var $group = $this.parent().parent()

            var $clone = $group.clone()


            var $remove = $this.clone()
            $remove.removeClass('add-query').addClass('remove-query').removeClass('btn-success').addClass('btn-danger').find('i').removeClass('icon-plus').addClass('icon-minus')

            $remove.click(function(e) {
                var $this = $(this)

                $this.parent().parent().remove()

                e.preventDefault()
                e.stopPropagation()
            })

            var $last = $clone.children().last()
            if($last.children().length === 1) {
                $last.append($remove)
            }

            var fieldName = $clone.find('.field-name').text()
            var $typeahead = $clone.find('.typeahead')

            query.assignTypeahead(fieldName, $typeahead)

            $clone.insertAfter($group)

            e.preventDefault()
            e.stopPropagation()

        })

        var $drop = $('.query-dropdown')
        for(var i in query.prio) {
            $drop.append('<li><a href="#">'+i+'</a></li>')
        }

        */
        
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
        } else if(selectedGroup == 'Collecting Samples') {
            samples.submit()
        } else if(selectedGroup == 'Linked Accessions') {
            accessions.submit()
        } else if(selectedGroup == 'Trait Queries') {
            traits.submit()
        }

    },

    setWhere: function(where) {
        //console.log(where)
        map.layer.setOptions({
            query: {
                select: '',
                from: map.fusionTableId,
                where: where
            }
        })
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
            var queryText = "SELECT '"+fieldName+"', COUNT() " +
                'FROM ' + fusionTableId + " GROUP BY '"+fieldName+"'"

            var encodedQuery = encodeURIComponent(queryText);

            // Construct the URL
            var url = ['https://www.googleapis.com/fusiontables/v1/query'];
            url.push('?sql=' + encodedQuery);
            url.push('&key=' + map.key);

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
                //console.log(results)
                query.fieldNames[fieldName + fusionTableId] = results

                // Use the results to create the autocomplete options.
                $elem.typeahead({
                    source: results
                })
            });
        }
    },
    runQuery: function(queryText, cb) {
        var encodedQuery = encodeURIComponent(queryText);

        // Construct the URL
        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=' + map.key);
        url.push('&callback=?')

        $.getJSON(url.join(''), function(data) {
            cb(data)
        });
    },
    getColumns: function(tableId, cb) {
        $.getJSON('https://www.googleapis.com/fusiontables/v1/tables/' + tableId + '/columns?key='+map.key+'&callback=?', function(data) {
            cb(data)
        });
    },
    getInstitutes: function(instcode, cb) {
        var instTable = '1g5rq1sLqXArypFIudfAXN1p5P0dMGfNmW7AwWD0'
        var queryText = "SELECT 'ACRONYM', 'NAME_NAT' " +
                "FROM " + instTable + " WHERE INSTCODE = '"+instcode+"'";

        query.runQuery(queryText, function(data) {
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
