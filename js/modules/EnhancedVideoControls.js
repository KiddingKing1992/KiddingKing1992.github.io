// 增强视频控制模块
// 提供暂停/继续、倍速播放、进度条控制功能

class EnhancedVideoControls {
    constructor() {
        this.currentVideo = null;
        this.speeds = [1, 1.5, 2];
        this.currentSpeedIndex = 0;
        this.isPaused = false;
        this.controls = {};
        this.eventHandlers = {};
    }
    
    // 设置视频控制
    setup(videoElement, options = {}) {
        this.currentVideo = videoElement;
        this.controls = {
            pauseBtn: options.pauseBtn || null,
            speedBtn: options.speedBtn || null,
            progressBar: options.progressBar || null,
            timeDisplay: options.timeDisplay || null
        };
        
        // 清理之前的事件监听
        this.cleanup();
        
        // 绑定暂停/继续按钮
        if (this.controls.pauseBtn) {
            this.eventHandlers.pauseClick = () => this.togglePause();
            this.controls.pauseBtn.addEventListener('click', this.eventHandlers.pauseClick);
            this._updatePauseButton();
        }
        
        // 绑定倍速按钮
        if (this.controls.speedBtn) {
            this.eventHandlers.speedClick = () => this.cycleSpeed();
            this.controls.speedBtn.addEventListener('click', this.eventHandlers.speedClick);
            this._updateSpeedButton();
        }
        
        // 绑定进度条
        if (this.controls.progressBar) {
            this.eventHandlers.progressInput = (e) => {
                if (this.currentVideo && this.currentVideo.duration) {
                    this.currentVideo.currentTime = (e.target.value / 100) * this.currentVideo.duration;
                }
            };
            this.controls.progressBar.addEventListener('input', this.eventHandlers.progressInput);
            
            // 更新进度条
            this.eventHandlers.timeUpdate = () => this._updateProgress();
            videoElement.addEventListener('timeupdate', this.eventHandlers.timeUpdate);
        }
        
        // 视频结束时重置
        this.eventHandlers.videoEnded = () => this.reset();
        videoElement.addEventListener('ended', this.eventHandlers.videoEnded);
        
        return this;
    }
    
    // 切换暂停/播放
    togglePause() {
        if (!this.currentVideo) return;
        
        if (this.currentVideo.paused) {
            this.currentVideo.play();
            this.isPaused = false;
        } else {
            this.currentVideo.pause();
            this.isPaused = true;
        }
        this._updatePauseButton();
    }
    
    // 暂停
    pause() {
        if (this.currentVideo && !this.currentVideo.paused) {
            this.currentVideo.pause();
            this.isPaused = true;
            this._updatePauseButton();
        }
    }
    
    // 播放
    play() {
        if (this.currentVideo && this.currentVideo.paused) {
            this.currentVideo.play();
            this.isPaused = false;
            this._updatePauseButton();
        }
    }
    
    // 循环切换倍速
    cycleSpeed() {
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speeds.length;
        if (this.currentVideo) {
            this.currentVideo.playbackRate = this.speeds[this.currentSpeedIndex];
        }
        this._updateSpeedButton();
    }
    
    // 设置指定倍速
    setSpeed(speed) {
        const index = this.speeds.indexOf(speed);
        if (index !== -1) {
            this.currentSpeedIndex = index;
            if (this.currentVideo) {
                this.currentVideo.playbackRate = speed;
            }
            this._updateSpeedButton();
        }
    }
    
    // 获取当前倍速
    getSpeed() {
        return this.speeds[this.currentSpeedIndex];
    }
    
    // 跳转到指定时间（秒）
    seekTo(seconds) {
        if (this.currentVideo) {
            this.currentVideo.currentTime = Math.max(0, Math.min(seconds, this.currentVideo.duration || 0));
        }
    }
    
    // 跳转到指定百分比
    seekToPercent(percent) {
        if (this.currentVideo && this.currentVideo.duration) {
            this.currentVideo.currentTime = (percent / 100) * this.currentVideo.duration;
        }
    }
    
    // 更新暂停按钮显示
    _updatePauseButton() {
        if (this.controls.pauseBtn) {
            this.controls.pauseBtn.textContent = this.isPaused ? '▶' : '⏸';
            this.controls.pauseBtn.title = this.isPaused ? '继续播放' : '暂停';
        }
    }
    
    // 更新倍速按钮显示
    _updateSpeedButton() {
        if (this.controls.speedBtn) {
            this.controls.speedBtn.textContent = `${this.speeds[this.currentSpeedIndex]}x`;
        }
    }
    
    // 更新进度条
    _updateProgress() {
        if (!this.currentVideo || !this.currentVideo.duration) return;
        
        const percent = (this.currentVideo.currentTime / this.currentVideo.duration) * 100;
        
        if (this.controls.progressBar) {
            this.controls.progressBar.value = percent;
        }
        
        if (this.controls.timeDisplay) {
            const current = this._formatTime(this.currentVideo.currentTime);
            const total = this._formatTime(this.currentVideo.duration);
            this.controls.timeDisplay.textContent = `${current} / ${total}`;
        }
    }
    
    // 格式化时间
    _formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 重置状态
    reset() {
        this.currentSpeedIndex = 0;
        this.isPaused = false;
        if (this.currentVideo) {
            this.currentVideo.playbackRate = 1;
        }
        this._updatePauseButton();
        this._updateSpeedButton();
    }
    
    // 清理事件监听
    cleanup() {
        if (this.controls.pauseBtn && this.eventHandlers.pauseClick) {
            this.controls.pauseBtn.removeEventListener('click', this.eventHandlers.pauseClick);
        }
        if (this.controls.speedBtn && this.eventHandlers.speedClick) {
            this.controls.speedBtn.removeEventListener('click', this.eventHandlers.speedClick);
        }
        if (this.controls.progressBar && this.eventHandlers.progressInput) {
            this.controls.progressBar.removeEventListener('input', this.eventHandlers.progressInput);
        }
        if (this.currentVideo) {
            if (this.eventHandlers.timeUpdate) {
                this.currentVideo.removeEventListener('timeupdate', this.eventHandlers.timeUpdate);
            }
            if (this.eventHandlers.videoEnded) {
                this.currentVideo.removeEventListener('ended', this.eventHandlers.videoEnded);
            }
        }
        this.eventHandlers = {};
    }
    
    // 完全销毁
    destroy() {
        this.cleanup();
        this.currentVideo = null;
        this.controls = {};
    }
}

// 导出模块
window.EnhancedVideoControls = EnhancedVideoControls;
