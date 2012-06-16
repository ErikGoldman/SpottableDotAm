var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var Playlist = models.Playlist;

var LocalQueue = function (uri) {
  this.iPos = 0;

  this.pl = Playlist.fromURI(uri);

  this.pl.observe(models.EVENT.CHANGE, _.bind(this.onLocalQueueChange, this));
  console.log("Loaded " + this.pl.name);
};

LocalQueue.prototype.onLocalQueueChange = function () {
  console.log("Changed " + this.pl.name);
};

LocalQueue.prototype.popSong = function () {
  try {
    var track = this.pl.get(this.iPos);
    return track;
  } catch (err) {
    return null;
  }
};

exports.LocalQueue = LocalQueue;