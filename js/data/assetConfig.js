// 资产配置文件 - 集中管理所有资产路径
const AssetConfig = {
    // 基础路径
    basePaths: {
        characters: 'assets/common/characters/',
        audio: 'assets/common/audio/',
        backgrounds: 'assets/backgrounds/',
        videos: 'assets/videos/',
        evidence: 'assets/evidence/',
        ui: 'assets/ui/'
    },
    
    // 音频资产
    audio: {
        bgm: {
            main: 'assets/common/audio/bgm/main.mp3'
        },
        sfx: {
            portalAppear: 'assets/common/audio/sfx/portal_appear.mp3',
            dialog: 'assets/common/audio/sfx/dialog.mp3'
        }
    },
    
    // 视频资产
    videos: {
        opening: 'assets/videos/opening.mp4',
        garage: 'assets/videos/garage.mp4',
        chapter3Crisis: 'assets/videos/chapter3_crisis.mp4'
    },
    
    // 背景图片
    backgrounds: {
        space: 'assets/backgrounds/space.jpg',
        openingEnd: 'assets/backgrounds/opening_end.jpg',
        searchScene: 'assets/backgrounds/search_scene.jpg',
        doorScene: 'assets/backgrounds/door_scene.jpg',
        roomScene: 'assets/backgrounds/room_scene.jpg',
        kitchenScene: 'assets/backgrounds/kitchen_scene.jpg'
    },
    
    // UI元素
    ui: {
        portal: 'assets/ui/portal.png',
        portalGun: 'assets/ui/portal_gun.png',
        portalFluid: 'assets/ui/portal_fluid.png'
    },
    
    // 道具证据
    evidence: {
        idCard: 'assets/evidence/id_card.png',
        phoneHacked: 'assets/evidence/phone_hacked.png',
        phoneDesktop: 'assets/evidence/phone_desktop.png',
        phoneReplaced: 'assets/evidence/phone_replaced.png',
        messageReceived: 'assets/evidence/message_received.png',
        message1: 'assets/evidence/message1.png',
        message2: 'assets/evidence/message2.png'
    },
    
    // 获取资产路径的辅助方法
    getAssetPath: function(category, subcategory, name) {
        try {
            if (subcategory) {
                return this[category][subcategory][name];
            } else {
                return this[category][name];
            }
        } catch (error) {
            console.warn(`资产路径未找到: ${category}.${subcategory}.${name}`);
            return null;
        }
    }
};

// 导出配置
window.AssetConfig = AssetConfig;