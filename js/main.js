// 模块化重构后的主文件
// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化模块实例
    const dialogModule = new DialogModule();
    const videoModule = new VideoModule();
    const audioModule = new AudioModule();
    const sceneModule = new SceneModule();
    const evidenceModule = new EvidenceModule(EvidenceData);
    
    // Toast 提示函数（用于显示不可跳过提示）
    function showSkipToast(message = '请先完整观看一次') {
        const toast = document.getElementById('skip-toast');
        if (!toast) return;
        
        // 更新消息文本
        const textSpan = toast.querySelector('span:last-child');
        if (textSpan) textSpan.textContent = message;
        
        // 显示 Toast
        toast.classList.add('show');
        
        // 2秒后自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    // 将 showSkipToast 暴露给全局，供 createDialogScene 使用
    window.showSkipToast = showSkipToast;
    
    // 视口缩放系统 - 固定16:9比例（优化移动端适配）
    function initViewportScaling() {
        // 创建主视口容器
        const mainViewport = document.createElement('div');
        mainViewport.className = 'main-viewport';
        
        // 将所有现有内容移动到主视口容器中
        const body = document.body;
        while (body.firstChild) {
            mainViewport.appendChild(body.firstChild);
        }
        body.appendChild(mainViewport);
        
        // 获取准确的视口尺寸（优先使用 visualViewport API）
        function getViewportSize() {
            const vv = window.visualViewport;
            if (vv) {
                return { width: vv.width, height: vv.height };
            }
            // 降级方案：使用 innerWidth/Height，但考虑设备像素比
            return { 
                width: window.innerWidth, 
                height: window.innerHeight 
            };
        }
        
        // 计算并应用缩放
        function updateScale() {
            const viewport = getViewportSize();
            const windowWidth = viewport.width;
            const windowHeight = viewport.height;
            
            // 检测是否为竖屏
            const isPortrait = windowHeight > windowWidth;
            
            let scaleX, scaleY, scale;
            
            // 安全边距系数（防止内容被裁切）
            const safeMargin = 0.98;
            
            if (isPortrait) {
                // 竖屏时：由于会旋转90度，所以交换宽高来计算缩放
                // 旋转后：屏幕高度 → 内容宽度，屏幕宽度 → 内容高度
                scaleX = windowHeight / 1920;
                scaleY = windowWidth / 1080;
                scale = Math.min(scaleX, scaleY) * safeMargin;
                
                // 竖屏时旋转90度并缩放
                const transformValue = `translate(-50%, -50%) rotate(90deg) scale(${scale})`;
                mainViewport.style.transform = transformValue;
            } else {
                // 横屏时：正常计算
                scaleX = windowWidth / 1920;
                scaleY = windowHeight / 1080;
                scale = Math.min(scaleX, scaleY) * safeMargin;
                
                const transformValue = `translate(-50%, -50%) scale(${scale})`;
                mainViewport.style.transform = transformValue;
            }
        }
        
        // 初始缩放
        updateScale();
        
        // 强制再次执行以确保生效
        setTimeout(updateScale, 100);
        setTimeout(updateScale, 300);
        setTimeout(updateScale, 500);
        
        // 监听窗口大小变化
        window.addEventListener('resize', updateScale);
        
        // 监听 visualViewport 变化（移动端更准确）
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateScale);
        }
        
        // 监听屏幕方向变化
        window.addEventListener('orientationchange', function() {
            // 延迟执行以确保方向变化完成
            setTimeout(updateScale, 50);
            setTimeout(updateScale, 150);
            setTimeout(updateScale, 300);
        });
        
        return mainViewport;
    }
    
    // 初始化视口缩放系统
    initViewportScaling();
    
    // 预加载系统
    class PreloadManager {
        constructor() {
            this.resources = [];
            this.loadedCount = 0;
            this.totalCount = 0;
            this.progressCallback = null;
            this.completeCallback = null;
        }
        
        // 添加需要预加载的资源
        addResource(url, type = 'auto') {
            this.resources.push({ url, type, loaded: false });
            this.totalCount++;
        }
        
        // 设置进度回调
        onProgress(callback) {
            this.progressCallback = callback;
        }
        
        // 设置完成回调
        onComplete(callback) {
            this.completeCallback = callback;
        }
        
        // 开始预加载
        startPreload() {
            this.resources.forEach((resource) => {
                this.loadResource(resource);
            });
        }
        
        // 加载单个资源
        loadResource(resource) {
            const { url, type } = resource;
            
            // 根据文件扩展名或类型判断加载方式
            const extension = url.split('.').pop().toLowerCase();
            
            if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                this.loadImage(resource);
            } else if (type === 'audio' || ['mp3', 'wav', 'ogg'].includes(extension)) {
                this.loadAudio(resource);
            } else if (type === 'video' || ['mp4', 'webm', 'ogg'].includes(extension)) {
                this.loadVideo(resource);
            } else {
                // 其他文件类型使用fetch
                this.loadFile(resource);
            }
        }
        
        // 加载图片
        loadImage(resource) {
            const img = new Image();
            img.onload = () => this.onResourceLoaded(resource, '图片');
            img.onerror = () => this.onResourceError(resource, '图片');
            img.src = resource.url;
        }
        
        // 加载音频
        loadAudio(resource) {
            const audio = new Audio();
            audio.addEventListener('canplaythrough', () => this.onResourceLoaded(resource, '音频'));
            audio.addEventListener('error', () => this.onResourceError(resource, '音频'));
            audio.preload = 'auto';
            audio.src = resource.url;
        }
        
        // 加载视频 - 直接使用页面上的video元素
        loadVideo(resource) {
            // 根据URL找到页面上对应的video元素
            const pageVideo = document.querySelector(`video source[src="${resource.url}"]`)?.parentElement;
            
            if (pageVideo) {
                // 使用页面上的video元素
                const handleLoaded = () => {
                    pageVideo.removeEventListener('canplaythrough', handleLoaded);
                    this.onResourceLoaded(resource, '视频');
                };
                pageVideo.addEventListener('canplaythrough', handleLoaded);
                pageVideo.addEventListener('error', () => this.onResourceError(resource, '视频'), { once: true });
                // 触发加载
                pageVideo.load();
            } else {
                // 降级：创建临时video元素
                const video = document.createElement('video');
                video.addEventListener('canplaythrough', () => this.onResourceLoaded(resource, '视频'), { once: true });
                video.addEventListener('error', () => this.onResourceError(resource, '视频'), { once: true });
                video.preload = 'auto';
                video.src = resource.url;
            }
        }
        
        // 加载其他文件
        loadFile(resource) {
            fetch(resource.url)
                .then(response => {
                    if (response.ok) {
                        this.onResourceLoaded(resource, '文件');
                    } else {
                        this.onResourceError(resource, '文件');
                    }
                })
                .catch(() => this.onResourceError(resource, '文件'));
        }
        
        // 资源加载成功
        onResourceLoaded(resource, type) {
            if (!resource.loaded) {
                resource.loaded = true;
                this.loadedCount++;
                
                // 更新进度
                const progress = (this.loadedCount / this.totalCount) * 100;
                if (this.progressCallback) {
                    this.progressCallback(progress, this.loadedCount, this.totalCount, resource.url);
                }
                
                // 检查是否全部加载完成
                if (this.loadedCount >= this.totalCount) {
                    if (this.completeCallback) {
                        this.completeCallback();
                    }
                }
            }
        }
        
        // 资源加载失败
        onResourceError(resource, type) {
            // 即使失败也算作"完成"，避免卡住
            this.onResourceLoaded(resource, `${type}(失败)`);
        }
    }
    
    // 初始化预加载管理器
    const preloader = new PreloadManager();
    
    // 添加所有需要预加载的资源
    function initPreloadResources() {
        // UI资源
        preloader.addResource('assets/ui/portal_gun.png', 'image');
        preloader.addResource('assets/ui/portal_fluid.png', 'image');
        preloader.addResource('assets/ui/portal.png', 'image');
        
        // 背景资源
        preloader.addResource('assets/backgrounds/space.jpg', 'image');
        preloader.addResource('assets/backgrounds/opening_end.jpg', 'image');
        preloader.addResource('assets/backgrounds/search_scene.jpg', 'image');
        preloader.addResource('assets/backgrounds/door_scene.jpg', 'image');
        preloader.addResource('assets/backgrounds/room_scene.jpg', 'image');
        preloader.addResource('assets/backgrounds/kitchen_scene.jpg', 'image');
        preloader.addResource('assets/backgrounds/living_scene.jpg', 'image');
        preloader.addResource('assets/backgrounds/study_scene.jpg', 'image');
        
        // 音频资源
        preloader.addResource('assets/common/audio/sfx/portal_appear.mp3', 'audio');
        preloader.addResource('assets/common/audio/bgm/main.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/dialog.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/dialog2.mp3', 'audio');
        
        // 新增BGM
        preloader.addResource('assets/common/audio/bgm/relaxed.mp3', 'audio');
        preloader.addResource('assets/common/audio/bgm/suspense2.mp3', 'audio');
        preloader.addResource('assets/common/audio/bgm/battle.mp3', 'audio');
        preloader.addResource('assets/common/audio/bgm/dining.mp3', 'audio');
        
        // 新增音效
        preloader.addResource('assets/common/audio/sfx/door_open.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/tension.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/block.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/cut_arm.mp3', 'audio');
        
        // 21个新增音效（第二幕到第六幕）
        preloader.addResource('assets/common/audio/sfx/sfx-upload.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/sfx-message.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/3D打印机.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/打开盒子.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/打开看食谱.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/打手.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/电脑开机.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/喝汤.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/回忆.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/门窗锁住了.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/拿出食谱.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/破门而入.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/揉丢纸团.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/书架.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/鼠标点击.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/帅气落地.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/嗦面.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/握紧铅笔剑.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/修正液枪发射.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/眼神.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/装填弹药.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/座位移开.mp3', 'audio');
        preloader.addResource('assets/common/audio/sfx/rick好吃.mp3', 'audio');
        
        // 视频资源
        preloader.addResource('assets/videos/opening.mp4', 'video');
        preloader.addResource('assets/videos/garage.mp4', 'video');
        preloader.addResource('assets/videos/chapter3_crisis.mp4', 'video');
        
        // 角色立绘 - Rick
        preloader.addResource('assets/common/characters/rick正常.png', 'image');
        preloader.addResource('assets/common/characters/rick思考上看.png', 'image');
        preloader.addResource('assets/common/characters/rick思考托腮.png', 'image');
        preloader.addResource('assets/common/characters/rick思考抬头.png', 'image');
        preloader.addResource('assets/common/characters/rick思考眯眼.png', 'image');
        preloader.addResource('assets/common/characters/rick惊讶张嘴.png', 'image');
        preloader.addResource('assets/common/characters/rick生气抱胸.png', 'image');
        preloader.addResource('assets/common/characters/rick生气握拳.png', 'image');
        preloader.addResource('assets/common/characters/rick生气摊手.png', 'image');
        preloader.addResource('assets/common/characters/rick自豪叉腰.png', 'image');
        preloader.addResource('assets/common/characters/rick自豪抬手.png', 'image');
        preloader.addResource('assets/common/characters/rick赞叹.png', 'image');
        preloader.addResource('assets/common/characters/rick闯祸尴尬.png', 'image');
        preloader.addResource('assets/common/characters/rick闯祸投降.png', 'image');
        preloader.addResource('assets/common/characters/rick无奈闭眼.png', 'image');
        preloader.addResource('assets/common/characters/rick手持传送枪.png', 'image');
        preloader.addResource('assets/common/characters/rick传送枪瞄准.png', 'image');
        preloader.addResource('assets/common/characters/rick手持修正液枪.png', 'image');
        
        // 角色立绘 - Morty
        preloader.addResource('assets/common/characters/morty正常.png', 'image');
        preloader.addResource('assets/common/characters/morty微笑.png', 'image');
        preloader.addResource('assets/common/characters/morty星星眼.png', 'image');
        preloader.addResource('assets/common/characters/morty欣赏.png', 'image');
        preloader.addResource('assets/common/characters/morty低头欣赏.png', 'image');
        preloader.addResource('assets/common/characters/morty认真思考.png', 'image');
        preloader.addResource('assets/common/characters/morty小震惊.png', 'image');
        preloader.addResource('assets/common/characters/morty张嘴吓傻.png', 'image');
        preloader.addResource('assets/common/characters/morty张嘴担心.png', 'image');
        preloader.addResource('assets/common/characters/morty抱头担心.png', 'image');
        preloader.addResource('assets/common/characters/morty害怕恐怖.png', 'image');
        preloader.addResource('assets/common/characters/morty哭生气.png', 'image');
        preloader.addResource('assets/common/characters/morty假装镇定.png', 'image');
        preloader.addResource('assets/common/characters/morty偷看.png', 'image');
        preloader.addResource('assets/common/characters/morty捂眼.png', 'image');
        
        // 道具证据 - 第二幕
        preloader.addResource('assets/evidence/id_card.png', 'image');
        preloader.addResource('assets/evidence/phone_hacked.png', 'image');
        preloader.addResource('assets/evidence/phone_desktop.png', 'image');
        preloader.addResource('assets/evidence/phone_replaced.png', 'image');
        preloader.addResource('assets/evidence/message_received.png', 'image');
        preloader.addResource('assets/evidence/message1.png', 'image');
        preloader.addResource('assets/evidence/message2.png', 'image');
        
        // 道具证据 - 客厅
        preloader.addResource('assets/evidence/music_area.png', 'image');
        preloader.addResource('assets/evidence/3d_printer.png', 'image');
        preloader.addResource('assets/evidence/cnc_certificate.png', 'image');
        preloader.addResource('assets/evidence/bob_bag.png', 'image');
        
        // 道具证据 - 书房
        preloader.addResource('assets/evidence/bookshelf.png', 'image');
        preloader.addResource('assets/evidence/computer.png', 'image');
        preloader.addResource('assets/evidence/computer_hacked.png', 'image');
        
        // 第四幕 - 电脑桌面
        preloader.addResource('assets/backgrounds/computer_desktop.jpg', 'image');
        preloader.addResource('assets/evidence/projects_folder.png', 'image');
        preloader.addResource('assets/evidence/browser.png', 'image');
        preloader.addResource('assets/evidence/recycle_bin.png', 'image');
        preloader.addResource('assets/evidence/recipe.png', 'image');
        preloader.addResource('assets/evidence/rick_morty_watching.png', 'image');
        
        // 第五幕 - 回忆
        preloader.addResource('assets/videos/回忆.mp4', 'video');
        preloader.addResource('assets/backgrounds/chapter5_living.jpg', 'image');
        preloader.addResource('assets/evidence/tower_destroyed.png', 'image');
        preloader.addResource('assets/evidence/douwang_face.png', 'image');
        preloader.addResource('assets/evidence/secret_box_under_bed.png', 'image');
        preloader.addResource('assets/evidence/box_opened.png', 'image');
        preloader.addResource('assets/evidence/landlady_enter.png', 'image');
        preloader.addResource('assets/evidence/tv_snowman.png', 'image');
        preloader.addResource('assets/evidence/snowman_melting.png', 'image');
        
        // 第六幕 - 战斗与结局
        // 背景图
        preloader.addResource('assets/backgrounds/chapter6_penguin_boss.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_penguin_pot.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_shadow.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_hand_cut.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_pot_fall.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_cool_landing.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_charge.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_restaurant.jpg', 'image');
        preloader.addResource('assets/backgrounds/chapter6_leaving.jpg', 'image');
        // 道具图
        preloader.addResource('assets/evidence/japanese_food.png', 'image');
        preloader.addResource('assets/evidence/boss_glare.png', 'image');
        preloader.addResource('assets/evidence/recipe_paper.png', 'image');
        preloader.addResource('assets/evidence/rick_shocked.png', 'image');
        preloader.addResource('assets/evidence/paper_ball.png', 'image');
        
        // 结尾视频
        preloader.addResource('assets/videos/ending.mp4', 'video');
    }
    
    // 获取UI元素
    const videoConsentSection = document.getElementById('video-consent-section');
    const loadingProgressSection = document.getElementById('loading-progress-section');
    const audioSection = document.getElementById('audio-section');
    const loadingText = document.getElementById('loading-text');
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressDetail = document.getElementById('progress-detail');
    const startLoadingBtn = document.getElementById('start-loading');
    
    // 设置预加载回调
    preloader.onProgress((progress, loaded, total, currentFile) => {
        // 更新进度条
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
        
        // 更新加载详情
        const fileName = currentFile.split('/').pop();
        progressDetail.textContent = `${loaded}/${total} - ${fileName}`;
        
        // 更新加载文字
        if (progress < 30) {
            loadingText.textContent = '正在加载图片资源...';
        } else if (progress < 70) {
            loadingText.textContent = '正在加载音频资源...';
        } else if (progress < 95) {
            loadingText.textContent = '正在加载视频资源...';
        } else {
            loadingText.textContent = '即将完成...';
        }
    });
    
    preloader.onComplete(() => {
        // 加载完成，显示音效选择界面
        setTimeout(() => {
            loadingText.textContent = '加载完成！';
            progressDetail.textContent = '所有资源已准备就绪';
            
            // 延迟1秒后切换到音效选择
            setTimeout(() => {
                // 隐藏加载进度界面，显示音效选择界面
                gsap.to(loadingProgressSection, {
                    duration: 0.5,
                    opacity: 0,
                    onComplete: function() {
                        loadingProgressSection.classList.add('hidden');
                        audioSection.classList.remove('hidden');
                        
                        // 音效选择界面淡入
                        gsap.fromTo(audioSection, 
                            { opacity: 0 },
                            { 
                                duration: 0.5, 
                                opacity: 1,
                                onComplete: function() {
                                    // 预加载完成后初始化游戏逻辑
                                    initGameLogic();
                                }
                            }
                        );
                    }
                });
            }, 1000);
        }, 500);
    });
    
    // 点击"开始加载"按钮后才开始预加载（移动端需要用户交互才能加载视频）
    startLoadingBtn.addEventListener('click', function() {
        // 隐藏视频协议界面，显示加载进度界面
        gsap.to(videoConsentSection, {
            duration: 0.5,
            opacity: 0,
            onComplete: function() {
                videoConsentSection.classList.add('hidden');
                loadingProgressSection.classList.remove('hidden');
                
                // 加载进度界面淡入
                gsap.fromTo(loadingProgressSection, 
                    { opacity: 0 },
                    { 
                        duration: 0.5, 
                        opacity: 1,
                        onComplete: function() {
                            // 用户交互后开始预加载
                            initPreloadResources();
                            preloader.startPreload();
                        }
                    }
                );
            }
        });
    });
    
    // 页面元素和事件监听（预加载完成后初始化）
    function initGameLogic() {
        // 初始化音频模块
        audioModule.init();
        
        // 获取UI元素
        const audioChoice = document.getElementById('audio-choice');
        const homepage = document.getElementById('homepage');
        const chapter1Scene1 = document.getElementById('chapter1-scene1');
        const transitionGuide = document.getElementById('transition-guide');
        const chapter2Scene1 = document.getElementById('chapter2-scene1');
        const chapter2Scene2 = document.getElementById('chapter2-scene2');
        const dialogSystem = document.getElementById('dialog-system');
        const chapter3Scene1 = document.getElementById('chapter3-scene1');
        const chapter3Scene2 = document.getElementById('chapter3-scene2');
        const chapter3Scene3 = document.getElementById('chapter3-scene3');
        const chapter3Scene4 = document.getElementById('chapter3-scene4');
        const enableAudioBtn = document.getElementById('enable-audio');
        const disableAudioBtn = document.getElementById('disable-audio');
        
        // 传送门和动画元素
        const portalContainer = document.querySelector('.portal-container');
        const curtainTop = document.querySelector('.curtain-top');
        const curtainBottom = document.querySelector('.curtain-bottom');
        
        // 第二幕搜索场景元素
        const clothesArea = document.getElementById('clothes-area');
        const evidenceDisplay = document.getElementById('evidence-display');
        const evidenceImage = document.getElementById('evidence-image');
        const evidenceCounter = document.getElementById('evidence-counter');
        const prevEvidenceBtn = document.getElementById('prev-evidence');
        const nextEvidenceBtn = document.getElementById('next-evidence');
        const dialogBox = document.getElementById('dialog-box');
        const speakerName = document.getElementById('speaker-name');
        const dialogText = document.getElementById('dialog-text');
        const rickPortrait = document.getElementById('rick-portrait');
        const mortyPortrait = document.getElementById('morty-portrait');
        
        // 设置音频模块的对话模块引用
        dialogModule.setAudioEnabled(audioModule.isEnabled());
        
        // 设置全局音效开关事件
        const audioSwitches = [
            'audio-switch', 'homepage-audio-switch', 'video-audio-switch',
            'transition-audio-switch', 'garage-audio-switch', 'search-audio-switch',
            'dialog-audio-switch', 'chapter3-audio-switch', 'chapter3-door-audio-switch',
            'chapter3-room-audio-switch', 'chapter3-kitchen-audio-switch', 'chapter3-living-audio-switch',
            'chapter3-study-audio-switch', 'chapter4-desktop-audio-switch',
            'chapter5-video-audio-switch', 'chapter5-living-audio-switch',
            'chapter6-audio-switch', 'ending-audio-switch'
        ];
        
        audioSwitches.forEach(switchId => {
            const switchElement = document.getElementById(switchId);
            audioModule.setupGlobalAudioToggle(switchElement);
        });
        
        // 同步音效状态到对话模块
        const originalSetEnabled = audioModule.setEnabled.bind(audioModule);
        audioModule.setEnabled = function(enabled) {
            originalSetEnabled(enabled);
            dialogModule.setAudioEnabled(enabled);
        };
        
        // 开启音效按钮点击事件
        enableAudioBtn.addEventListener('click', function() {
            audioModule.setEnabled(true);
            audioModule.playBGM();
            
            // 更新显示屏文字
            const screenText = document.querySelector('.text');
            screenText.textContent = '音效已开启...';
            
            setTimeout(() => {
                startGame();
            }, 1000);
        });
        
        // 关闭音效按钮点击事件
        disableAudioBtn.addEventListener('click', function() {
            audioModule.setEnabled(false);
            
            // 更新显示屏文字
            const screenText = document.querySelector('.text');
            screenText.textContent = '静音模式...';
            
            setTimeout(() => {
                startGame();
            }, 1000);
        });
        
        // 开始游戏函数
        function startGame() {
            // 隐藏音效选择界面，显示首页
            sceneModule.switchScene(audioChoice, homepage, {
                onComplete: () => {
                    audioChoice.style.display = 'none';
                    // 显示首页的全局音效开关
                    const homepageAudioToggle = document.getElementById('homepage-audio-toggle');
                    if (homepageAudioToggle) {
                        homepageAudioToggle.classList.remove('hidden');
                    }
                    // 开始首页动画序列
                    initPageAnimation();
                }
            });
        }
        
        // 传送门点击事件处理
        portalContainer.addEventListener('click', function() {
            startPortalAnimation();
        });
        
        // 传送门悬停效果
        portalContainer.addEventListener('mouseenter', function() {
            if (portalContainer.classList.contains('floating')) {
                applyHoverEffect();
            }
        });
        
        portalContainer.addEventListener('mouseleave', function() {
            if (portalContainer.classList.contains('floating')) {
                removeHoverEffect();
            }
        });
        
        // 应用悬停效果的函数
        function applyHoverEffect() {
            gsap.to(portalContainer, {
                duration: 0.3,
                scale: 1.1,
                ease: "power2.out"
            });
            portalContainer.style.filter = 'drop-shadow(0 0 10px #40ff00ff) drop-shadow(0 0 20px #77ff00ff) drop-shadow(0 0 40px #ccff00ff)';
        }
        
        // 移除悬停效果的函数
        function removeHoverEffect() {
            gsap.to(portalContainer, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            });
            portalContainer.style.filter = 'none';
        }
        
        // 传送门动画函数
        function startPortalAnimation() {
            audioModule.stopBGM();
            portalContainer.classList.remove('floating');
            
            const backgroundContainer = document.querySelector('.background-container');
            const guideText = document.querySelector('.guide-text');
            
            // 创建淡出黑屏效果元素
            const fadeElement = document.createElement('div');
            fadeElement.className = 'fade-black';
            const mainViewport = document.querySelector('.main-viewport');
            mainViewport.appendChild(fadeElement);
            
            // 使用GSAP创建传送门冲入动画时间轴
            const timeline = gsap.timeline({
                onComplete: function() {
                    showChapter1Scene1();
                }
            });
            
            // 宇宙背景和引导文字立即开始淡出
            timeline.to([backgroundContainer, guideText], {
                duration: 0.6,
                opacity: 0,
                ease: "power2.out"
            });
            
            // 传送门放大动画
            timeline.to(portalContainer, {
                duration: 0.8,
                scale: 15,
                ease: "power2.in",
                onUpdate: function() {
                    const progress = this.progress();
                    const blurAmount = progress * 4;
                    portalContainer.style.filter = `blur(${blurAmount}px)`;
                }
            }, "-=0.4");
            
            // 传送门淡出动画
            timeline.to(portalContainer, {
                duration: 0.4,
                opacity: 0,
                ease: "power2.out"
            }, "-=0.4");
            
            // 淡出黑屏效果动画
            timeline.to(fadeElement, {
                duration: 0.5,
                opacity: 1,
                ease: "power2.out"
            }, "-=0.2");
            
            // 黑屏保持一段时间后消失
            timeline.to(fadeElement, {
                duration: 0.3,
                opacity: 0,
                ease: "power2.out",
                onComplete: function() {
                    mainViewport.removeChild(fadeElement);
                }
            });
        }
        
        // 显示第一幕视频页面
        function showChapter1Scene1() {
            portalContainer.style.filter = 'none';
            
            sceneModule.switchScene(homepage, chapter1Scene1, {
                onComplete: () => {
                    homepage.style.display = 'none';
                    // 直接开始播放视频（带控制按钮）
                    videoModule.playVideoById('opening-video', 'skip-video-btn', audioModule.isEnabled(), () => {
                        PlayProgress.markSceneViewed('chapter1-opening');
                        showTransitionGuide();
                    }, {
                        controlsId: 'opening-video-controls',
                        pauseBtnId: 'opening-pause-btn',
                        speedBtnId: 'opening-speed-btn'
                    }, 'chapter1-opening');
                }
            });
        }
        
        // 显示过渡引导界面
        function showTransitionGuide() {
            PlayProgress.markSceneViewed('chapter1-transition');
            sceneModule.showScene(transitionGuide, 1.0).then(() => {
                chapter1Scene1.classList.add('hidden');
                chapter1Scene1.style.display = 'none';
                
                // 添加点击事件监听器（使用 once: true 自动移除）
                transitionGuide.addEventListener('click', startChapter2, { once: true });
            });
        }
        
        // 开始第二幕
        function startChapter2() {
            sceneModule.switchScene(transitionGuide, chapter2Scene1, {
                onComplete: () => {
                    transitionGuide.style.display = 'none';
                    // 直接开始播放车库视频（带控制按钮）
                    videoModule.playVideoById('garage-video', 'skip-garage-btn', audioModule.isEnabled(), () => {
                        PlayProgress.markSceneViewed('chapter2-garage');
                        showSearchScene();
                    }, {
                        controlsId: 'garage-video-controls',
                        pauseBtnId: 'garage-pause-btn',
                        speedBtnId: 'garage-speed-btn'
                    }, 'chapter2-garage');
                }
            });
        }
        
        // 显示搜索神秘人场景
        function showSearchScene() {
            sceneModule.switchScene(chapter2Scene1, chapter2Scene2, {
                onComplete: () => {
                    chapter2Scene1.style.display = 'none';
                    
                    // 开始播放首页BGM（如果音效开启）
                    if (audioModule.isEnabled()) {
                        audioModule.playBGM();
                    }
                    
                    // 设置衣服点击事件（先移除旧的监听器，防止累积）
                    if (clothesArea) {
                        clothesArea.removeEventListener('click', onClothesClick);
                        clothesArea.addEventListener('click', onClothesClick);
                    }
                }
            });
        }
        
        // 衣服点击事件处理
        function onClothesClick() {
            // 移除点击区域
            clothesArea.style.display = 'none';
            
            // 显示对话系统
            setTimeout(() => {
                showDialogSystem();
            }, 150);
        }
        
        // 显示对话系统
        function showDialogSystem() {
            sceneModule.switchScene(chapter2Scene2, dialogSystem, {
                onComplete: () => {
                    chapter2Scene2.style.display = 'none';
                    
                    // 继续播放首页BGM（如果音效开启且BGM未播放）
                    if (audioModule.isEnabled() && audioModule.isBGMPaused()) {
                        audioModule.playBGM();
                    }
                    
                    // 开始对话序列
                    startDialogSequence();
                }
            });
        }
        
        // 对话相关变量
        let currentDialogIndex = 0;
        
        // 道具导航事件
        if (prevEvidenceBtn) {
            prevEvidenceBtn.addEventListener('click', function() {
                evidenceModule.navigate('prev', {
                    imageElement: evidenceImage,
                    counterElement: evidenceCounter,
                    prevBtn: prevEvidenceBtn,
                    nextBtn: nextEvidenceBtn
                });
            });
        }
        
        if (nextEvidenceBtn) {
            nextEvidenceBtn.addEventListener('click', function() {
                evidenceModule.navigate('next', {
                    imageElement: evidenceImage,
                    counterElement: evidenceCounter,
                    prevBtn: prevEvidenceBtn,
                    nextBtn: nextEvidenceBtn
                });
            });
        }
        
        // ========== 第二幕对话系统（带回退/前进功能）==========
        // 创建对话历史实例
        const chapter2DialogHistory = new DialogHistory();
        let chapter2IsNavigating = false;
        let chapter2CurrentClickHandler = null; // 当前的点击处理函数（用于清理）
        
        // 获取回退/前进按钮
        const backDialogBtn = document.getElementById('back-dialog-btn');
        const forwardDialogBtn = document.getElementById('forward-dialog-btn');
        
        // 更新导航按钮状态
        function updateChapter2NavButtons() {
            if (backDialogBtn) {
                backDialogBtn.disabled = !chapter2DialogHistory.canBack();
                backDialogBtn.style.opacity = chapter2DialogHistory.canBack() ? '1' : '0.5';
            }
            if (forwardDialogBtn) {
                // 前进按钮只在回看模式下可用
                const canForward = chapter2DialogHistory.canForward();
                forwardDialogBtn.disabled = !canForward;
                forwardDialogBtn.style.opacity = canForward ? '1' : '0.5';
            }
        }
        
        // 恢复对话的完整状态（立绘、道具等）
        function restoreChapter2DialogState(dialog) {
            if (!dialog) return;
            
            // 恢复说话人和文本
            if (speakerName) speakerName.textContent = dialog.speaker || '';
            if (dialogText) dialogText.textContent = dialog.text || '';
            
            // 恢复立绘
            if (dialog.character) {
                dialogModule.updatePortraits(
                    dialog.character,
                    dialog.characterImage,
                    { rick: rickPortrait, morty: mortyPortrait }
                );
            }
            
            // 恢复道具状态
            if (dialog.evidenceIndex !== undefined) {
                evidenceModule.setCurrentIndex(dialog.evidenceIndex);
                evidenceModule.updateDisplay({
                    imageElement: evidenceImage,
                    counterElement: evidenceCounter,
                    prevBtn: prevEvidenceBtn,
                    nextBtn: nextEvidenceBtn
                });
            }
            
            updateChapter2NavButtons();
        }
        
        // 回退到上一条对话
        function chapter2GoBack() {
            if (!chapter2DialogHistory.canBack()) return;
            chapter2IsNavigating = true;
            const prevDialog = chapter2DialogHistory.back();
            if (prevDialog) restoreChapter2DialogState(prevDialog);
            setTimeout(() => { chapter2IsNavigating = false; }, 50);
        }
        
        // 前进到下一条对话（只在回看模式下可用）
        function chapter2GoForward() {
            // 只有在回看模式下才能使用前进按钮
            if (!chapter2DialogHistory.isReviewing || !chapter2DialogHistory.canForward()) return;
            
            chapter2IsNavigating = true;
            const nextDialog = chapter2DialogHistory.forward();
            if (nextDialog) {
                restoreChapter2DialogState(nextDialog);
            }
            setTimeout(() => { chapter2IsNavigating = false; }, 50);
        }
        
        // 绑定回退/前进按钮事件
        if (backDialogBtn) {
            backDialogBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                chapter2GoBack();
            });
        }
        if (forwardDialogBtn) {
            forwardDialogBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                chapter2GoForward();
            });
        }
        
        // 开始对话序列
        function startDialogSequence() {
            // 清空历史
            chapter2DialogHistory.clear();
            currentDialogIndex = 0;
            
            // 显示道具
            evidenceModule.showEvidenceDisplay(evidenceDisplay);
            evidenceModule.updateDisplay({
                imageElement: evidenceImage,
                counterElement: evidenceCounter,
                prevBtn: prevEvidenceBtn,
                nextBtn: nextEvidenceBtn
            });
            
            // 延迟显示对话框
            setTimeout(() => {
                dialogBox.classList.add('show');
                updateChapter2NavButtons();
                
                // 开始第一段对话
                setTimeout(() => {
                    showNextDialog();
                }, 150);
            }, 150);
        }
        
        // 显示下一段对话
        async function showNextDialog() {
            // 如果在回看模式，先退出
            if (chapter2DialogHistory.isReviewing) chapter2DialogHistory.exitReview();
            
            if (currentDialogIndex >= DialogData.chapter2.length) {
                // 对话结束，标记场景已看完，进入第三幕
                PlayProgress.markSceneViewed('chapter2-search');
                setTimeout(() => {
                    showChapter3();
                }, 150);
                return;
            }
            
            const dialog = DialogData.chapter2[currentDialogIndex];
            
            // 记录对话进度和历史
            PlayProgress.markDialogProgress('chapter2-search', currentDialogIndex);
            chapter2DialogHistory.push({
                ...dialog,
                evidenceIndex: dialog.evidenceIndex
            });
            
            // 检查是否需要解锁新道具
            if (dialog.unlockEvidence !== undefined) {
                evidenceModule.unlock(dialog.unlockEvidence);
            }
            
            // 更新道具显示
            if (dialog.evidenceIndex !== undefined) {
                evidenceModule.setCurrentIndex(dialog.evidenceIndex);
                evidenceModule.updateDisplay({
                    imageElement: evidenceImage,
                    counterElement: evidenceCounter,
                    prevBtn: prevEvidenceBtn,
                    nextBtn: nextEvidenceBtn
                });
            }
            
            // 播放音效（如果有）
            if (dialog.playSfx) {
                audioModule.play(dialog.playSfx);
            }
            
            // 使用对话模块显示对话
            await dialogModule.showDialog({
                speakerElement: speakerName,
                textElement: dialogText,
                text: dialog.text,
                speaker: dialog.speaker,
                character: dialog.character,
                characterImage: dialog.characterImage,
                portraitElements: {
                    rick: rickPortrait,
                    morty: mortyPortrait
                }
            });
            
            // 更新导航按钮状态
            updateChapter2NavButtons();
            
            currentDialogIndex++;
            
            // 等待用户点击继续（但要检查是否进入了回看模式）
            await new Promise((resolve) => {
                // 先清理之前的点击监听器（如果存在）
                if (chapter2CurrentClickHandler) {
                    dialogBox.removeEventListener('click', chapter2CurrentClickHandler);
                }
                
                const clickHandler = (event) => {
                    // 如果正在处理导航按钮点击，忽略
                    if (chapter2IsNavigating) return;
                    // 如果点击的是导航按钮，忽略
                    if (event.target === backDialogBtn || event.target === forwardDialogBtn || event.target === skipDialogBtn) return;
                    // 如果打字机效果还在进行，不响应
                    if (dialogModule.isTyping) return;
                    
                    // 如果进入了回看模式，点击对话框前进到下一条历史记录
                    if (chapter2DialogHistory.isReviewing) {
                        if (chapter2DialogHistory.canForward()) {
                            const nextDialog = chapter2DialogHistory.forward();
                            if (nextDialog) {
                                restoreChapter2DialogState(nextDialog);
                            }
                        }
                        // 回看模式下不推进新对话，保持监听
                        return;
                    }
                    
                    dialogBox.removeEventListener('click', clickHandler);
                    chapter2CurrentClickHandler = null;
                    resolve();
                };
                chapter2CurrentClickHandler = clickHandler;
                dialogBox.addEventListener('click', clickHandler);
            });
            showNextDialog();
        }
        
        // 跳过对话按钮事件
        const skipDialogBtn = document.getElementById('skip-dialog-btn');
        if (skipDialogBtn) {
            skipDialogBtn.addEventListener('click', function(event) {
                event.stopPropagation();
                // 一周目保护：检查是否可以跳过
                if (!PlayProgress.canSkipDialog('chapter2-search', DialogData.chapter2.length - 1)) {
                    if (window.showSkipToast) {
                        window.showSkipToast('请先完整观看一次');
                    }
                    return;
                }
                // 清理当前的点击监听器
                if (chapter2CurrentClickHandler) {
                    dialogBox.removeEventListener('click', chapter2CurrentClickHandler);
                    chapter2CurrentClickHandler = null;
                }
                currentDialogIndex = DialogData.chapter2.length;
                PlayProgress.markSceneViewed('chapter2-search');
                setTimeout(() => {
                    showChapter3();
                }, 150);
            });
        }
        
        // 显示第三幕
        function showChapter3() {
            audioModule.stopBGM();
            
            sceneModule.switchScene(dialogSystem, chapter3Scene1, {
                onComplete: () => {
                    dialogSystem.style.display = 'none';
                    // 直接开始播放第三幕视频（带控制按钮）
                    videoModule.playVideoById('chapter3-video', 'skip-chapter3-btn', audioModule.isEnabled(), () => {
                        PlayProgress.markSceneViewed('chapter3-crisis');
                        showChapter3DoorScene();
                    }, {
                        controlsId: 'chapter3-video-controls',
                        pauseBtnId: 'chapter3-pause-btn',
                        speedBtnId: 'chapter3-speed-btn'
                    }, 'chapter3-crisis');
                }
            });
        }
        
        // 显示第三幕家门口场景
        function showChapter3DoorScene() {
            sceneModule.switchScene(chapter3Scene1, chapter3Scene2, {
                onComplete: () => {
                    chapter3Scene1.style.display = 'none';
                    // 播放轻松BGM
                    audioModule.playBGM('relaxed');
                    setTimeout(() => {
                        startChapter3DoorDialog();
                    }, 150);
                }
            });
        }
        
        // ========== 通用对话场景管理器 ==========
        // 用于管理所有对话场景，减少重复代码
        // 支持：基本对话、道具系统、背景切换、黑幕报幕、覆盖层、点击区域、视频触发
        function createDialogScene(config) {
            const {
                sceneId,              // 场景ID（用于进度追踪）
                dialogData,           // 对话数据数组
                dialogBoxId,          // 对话框ID
                speakerNameId,        // 说话人名称ID
                dialogTextId,         // 对话文本ID
                skipBtnId,            // 跳过按钮ID
                backBtnId,            // 回退按钮ID（可选）
                forwardBtnId,         // 前进按钮ID（可选）
                rickPortraitId,       // Rick立绘ID（可选）
                mortyPortraitId,      // Morty立绘ID（可选）
                evidenceModule,       // 道具模块实例（可选）
                evidenceDisplayId,    // 道具展示区域ID（可选）
                evidenceImageId,      // 道具图片ID（可选）
                evidenceCounterId,    // 道具计数器ID（可选）
                prevEvidenceBtnId,    // 上一个道具按钮ID（可选）
                nextEvidenceBtnId,    // 下一个道具按钮ID（可选）
                backgroundImgId,      // 背景图片ID（可选，用于背景切换）
                blackscreenId,        // 黑幕元素ID（可选）
                blackscreenTextId,    // 黑幕文字ID（可选）
                watchingOverlayId,    // 观看覆盖层ID（可选）
                popupOverlayId,       // 弹窗覆盖层ID（可选）
                popupImageId,         // 弹窗图片ID（可选）
                onClickArea,          // 点击区域回调（可选）
                onTriggerVideo,       // 触发视频回调（可选）
                onSkip,               // 跳过时的额外清理回调（可选）
                onComplete            // 对话结束回调
            } = config;
            
            let currentIndex = 0;
            let waitingForClickArea = null; // 等待点击的区域ID
            let currentClickHandler = null; // 当前的点击处理函数（用于清理）
            
            // 创建对话历史实例
            const dialogHistory = new DialogHistory();
            
            // 场景标识（用于进度追踪）
            const currentSceneId = sceneId || dialogBoxId;
            
            // 获取DOM元素
            const dialogBox = document.getElementById(dialogBoxId);
            const speakerName = document.getElementById(speakerNameId);
            const dialogText = document.getElementById(dialogTextId);
            const skipBtn = document.getElementById(skipBtnId);
            const backBtn = backBtnId ? document.getElementById(backBtnId) : null;
            const forwardBtn = forwardBtnId ? document.getElementById(forwardBtnId) : null;
            
            // 立绘元素（可选）
            const rickPortrait = rickPortraitId ? document.getElementById(rickPortraitId) : null;
            const mortyPortrait = mortyPortraitId ? document.getElementById(mortyPortraitId) : null;
            const portraitElements = (rickPortrait || mortyPortrait) ? { rick: rickPortrait, morty: mortyPortrait } : null;
            
            // 道具元素（可选）
            const evidenceDisplay = evidenceDisplayId ? document.getElementById(evidenceDisplayId) : null;
            const evidenceImage = evidenceImageId ? document.getElementById(evidenceImageId) : null;
            const evidenceCounter = evidenceCounterId ? document.getElementById(evidenceCounterId) : null;
            const prevEvidenceBtn = prevEvidenceBtnId ? document.getElementById(prevEvidenceBtnId) : null;
            const nextEvidenceBtn = nextEvidenceBtnId ? document.getElementById(nextEvidenceBtnId) : null;
            
            // 扩展元素（可选）
            const backgroundImg = backgroundImgId ? document.getElementById(backgroundImgId) : null;
            const blackscreen = blackscreenId ? document.getElementById(blackscreenId) : null;
            const blackscreenText = blackscreenTextId ? document.getElementById(blackscreenTextId) : null;
            const watchingOverlay = watchingOverlayId ? document.getElementById(watchingOverlayId) : null;
            const popupOverlay = popupOverlayId ? document.getElementById(popupOverlayId) : null;
            const popupImage = popupImageId ? document.getElementById(popupImageId) : null;
            
            // 更新回退/前进按钮状态
            function updateNavigationButtons() {
                if (backBtn) {
                    backBtn.disabled = !dialogHistory.canBack();
                    backBtn.style.opacity = dialogHistory.canBack() ? '1' : '0.5';
                }
                if (forwardBtn) {
                    // 前进按钮只在回看模式下可用
                    const canForward = dialogHistory.canForward();
                    forwardBtn.disabled = !canForward;
                    forwardBtn.style.opacity = canForward ? '1' : '0.5';
                }
            }
            
            // 恢复对话的完整状态（立绘、道具、背景等）
            function restoreDialogState(dialog) {
                if (!dialog) return;
                
                // 恢复说话人和文本
                if (speakerName) speakerName.textContent = dialog.speaker || '';
                if (dialogText) dialogText.textContent = dialog.text || '';
                
                // 恢复立绘
                if (portraitElements && dialog.character) {
                    dialogModule.updatePortraits(
                        dialog.character,
                        dialog.characterImage,
                        portraitElements
                    );
                }
                
                // 恢复背景
                if (dialog.background && backgroundImg) {
                    backgroundImg.src = dialog.background;
                }
                
                // 恢复道具显示
                if (evidenceModule && evidenceDisplay) {
                    if (dialog.evidenceIndex !== undefined) {
                        evidenceModule.setCurrentIndex(dialog.evidenceIndex);
                        evidenceModule.updateDisplay({
                            imageElement: evidenceImage,
                            counterElement: evidenceCounter,
                            prevBtn: prevEvidenceBtn,
                            nextBtn: nextEvidenceBtn
                        });
                        evidenceModule.showEvidenceDisplay(evidenceDisplay);
                    }
                }
                
                // 恢复覆盖层状态
                if (watchingOverlay) {
                    if (dialog.showWatching) {
                        watchingOverlay.classList.add('show');
                    } else if (dialog.hideWatching) {
                        watchingOverlay.classList.remove('show');
                    }
                }
                
                updateNavigationButtons();
            }
            
            // 标记是否正在处理导航按钮点击（防止事件冒泡触发对话前进）
            let isNavigating = false;
            
            // 回退到上一条对话
            function goBack() {
                if (!dialogHistory.canBack()) return;
                isNavigating = true;
                const prevDialog = dialogHistory.back();
                if (prevDialog) restoreDialogState(prevDialog);
                // 短暂延迟后重置标记
                setTimeout(() => { isNavigating = false; }, 50);
            }
            
            // 前进到下一条对话（只在回看模式下可用）
            function goForward() {
                // 只有在回看模式下才能使用前进按钮
                if (!dialogHistory.isReviewing || !dialogHistory.canForward()) return;
                
                isNavigating = true;
                const nextDialog = dialogHistory.forward();
                if (nextDialog) {
                    restoreDialogState(nextDialog);
                }
                setTimeout(() => { isNavigating = false; }, 50);
            }
            
            // 显示下一段对话
            async function showNextDialog() {
                if (dialogHistory.isReviewing) dialogHistory.exitReview();
                
                if (currentIndex >= dialogData.length) {
                    PlayProgress.markSceneViewed(currentSceneId);
                    if (onComplete) {
                        setTimeout(onComplete, 300);
                    }
                    return;
                }
                
                const dialog = dialogData[currentIndex];
                
                // 记录对话进度
                PlayProgress.markDialogProgress(currentSceneId, currentIndex);
                
                // 保存当前背景状态到历史（用于回退时恢复）
                const currentBackground = backgroundImg ? backgroundImg.src : null;
                dialogHistory.push({
                    ...dialog,
                    background: dialog.changeBackground || currentBackground,
                    evidenceIndex: dialog.evidenceIndex
                });
                
                // 处理黑幕报幕（特殊流程，需要提前返回）
                if (dialog.character === 'blackscreen' && blackscreen && blackscreenText) {
                    dialogBox.classList.remove('show');
                    blackscreen.style.display = 'flex';
                    blackscreenText.textContent = '';
                    blackscreenText.style.opacity = 0;
                    
                    gsap.to(blackscreen, {
                        duration: 0.5,
                        opacity: 1,
                        onComplete: () => {
                            setTimeout(() => {
                                // 在纯黑时切换背景
                                if (dialog.changeBackground && backgroundImg) {
                                    backgroundImg.src = dialog.changeBackground;
                                    // 如果切换到餐厅场景，停止战斗BGM，播放吃饭BGM
                                    if (dialog.changeBackground.includes('restaurant')) {
                                        audioModule.stopBGM();
                                        audioModule.playBGM('dining');
                                    }
                                }
                                // 显示报幕文字
                                blackscreenText.textContent = dialog.blackscreenText;
                                gsap.to(blackscreenText, {
                                    duration: 0.5,
                                    opacity: 1,
                                    onComplete: () => {
                                        setTimeout(() => {
                                            gsap.to(blackscreenText, {
                                                duration: 0.5,
                                                opacity: 0,
                                                onComplete: () => {
                                                    gsap.to(blackscreen, {
                                                        duration: 0.5,
                                                        opacity: 0,
                                                        onComplete: () => {
                                                            blackscreen.style.display = 'none';
                                                            blackscreenText.textContent = '';
                                                            currentIndex++;
                                                            dialogText.textContent = '';
                                                            setTimeout(() => {
                                                                dialogBox.classList.add('show');
                                                                setTimeout(showNextDialog, 150);
                                                            }, 150);
                                                        }
                                                    });
                                                }
                                            });
                                        }, 2000);
                                    }
                                });
                            }, 2000);
                        }
                    });
                    return;
                }
                
                // 处理背景切换
                if (dialog.changeBackground && backgroundImg) {
                    backgroundImg.src = dialog.changeBackground;
                }
                
                // 处理音效播放
                if (dialog.playSfx) {
                    audioModule.play(dialog.playSfx);
                }
                
                // 处理停止BGM
                if (dialog.stopBgm) {
                    audioModule.stopBGM();
                }
                
                // 处理覆盖层显示/隐藏
                if (dialog.showWatching && watchingOverlay) {
                    watchingOverlay.classList.add('show');
                }
                if (dialog.hideWatching && watchingOverlay) {
                    watchingOverlay.classList.remove('show');
                }
                
                // 处理弹窗隐藏
                if (dialog.hidePopup && popupOverlay) {
                    popupOverlay.classList.remove('show');
                }
                
                // 处理道具显示/隐藏
                if (evidenceModule && evidenceDisplay) {
                    if (dialog.hideEvidence) {
                        evidenceModule.hideEvidenceDisplay(evidenceDisplay);
                    }
                    if (dialog.showEvidence) {
                        evidenceModule.showEvidenceDisplay(evidenceDisplay);
                        evidenceModule.updateDisplay({
                            imageElement: evidenceImage,
                            counterElement: evidenceCounter,
                            prevBtn: prevEvidenceBtn,
                            nextBtn: nextEvidenceBtn
                        });
                    }
                    if (dialog.unlockEvidence !== undefined) {
                        evidenceModule.unlock(dialog.unlockEvidence);
                    }
                    if (dialog.evidenceIndex !== undefined) {
                        evidenceModule.setCurrentIndex(dialog.evidenceIndex);
                        evidenceModule.updateDisplay({
                            imageElement: evidenceImage,
                            counterElement: evidenceCounter,
                            prevBtn: prevEvidenceBtn,
                            nextBtn: nextEvidenceBtn
                        });
                    }
                }
                
                // 显示对话
                await dialogModule.showDialog({
                    speakerElement: speakerName,
                    textElement: dialogText,
                    text: dialog.text,
                    speaker: dialog.speaker,
                    character: dialog.character,
                    characterImage: dialog.characterImage,
                    portraitElements: portraitElements
                });
                
                // 更新导航按钮状态
                updateNavigationButtons();
                
                currentIndex++;
                
                // 检查是否触发视频
                if (dialog.triggerVideo && onTriggerVideo) {
                    dialogBox.classList.remove('show');
                    setTimeout(onTriggerVideo, 150);
                    return;
                }
                
                // 检查是否需要显示点击区域
                if (dialog.showClickArea && onClickArea) {
                    const clickAreaElement = document.getElementById(dialog.showClickArea);
                    if (clickAreaElement) {
                        clickAreaElement.style.display = 'block';
                        waitingForClickArea = dialog.showClickArea;
                        // 禁用对话框点击，只能通过点击区域继续
                        dialogBox.style.pointerEvents = 'none';
                        return; // 等待点击后继续
                    }
                }
                
                // 等待用户点击继续（但要检查是否进入了回看模式）
                await new Promise((resolve) => {
                    // 先清理之前的点击监听器（如果存在）
                    if (currentClickHandler) {
                        dialogBox.removeEventListener('click', currentClickHandler);
                    }
                    
                    const clickHandler = (event) => {
                        // 如果正在处理导航按钮点击，忽略
                        if (isNavigating) return;
                        // 如果点击的是导航按钮，忽略
                        if (event.target === backBtn || event.target === forwardBtn || event.target === skipBtn) return;
                        // 如果打字机效果还在进行，不响应
                        if (dialogModule.isTyping) return;
                        
                        // 如果进入了回看模式，点击对话框前进到下一条历史记录
                        if (dialogHistory.isReviewing) {
                            if (dialogHistory.canForward()) {
                                const nextDialog = dialogHistory.forward();
                                if (nextDialog) {
                                    restoreDialogState(nextDialog);
                                }
                            }
                            // 回看模式下不推进新对话，保持监听
                            return;
                        }
                        
                        dialogBox.removeEventListener('click', clickHandler);
                        currentClickHandler = null;
                        resolve();
                    };
                    currentClickHandler = clickHandler;
                    dialogBox.addEventListener('click', clickHandler);
                });
                showNextDialog();
            }
            
            // 点击区域被点击后继续对话
            function continueAfterClick() {
                waitingForClickArea = null;
                // 恢复对话框点击
                dialogBox.style.pointerEvents = 'auto';
                // 重新显示对话框
                dialogBox.classList.add('show');
                setTimeout(showNextDialog, 150);
            }
            
            // 开始对话
            function start() {
                dialogBox.classList.add('show');
                updateNavigationButtons();
                setTimeout(showNextDialog, 150);
            }
            
            // 查找下一个跳过点（点击区域、黑幕、视频触发）
            function findNextSkipPoint(fromIndex) {
                for (let i = fromIndex; i < dialogData.length; i++) {
                    const dialog = dialogData[i];
                    // 跳过点：点击区域、黑幕报幕、视频触发
                    if (dialog.showClickArea || dialog.character === 'blackscreen' || dialog.triggerVideo) {
                        return i;
                    }
                }
                return -1; // 没有找到跳过点，返回-1表示跳到结尾
            }
            
            // 快速应用对话的状态变化（跳过时使用）
            function applyDialogState(dialog) {
                // 处理背景切换
                if (dialog.changeBackground && backgroundImg) {
                    backgroundImg.src = dialog.changeBackground;
                }
                
                // 处理覆盖层显示/隐藏
                if (dialog.showWatching && watchingOverlay) {
                    watchingOverlay.classList.add('show');
                }
                if (dialog.hideWatching && watchingOverlay) {
                    watchingOverlay.classList.remove('show');
                }
                
                // 处理弹窗隐藏
                if (dialog.hidePopup && popupOverlay) {
                    popupOverlay.classList.remove('show');
                }
                
                // 处理道具显示/隐藏
                if (evidenceModule && evidenceDisplay) {
                    if (dialog.hideEvidence) {
                        evidenceModule.hideEvidenceDisplay(evidenceDisplay);
                    }
                    if (dialog.showEvidence) {
                        evidenceModule.showEvidenceDisplay(evidenceDisplay);
                    }
                    if (dialog.unlockEvidence !== undefined) {
                        evidenceModule.unlock(dialog.unlockEvidence);
                    }
                    if (dialog.evidenceIndex !== undefined) {
                        evidenceModule.setCurrentIndex(dialog.evidenceIndex);
                    }
                }
                
                // 记录到历史（跳过的对话也要记录）
                dialogHistory.push(dialog);
            }
            
            // 跳过对话（跳到下一个跳过点）
            function skip() {
                // 一周目保护：检查是否可以跳过
                if (!PlayProgress.canSkipDialog(currentSceneId, dialogData.length - 1)) {
                    console.log('一周目未看完，不能跳过');
                    // 显示不可跳过提示
                    if (window.showSkipToast) {
                        window.showSkipToast('请先完整观看一次');
                    }
                    return false;
                }
                
                // 清理当前的点击监听器（防止跳过后残留）
                if (currentClickHandler) {
                    dialogBox.removeEventListener('click', currentClickHandler);
                    currentClickHandler = null;
                }
                
                // 查找下一个跳过点
                const nextSkipPoint = findNextSkipPoint(currentIndex);
                
                if (nextSkipPoint === -1) {
                    // 没有跳过点了，跳到结尾
                    for (let i = currentIndex; i < dialogData.length; i++) {
                        applyDialogState(dialogData[i]);
                    }
                    if (evidenceModule && evidenceDisplay) {
                        evidenceModule.updateDisplay({
                            imageElement: evidenceImage,
                            counterElement: evidenceCounter,
                            prevBtn: prevEvidenceBtn,
                            nextBtn: nextEvidenceBtn
                        });
                    }
                    currentIndex = dialogData.length;
                    if (onSkip) onSkip();
                    PlayProgress.markSceneViewed(currentSceneId);
                    if (onTriggerVideo) {
                        dialogBox.classList.remove('show');
                        setTimeout(onTriggerVideo, 150);
                    } else if (onComplete) {
                        setTimeout(onComplete, 150);
                    }
                } else {
                    for (let i = currentIndex; i <= nextSkipPoint; i++) {
                        applyDialogState(dialogData[i]);
                    }
                    if (evidenceModule && evidenceDisplay) {
                        evidenceModule.updateDisplay({
                            imageElement: evidenceImage,
                            counterElement: evidenceCounter,
                            prevBtn: prevEvidenceBtn,
                            nextBtn: nextEvidenceBtn
                        });
                    }
                    
                    currentIndex = nextSkipPoint;
                    const dialog = dialogData[currentIndex];
                    
                    if (dialog.showClickArea && onClickArea) {
                        const clickAreaElement = document.getElementById(dialog.showClickArea);
                        if (clickAreaElement) {
                            clickAreaElement.style.display = 'block';
                            waitingForClickArea = dialog.showClickArea;
                            dialogBox.classList.remove('show');
                            currentIndex++;
                        }
                    } else if (dialog.character === 'blackscreen') {
                        showNextDialog();
                    } else if (dialog.triggerVideo && onTriggerVideo) {
                        dialogBox.classList.remove('show');
                        setTimeout(onTriggerVideo, 150);
                    }
                }
                return true;
            }
            
            // 创建命名的事件处理函数（用于移除）
            const skipHandler = (event) => {
                event.stopPropagation();
                skip();
            };
            const backHandler = (event) => {
                event.stopPropagation();
                goBack();
            };
            const forwardHandler = (event) => {
                event.stopPropagation();
                goForward();
            };
            
            // 存储处理函数引用到按钮元素上（用于后续移除）
            if (skipBtn) {
                // 移除旧的监听器（如果存在）
                if (skipBtn._skipHandler) {
                    skipBtn.removeEventListener('click', skipBtn._skipHandler);
                }
                skipBtn._skipHandler = skipHandler;
                skipBtn.addEventListener('click', skipHandler);
            }
            
            // 绑定回退按钮
            if (backBtn) {
                if (backBtn._backHandler) {
                    backBtn.removeEventListener('click', backBtn._backHandler);
                }
                backBtn._backHandler = backHandler;
                backBtn.addEventListener('click', backHandler);
            }
            
            // 绑定前进按钮
            if (forwardBtn) {
                if (forwardBtn._forwardHandler) {
                    forwardBtn.removeEventListener('click', forwardBtn._forwardHandler);
                }
                forwardBtn._forwardHandler = forwardHandler;
                forwardBtn.addEventListener('click', forwardHandler);
            }
            
            // 获取当前等待的点击区域
            function getWaitingClickArea() {
                return waitingForClickArea;
            }
            
            // 获取对话历史
            function getHistory() {
                return dialogHistory;
            }
            
            return { 
                start, 
                skip, 
                showNextDialog, 
                continueAfterClick, 
                getWaitingClickArea,
                goBack,
                goForward,
                getHistory
            };
        }
        
        // ========== 第三幕门口对话 ==========
        let doorDialogScene = null;
        
        function startChapter3DoorDialog() {
            doorDialogScene = createDialogScene({
                sceneId: 'chapter3-door',
                dialogData: DialogData.chapter3Door,
                dialogBoxId: 'chapter3-dialog-box',
                speakerNameId: 'chapter3-speaker-name',
                dialogTextId: 'chapter3-dialog-text',
                skipBtnId: 'skip-chapter3-dialog-btn',
                backBtnId: 'back-chapter3-dialog-btn',
                forwardBtnId: 'forward-chapter3-dialog-btn',
                onComplete: () => {
                    // 门口对话结束，显示门的交互
                    const dialogBox = document.getElementById('chapter3-dialog-box');
                    dialogBox.classList.remove('show');
                    
                    const doorArea = document.getElementById('door-area');
                    doorArea.style.display = 'block';
                    // 先移除旧的监听器，防止累积
                    doorArea.removeEventListener('click', onDoorClick);
                    doorArea.addEventListener('click', onDoorClick);
                }
            });
            doorDialogScene.start();
        }
        
        // 门点击事件处理
        function onDoorClick() {
            const doorArea = document.getElementById('door-area');
            doorArea.style.display = 'none';
            // 播放开门音效
            audioModule.play('door-open');
            setTimeout(showChapter3RoomScene, 150);
        }
        
        // ========== 第三幕房间内场景 ==========
        let roomDialogScene = null;
        
        function showChapter3RoomScene() {
            sceneModule.switchScene(chapter3Scene2, chapter3Scene3, {
                onComplete: () => {
                    chapter3Scene2.style.display = 'none';
                    setTimeout(startChapter3RoomDialog, 250);
                }
            });
        }
        
        function startChapter3RoomDialog() {
            roomDialogScene = createDialogScene({
                sceneId: 'chapter3-room',
                dialogData: DialogData.chapter3Room,
                dialogBoxId: 'chapter3-room-dialog-box',
                speakerNameId: 'chapter3-room-speaker-name',
                dialogTextId: 'chapter3-room-dialog-text',
                skipBtnId: 'skip-chapter3-room-dialog-btn',
                backBtnId: 'back-chapter3-room-dialog-btn',
                forwardBtnId: 'forward-chapter3-room-dialog-btn',
                onComplete: showChapter3KitchenScene
            });
            roomDialogScene.start();
        }
        
        // ========== 第三幕厨房场景 ==========
        let kitchenDialogScene = null;
        
        function showChapter3KitchenScene() {
            sceneModule.switchScene(chapter3Scene3, chapter3Scene4, {
                onComplete: () => {
                    chapter3Scene3.style.display = 'none';
                    setTimeout(startChapter3KitchenDialog, 250);
                }
            });
        }
        
        function startChapter3KitchenDialog() {
            kitchenDialogScene = createDialogScene({
                sceneId: 'chapter3-kitchen',
                dialogData: DialogData.chapter3Kitchen,
                dialogBoxId: 'chapter3-kitchen-dialog-box',
                speakerNameId: 'chapter3-kitchen-speaker-name',
                dialogTextId: 'chapter3-kitchen-dialog-text',
                skipBtnId: 'skip-chapter3-kitchen-dialog-btn',
                backBtnId: 'back-chapter3-kitchen-dialog-btn',
                forwardBtnId: 'forward-chapter3-kitchen-dialog-btn',
                rickPortraitId: 'chapter3-rick-portrait',
                mortyPortraitId: 'chapter3-morty-portrait',
                onComplete: showChapter3LivingScene
            });
            kitchenDialogScene.start();
        }
        
        // ========== 第三幕客厅场景 ==========
        const chapter3Scene5 = document.getElementById('chapter3-scene5');
        const livingEvidenceModule = new EvidenceModule(LivingEvidenceData);
        let livingDialogScene = null;
        
        function showChapter3LivingScene() {
            sceneModule.switchScene(chapter3Scene4, chapter3Scene5, {
                onComplete: () => {
                    chapter3Scene4.style.display = 'none';
                    setTimeout(startChapter3LivingDialog, 250);
                }
            });
        }
        
        function startChapter3LivingDialog() {
            livingDialogScene = createDialogScene({
                sceneId: 'chapter3-living',
                dialogData: DialogData.chapter3Living,
                dialogBoxId: 'chapter3-living-dialog-box',
                speakerNameId: 'chapter3-living-speaker-name',
                dialogTextId: 'chapter3-living-dialog-text',
                skipBtnId: 'skip-chapter3-living-dialog-btn',
                backBtnId: 'back-chapter3-living-dialog-btn',
                forwardBtnId: 'forward-chapter3-living-dialog-btn',
                rickPortraitId: 'chapter3-living-rick-portrait',
                mortyPortraitId: 'chapter3-living-morty-portrait',
                evidenceModule: livingEvidenceModule,
                evidenceDisplayId: 'chapter3-evidence-display',
                evidenceImageId: 'chapter3-evidence-image',
                evidenceCounterId: 'chapter3-evidence-counter',
                prevEvidenceBtnId: 'chapter3-prev-evidence',
                nextEvidenceBtnId: 'chapter3-next-evidence',
                onComplete: showChapter3StudyScene
            });
            livingDialogScene.start();
        }
        
        // ========== 第三幕书房场景 ==========
        const chapter3Scene6 = document.getElementById('chapter3-scene6');
        const studyEvidenceModule = new EvidenceModule(StudyEvidenceData);
        let studyDialogScene = null;
        
        function showChapter3StudyScene() {
            sceneModule.switchScene(chapter3Scene5, chapter3Scene6, {
                onComplete: () => {
                    chapter3Scene5.style.display = 'none';
                    setTimeout(startChapter3StudyDialog, 250);
                }
            });
        }
        
        function startChapter3StudyDialog() {
            studyDialogScene = createDialogScene({
                sceneId: 'chapter3-study',
                dialogData: DialogData.chapter3Study,
                dialogBoxId: 'chapter3-study-dialog-box',
                speakerNameId: 'chapter3-study-speaker-name',
                dialogTextId: 'chapter3-study-dialog-text',
                skipBtnId: 'skip-chapter3-study-dialog-btn',
                backBtnId: 'back-chapter3-study-dialog-btn',
                forwardBtnId: 'forward-chapter3-study-dialog-btn',
                rickPortraitId: 'chapter3-study-rick-portrait',
                mortyPortraitId: 'chapter3-study-morty-portrait',
                evidenceModule: studyEvidenceModule,
                evidenceDisplayId: 'chapter3-study-evidence-display',
                evidenceImageId: 'chapter3-study-evidence-image',
                evidenceCounterId: 'chapter3-study-evidence-counter',
                prevEvidenceBtnId: 'chapter3-study-prev-evidence',
                nextEvidenceBtnId: 'chapter3-study-next-evidence',
                onComplete: showChapter4DesktopScene // 书房结束后进入第四幕
            });
            studyDialogScene.start();
        }
        
        // ========== 第四幕：电脑桌面场景 ==========
        const chapter4Scene1 = document.getElementById('chapter4-scene1');
        const chapter4PopupOverlay = document.getElementById('chapter4-popup-overlay');
        const chapter4PopupImage = document.getElementById('chapter4-popup-image');
        const chapter4WatchingOverlay = document.getElementById('chapter4-watching-overlay');
        
        // 显示第四幕电脑桌面场景
        function showChapter4DesktopScene() {
            sceneModule.switchScene(chapter3Scene6, chapter4Scene1, {
                onComplete: () => {
                    chapter3Scene6.style.display = 'none';
                    // 播放电脑开机音效
                    audioModule.play('pc-boot');
                    setTimeout(startChapter4DesktopDialog, 1000);
                }
            });
        }
        
        // 显示弹出图片
        function showPopupImage(imageSrc) {
            chapter4PopupImage.src = imageSrc;
            chapter4PopupOverlay.classList.add('show');
        }
        
        // 隐藏弹出图片
        function hidePopupImage() {
            chapter4PopupOverlay.classList.remove('show');
        }
        
        // 显示Rick和Morty看电脑的大图
        function showWatchingOverlay() {
            chapter4WatchingOverlay.classList.add('show');
        }
        
        // 隐藏Rick和Morty看电脑的大图
        function hideWatchingOverlay() {
            chapter4WatchingOverlay.classList.remove('show');
        }
        
        // 第四幕对话状态
        let chapter4CurrentPhase = 'desktop'; // desktop -> projects -> browser -> recycle -> recipe
        let chapter4DialogIndex = 0;
        let chapter4DialogHistory = []; // 添加对话历史记录
        
        // 开始第四幕桌面对话
        function startChapter4DesktopDialog() {
            chapter4CurrentPhase = 'desktop';
            chapter4DialogIndex = 0;
            chapter4DialogHistory = []; // 重置历史记录
            
            const dialogBox = document.getElementById('chapter4-dialog-box');
            dialogBox.classList.add('show');
            
            // 绑定后退和前进按钮事件
            const backBtn = document.getElementById('back-chapter4-dialog-btn');
            const forwardBtn = document.getElementById('forward-chapter4-dialog-btn');
            
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    if (chapter4DialogIndex > 0) {
                        chapter4DialogIndex--;
                        showNextChapter4Dialog();
                    }
                });
            }
            
            if (forwardBtn) {
                forwardBtn.addEventListener('click', () => {
                    chapter4DialogIndex++;
                    showNextChapter4Dialog();
                });
            }
            
            setTimeout(showNextChapter4Dialog, 500);
        }
        
        // 更新第四幕对话按钮状态
        function updateChapter4DialogButtons() {
            const backBtn = document.getElementById('back-chapter4-dialog-btn');
            const forwardBtn = document.getElementById('forward-chapter4-dialog-btn');
            
            let currentDialogData;
            switch (chapter4CurrentPhase) {
                case 'desktop':
                    currentDialogData = DialogDataChapter4.desktop;
                    break;
                case 'projects':
                    currentDialogData = DialogDataChapter4.projects;
                    break;
                case 'browser':
                    currentDialogData = DialogDataChapter4.browser;
                    break;
                default:
                    return;
            }
            
            if (backBtn) {
                backBtn.disabled = chapter4DialogIndex <= 0;
            }
            
            if (forwardBtn) {
                forwardBtn.disabled = chapter4DialogIndex >= currentDialogData.length - 1;
            }
        }
        
        // 显示第四幕下一段对话
        async function showNextChapter4Dialog() {
            const dialogBox = document.getElementById('chapter4-dialog-box');
            const speakerName = document.getElementById('chapter4-speaker-name');
            const dialogText = document.getElementById('chapter4-dialog-text');
            const rickPortrait = document.getElementById('chapter4-rick-portrait');
            const mortyPortrait = document.getElementById('chapter4-morty-portrait');
            
            let currentDialogData;
            let nextAction;
            
            // 根据当前阶段获取对话数据
            switch (chapter4CurrentPhase) {
                case 'desktop':
                    currentDialogData = DialogDataChapter4.desktop;
                    nextAction = () => {
                        // 桌面对话结束，隐藏对话框，显示Projects文件夹点击区域
                        dialogBox.classList.remove('show');
                        const projectsArea = document.getElementById('projects-folder-area');
                        if (projectsArea) projectsArea.style.display = 'block';
                    };
                    break;
                case 'projects':
                    currentDialogData = DialogDataChapter4.projects;
                    nextAction = () => {
                        // 项目对话结束，隐藏弹窗和对话框，显示浏览器点击区域
                        hidePopupImage();
                        dialogBox.classList.remove('show');
                        // 隐藏立绘
                        rickPortrait.classList.remove('active');
                        mortyPortrait.classList.remove('active');
                        const browserArea = document.getElementById('browser-area');
                        if (browserArea) browserArea.style.display = 'block';
                    };
                    break;
                case 'browser':
                    currentDialogData = DialogDataChapter4.browser;
                    nextAction = () => {
                        // 浏览器对话结束，隐藏对话框，显示回收站点击区域
                        dialogBox.classList.remove('show');
                        // 隐藏立绘
                        rickPortrait.classList.remove('active');
                        mortyPortrait.classList.remove('active');
                        const recycleArea = document.getElementById('recycle-bin-area');
                        if (recycleArea) recycleArea.style.display = 'block';
                    };
                    break;
                default:
                    return;
            }
            
            // 检查对话是否结束
            if (chapter4DialogIndex >= currentDialogData.length) {
                chapter4DialogIndex = currentDialogData.length - 1; // 保持在最后一条对话
                updateChapter4DialogButtons();
                if (nextAction) nextAction();
                return;
            }
            
            // 确保索引不小于0
            if (chapter4DialogIndex < 0) {
                chapter4DialogIndex = 0;
            }
            
            const dialog = currentDialogData[chapter4DialogIndex];
            
            // 处理特殊标记
            if (dialog.showWatching) {
                showWatchingOverlay();
            }
            if (dialog.hideWatching) {
                hideWatchingOverlay();
            }
            if (dialog.hidePopup) {
                hidePopupImage();
            }
            
            // 显示对话
            await dialogModule.showDialog({
                speakerElement: speakerName,
                textElement: dialogText,
                text: dialog.text,
                speaker: dialog.speaker,
                character: dialog.character,
                characterImage: dialog.characterImage,
                portraitElements: {
                    rick: rickPortrait,
                    morty: mortyPortrait
                }
            });
            
            // 更新按钮状态
            updateChapter4DialogButtons();
            
            // 如果不是通过按钮触发的，等待用户点击继续
            if (!dialog.skipWait) {
                await dialogModule.waitForClick(dialogBox);
                chapter4DialogIndex++;
                showNextChapter4Dialog();
            }
        }
        
        // Projects文件夹点击事件
        const projectsFolderArea = document.getElementById('projects-folder-area');
        if (projectsFolderArea) {
            projectsFolderArea.addEventListener('click', () => {
                projectsFolderArea.style.display = 'none';
                // 播放鼠标点击音效
                audioModule.play('mouse-click');
                showPopupImage('assets/evidence/projects_folder.png');
                
                // 切换到项目对话阶段
                chapter4CurrentPhase = 'projects';
                chapter4DialogIndex = 0;
                
                const dialogBox = document.getElementById('chapter4-dialog-box');
                dialogBox.classList.add('show');
                setTimeout(showNextChapter4Dialog, 500);
            });
        }
        
        // 浏览器点击事件
        const browserArea = document.getElementById('browser-area');
        if (browserArea) {
            browserArea.addEventListener('click', () => {
                browserArea.style.display = 'none';
                // 播放鼠标点击音效
                audioModule.play('mouse-click');
                showPopupImage('assets/evidence/browser.png');
                
                // 切换到浏览器对话阶段
                chapter4CurrentPhase = 'browser';
                chapter4DialogIndex = 0;
                
                const dialogBox = document.getElementById('chapter4-dialog-box');
                dialogBox.classList.add('show');
                setTimeout(showNextChapter4Dialog, 500);
            });
        }
        
        // 回收站点击事件
        const recycleBinArea = document.getElementById('recycle-bin-area');
        if (recycleBinArea) {
            recycleBinArea.addEventListener('click', () => {
                recycleBinArea.style.display = 'none';
                // 播放鼠标点击音效
                audioModule.play('mouse-click');
                showPopupImage('assets/evidence/recycle_bin.png');
                
                // 显示食谱点击区域
                setTimeout(() => {
                    const recipeAreaEl = document.getElementById('recipe-area');
                    if (recipeAreaEl) recipeAreaEl.style.display = 'block';
                }, 500);
            });
        }
        
        // 食谱点击事件
        const recipeArea = document.getElementById('recipe-area');
        if (recipeArea) {
            recipeArea.addEventListener('click', () => {
                recipeArea.style.display = 'none';
                showPopupImage('assets/evidence/recipe.png');
                // 停止轻松BGM，播放紧张音效
                audioModule.stopBGM();
                audioModule.play('tension');
                // 显示"点击继续冒险"引导文字
                const continueGuide = document.getElementById('chapter4-continue-guide');
                if (continueGuide) {
                    continueGuide.style.display = 'block';
                }
            });
        }
        
        // 第四幕弹窗点击事件（点击食谱弹窗后进入第五幕）
        const chapter4PopupOverlayClick = document.getElementById('chapter4-popup-overlay');
        if (chapter4PopupOverlayClick) {
            chapter4PopupOverlayClick.addEventListener('click', () => {
                // 只有在显示食谱时才触发第五幕
                const popupImage = document.getElementById('chapter4-popup-image');
                if (popupImage && popupImage.src.includes('recipe.png')) {
                    // 隐藏引导文字
                    const continueGuide = document.getElementById('chapter4-continue-guide');
                    if (continueGuide) {
                        continueGuide.style.display = 'none';
                    }
                    startChapter5();
                }
            });
        }
        
        // 第四幕跳过按钮
        const skipChapter4DialogBtn = document.getElementById('skip-chapter4-dialog-btn');
        if (skipChapter4DialogBtn) {
            skipChapter4DialogBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                // 清理当前阶段的所有状态
                hidePopupImage();
                hideWatchingOverlay();
                // 隐藏立绘
                const rickPortrait = document.getElementById('chapter4-rick-portrait');
                const mortyPortrait = document.getElementById('chapter4-morty-portrait');
                if (rickPortrait) rickPortrait.classList.remove('active');
                if (mortyPortrait) mortyPortrait.classList.remove('active');
                // 跳过当前阶段的所有对话
                chapter4DialogIndex = 999;
                showNextChapter4Dialog();
            });
        }
        
        // ========== 第四幕调试跳转函数 ==========
        // 跳转到Projects文件夹阶段
        function showChapter4ProjectsPhase() {
            // 显示第四幕场景
            chapter4Scene1.classList.remove('hidden');
            chapter4Scene1.style.display = 'block';
            // 显示Projects弹窗
            showPopupImage('assets/evidence/projects_folder.png');
            // 设置阶段
            chapter4CurrentPhase = 'projects';
            chapter4DialogIndex = 0;
            // 显示对话框
            const dialogBox = document.getElementById('chapter4-dialog-box');
            dialogBox.classList.add('show');
            setTimeout(showNextChapter4Dialog, 500);
        }
        
        // 跳转到浏览器阶段
        function showChapter4BrowserPhase() {
            // 显示第四幕场景
            chapter4Scene1.classList.remove('hidden');
            chapter4Scene1.style.display = 'block';
            // 显示浏览器弹窗
            showPopupImage('assets/evidence/browser.png');
            // 设置阶段
            chapter4CurrentPhase = 'browser';
            chapter4DialogIndex = 0;
            // 显示对话框
            const dialogBox = document.getElementById('chapter4-dialog-box');
            dialogBox.classList.add('show');
            setTimeout(showNextChapter4Dialog, 500);
        }
        
        // 跳转到回收站阶段
        function showChapter4RecyclePhase() {
            // 显示第四幕场景
            chapter4Scene1.classList.remove('hidden');
            chapter4Scene1.style.display = 'block';
            // 显示回收站弹窗
            showPopupImage('assets/evidence/recycle_bin.png');
            // 显示食谱点击区域
            const recipeAreaEl = document.getElementById('recipe-area');
            if (recipeAreaEl) recipeAreaEl.style.display = 'block';
        }
        
        // ========== 第五幕逻辑 ==========
        const chapter5Scene1 = document.getElementById('chapter5-scene1');
        const chapter5Scene2 = document.getElementById('chapter5-scene2');
        const chapter5EvidenceModule = new EvidenceModule(Chapter5EvidenceData);
        let chapter5DialogScene = null;
        
        // 开始第五幕
        function startChapter5() {
            const chapter4Scene1 = document.getElementById('chapter4-scene1');
            hidePopupImage();
            hideWatchingOverlay();
            
            sceneModule.switchScene(chapter4Scene1, chapter5Scene1, {
                onComplete: () => {
                    chapter4Scene1.style.display = 'none';
                    // 直接开始播放第五幕视频（带控制按钮）
                    videoModule.playVideoById('chapter5-video', 'skip-chapter5-video-btn', audioModule.isEnabled(), () => {
                        PlayProgress.markSceneViewed('chapter5-memory');
                        showChapter5LivingScene();
                    }, {
                        controlsId: 'chapter5-video-controls',
                        pauseBtnId: 'chapter5-pause-btn',
                        speedBtnId: 'chapter5-speed-btn'
                    }, 'chapter5-memory');
                }
            });
        }
        
        // 显示第五幕客厅场景
        function showChapter5LivingScene() {
            sceneModule.switchScene(chapter5Scene1, chapter5Scene2, {
                onComplete: () => {
                    chapter5Scene1.style.display = 'none';
                    // 播放悬疑2 BGM
                    audioModule.playBGM('suspense2');
                    setTimeout(startChapter5Dialog, 150);
                }
            });
        }
        
        // 开始第五幕对话
        function startChapter5Dialog() {
            chapter5DialogScene = createDialogScene({
                sceneId: 'chapter5-living',
                dialogData: DialogDataChapter5,
                dialogBoxId: 'chapter5-dialog-box',
                speakerNameId: 'chapter5-speaker-name',
                dialogTextId: 'chapter5-dialog-text',
                skipBtnId: 'skip-chapter5-dialog-btn',
                backBtnId: 'back-chapter5-dialog-btn',
                forwardBtnId: 'forward-chapter5-dialog-btn',
                rickPortraitId: 'chapter5-rick-portrait',
                mortyPortraitId: 'chapter5-morty-portrait',
                evidenceModule: chapter5EvidenceModule,
                evidenceDisplayId: 'chapter5-evidence-display',
                evidenceImageId: 'chapter5-evidence-image',
                evidenceCounterId: 'chapter5-evidence-counter',
                prevEvidenceBtnId: 'chapter5-prev-evidence',
                nextEvidenceBtnId: 'chapter5-next-evidence',
                onClickArea: true, // 启用点击区域功能
                onSkip: () => {
                    // 跳过时隐藏所有点击区域（添加空值检查）
                    const secretBox = document.getElementById('secret-box-area');
                    const landlady = document.getElementById('landlady-area');
                    const snowman = document.getElementById('snowman-area');
                    if (secretBox) secretBox.style.display = 'none';
                    if (landlady) landlady.style.display = 'none';
                    if (snowman) snowman.style.display = 'none';
                },
                onComplete: showChapter6Scene
            });
            chapter5DialogScene.start();
        }
        
        // 第五幕点击区域事件
        const secretBoxArea = document.getElementById('secret-box-area');
        if (secretBoxArea) {
            secretBoxArea.addEventListener('click', () => {
                secretBoxArea.style.display = 'none';
                if (chapter5DialogScene) chapter5DialogScene.continueAfterClick();
            });
        }
        
        const landladyArea = document.getElementById('landlady-area');
        if (landladyArea) {
            landladyArea.addEventListener('click', () => {
                landladyArea.style.display = 'none';
                if (chapter5DialogScene) chapter5DialogScene.continueAfterClick();
            });
        }
        
        const snowmanArea = document.getElementById('snowman-area');
        if (snowmanArea) {
            snowmanArea.addEventListener('click', () => {
                snowmanArea.style.display = 'none';
                if (chapter5DialogScene) chapter5DialogScene.continueAfterClick();
            });
        }
        
        // ========== 第六幕逻辑 ==========
        const chapter6Scene1 = document.getElementById('chapter6-scene1');
        const chapter6EvidenceModule = new EvidenceModule(Chapter6EvidenceData);
        let chapter6DialogScene = null;
        
        // 显示第六幕场景
        function showChapter6Scene() {
            const chapter5Scene2 = document.getElementById('chapter5-scene2');
            
            // 播放回忆音效（第五幕结束，进入第六幕时触发）
            audioModule.play('memory');
            
            sceneModule.switchScene(chapter5Scene2, chapter6Scene1, {
                onComplete: () => {
                    chapter5Scene2.style.display = 'none';
                    // 播放战斗BGM
                    audioModule.playBGM('battle');
                    setTimeout(startChapter6Dialog, 1000);
                }
            });
        }
        
        // 开始第六幕对话
        function startChapter6Dialog() {
            chapter6DialogScene = createDialogScene({
                sceneId: 'chapter6-battle',
                dialogData: DialogDataChapter6,
                dialogBoxId: 'chapter6-dialog-box',
                speakerNameId: 'chapter6-speaker-name',
                dialogTextId: 'chapter6-dialog-text',
                skipBtnId: 'skip-chapter6-dialog-btn',
                backBtnId: 'back-chapter6-dialog-btn',
                forwardBtnId: 'forward-chapter6-dialog-btn',
                rickPortraitId: 'chapter6-rick-portrait',
                mortyPortraitId: 'chapter6-morty-portrait',
                evidenceModule: chapter6EvidenceModule,
                evidenceDisplayId: 'chapter6-evidence-display',
                evidenceImageId: 'chapter6-evidence-image',
                evidenceCounterId: 'chapter6-evidence-counter',
                prevEvidenceBtnId: 'chapter6-prev-evidence',
                nextEvidenceBtnId: 'chapter6-next-evidence',
                backgroundImgId: 'chapter6-bg',
                blackscreenId: 'chapter6-blackscreen',
                blackscreenTextId: 'chapter6-blackscreen-text',
                onTriggerVideo: showEndingVideo,
                onComplete: () => {
                    // 第六幕对话结束，播放结尾视频
                    const dialogBox = document.getElementById('chapter6-dialog-box');
                    dialogBox.classList.remove('show');
                    showEndingVideo();
                }
            });
            chapter6DialogScene.start();
        }
        
        // 跳转到第六幕深夜食堂场景（调试用）
        function showChapter6RestaurantScene() {
            // 显示第六幕场景
            chapter6Scene1.classList.remove('hidden');
            chapter6Scene1.style.display = 'block';
            // 切换背景到深夜食堂
            const chapter6Bg = document.getElementById('chapter6-bg');
            if (chapter6Bg) {
                chapter6Bg.src = 'assets/backgrounds/chapter6_restaurant.jpg';
            }
            // 从深夜食堂对话开始（跳过战斗场景和黑幕）
            // 找到黑幕后的第一条对话索引
            let restaurantStartIndex = 0;
            for (let i = 0; i < DialogDataChapter6.length; i++) {
                if (DialogDataChapter6[i].character === 'blackscreen') {
                    restaurantStartIndex = i + 1;
                    break;
                }
            }
            // 创建新的对话场景，从深夜食堂开始
            chapter6DialogScene = createDialogScene({
                sceneId: 'chapter6-restaurant',
                dialogData: DialogDataChapter6.slice(restaurantStartIndex),
                dialogBoxId: 'chapter6-dialog-box',
                speakerNameId: 'chapter6-speaker-name',
                dialogTextId: 'chapter6-dialog-text',
                skipBtnId: 'skip-chapter6-dialog-btn',
                backBtnId: 'back-chapter6-dialog-btn',
                forwardBtnId: 'forward-chapter6-dialog-btn',
                rickPortraitId: 'chapter6-rick-portrait',
                mortyPortraitId: 'chapter6-morty-portrait',
                evidenceModule: chapter6EvidenceModule,
                evidenceDisplayId: 'chapter6-evidence-display',
                evidenceImageId: 'chapter6-evidence-image',
                evidenceCounterId: 'chapter6-evidence-counter',
                prevEvidenceBtnId: 'chapter6-prev-evidence',
                nextEvidenceBtnId: 'chapter6-next-evidence',
                backgroundImgId: 'chapter6-bg',
                blackscreenId: 'chapter6-blackscreen',
                blackscreenTextId: 'chapter6-blackscreen-text',
                onTriggerVideo: showEndingVideo,
                onComplete: () => {
                    // 第六幕对话结束，播放结尾视频
                    const dialogBox = document.getElementById('chapter6-dialog-box');
                    dialogBox.classList.remove('show');
                    showEndingVideo();
                }
            });
            chapter6DialogScene.start();
        }
        
        // ========== 结尾视频逻辑 ==========
        const endingScene = document.getElementById('ending-scene');
        const endingGuide = document.getElementById('ending-guide');
        
        // 显示结尾视频
        function showEndingVideo() {
            // 停止吃饭BGM
            audioModule.stopBGM();
            
            sceneModule.switchScene(chapter6Scene1, endingScene, {
                onComplete: () => {
                    chapter6Scene1.style.display = 'none';
                    // 延迟1秒后开始播放结尾视频（带控制按钮）
                    setTimeout(() => {
                        videoModule.playVideoById('ending-video', 'skip-ending-btn', audioModule.isEnabled(), () => {
                            // 视频播放结束，标记为已看完结局
                            PlayProgress.markSceneViewed('ending');
                            // 显示引导文字
                            showEndingGuide();
                        }, {
                            controlsId: 'ending-video-controls',
                            pauseBtnId: 'ending-pause-btn',
                            speedBtnId: 'ending-speed-btn'
                        }, 'ending');
                    }, 1000);
                }
            });
        }
        
        // 显示结束引导文字
        function showEndingGuide() {
            // 隐藏视频元素（跳过时视频可能还在显示）
            const endingVideo = document.getElementById('ending-video');
            if (endingVideo) {
                endingVideo.style.display = 'none';
            }
            // 隐藏视频控制按钮
            const endingVideoControls = document.getElementById('ending-video-controls');
            if (endingVideoControls) {
                endingVideoControls.classList.remove('show');
            }
            // 隐藏跳过按钮
            const skipEndingBtn = document.getElementById('skip-ending-btn');
            if (skipEndingBtn) {
                skipEndingBtn.classList.remove('show');
            }
            
            // 显示引导文字
            endingGuide.style.display = 'block';
            gsap.fromTo(endingGuide, 
                { opacity: 0 },
                { duration: 1, opacity: 1 }
            );
        }
        
        // 结束场景点击事件 - 返回首页
        if (endingScene) {
            endingScene.addEventListener('click', function(event) {
                // 排除跳过按钮和视频控制按钮的点击
                const skipBtn = document.getElementById('skip-ending-btn');
                const videoControls = document.getElementById('ending-video-controls');
                if (skipBtn && (event.target === skipBtn || skipBtn.contains(event.target))) {
                    return;
                }
                if (videoControls && (event.target === videoControls || videoControls.contains(event.target))) {
                    return;
                }
                
                // 只有在引导文字显示时才响应点击
                if (endingGuide.style.display === 'block') {
                    // 防止重复点击
                    endingGuide.style.display = 'none';
                    // 重置游戏状态并返回首页
                    resetAndReturnToHomepage();
                }
            });
        }
        
        // 重置游戏状态并返回首页
        function resetAndReturnToHomepage() {
            // 直接刷新页面，彻底重置所有状态
            // 进度已保存在 localStorage 中，刷新后会自动恢复
            location.reload();
        }
        
        // 页面初始化动画函数
        function initPageAnimation() {
            // 帷幕拉开动画
            gsap.to(curtainTop, {
                duration: 1,
                y: '-100%',
                delay: 0.5,
                ease: "power2.inOut"
            });
            
            gsap.to(curtainBottom, {
                duration: 1,
                y: '100%',
                delay: 0.5,
                ease: "power2.inOut"
            });
            
            // 传送门从小到大弹出效果
            gsap.to(portalContainer, {
                duration: 1.5,
                scale: 1,
                delay: 1.5,
                ease: "back.out(1.7)",
                onStart: function() {
                    // 传送门开始出现时播放音效
                    audioModule.play('portal');
                },
                onComplete: function() {
                    // 传送门弹出完成后，启动漂浮动画
                    portalContainer.classList.add('floating');
                }
            });
            
            // 引导文字淡入动画
            gsap.from('.guide-text', {
                duration: 1,
                opacity: 0,
                y: 50,
                delay: 2.5,
                ease: "power2.out"
            });
        }
        
        // ========== 初始化调试模块 ==========
        const debugModule = new DebugModule();
        debugModule.init({
            showChapter1Scene1: showChapter1Scene1,
            startChapter2: startChapter2,
            showSearchScene: showSearchScene,
            showDialogSystem: showDialogSystem,
            showChapter3: showChapter3,
            showChapter3DoorScene: showChapter3DoorScene,
            showChapter3RoomScene: showChapter3RoomScene,
            showChapter3KitchenScene: showChapter3KitchenScene,
            showChapter3LivingScene: showChapter3LivingScene,
            showChapter3StudyScene: showChapter3StudyScene,
            showChapter4DesktopScene: showChapter4DesktopScene,
            showChapter4ProjectsPhase: showChapter4ProjectsPhase,
            showChapter4BrowserPhase: showChapter4BrowserPhase,
            showChapter4RecyclePhase: showChapter4RecyclePhase,
            startChapter5: startChapter5,
            showChapter5LivingScene: showChapter5LivingScene,
            showChapter6Scene: showChapter6Scene,
            showChapter6RestaurantScene: showChapter6RestaurantScene,
            showEndingVideo: showEndingVideo
        }, audioModule);
        
    } // initGameLogic 函数结束
    
}); // DOMContentLoaded 事件监听器结束