samples = {
    instTable: '1g5rq1sLqXArypFIudfAXN1p5P0dMGfNmW7AwWD0',
    submit: function() {
        // do the Insititues part first if they contain data
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
        var where = instFilters.join(' AND ')
        var queryText = "SELECT INSTCODE " +
                "FROM " + samples.instTable + " WHERE " + where;

        if(instFilters.length) { // institues fields were filled out
            query.runQuery(queryText, function(data) {
                var instCodes = []
                for(var i in data.rows) {
                    var instcode = data.rows[i][0]
                    instCodes.push("'" + instcode + "'")
                }


                // add the other input filters
                var filters = []
                samples.addFilters(filters)
                // using IN (OR isn't supported) instead of AND
                var where = 'INSTCODE IN ('+instCodes.join(',')+')'
                if(filters.length) {
                    where += 'AND' + filters.join(' AND ')
                }
                console.log(where)
                query.setWhere(where)

            })
        } else {
            
        }

        return;


    },
    addFilters: function(filters) {
        // check the range lower and upper
        if(slide.filter) filters.push(slide.filter)

        $('div[groupName=samples] input').each(function() {
            var $this = $(this)
            var children = $this.children()
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
        
            if(value) {
                filters.push("'" + key + "' " + operator + " '" + value + "'")
            }
        })
    }
}
