var dropdown = {
    init: function() {
        $('.dropdown-menu li a').live('click', function(e) {
            var $this = $(this)
            var text = $this.text()

            var $btngroup = $this.parent().parent().parent()
            $btngroup.find('.dropdown-toggle span:first-child').text(text)

            $('.query-group').hide()
            if(text == 'Collecting Missions') {
                $('.query-group.missions').show() 
            } else if(text == 'Collecting Samples') {
                $('.query-group.samples').show() 
            }
        })
    }
}   
