class VideoFrame {
  constructor(url) {
    return new Promise(resolve => {
      this.media = document.createElement("video");
      const source = document.createElement("source");
      source.setAttribute("src", `video/${url}`);
      this.media.appendChild(source);
      const interval = setInterval(() => {
        if (this.media.readyState === 4) {
          clearInterval(interval);
          this.media.setAttribute("width", 800);
          this.media.setAttribute("height", 480);
          resolve(this);
        }
      }, 10);
    });
  }

  /* reduceResolution() {
    const { videoHeight, videoWidth } = this.media;
    const relation = videoWidth / videoHeight;
    return [800, 480];
  } */

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
    console.log(this.media.currentTime);
  }

  onCurrentTimeChange(callback) {
    this.media.addEventListener("timeupdate", callback);
  }

  canUpdate() {
    if (Math.floor(this.media.currentTime) > this.temporalCurrent) {
      this.temporalCurrent = this.media.currentTime;
      return true;
    }
    return false;
  }

  getCurrentProgress () {
    return Math.floor((this.getCurrentTime() / this.getDurationTime()) * 100);
  }
}