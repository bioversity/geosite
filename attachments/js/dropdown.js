var dropdown = {
    init: function() {
        $('.btn-group .dropdown-menu li a').live('click', function(e) {
            var $this = $(this)
            var text = $this.text()

            var $btngroup = $this.parent().parent().parent()
            $btngroup.find('.dropdown-toggle span:first-child').text(text)

            query.buildQuery()

        })
        $('.query-group input').live('keypress', function(e) {
            query.buildQuery()
        })
    }
}   
