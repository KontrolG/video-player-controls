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
    progress: $(".progress")
  };

  const elementsStrings = {
    loader: "loader"
  };

  const parseSeconds = seconds => {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    if (minutes) seconds = seconds % 60;
    if (seconds < 10) seconds = `0${seconds}`;
    return minutes ? `${minutes}:${seconds}` : `0:${seconds}`
  }

  return {
    render(element, duration) {
      elements.player.insertAdjacentElement("afterBegin", element);
      elements.duration.textContent = parseSeconds(duration);      
    },
    updateTimer(duration) {
      elements.currentTime.textContent = parseSeconds(duration);
    },
    updateProgress(progress) {
      elements.progress.style.width = `${progress + 1}%`;
    },
    changeButton(icon) {
      elements.play.setAttribute("data-icon", icon);
    },
    renderLoader() {
      const markup = `<p class="${elementsStrings.loader}">Cargando...</p>`
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

    elements
  }
})()