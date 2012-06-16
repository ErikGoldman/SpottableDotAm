var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var Room = sp.require('room').Room;
var LocalQueue = sp.require('localqueue').LocalQueue;

var Controller = function () {
  this.lq = null;
  this.room = null;
};

Controller.prototype.setQueuePlaylist = function (queueUri) {
  this.lq   = new LocalQueue(queueUri);
};

Controller.prototype.connectToRoom = function (rid) {
  this.room = new Room(_.bind(this.onRoomLoaded, this), rid);
  this.isPlaying = false;
  this.currentTrack = null;

  this.room.observe(Room.OUR_TURN, _.bind(this.onOurTurn, this));
  this.room.observe(Room.TURN_CHANGE, _.bind(this.onTurnChange, this));
  this.room.observe(Room.SONG_CHANGE, _.bind(this.onSongChange, this));
};

Controller.prototype.onRoomLoaded = function () {
  console.log("Room loaded");
  models.player.observe(models.EVENT.CHANGE, _.bind(this.onPlayerChange,  this));
};

Controller.prototype.onPlayerChange = function (e) {
  console.log("OnPlayerChange");
  var p = models.player;

  if (!p.playing && this.isPlaying) {
    // if the queued song stopped playing
    console.log("Stopped playing our track");
    this.isPlaying = false;
    this.onLocalSongEnd();
  } else if (this.currentTrack && p.playing && !this.isPlaying) {
    // if we're playing the selected track
    this.isPlaying = true;
    console.log("Playing our track");
  }
};

Controller.prototype.onTurnChange = function (userData) {
  console.log("User changed to " + userData);
};

Controller.prototype.onSongChange = function (oTrack) {
  this.currentTrack = oTrack;
  this.isPlaying = false;
  models.player.play(oTrack);
};

Controller.prototype.onOurTurn = function () {
  var track = this.lq.popSong();
  this.sendNextTrack(track);
};

Controller.prototype.onLocalSongEnd = function () {
  // tell the server that the song is over
  console.log("Local song done");
};

Controller.prototype.sendNextTrack = function (track) {
  var uri = null;
  if (track && track.data) {
    uri = track.data.uri;
  }

  console.log("Sending track to server: " + uri);
  /*
  var req = new XMLHttpRequest();
  req.open("GET", "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=" + city + "&api_key=YOUR_KEY_HERE", true);
  req.onreadystatechange = function() {

    console.log(req.status);

      if (req.readyState == 4) {
        if (req.status == 200) {
            console.log("Search complete!");
            console.log(req.responseText);
        }
      }
    };

  req.send();
  */
};

exports.Controller = Controller;