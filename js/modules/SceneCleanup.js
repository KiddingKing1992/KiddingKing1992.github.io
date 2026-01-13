// 场景清理模块
// 用于管理场景切换时的资源清理，解决二周目状态残留问题

const SceneCleanup = {
    // 清理函数注册表
    cleanupFns: new Map(),
    
    // 当前活跃的定时器
    activeTimers: new Set(),
    
    // 当前活跃的事件监听器
    activeListeners: [],
    
    // 注册场景的清理函数
    register(sceneId, cleanupFn) {
        if (!this.cleanupFns.has(sceneId)) {
            this.cleanupFns.set(sceneId, []);
        }
        this.cleanupFns.get(sceneId).push(cleanupFn);
    },
    
    // 执行指定场景的清理
    cleanup(sceneId) {
        const fns = this.cleanupFns.get(sceneId) || [];
        fns.forEach(fn => {
            try {
                fn();
            } catch (e) {
                console.warn(`SceneCleanup: 清理场景 ${sceneId} 时出错`, e);
            }
        });
        // 清理后移除注册
        this.cleanupFns.delete(sceneId);
        console.log(`SceneCleanup: 场景 ${sceneId} 已清理`);
    },
    
    // 清理所有场景（用于重新开始游戏）
    cleanupAll() {
        this.cleanupFns.forEach((fns, sceneId) => {
            fns.forEach(fn => {
                try {
                    fn();
                } catch (e) {
                    console.warn(`SceneCleanup: 清理场景 ${sceneId} 时出错`, e);
                }
            });
        });
        this.cleanupFns.clear();
        this.clearAllTimers();
        this.removeAllListeners();
        console.log('SceneCleanup: 所有场景已清理');
    },
    
    // 注册一个需要清理的定时器
    registerTimer(timerId) {
        this.activeTimers.add(timerId);
        return timerId;
    },
    
    // 创建一个可追踪的 setTimeout
    setTimeout(callback, delay, sceneId) {
        const timerId = setTimeout(() => {
            this.activeTimers.delete(timerId);
            callback();
        }, delay);
        this.activeTimers.add(timerId);
        
        // 如果指定了场景，注册清理
        if (sceneId) {
            this.register(sceneId, () => {
                clearTimeout(timerId);
                this.activeTimers.delete(timerId);
            });
        }
        
        return timerId;
    },
    
    // 创建一个可追踪的 setInterval
    setInterval(callback, delay, sceneId) {
        const timerId = setInterval(callback, delay);
        this.activeTimers.add(timerId);
        
        // 如果指定了场景，注册清理
        if (sceneId) {
            this.register(sceneId, () => {
                clearInterval(timerId);
                this.activeTimers.delete(timerId);
            });
        }
        
        return timerId;
    },
    
    // 清除所有定时器
    clearAllTimers() {
        this.activeTimers.forEach(timerId => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        this.activeTimers.clear();
    },
    
    // 注册一个需要清理的事件监听器
    addEventListener(element, event, handler, sceneId, options) {
        element.addEventListener(event, handler, options);
        
        const listenerInfo = { element, event, handler, options };
        this.activeListeners.push(listenerInfo);
        
        // 如果指定了场景，注册清理
        if (sceneId) {
            this.register(sceneId, () => {
                element.removeEventListener(event, handler, options);
                const index = this.activeListeners.indexOf(listenerInfo);
                if (index > -1) {
                    this.activeListeners.splice(index, 1);
                }
            });
        }
        
        return listenerInfo;
    },
    
    // 移除所有事件监听器
    removeAllListeners() {
        this.activeListeners.forEach(({ element, event, handler, options }) => {
            try {
                element.removeEventListener(event, handler, options);
            } catch (e) {
                // 元素可能已被移除
            }
        });
        this.activeListeners = [];
    },
    
    // 检查场景是否有注册的清理函数
    hasCleanup(sceneId) {
        return this.cleanupFns.has(sceneId) && this.cleanupFns.get(sceneId).length > 0;
    },
    
    // 获取所有已注册的场景
    getRegisteredScenes() {
        return Array.from(this.cleanupFns.keys());
    },
    
    // 调试：打印当前状态
    debug() {
        console.log('SceneCleanup 状态:');
        console.log('- 已注册场景:', this.getRegisteredScenes());
        console.log('- 活跃定时器数:', this.activeTimers.size);
        console.log('- 活跃监听器数:', this.activeListeners.length);
    }
};

// 导出模块
window.SceneCleanup = SceneCleanup;
