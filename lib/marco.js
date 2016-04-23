const readline = require('readline');
const fs = require('fs');

function lineToJSON(lineString) {
  try {
    var line = lineString.trim();
    if (line[line.length - 1] == ',')
      return JSON.parse(line.slice(0, line.length - 1));
    else
      return JSON.parse(line);
  } catch (err) {
    return {};
  }
}

function findStateInReadStream(query, stream, cb) {
  var match = null;

  stream.on('line', (line) => {
    var feature = lineToJSON(line);
    if (feature.properties) {
      var name = feature.properties.NOM_ENT;
      if (name.match(query)) {
        match = feature;
        stream.close();
      }
    }
  });

  stream.on('close', () => {
    cb(null, match);
  });
}

function findState(query, cb) {
  const db = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../data/states.json')
  });
  findStateInReadStream(query, db, function (err, data) {
    cb(err, data);
  });
}

function findMunicipality(query) {
  var feature = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [
            -115.4142737388611,
            32.65966419171409
          ]
        }
      }
    ]
  };
  return feature;
}

module.exports = {
  findMunicipality: findMunicipality,
  findState: findState,
  findStateInReadStream: findStateInReadStream,
  lineToJSON: lineToJSON
}
