## [turf.js](http://turfjs.org)
geo in JavaScript
---

How long was my run?

---

Which is the closest ATM from my current location?

---

## One lib with many functions

---

...or many libraries with one function each

(at least 95 libs)

---

## Heavy weight server GIS

---

...but in the browser (or in Node, of course)

---

[GeoJSON](http://geojson.org)

---

```json
{
    "type": "Point",
    "coordinates": [11.7, 57.7]
}
```

---

```json
{
    "type": "LineString",
    "coordinates": [[11, 57], [12, 58]]
}
```

---

```json
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [11.7, 57.7]
    },
    "properties": {
        "name": "Göteborg",
        "population": 491630
    }
}

```

---

Demo

[Find nearest ATM](atms.html)

---

<pre>function findAtms(latlng) {
    var location = 
        <strong>turf.point([latlng.lng, latlng.lat])</strong>;

    atmsRequest.then(function(resp) {
        atms = atms || resp;
        var nearest = <strong>turf.nearest(location, atms)</strong>;
        atmLayer.clearLayers();
        atmLayer.addData(nearest);
        map.fitBounds(
            atmLayer.getBounds().extend(latlng),
            {maxZoom: 16});
    });
}</pre>

---

Demo

[Find ATMs along a route](atms-along.html)

---

<pre>function findAtms(route) {
    var line = <strong>turf.flip(turf.linestring(route.coordinates))</strong>,
        buffered = <strong>turf.buffer(line, 1000, 'meters')</strong>,
        nearbyAtms = <strong>turf.within(atms, buffered)</strong>;

        [...]
}</pre>

---

<pre>map.on('mousemove', function(e) {
    var p = <strong>turf.point([e.latlng.lng, e.latlng.lat])</strong>,
        pointOnLine = <strong>turf.pointOnLine(line, p)</strong>,
        nearest = <strong>turf.nearest(pointOnLine, nearbyAtms)</strong>;
    lineMarker.clearLayers();
    lineMarker.addData(pointOnLine);
    closestAtm.clearLayers();
    closestAtm.addData(nearest);
});</pre>

---

[Beautifully documented](http://turfjs.org/static/docs/)

---
