const state = {};

const { elements } = videoView;

const playToggle = () => {
  if (state.video.isPaused()) {
    state.video.play();
    videoView.changeButton("play", "u");
  } else {
    state.video.pause();
    videoView.changeButton("play", "P");
    changeUI();
  }
};

const changeUI = () => {
  videoView.showControls();
  updateView();
}

const jump = (seconds) => {
  state.video.jump(seconds);
  if (Math.abs(seconds) >= 60) changeUI();  
}

const updateView = () => {
  videoView.updateTimer(state.video.getCurrentTime());
  videoView.updateProgress(state.video.getCurrentProgress());
}

const updateUI = () => {
  if (state.video.getCurrentProgress() >= 100) videoView.changeButton("r");
  if (state.video.canUpdate()) {
    updateView();
  }
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

elements.player.addEventListener("mousemove", videoView.showControls);
elements.play.addEventListener("click", playToggle);
elements.seeker.addEventListener("click", seekTo);
elements.fullScreenToggle.addEventListener("click", e => {
  if(!videoView.isFullscreen()) {
    videoView.enterFullscreen();
    videoView.changeButton("fullScreenToggle", "m");
  } else {
    videoView.exitFullscreen();
    videoView.changeButton("fullScreenToggle", "M");
  }
});

window.addEventListener("keydown", e => {
  if (shortcuts.isAlternator(e.code)) state.keyDown = e.code;
})

window.addEventListener("keyup", e => {
  console.log(e.code);
  if (shortcuts.isAlternator(e.code)) state.keyDown = "";
  else if (state.keyDown) shortcuts[`${state.keyDown} + ${e.code}`]();
  else if (shortcuts[e.code]) shortcuts[e.code]();
})


/* Usar hashchange para cambiar el video. */
window.addEventListener("load", async e => {
  try {
    videoView.renderLoader();
    state.video = await new VideoFrame(
      "Front End Web Developer Guide 2020.mp4"
    );
    videoView.clearLoader();
    videoView.render(state.video.media, state.video.getDurationTime());
    videoView.showControls();
    state.video.onCurrentTimeChange(updateUI);
  } catch (error) {
    console.log(error);
    
  }
})

const shortcuts = {
  alternators: ["ControlLeft"],
  isAlternator: function (code) {return this.alternators.includes(code)}, 
  "Space": playToggle,
  ArrowLeft: () => jump(-5),
  ArrowRight: () => jump(5),
  "ControlLeft + ArrowLeft": () => jump(-60),
  "ControlLeft + ArrowRight": () => jump(60)
};