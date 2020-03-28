var argv = require('minimist')(process.argv.slice(2));
var marco = require('./lib/marco.js');
var through = require('through2');
var split = require('split');

var usage = function() {
  var text = [];
  text.push('Usage: node cli.js [-s] [-m] [-c] [-h] [-i]');
  text.push('');
  text.push('  --state matches query to states');
  text.push('  --municipality matches query against municipalities');
  text.push('  --collection wraps results in a FeatureCollection');
  text.push('  --input source should be a line-delimited JSON');
  text.push('  --help prints this help message.');
  text.push('');
  return text.join('\n');
}

var state = argv.state || argv.s;
var municipality = argv.municipality || argv.m;
var source = argv.input || argv.i;

// STREAMING

function setPipe() {
  var ts = through(() => {});
  if (state) {
    ts = marco.toStatePolygon({ source });
  } else if (municipality) {
    ts = marco.toMunicipalityPolygon({ source });
  }

  var transformed = process.stdin
    .pipe(split())
    .pipe(ts);

  if (argv.collection || argv.c) {
    transformed.pipe(marco.concatFeatureCollection());
  } else {
    transformed.pipe(process.stdout);
  }
}

setPipe();

// SIMPLE QUERIES

if (state) {
  marco.findState({ query: state, source }, (err, data) => {
    if (!err && data)
      console.log(JSON.stringify(data));
  });
} else if (municipality) {
  marco.findMunicipality({ query: municipality, source }, (err, data) => {
    if (!err && data)
      console.log(JSON.stringify(data));
  });
} else {
  console.log(usage());
  process.exit(1);
}
