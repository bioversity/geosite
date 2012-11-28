samples = {
    submit: function() {
        var filters = []
        if(slide.filter) filters.push(slide.filter)
        $('div[groupName=samples] input').each(function() {
            var $this = $(this)
            var key, value, operator;
            key = $this.attr('placeholder')
            value = $this.val()
            operator = '=' // defaulting to = (not using < or >)
        
            if(value) {
                filters.push("'" + key + "' " + operator + " '" + value + "'")
            }
        })
        var where = filters.join(' AND ')
        if(where) {
            //console.log(where)
            query.setWhere(where)
        }
    }
}
