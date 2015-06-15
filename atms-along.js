var map = L.map('map'),
    locationMarker,
    atms,
    RedIcon = L.Icon.Default.extend({
        options: {
            iconUrl: 'marker-icon-red.png' 
        }
    }),
    atmLayer = L.geoJson().addTo(map),
    routeLayer = L.layerGroup().addTo(map),
    lineMarker = L.geoJson(undefined, {pointToLayer: function(f, latlng) { return L.circleMarker(latlng); }}).addTo(map),
    closestAtm = L.geoJson(undefined, {pointToLayer: function(f, latlng) { return L.marker(latlng, {icon: new RedIcon()}) }}).addTo(map),
    atmsRequest = reqwest({url: 'data/atms.json', type: 'json'}),
    router = L.Routing.osrm();

L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiI3ZGFmOGI2ZWY0MTAyYzUyMjAxNjcxYjQzZjRkYzM3MSJ9.XoFXhnx2eXp0DJwL3aEzZg',
    {attribution: '<a href="https://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a>'})
    .addTo(map);

function findAtms(route) {
    var line = turf.flip(turf.linestring(route.coordinates)),
        buffered = turf.buffer(line, 1000, 'meters'),
        routeLine = L.Routing.line(route);

    routeLayer.clearLayers();
    routeLine.addTo(routeLayer);

    atmsRequest.then(function(resp) {
        atms = atms || resp;
        atmLayer.clearLayers();

        var nearbyAtms = turf.within(atms, buffered);

        atmLayer.addData(nearbyAtms);
        map.fitBounds(atmLayer.getBounds().extend(routeLine.getBounds()), {maxZoom: 16});

        map.on('mousemove', function(e) {
            var p = turf.point([e.latlng.lng, e.latlng.lat]),
                pointOnLine = turf.pointOnLine(line, p);
            lineMarker.clearLayers();
            lineMarker.addData(pointOnLine);
            closestAtm.clearLayers();
            closestAtm.addData(turf.nearest(pointOnLine, nearbyAtms));
        });
    });
}

router.route([L.Routing.waypoint(L.latLng(57.7, 11.9)), L.Routing.waypoint(L.latLng(59.33, 18.07))], function(err, routes) {
    if (!err) {
        findAtms(routes[0]);
    } else {
        console.log(err);
    }
});
