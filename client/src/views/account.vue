<script setup>
import {ref, onMounted} from 'vue';
import {snackbar} from "mdui/functions/snackbar.js";

const userInfo = ref({
  id: 0,
  username: "---",
  email: "--",
  avatar: null,
  introduction: "---",
  love_music: null,
  songs_list: null,
  is_show_songs: null,
  is_admin: false,
  in_room: null,
})
onMounted(() => {
  if (localStorage.getItem("sync_token")) {
    fetch(host + "/api/user/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: localStorage.getItem("sync_token")
      })
    }).then(res => res.json()).then((data) => {
      console.log(data);
      if (data.code == 200) {
        userInfo.value = data.data;
      } else {
        snackbar({
          message: "获取用户信息失败",
          placement: "top",
        });
      }
    }).catch((err) => {
      console.log(err);
      snackbar({
        message: "获取用户信息失败",
        placement: "top",
      })
    })
  }
});

</script>

<template>
  <div class="info">
    <div class="img">
      <mdui-avatar style="width: 80%;height: 80%;"
                   :src="userInfo.avatar">{{ userInfo.avatar ? "" : userInfo.username[0] }}
      </mdui-avatar>
    </div>
    <div class="info-right">
      <p style="font-size: 25px;margin: 0;margin-top: 20px;font-weight: 700;" :class="userInfo.is_admin ? 'adminP' : ''">
        {{ userInfo.username }}
      </p>
      <p style="margin: 0;margin-top: 5px;">
        {{ userInfo.introduction }}
      </p>
    </div>

  </div>
</template>

<style scoped>
.info {
  width: 100%;
  height: 100px;
  margin-top: 30px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}

.info .img {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info .info-right {
  width: calc(100% - 100px);
  height: 100%;
}

.adminP {
  color: #3366FF; /*设置文字颜色*/
  text-shadow: 0 4px 10px #6699FF; /*设置文字阴影*/
}
</style>