const fs = require('fs');
const m = require('../lib/marco');
const readline = require('readline');
const test = require('tape').test;
const split = require('split');
const through = require('through2');

test('lineToJSON', (t) => {
  // GeoJSON lines
  t.deepEqual(m.lineToJSON(''), {});
  t.deepEqual(m.lineToJSON('{'), {});
  t.deepEqual(m.lineToJSON('"type": "FeatureCollection",'), {});
  t.deepEqual(m.lineToJSON(''), {});
  t.deepEqual(m.lineToJSON('"features": ['), {});
  t.deepEqual(m.lineToJSON(']'), {});
  t.deepEqual(m.lineToJSON('}'), {});

  // Random cases
  t.deepEqual(m.lineToJSON(null), {});
  t.deepEqual(m.lineToJSON('foo'), {});

  // Expected object creation
  t.deepEqual(m.lineToJSON('{"foo": "bar"}'), { foo: "bar" });
  t.deepEqual(m.lineToJSON('{"foo": "bar"},'), { foo: "bar" });
  t.deepEqual(m.lineToJSON('{"foo": "bar"}, '), { foo: "bar" });

  t.end();
});

test('matchInReadStream', (t) => {
  t.plan(7);

  var rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/fixtures/states.json')
  });

  var match = (obj) => (obj.geometry && obj.geometry.type == 'Polygon');
  m.matchInReadStream(match, rl, function (err, data) {
    t.false(err);
    t.equal(data.geometry.type, 'Polygon');
    t.equal(data.type, 'Feature');
    t.equal(data.properties.NOM_ENT, 'Baja California');
  });

  rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/fixtures/states.json')
  });
  match = (obj) => (obj.properties && obj.properties.NOM_ENT == 'Nuevo León');
  m.matchInReadStream(match, rl, function (err, data) {
    t.false(err);
    t.equal(data.geometry.type, 'Polygon');
    t.equal(data.properties.NOM_ENT, 'Nuevo León');
  });
});

test('findState', (t) => {
  t.plan(5);

  m.findState('Aguascalientes', function (err, data) {
    t.false(err);
    t.equal(data.properties.NOM_ENT, 'Aguascalientes');
    t.equal(data.geometry.type, 'Polygon');
  });

  m.findState('Null Island', function (err, data) {
    t.false(err);
    t.false(data);
  });
});

test('findMunicipality', (t) => {
  t.plan(5);

  m.findMunicipality('Mexicali', function (err, data) {
    t.false(err);
    t.equal(data.properties.NOM_MUN, 'Mexicali');
    t.equal(data.geometry.type, 'MultiPolygon');
  });

  m.findMunicipality('Null Island', function (err, data) {
    t.false(err);
    t.false(data);
  });
});

function readableStreamFixture() {
  // Simulating pipe from command line
  var Readable = require('stream').Readable;
  var rs = Readable();
  var fixture = fs.readFileSync(__dirname + '/fixtures/dataset.csv');
  rs._read = () => {
    rs.push(fixture);
    rs.push(null);
  };
  return rs;
}

test('toStatePolygon', (t) => {
  t.plan(1);

  var rs = readableStreamFixture();
  var tr = through((buff, _, next) => {
    var feature = JSON.parse(buff.toString());
    var keys = ['type', 'properties', 'geometry'];
    t.deepEqual(Object.keys(feature), keys, 'should output a GeoJSON feature');
  });

  rs.pipe(split())
    .pipe(m.toStatePolygon())
    .pipe(tr);
});
