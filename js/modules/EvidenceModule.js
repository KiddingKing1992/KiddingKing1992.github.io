// 道具模块 - 道具系统管理
class EvidenceModule {
    constructor(evidenceData) {
        this.evidenceData = evidenceData || [];
        this.currentIndex = 0;
        this.unlockedCount = 1;
    }
    
    // 设置道具数据
    setEvidenceData(evidenceData) {
        this.evidenceData = evidenceData;
        this.currentIndex = 0;
        this.unlockedCount = 1;
    }
    
    // 重置状态（用于二周目）
    reset() {
        this.currentIndex = 0;
        this.unlockedCount = 1;
    }
    
    // 完全重置（包括数据）
    fullReset(evidenceData) {
        this.evidenceData = evidenceData || this.evidenceData;
        this.reset();
    }
    
    // 解锁道具
    unlock(evidenceIndex) {
        if (evidenceIndex >= this.unlockedCount) {
            this.unlockedCount = evidenceIndex + 1;
        }
    }
    
    // 更新道具显示
    updateDisplay(elements) {
        const { imageElement, counterElement, prevBtn, nextBtn } = elements;
        
        // 限制当前索引在已解锁范围内
        this.currentIndex = Math.min(this.currentIndex, this.unlockedCount - 1);
        
        if (this.evidenceData.length === 0) return;
        
        const evidence = this.evidenceData[this.currentIndex];
        if (evidence && imageElement && counterElement) {
            imageElement.src = evidence.image;
            imageElement.alt = evidence.name;
            counterElement.textContent = `${this.currentIndex + 1}/${this.unlockedCount}`;
        }
        
        // 更新按钮状态
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex >= this.unlockedCount - 1;
        }
    }
    
    // 切换道具
    navigate(direction, elements) {
        if (direction === 'prev' && this.currentIndex > 0) {
            this.currentIndex--;
        } else if (direction === 'next' && this.currentIndex < this.unlockedCount - 1) {
            this.currentIndex++;
        }
        
        this.updateDisplay(elements);
    }
    
    // 设置当前道具索引
    setCurrentIndex(index) {
        if (index >= 0 && index < this.unlockedCount) {
            this.currentIndex = index;
        }
    }
    
    // 获取当前道具
    getCurrentEvidence() {
        return this.evidenceData[this.currentIndex];
    }
    
    // 获取已解锁数量
    getUnlockedCount() {
        return this.unlockedCount;
    }
    
    // 获取当前索引
    getCurrentIndex() {
        return this.currentIndex;
    }
    
    // 显示道具展示区域
    showEvidenceDisplay(displayElement) {
        if (displayElement) {
            displayElement.classList.add('show');
        }
    }
    
    // 隐藏道具展示区域
    hideEvidenceDisplay(displayElement) {
        if (displayElement) {
            displayElement.classList.remove('show');
        }
    }
}

// 导出模块
window.EvidenceModule = EvidenceModule;