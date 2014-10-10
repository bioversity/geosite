# Collecting Missions

The site is an HTML/CSS/JavaScript website without any server or backend. It can be hosted on static repositories such as GitHub or on an Apache HTTPD server. The `js/query.js` contains all the logic for contacting Google Fusion tables servers and retrieving the data.

## Database

[Google Fusion tables](https://support.google.com/fusiontables/answer/2571232) is used to store/retrieve the missions information. Fusion tables also takes care of rendering the map.

The data, coming from the MS Access database, is split into CSV files - one for each table. Each file is then uploaded to Fusion Tables and a unique identifier is obtained for each table. For example the `MISSIONS_SAMPLES_SITES` table was uploaded by Hannes here: https://www.google.com/fusiontables/DataSource?docid=1sfPdnErQ8ZubgZaHEa7FrYmsp63VELha6JERUj8 and has an identifier of `1sfPdnErQ8ZubgZaHEa7FrYmsp63VELha6JERUj8`.

Once the CSV file is uploaded and the coordinates columns have been identified on Fusion Tables, the points are deoreferenced and rendered automatically on Fusion Tables.

JavaScript is used on the site to filter and retrieve data through AJAX call using the REST HTTP API documented on the Fusion Table site: https://developers.google.com/fusiontables/

## Code structure

The structure of the code is quite simple. Inside `index.html` there's a section that initializes all the various components used on the site:

  $(function() {
    map.init()
    slide.init()
    query.init()
    dropdown.init()
    traits.init()
    $('.dropdown-toggle').dropdown()
    $('input, textarea').placeholder();
    query.checkParameter();
  })
  
Each of those components such as `map`, `slice`, etc. has it's own file such as `js/map.js` and `js/slide.js`. By looking at the `init()` methods within each module one can easily understand what's going on.
