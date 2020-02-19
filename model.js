class VideoFrame {
  constructor(url) {
    return new Promise(resolve => {
      this.media = document.createElement("video");
      const source = document.createElement("source");
      source.setAttribute("src", `video/${url}`);
      this.media.appendChild(source);
      this.fullscreen = false;
      const interval = setInterval(() => {
        if (this.media.readyState === 4) {
          clearInterval(interval);
          resolve(this);
        }
      }, 10);
    });
  }

  isFullscreen() {
    return this.fullscreen || document.webkitFullscreenEnabled;
  }

  toggleFullscreen() {
    if (this.media.webkitRequestFullscreen) this.media.webkitRequestFullscreen()
    this.media.controls = false;
    this.fullscreen = !this.fullscreen;
  }

  changeSize(width, height) {
    this.media.setAttribute("width", width);
    this.media.setAttribute("height", height);
  }

  loadVideo () {
    return new Promise()
  }

  isPaused() {
    return this.media.paused;
  }

  play() {
    this.temporalCurrent = 0;
    this.media.play();
  }

  pause() {
    this.media.pause();
  }

  getCurrentTime() {
    return this.media.currentTime;
  }

  getDurationTime() {
    return this.media.duration;
  }

  jump (seconds) {
    this.media.currentTime += seconds;
    this.updateTemporalCurrent();    
  }

  updateTemporalCurrent() {
    this.temporalCurrent = Math.floor(this.media.currentTime);
  }

  onCurrentTimeChange(callback) {
    this.media.addEventListener("timeupdate", callback);
  }

  canUpdate() {
    if (Math.floor(this.media.currentTime) > this.temporalCurrent) {
      this.updateTemporalCurrent();
      return true;
    }
    return false;
  }

  getCurrentProgress () {
    return Math.floor((this.getCurrentTime() / this.getDurationTime()) * 100);
  }

  seekTo(progress) {
    const seconds = this.getDurationTime() * progress - this.media.currentTime;
    this.jump(seconds);
  }

  changePlaybackRate(rate = 1 - this.media.playbackRate) {
    this.media.playbackRate += rate;
  }
}