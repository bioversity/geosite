missions = {
    instTable: '1g5rq1sLqXArypFIudfAXN1p5P0dMGfNmW7AwWD0',
    coopTable: '1o-UvQHmOzovOgsYMlYpDD3kj0YDd8BBePhwcANE',
    collTable: '1IevrMRdq9ZmQt10Oa8IaPJ2-wfheZkuXhzOvFTs',
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
                
                instFilters.push("'" + key + "' " + operator + " '" + value.replace(/'/g, "~") + "'")
            }
            
        })
        var instQuery = "SELECT 'INSTCODE' " +
                "FROM '" + missions.instTable + "' WHERE " + instFilters.join(' AND ');

        // cooperators
        var coopFilters = []
        $('div[groupName=cooperators] input').each(function() {
            var $this = $(this)
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
            if(value) {

                coopFilters.push("'" + key + "' " + operator + " '" + value.replace(/'/g, "~") + "'")
            }
            
        })
        var coopQuery = "SELECT 'ID_COOPERATOR' " +
                "FROM '" + missions.coopTable + "' WHERE " + coopFilters.join(' AND ');

        query.load(true)
        if(instFilters.length && coopFilters.length) { // both institutes and cooperators filled
            query.runQuery(instQuery, function(data) { // first inst
                var w = missions.buildWhereInst(data)
                query.runQuery(coopQuery, function(data) { // then coop
                    missions.buildWhereCoop(data, function(where) {
                        if(w) {
                            where += ' AND ' + w
                        }
                        var missionsWhere = missions.buildWhereSamples()
                        if(missionsWhere) {
                            where += ' AND ' + missionsWhere
                        }
                        if(where) {
                            query.setWhere(where)
                        }
                        query.load(false)
                    })
                })
            })
        } else if(instFilters.length) { // only institues fields were filled
            query.runQuery(instQuery, function(data) {
                var where = missions.buildWhereInst(data)
                var missionsWhere = missions.buildWhereSamples()
                if(missionsWhere) {
                    where += ' AND ' + missionsWhere
                }
                if(where) {
                    query.setWhere(where)
                }
                query.load(false)
            })
        } else if(coopFilters.length) { // only coop fields were filled
            query.runQuery(coopQuery, function(data) {
                missions.buildWhereCoop(data, function(where) {
                    var missionsWhere = missions.buildWhereSamples()
                    if(missionsWhere) {
                        where += ' AND ' + missionsWhere
                    }
                    if(where) {
                        query.setWhere(where)
                    }
                    query.load(false)
                })
            })
        } else {
            var where = missions.buildWhereSamples()
            if(where) {
                query.setWhere(where)
            }
            query.load(false)
        }

    },
    buildWhereCoop: function(data, callback) {
        var coopIds = []
        for(var i in data.rows) {
            var id_cooperator = data.rows[i][0]
            coopIds.push("'" + id_cooperator + "'")
        }
        var q = 'SELECT \'ID_SUB_MISSION\' FROM \''+missions.collTable+'\' WHERE ID_COOPERATOR IN (' + coopIds.join(',') + ')';
        query.runQuery(q, function(data) {
            var idSubMissions = []
            for(var i in data.rows) {
                var id_sub_mission = data.rows[i][0]
                idSubMissions.push("'" + id_sub_mission + "'")
            }

            var where = ''
            if(idSubMissions.length) { 
                where = 'ID_SUB_MISSION IN (' + idSubMissions.join(',') + ')'
            }

            callback(where)
        })
    },
    buildWhereInst: function(data) {
        var instCodes = []
        for(var i in data.rows) {
            var instcode = data.rows[i][0]
            instCodes.push("'" + instcode + "'")
        }
        var where = ''
        if(instCodes.length) {
            where = 'INSTCODE IN ('+instCodes.join(',')+')'
        }

        // add the other input filters
        /*
        var filters = []
        missions.addFilters(filters)
        if(filters.length) {
            where += 'AND' + filters.join(' AND ')
        }
        */
        // using IN (OR isn't supported) instead of AND
        return where
    },
    buildWhereSamples: function() {
        var filters = []
        // check the range lower and upper
        if(slide.filter) filters.push(slide.filter)

        $('div[groupName=missions] input').each(function() {
            var $this = $(this)
            var children = $this.children()
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
        
            if(value) {
                
                filters.push("'" + key + "' " + operator + " '" + value.replace(/'/g, "~") + "'")
            }
        })

        return filters.join(' AND ')
    }
}
