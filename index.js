

var fs = require('fs');

jars = fs.readdirSync( './jars' );

for ( i = 0 ; i < jars.length ; ++i ) {
  require( './jars/' + jars[i] );
}

require( './lib/proxy.js')

