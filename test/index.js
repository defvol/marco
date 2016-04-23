const fs        = require('fs');
const m         = require('../lib/marco');
const readline  = require('readline');
const test      = require('tape').test;

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

test('findStateInReadStream', (t) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/fixtures/states.json')
  });

  var query = 'Baja California';
  m.findStateInReadStream(query, rl, function (err, data) {
    t.false(err);
    t.true(data.geometry);
    t.equal(data.properties.NOM_ENT, query);
  });

  m.findStateInReadStream('Null Island', rl, function (err, data) {
    t.false(err);
    t.false(data);
  });

  t.end();
});

test('findState', (t) => {
  m.findState('Aguascalientes', function (err, data) {
    t.false(err);
    t.ok(data);
    t.equal(data.properties.NOM_ENT, 'Aguascalientes');
    t.equal(data.geometry.type, 'Polygon');
  });

  m.findState('Null Island', function (err, data) {
    t.false(err);
    t.false(data);
  });

  t.end();
});
