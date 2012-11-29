traits = {
    tables: {
        Musa: '1e7Ndw0djwWaDYnqo7BMYWLw7zElTKC9-Jc227yQ',
        Ipomoea: '1bnG9YSgZJBItygxK5XgPq9MJPw1bpooGHy2tmGg'
    },
    cache: {},
    init: function() {
        traits.fillSelect()
        traits.assignChange()
    },
    assignChange: function() {
        var $select = $('.traits select')
        traits.assignTypeahead($select.val())
        $select.change(function() {
            traits.assignTypeahead($(this).val())
        })
    },
    assignTypeahead: function(crop) {
        var $traitFilter = $('.traitFilter')
        $traitFilter.find('div.filter').hide()
        // cache the DOM html
        var domCache = traits.cache['dom' + crop]
        if(domCache) {
            $traitFilter.find('.' + crop).show()
        } else {
            var $traitInput = $('<input type="text" class="typeahead" placeholder="ex: plant height" style="width: 100px"/>')
            var $traitValue = $('<input type="text" class="typeahead" placeholder="ex: 10cm" style="width: 100px" />')

            $traitValue.focus(function() {
                // get the values based on the $traitInput trait
                var $this = $(this)
                setTimeout(function() { 
                    $this.typeahead({
                        source: ['ciao']
                    })
                }, 5000)
            })

            traits.getTraits(crop, function(cropTraits) {
                $traitInput.typeahead({
                    source: cropTraits
                })
            })

            var $div = $('<div class="filter '+crop+'"></div>')

            $div.append($traitInput)
            $div.append(' = ')
            $div.append($traitValue)

            $traitFilter.append($div)

            // add it to cache
            traits.cache['dom' + crop] = true
        }
    },
    getTraits: function(crop, cb) {
        query.getColumns(traits.tables[crop], function(data) {
            var t = []
            for(var i in data.items) {
                var traitName = data.items[i].name
                t.push(traitName)
            }
            cb(t)
        })
    },
    fillSelect: function() {
        var $select = $('.traits select')
        for(var i in traits.tables) {
            $select.append('<option value="'+i+'">'+i+'</option>')
        }

    },
    submit: function() {
    }
}
