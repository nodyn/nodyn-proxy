
var VersionRangeRequest = org.eclipse.aether.resolution.VersionRangeRequest;

var DefaultServiceLocator           = org.eclipse.aether.impl.DefaultServiceLocator;

var RepositorySystem                = org.eclipse.aether.RepositorySystem;
var RepositoryConnectorFactory      = org.eclipse.aether.spi.connector.RepositoryConnectorFactory;
var BasicRepositoryConnectorFactory = org.eclipse.aether.connector.basic.BasicRepositoryConnectorFactory;

var TransporterFactory              = org.eclipse.aether.spi.connector.transport.TransporterFactory;
var FileTransporterFactory          = org.eclipse.aether.transport.file.FileTransporterFactory;
var HttpTransporterFactory          = org.eclipse.aether.transport.http.HttpTransporterFactory;

var LocalRepository            = org.eclipse.aether.repository.LocalRepository;
var RemoteRepository           = org.eclipse.aether.repository.RemoteRepository;
var MavenRepositorySystemUtils = org.apache.maven.repository.internal.MavenRepositorySystemUtils;

function newRepositorySystem() {
  var locator = MavenRepositorySystemUtils.newServiceLocator();

  locator.addService(RepositoryConnectorFactory, BasicRepositoryConnectorFactory);
  locator.addService(TransporterFactory, FileTransporterFactory);
  locator.addService(TransporterFactory, HttpTransporterFactory);

  return locator.getService(RepositorySystem);
}

function newRepositorySystemSession(system) {
  var session = MavenRepositorySystemUtils.newSession();

  var localRepo = new LocalRepository( "target/local-repo" );
  session.localRepositoryManager = system.newLocalRepositoryManager( session, localRepo );

  //session.setTransferListener( new ConsoleTransferListener() );
  //session.setRepositoryListener( new ConsoleRepositoryListener() );

  // uncomment to generate dirty trees
  // session.setDependencyGraphTransformer( null );

  return session;
}

function newRepositories(system, session) {
  var array = new java.util.ArrayList();
  array.add( newCentralRepository() );
  return array;
}

function newCentralRepository() {
  return new RemoteRepository.Builder( "central", "default", "http://central.maven.org/maven2/" ).build();
}

function Artifact(gav) {
  var parts = gav.split( ':' );

  if ( parts.length < 3 ) {
    gav = parts.join( ':' ) + ':[0,]';
  }
  this._artifact = new org.eclipse.aether.artifact.DefaultArtifact( gav );

  this.name = parts[0] + ':' + parts[1];
}

Artifact.prototype.versions = function() {

  var system = newRepositorySystem();
  var session = newRepositorySystemSession( system );

  var rangeRequest = new VersionRangeRequest();

  rangeRequest.artifact = this._artifact;
  rangeRequest.repositories = newRepositories( system, session );

  var rangeResult = system.resolveVersionRange( session, rangeRequest );

  var versions = rangeResult.getVersions();

  var v = [];

  var versionIter = versions.iterator();

  while ( versionIter.hasNext() ) {
    var each = versionIter.next();
    v.push( each );
  }

  return v;
}

module.exports.Artifact = Artifact;
