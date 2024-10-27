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

  <div class="app" v-show="ID != 'h1'">
    <img :src="music_img" alt="" class="img">
    <div class="bg_more" :style="{'--ss-online-bg-more':bg_more}"></div>
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
  <audio src="/Maroon%205、Wiz%20Khalifa%20-%20Payphone.flac" ref="music" id="music"></audio>

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
import { setColorScheme } from 'mdui/functions/setColorScheme.js';


const musicLyricText = `[00:00.000] Maroon 5 / Wiz Khalifa - Payphone
[00:00.000] 作词 : Adam Levine/Benjamin Levin/Ammar Malik/Dan Omelio/Shellback/Cameron Thomaz
[00:00.000] 作曲 : Adam Levine/Benjamin Levin/Ammar Malik/Dan Omelio/Shellback/Cameron Thomaz
[00:00.000]作曲 : Adam Levine/Benjamin Levin/Ammar Malik/Dan Omelio/Shellback/Cameron Thomaz
[00:00.360]作词 : Adam Levine/Benjamin Levin/Ammar Malik/Dan Omelio/Shellback/Cameron Thomaz
[00:01.080]I'm at a payphone trying to call home
[00:04.280]All of my change I spent on you
[00:08.590]Where have the times gone
[00:10.670]Baby it's all wrong, where are the plans we made for two?
[00:17.540]Yeah, I, I know it's hard to remember
[00:19.880]The people we used to be
[00:23.130]It's even harder to picture
[00:25.300]That you're not here next to me
[00:27.520]You say it's too late to make it
[00:29.890]But is it too late to try?
[00:31.880]And in our time that you wasted
[00:33.600]All of our bridges burned down
[00:35.830]I've wasted my nights
[00:37.960]You turned out the lights
[00:40.970]Now I'm paralyzed
[00:42.700]Still stuck in that time when we called it love
[00:47.350]But even the sun sets in paradise
[00:50.550]I'm at a payphone trying to call home
[00:57.080]All of my change I spent on you
[01:00.790]Where have the times gone
[01:03.740]Baby it's all wrong, where are the plans we made for two?
[01:09.400]If happy ever after did exist
[01:11.130]I would still be holding you like this
[01:18.330]All those fairytales are full of ****
[01:22.540]One more ******* love song i'll be sick
[01:25.530]You turned your back on tomorrow
[01:30.730]Cause you forgot yesterday
[01:31.700]I gave you my love to borrow
[01:34.650]But you just gave it away
[01:37.390]You can't expect me to be fine
[01:39.730]I don't expect you to care
[01:41.770]I know I've said it before
[01:43.590]But all of our bridges burned down
[01:45.780]I've wasted my nights
[01:48.860]You turned out the lights
[01:51.030]Now I'm paralyzed
[01:53.270]Still stuck in that time when we called it love
[01:57.380]But even the sun sets in paradise
[02:00.170]I'm at a payphone trying to call home
[02:06.670]All of my change I spent on you
[02:10.580]Where have the times gone
[02:12.860]Baby it's all wrong, where are the plans we made for two?
[02:19.300]If happy ever after did exist
[02:21.050]I would still be holding you like this
[02:28.100]All those fairytales are full of *******t
[02:32.470]One more ******* love song i'll be sick
[02:36.720]Now I'm at a payphone...
[02:39.160]Wiz Khalifa
[02:39.470]Man **** that *******t
[02:40.380]I'll be out spending all this money while you sitting round
[02:42.230]Wondering why it wasn't you who came up from nothing
[02:44.010]Made it from the bottom
[02:45.020]Now when you see me I'm stunning
[02:46.490]And all of my cars start with the push of a button
[02:49.270]Telling me the chances since I blew up or whatever you call it
[02:50.890]Switched the number to my phone
[02:52.590]So you never could call it
[02:53.700]Don't need my name on my show
[02:55.680]You can tell it I'm ballin'
[02:55.980]Swish, what a shame could have got picked
[02:58.050]Had a really good game but you missed your last shot
[02:59.890]So you talk about who you see at the top
[03:02.670]Or what you could've saw
[03:02.770]But sad to say it's over for
[03:04.190]Phantom pulled up valet open doors
[03:05.460]Wiz like go away, got what you was looking for
[03:07.250]Now it's me who they want
[03:09.820]So you can go and take that little piece of *******t with you
[03:11.600]I'm at a payphone trying to call home
[03:16.910]All of my change I spent on you
[03:20.260]Where have the times gone
[03:22.580]Baby it's all wrong, where are the plans we made for two?
[03:28.950]If happy ever after did exist
[03:33.510]I would still be holding you like this
[03:37.990]All these fairytales are full of *******t
[03:42.240]One more ******* love song i'll be sick
[03:45.330]Now I'm at a Payphone`
const bg_more = ref("rgba(255, 255, 255, 0.7)");
const music_img = ref("/payphone.jpg")
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
const musicInfo = ref({
  name: 'payphone',
  singer: 'Maroon 5 , Wiz Khalifa',
})
watch(lyricModeStyle, (v) => {
  console.log("changeMusicLyricStyle")


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
  getImageMainColorAndInvert(music_img.value).then((colors) => {
    console.log("主题色:", colors.mainColor);
    console.log("反色:", colors.invertedColor);
    setColorScheme(colors.invertedColor);
  });
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
      animationOffsetTime: 40 // 动画偏移时间，越小越平滑，但是不能超过 lyricSync.offsetH 否则会出问题
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

  overflow: hidden;

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

  border-radius: 12px;
  transform-origin: left center;
  text-align: left;
}

.apple_lyric_p:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.apple_lyric_p:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}
</style>
