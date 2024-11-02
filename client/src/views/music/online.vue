<template>
  <div class="main_dia" v-show="ID == 'h1'">
    <img :src="music_img" alt=""
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

  <div class="app" v-show="ID != 'h1'" :style="{'--ss-online-mdui-btn-color' : mdui_btn_color}">
    <img :src="music_img" alt="" class="img">
    <div class="bg_more" :style="{'--ss-online-bg-more':bg_more}"></div>
    <div class="ctx">
      <div class="header">
        <div class="back">
          <mdui-button-icon @click="goback" icon="arrow_back_ios_new"></mdui-button-icon>

        </div>
        <div class="title">
          <p style="font-weight: 700;font-size: 17px;">{{ musicInfo.name }}</p>
          <p style="margin-top: -13px;opacity: 0.7;font-size: 15px">
            {{ musicInfo.singer }}
          </p>
        </div>
        <div class="more">

          <mdui-dropdown>
            <mdui-button-icon slot="trigger" icon="more_horiz"></mdui-button-icon>
            <mdui-menu>
              <mdui-menu-item @click="more.open = true">音乐列表</mdui-menu-item>
              <mdui-menu-item>下载歌曲</mdui-menu-item>
              <mdui-menu-item>下载歌词</mdui-menu-item>
              <mdui-menu-item @click="lyricModeStyle = 'md'">设置歌词为md样式</mdui-menu-item>
              <mdui-menu-item @click="lyricModeStyle = 'al'">设置歌词为apple music样式</mdui-menu-item>
            </mdui-menu>
          </mdui-dropdown>
        </div>
      </div>
      <div class="content">
        <div class="image" v-show="is_show_music_img" :style="{transform:is_paused ? 'scale(1)':'scale(1.1)'}">
          <img :src="music_img"
               style="view-timeline-name: h2;" alt="" srcset="">
        </div>
        <div class="lyric" style="text-align: center;" id="lrc"
             :style="{height:is_show_music_lrc ? '100%' : 'calc(100% - 40vh - 50px)'}">
          <!-- <p style="font-weight: 900;font-size: 17px;">没什么大愿望</p>
          <p style="opacity: 0.5;font-weight: 600;line-height: 12px;">没有什么事要赶</p> -->

        </div>
      </div>
      <div class="footer">
        <div class="image" :style="{transform:is_paused ? 'scale(1)':'scale(1.1)'}">
          <img :src="music_img"
               style="view-timeline-name: h2;" alt="" srcset="">
        </div>
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
          <mdui-slider nolabel :max="all_time" step="0.001" :value="now_time"
                       @input="music.currentTime = $event.target.value"></mdui-slider>
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
  <audio src="/lsm.m4a" ref="music" id="music"></audio>

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
      <mdui-top-app-bar-title>房间成员
        <mdui-badge>12</mdui-badge>
      </mdui-top-app-bar-title>
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
import {
  ref, onMounted, watch, onUnmounted
} from 'vue';
import {snackbar} from "mdui/functions/snackbar.js";
// 获取params参数
const ID = ref(router.currentRoute.value.params.id);
import musicLyric from "@/assets/ml";
import AppleLyric from "@/assets/apple-lyric.js";
import {setColorScheme} from 'mdui/functions/setColorScheme.js';


const musicLyricText = `[00:00.00] 作词 : 梨冻紧/Wiz_H张子豪
[00:01.00] 作曲 : 梨冻紧/Wiz_H张子豪
[00:02.00] 编曲 : Wiz_H张子豪
[00:03.00] 钢琴 : 梨冻紧
[00:04.00] 封面 : 蓝明初
[00:05.00] 混音 : 官硕
[00:06.00] 母带 : Mai＂ No Label Crew＂
[00:07.00] 监制 : Mai＂ No Label Crew＂
[00:08.00] 发行 : No Label Crew
[00:09.00] 企划 : 苏文嫒 张琛
[00:30.60]我没转身
[00:31.71]一直走一直梦
[00:33.69]一直疯一直没停留
[00:37.83]那些美好的
[00:39.27]越靠近越沉溺
[00:41.22]越来越不想放手
[00:45.99] Wherever you go
[00:53.13] Wherever you go
[01:01.26] Follow
[01:02.04]每到晚上理智变得感性
[01:04.44]我编了这条短信
[01:05.67]说不在乎不过是我嘴硬
[01:07.65]总是期待你有什么反应
[01:09.48]对你没法保持那份冷静
[01:11.22]偷偷想着我们之间关系的远近
[01:13.23]我的心里没有任何的侥幸
[01:14.85]我知道我的爱对你来说就好像软禁
[01:16.74]我们都闭口不提
[01:18.42]这跨不过的距离
[01:20.04]我们不停的一再复习着
[01:22.02]那些感情里俗套的剧情
[01:23.76]你那里是怎么样的天气
[01:25.74]夜空是否还是那么透明
[01:27.51]我说的又开始不着了边际
[01:29.52]可是没有你我真的不行
[01:31.14]就请你
[01:32.19]把我当成贪得无厌
[01:34.11]把我当作得寸进尺
[01:35.79]每当难过表情在你脸上浮现
[01:37.65]我也难过得像照着一面镜子
[01:39.51]多么希望和你在一起的时间
[01:41.46]那些快乐可以突然静止
[01:43.26]多么希望时间可以快点
[01:44.97]带我和你一起体验生老和病死
[01:46.77]我想过下次会更好
[01:48.15]也开始更加了解了你的脾气
[01:50.31]可是下次我们还是争吵
[01:52.02]下次可能还是不留余地
[01:54.00]我爱你不遗余力
[01:55.59]在爱里不停期待奇迹
[01:57.57]不忍看你这么痛苦
[01:59.25]又不愿离去
[02:00.69] and i will
[02:01.29] Follow
[02:01.83]一直走一直梦
[02:03.66]一直疯一直没停留
[02:07.83]那些美好的
[02:09.27]越靠近越沉溺
[02:11.19]越来越不想放手
[02:15.60] Wherever you go
[02:23.13] Wherever you go
[02:32.61] Wherever you go
[02:34.44] Wherever you go
[02:36.48]一直都搞不定自己的情绪在你走后
[02:40.05] Wherever you go
[02:41.88] just want you to know
[02:43.95]你知道我的心一直都在原地为你等候
[02:46.65]其实对天气不感兴趣
[02:48.15]想知道你会不会太冷
[02:50.28]没法完成那份陪伴
[02:51.78]孤独你会不会在忍
[02:53.79]不知道想念你的痛苦
[02:55.50]来的到底会不会太准
[02:57.36]只知道当你不在床上
[02:59.25]我总是睡得不会太稳
[03:01.53]我们看惯了世间的罗生门
[03:03.45]变得好像陌生人
[03:05.28]两颗同样不安的心脏被塞进了同一个摩天轮
[03:09.03]每次拥抱停留在清晨
[03:10.98]窗外大雨在倾盆
[03:12.75]我们好像巨大城市里面两个相爱的外星人
[03:16.53]可我不想生活在套路里
[03:18.45]想把心事都告诉你
[03:19.86]我想要一直照顾你
[03:21.72]又总害怕你耗不起
[03:24.54]滴答的秒针又在
[03:26.16]提醒我爱你几分
[03:28.23]只要听到你的声音
[03:29.73]我一定会为你转身
[03:31.74]一直走一直梦
[03:33.66]一直疯一直没停留
[03:37.86]那些美好的
[03:39.27]越靠近越沉溺
[03:41.22]越来越不想放手
[03:45.66] Wherever you go
[03:46.89] Wherever you go
[03:51.12]营销推广：贾皓然 欧阳慧琳 苏文嫒
[03:58.83]本歌曲来自【青云 LAB】`
const bg_more = ref("rgba(255, 255, 255, 0.7)");
const music_img = ref("http://p1.music.126.net/yN1ke1xYMJ718FiHaDWtYQ==/109951165076380471.jpg?param=130y130")
const password = ref('');
const is_paused = ref(true);
const all_time = ref(1.0);
const now_time = ref(0);
const more = ref(null);
const people_dia = ref(null);
const message_dia = ref(null);
const is_show_music_img = ref(true);
const is_show_music_lrc = ref(true);
const lyricModeStyle = ref("al")
const mdui_btn_color = ref("#efefef");
const musicInfo = ref({
  name: '罗生门（Follow）',
  singer: '：梨冻紧 / Wiz_H张子豪',
})
watch(lyricModeStyle, (v) => {
  console.log("changeMusicLyricStyle")

  if (v == "al") {
    mdui_btn_color.value = "#efefef"
  }else {
    mdui_btn_color.value = "#303136"
  }
  window.mul.cancel()// 取消了
  changeMusicLyricStyle(v);
})
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
    changeMusicLyricStyle(lyricModeStyle.value)

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: musicInfo.value.name,
        artist: musicInfo.value.singer,
        album: musicInfo.value.singer,
        artwork: [
          {
            src: music_img.value,
            sizes: '1280x1280',
            type: 'image/jpeg'
          },
        ]
      });

      // 处理播放和暂停事件
      navigator.mediaSession.setActionHandler('play', () => {
        music.value.play();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        music.value.pause();
      });

      navigator.mediaSession.setActionHandler("previoustrack", function () { // 上一首
        console.log("previoustrack")
      });
      navigator.mediaSession.setActionHandler("nexttrack", function () { // 下一首
        console.log("nexttrack");
      });
    }
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

const changeMusicLyricStyle = (mode) => {
  if (is_phone()) {
    if (mode === "al") {
      is_show_music_img.value = false;
      is_show_music_lrc.value = true;
    } else {
      is_show_music_lrc.value = false;
      is_show_music_img.value = true;
    }
  } else {
    if (mode === "al") {
      is_show_music_img.value = true;
      is_show_music_lrc.value = true;
    } else {
      is_show_music_lrc.value = true;
      is_show_music_lrc.value = true;
    }
  }
  if (mode == "md") {
    bg_more.value = "rgba(255, 255, 255, 0.7)"
    window.mul = musicLyric({
      audio: "#music",
      lyric: "#lrc",
      style: {
        lineHight: 25,
        scale: 1.2
      },
      lyricText: musicLyricText
    }, (text) => {
      console.log(text)
      navigator.mediaSession.metadata.artist = text
    })
  } else if (mode == "al") {
    bg_more.value = "rgba(0, 0, 0, 0.2)"
    window.mul = new AppleLyric('#lrc', music.value, musicLyricText, {
      ifTrainsion: true, // 是否使用弹簧动画
      ifBlur: true, // 是否使用模糊效果
      scale: 1.1, // 当前歌词的缩放比例
      fontSize: 30, // 歌词的字体大小
      interval: 10, // 歌词的行间距
      ifInner: false, // 是否只在可见范围内播放动画，这样会减少卡顿，但是观感会差一些
      animationOffsetTime: 30 // 动画偏移时间，越小越平滑，但是不能超过 lyricSync.offsetH 否则会出问题
    }, (i, text) => {
      console.log(text)
      navigator.mediaSession.metadata.artist = text
    });
  }
}
// screen and (min-width: 860px)
const is_phone = () => {
  return window.innerWidth < 860;
}

const debounce = (fn, delay) => {
  let timer;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  }
};
const cancalDebounce = debounce(() => {
  if (is_phone()) {
    if (lyricModeStyle.value === "al") {
      is_show_music_img.value = false;
      is_show_music_lrc.value = true;
    } else {
      is_show_music_lrc.value = false;
      is_show_music_img.value = true;
    }
  } else {
    if (lyricModeStyle.value === "al") {
      is_show_music_img.value = true;
      is_show_music_lrc.value = true;
    } else {
      is_show_music_lrc.value = true;
      is_show_music_lrc.value = true;
    }
  }
}, 500);

window.addEventListener('resize', cancalDebounce);
onUnmounted(() => {
  window.removeEventListener('resize', cancalDebounce);
  window.mul.cancel();
  window.mul = null;
  navigator.mediaSession.metadata = null;

})

async function getImageMainColorAndInvert(imageUrl) {
  // 获取图像 Blob 数据
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  // 创建新的 Image 对象
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    image.onload = function () {
      // 创建 canvas 元素
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // 设置 canvas 尺寸
      canvas.width = image.width;
      canvas.height = image.height;

      // 将图像绘制到 canvas 上
      context.drawImage(image, 0, 0, image.width, image.height);

      // 获取图像的像素数据
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 初始化 RGB 累加值
      let r = 0, g = 0, b = 0, count = 0;

      // 遍历像素数据并计算平均颜色
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      // 计算平均颜色
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // 计算反色
      const invertedColor = {
        r: 255 - r,
        g: 255 - g,
        b: 255 - b
      };

      // 将反色转换为 hex 格式
      const invertedHex = `#${((1 << 24) | (invertedColor.r << 16) | (invertedColor.g << 8) | invertedColor.b).toString(16).slice(1)}`;

      resolve({
        mainColor: `rgb(${r}, ${g}, ${b})`,
        invertedColor: invertedHex
      });

      // 释放 URL 对象
      URL.revokeObjectURL(image.src);
    };
  });
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
  --ss-online-mdui-btn-color: white
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
  animation: img_fllow_animate 5s infinite alternate;
}

@keyframes img_fllow_animate {
  0% {
    top: 10px;
    left: 10px;
  }
  50% {
    top: -10px;
    left: -10px;
  }
  100% {
    top: 0px;
    left: 0px;
  }
}

.bg_more {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--ss-online-bg-more);
  z-index: 10;
  transition: all 0.5s;
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
  transition: all 0.5s;
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


.ctx .content .lyric {
  width: 100%;
  position: relative;

  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

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

mdui-button-icon {
  color: var(--ss-online-mdui-btn-color)
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

.ctx .footer .image {
  display: none;
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

  .ctx .footer {
    width: 40%;
    height: calc(100% - 150px);
  }

  .ctx .content .lyric {
    width: 100%;

  }

  .ctx .content {
    width: calc(60% - 0px);
    height: 100%;
    float: right;
  }

  .ctx .content .image {
    display: none;
  }

  .ctx .footer .image {
    width: 100%;
    height: calc(100% - 195px);
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s;
  }

  .ctx .footer .image img {
    width: 60%;
    border-radius: 15px;
    box-shadow: 0px 19px 50px 0px rgba(100, 100, 111, 0.3);
  }

  mdui-button-icon {
    color:none !important;
  }
}


</style>
<style>
.apple_lyric_p {
  position: absolute;
  margin: 0;
  padding: 10px;
  box-sizing: border-box;
  padding-bottom: 20px;
  color: rgba(255, 255, 255, .25);
  transition: all 0.5s;
  font-weight: 700;
  width: calc(100% - 30px);
  border-radius: 12px;
  transform-origin: left center;
  text-align: left;
}

.apple_lyric_p:hover {
  background-color: rgba(255, 255, 255, 0.15);
  filter: blur(0px) !important;
}

.apple_lyric_p:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
