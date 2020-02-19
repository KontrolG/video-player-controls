"use strict";

class VideoFrame {
  constructor(url) {
    return new Promise(resolve => {
      this.media = document.createElement("video");
      const source = document.createElement("source");
      source.setAttribute("src", `video/${url}`);
      this.media.appendChild(source);
      this.media.setAttribute("preload", "metadata");
      this.setupSubtitles(`video/${url}`.replace(".mp4", ".srt"));
      /* this.media.setAttribute("poster", "video/10 Steps to Master Javascript within 15 Months.jpg"); */
      /* canPlayType() */
      const interval = setInterval(() => {
        if (this.media.readyState === 4 /* && this.subtitles */) {
          console.log(this.media.duration)
          clearInterval(interval);
          resolve(this);
        }
      }, 10);
    });
  }

  /* isFullscreen() {
    return this.fullscreen || document.webkitFullscreenEnabled;
  } */

  /* toggleFullscreen() {
    if (this.media.webkitRequestFullscreen)
      this.media.webkitRequestFullscreen();
    this.media.controls = false;
    this.fullscreen = !this.fullscreen;
  } */

  changeSize(width, height) {
    this.media.setAttribute("width", width);
    this.media.setAttribute("height", height);
  }

  isPaused() {
    return this.media.paused || this.media.ended;
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

  jump(seconds) {
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

  getCurrentProgress() {
    return Math.floor((this.getCurrentTime() / this.getDurationTime()) * 100);
  }

  seekTo(progress) {
    const seconds = this.getDurationTime() * progress - this.media.currentTime;
    this.jump(seconds);
  }

  changePlaybackRate(rate = 1 - this.media.playbackRate) {
    const newRate = this.media.playbackRate + rate;
    if (newRate >= 0 && newRate < 16.25) this.media.playbackRate = newRate;
  }

  changeVolume(volume = 1 - this.media.volume) {
    const newVolume = this.media.volume + volume;
    if (newVolume >= 0 && newVolume <= 1) this.media.volume = newVolume;
  }

  /* Procesamiento de subtitulos */

  async getSubtitles (url) {
    /* manejar cuando no haya subtitulos */
    const response = await fetch(url);
    return await response.text();
  }

  splitTimeLapse(timeLapseString) {
    const [initialTime, finishTime] = timeLapseString.split(" --> ");
    return { initialTime, finishTime };
  }

  parseTimeStringToSeconds(timeString) {
   const [hoursString, minutesString, secondsString] = timeString.split(":");
   const seconds = parseFloat(secondsString.replace(",", "."));
   const minutes = parseInt(minutesString, 10);
   const hours = parseInt(hoursString, 10);
   return hours * 3600 + minutes * 60 + seconds;    
  }

  getTimes(timeLapseString) {
    const [initialTimeString, finishTimeString] = timeLapseString.split(" --> ");
    const [initialTime, finishTime] = [initialTimeString, finishTimeString].map(
      this.parseTimeStringToSeconds
    );
    return { initialTime, finishTime };
  }

  async setupSubtitles (url) {
    const subRipContent = await this.getSubtitles(url);
    const subtitles = subRipContent.split("\n\n").map((entry) => {
      if (entry.trim() !== "") {
        const [, timeLapseString, text] = entry.split("\n");
        const timeLapse = this.getTimes(timeLapseString);
        return { timeLapse, text };
      }
  });

    this.subtitles = subtitles;
  }
}