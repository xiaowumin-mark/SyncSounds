<template>
    <div class="main_dia" v-show="ID == 'h1'">
        <img src="https://p1.music.126.net/4o8dGgZgouKRDQfl6Fp3dA==/109951169452179670.jpg?param=130y130" alt=""
            class="img">

        <div class="bg_more">

        </div>
        <div class="box">
            <mdui-card variant="elevated" style="width: 400px;height: 250px;margin: 10px;padding: 20px;" class="card">
                <h3 style="text-align: center;">因房主限制，请输入密码访问</h3>
                <mdui-text-field type="password" toggle-password style="margin-top: 10px;" label="请输入密码"
                    variant="outlined" :value="password" @input="password = $event.target.value"></mdui-text-field>
                <div style="width: 100%;display: flex;justify-content: center;margin-top: 30px;">
                    <mdui-button variant="elevated" @click="enter">进入房间</mdui-button>
                </div>

            </mdui-card>
        </div>

    </div>

    <div class="app" v-show="ID != 'h1'">
        <img src="https://p1.music.126.net/9cySfhHshoKksSkAxwVVqw==/109951163175751210.jpg" alt="" class="img">
        <div class="bg_more"></div>
        <div class="ctx">
            <div class="header">
                <div class="back">
                    <mdui-button-icon @click="goback" icon="arrow_back_ios_new"></mdui-button-icon>

                </div>
                <div class="title">
                    <p style="font-weight: 700;font-size: 17px;">藏</p>
                    <p style="margin-top: -13px;opacity: 0.7;font-size: 15px">
                        徐梦圆
                    </p>
                </div>
                <div class="more">

                    <mdui-dropdown>
                        <mdui-button-icon slot="trigger" icon="more_horiz"></mdui-button-icon>
                        <mdui-menu>
                            <mdui-menu-item @click="more.open = true">音乐列表</mdui-menu-item>

                            <mdui-menu-item>下载歌曲</mdui-menu-item>
                            <mdui-menu-item>下载歌词</mdui-menu-item>


                        </mdui-menu>
                    </mdui-dropdown>
                </div>
            </div>
            <div class="content">
                <div class="image">
                    <img src="https://p1.music.126.net/9cySfhHshoKksSkAxwVVqw==/109951163175751210.jpg"
                        style="view-timeline-name: h2;" alt="" srcset="">
                </div>
                <div class="lyric" style="text-align: center;" id="lrc">
                    <!-- <p style="font-weight: 900;font-size: 17px;">没什么大愿望</p>
                    <p style="opacity: 0.5;font-weight: 600;line-height: 12px;">没有什么事要赶</p> -->

                </div>
            </div>
            <div class="footer">
                <div class="btns">
                    <div class="item">
                        <mdui-button-icon icon="list"></mdui-button-icon>
                    </div>
                    <div class="item">
                        <mdui-button-icon icon="people--outlined" @click="people_dia.open = true"></mdui-button-icon>
                    </div>
                    <div class="item">
                        <mdui-button-icon selectable icon="favorite_border" selected-icon="favorite"></mdui-button-icon>
                    </div>
                    <div class="item">
                        <mdui-button-icon icon="message--outlined" @click="message_dia.open = true"></mdui-button-icon>
                    </div>
                </div>
                <div class="progress">
                    <mdui-slider nolabel :max="all_time" step="0.001" :value="now_time" @mousedown="music.pause()"
                        @mouseup="music.play()" @input="music.currentTime = $event.target.value"></mdui-slider>
                </div>
                <div class="control">
                    <div class="left">
                        <mdui-button-icon icon="skip_previous"></mdui-button-icon>
                    </div>
                    <div class="center">
                        <mdui-fab :icon="is_paused ? 'play_arrow' : 'pause'" @click="tooglePlay"></mdui-fab>
                    </div>
                    <div class="right">
                        <mdui-button-icon icon="skip_next"></mdui-button-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--  <img src="https://p1.music.126.net/4o8dGgZgouKRDQfl6Fp3dA==/109951169452179670.jpg?param=130y130"  :style="{viewTransitionName:'home1'}" alt="" srcset=""> -->
    <mdui-fab v-show="ID == 'h1'" style="position: fixed;bottom: 20px;right: 20px;z-index: 50;" icon="undo"
        @click="goback"></mdui-fab>
    <audio src="/m.m4a" ref="music" id="music"></audio>

    <mdui-navigation-drawer placement="right" modal close-on-esc close-on-overlay-click contained ref="more"
        style="position: fixed;">
        <div style="height: 100%;overflow-y: auto;" class="scrollbar">
            <mdui-list>

                <mdui-dropdown trigger="contextmenu" open-on-pointer v-for="i in 12" :key="i">
                    <mdui-list-item rounded slot="trigger">
                        小美满
                        <mdui-avatar slot="icon"
                            src="https://p1.music.126.net/9cySfhHshoKksSkAxwVVqw==/109951163175751210.jpg"></mdui-avatar>
                        <span slot="description">周深</span>
                        <mdui-button-icon slot="end-icon" variant="standard" icon="play_arrow"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-menu>
                        <mdui-menu-item>删除歌曲</mdui-menu-item>
                        <mdui-menu-item>播放歌曲</mdui-menu-item>

                    </mdui-menu>
                </mdui-dropdown>
            </mdui-list>
        </div>
    </mdui-navigation-drawer>

    <mdui-dialog close-on-overlay-click class="example-header" fullscreen ref="people_dia">
        <mdui-top-app-bar slot="header">
            <mdui-top-app-bar-title>房间成员<mdui-badge>12</mdui-badge></mdui-top-app-bar-title>
            <mdui-button-icon icon="close" @click="people_dia.open = false"></mdui-button-icon>
        </mdui-top-app-bar>
        <div style="height: 100%;overflow-y: auto;" class="scrollbar">
            <mdui-list>

                <mdui-dropdown trigger="contextmenu" open-on-pointer v-for="i in 12" :key="i">
                    <mdui-list-item rounded slot="trigger">
                        Headline
                        <mdui-avatar slot="icon"
                            src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
                        <span slot="description" v-show="i == 1">房主</span>
                        <span slot="description" v-show="i >= 2 && i <= 8">管理员</span>
                    </mdui-list-item>
                    <mdui-menu>
                        <mdui-menu-item>取消管理员</mdui-menu-item>
                        <mdui-menu-item>设为管理员</mdui-menu-item>
                        <mdui-menu-item>踢出房间</mdui-menu-item>

                    </mdui-menu>
                </mdui-dropdown>
            </mdui-list>
        </div>
    </mdui-dialog>

    <mdui-dialog close-on-overlay-click fullscreen ref="message_dia" style="padding: 0 !important;">
        <mdui-top-app-bar slot="header">
            <mdui-top-app-bar-title>房间消息</mdui-top-app-bar-title>
            <mdui-button-icon icon="close" @click="message_dia.open = false"></mdui-button-icon>
        </mdui-top-app-bar>
        <div style="height: auto;overflow-y: auto;padding-bottom: 50px" class="no_scrollbar">
            <div class="chat_box">
                <div class="left">
                    <img src="https://foruda.gitee.com/avatar/1720864383166909386/9548756_hycnb_1720864383.png!avatar200"
                        alt="" srcset="">
                </div>
                <div class="main">
                    <div class="title">
                        无语
                    </div>
                    <div class="content">
                        枣殇嚎
                    </div>
                </div>
            </div>

            <div class="chat_box_r">
                <div class="right">
                    <img src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4" alt="" srcset="">
                </div>
                <div class="main">
                    <div class="content">
                        泥嚎
                    </div>
                </div>

            </div>
            <div class="chat_box_r">
                <div class="right">
                    <img src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4" alt="" srcset="">
                </div>
                <div class="main">
                    <div class="content">
                        泥嚎泥嚎
                    </div>
                </div>

            </div>
            <div class="chat_box" v-for="i in 20">
                <div class="left">
                    <img src="https://foruda.gitee.com/avatar/1720864383166909386/9548756_hycnb_1720864383.png!avatar200"
                        alt="" srcset="">
                </div>
                <div class="main">
                    <div class="title">
                        无语
                    </div>
                    <div class="content">
                        枣殇嚎啊
                    </div>
                </div>
            </div>
            <mdui-text-field label="输入内容" style="width: calc(100% - 40px);position: fixed;bottom: 20px;right: 20px;">
                <mdui-button-icon slot="end-icon" icon="send"></mdui-button-icon>
            </mdui-text-field>
        </div>
    </mdui-dialog>

</template>

<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import { snackbar } from "mdui/functions/snackbar.js";
// 获取params参数
const ID = ref(router.currentRoute.value.params.id);
import musicLyric from "@/assets/ml";
const password = ref('');
const is_paused = ref(true);
const all_time = ref(1.0);
const now_time = ref(0);
const more = ref(null);
const people_dia = ref(null);
const message_dia = ref(null);
const enter = () => {
    if (password.value === '1145141') {
        alert('请输入密码');
        return;
    } else {
        snackbar({
            message: "密码错误，请重新输入",
            placement: "top",
        });
    }
}

const goback = () => {
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            router.go(-1);
        })
    } else {
        router.go(-1);
    }


}

const music = ref(null);
//const music = document.querySelector('audio');
onMounted(() => {
    console.log(music.value);
    window.music = music.value;
    //当音频加载完成时触发
    music.value.addEventListener("loadedmetadata", () => {
        all_time.value = music.value.duration;
        window.mul = musicLyric({
            audio: "#music",
            lyric: "#lrc",
            style: {
                lineHight: 25,
                scale: 1.2
            },
            lyricText: `[00:00.00] 作词 : 温莨
[00:00.15] 作曲 : 徐梦圆
[00:00.31]编曲：徐梦圆
[00:00.32]徐：
[00:00.33]晚风轻轻 带着初春的凉
[00:02.95]脸微烫 是青梅子的忧伤
[00:06.56]听闻最近 你要前去洛阳
[00:10.04]在心中 结一层数九寒霜
[00:13.10]笙：
[00:13.32]书院先生 责我心游神晃
[00:16.62]才不是 因为你不在课堂
[00:20.05]我也只是恰好路过你窗
[00:23.67]捎带着 送你本诗集全唐
[00:27.14]徐：
[00:27.30]有歌谣赠同窗 定不要遗忘
[00:30.51]蒹葭呀苍苍 白露呀为霜
[00:33.78]我才不是文盲 莫笑我荒唐
[00:37.30]来不及背牢 就和你分享
[00:40.94]笙：
[00:41.10]蝉声清响 伴着那炎炎暑光
[00:43.97]脸微烫 怪夏日闷热难扛
[00:47.49]一封信笺 你说想念家乡
[00:51.15]叮嘱我 勤勤恳恳上学堂
[00:54.11] 啦啦啦啦啦啦
[01:08.40]徐+笙：
[01:08.55]有一言赠同窗 你定要珍藏
[01:11.65]举头望明月 莫要太思乡
[01:14.90]鸿雁来来往往 才不会盼望
[01:18.33]你信中的话 从未放心上
[01:36.25]徐：
[01:36.52]晚风瑟瑟 带着入秋的凉
[01:38.99]脸微烫 是灯会焰火的光
[01:42.50]中秋归乡 并肩将月儿赏
[01:45.80]却没成想 碰见八个同窗
[01:49.31]笙：
[01:49.52]其中有个姑娘 眼睛大又亮
[01:52.97]对你说什么 前路还漫长
[01:56.08]怒火冲破胸膛 却行得端庄
[01:59.46]斟酌着开嗓 她好生漂亮
[02:03.03]徐+笙：
[02:03.19]中庭埋下 一坛醉梨秋酿
[02:06.18]心心念 与你举盏话衷肠
[02:09.75]藏住不说 最是意味绵长
[02:13.06]你偏偏 懂得我所有佯装
[02:16.75] 啦啦啦啦啦啦
[02:30.58]徐+笙：
[02:30.72]何不赶快邀上 大眼睛姑娘
[02:33.75]日后路漫长 也好相扶帮
[02:37.22]忘了我这同窗 我也将你忘
[02:40.56]你可要听好 我从不撒谎
[03:14.31] 制作人：袁大巍
[03:14.47]和声编写：李晓璇
[03:14.66]和声录制：李晓璇 袁大巍
[03:14.78]录音师：袁大巍
[03:14.93]混音：吴澎
[03:15.37]母带：Chris Gehringer (美国)`
        })
    })


    music.value.addEventListener("play", () => {
        is_paused.value = music.value.paused;
        console.log('play')

    })
    music.value.addEventListener("pause", () => {
        is_paused.value = music.value.paused;
        console.log('pause')
    })
    music.value.addEventListener("timeupdate", (e) => {
        now_time.value = music.value.currentTime;

    })


})

const tooglePlay = () => {
    if (is_paused.value) {
        music.value.play();
    } else {
        music.value.pause();
    }
}
</script>

<style scoped>
.main_dia {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;



}

.app {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}

.img {
    position: relative;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    filter: blur(50px);
    transform: scale(1.2);
}

.bg_more {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10;
}

.box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;

}

.card {
    box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.32);
}

.ctx {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
}

@keyframes startTs {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.ctx .header {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: start;
    align-items: top;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 30px;
}

.ctx .header .back {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;


}

.ctx .header .title {
    width: calc(100% - 140px);
    height: 70px;
    text-align: center;
}

.ctx .header .more {
    width: 50px;
    height: 50px;
}

.ctx .content {
    width: 100%;
    height: calc(100% - 360px);
    padding: 25px;
    padding-bottom: 0px;
    box-sizing: border-box;
    overflow: hidden;

}

.ctx .content .image {
    width: 100%;
    height: calc(40vh - 50px);
    display: flex;
    justify-content: center;

}

.ctx .content .image img {
    height: 100%;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0px 19px 50px 0px rgba(100, 100, 111, 0.3);
}

.ctx .content .lyric {
    width: 100%;
    height: calc(100% - 40vh - 50px);
    margin: 0 auto;
    margin-top: 20px;
}

.ctx .footer {
    width: 100%;
    height: calc(50% - 180px);
}

.ctx .footer .btns {
    width: 100%;
    height: 45px;
    padding-left: 25px;
    padding-right: 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}

.ctx .footer .btns .item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% / 4);

}

.ctx .footer .progress {
    width: 100%;
    height: 80px;
    padding-left: 25px;
    padding-right: 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ctx .footer .progress mdui-slider {
    width: 100%;
}

.ctx .footer .control {
    width: 100%;
    height: 70px;
    padding-left: 50px;
    padding-right: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.ctx .footer .control .left {
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

}

.ctx .footer .control .right {
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ctx .footer .control .center {
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat_box {
    width: 100%;
    margin-bottom: 10px;
    display: inline-block;
    height: auto;
}

.chat_box .left {
    width: 45px;
    height: 45px;
    float: left;
    border-radius: 15px;
}

.chat_box .left img {
    width: 100%;
    height: 100%;
    border-radius: 15px;
}

.chat_box .main {
    width: calc(100% - 80px);
    min-height: 50px;
    float: left;
    margin-left: 5px;

}

.chat_box .main .content {
    width: auto;
    height: auto;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgb(255, 255, 255);
    border-radius: 3px 15px 15px 15px;
    display: inline-block;
    max-width: calc(100% - 20px);
}

.chat_box .main .title {
    font-size: 12px;
    line-height: 25px;
}

.chat_box_r {
    width: 100%;
    margin-bottom: 10px;
    display: inline-block;
    height: auto;
}

.chat_box_r .right {
    width: 45px;
    height: 45px;
    float: right;
    border-radius: 15px;
}

.chat_box_r .right img {
    width: 100%;
    height: 100%;
    border-radius: 15px;
}

.chat_box_r .main {
    width: calc(100% - 80px);
    min-height: 50px;
    float: right;
    margin-right: 5px;

}

.chat_box_r .main .content {
    width: auto;
    height: auto;
    padding: 10px;
    float: right;
    box-sizing: border-box;
    background-color: #DFE0FC;
    border-radius: 15px 3px 15px 15px;
    display: inline-block;
    max-width: calc(100% - 20px);
}


@media screen and (min-width: 860px) {
    .ctx .content .image {
        width: 50%;
        height: calc(100% - 100px);
        float: left;
    }

    .ctx .content .lyric {
        width: 50%;
        height: 100%;
        margin-top: 0px;
    }

}


</style>
