var argv = require('minimist')(process.argv.slice(2));

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

if (argv.state || argv.s) {
  console.log('Fue el estado');
} else if (argv.municipality || argv.m) {
  console.log('Fue el municipio');
} else {
  console.log(usage());
}
