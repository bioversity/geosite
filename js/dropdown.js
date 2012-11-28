var dropdown = {
    init: function() {
        $('.dropdown-menu li a').live('click', function(e) {
            var $this = $(this)
            var text = $this.text()

            var $btngroup = $this.parent().parent().parent()
            $btngroup.find('.dropdown-toggle span:first-child').text(text)

            $('.query-group').hide()
            $('.query-group.' + $this.attr('group')).show()
        })
    }
}   
