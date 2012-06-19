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

ddoc.views.byCountry = {
    map: function(doc) {
        emit(doc['Country_Name'], 1)
    },
    reduce: '_sum'
}

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;
