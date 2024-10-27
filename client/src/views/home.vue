<script setup>
import '@mdui/icons/people.js';
import '@mdui/icons/library-music.js';
import '@mdui/icons/date-range.js';
import router from '@/router';
import {ref} from 'vue';

const join = ref(null)
const my_drawer = ref(null)
const TSNpush = (path) => {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      router.push(path);
    })
  } else {
    router.push(path);
  }
};

import {dialog} from "mdui/functions/dialog.js";


dialog({
  headline: "SyncSounds",
  description: "这是一个预览版，仅为前端页面，由xiaowumin开发。\n \n https://github.com/xiaowumin-mark/SyncSounds",
  actions: [
    {
      text: "确定"
    }
  ]
});

</script>

<template>
  <mdui-top-app-bar variant="small" style="position: relative;">
    <mdui-top-app-bar-title>全部房间</mdui-top-app-bar-title>
    <mdui-button-icon icon="add" @click="join.open = true"></mdui-button-icon>
  </mdui-top-app-bar>
  <div style="padding: 10px;height: calc(100% - 64px);overflow-y: auto;" class="scrollbar">

    <mdui-card clickable class="card" v-for="i in 5" @click="TSNpush('/music/h' + i)">
      <img src="https://p1.music.126.net/4o8dGgZgouKRDQfl6Fp3dA==/109951169452179670.jpg?param=130y130" alt="">
      <div class="top">
        <p class="title">正在播放: 时代少年团 我们喜欢你</p>
        <p class="introduction scrollbar">
          时代少年団，我们喜欢你，我们喜欢马嘉祺丁程鑫宋亚轩，时代少年団
        </p>
      </div>
      <div class="buttom">
        <div style="width: 85px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: 40px;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-date-range style="width: 20px;"></mdui-icon-date-range>
          </div>
          <span style="font-size: 13px;">五天前</span>
        </div>
        <div style="width: 60px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: 40px;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-library-music style="width: 20px;"></mdui-icon-library-music>
          </div>
          <span style="font-size: 13px;">15</span>
        </div>
        <div style="width: 60px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: 40px;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-people style="width: 20px;"></mdui-icon-people>
          </div>
          <span style="font-size: 13px;">15</span>
        </div>
      </div>
    </mdui-card>

  </div>
  <mdui-dialog close-on-overlay-click headline="加入房间" ref="join">
    <mdui-text-field variant="outlined" label="输入房间号" style="margin-top: 10px;"></mdui-text-field>

    <mdui-button slot="action" variant="text" @click="join.open = false">取消</mdui-button>
    <mdui-button slot="action" variant="tonal" @click="join.open = false">确定</mdui-button>
  </mdui-dialog>
  <mdui-navigation-drawer modal close-on-esc close-on-overlay-click ref="my_drawer">
    <mdui-button class="close">关闭侧边抽屉栏</mdui-button>
  </mdui-navigation-drawer>
</template>

<style scoped>
.card {
  width: 200px;
  height: 170px;
  padding: 10px;
  position: relative;
  margin-right: 20px;
  margin-bottom: 20px;
  z-index: 0;
}

.card img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  float: left;

}

.card .top {
  position: absolute;
  top: 0;
  left: 160px;
  margin-left: 10px;
}

.card .title {

  font-weight: bolder;
  margin-top: 15px;
  font-size: 17px;
  width: calc(100% - 70px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card .introduction {
  font-size: 14px;
  width: calc(100% - 70px);
  margin-top: -10px;
  height: 90px;
  overflow: hidden;

}

.card .buttom {
  position: absolute;
  bottom: 0;
  left: 160px;
  width: calc(100% - 160px);
  height: 40px;

  display: flex;
  justify-content: flex-end;

}

@media screen and (max-width: 768px) {
  .card {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
}

@media screen and (min-width: 769px) and (max-width: 1200px) {
  .card {
    width: calc(50% - 30px)
  }
}

@media screen and (min-width: 1201px) {
  .card {
    width: calc(30vw - 20px)
  }
}
</style>