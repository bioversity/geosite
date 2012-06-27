var slide = {
    visible: true,
    init: function() {
        $('.slide').click(function() {
            if(slide.visible) { // hide
                $(".sidebar")
                    .animate({ width: 0 }, 250)
                    .animate({ width: '+=20' },185)
                    .animate({ width: '0' },155, function() {
                        slide.visible = false
                    })
                $(".slide")
                    .animate({ left: 0 }, 250)
                    .animate({ left: '+=20' },185)
                    .animate({ left: '0' },155)
                    .find('i')
                    .attr("class", "icon-chevron-right")

                    
            } else { //show
                $(".sidebar")
                    .animate({ width: 350 }, 250)
                    .animate({ width: '-=20' },185)
                    .animate({ width: '350' },155, function() {
                        slide.visible = true
                    })
                $(".slide")
                    .animate({ left: 350 }, 250)
                    .animate({ left: '-=20' },185)
                    .animate({ left: '350' },155)
                    .find('i')
                    .attr("class", "icon-chevron-left")

            }
        })

        slide.sliderbar(1970, 2003)

    },
    sliderbar: function(min, max) {
        var $sliderbar = $('.sliderbar')
        var $sliderbarValue = $('#sliderbar-value')
        setDate(min, max)
        $sliderbar.noUiSlider('init', {
            scale: [min, max],

            startMin: min,
            startMax: max,
            
            tracker: function() {
                var lower = $sliderbar.noUiSlider("getValue", {point: "lower"})
                var upper = $sliderbar.noUiSlider("getValue", {point: "upper"})

                setDate(lower, upper)
            },
            change: function() {
                var lower = $sliderbar.noUiSlider("getValue", {point: "lower"})
                var upper = $sliderbar.noUiSlider("getValue", {point: "upper"})

                setDate(lower, upper)
            }
        })
        function setDate(lower, upper) {
            $sliderbarValue.html('<span class="badge badge-info">' + Math.round(lower) + '</span> - <span class="badge badge-important">' + Math.round(upper) + '</span>')
        }
    }
}
