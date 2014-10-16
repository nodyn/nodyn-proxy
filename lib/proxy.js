
var http = require('http');

var aether = require('./aether');

function toGAV(path) {
  if ( path.indexOf( '/' ) == 0 ) {
    path = path.substring(1);
  }

  var atLoc = path.indexOf( '@' );

  if ( atLoc > 0 ) {
    path[atLoc] = ':';
  }

  return path;
}

var server = http.createServer( function(request, response) {
  var url = request.url
  var path = decodeURIComponent( url );

  if ( path.indexOf( ':') >= 0 ) {
    console.log( "Maven: " + path );
    var artifact = new aether.Artifact( toGAV( path ) );
    try {
      var versions = artifact.versions();
      var r = {};
      r['name']      = artifact.name;
      r['versions']  = {};
      r['dist-tags'] = {}
      for ( i = 0 ; i < versions.length ; ++i ) {
        r.versions[versions[i]] = {};
        r['dist-tags']['latest'] = versions[i];
      }
      response.end( JSON.stringify(r) );
    } catch (e) {
      console.log( e );
    }
  } else {
    console.log( "REGULAR: " + path );
    response.end();
  }
  console.log( "done" );
} );

server.on( 'error', function(e) {
  console.log( 'ERROR: ' + e );
});

server.on( 'close', function() {
  console.log( "Server stopped" );
});

server.listen( 3000, function() {
  console.log( "listening!" );
});

