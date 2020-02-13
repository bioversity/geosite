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
                filters.push("'" + key + "' " + operator + " '" + value.replace(/'/g, "~") + "'")
            }
        })
        var where = filters.join(' AND ')
        if(where) {
            query.setWhere(where)
        }
    }
}
