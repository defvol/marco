Transform csv datasets into GeoJSON, by matching line-by-line names of places against a line-delimited GeoJSON representation of Mexico's administrative boundaries.

Additional layers suitable for a data processing pipeline are included.

### This is how it works

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

### How to run

Download INEGI data and transform it into GeoJSON:

```bash
% ./data.sh -d data -t data
```

Stream a CSV file and output line-delimited GeoJSON features:
_(command-line pipes)_

```
✗ cat test/fixtures/dataset.csv | node example.js --state > matches.json
✗ wc -l matches.json
3 matches.json
✗ head -n1 matches.json | jq '.properties.NOM_ENT'
"Aguascalientes"
```

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
