Transform a CSV dataset into GeoJSON, by matching names of places against a line-delimited GeoJSON representation of Mexico's administrative boundaries.

Additional layers suitable for a data processing pipeline are included.

### This is how it works

To get the polygon of a city in Mexico, type:

```bash
% node cli.js --municipality 'Mexicali'
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
        "type": "MultiPolygon",
        "coordinates": [...]
      }
    }
  ]
}
```

Get a GeoJSON of the state names found in a CSV:

```
✗ cat test/fixtures/dataset.csv | node cli.js -sc > matches.json
✗ wc -l matches.json
6 matches.json
✗ head -n1 matches.json
{"type":"FeatureCollection","features":[
✗ tail -n1 matches.json
]}
✗ cat matches.json | jq '.features[].properties.NOM_ENT'
"Aguascalientes"
"Baja California"
"Nuevo León"
```

**Commands:**

```
% node cli.js --help
```

### Setup

Download INEGI data and transform it into GeoJSON:

```bash
% ./data.sh -d data -t data
```

Install dependencies

```bash
% npm install
```

### How to run

Stream a CSV file and output line-delimited GeoJSON features:

```
✗ cat test/fixtures/dataset.csv | node cli.js --state > matches.json
✗ wc -l matches.json
3 matches.json
✗ head -n1 matches.json | jq '.properties.NOM_ENT'
"Aguascalientes"
```

### Cool examples

Transform a CSV to a choropleth-ready GeoJSON:

```bash
% cat poblacion-estatal.csv | node marco.js --state
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

_A pluggable geospatial toolset right in your terminal._
