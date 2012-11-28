accessions = {
    accTable: '12PyyTcPiqFqSw0VYy-nzVDs4ziMQnOgpInFTw-o',
    submit: function() {
        var accFilters = []
        $('div[groupName=accessions] input').each(function() {
            var $this = $(this)
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
        
            if(value) {
                accFilters.push("'" + key + "' " + operator + " '" + value + "'")
            }
        })
        var accQuery = "SELECT ID_SAMPLE " +
                "FROM " + accessions.accTable + " WHERE " + accFilters.join(' AND ');

        if(accFilters.length) {
            query.load(true)
            query.runQuery(accQuery, function(data) { 
                var idSamples = []
                for(var i in data.rows) {
                    var id_sample = data.rows[i][0]
                    idSamples.push("'" + id_sample + "'")
                }

                if(idSamples.length) {
                    query.setWhere("ID_SAMPLE IN (" + idSamples.join(',') + ")")
                }
                query.load(false)
            })
        }
        /*
        var where = filters.join(' AND ')
        if(where) {
            //console.log(where)
            query.setWhere(where)
        }
        */
    }
}
