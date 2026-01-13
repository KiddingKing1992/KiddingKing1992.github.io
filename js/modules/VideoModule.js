// 视频模块 - 统一所有视频播放功能
class VideoModule {
    constructor() {
        this.currentVideo = null;
        this.isPlaying = false; // 防止重复播放
        this.currentHandlers = {}; // 保存当前事件处理器
        this.videoControls = null; // 增强视频控制实例
        this.currentSceneId = null; // 当前场景ID（用于一周目保护）
    }
    
    // 统一的视频播放
    async playVideo(videoConfig) {
        const { 
            videoElement, 
            skipButton, 
            audioEnabled = false,
            onEnd = null,
            controlsId = null,  // 视频控制容器ID
            pauseBtnId = null,  // 暂停按钮ID
            speedBtnId = null,  // 倍速按钮ID
            sceneId = null      // 场景ID（用于一周目保护）
        } = videoConfig;
        
        // 保存场景ID
        this.currentSceneId = sceneId;
        
        // 防止重复播放
        if (this.isPlaying && this.currentVideo === videoElement) {
            return;
        }
        
        // 清除之前的事件监听器
        if (this.currentVideo && this.currentHandlers.handleEnd) {
            this.currentVideo.removeEventListener('ended', this.currentHandlers.handleEnd);
        }
        if (this.currentHandlers.skipButton && this.currentHandlers.skipHandler) {
            this.currentHandlers.skipButton.removeEventListener('click', this.currentHandlers.skipHandler);
        }
        
        // 清理之前的视频控制
        if (this.videoControls) {
            this.videoControls.cleanup();
        }
        
        this.currentVideo = videoElement;
        this.isPlaying = true;
        
        return new Promise((resolve) => {
            // 设置视频
            videoElement.muted = !audioEnabled;
            videoElement.currentTime = 0;
            
            // 确保跳过按钮初始隐藏
            if (skipButton) {
                skipButton.classList.remove('show');
            }
            
            // 获取视频控制元素
            const controlsContainer = controlsId ? document.getElementById(controlsId) : null;
            const pauseBtn = pauseBtnId ? document.getElementById(pauseBtnId) : null;
            const speedBtn = speedBtnId ? document.getElementById(speedBtnId) : null;
            
            // 确保控制容器初始隐藏
            if (controlsContainer) {
                controlsContainer.classList.remove('show');
            }
            
            // 设置增强视频控制
            if (window.EnhancedVideoControls && pauseBtn) {
                this.videoControls = new EnhancedVideoControls();
                this.videoControls.setup(videoElement, {
                    pauseBtn: pauseBtn,
                    speedBtn: speedBtn
                });
            }
            
            // 标记是否已经结束，防止重复触发
            let hasEnded = false;
            
            // 结束处理函数
            const handleEnd = () => {
                if (hasEnded) return; // 防止重复触发
                hasEnded = true;
                this.isPlaying = false;
                
                if (skipButton) {
                    skipButton.classList.remove('show');
                }
                if (controlsContainer) {
                    controlsContainer.classList.remove('show');
                }
                videoElement.removeEventListener('ended', handleEnd);
                if (skipButton) {
                    skipButton.removeEventListener('click', skipHandler);
                }
                
                // 清理视频控制
                if (this.videoControls) {
                    this.videoControls.cleanup();
                    this.videoControls = null;
                }
                
                // 清除保存的处理器引用
                this.currentHandlers = {};
                
                if (onEnd) onEnd();
                resolve();
            };
            
            // 跳过处理函数
            const skipHandler = () => {
                if (hasEnded) return; // 防止重复触发
                
                // 一周目保护：检查是否可以跳过
                if (this.currentSceneId && window.PlayProgress) {
                    if (!PlayProgress.canSkipScene(this.currentSceneId)) {
                        // 显示不可跳过提示
                        if (window.showSkipToast) {
                            window.showSkipToast('请先完整观看一次');
                        }
                        return;
                    }
                }
                
                videoElement.pause();
                videoElement.currentTime = videoElement.duration - 0.1;
                handleEnd();
            };
            
            // 保存处理器引用，以便后续清除
            this.currentHandlers = {
                handleEnd,
                skipHandler,
                skipButton
            };
            
            // 绑定事件
            videoElement.addEventListener('ended', handleEnd);
            if (skipButton) {
                skipButton.addEventListener('click', skipHandler);
            }
            
            // 播放视频
            videoElement.play().catch(() => {
                this.isPlaying = false;
            });
            
            // 显示跳过按钮和控制按钮
            setTimeout(() => {
                if (!hasEnded) {
                    if (skipButton) {
                        skipButton.classList.add('show');
                    }
                    if (controlsContainer) {
                        controlsContainer.classList.add('show');
                    }
                }
            }, 2000);
        });
    }
    
    // 快速配置视频播放（增强版）
    async playVideoById(videoId, skipButtonId, audioEnabled = false, onEnd = null, controlsConfig = null, sceneId = null) {
        const videoElement = document.getElementById(videoId);
        const skipButton = document.getElementById(skipButtonId);
        
        if (!videoElement) {
            return;
        }
        
        return this.playVideo({
            videoElement,
            skipButton,
            audioEnabled,
            onEnd,
            controlsId: controlsConfig?.controlsId,
            pauseBtnId: controlsConfig?.pauseBtnId,
            speedBtnId: controlsConfig?.speedBtnId,
            sceneId: sceneId
        });
    }
}

// 导出模块
window.VideoModule = VideoModule;