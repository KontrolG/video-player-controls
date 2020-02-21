"use strict";

const videoView = (() => {
  const $ = selector => {
    const elements = document.querySelectorAll(selector);
    return elements.length > 1 ? elements : elements[0];
  }

  const elements = {
    player: $(".player"),
    controls: $(".controls"),
    play: $(".play"),
    duration: $(".duration"),
    currentTime: $(".current-time"),
    seeker: $(".seeker"),
    progress: $(".progress"),
    fullScreenToggle: $(".full-screen-toggle"),
    subtitles: $(".subtitles")
  };

  const elementsStrings = {
    loader: "loader"
  };

  const parseSeconds = seconds => {
    seconds = Math.floor(seconds);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours) minutes = minutes % 60;
    if (minutes < 10) minutes = `0${minutes}`;
    seconds = seconds % 60;
    if (seconds < 10) seconds = `0${seconds}`;
    return hours ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
  }

  return {
    renderVideo(element, duration) {
      elements.player.insertAdjacentElement("afterBegin", element);
      elements.duration.textContent = parseSeconds(duration);
    },
    updateTimer(duration) {
      elements.currentTime.textContent = parseSeconds(duration);
    },
    updateProgress(progress) {
      elements.progress.style.width = `${progress + 1}%`;
    },
    changeButton(button, icon) {
      elements[button].setAttribute("data-icon", icon);
    },
    renderLoader() {
      const markup = `<p class="${elementsStrings.loader}">Cargando...</p>`;
      elements.player.insertAdjacentHTML("afterBegin", markup);
    },
    clearLoader() {
      const loader = $(`.${elementsStrings.loader}`);
      elements.player.removeChild(loader);
    },
    showControls() {
      elements.controls.classList.remove("loading");
      elements.controls.classList.add("show");
      setTimeout(() => {
        elements.controls.classList.remove("show");
      }, 2000);
    },
    isFullscreen() {
      return document.webkitFullscreenElement || document.webkitIsFullScreen;
    },
    enterFullscreen() {
      elements.player.classList.add("full-screen");
      setTimeout(() => {
        elements.player.webkitRequestFullScreen();
      }, 500);
      videoView.changeButton("fullScreenToggle", "m");
    },
    exitFullscreen() {
      document.webkitExitFullscreen();
      setTimeout(() => {
        elements.player.classList.remove("full-screen");
      }, 100);
      videoView.changeButton("fullScreenToggle", "M");
    },
    showSubtitle(text) {
      if(elements.subtitles.innerHTML !== text) elements.subtitles.innerHTML = text;
      elements.subtitles.classList.add("show");
    },
    hideSubtitle() {
      elements.subtitles.innerHTML = "";
      elements.subtitles.classList.remove("show");
    },

    elements,
    parseSeconds
  };
})()