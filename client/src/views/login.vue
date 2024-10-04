<template>
    <div
        style="width: 100vw;height: 100vh;display: flex;justify-content: center;align-items: center;box-sizing: border-box;padding: 20px;">
        <mdui-card style="width: 400px;text-align: center;transition: all .3s;" :style="{ height: height }"
            variant="elevated" :class="cls">
            <mdui-tabs placement="top" value="登录">
                <mdui-tab value="登录" @click="height = '300px'">登录</mdui-tab>
                <mdui-tab value="注册" @click="height = '450px'">注册</mdui-tab>

                <mdui-tab-panel slot="panel" value="登录" style="padding: 20px;">
                    <mdui-text-field variant="outlined" label="请输入邮箱"></mdui-text-field>
                    <mdui-text-field variant="outlined" label="请输入密码"
                        style="margin-top: 25px;margin-bottom: 25px;"></mdui-text-field>
                    <mdui-button variant="elevated" @click="h">登录</mdui-button>
                </mdui-tab-panel>
                <mdui-tab-panel slot="panel" value="注册" style="padding: 20px;">
                    <mdui-text-field variant="outlined" label="用户名"></mdui-text-field>
                    <mdui-text-field variant="outlined" label="邮箱" style="margin-top: 25px;"></mdui-text-field>
                    <mdui-text-field variant="outlined" label="介绍" style="margin-top: 25px;"></mdui-text-field>
                    <mdui-text-field variant="outlined" label="密码" style="margin-top: 25px;"
                        type="password"></mdui-text-field>
                    <mdui-button variant="elevated" style="margin-top: 25px;" @click="h">注册</mdui-button>
                </mdui-tab-panel>
            </mdui-tabs>

        </mdui-card>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
const height = ref("300px");
const cls = ref("");
const h = () => {
    cls.value = "crd";
    setTimeout(() => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                router.push("/");
            });
        } else {
            router.push("/");
        }
    }, 300);

};
</script>

<style scoped>
.crd {
    transform: scale(0.5) translateY(120vh);
}
</style>