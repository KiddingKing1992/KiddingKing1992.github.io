// 所有对话数据集中管理
const DialogData = {
    // 第二幕对话数据
    chapter2: [
        {
            speaker: "rick",
            text: "OK找到了，身份ID卡。让我看看这小子到底什么来头？",
            character: "rick",
            characterImage: "rick正常",
            evidenceIndex: 0
        },
        {
            speaker: "rick",
            text: "原籍：C-137 ？切，老套。瑞城估计是维度编号用完了，开始回收旧号码了。",
            character: "rick",
            characterImage: "rick思考眯眼",
            evidenceIndex: 0
        },
        {
            speaker: "morty",
            text: "(凑过来) 发现什么了吗？他是赏金猎人吗？工程技术大学，哇。是不是技术很强？",
            character: "morty",
            characterImage: "morty欣赏",
            evidenceIndex: 0
        },
        {
            speaker: "rick",
            text: "（一脸不屑）你知道这意味着什么吗？这意味着他的知识刚好够造出一台末日机器，但刚好不够给机器装个\"关闭\"按钮。 (打嗝)",
            character: "rick",
            characterImage: "rick生气抱胸",
            evidenceIndex: 0
        },
        {
            speaker: "morty",
            text: "欧，看我找到了他的手机！",
            character: "morty",
            characterImage: "morty微笑",
            evidenceIndex: 0
        },
        {
            speaker: "rick",
            text: "(一把夺过手机。他没有用面部解锁，而是把一根奇怪的电线插进了充电口。绕过加密……然后……搞定。)",
            character: "rick",
            characterImage: "rick思考托腮",
            evidenceIndex: 1,
            unlockEvidence: 1
        },
        {
            speaker: "rick",
            text: "先收集一下他的电话号码18917135403和邮箱地址376763335@qq.com，说不定以后还有什么大用处。好了，破解成功了。",
            character: "rick",
            characterImage: "rick自豪叉腰",
            evidenceIndex: 1
        },
        {
            speaker: "morty",
            text: "(眯着眼睛) 欧天哪，是《行尸走肉》的\"警长\"瑞克。这家伙真有品！",
            character: "morty",
            characterImage: "morty星星眼",
            evidenceIndex: 2,
            unlockEvidence: 2
        },
        {
            speaker: "rick",
            text: "不过是整天和一群智商不如火腿三明治的、行动缓慢的腐烂尸体打交道的白痴剧。这二货只会满身大汗地在树林里乱转，一边大喊\"卡尔！\"，一边做各种错误的决定！",
            character: "rick",
            characterImage: "rick生气摊手",
            evidenceIndex: 2
        },
        {
            speaker: "rick",
            text: "他崇拜错瑞克了，莫蒂！这是种侮辱！这就好比你崇拜一只成功打开垃圾桶的浣熊，而上帝本人正拿着传送门枪站在旁边！",
            character: "rick",
            characterImage: "rick生气握拳",
            evidenceIndex: 2
        },
        {
            speaker: "rick",
            text: "(随手把壁纸换成了一张自己竖中指的自拍) 行了。修好了。现在他的手机有品位多了。",
            character: "rick",
            characterImage: "rick自豪抬手",
            evidenceIndex: 3,
            unlockEvidence: 3,
            playSfx: "upload"
        },
        {
            speaker: "手机",
            text: "叮.....一条来自房东王阿姨的短信",
            character: "rick",
            characterImage: "rick正常",
            evidenceIndex: 4,
            unlockEvidence: 4,
            playSfx: "message"
        },
        {
            speaker: "王阿姨",
            text: "逗王！我不管你是不是在拯救银河系。你那台'量子空调'又极性反转了。整栋公寓楼现在正飘在地面500米的空中，而且正在慢慢飘向东方明珠塔。立刻、马上回来修好它！不然我就把你床底下那个箱子——对，就是贴着'绝密二次元同人小说'标签的那个——撬开，然后用大楼广播朗读里面的内容。",
            character: "rick",
            characterImage: "rick无奈闭眼",
            evidenceIndex: 5,
            unlockEvidence: 5,
            playSfx: "upload"
        },
        {
            speaker: "morty",
            text: "天呐！瑞克！我们快去看看！说不定还有其他的线索！",
            character: "morty",
            characterImage: "morty张嘴担心",
            evidenceIndex: 5
        },
        {
            speaker: "手机",
            text: "叮......一条来自房东王阿姨的短信",
            character: "rick",
            characterImage: "rick思考上看",
            evidenceIndex: 4,
            playSfx: "message"
        },
        {
            speaker: "王阿姨",
            text: "快！回！来！！！我！买！的！蜜！雪！冰！城！被！东方明珠检测到了！它要发射激光了！！",
            character: "rick",
            characterImage: "rick思考眯眼",
            evidenceIndex: 6,
            unlockEvidence: 6,
            playSfx: "upload"
        },
        {
            speaker: "rick",
            text: "哈！我就知道！我一直怀疑那座塔是个伪装的镭射装置。设计得真优雅，把行星防御系统伪装成游客陷阱放在眼皮子底下。走吧，去这小子家里看看，说不定有别的发现。",
            character: "rick",
            characterImage: "rick自豪叉腰",
            evidenceIndex: 6
        }
    ],
    
    // 第三幕门口对话数据
    chapter3Door: [
        {
            speaker: "morty",
            text: "那可是东方明珠塔！上海的地标建筑！",
            character: "morty",
            characterImage: "morty小震惊"
        },
        {
            speaker: "rick",
            text: "反正也没有一个上海人会去那里。现在他们可以在那儿建点有用的东西了。",
            character: "rick",
            characterImage: "rick生气摊手"
        },
        {
            speaker: "rick",
            text: "(打嗝) 再说了，我把公寓楼传送回去了，王阿姨也把钥匙给了我们，不是吗？",
            character: "rick",
            characterImage: "rick正常"
        },
        {
            speaker: "rick",
            text: "好了，莫蒂。夹紧你的屁股蛋子。我们不知道这扇门后面有什么。可能是维度裂缝，也可能是什么不可告人的秘密基地。",
            character: "rick",
            characterImage: "rick思考抬头"
        }
    ],
    
    // 第三幕房间对话数据
    chapter3Room: [
        {
            speaker: "rick",
            text: "(他打开门。一股复杂的酸甜香气息扑面而来。这不是单身汉公寓的味道，这是高级餐厅的味道。)",
            character: "rick",
            characterImage: "rick思考上看"
        },
        {
            speaker: "morty",
            text: "(走进屋，环顾四周) 闻起来……好香！瑞克。（两人走向香味的来源——厨房）",
            character: "morty",
            characterImage: "morty欣赏"
        }
    ],
    
    // 第三幕厨房对话数据
    chapter3Kitchen: [
        {
            speaker: "rick",
            text: "这厨房简直是个工业杰作。不锈钢台面、旋转蒸发仪、离心机，还有一个自动切配机器人！",
            character: "rick",
            characterImage: "rick思考眯眼"
        },
        {
            speaker: "rick",
            text: "（香味的来源是一口锅，瑞克用汤勺舀起一勺闪着油光的红色汤汁，里面满满的卷心菜、红肠和土豆，尝了一口）",
            character: "rick",
            characterImage: "rick正常",
            playSfx: "drink-soup"
        },
        {
            speaker: "rick",
            text: "天呢！这罗宋汤的味道让我想起了哪些自杀就会变成美味意面的Spaghetti星人。",
            character: "rick",
            characterImage: "rick赞叹",
            playSfx: "rick-yummy"
        },
        {
            speaker: "rick",
            text: "没想到这家伙还有这手恐怖的厨艺！我得想办法搞到这家伙的食谱！",
            character: "rick",
            characterImage: "rick惊讶张嘴"
        },
        {
            speaker: "morty",
            text: "(凑到锅前，也尝了一口。瞳孔瞬间放大。)",
            character: "morty",
            characterImage: "morty低头欣赏",
            playSfx: "drink-soup"
        },
        {
            speaker: "morty",
            text: "天呢！经历了那次意面事件后，这是银河系里唯一没有罪恶感的美食了！",
            character: "morty",
            characterImage: "morty星星眼"
        },
        {
            speaker: "rick",
            text: "走我们再去客厅看看有什么。",
            character: "rick",
            characterImage: "rick正常"
        }
    ],
    
    // 第三幕客厅对话数据
    chapter3Living: [
        {
            speaker: "rick",
            text: "（走进客厅。一切都整理的井井有条）",
            character: "rick",
            characterImage: "rick思考抬头"
        },
        {
            speaker: "rick",
            text: "音乐区、手工区还有户外区。像是一个患有强迫症的机器人布置的宜家样板房。",
            character: "rick",
            characterImage: "rick思考托腮"
        },
        {
            speaker: "morty",
            text: "(跑到音乐区，一支专业的电容麦克风立在高端合成器旁边。)",
            character: "morty",
            characterImage: "morty正常",
            showEvidence: true,
            evidenceIndex: 0
        },
        {
            speaker: "morty",
            text: "看这麦克风！还有隔音板！他一定是个歌手！或许？他还是个隐藏的摇滚巨星？！",
            character: "morty",
            characterImage: "morty星星眼"
        },
        {
            speaker: "rick",
            text: "那他还可能是个恐怖分子计划带核弹去炸掉荒坂塔！",
            character: "rick",
            characterImage: "rick生气摊手"
        },
        {
            speaker: "rick",
            text: "（他们移到中间的工艺区。一台3D打印机在嗡嗡作响，旁边的那个工作台放着各种精密量具)",
            character: "rick",
            characterImage: "rick思考上看",
            evidenceIndex: 1,
            unlockEvidence: 1,
            playSfx: "3d-printer"
        },
        {
            speaker: "morty",
            text: "哇……看这细节。还有这工具墙！这些东西都是他自己造的？瑞克，他就像……他就像钢铁侠！",
            character: "morty",
            characterImage: "morty欣赏"
        },
        {
            speaker: "rick",
            text: "这家伙只是在给他的烤箱打印替换旋钮。（随手打开工作台的一个盒子）",
            character: "rick",
            characterImage: "rick生气抱胸"
        },
        {
            speaker: "rick",
            text: "\"数控技师证书\"。……等等……这家伙18岁就是数控技师了？行吧，终于看到有点含金量的东西了。",
            character: "rick",
            characterImage: "rick赞叹",
            evidenceIndex: 2,
            unlockEvidence: 2
        },
        {
            speaker: "morty",
            text: "（跑到右边的户外区。盯着\"BOB\"背包和户外装备。)呃，瑞克？什么是BOB背包？",
            character: "morty",
            characterImage: "morty认真思考",
            evidenceIndex: 3,
            unlockEvidence: 3
        },
        {
            speaker: "rick",
            text: "那是\"求生背包\" (Bug-Out Bag)的缩写，意思是当社会崩塌的时候，他抓起这个包就消失在树林里，去吃松果、打僵尸。",
            character: "rick",
            characterImage: "rick自豪抬手"
        },
        {
            speaker: "rick",
            text: "(大笑) 莫蒂，这家伙不只是个\"酷哥们\"。他还是个末日准备狂。",
            character: "rick",
            characterImage: "rick自豪叉腰"
        },
        {
            speaker: "rick",
            text: "（偷偷把工作台上一把高端数显卡尺揣进兜里) 现在，我得找到他的电脑，从他的硬盘里下载他的罗宋汤食谱！",
            character: "rick",
            characterImage: "rick闯祸尴尬"
        },
        {
            speaker: "morty",
            text: "瑞克！别偷他的工具！",
            character: "morty",
            characterImage: "morty哭生气"
        }
    ],
    
    // 第三幕书房对话数据
    chapter3Study: [
        {
            speaker: "rick",
            text: "(环顾四周) 太好了。我们找到*死宅核心*了。这是他大脑用来吞进流行文化的地方。",
            character: "rick",
            characterImage: "rick思考眯眼"
        },
        {
            speaker: "rick",
            text: "看这些实体媒介。录像带？黑胶唱片？这简直是低效数据存储的坟墓。",
            character: "rick",
            characterImage: "rick生气摊手"
        },
        {
            speaker: "morty",
            text: "(走到影音书架前。满是星星眼。)",
            character: "morty",
            characterImage: "morty星星眼",
            showEvidence: true,
            evidenceIndex: 0,
            playSfx: "bookshelf"
        },
        {
            speaker: "morty",
            text: "科幻、侦探小说，犯罪电影，经典美剧，唱片，漫画。好多收藏！",
            character: "morty",
            characterImage: "morty欣赏"
        },
        {
            speaker: "rick",
            text: "(瑞克站在房间中央，缓慢地转了一圈。他看看外面的一切，再看看书架，又看看墙上的各种海报，最后看看手办。)",
            character: "rick",
            characterImage: "rick思考托腮",
            hideEvidence: true
        },
        {
            speaker: "rick",
            text: "这就像上帝在角色创建界面点了\"随机生成\"，然后就跑去吃三明治忘了点暂停一样。",
            character: "rick",
            characterImage: "rick生气抱胸"
        },
        {
            speaker: "morty",
            text: "我觉得很酷啊！他有广泛的兴趣！ (他指着哈兰德球衣和皇后乐队唱片) 他喜欢运动也喜欢艺术！他很全面！",
            character: "morty",
            characterImage: "morty微笑"
        },
        {
            speaker: "rick",
            text: "专注是激光，莫蒂。它能切穿钢板。这家伙？他是个迪斯科球。 他往一千个方向反射一点点微光，转起来挺好看，但最终呢？",
            character: "rick",
            characterImage: "rick生气握拳"
        },
        {
            speaker: "morty",
            text: "这也……这也太刻薄了，瑞克。也许他只是喜欢做这些事。",
            character: "morty",
            characterImage: "morty哭生气"
        },
        {
            speaker: "rick",
            text: "(瑞克转向电脑屏幕)",
            character: "rick",
            characterImage: "rick思考抬头",
            showEvidence: true,
            evidenceIndex: 1,
            unlockEvidence: 1
        },
        {
            speaker: "rick",
            text: "现在，让我们看看这位\"杰克船长\"有没有记得加密他的浏览器历史记录和\"学习资料\"。",
            character: "rick",
            characterImage: "rick自豪叉腰",
            evidenceIndex: 2,
            unlockEvidence: 2
        }
    ]
};

// 道具数据
const EvidenceData = [
    {
        name: "ID卡道具",
        image: "assets/evidence/id_card.png"
    },
    {
        name: "手机破解",
        image: "assets/evidence/phone_hacked.png"
    },
    {
        name: "手机桌面",
        image: "assets/evidence/phone_desktop.png"
    },
    {
        name: "替换桌面",
        image: "assets/evidence/phone_replaced.png"
    },
    {
        name: "收到短信",
        image: "assets/evidence/message_received.png"
    },
    {
        name: "王阿姨短信一",
        image: "assets/evidence/message1.png"
    },
    {
        name: "王阿姨短信二",
        image: "assets/evidence/message2.png"
    }
];

// 第三幕客厅道具数据
const LivingEvidenceData = [
    {
        name: "音乐区",
        image: "assets/evidence/music_area.png"
    },
    {
        name: "3D打印机",
        image: "assets/evidence/3d_printer.png"
    },
    {
        name: "数控技师证",
        image: "assets/evidence/cnc_certificate.png"
    },
    {
        name: "BOB背包",
        image: "assets/evidence/bob_bag.png"
    }
];

// 第三幕书房道具数据
const StudyEvidenceData = [
    {
        name: "书架展示",
        image: "assets/evidence/bookshelf.png"
    },
    {
        name: "电脑展示",
        image: "assets/evidence/computer.png"
    },
    {
        name: "电脑破解",
        image: "assets/evidence/computer_hacked.png"
    }
];

// 第四幕电脑桌面对话数据
const DialogDataChapter4 = {
    // 第一段：看到桌面背景的对话
    desktop: [
        {
            speaker: "rick",
            text: "等等，我好像认识这只兔子。它叫阿姆斯兔。这个背影我死都不会忘记。",
            character: "rick",
            characterImage: "rick思考眯眼"
        },
        {
            speaker: "morty",
            text: "你认识他？他是你的旧酒友吗？",
            character: "morty",
            characterImage: "morty正常"
        },
        {
            speaker: "rick",
            text: "比那疯狂多了，莫蒂。某一年的 TGA 音乐会上，我就坐在离他不远的地方。",
            character: "rick",
            characterImage: "rick思考托腮"
        },
        {
            speaker: "rick",
            text: "当时那个索尼的宇宙机器人一直在旁边嗡嗡乱叫，你知道，就是那种讨厌的8-bit电子音。那兔子忍了三分钟，然后...",
            character: "rick",
            characterImage: "rick正常"
        },
        {
            speaker: "rick",
            text: "(打了个嗝) ...然后他徒手把那机器人的手柄从裤裆里拽出来，当场给撕烂了。那场面，是我见过的最暴力的\"静音模式\"。",
            character: "rick",
            characterImage: "rick自豪抬手"
        },
        {
            speaker: "morty",
            text: "天哪... 那听起来... 很疼。",
            character: "morty",
            characterImage: "morty小震惊"
        },
        {
            speaker: "rick",
            text: "原来如此... 他们两就是 GAME 宇宙中知名的反抗军联盟——月退文化的核心成员。",
            character: "rick",
            characterImage: "rick思考上看"
        },
        {
            speaker: "morty",
            text: "（指着任务栏上 PR, AE, PS, AU, C4D 等一排软件。）那些是什么软件？",
            character: "morty",
            characterImage: "morty认真思考"
        },
        {
            speaker: "rick",
            text: "PS，现实篡改器。PR，时间断头台。AE，粒子轰炸终端。AU，次元声波炮。C4D，那个最危险。那是多维渲染囚牢。",
            character: "rick",
            characterImage: "rick自豪叉腰"
        },
        {
            speaker: "rick",
            text: "（指着桌面上那些被打败的角色）所以你看这些被干碎的全都是GAME圈里有头有脸的恶势力。",
            character: "rick",
            characterImage: "rick自豪抬手"
        },
        {
            speaker: "morty",
            text: "（指向桌面上一个叫Projects的文件夹）快看这个文件夹。",
            character: "morty",
            characterImage: "morty欣赏"
        }
    ],
    
    // 第二段：打开项目文件夹后的对话
    projects: [
        {
            speaker: "rick",
            text: "(瑞克点开文件夹，里面密密麻麻全是项目包。)果然，都是战役记录。",
            character: "rick",
            characterImage: "rick思考抬头"
        },
        {
            speaker: "morty",
            text: "哇... 对抗强大的帝国，使用高科技装备...那他岂不是和你年轻时反抗星际联邦一样？",
            character: "morty",
            characterImage: "morty星星眼"
        },
        {
            speaker: "rick",
            text: "(不屑地撇撇嘴，翻了个白眼) 和我们当年比？这不过是小孩子过家家罢了。",
            character: "rick",
            characterImage: "rick生气抱胸"
        },
        {
            speaker: "rick",
            text: "我对抗的是控制整个宇宙维度的官僚机构，他们打的只是几个做烂游戏的黑心厂商罢了。接着看下他的浏览器吧",
            character: "rick",
            characterImage: "rick自豪叉腰"
        }
    ],
    
    // 第三段：打开浏览器后的对话
    browser: [
        {
            speaker: "morty",
            text: "\"不会打游戏的厨子不是一个好歌手\"...这是他的个人主页？",
            character: "morty",
            characterImage: "morty小震惊"
        },
        {
            speaker: "rick",
            text: "看来我们的\"反抗军英雄\"以前还是个试图三栖发展的UP主。",
            character: "rick",
            characterImage: "rick思考眯眼"
        },
        {
            speaker: "rick",
            text: "(点开收藏夹，全是 AI 相关的链接：大模型：gemini、deepseek、豆包 生图：nanobanana 视频：Sora2、wan、pollo、veo3 音频：minimax、suno、IndexTTS2.5 开源：comfyui 编程：Kiro)",
            character: "rick",
            characterImage: "rick思考托腮",
            showWatching: true,
            hidePopup: true
        },
        {
            speaker: "rick",
            text: "(打了个嗝) 你再看这个最近搜索记录，看来咱们这位现在最新的爱好变成AI驾驶员了",
            character: "rick",
            characterImage: "rick自豪抬手"
        },
        {
            speaker: "morty",
            text: "不要随便翻别人的浏览器历史记录！",
            character: "morty",
            characterImage: "morty抱头担心",
            hideWatching: true
        },
        {
            speaker: "rick",
            text: "看来食谱应该就在那里了！哈！",
            character: "rick",
            characterImage: "rick自豪叉腰"
        }
    ]
};

// 第五幕对话数据
const DialogDataChapter5 = [
    {
        speaker: "rick",
        text: "(瑞克 猛地吸了一口气，仿佛刚从溺水中醒来。周围的世界开始崩塌。)",
        character: "rick",
        characterImage: "rick惊讶张嘴"
    },
    {
        speaker: "rick",
        text: "是他救了我们！不是我们救了他！莫蒂！",
        character: "rick",
        characterImage: "rick生气握拳"
    },
    {
        speaker: "rick",
        text: "这整个房子就是一个\"病毒隔离区\"！或者说其实是他把病毒源隔离在了这里！",
        character: "rick",
        characterImage: "rick生气摊手"
    },
    {
        speaker: "rick",
        text: "我们被耍了，莫蒂！那座东方明珠塔是杀毒软件！它是能消灭这个空间里病毒的武器！",
        character: "rick",
        characterImage: "rick惊讶张嘴",
        showEvidence: true,
        evidenceIndex: 0
    },
    {
        speaker: "morty",
        text: "门窗都打不开了！瑞克！",
        character: "morty",
        characterImage: "morty抱头担心",
        playSfx: "locked"
    },
    {
        speaker: "rick",
        text: "是王阿姨！把我们像两个白痴一样骗进来，帮病毒把牢笼给撬了！还炸毁了杀毒软件！",
        character: "rick",
        characterImage: "rick生气握拳"
    },
    {
        speaker: "逗王",
        text: "（巨大的脸发出震耳欲聋的响声）听着！你们两个！",
        character: "douwang",
        characterImage: "morty害怕恐怖",
        evidenceIndex: 1,
        unlockEvidence: 1
    },
    {
        speaker: "逗王",
        text: "我的防火墙快被融化了！你们必须自己在内部找到杀毒代码！",
        character: "douwang",
        characterImage: "morty张嘴吓傻"
    },
    {
        speaker: "rick",
        text: "我就知道！嘿，大个子！你的系统漏洞在哪？每个程序都有后门！",
        character: "rick",
        characterImage: "rick思考眯眼"
    },
    {
        speaker: "逗王",
        text: "不和谐点！找到这个屋子里最不合理、最突兀的东西！",
        character: "douwang",
        characterImage: "rick思考上看"
    },
    {
        speaker: "morty",
        text: "（环顾四周）最不合理？这里每样东西都酷毙了！除了……",
        character: "morty",
        characterImage: "morty认真思考"
    },
    {
        speaker: "morty",
        text: "（莫蒂 的视线落在了床底下那个贴着\"绝密\"的箱子）",
        character: "morty",
        characterImage: "morty偷看",
        evidenceIndex: 2,
        unlockEvidence: 2
    },
    {
        speaker: "rick",
        text: "（冲过去把箱子拖出来）二次元同人小说！他绝对不是二次元！你看这周围的一切！这二次元浓度实在太低了！",
        character: "rick",
        characterImage: "rick自豪叉腰",
        showClickArea: "secret-box-area"
    },
    {
        speaker: "morty",
        text: "(打开箱子。里面不是同人本，是一摞《瑞克和莫蒂》的漫画书，还有一把造型奇怪、里面流动着白色液体的枪)",
        character: "morty",
        characterImage: "morty小震惊",
        evidenceIndex: 3,
        playSfx: "open-box",
        unlockEvidence: 3
    },
    {
        speaker: "morty",
        text: "瑞克……这是……我们的漫画？",
        character: "morty",
        characterImage: "morty张嘴担心"
    },
    {
        speaker: "rick",
        text: "（一把抓起那把枪，晃了晃）别管那个打破第四面墙的烂梗了，莫蒂。",
        character: "rick",
        characterImage: "rick手持修正液枪"
    },
    {
        speaker: "rick",
        text: "这是\"修正液枪\"！在这个由意识构成的世界里，这就是上帝的橡皮擦！",
        character: "rick",
        characterImage: "rick手持修正液枪"
    },
    {
        speaker: "旁白",
        text: "（就在这时，王阿姨突然闯进门！）",
        character: "narrator",
        characterImage: "morty害怕恐怖",
        evidenceIndex: 4,
        unlockEvidence: 4,
        playSfx: "break-in"
    },
    {
        speaker: "王阿姨",
        text: "（声音扭曲，变成电子合成音）交！房！租！交！出！源！代！码！",
        character: "landlady",
        characterImage: "morty张嘴吓傻"
    },
    {
        speaker: "rick",
        text: "经典的烂俗反派登场时机，我可不想听\"死于话多\"的反派发表获奖感言。",
        character: "rick",
        characterImage: "rick生气抱胸"
    },
    {
        speaker: "rick",
        text: "(瑞克 举起修正液枪。瞄准王阿姨）",
        character: "rick",
        characterImage: "rick手持修正液枪",
        showClickArea: "landlady-area"
    },
    {
        speaker: "rick",
        text: "（正要射击时。瑞克突然转身，瞄准了正在播放蜜雪冰城广告的电视机——里面的那个雪人)",
        character: "rick",
        characterImage: "rick手持修正液枪",
        evidenceIndex: 5,
        unlockEvidence: 5,
        showClickArea: "snowman-area"
    },
    {
        speaker: "rick",
        text: "(扣动扳机。一股白色的浓稠液体喷涌而出，击中了雪人。)",
        character: "rick",
        characterImage: "rick手持修正液枪",
        evidenceIndex: 6,
        unlockEvidence: 6,
        playSfx: "whiteout-gun"
    },
    {
        speaker: "rick",
        text: "那个伪装成景点的杀毒软件锁定的目标其实一直是你！王阿姨只不过是你的傀儡罢了。",
        character: "rick",
        characterImage: "rick自豪叉腰"
    },
    {
        speaker: "雪人",
        text: "（发出电子合成音）你！爱！我！我！爱！你！蜜！雪！冰！城！统！治！上！海！",
        character: "snowman",
        characterImage: "morty害怕恐怖"
    },
    {
        speaker: "rick",
        text: "（举起手中的修正液枪，看着慢慢融化的雪人）好了莫蒂，我们准备回到现实吧！",
        character: "rick",
        characterImage: "rick手持修正液枪"
    }
];

// 第五幕道具数据
const Chapter5EvidenceData = [
    {
        name: "炸毁东方明珠",
        image: "assets/evidence/tower_destroyed.png"
    },
    {
        name: "逗王",
        image: "assets/evidence/douwang_face.png"
    },
    {
        name: "床底绝密箱子",
        image: "assets/evidence/secret_box_under_bed.png"
    },
    {
        name: "打开的箱子",
        image: "assets/evidence/box_opened.png"
    },
    {
        name: "王阿姨闯入",
        image: "assets/evidence/landlady_enter.png"
    },
    {
        name: "电视上的雪人",
        image: "assets/evidence/tv_snowman.png"
    },
    {
        name: "雪人融化",
        image: "assets/evidence/snowman_melting.png"
    }
];

// 第六幕对话数据
const DialogDataChapter6 = [
    // 场景1：战斗场景（背景切换模式）
    {
        speaker: "旁白",
        text: "(瑞克 和 莫蒂 猛地睁开眼。他们躺在地上。面前是一只巨大的、邪恶企鹅 BOSS。)",
        character: "narrator",
        changeBackground: "assets/backgrounds/chapter6_penguin_boss.jpg"
    },
    {
        speaker: "旁白",
        text: "（突然！邪恶企鹅 BOSS举起巨型金锅锅砸下）",
        character: "narrator",
        changeBackground: "assets/backgrounds/chapter6_penguin_pot.jpg"
    },
    {
        speaker: "旁白",
        text: "(砰！一道身影出现挡住了砸下的金锅锅)",
        character: "narrator",
        changeBackground: "assets/backgrounds/chapter6_shadow.jpg",
        playSfx: "block"
    },
    {
        speaker: "旁白",
        text: "(电光火石之间，企鹅 BOSS 举着金锅锅的手被一剑砍飞。)",
        character: "narrator",
        changeBackground: "assets/backgrounds/chapter6_hand_cut.jpg",
        playSfx: "cut-arm"
    },
    {
        speaker: "旁白",
        text: "（砰！金锅锅重重砸向地面）",
        character: "narrator",
        changeBackground: "assets/backgrounds/chapter6_pot_fall.jpg"
    },
    {
        speaker: "逗王",
        text: "我就知道你们会醒的。那把\"修正液\"好用吗？",
        character: "douwang",
        changeBackground: "assets/backgrounds/chapter6_cool_landing.jpg",
        playSfx: "cool-landing"
    },
    {
        speaker: "rick",
        text: "（拍了拍身上的土）稍微有点粘手。但在意识流里手感还凑合。",
        character: "rick",
        characterImage: "rick正常"
    },
    {
        speaker: "逗王",
        text: "（握紧铅笔剑）好了，不废话了。赶紧搭把手，今天必须跟这个\"最终需求\"做个了断了。",
        character: "douwang",
        playSfx: "grip-sword"
    },
    {
        speaker: "morty",
        text: "（捡起一块砖头，颤抖但坚定）哦，天哪。好吧。我们...我们一起上吧！",
        character: "morty",
        characterImage: "morty假装镇定"
    },
    {
        speaker: "阿姆斯兔",
        text: "（不作任何表示，只是一味的装填弹药）",
        character: "ams",
        playSfx: "reload"
    },
    {
        speaker: "rick",
        text: "那个金锅锅归我了！我要拿它给杰瑞当猫砂盆！！！Wubba Lubba Dub Dub！！！",
        character: "rick",
        characterImage: "rick传送枪瞄准",
        changeBackground: "assets/backgrounds/chapter6_charge.jpg"
    },
    {
        speaker: "旁白",
        text: "(升格镜头：在暴怒的巨大企鹅身影下，四人的背影：瑞克, 莫蒂, 逗王, 阿姆斯兔。同时冲向了那巨大的黑色雷霆中。。。)",
        character: "narrator",
        stopBgm: true
    },
    // 黑幕过渡
    {
        speaker: "",
        text: "",
        character: "blackscreen",
        blackscreenText: "当天稍晚........",
        changeBackground: "assets/backgrounds/chapter6_restaurant.jpg"
    },
    // 场景2：深夜食堂
    {
        speaker: "旁白",
        text: "(认真烹饪的老板站在在中间，边上是4个刚结束战斗的憨货。)",
        character: "narrator"
    },
    {
        speaker: "旁白",
        text: "(桌上摆着各种经典日式餐点，还有几瓶喝完了的啤酒。)",
        character: "narrator",
        showEvidence: true,
        evidenceIndex: 0,
        unlockEvidence: 0
    },
    {
        speaker: "rick",
        text: "（嗦着一碗日式拉面）说实话，这可比那锅罗宋汤差的远了。",
        character: "rick",
        characterImage: "rick正常",
        playSfx: "slurp-noodle"
    },
    {
        speaker: "旁白",
        text: "老板突然有杀气的眼神看了过来。（画风都突然变了）",
        character: "narrator",
        characterImage: "rick闯祸尴尬",
        evidenceIndex: 1,
        unlockEvidence: 1,
        playSfx: "glare"
    },
    {
        speaker: "旁白",
        text: "其他人下意识的赶紧坐的离瑞克远了一些。",
        character: "narrator",
        characterImage: "rick闯祸投降",
        playSfx: "move-seat"
    },
    {
        speaker: "rick",
        text: "所以你的罗宋汤食谱究竟藏在哪里？",
        character: "rick",
        characterImage: "rick思考抬头",
        hideEvidence: true
    },
    {
        speaker: "逗王",
        text: "(沉默了一秒，嘴角露出一丝难以捉摸的苦笑)",
        character: "douwang"
    },
    {
        speaker: "逗王",
        text: "好吧。原本我想把它带进坟墓的。既然你这么坚持... 它是你的了。",
        character: "douwang"
    },
    {
        speaker: "逗王",
        text: "(从怀里掏出一张皱巴巴、甚至带着点陈旧血迹或者是番茄汁？的泛黄信纸，递给了 瑞克。)",
        character: "douwang",
        characterImage: "rick正常",
        showEvidence: true,
        evidenceIndex: 2,
        unlockEvidence: 2,
        playSfx: "take-recipe"
    },
    {
        speaker: "rick",
        text: "(瑞克一把夺过，满不在乎地展开。)",
        character: "rick",
        characterImage: "rick自豪叉腰",
        playSfx: "open-recipe"
    },
    {
        speaker: "rick",
        text: "让我看看... 洋葱、土豆、胡萝卜、老上海红肠... 还有... 嗯？",
        character: "rick",
        characterImage: "rick思考托腮"
    },
    {
        speaker: "rick",
        text: "(视线扫到纸张的中段。突然，他那双总是半睁着的、充满厌世感的眼睛猛地瞪圆了，他的瞳孔在颤抖。)",
        character: "rick",
        characterImage: "rick惊讶张嘴",
        evidenceIndex: 3,
        unlockEvidence: 3
    },
    {
        speaker: "morty",
        text: "(看到 瑞克 的表情，好奇心战胜了恐惧，凑了上来)",
        character: "morty",
        characterImage: "morty偷看"
    },
    {
        speaker: "morty",
        text: "瑞克？上面写了什么？是什么特殊的香料吗？是不是加了什么外星植物？让我看看！",
        character: "morty",
        characterImage: "morty欣赏"
    },
    {
        speaker: "rick",
        text: "（啪！瑞克 猛地打掉了 莫蒂 的手）不！别碰它，莫蒂！",
        character: "rick",
        characterImage: "rick生气握拳",
        playSfx: "slap-hand"
    },
    {
        speaker: "rick",
        text: "你又忘了意大利面事件的教训了吗！相信我，你永远不会想要知道!",
        character: "rick",
        characterImage: "rick生气摊手"
    },
    {
        speaker: "rick",
        text: "（说完，看了一眼手里的纸，随手把它揉成一个紧实的纸团，像扔垃圾一样扔到了角落的阴影里。)",
        character: "rick",
        characterImage: "rick无奈闭眼",
        evidenceIndex: 4,
        unlockEvidence: 4,
        playSfx: "crumple-paper"
    },
    {
        speaker: "旁白",
        text: "(两人回过头)",
        character: "narrator",
        hideEvidence: true,
        changeBackground: "assets/backgrounds/chapter6_leaving.jpg"
    },
    // 场景3：离去
    {
        speaker: "旁白",
        text: "(逗王和阿姆斯兔的位置上空空如也。只有那个已经吃完的拉面还在冒着热气，仿佛他们从未存在过一样)",
        character: "narrator"
    },
    {
        speaker: "rick",
        text: "哼。经典的退场方式。还要装出一副\"我是传奇\"的样子，典型的反抗军作风。",
        character: "rick",
        characterImage: "rick生气抱胸"
    },
    {
        speaker: "旁白",
        text: "(瑞克 打开传送门，绿色的漩涡照亮了昏暗的残破餐厅。)",
        character: "narrator",
        characterImage: "rick手持传送枪"
    },
    {
        speaker: "rick",
        text: "走了，莫蒂。",
        character: "rick",
        characterImage: "rick手持传送枪"
    },
    {
        speaker: "旁白",
        text: "(瑞克和莫蒂 跨入传送门，消失不见。)",
        character: "narrator",
        playSfx: "portal"
    }
];

// 第六幕道具数据
const Chapter6EvidenceData = [
    {
        name: "日式餐食",
        image: "assets/evidence/japanese_food.png"
    },
    {
        name: "老板杀气眼神",
        image: "assets/evidence/boss_glare.png"
    },
    {
        name: "泛黄食谱信纸",
        image: "assets/evidence/recipe_paper.png"
    },
    {
        name: "rick震惊表情",
        image: "assets/evidence/rick_shocked.png"
    },
    {
        name: "丢弃的纸团",
        image: "assets/evidence/paper_ball.png"
    }
];

// 导出数据
window.DialogData = DialogData;
window.DialogDataChapter4 = DialogDataChapter4;
window.DialogDataChapter5 = DialogDataChapter5;
window.DialogDataChapter6 = DialogDataChapter6;
window.EvidenceData = EvidenceData;
window.LivingEvidenceData = LivingEvidenceData;
window.StudyEvidenceData = StudyEvidenceData;
window.Chapter5EvidenceData = Chapter5EvidenceData;
window.Chapter6EvidenceData = Chapter6EvidenceData;