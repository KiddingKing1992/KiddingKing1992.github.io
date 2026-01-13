// 播放进度追踪模块
// 用于记录用户已看过的场景和对话，实现一周目保护

const PlayProgress = {
    STORAGE_KEY: 'rick_morty_resume_progress',
    
    // 获取已看过的内容
    getViewed() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : { scenes: [], dialogs: {} };
        } catch (e) {
            console.warn('PlayProgress: 读取进度失败', e);
            return { scenes: [], dialogs: {} };
        }
    },
    
    // 保存进度
    _save(progress) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.warn('PlayProgress: 保存进度失败', e);
        }
    },
    
    // 标记场景为已看过
    markSceneViewed(sceneId) {
        const progress = this.getViewed();
        if (!progress.scenes.includes(sceneId)) {
            progress.scenes.push(sceneId);
            this._save(progress);
            console.log(`PlayProgress: 场景 ${sceneId} 已标记为已看`);
        }
    },
    
    // 标记对话进度（记录看到第几条）
    markDialogProgress(sceneId, dialogIndex) {
        const progress = this.getViewed();
        const currentMax = progress.dialogs[sceneId] || -1;
        if (dialogIndex > currentMax) {
            progress.dialogs[sceneId] = dialogIndex;
            this._save(progress);
        }
    },
    
    // 检查场景是否已看过
    hasViewedScene(sceneId) {
        return this.getViewed().scenes.includes(sceneId);
    },
    
    // 检查是否可以跳过场景
    canSkipScene(sceneId) {
        return this.hasViewedScene(sceneId);
    },
    
    // 检查是否可以跳过对话到指定位置
    canSkipDialog(sceneId, toIndex) {
        const progress = this.getViewed();
        const viewedIndex = progress.dialogs[sceneId];
        // 如果没有记录，不能跳过
        if (viewedIndex === undefined) return false;
        // 只能跳过到已看过的位置
        return viewedIndex >= toIndex;
    },
    
    // 获取场景的对话进度
    getDialogProgress(sceneId) {
        const progress = this.getViewed();
        return progress.dialogs[sceneId] || -1;
    },
    
    // 检查是否是二周目（已看过结局）
    isNewGamePlus() {
        return this.hasViewedScene('ending');
    },
    
    // 获取已看过的场景数量
    getViewedSceneCount() {
        return this.getViewed().scenes.length;
    },
    
    // 重置所有进度（用于调试或用户主动清除）
    reset() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            console.log('PlayProgress: 进度已重置');
        } catch (e) {
            console.warn('PlayProgress: 重置失败', e);
        }
    },
    
    // 调试：打印当前进度
    debug() {
        console.log('PlayProgress 当前进度:', this.getViewed());
        console.log('是否二周目:', this.isNewGamePlus());
    }
};

// 导出模块
window.PlayProgress = PlayProgress;
