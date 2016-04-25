var argv = require('minimist')(process.argv.slice(2));
var marco = require('./lib/marco.js');
var through = require('through2');
var split = require('split');

var usage = function() {
  var text = [];
  text.push('Usage: node example.js [-s] [-m] [-h]');
  text.push('');
  text.push('  --centroid returns a Point feature');
  text.push('  --shape returns a Polygon feature');
  text.push('  --state matches query to states');
  text.push('  --municipality matches query against municipalities');
  text.push('  --multiple returns all matches found per query');
  text.push('  --help prints this help message.');
  text.push('');
  return text.join('\n');
}

var state = argv.state || argv.s;
var municipality = argv.municipality || argv.m;

// STREAMING

function setPipe() {
  var ts = through(() => {});
  if (state) {
    ts = marco.toStatePolygon();
  }

  process.stdin
    .pipe(split())
    .pipe(ts)
    .pipe(process.stdout);
}

setPipe();

// SIMPLE QUERIES

if (state) {
  marco.findState(state, (err, data) => {
    if (!err && data)
      console.log(JSON.stringify(data));
  });
} else if (municipality) {
  marco.findMunicipality(municipality, (err, data) => {
    if (!err && data)
      console.log(JSON.stringify(data));
  });
} else {
  console.log(usage());
  process.exit(1);
}
