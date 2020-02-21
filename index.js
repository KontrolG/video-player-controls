"use strict";

const state = {};

const { elements } = videoView;

const playToggle = () => {
  if (state.video.isPaused()) play()
  else pause();
};

const play = () => {
  state.video.play();
  videoView.changeButton("play", "u");
}

const pause = () => {
  state.video.pause();
  videoView.changeButton("play", "P");
  changeUI();
}

const changeUI = () => {
  videoView.showControls();
  updateView();
}

const jump = (seconds) => {
  state.video.jump(seconds);
  /* Mostrar en la UI */
  if (Math.abs(seconds) >= 60) changeUI();  
}

const changeVolume = volume => {
  state.video.changeVolume(volume);
  /* Mostrar en la UI */
};

const changeSpeed = (rate) => {
  state.video.changePlaybackRate(rate);
  /* Mostrar en la UI */
}

const updateView = () => {
  videoView.updateTimer(state.video.getCurrentTime());
  videoView.updateProgress(state.video.getCurrentProgress());
}

const getCurrentSubtitle = currentTime => {
  return state.subtitles.find(
    ({timeLapse: {initialTime, finishTime}}) =>
      currentTime >= initialTime &&
      currentTime <= finishTime
  );
}

const updateSubtitle = () => {
  const currentTime = state.video.getCurrentTime();
  const currentSubtitle = getCurrentSubtitle(currentTime);
  if (currentSubtitle) videoView.showSubtitle(currentSubtitle.text);
  else videoView.hideSubtitle();
}

const updateUI = () => {
  if (state.video.getCurrentProgress() >= 100) videoView.changeButton("play", "r");
  if (state.video.canUpdate()) updateView();
  if (state.subtitles) updateSubtitle();
  
}

const getProgress = event => {
  const { x, width } = event.target.closest(".seeker").getBoundingClientRect();
  const percentage = (event.x - x) / width;
  return parseFloat(percentage.toPrecision(2));
};

const seekTo = e => {
  state.video.seekTo(getProgress(e));
  updateView();
}

const toggleFullscreen = e => {
  if (!videoView.isFullscreen()) videoView.enterFullscreen();
  else videoView.exitFullscreen();
};

const getShorcutString = ({ altKey, ctrlKey, shiftKey, code }) => {
  const keysPressed = [];
  if (ctrlKey) keysPressed.push("Control");
  if (shiftKey) keysPressed.push("Shift");
  if (altKey) keysPressed.push("Alt");
  keysPressed.push(code);
  return keysPressed.join(" + ");
};

const getURI = () => {
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  return params.get("watch");
};

const loadVideo = async URI => {
  videoView.renderLoader();
  state.video = await new VideoFrame(`video/${URI}`);
  state.subtitles = state.video.subtitles;
  videoView.clearLoader();
};

const showVideo = () => {
  videoView.renderVideo(state.video.media, state.video.getDurationTime());
  videoView.showControls();
};

elements.player.addEventListener("mousemove", videoView.showControls);
elements.play.addEventListener("click", playToggle);
elements.seeker.addEventListener("click", seekTo);
elements.fullScreenToggle.addEventListener("click", toggleFullscreen);

window.addEventListener("webkitfullscreenchange", e => {
  if (!videoView.isFullscreen()) videoView.exitFullscreen();
});

window.addEventListener("keydown", e => {
  const shortcutString = getShorcutString(e);
  if (shortcuts[shortcutString]) shortcuts[shortcutString]();
  e.preventDefault();
})

window.addEventListener("mousewheel", e => {
  e.preventDefault();
  if (e.deltaY < 0) changeVolume(0.1);
  else changeVolume(-0.1);
})

/* Usar hashchange para cambiar el video. */
window.addEventListener("load", async e => {
  const URI = getURI();
  try {
    await loadVideo(URI);
    showVideo();
    state.video.onCurrentTimeChange(updateUI);
  } catch (error) {
    console.log(error);
  }
})

const shortcuts = {
  "Space": playToggle,
  ArrowLeft: () => jump(-5),
  ArrowRight: () => jump(5),
  ArrowUp: () => changeVolume(0.1),
  ArrowDown: () => changeVolume(-0.1),
  "Control + ArrowLeft": () => jump(-60),
  "Control + ArrowRight": () => jump(60),
  "Control + ArrowUp": () => changeVolume(0.5),
  "Control + ArrowDown": () => changeVolume(-0.5),
  "F11": toggleFullscreen,
  "KeyZ": () => changeSpeed(-0.25),
  "Alt + KeyZ": () => changeSpeed(-0.1),
  "KeyX": () => changeSpeed(),
  "KeyC": () => changeSpeed(0.25),
  "Alt + KeyC": () => changeSpeed(0.1),
};