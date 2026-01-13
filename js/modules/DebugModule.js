// 开发调试模块 - 用于快速跳转到指定场景
class DebugModule {
    constructor() {
        this.isVisible = false;
        this.panel = null;
        this.sceneCallbacks = {}; // 存储场景跳转回调函数
        this.audioModule = null; // 音频模块引用
        
        // 场景配置列表 - 新增场景时在这里添加
        this.scenes = [
            { chapter: '第一幕', id: 'chapter1-scene1', name: '片头视频', funcName: 'showChapter1Scene1' },
            { chapter: '第二幕', id: 'chapter2-scene1', name: '车库视频', funcName: 'startChapter2' },
            { chapter: '第二幕', id: 'chapter2-scene2', name: '搜索神秘人', funcName: 'showSearchScene' },
            { chapter: '第二幕', id: 'dialog-system', name: '对话系统', funcName: 'showDialogSystem' },
            { chapter: '第三幕', id: 'chapter3-scene1', name: '危机视频', funcName: 'showChapter3' },
            { chapter: '第三幕', id: 'chapter3-scene2', name: '门口对话', funcName: 'showChapter3DoorScene' },
            { chapter: '第三幕', id: 'chapter3-scene3', name: '房间对话', funcName: 'showChapter3RoomScene' },
            { chapter: '第三幕', id: 'chapter3-scene4', name: '厨房对话', funcName: 'showChapter3KitchenScene' },
            { chapter: '第三幕', id: 'chapter3-scene5', name: '客厅对话', funcName: 'showChapter3LivingScene' },
            { chapter: '第三幕', id: 'chapter3-scene6', name: '书房对话', funcName: 'showChapter3StudyScene' },
            { chapter: '第四幕', id: 'chapter4-desktop', name: '桌面对话', funcName: 'showChapter4DesktopScene' },
            { chapter: '第四幕', id: 'chapter4-projects', name: 'Projects文件夹', funcName: 'showChapter4ProjectsPhase' },
            { chapter: '第四幕', id: 'chapter4-browser', name: '浏览器', funcName: 'showChapter4BrowserPhase' },
            { chapter: '第四幕', id: 'chapter4-recycle', name: '回收站', funcName: 'showChapter4RecyclePhase' },
            { chapter: '第五幕', id: 'chapter5-scene1', name: '回忆视频', funcName: 'startChapter5' },
            { chapter: '第五幕', id: 'chapter5-scene2', name: '客厅对话', funcName: 'showChapter5LivingScene' },
            { chapter: '第六幕', id: 'chapter6-battle', name: '战斗场景', funcName: 'showChapter6Scene' },
            { chapter: '第六幕', id: 'chapter6-restaurant', name: '深夜食堂', funcName: 'showChapter6RestaurantScene' },
            { chapter: '结尾', id: 'ending-scene', name: '结尾视频', funcName: 'showEndingVideo' },
        ];
    }
    
    // 初始化调试模块
    init(callbacks, audioModule) {
        this.sceneCallbacks = callbacks;
        this.audioModule = audioModule; // 保存音频模块引用
        this.createPanel();
        this.bindKeyboard();
        this.checkUrlParams();
    }
    
    // 创建调试面板
    createPanel() {
        // 创建面板容器
        this.panel = document.createElement('div');
        this.panel.id = 'debug-panel';
        this.panel.className = 'debug-panel';
        this.panel.innerHTML = this.generatePanelHTML();
        document.body.appendChild(this.panel);
        
        // 绑定按钮事件
        this.bindButtons();
    }
    
    // 生成面板HTML
    generatePanelHTML() {
        let html = `
            <div class="debug-header">
                <span>🔧 开发调试面板</span>
                <span class="debug-hint">F2 关闭</span>
                <button class="debug-close" id="debug-close">×</button>
            </div>
            <div class="debug-body">
        `;
        
        // 按章节分组
        let currentChapter = '';
        this.scenes.forEach((scene, index) => {
            if (scene.chapter !== currentChapter) {
                if (currentChapter !== '') {
                    html += '</div>'; // 关闭上一个章节
                }
                currentChapter = scene.chapter;
                html += `<div class="debug-chapter">
                    <div class="debug-chapter-title">${scene.chapter}</div>`;
            }
            html += `<button class="debug-scene-btn" data-index="${index}">${scene.name}</button>`;
        });
        
        html += '</div></div>'; // 关闭最后一个章节和body
        return html;
    }
    
    // 绑定按钮事件
    bindButtons() {
        // 关闭按钮
        document.getElementById('debug-close').addEventListener('click', () => {
            this.hide();
        });
        
        // 场景按钮
        this.panel.querySelectorAll('.debug-scene-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.jumpToScene(index);
            });
        });
    }
    
    // 绑定键盘事件
    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F2') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    // 检查URL参数
    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        
        // ?debug=true 显示面板
        if (params.get('debug') === 'true') {
            this.show();
        }
        
        // ?scene=chapter4-scene1 直接跳转
        const sceneId = params.get('scene');
        if (sceneId) {
            const index = this.scenes.findIndex(s => s.id === sceneId);
            if (index !== -1) {
                // 延迟执行，等待页面初始化完成
                setTimeout(() => this.jumpToScene(index), 1500);
            }
        }
    }
    
    // 跳转到指定场景
    jumpToScene(index) {
        const scene = this.scenes[index];
        if (!scene) return;
        
        // 初始化音频状态（如果还没有初始化）
        // debug跳转时默认开启音效，并同步开关状态
        if (this.audioModule) {
            this.audioModule.setEnabled(true);
        }
        
        // 隐藏所有场景
        this.hideAllScenes();
        
        // 调用对应的场景函数
        const callback = this.sceneCallbacks[scene.funcName];
        if (callback) {
            callback();
            this.hide();
        }
    }
    
    // 隐藏所有场景
    hideAllScenes() {
        const allScenes = document.querySelectorAll('.page-container');
        allScenes.forEach(scene => {
            scene.classList.add('hidden');
            scene.style.display = 'none';
        });
        
        // 隐藏音效选择界面
        const audioChoice = document.getElementById('audio-choice');
        if (audioChoice) {
            audioChoice.classList.add('hidden');
            audioChoice.style.display = 'none';
        }
        
        // 停止所有视频播放
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
        
        // 隐藏所有跳过按钮
        const allSkipBtns = document.querySelectorAll('.skip-btn');
        allSkipBtns.forEach(btn => {
            btn.classList.remove('show');
        });
    }
    
    // 显示面板
    show() {
        this.panel.classList.add('show');
        this.isVisible = true;
    }
    
    // 隐藏面板
    hide() {
        this.panel.classList.remove('show');
        this.isVisible = false;
    }
    
    // 切换面板显示
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    // 添加新场景（供外部调用）
    addScene(chapter, id, name, funcName) {
        this.scenes.push({ chapter, id, name, funcName });
        // 重新生成面板
        this.panel.innerHTML = this.generatePanelHTML();
        this.bindButtons();
    }
}

// 导出模块
window.DebugModule = DebugModule;
