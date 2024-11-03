<script setup>
import '@mdui/icons/people.js';
import '@mdui/icons/library-music.js';
import '@mdui/icons/date-range.js';
import router from '@/router';
import {ref} from 'vue'
import T from '@/assets/tools.js'
import {onMounted} from "vue";

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
const loading = ref(null);
const roomList = ref([]);
let page = 1;
let allPages =1;

function load() {
  if (page > allPages) {
    loading.value.innerHTML = '没有更多了呦~';
  };
  fetch(host + '/api/room?offset=' + page)
      .then(res => res.json())
      .then(data => {
        roomList.value.push(...data.data);
        allPages = data.pages;
      })
      .catch(err => console.log(err));
  page++;
}

onMounted(() => {
  // 当loadMore与视口交叉时
  let loadMoreOberver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      console.log('loadMore')
      load();
    }
  }, {threshold: 0.5})
  loadMoreOberver.observe(loading.value)
})


//import {dialog} from "mdui/functions/dialog.js";


/*dialog({
  headline: "SyncSounds",
  description: "这是一个预览版，仅为前端页面，由xiaowumin开发。\n \n https://github.com/xiaowumin-mark/SyncSounds",
  actions: [
    {
      text: "确定"
    }
  ]
});*/

</script>

<template>
  <mdui-top-app-bar variant="small" style="position: relative;">
    <mdui-top-app-bar-title>全部房间</mdui-top-app-bar-title>
    <mdui-button-icon icon="add" @click="join.open = true"></mdui-button-icon>
  </mdui-top-app-bar>
  <div style="padding: 10px;height: calc(100% - 64px);overflow-y: auto;" class="scrollbar">

    <mdui-card clickable class="card" v-for="i in roomList" @click="TSNpush('/music/' + i.id)" :key="i.id">
      <img :src="i.image ?  i.image:'/ss128x128.png'" alt="">
      <div class="top">
        <p class="title">{{ i.name }}</p>
        <p class="introduction scrollbar">
          {{ i.intronduction }}
        </p>
      </div>
      <div class="buttom">
        <div style="width: 85px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: auto;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-date-range style="width: 20px;"></mdui-icon-date-range>
          </div>
          <span style="font-size: 13px;">{{ T.Time(i.createdAt) }}</span>
        </div>
        <div style="width: 60px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: 40px;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-library-music style="width: 20px;"></mdui-icon-library-music>
          </div>
          <span style="font-size: 13px;">{{ JSON.parse(i.songs).length }}</span>
        </div>
        <div style="width: 60px;height: 40px;display: flex;justify-content: start;align-items: center;">
          <div style="width: 40px;height: 40px;display: flex;justify-content: center;align-items: center;">
            <mdui-icon-people style="width: 20px;"></mdui-icon-people>
          </div>
          <span style="font-size: 13px;">{{ i.peoples_num }}</span>
        </div>
      </div>
    </mdui-card>
    <div class="loading" ref="loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>
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
  width: calc(100% - 0px);
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

.loading {
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
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