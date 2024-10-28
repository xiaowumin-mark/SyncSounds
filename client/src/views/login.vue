<template>
  <div
      style="width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;box-sizing: border-box;padding: 20px;">
    <mdui-card style="width: 400px;text-align: center;transition: all .3s;overflow-y: auto" :style="{ height: height }"
               variant="elevated" :class="cls">
      <mdui-tabs placement="top" :value="Tmode">
        <mdui-tab value="登录" @click="height = '360px';Tmode='登录'">登录</mdui-tab>
        <mdui-tab value="注册" @click="height = '550px';Tmode='注册'">注册</mdui-tab>

        <mdui-tab-panel slot="panel" value="登录" style="padding: 20px;">
          <mdui-text-field autocomplete="off" variant="outlined" label="请输入邮箱" :valu="login.email"
                           @input="login.email = $event.target.value">
            <span v-show="loText.email != ''" slot="helper" style="color: red">{{ loText.email }}</span>
          </mdui-text-field>
          <mdui-text-field autocomplete="off" variant="outlined" label="请输入密码" :valu="login.password"
                           @input="login.password = $event.target.value"
                           style="margin-top: 25px;margin-bottom: 25px;" type="password">
            <span v-show="loText.password != ''" slot="helper" style="color: red">{{ loText.password }}</span>
          </mdui-text-field>
          <mdui-button variant="elevated" @click="h">登录</mdui-button>
        </mdui-tab-panel>
        <mdui-tab-panel slot="panel" value="注册" style="padding: 20px;">
          <mdui-text-field autocomplete="off" variant="outlined" label="用户名" :value="register.username"
                           @input="register.username = $event.target.value">
            <span v-show="reText.username != ''" slot="helper" style="color: red">{{ reText.username }}</span>
          </mdui-text-field>
          <mdui-text-field autocomplete="off" variant="outlined" label="邮箱" :value="register.email"
                           @input="register.email = $event.target.value" style="margin-top: 25px;">
            <span v-show="reText.email != ''" slot="helper" style="color: red">{{ reText.email }}</span>
          </mdui-text-field>
          <mdui-text-field autocomplete="off" variant="outlined" label="介绍" :value="register.introduction"
                           @input="register.introduction = $event.target.value" maxlength="50" counter
                           style="margin-top: 25px;">
            <span v-show="reText.introduction != ''" slot="helper" style="color: red">{{ reText.introduction }}</span>
          </mdui-text-field>
          <mdui-text-field autocomplete="off" variant="outlined" label="密码" :value="register.password"
                           @input="register.password = $event.target.value" style="margin-top: 10px;"
                           type="password">
            <span v-show="reText.password != ''" slot="helper" style="color: red">{{ reText.password }}</span>
          </mdui-text-field>
          <mdui-button variant="elevated" style="margin-top: 25px;" @click="h">注册</mdui-button>
        </mdui-tab-panel>
      </mdui-tabs>

    </mdui-card>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import router from "@/router";
import {snackbar} from "mdui/functions/snackbar.js";

const Tmode = ref("登录");
const height = ref("360px");
const cls = ref("");
const register = ref({
  email: "",
  password: "",
  username: "",
  introduction: ""
})
const reText = ref({
  email: "",
  password: "",
  username: "",
  introduction: ""
})

const login = ref({
  email: "",
  password: ""
})

const loText = ref({
  email: "",
  password: ""
})
watch(login, () => {
  if (validateEmail(login.value.email) !== true) {
    loText.value.email = validateEmail(login.value.email);
  } else {
    loText.value.email = "";
  }
  if (validatePassword(login.value.password) !== true) {
    loText.value.password = validatePassword(login.value.password);
  } else {
    loText.value.password = "";
  }
  return;
}, {deep: true});
watch(register, () => {
  if (register.value.username.length === 0) {
    reText.value.username = "用户名不能为空";
    console.log("error")
  } else {
    reText.value.username = "";
    console.log("success")
  }
  if (register.value.username.length > 20) {
    reText.value.username = "用户名不能超过20个字符";
    console.log("error")

  } else {
    reText.value.username = "";
    console.log("success")

  }
  // 验证邮箱
  if (validateEmail(register.value.email) !== true) {
    reText.value.email = validateEmail(register.value.email);
    console.log("error")
  } else {
    reText.value.email = "";
    console.log("success")
  }
  // 验证密码
  if (validatePassword(register.value.password) !== true) {
    reText.value.password = validatePassword(register.value.password);
    console.log("error")
  } else {
    reText.value.password = "";
    console.log("success")
  }

  if (register.value.introduction === "") {
    reText.value.introduction = "介绍不能为空";
    console.log("error")
  } else {
    reText.value.introduction = "";
    console.log("success")
  }
  return;
}, {deep: true});
const h = () => {
  if (Tmode.value === "登录") {
    var isPass = false;
    if (validateEmail(login.value.email) !== true) {
      loText.value.email = validateEmail(login.value.email);
      isPass = false;
    } else {
      loText.value.email = "";
      isPass = true;
    }
    if (validatePassword(login.value.password) !== true) {
      loText.value.password = validatePassword(login.value.password);
      isPass = false;
    } else {
      loText.value.password = "";
      isPass = true;
    }
    if (!isPass) return;

    fetch(host + "/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(login.value),
    }).then((res) => {
      return res.json();
    }).then((data) => {
      console.log(data)
      if (data.code === 200) {
        localStorage.setItem("sync_token", data.token);
        localStorage.setItem("sync_user", data.data.id);
        router.push("/me");
      } else {
        snackbar({message: data.msg});
      }
    }).catch((err) => {
      console.log(err);
      snackbar({message: "网络错误"});
    })
  } else {
    let isPass = false;
    if (register.value.username.length === 0) {
      reText.value.username = "用户名不能为空";
      isPass = false;
      console.log("error")

    } else {
      reText.value.username = "";
      console.log("success")
      isPass = true;
    }
    if (register.value.username.length > 20) {
      reText.value.username = "用户名不能超过20个字符";
      console.log("error")
      isPass = false;
    } else {
      reText.value.username = "";
      console.log("success")
      isPass = true;

    }
    // 验证邮箱
    if (validateEmail(register.value.email) !== true) {
      reText.value.email = validateEmail(register.value.email);
      console.log("error")
      isPass = false;
    } else {
      reText.value.email = "";
      console.log("success")
      isPass = true;
    }
    // 验证密码
    if (validatePassword(register.value.password) !== true) {
      reText.value.password = validatePassword(register.value.password);
      console.log("error")
      isPass = false;
    } else {
      reText.value.password = "";
      isPass = true;
      console.log("success")
    }

    if (register.value.introduction === "") {
      reText.value.introduction = "介绍不能为空";
      console.log("error")
      isPass = false;
    } else {
      reText.value.introduction = "";
      console.log("success")
      isPass = true;
    }
    if (!isPass) return;
    fetch(host + "/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(register.value),
    }).then((res) => {
      return res.json();
    }).then((data) => {
      console.log(data);
      if (data.code === 200) {
        localStorage.setItem("sync_token", data.token);
        localStorage.setItem("sync_user", data.data.id);
        pass()
      } else {
        snackbar({
          message: "注册失败",
        });
      }
    }).catch((err) => {
      console.log(err);
      snackbar({
        message: "注册失败",
      });
    });
  }

};

function pass() {
  cls.value = "crd";
  setTimeout(() => {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push("/me");
      });
    } else {
      router.push("/me");
    }
  }, 300);
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    return "电子邮件不能为空。";
  }
  if (!emailPattern.test(email)) {
    return "电子邮件格式无效。请确保包含 '@' 和有效的域名。";
  }
  return true;
}

function validatePassword(password) {
  const errors = [];

  if (!password) {
    errors.push("密码不能为空。");
  }
  if (password.length < 8) {
    errors.push("密码长度必须至少为8个字符。");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("密码必须包含至少一个小写字母。");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("密码必须包含至少一个大写字母。");
  }
  if (!/\d/.test(password)) {
    errors.push("密码必须包含至少一个数字。");
  }

  return errors.length === 0 ? true : errors.join("\n");
}
</script>

<style scoped>
.crd {
  transform: scale(0.5) translateY(120vh);
}
</style>