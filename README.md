Transform a CSV dataset into GeoJSON, by matching names of places against a line-delimited GeoJSON source of truth.

Additional layers suitable for a data processing pipeline are included.

![demo](https://raw.githubusercontent.com/rodowi/marco/master/demo.gif)

### This is how it works

**Bring your own**

The PoC looks for administrative boundaries in Mexico from [Marco Geoestadístico Nacional](http://www.inegi.org.mx/geo/contenidos/geoestadistica/m_g_0.aspx), but you could easily swap to other sources, like OSM.

**From the command line**

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

Stream a CSV file and output line-delimited GeoJSON FeatureCollection:

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

[recommended] [Simplify GeoJSON](https://github.com/maxogden/simplify-geojson)

```bash
% npm install simplify-geojson -g
% cat test/fixtures/dataset.csv | node cli.js --state --collection | simplify-geojson -t 0.01 > map.json
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
