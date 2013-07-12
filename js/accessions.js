accessions = {
    accTable: '1T3qJ47z2Q1gFI8QRNXz5XDMfToySKEFkVcTrVlc',
    mergeOfAccessionsAndMissionsSamples: '1QknvlptH6ens5-NZyzgSZc_5TlqaHpeT9ppXtEo',
    submit: function() {
        // do first the institutes
        var instFilters = []
        $('div[groupName=institutes] input').each(function() {
            var $this = $(this)
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
        
            if(value) {
                instFilters.push("'" + key + "' " + operator + " '" + value + "'")
            }

        })
        var instQuery = "SELECT INSTCODE " +
                "FROM " + missions.instTable + " WHERE " + instFilters.join(' AND ');

        if(instFilters.length) {
            query.load(true)
            query.runQuery(instQuery, function(data) { 
                if(!data.rows.length) {
                    query.load(false)
                    return;
                }

                var instcodes = missions.buildWhereInst(data)
                runAccessionQuery([instcodes])
                query.load(false)
            })
            

        }

        function runAccessionQuery(filters) {

            $('div[groupName=accessions] input').each(function() {
                var $this = $(this)
                var key, value, operator;
                key = $this.attr('placeholder')
                value = $this.val()
                operator = '=' // defaulting to = (not using < or >)
            
                if(value) {
                    filters.push("'" + key + "' " + operator + " '" + value + "'")
                }
            })

            var where =  filters.join(' AND ');

            if(filters.length) {
                query.setWhere(where, accessions.mergeOfAccessionsAndMissionsSamples)
            }
        }
    }
}
