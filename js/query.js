var query = {
    couch: 'http://192.168.20.251:5984/geosite',
    ddoc: '/_design/geosite',
    prio: {
        'Country_Name': true,
        'COLLDATE': true,
        'Genus': true,
        'Species': true,
        'SAMPSTAT': true,
        'ID_MISSION': true,
        'ID_SUB_MISSION': true
    },
    urls: [],
    init: function() {
        $('.add-query').live('click', function(e) {
            var $this = $(this)
            var $group = $this.parent().parent()

            var $clone = $group.clone()


            var $remove = $this.clone()
            $remove.removeClass('add-query').addClass('remove-query').removeClass('btn-success').addClass('btn-danger').find('i').removeClass('icon-plus').addClass('icon-minus')

            var $last = $clone.children().last()
            if($last.children().length === 1) {
                $last.append($remove)
            }

            $clone.insertAfter($group)

            query.buildQuery()

            e.preventDefault()
            e.stopPropagation()

        })

        $('.remove-query').live('click', function(e) {
            var $this = $(this)

            $this.parent().parent().remove()

            query.buildQuery()

            e.preventDefault()
            e.stopPropagation()
        })
        var $drop = $('.query-dropdown')
        for(var i in query.prio) {
            $drop.append('<li><a href="#">'+i+'</a></li>')
        }

        $('#submit').click(function(e) {
            query.buildQuery()
            for(var i in query.urls) {
                map.showMarkers(query.urls[i], function() {
                    console.log('done')

                })
            }
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
        var groups = {}
        $('.query-group').each(function(){
            var $this = $(this)
            var children = $this.children()
            var key, value, operator;
            key = children.eq(0).find('.dropdown-toggle span').text()
            value = children.eq(2).find('input').val()
            operator = children.eq(1).find('.dropdown-toggle span').text()

            groups[key] = groups[key] || []
            groups[key].push({
                value: value,
                operator: operator
            })

        })


        query.buildUrl(groups)
    }
}
