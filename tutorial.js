var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var Controller = sp.require('controller').Controller;

exports.init = init;

var controller = new Controller();

function init() {

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
    controller.connectToRoom(uri);
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

exports.controller = controller;
