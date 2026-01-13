// 对话模块 - 统一所有对话相关功能
class DialogModule {
    constructor() {
        this.isTyping = false;
        this.currentDialogIndex = 0;
        this.audioEnabled = false;
        this.currentAnimationId = null; // 保存当前动画ID
        this.audioPool = []; // 音频池
        this.audioPoolSize = 3; // 减少音频池大小
        this.currentAudioIndex = 0; // 当前使用的音频索引
        this.audioInitialized = false; // 音频是否已初始化
        this.lastSoundTime = 0; // 上次播放音效的时间
        this.soundInterval = 80; // 音效播放最小间隔（毫秒）
        this.isMobile = this.detectMobile(); // 检测是否为移动端
        
        // 人名显示映射（英文转中文）
        this.speakerNameMap = {
            'rick': '瑞克',
            'morty': '莫蒂'
        };
    }
    
    // 清理资源（防止内存泄漏）
    cleanup() {
        // 取消正在进行的动画
        if (this.currentAnimationId) {
            cancelAnimationFrame(this.currentAnimationId);
            this.currentAnimationId = null;
        }
        // 清理音频池
        this.audioPool.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        this.audioPool = [];
        this.audioInitialized = false;
        this.isTyping = false;
        this.currentDialogIndex = 0;
    }
    
    // 重置状态（用于二周目）
    reset() {
        this.cleanup();
        this.currentAudioIndex = 0;
        this.lastSoundTime = 0;
    }
    
    // 获取显示用的人名（英文转中文）
    getDisplayName(speaker) {
        return this.speakerNameMap[speaker] || speaker;
    }
    
    // 检测是否为移动端
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 1024 && 'ontouchstart' in window);
    }
    
    // 初始化音频池（需要在用户交互后调用）
    initAudioPool() {
        if (this.audioInitialized || this.isMobile) return; // 移动端不初始化音频池
        
        const dialogSound = document.getElementById('dialog-sound') || 
                           document.getElementById('chapter3-dialog-sound');
        if (!dialogSound) return;
        
        // 创建音频池
        for (let i = 0; i < this.audioPoolSize; i++) {
            const audio = dialogSound.cloneNode(true);
            audio.volume = dialogSound.volume;
            this.audioPool.push(audio);
        }
        this.audioInitialized = true;
    }
    
    // 统一的打字机效果 - 根据设备类型选择不同实现
    async typewriterEffect(element, text, audioEnabled = false) {
        if (this.isMobile) {
            // 移动端：直接显示全文 + 淡入效果
            return this.mobileTextEffect(element, text);
        } else {
            // 桌面端：打字机效果
            return this.desktopTypewriterEffect(element, text, audioEnabled);
        }
    }
    
    // 移动端：CSS动画打字机效果 + 单次音效
    async mobileTextEffect(element, text) {
        return new Promise((resolve) => {
            this.isTyping = true;
            
            // 播放移动端对话音效（一次）
            if (this.audioEnabled) {
                this.playMobileDialogSound();
            }
            
            // 设置文字内容
            element.textContent = text;
            
            // 计算动画时长（每个字符约40ms）
            const charCount = text.length;
            const duration = Math.min(charCount * 40, 2000); // 最长2秒
            
            // 添加CSS打字机动画类
            element.classList.add('mobile-typewriter');
            element.style.setProperty('--char-count', charCount);
            element.style.setProperty('--type-duration', `${duration}ms`);
            
            // 动画完成后清理
            setTimeout(() => {
                element.classList.remove('mobile-typewriter');
                element.style.removeProperty('--char-count');
                element.style.removeProperty('--type-duration');
                this.isTyping = false;
                resolve();
            }, duration + 100);
        });
    }
    
    // 播放移动端对话音效（单次）
    playMobileDialogSound() {
        const mobileSound = document.getElementById('mobile-dialog-sound');
        if (mobileSound) {
            mobileSound.volume = 0.5;
            mobileSound.currentTime = 0;
            mobileSound.play().catch(() => {});
        }
    }
    
    // 桌面端：打字机效果
    async desktopTypewriterEffect(element, text, audioEnabled = false) {
        return new Promise((resolve) => {
            // 取消之前的动画
            if (this.currentAnimationId) {
                cancelAnimationFrame(this.currentAnimationId);
                this.currentAnimationId = null;
            }
            
            // 确保音频池已初始化
            if (audioEnabled && !this.audioInitialized) {
                this.initAudioPool();
            }
            
            this.isTyping = true;
            element.textContent = '';
            let index = 0;
            let lastTime = 0;
            const charInterval = 25; // 每个字符的间隔（毫秒）- 加快打字速度
            
            const animate = (currentTime) => {
                if (!lastTime) lastTime = currentTime;
                const elapsed = currentTime - lastTime;
                
                if (elapsed >= charInterval) {
                    if (index < text.length) {
                        // 一次添加字符，减少DOM操作
                        element.textContent = text.substring(0, index + 1);
                        index++;
                        lastTime = currentTime;
                        
                        // 每3个字符播放一次音效
                        if (audioEnabled && index % 3 === 1) {
                            this.playDialogSound();
                        }
                    }
                }
                
                if (index < text.length) {
                    this.currentAnimationId = requestAnimationFrame(animate);
                } else {
                    this.currentAnimationId = null;
                    this.isTyping = false;
                    resolve();
                }
            };
            
            this.currentAnimationId = requestAnimationFrame(animate);
        });
    }
    
    // 统一的对话显示
    async showDialog(dialogConfig) {
        const { 
            speakerElement, 
            textElement, 
            text, 
            speaker, 
            character,
            characterImage,
            portraitElements 
        } = dialogConfig;
        
        // 更新说话人（使用中文显示名称）
        if (speakerElement) {
            speakerElement.textContent = this.getDisplayName(speaker);
        }
        
        // 更新立绘
        if (character && portraitElements) {
            this.updatePortraits(character, characterImage, portraitElements);
        }
        
        // 打字机效果（移动端会自动使用简化版本）
        await this.typewriterEffect(textElement, text, this.audioEnabled);
    }
    
    // 统一的立绘控制
    updatePortraits(character, characterImage, portraitElements) {
        const { rick, morty } = portraitElements;
        
        // 如果有指定立绘图片，更新图片源
        if (characterImage) {
            const imagePath = `assets/common/characters/${characterImage}.png`;
            if (character === 'rick' && rick) {
                // 找到div内的img元素
                const img = rick.querySelector('img') || rick;
                if (img.tagName === 'IMG') {
                    img.src = imagePath;
                } else if (img.querySelector) {
                    const innerImg = img.querySelector('img');
                    if (innerImg) innerImg.src = imagePath;
                }
            } else if (character === 'morty' && morty) {
                // 找到div内的img元素
                const img = morty.querySelector('img') || morty;
                if (img.tagName === 'IMG') {
                    img.src = imagePath;
                } else if (img.querySelector) {
                    const innerImg = img.querySelector('img');
                    if (innerImg) innerImg.src = imagePath;
                }
            }
        }
        
        if (character === 'rick') {
            rick?.classList.add('active');
            morty?.classList.remove('active');
        } else if (character === 'morty') {
            morty?.classList.add('active');
            rick?.classList.remove('active');
        } else {
            rick?.classList.remove('active');
            morty?.classList.remove('active');
        }
    }
    
    // 播放对话音效（使用音频池 + 节流）- 仅桌面端
    playDialogSound() {
        if (this.isMobile) return; // 移动端不播放打字音效
        
        const now = performance.now();
        // 节流：确保音效播放间隔
        if (now - this.lastSoundTime < this.soundInterval) {
            return;
        }
        this.lastSoundTime = now;
        
        // 优先使用音频池
        if (this.audioPool.length > 0) {
            const audio = this.audioPool[this.currentAudioIndex];
            this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audioPool.length;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            return;
        }
        
        // 降级方案：使用原始音频元素
        const dialogSound = document.getElementById('dialog-sound') || 
                           document.getElementById('chapter3-dialog-sound');
        if (dialogSound) {
            dialogSound.currentTime = 0;
            dialogSound.play().catch(() => {});
        }
    }
    
    // 设置音效状态
    setAudioEnabled(enabled) {
        this.audioEnabled = enabled;
        // 启用音效时初始化音频池（仅桌面端）
        if (enabled && !this.isMobile) {
            this.initAudioPool();
        }
    }
    
    // 等待用户点击继续
    async waitForClick(element) {
        return new Promise((resolve) => {
            const clickHandler = () => {
                if (!this.isTyping) {
                    element.removeEventListener('click', clickHandler);
                    resolve();
                }
            };
            element.addEventListener('click', clickHandler);
        });
    }
}

// 导出模块
window.DialogModule = DialogModule;