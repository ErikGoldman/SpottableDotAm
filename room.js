var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');

var Room = function (onLoaded, rid) {
  this.lidPeople = [];
  this.uCurrTrack = "";
  this.idCurrPerson = null;

  this.idSelf = models.session.anonymousUserID;

  if (!rid) {
    this.getNewRoom(onLoaded);
  } else {
    this.connectToRoom(rid, onLoaded);
  }
};

Room.prototype = new models.Observable();

Room.prototype.isOwnTurn = function () {
  return this.idCurrPerson === this.idSelf;
};

Room.prototype.getNewRoom = function (onRoomLoaded) {
  // TODO: do a remote call or whatever
  this.rid = 1;
  onRoomLoaded();
};

Room.prototype.connectToRoom = function (rid, onRoomLoaded) {
  this.rid = rid;

  // TODO: do a remote call for our rid
  onRoomLoaded();
};

Room.prototype.onSongChange = function (data) {
  var onLoaded = _.bind(function (track) {
    this.notify(Room.SONG_CHANGE, track);
  }, this);

  models.Track.fromURI(data.uTrack, onLoaded);
};

Room.prototype.onTurnChange = function (data) {
  this.idCurrPerson = data.idCurrPerson;
  if (this.isOwnTurn()) {
    this.notify(Room.OUR_TURN);
  }
  this.notify(Room.TURN_CHANGE, data.userData);
};

Room.OUR_TURN = "ourTurn";
Room.TURN_CHANGE= "TurnChange";
Room.SONG_CHANGE= "SongChange";

exports.Room = Room;