<script setup>
</script>

<template>
    <div class="info">
        <div class="img">
            <mdui-avatar style="width: 80%;height: 80%;" src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
        </div>
        <div class="info-right">
            <p style="font-size: 25px;margin: 0;margin-top: 20px;font-weight: 700;">张三</p>
            <p style="margin: 0;margin-top: 5px;">张三很懒，什么也没说...</p>

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
</style>