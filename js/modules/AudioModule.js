// 音频模块 - 统一音频管理
class AudioModule {
    constructor() {
        this.enabled = false;
        this.bgm = null;
        this.currentBgm = null; // 当前播放的BGM名称
        this.bgmElements = new Map(); // 多个BGM元素
        this.audioElements = new Map();
    }
    
    // 初始化音频元素
    init() {
        // 主BGM
        this.bgm = document.getElementById('homepage-bgm');
        
        // 多个BGM
        this.bgmElements.set('main', document.getElementById('homepage-bgm'));
        this.bgmElements.set('relaxed', document.getElementById('bgm-relaxed'));
        this.bgmElements.set('suspense2', document.getElementById('bgm-suspense2'));
        this.bgmElements.set('battle', document.getElementById('bgm-battle'));
        this.bgmElements.set('dining', document.getElementById('bgm-dining'));
        
        // 音效
        this.audioElements.set('portal', document.getElementById('portal-appear-sound'));
        this.audioElements.set('dialog', document.getElementById('dialog-sound'));
        this.audioElements.set('chapter3-dialog', document.getElementById('chapter3-dialog-sound'));
        this.audioElements.set('door-open', document.getElementById('sfx-door-open'));
        this.audioElements.set('tension', document.getElementById('sfx-tension'));
        this.audioElements.set('block', document.getElementById('sfx-block'));
        this.audioElements.set('cut-arm', document.getElementById('sfx-cut-arm'));
        this.audioElements.set('upload', document.getElementById('sfx-upload'));
        this.audioElements.set('message', document.getElementById('sfx-message'));
        this.audioElements.set('3d-printer', document.getElementById('sfx-3d-printer'));
        this.audioElements.set('open-box', document.getElementById('sfx-open-box'));
        this.audioElements.set('open-recipe', document.getElementById('sfx-open-recipe'));
        this.audioElements.set('slap-hand', document.getElementById('sfx-slap-hand'));
        this.audioElements.set('pc-boot', document.getElementById('sfx-pc-boot'));
        this.audioElements.set('drink-soup', document.getElementById('sfx-drink-soup'));
        this.audioElements.set('memory', document.getElementById('sfx-memory'));
        this.audioElements.set('locked', document.getElementById('sfx-locked'));
        this.audioElements.set('take-recipe', document.getElementById('sfx-take-recipe'));
        this.audioElements.set('break-in', document.getElementById('sfx-break-in'));
        this.audioElements.set('crumple-paper', document.getElementById('sfx-crumple-paper'));
        this.audioElements.set('bookshelf', document.getElementById('sfx-bookshelf'));
        this.audioElements.set('mouse-click', document.getElementById('sfx-mouse-click'));
        this.audioElements.set('cool-landing', document.getElementById('sfx-cool-landing'));
        this.audioElements.set('slurp-noodle', document.getElementById('sfx-slurp-noodle'));
        this.audioElements.set('grip-sword', document.getElementById('sfx-grip-sword'));
        this.audioElements.set('whiteout-gun', document.getElementById('sfx-whiteout-gun'));
        this.audioElements.set('glare', document.getElementById('sfx-glare'));
        this.audioElements.set('reload', document.getElementById('sfx-reload'));
        this.audioElements.set('move-seat', document.getElementById('sfx-move-seat'));
        this.audioElements.set('rick-yummy', document.getElementById('sfx-rick-yummy'));
    }
    
    // 设置音效状态
    setEnabled(enabled) {
        this.enabled = enabled;
        this.updateAllAudioSwitches(enabled);
        
        // 控制所有视频音量
        this.updateVideoAudio(enabled);
        
        // 控制当前BGM
        if (this.currentBgm) {
            const bgm = this.bgmElements.get(this.currentBgm);
            if (bgm) {
                if (enabled) {
                    bgm.volume = 0.3;
                } else {
                    bgm.pause();
                    bgm.volume = 0;
                }
            }
        }
        
        // 控制其他音效音量
        this.audioElements.forEach((audio, name) => {
            if (audio && name === 'portal') {
                audio.volume = enabled ? 0.5 : 0;
            }
        });
    }
    
    // 更新视频音频状态
    updateVideoAudio(enabled) {
        // 所有视频ID列表
        const videos = ['opening-video', 'garage-video', 'chapter3-video', 'chapter5-video', 'ending-video'];
        videos.forEach(videoId => {
            const video = document.getElementById(videoId);
            if (video) {
                video.muted = !enabled;
            }
        });
    }
    
    // 播放音效
    play(audioName, volume = 0.5) {
        if (!this.enabled) return;
        
        const audio = this.audioElements.get(audioName);
        if (audio) {
            audio.volume = volume;
            audio.currentTime = 0;
            audio.play().catch((error) => {
                // AbortError 是正常的竞态条件，静默处理
                if (error.name !== 'AbortError') {
                    console.error('音效播放失败:', error);
                }
            });
        }
    }
    
    // 播放BGM（支持多个BGM切换）
    async playBGM(bgmName = 'main') {
        if (!this.enabled) return;
        
        // 停止当前BGM
        if (this.currentBgm && this.currentBgm !== bgmName) {
            const currentBgmEl = this.bgmElements.get(this.currentBgm);
            if (currentBgmEl) {
                currentBgmEl.pause();
                currentBgmEl.currentTime = 0;
            }
        }
        
        // 播放新BGM
        const bgm = this.bgmElements.get(bgmName);
        if (bgm) {
            this.currentBgm = bgmName;
            bgm.volume = 0.3;
            bgm.currentTime = 0;
            bgm.loop = true;
            
            // 使用 Promise 处理播放，避免竞态条件
            try {
                await bgm.play();
            } catch (error) {
                // AbortError 是正常的竞态条件，不需要报错
                if (error.name !== 'AbortError') {
                    console.log('BGM播放失败:', error);
                }
            }
        }
    }
    
    // 停止BGM
    stopBGM() {
        if (this.currentBgm) {
            const bgm = this.bgmElements.get(this.currentBgm);
            if (bgm) {
                bgm.pause();
            }
        }
    }
    
    // 检查BGM是否暂停
    isBGMPaused() {
        if (this.currentBgm) {
            const bgm = this.bgmElements.get(this.currentBgm);
            return bgm ? bgm.paused : true;
        }
        return true;
    }
    
    // 更新所有音效开关状态
    updateAllAudioSwitches(enabled) {
        const switches = [
            'audio-switch', 'homepage-audio-switch', 'video-audio-switch',
            'transition-audio-switch', 'garage-audio-switch', 'search-audio-switch',
            'dialog-audio-switch', 'chapter3-audio-switch', 'chapter3-door-audio-switch',
            'chapter3-room-audio-switch', 'chapter3-kitchen-audio-switch', 'chapter3-living-audio-switch',
            'chapter3-study-audio-switch', 'chapter4-desktop-audio-switch',
            'chapter5-video-audio-switch', 'chapter5-living-audio-switch',
            'chapter6-audio-switch', 'ending-audio-switch'
        ];
        
        switches.forEach(switchId => {
            const switchEl = document.getElementById(switchId);
            if (switchEl) {
                if (enabled) {
                    switchEl.classList.add('active');
                } else {
                    switchEl.classList.remove('active');
                }
            }
        });
    }
    
    // 设置全局音效开关事件
    setupGlobalAudioToggle(switchElement) {
        if (switchElement) {
            switchElement.addEventListener('click', () => {
                this.setEnabled(!this.enabled);
                console.log('全局音效状态:', this.enabled ? '开启' : '关闭');
            });
        }
    }
    
    // 获取音效状态
    isEnabled() {
        return this.enabled;
    }
}

// 导出模块
window.AudioModule = AudioModule;