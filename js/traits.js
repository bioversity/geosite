traits = {
    tables: {
        Musa: '1e7Ndw0djwWaDYnqo7BMYWLw7zElTKC9-Jc227yQ',
        Ipomoea: '1bnG9YSgZJBItygxK5XgPq9MJPw1bpooGHy2tmGg',
        Dioscorea: '1_5eJCH58ImSCuqddaNNnCfII4EOFoKxT6IUlGMY',
        Manihot: '1wk_SgC5_qS8eZleVawsKWmfM_Wn2C4Gc1Nvhpgg',
        Pennisetum: '1NRN1z_xmDdy5XRuCfhWehz01H4MUHf39KWIEhgM',
        Sorghum: '1r06Y-Z2pRSGM1tOPdz15TbD8bGnvvkiI0I07_qw'
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
            var $traitInput = $('<input type="text" class="typeahead" placeholder="ex: Flesh color" style="width: 100px"/>')
            var $traitValue = $('<input type="text" class="typeahead" placeholder="ex: Orange" style="width: 100px" />')

            $traitInput.change(function() {
                $traitValue.val('')
            })

            $traitValue.focus(function() {
                // get the values based on the $traitInput trait
                var $this = $(this);
                var autocomplete = $this.typeahead({ minLength: 0 });
                var lookup = $this.typeahead.bind($this, 'lookup');
                lookup();
                traits.getTraitValues(crop, $traitInput.val(), function(data) {
                    //console.log(data)
                    autocomplete.data('typeahead').source = data
                    lookup()
                })
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
    getTraitValues: function(crop, trait, cb) {
        if(!trait) return;
        // XXX escape the trait variable
        var q = 'SELECT \'' + trait + '\', COUNT() FROM ' + traits.tables[crop] + ' GROUP BY \'' + trait + "'";
        query.runQuery(q, function(data) {
            var traitValues = []
            for(var i in data.rows) {
                var t = data.rows[i][0]
                if(t) traitValues.push(t)
            }
            cb(traitValues)
        })
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
        var currTableId = traits.tables[$('.traits select').val()]
        var $traitFilter = $('.traitFilter div:visible')
        var key = $traitFilter.find('input[type=text]').eq(0).val()
        var value = $traitFilter.find('input[type=text]').eq(1).val()

        var traitQuery = 'SELECT ID_SAMPLE FROM '+ currTableId + ' WHERE \''+key+'\' = \''+value+'\'';

        query.load(true)
        query.runQuery(traitQuery, function(data) {
            var id_samples = []
            for(var i in data.rows) {
                id_samples.push("'" + data.rows[i][0] + "'")
            }

            query.setWhere('ID_SAMPLE IN (' + id_samples.join(',') + ')')
            query.load(false)
        })
    }
}
