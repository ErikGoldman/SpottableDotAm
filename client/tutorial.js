var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var Controller = sp.require('controller').Controller;
var Room = sp.require('room').Room;

exports.init = init;

var controller = new Controller();

var PLAYLIST_KEY = "uPlaylist";

function init() {

  var uStoredPlaylist = localStorage[PLAYLIST_KEY];
  if (uStoredPlaylist) {
    onPlaylistLoaded(uStoredPlaylist);
  }

  var drop = document.querySelector('#friend-drop');
  drop.addEventListener('dragenter', handleDragEnter, false);
  drop.addEventListener('dragover', handleDragOver, false);
  drop.addEventListener('dragleave', handleDragLeave, false);
  drop.addEventListener('drop', handleDrop, false);

  function handleDragEnter(e) {
    this.style.background = '#444444';
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
    return false;
  }

  function handleDragLeave(e) {
    this.style.background = '#333333';
  }
  function handleDrop(e) {
    this.style.background = '#333333';
    var uri = e.dataTransfer.getData('Text');
    onPlaylistLoaded(uri);
  }

  /*
	player.observe(models.EVENT.CHANGE, function (e) {

		// Only update the page if the track changed
		if (e.data.curtrack == true) {
			updatePageWithTrackDetails();
		}
	});
	*/
}

function onPlaylistLoaded(uri) {
  localStorage[PLAYLIST_KEY] = uri;
  controller.setQueuePlaylist(uri);
  Room.MakeNew(onNewRoom);
}

function onNewRoom(rid) {
  controller.connectToRoom(rid);
}

exports.controller = controller;
