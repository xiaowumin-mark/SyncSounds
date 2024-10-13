function getUserInfo(cookie) {
    return new Promise((resolve, reject) => {
        if (!cookie) {
            reject("cookie为空")
            return;
        }
        if (localStorage.userInfo) {
            resolve(JSON.parse(localStorage.userInfo))
            return;
        }

        fetch(window.host + "/api/wy/user_info", {
            method: "post",
            body: JSON.stringify({
                cookie: cookie
            }),
            headers: {
                "Content-Type": "application/json"
            }

        }).then(res => res.json()).then(({ code, data }) => {
            let DATA = data
            console.log(DATA);

            if (DATA.code === 200) {
                localStorage.userInfo = JSON.stringify(DATA.account)
                resolve(DATA.account)
            } else {
                reject("获取用户信息失败")
            }
        }).catch(err => {
            reject("获取用户信息失败")
        })
    })
}

function getUserSongList(cookie, uid) {
    return new Promise((resolve, reject) => {
        if (!cookie || !uid) {
            reject("cookie为空")
            return;
        }
        fetch(window.host + "/api/wy/songlist?uid=" + uid, {
            method: "post",
            body: JSON.stringify({
                cookie: cookie
            }),
            headers: {
                "Content-Type": "application/json"
            }

        }).then(res => res.json()).then(({ code, data }) => {
            let DATA = data
            console.log(DATA);
            if (DATA.code === 200) {
                resolve(DATA.playlist)
            } else {
                reject("获取用户歌单失败")
            }
        }).catch(err => {
            reject("获取用户歌单失败")
        })
    })
}

function songListDetail(cookie, id) {
    return new Promise((resolve, reject) => {
        if (!cookie || !id) {
            reject("cookie为空")
            return;
        }

        fetch(window.host + "/api/wy/songListAllMysic?id=" + id, {
            method: "post",
            body: JSON.stringify({
                cookie: cookie
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(({ code, data }) => {
            let DATA = data
            console.log(DATA);
            if (DATA.code === 200) {
                resolve(DATA.songs)
            } else {
                reject("获取歌单详情失败")
            }
        }).catch(err => {
            reject("获取歌单详情失败")
        })
    })
}
export { getUserInfo, getUserSongList , songListDetail }