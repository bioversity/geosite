var query = {
    couch: 'http://192.168.20.251:5984/geosite',
    prio: {
        'Country_Name': true,
        'COLLDATE': true,
        'Genus': true,
        'Species': true,
        'SAMPSTAT': true,
        'ID_MISSION': true,
        'ID_SUB_MISSION': true
    },
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
    },
    buildUrl: function(key, value, operator) {
        var params;
        var url = query.couch
        url += '/_design/geosite'
        url += '/_view/all?'

        value = value.toLowerCase()

        if(operator == '=') {
            params = {
                key: '["' + key + '","'+ value +'"]',
            }
        } else if (operator == '>') {
            params = {
                startkey: '["' + key + '","'+ value +'"]',
                endkey: '["' + key + '","'+ value +'ZZZZZZZZZ"]'
            }
        } else if (operator == '<') {
            params = {
                startkey: '["' + key + '","'+ value +'ZZZZZZZZZ"]',
                endkey: '["' + key + '","'+ value +'ZZZZZZZZZ"]'
            }
        }

        url += $.param(params)
        return url
    },
    buildQuery: function() {
        var groups = []
        $('.query-group').each(function(){
            var $this = $(this)
            var children = $this.children()
            var key, value, operator;
            key = children.eq(0).find('.dropdown-toggle span').text()
            value = children.eq(2).find('input').val()
            operator = children.eq(1).find('.dropdown-toggle span').text()

            groups.push({
                key: key,
                value: value,
                operator: operator
            })

        })

        /*
        var $api = $('.api-calls')
        $api.html('')
            var url = query.buildUrl(key, value, operator)
            var ale = '<div class="alert">' + url +'</div>'
            $api.append(ale)
        */

        query.buildUrl(groups)
    }
}
