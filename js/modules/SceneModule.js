// 场景模块 - 统一场景切换逻辑
class SceneModule {
    constructor() {
        this.currentScene = null;
    }
    
    // 统一的场景切换
    async switchScene(fromScene, toScene, options = {}) {
        const {
            duration = 0.5,
            hideFromScene = true,
            showToScene = true,
            onComplete = null
        } = options;
        
        return new Promise((resolve) => {
            // 隐藏当前场景
            if (fromScene && hideFromScene) {
                gsap.to(fromScene, {
                    duration: duration,
                    opacity: 0,
                    onComplete: () => {
                        fromScene.classList.add('hidden');
                        fromScene.style.display = 'none';
                    }
                });
            }
            
            // 显示新场景
            if (toScene && showToScene) {
                toScene.classList.remove('hidden');
                toScene.style.display = 'block';
                gsap.fromTo(toScene, 
                    { opacity: 0 },
                    { 
                        duration: duration, 
                        opacity: 1,
                        onComplete: () => {
                            if (onComplete) onComplete();
                            resolve();
                        }
                    }
                );
            } else {
                if (onComplete) onComplete();
                resolve();
            }
            
            this.currentScene = toScene;
        });
    }
    
    // 快速场景切换（通过ID）
    async switchSceneById(fromSceneId, toSceneId, options = {}) {
        const fromScene = fromSceneId ? document.getElementById(fromSceneId) : null;
        const toScene = toSceneId ? document.getElementById(toSceneId) : null;
        
        return this.switchScene(fromScene, toScene, options);
    }
    
    // 显示场景
    async showScene(scene, duration = 0.5) {
        if (!scene) return;
        
        return new Promise((resolve) => {
            scene.classList.remove('hidden');
            gsap.fromTo(scene, 
                { opacity: 0 },
                { 
                    duration: duration, 
                    opacity: 1,
                    onComplete: resolve
                }
            );
        });
    }
    
    // 隐藏场景
    async hideScene(scene, duration = 0.5) {
        if (!scene) return;
        
        return new Promise((resolve) => {
            gsap.to(scene, {
                duration: duration,
                opacity: 0,
                onComplete: () => {
                    scene.classList.add('hidden');
                    scene.style.display = 'none';
                    resolve();
                }
            });
        });
    }
    
    // 通过ID显示场景
    async showSceneById(sceneId, duration = 0.5) {
        const scene = document.getElementById(sceneId);
        return this.showScene(scene, duration);
    }
    
    // 通过ID隐藏场景
    async hideSceneById(sceneId, duration = 0.5) {
        const scene = document.getElementById(sceneId);
        return this.hideScene(scene, duration);
    }
    
    // 获取当前场景
    getCurrentScene() {
        return this.currentScene;
    }
}

// 导出模块
window.SceneModule = SceneModule;