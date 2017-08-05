var setSong = function(songNumber) {
    if (currentSoundFile) {
        currrentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // Assign a new Buzz sound object
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });

    setVolume(currentVolume);
};

var setVolume = function(volme) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number [data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    var $row = $(template);

var clickHandler = function() {

        var songNumber = parseInt($(this).attr('data-song-number'));

	    if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

        currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	   }

	    if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
            setSong(songNumber);
            currentSoundFile.play();
            $(this).html(pauseButtonTemplate);
		    updatePlayerBarSong();

        } else if (currentlyPlayingSongNumber === songNumber) {
                if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
        } else {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
            }
	    }
   };

var onHover = function(event) {
    var songNumberCell = parseInt($(this).find('.song-item-number'));
    var songNumber = parseInt($(this).attr('.data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
    }
};

var offHover = function(event) {
    var songNumberCell = parseInt($(this).find('.song-item-number'));
    var songNumber = parseInt($(this).attr('.data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
           songNumberCell.html(songNumber);
    }
};

    $row.find('.song-item-number').click(clickHandler);

    $row.hover(onHover, offHover);

    return $row;
};

//set current album
var setCurrentAlbum = function(album) {
     // #1
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');


     // #2
     /*
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
     */
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);



     // #3
     $albumSongList.empty();

     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var updatePlayerBarSong = function() {
     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
 };

 var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    getSong(currentSongIndex + 1);

    currentSoundFile.play();

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    getSong(currentSongIndex + 1);

    currentSoundFile.play();

    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};



 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 // Store state of playing songs

 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
