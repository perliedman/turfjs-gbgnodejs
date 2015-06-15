var map = L.map('map'),
    locationMarker,
    atms,
    atmLayer = L.geoJson(null, {
        onEachFeature: function(f, l) {
            l.bindPopup(Object.keys(f.properties.tags).reduce(function(s, p) {
                return s + p + ': <b>' + f.properties.tags[p] + '</b><br/>';
            }, ''));
        }
    }).addTo(map),
    atmsRequest = reqwest({url: 'data/atms.json', type: 'json'});

L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiI3ZGFmOGI2ZWY0MTAyYzUyMjAxNjcxYjQzZjRkYzM3MSJ9.XoFXhnx2eXp0DJwL3aEzZg',
    {attribution: '<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>'})
    .addTo(map);

function findAtms(latlng) {
    var location = turf.point([latlng.lng, latlng.lat]);

    atmsRequest.then(function(resp) {
        atms = atms || resp;
        atmLayer.clearLayers();
        atmLayer.addData(turf.nearest(location, atms));
        map.fitBounds(atmLayer.getBounds().extend(latlng), {maxZoom: 16});
        /*
        var atmDists = atms.features.map(function(atm) {
            return {
                feature: atm,
                distance: turf.distance(atm, location)
            };
        });
        atmDists.sort(function(a, b) {
            return a.distance - b.distance;
        });
        atmLayer.clearLayers();
        atmLayer.addData(atmDists.slice(0, 6).map(function(atm) { return atm.feature; }));
        map.fitBounds(atmLayer.getBounds().extend(latlng), {maxZoom: 18});
        */
    });
}

function setLocation(e) {
    if (locationMarker) {
        locationMarker.setLatLng(e.latlng);
    } else {
        locationMarker = L.circleMarker(e.latlng).addTo(map);
    }

    findAtms(e.latlng);
}

map.on('locationfound', setLocation);
map.on('click', setLocation);

map.locate({
    maxZoom: 15
});
