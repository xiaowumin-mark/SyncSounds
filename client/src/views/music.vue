<script setup>
import { ref } from 'vue'
import { getUserInfo, getUserSongList, songListDetail as lodaSongListData } from "@/assets/wy"
const usetInfo = ref({})
const songList = ref(null)
const mySongList = ref({})
const songListDetail = ref(null)
const songListData = ref([])
getUserInfo(localStorage.wyCookie).then(res => {
    console.log(res);

    usetInfo.value = res
    getUserSongList(localStorage.wyCookie, res.id).then(res => {
        console.log(res);
        mySongList.value = res
    }).catch(err => { console.log(err) })
}).catch(err => { console.log(err) })

const loadSongListDetail = (id) => {
    songListData.value = []
    songListDetail.value.open = true
    lodaSongListData(localStorage.wyCookie, id).then(res => {
        console.log(res);

        songListData.value = res

    })
}

</script>

<template>
    <!-- <mdui-top-app-bar variant="small" style="position: relative">
        <mdui-button-icon icon="menu" @click="songList.open = true"></mdui-button-icon>
        <mdui-top-app-bar-title>我的网易云</mdui-top-app-bar-title>
        <mdui-button-icon icon="search" @click="my_drawer.open = true"></mdui-button-icon>
    </mdui-top-app-bar> -->

    <div class="app" v-show="ID != 'h1'">
        <img src="https://p1.music.126.net/9cySfhHshoKksSkAxwVVqw==/109951163175751210.jpg" alt="" class="img">
        <div class="bg_more"></div>
        <div class="ctx">
            <div class="header">
                <div class="back">
                    <mdui-button-icon @click="songList.open = true" icon="list"></mdui-button-icon>

                </div>
                <div class="title">
                    <p style="font-weight: 700;font-size: 17px;">藏</p>
                    <p style="margin-top: -13px;opacity: 0.7;font-size: 15px">
                        徐梦圆
                    </p>
                </div>
                <div class="more">

                    <mdui-dropdown>
                        <mdui-button-icon slot="trigger" icon="more_vert"></mdui-button-icon>
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

    <mdui-navigation-drawer modal close-on-esc close-on-overlay-click ref="songList">
        <div style="height: 100%;overflow-y: auto;" class="scrollbar">
            <mdui-list>
                <mdui-list-subheader>我的歌单
                </mdui-list-subheader>
                <mdui-dropdown trigger="contextmenu" open-on-pointer v-for="i in mySongList" :key="i.id">
                    <mdui-list-item rounded slot="trigger" headline-line="1" description-line="2"
                        @click="loadSongListDetail(i.id)">
                        {{ i.name }}
                        <mdui-avatar slot="icon" :src="i.coverImgUrl"></mdui-avatar>
                        <span slot="description">{{ i.description ? i.description : "暂无简介" }}</span>
                        <mdui-button-icon slot="end-icon" variant="standard" icon="chevron_right"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-menu>
                        <mdui-menu-item>删除歌曲</mdui-menu-item>
                        <mdui-menu-item>播放歌曲</mdui-menu-item>

                    </mdui-menu>
                </mdui-dropdown>
            </mdui-list>
        </div>
    </mdui-navigation-drawer>


    <mdui-dialog close-on-overlay-click class="example-header" fullscreen ref="songListDetail">
        <mdui-top-app-bar slot="header">
            <mdui-top-app-bar-title>歌单歌曲</mdui-top-app-bar-title>
            <mdui-button-icon icon="close" @click="songListDetail.open = false"></mdui-button-icon>
        </mdui-top-app-bar>
        <div style="height: 100%;overflow-y: auto;" class="scrollbar">
            <mdui-list>
                <mdui-list-item rounded v-for="item in songListData" :key="item.id" headline-line="1" description-line="2">
                    {{ item.name }}
                    <mdui-avatar slot="icon" :src="item.al.picUrl"></mdui-avatar>
                    <span slot="description">{{ item.ar.map(function (item) { return item.name; }).join("-") }}</span>
                </mdui-list-item>

            </mdui-list>
        </div>

    </mdui-dialog>
</template>

<style scoped>
.app {
    position: absolute;
    width: calc(100% - 81px);
    height: 100%;
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

@media only screen and (max-width: 600px) {
    .app {
        width: 100%;
        height: calc(100% - 60px);
    }

}
</style>