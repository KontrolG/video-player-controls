"use strict";

class VideoFrame {
  constructor(sourceUrl) {
    return new Promise(resolve => {
      this.media = this.createVideoElement(sourceUrl);
      this.setupSubtitles(sourceUrl);
      const interval = setInterval(() => {
        if (this.media.readyState === 4) {
          clearInterval(interval);
          resolve(this);
        }
      }, 10);
    });
  }

  createVideoElement(sourceUrl) {
    /* this.media.setAttribute("poster", "video/10 Steps to Master Javascript within 15 Months.jpg"); */
      /* canPlayType() */
    const video = document.createElement("video");
    const source = document.createElement("source");
    source.setAttribute("src", sourceUrl);
    video.setAttribute("preload", "metadata");
    video.appendChild(source);
    return video;
  }

  changeSize(width, height) {
    this.media.setAttribute("width", width);
    this.media.setAttribute("height", height);
  }

  isPaused() {
    return this.media.paused || this.media.ended;
  }

  play() {
    this.temporalCurrentTime = 0;
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
    this.updatetemporalCurrentTime();
  }

  updateTemporalCurrentTime() {
    this.temporalCurrentTime = Math.floor(this.media.currentTime);
  }

  onCurrentTimeChange(callback) {
    this.media.addEventListener("timeupdate", callback);
  }

  canUpdate() {
    if (Math.floor(this.getCurrentTime()) > this.temporalCurrentTime) {
      this.updateTemporalCurrentTime();
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
    const filename = url.slice(0, -4);
    const response = await fetch(`${filename}.srt`);
    return response.status === 200 ? await response.text() : undefined;
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

  processSubtitles(subRipContent) {
    const subtitles = subRipContent.split("\n\n").map(entry => {
      if (entry.trim() !== "") {
        const [, timeLapseString, text] = entry.split("\n");
        const timeLapse = this.getTimes(timeLapseString);
        return { timeLapse, text };
      }
    });
    return subtitles.filter(subtitle => subtitle !== undefined);
  }

  async setupSubtitles (url) {
    const subRipContent = await this.getSubtitles(url);
    if (subRipContent) this.subtitles =  this.processSubtitles(subRipContent);
  }
}