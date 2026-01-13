// 对话历史模块
// 用于记录当前场景的对话历史，支持回退/前进浏览

class DialogHistory {
    constructor(maxSize = 100) {
        this.history = [];          // 已显示的对话记录
        this.currentIndex = -1;     // 当前浏览位置
        this.maxSize = maxSize;     // 最大记录数
        this.isReviewing = false;   // 是否在回看模式
    }
    
    // 添加新对话到历史
    push(dialogEntry) {
        // 如果在回看模式，需要截断后面的历史
        if (this.isReviewing && this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
            this.isReviewing = false;
        }
        
        // 添加新记录
        this.history.push({
            speaker: dialogEntry.speaker || '',
            text: dialogEntry.text || '',
            character: dialogEntry.character || null,
            characterImage: dialogEntry.characterImage || null,
            timestamp: Date.now(),
            // 保存额外状态用于恢复
            evidenceIndex: dialogEntry.evidenceIndex,
            background: dialogEntry.background
        });
        
        // 限制大小，移除最早的记录
        if (this.history.length > this.maxSize) {
            this.history.shift();
        }
        
        this.currentIndex = this.history.length - 1;
    }
    
    // 回退一条对话
    back() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.isReviewing = true;
            return this.history[this.currentIndex];
        }
        return null;
    }
    
    // 前进一条对话
    forward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            // 如果回到最新位置，退出回看模式
            if (this.currentIndex === this.history.length - 1) {
                this.isReviewing = false;
            }
            return this.history[this.currentIndex];
        }
        return null;
    }
    
    // 退出回看模式，回到最新对话
    exitReview() {
        this.currentIndex = this.history.length - 1;
        this.isReviewing = false;
        return this.history[this.currentIndex];
    }
    
    // 获取当前对话
    getCurrent() {
        if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
            return this.history[this.currentIndex];
        }
        return null;
    }
    
    // 检查是否可以回退
    canBack() {
        return this.currentIndex > 0;
    }
    
    // 检查是否可以前进
    canForward() {
        return this.currentIndex < this.history.length - 1;
    }
    
    // 获取所有历史记录（用于历史面板）
    getAll() {
        return [...this.history];
    }
    
    // 获取历史记录数量
    getCount() {
        return this.history.length;
    }
    
    // 清空历史（场景切换时调用）
    clear() {
        this.history = [];
        this.currentIndex = -1;
        this.isReviewing = false;
    }
    
    // 获取当前位置信息
    getPosition() {
        return {
            current: this.currentIndex + 1,
            total: this.history.length,
            isReviewing: this.isReviewing
        };
    }
    
    // 重置状态（用于二周目，保留历史但重置浏览位置）
    reset() {
        this.currentIndex = this.history.length > 0 ? this.history.length - 1 : -1;
        this.isReviewing = false;
    }
}

// 导出模块
window.DialogHistory = DialogHistory;
