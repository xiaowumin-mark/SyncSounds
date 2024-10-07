<script setup>
import { RouterLink, RouterView } from 'vue-router'
import router from './router';
import { ref, watch } from 'vue';
const showBar = ref(router.currentRoute.value.meta.showBar);
watch(router.currentRoute, (to) => {
  showBar.value = to.meta.showBar;
})

const TSNpush = (path) => {
  //document.startViewTransition(() => {
    router.push(path);
  //});

};
</script>

<template>

  <div id="app_m" style="display: flex;width: 100%;">

    <mdui-navigation-rail contained divider alignment="center" value="home" class="left_navigation" v-show="showBar"
      style="position: relative;">
      <mdui-navigation-rail-item value="home" icon="home--outlined" @click="TSNpush('/')">房间</mdui-navigation-rail-item>
      <mdui-navigation-rail-item value="music" icon="music_note--outlined"
        @click="TSNpush('/music')">音乐</mdui-navigation-rail-item>
      <mdui-navigation-rail-item value="account" icon="person--outlined"
        @click="TSNpush('/me')">我的</mdui-navigation-rail-item>
    </mdui-navigation-rail>



    <mdui-navigation-bar value="home" class="phone_navigation" v-show="showBar">
      <mdui-navigation-bar-item icon="home--outlined" value="home" @click="TSNpush('/')">房间</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="music_note--outlined" value="music"
        @click="TSNpush('/music')">音乐</mdui-navigation-bar-item>
      <mdui-navigation-bar-item icon="person--outlined" value="account"
        @click="TSNpush('/me')">我的</mdui-navigation-bar-item>
    </mdui-navigation-bar>
    <div class="main_m">
      <RouterView />

    </div>
  </div>


</template>

<style scoped>
.main_m {
  height: 100vh;
  width: 100%;
}

@media only screen and (max-width: 600px) {
  .left_navigation {
    display: none;
  }

  #app_m {
    padding-left: 0;
  }

  .main_m {
    height: calc(100vh - 80px);
  }

}

@media only screen and (min-width: 601px) {

  /*   #app_m {
    padding-left: 81px;
  }
 */
  .phone_navigation {
    display: none;
  }

  .main_m {
    height: 100vh;
  }
}
</style>
