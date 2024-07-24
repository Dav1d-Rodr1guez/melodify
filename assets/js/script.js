'use strict';

/**
 * All music information
 */

const musicData = [
  {
    posterUrl: "Assets/images/classy101.png",
    title: "Classy 101",
    album: "",
    year: 2023,
    artist: "Feid YoungMiko",
    musicPath: "Assets/music/FeidYoungMikoClassy101.mp3",
  },
  {
    posterUrl: "Assets/images/gran varon.jpg",
    title: "El Gran varon",
    album: "Top Secrets",
    year: 1989,
    artist: "Willie Colón",
    musicPath: "Assets/music/WillieColónElGranVarón.mp3",
  },
  {
    posterUrl: "Assets/images/coffeling prole.jpg",
    title: "La Prolé",
    album: "",
    year: 2015,
    artist: "Coffeling prole",
    musicPath: "Assets/music/coffelingprleLaprolé.mp3",
  },
  {
    posterUrl: "Assets/images/comprendes mendez.jpg",
    title: "Comprendes mendez",
    album: "El sabor del control",
    year: 1997,
    artist: "control machete",
    musicPath: "Assets/music/ControlMacheteComprendesMendes.mp3",
  },
  {
    posterUrl: "Assets/images/kyoto.jpg",
    title: "Kyoto",
    album: "",
    year: 2023,
    artist: "Omar Courtz, De la Rose",
    musicPath: "Assets/music/OmarCourtzxDeLaRosexHazeKyoto.mp3",
  },
  {
    posterUrl: "Assets/images/los tigres del norte.jpg",
    title: "La mesa del rincon",
    album: "",
    year: 1994,
    artist: "Los tigres del norte",
    musicPath: "Assets/music/LosTigresDelNorteLaMesaDelRincón.mp3",
  },
  {
    posterUrl: "Assets/images/molotov puto.jpg",
    title: "Puto",
    album: "¿Donde jugaran las niñas?",
    year: 1997,
    artist: "Molotov",
    musicPath: "Assets/music/MolotovPuto.mp3",
  },
  {
    posterUrl: "Assets/images/secreto de amor.jpg",
    title: "secreto de amor",
    album: "",
    year: 2000,
    artist: "aoan Sebastian",
    musicPath: "Assets/music/JohanSebastianSecretoDeAmor.mp3",
  }
];

/**
 * Add eventListener on all elements that are passed
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * Playlist
 * 
 * Add all music in playlist from 'musicData'
 */

const playlist = document.querySelector("[data-music-list]");

for (let i = 0, len = musicData.length; i < len; i++) {
  playlist.innerHTML += `
  <li>
    <button class="music-item ${i === 0 ? "playing" : ""}" data-playlist-toggler data-playlist-item="${i}">
      <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title} Album Poster" class="img-cover">
      <div class="item-icon">
        <span class="material-symbols-rounded">equalizer</span>
      </div>
    </button>
  </li>
  `;
}

/**
 * Playlist Modal Sidebar Toggle
 * 
 * Show 'playlist' modal sidebar when click on playlist button in top app bar
 * and hide when click on overlay or any playlist-item
 */

const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggler]");
const overlay = document.querySelector("[data-overlay]");

const togglePlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};

addEventOnElements(playlistTogglers, "click", togglePlaylist);

/**
 * Playlist Item
 * 
 * Remove active state from last time played music
 * and add active state in clicked music
 */

const playlistItems = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItems[lastPlayedMusic].classList.remove("playing");
  playlistItems[currentMusic].classList.add("playing");
};

addEventOnElements(playlistItems, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();
});

/**
 * Player
 * 
 * Change all visual information on player, based on current music
 */

const playerBanner = document.querySelector("[data-player-banner]");
const playerTitle = document.querySelector("[data-title]");
const playerAlbum = document.querySelector("[data-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerInfo = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.alt = `${musicData[currentMusic].title} Album Poster`;
  playerTitle.textContent = musicData[currentMusic].title;
  playerAlbum.textContent = musicData[currentMusic].album;
  playerYear.textContent = musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playMusic();
};

addEventOnElements(playlistItems, "click", changePlayerInfo);

/**
 * Update player duration
 */

const getTimecode = function (duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.ceil(duration - (minutes * 60));
  const timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timecode;
};

const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
};

audioSource.addEventListener("loadeddata", updateDuration);

/**
 * Play Music
 * 
 * Play and pause music when click on play button
 */

const playBtn = document.querySelector("[data-play-btn]");

let playInterval;

const playMusic = function () {
  if (audioSource.paused) {
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};

playBtn.addEventListener("click", playMusic);

/**
 * Update running time while playing music
 */

const playerRunningTime = document.querySelector("[data-running-time]");

const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
};

/**
 * Range fill width
 * 
 * Change 'rangeFill' width while changing range value
 */

const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
};

addEventOnElements(ranges, "input", updateRangeFill);

/**
 * Seek music
 * 
 * Seek music while changing player seek range
 */

const seek = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
};

playerSeekRange.addEventListener("input", seek);

/**
 * End music
 */

const isMusicEnd = function () {
  if (audioSource.ended) {
    playBtn.classList.remove("active");
    audioSource.currentTime = 0;
    playerSeekRange.value = audioSource.currentTime;
    playerRunningTime.textContent = getTimecode(audioSource.currentTime);
    updateRangeFill();
  }
};

/**
 * Skip to next music
 */

const playerSkipNextBtn = document.querySelector("[data-skip-next]");

const skipNext = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic >= musicData.length - 1 ? (currentMusic = 0) : currentMusic++;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipNextBtn.addEventListener("click", skipNext);

/**
 * Skip to previous music
 */

const playerSkipPrevBtn = document.querySelector("[data-skip-prev]");

const skipPrev = function () {
  lastPlayedMusic = currentMusic;

  if (isShuffled) {
    shuffleMusic();
  } else {
    currentMusic <= 0 ? (currentMusic = musicData.length - 1) : currentMusic--;
  }

  changePlayerInfo();
  changePlaylistItem();
};

playerSkipPrevBtn.addEventListener("click", skipPrev);

/**
 * Shuffle music
 */

const getRandomMusic = () => Math.floor(Math.random() * musicData.length);

const shuffleMusic = () => (currentMusic = getRandomMusic());

const playerShuffleBtn = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffle = function () {
  playerShuffleBtn.classList.toggle("active");

  isShuffled = !isShuffled;
};

playerShuffleBtn.addEventListener("click", shuffle);

/**
 * Repeat music
 */

const playerRepeatBtn = document.querySelector("[data-repeat]");

const repeat = function () {
  audioSource.loop = !audioSource.loop;
  this.classList.toggle("active");
};

playerRepeatBtn.addEventListener("click", repeat);

/**
 * Music volume
 * 
 * Increase or decrease music volume when change the volume range
 */

const playerVolumeRange = document.querySelector("[data-volume]");
const playerVolumeBtn = document.querySelector("[data-volume-btn]");

const changeVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  audioSource.muted = false;

  if (audioSource.volume <= 0.1) {
    playerVolumeBtn.children[0].textContent = "volume_mute";
  } else if (audioSource.volume <= 0.5) {
    playerVolumeBtn.children[0].textContent = "volume_down";
  } else {
    playerVolumeBtn.children[0].textContent = "volume_up";
  }
};

playerVolumeRange.addEventListener("input", changeVolume);

/**
 * Mute music
 */

const muteVolume = function () {
  audioSource.muted = !audioSource.muted;
  playerVolumeBtn.children[0].textContent = audioSource.muted ? "volume_off" : "volume_up";
};

playerVolumeBtn.addEventListener("click", muteVolume);

