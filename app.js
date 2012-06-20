 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/geosite'
  , rewrites : 
    [ 
        { from:'/', to:'index.html' }
    ]
  }
  ;

ddoc.views = {};
/*
ddoc.views.all = {
    map: function(doc) {
        var prio = {
            'Country_Name': true,
            'COLLDATE': true,
            'Genus': true,
            'Species': true,
            'SAMPSTAT': true,
            'ID_MISSION': true,
            'ID_SUB_MISSION': true
        }
        for(var i in doc) {
            if(prio[i]) {
                var normal = doc[i].toLowerCase()
                emit([i, normal], null)
            }
        }
    }
}
*/

ddoc.views.byCountry = {
    map: function(doc) {
        if(doc['Country_Name'] && doc['ID_SUB_MISSION']) {
            emit([doc['Country_Name'].toLowerCase(), doc['ID_SUB_MISSION'].toLowerCase()], {
                samples: 1,
                lat: doc['LATITUDEdecimal'],
                lng: doc['LONGITUDEdecimal']
            })
        }
    },
    reduce: function (key, values, rereduce) {
        var ret = {
            samples: 0,
            lat: 0,
            lng: 0
        }
        for(var i in values) {
            ret.samples += values[i].samples
            if(values[i].lat && values[i].lng) {
                ret.lat = values[i].lat
                ret.lng = values[i].lng
            }
        }
        return ret
    }
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
