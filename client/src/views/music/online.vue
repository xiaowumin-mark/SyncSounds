<template>
  <div class="main_dia" v-show="!roomInfo.is_public">
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

  <div class="app" v-show="roomInfo.is_public" :style="{'--ss-online-mdui-btn-color' : mdui_btn_color}">
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
            <mdui-button-icon icon="message--outlined" @click="msg_view_open()"></mdui-button-icon>
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
            <mdui-fab :icon="is_paused ? 'play_arrow' : 'pause'" @click="tooglePlay" :style="{borderRadius : is_paused ? '50%': 'var(--shape-corner-normal)'}" style="transition: all 0.3s"></mdui-fab>
          </div>
          <div class="right">
            <mdui-button-icon icon="skip_next"></mdui-button-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  <img src="https://p1.music.126.net/4o8dGgZgouKRDQfl6Fp3dA==/109951169452179670.jpg?param=130y130"  :style="{viewTransitionName:'home1'}" alt="" srcset=""> -->
  <mdui-fab v-show="!roomInfo.is_public" style="position: fixed;bottom: 20px;right: 20px;z-index: 50;" icon="undo"
            @click="goback"></mdui-fab>
  <audio src="/lmg.flac" ref="music" id="music" preload="auto"></audio>

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
        <mdui-badge>{{ people_view_data.length }}</mdui-badge>
      </mdui-top-app-bar-title>
      <mdui-button-icon icon="close" @click="people_dia.open = false"></mdui-button-icon>
    </mdui-top-app-bar>
    <div style="height: 100%;overflow-y: auto;" class="scrollbar">
      <mdui-list>

        <mdui-dropdown trigger="contextmenu" open-on-pointer v-for="i in people_view_data" :key="i.id">
          <mdui-list-item rounded slot="trigger">
            {{ i.name }}
            <mdui-avatar slot="icon"
                         :src="i.avatar">{{ i.avatar ? "" : i.name[0] }}
            </mdui-avatar>
            <span slot="description" v-show="i.is_room_admin">{{ i.is_room_admin ? "管理员" : "" }}</span>
          </mdui-list-item>
          <mdui-menu v-show="roomInfo.admin.includes(me)">
            <mdui-menu-item v-show="!roomInfo.admin.includes(i.id)">设为管理员</mdui-menu-item>
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
    <div style="height: calc(100% - 100px);overflow-y: auto;padding-bottom: 50px" class="no_scrollbar" ref="msgs_view">
      <div :class="item.user.id == me ? 'chat_box_r':'chat_box'"
           v-for="(item,i) in roomInfo.messages" :key="i">
        <div :class="item.user.id == me ? 'right':'left'">
          <!--          <img src="https://foruda.gitee.com/avatar/1720864383166909386/9548756_hycnb_1720864383.png!avatar200"
                         alt="" srcset="">-->
          <mdui-avatar
              :src="item.user.avatar">{{ item.user.avatar ? "" : item.user.name[0] }}
          </mdui-avatar>
        </div>
        <div class="main">
          <div class="title" v-show="item.user.id != me">
            {{ item.user.name }}
          </div>
          <div class="content">
            {{ item.text }}
          </div>
        </div>
      </div>

      <mdui-text-field label="输入内容" style="width: calc(100% - 40px);position: fixed;bottom: 20px;right: 20px;"
                       :value="msgs_view_input" @input="msgs_view_input = $event.target.value"
                       @keydown.enter="send_msgs_msg">
        <mdui-button-icon slot="end-icon" icon="send" @click="send_msgs_msg"></mdui-button-icon>
      </mdui-text-field>
    </div>
  </mdui-dialog>

</template>

<script setup>
import router from '@/router';
import {useRoute} from "vue-router";
import {
  ref, onMounted, watch, onUnmounted
} from 'vue';
import {snackbar} from "mdui/functions/snackbar.js";
// 获取params参数
const route = useRoute();
const ID = ref(route.params.id);
import musicLyric from "@/assets/ml";
import AppleLyric from "@/assets/apple-lyric.js";
import {setColorScheme} from 'mdui/functions/setColorScheme.js';
import {io} from "socket.io-client";
import {dialog} from "mdui/functions/dialog.js";

const me = Number(localStorage.sync_user)
const msgs_view_input = ref("");
const msgs_view = ref(null);
const msg_view_open = () => {
  message_dia.value.open = true;
  msg_view_scroll_bottom()

}
const msg_view_scroll_bottom = () => {
  setTimeout(() => {
    msgs_view.value.scrollTo({
      top: msgs_view.value.scrollHeight + 1000,
      behavior: "smooth"
    })
  }, 10)
}

const people_view_data = ref([]);
const socket = io(host + "/chat", {
  transports: ['websocket'], // 仅使用WebSocket传输协议
  extraHeaders: {
    'Access-Control-Allow-Origin': '*', // 设置跨域请求头
  }
});
window.socket = socket;
socket.on("connect", () => {
  console.log("连接成功")

});
socket.on("error", e => {
  console.error(e)

  dialog({
    headline: "错误",
    description: e.msg,
    actions: [
      {
        text: "返回",
        onClick: () => {
          router.push("/")
        },
      }
    ],

  });
})

socket.on("message", data => {
  console.log(data)
  roomInfo.value.messages.push(data.data)
  msg_view_scroll_bottom()
})

socket.on("people", data => {
  console.log(data)
  people_view_data.value = data
})

socket.on("join", data => {
  console.log(data)
  people_view_data.value.push({
    avatar: data.data.user.avatar,
    name: data.data.user.name,
    id: data.data.user.id,
    is_room_admin: data.data.is_room_admin,
    introduction: data.data.user.introduction,
    is_admin: data.data.user.is_admin,
    in_room: data.data.user.in_room,
  })
})

socket.on("quit", data => {
  console.log(data)
  // 查找people_view_data中id为data.id的元素，并删除
  for (let i = 0; i < people_view_data.value.length; i++) {
    if (people_view_data.value[i].id == data.id) {
      people_view_data.value.splice(i, 1);
      break;
    }
  }
})
const roomInfo = ref({is_public: false});
console.log(ID.value);
fetch(host + "/api/room/info/" + ID.value)
    .then(res => res.json())
    .then((data) => {
      console.log(data)
      roomInfo.value = data.data
      socket.emit("join", {
        roomId: data.data.id,
        token: localStorage.getItem("sync_token")
      })
      if (data.data.is_public) {
        console.log("公开房间")
      } else {
        console.log("私密房间")
      }
    })
    .catch(e => {
      console.error(e)
    })
const send_msgs_msg = () => {
  if (msgs_view_input.value == "") {
    snackbar({
      message: "内容不能为空",
      icon: 'error',
    });
    return
  }
  socket.emit("message", {
    token: localStorage.getItem("sync_token"),
    text: msgs_view_input.value,
  })
  msgs_view_input.value = ""
}
const musicLyricText = `[00:00.00] 作曲 : Mark Maxwell/Matt Rhoades
[00:07.84]I don't think I m gonna want you back
[00:09.77]But I know it wont be easy like that
[00:11.65]Don't you come around and make me feel bad when we both got no place
[00:14.64]To go
[00:15.35]I don't think I m gonna play your game
[00:17.33]Coz it s only gonna end one way
[00:19.26]Things are always gonna be the same
[00:20.79]It you never want to let me know
[00:22.77]Back back turn it around round
[00:25.61]up and you re down down just let me know
[00:30.38]in in in are you out oh it s killing me
[00:34.24]now you could just let me go
[00:37.09]Nothings to save you now
[00:40.90]Not when you crashing down
[00:44.71]Somebody break me out
[00:48.52]There s nothing to run for baby we re done for
[00:52.28]If you don't let let let me go
[00:56.14]If you don't let let let me go
[00:59.95]I don't wanna loo loo lose control
[01:03.76]But you wont let let let me go
[01:08.78]Now you call me on the telephone
[01:10.61]You only want me when you re alone
[01:12.54]Turn the car around and drive back home
[01:14.26]Coz you re never gonna let me know
[01:16.35]And every night that you fall asleep
[01:18.28]While you re dreaming of me
[01:20.16]I m begging you to set me free
[01:21.73]I m begging you to let me go
[01:23.76]Back back turn it around round
[01:26.65]up and you re down down just let me know
[01:31.32]in in in are you out oh it s killing me
[01:35.08]now you could just let me go
[01:38.08]Nothings to save you now
[01:41.84]Not when you crashing down
[01:45.65]Somebody break me out
[01:49.41]There s nothing to run for baby we re done for
[01:53.22]If you don't let let let me go
[01:57.03]If you don't let let let me go
[02:00.89]I don't wanna loo loo lose control
[02:04.70]But you wont let let let me go
[02:09.67]I waited patiently I know you had a place for me
[02:13.53]But now you re blinded by the life you lead
[02:16.17]I m letting you know
[02:20.03]You mean so much to me
[02:26.63]You re everything I want to be
[02:28.71]But now you re taking it away from me
[02:31.10]I m letting you go
[02:39.17]Nothings to save you now
[02:42.83]Not when you crashing down
[02:46.64]Somebody break me out
[02:50.35]There s nothing to run for baby we re done for
[02:54.15]If you don't let let let me go
[02:58.01]If you don't let let let me go
[03:01.82]I don't wanna loo loo lose control
[03:05.63]But you wont let let let me go
[03:09.49]If you don't let let let me go
[03:13.30]If you don't let let let me go
[03:17.06]I don't wanna loo loo lose control
[03:20.87]But you wont let let let me go`
const bg_more = ref("rgba(255, 255, 255, 0.7)");
const music_img = ref("/img.png")
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
  name: 'ME!',
  singer: 'Taylor Swift / Brendon Urie',
})
watch(lyricModeStyle, (v) => {
  console.log("changeMusicLyricStyle")

  if (v == "al") {
    mdui_btn_color.value = "#efefef"
  } else {
    mdui_btn_color.value = "#303136"
  }
  window.mul.cancel()// 取消了
  changeMusicLyricStyle(v);
})


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
window.music = music.value;

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
      scale: 1.2, // 当前歌词的缩放比例
      fontSize: 35, // 歌词的字体大小
      interval: 15, // 歌词的行间距
      ifInner: false, // 是否只在可见范围内播放动画，这样会减少卡顿，但是观感会差一些
      animationOffsetTime: 20 // 动画偏移时间，越小越平滑，但是不能超过 lyricSync.offsetH 否则会出问题
    }, (i, text) => {
      console.log(text)
      navigator.mediaSession.metadata.artist = text
    });
    mul.offsetH = 100
    setTimeout(() => {
      mul.init()
    }, 1000)
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
  socket.emit("quit", {
    token: localStorage.getItem("sync_token"),
    room: ID.value,
  })
  socket.disconnect();
  socket.close();
  socket.removeAllListeners();

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
  transform: scale(1.3);
  animation: img_fllow_animate 9s infinite alternate;
}

@keyframes img_fllow_animate {
  0% {
    top: 5%;
    left: 5%;
    transform: scale(1.4);
  }
  50% {
    top: -2%;
    left: -2%;
    transform: scale(1.2);
  }
  100% {
    top: 0%;
    left: 0%;
    transform: scale(1.3);
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

.chat_box .left mdui-avatar {
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
  word-wrap: break-word;
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

.chat_box_r .right mdui-avatar {
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
  word-wrap: break-word;
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
    color: none !important;
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
  transition: color 0.5s, top 0.6s, transform 0.6s, filter 0.6s, background-color 0.1s;
  font-weight: bold;
  width: calc(100% - 90px);
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
