module.exports.findState = function(query) {
  var feature = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -118.16894531249999,
                22.187404991398786
              ],
              [
                -118.16894531249999,
                32.65787573695528
              ],
              [
                -109.1162109375,
                32.65787573695528
              ],
              [
                -109.1162109375,
                22.187404991398786
              ],
              [
                -118.16894531249999,
                22.187404991398786
              ]
            ]
          ]
        }
      }
    ]
  };
  return feature;
}

module.exports.findMunicipality = function(query) {
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
