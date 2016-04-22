MARCO is a simple line-delimited GeoJSON representation of Mexico's administrative boundaries, that is suitable for a data processing pipeline.

This repo includes a set of utilities and demos as well.

### Rationale

- I want to visualize government datasets in a map.
- The lack of geospatial datasets in Mexico is evident.
- Nevertheless, many datasets contain name of states and municipalities, e.g. 'Baja California', 'BC'. Although a geocoder could easily find coordinates for those places, it will not give you the whole shape of the place.
- It would be nice to have a tool that transforms those datasets containing known places to a GeoJSON with one command.

Other reasons why I'm doing this:

- Getting state and municipal boundaries from INEGI is a pain.
- So many people have asked me for shapefiles with state boundaries. I suspect that it is for designing choropleths.
- To skip the command line some people drag 'n drop those shapefiles into UI tools, yet they still go through a learning curve.
- The government will not clean up its data.

Notes:

- Boundaries in OSM for Mexico are not good yet. Work is in progress on that front. Thus I'm relying in INEGI's [Marco Geoestadístico Nacional] as the source of truth.

### The magic: a cheap geocoder solution

If I want to find a city in Mexico:

```bash
% node marco.js 'Mexicali' --centroid
```

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "place": {
          "municipality": "Mexicali"
        }
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -115.45532226562499,
          32.62780989050403
        ]
      }
    }
  ]
}
```

Cool. Problem is that, as you may know, many places in Mexico have slightly variations of their names, e.g. the state of Veracruz could be 'Veracruz de Ignacio de la Llave', just 'Veracruz' the capital, or the 'VER' abbreviation.

**Note: this is not a formal geocoder** and we are trying to solve a very clear delimited problem. Thus, a workaround to play here is to add a list of keywords per place.

```bash
% node marco.js 'Veracruz' --centroid --state
```

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "place": {
          "state": "Veracruz",
          "keywords": [
            "Veracruz",
            "Veracruz de Ignacio de la Llave",
            "VER"
          ]
        }
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -96.1358642578125,
          18.823116948090483
        ]
      }
    }
  ]
}
```

**By default**, MARCO returns one match (one GeoJSON feature) because we want it to plug into a data pipeline. If you want more matches just add `--multiple` to your command.

More commands:

* --centroid will return a Point feature
* --shape will return a Polygon feature
* --state will match query to states
* --municipality matches query against municipalities
* --multiple will return multiple matches found per query

### Cool examples

Transform a CSV to a choropleth-ready GeoJSON:

```bash
% cat poblacion-estatal.csv | node marco.js --shape --state
```

Make a map out of an article

```bash
% cat your-article.doc | node marco.js --centroid --municipality | geojsonio
```

See: [geojsonio-cli](https://github.com/mapbox/geojsonio-cli)

Find the distance between my city and a hurricane!

```bash
% wget EP202015_005adv_TRACK.kml | togeojson > hurricane.json
% node marco.js 'Puerto Escondido' --centroid --municipality | turf-distance hurricane.json
```

A pluggable geospatial analysis tool right in your terminal
```bash
% cat hospitales-without-coords.csv | node marco.js --shape --municipality | turf-distance $MY_LOCATION
```
_will find the closest municipality with a hospital_
