function musicLyric(init, func, timeupdate, isPlay) {
    let v = "data-v-" + Math.random().toString(36).substring(2, 7)// 生成随机属性名

    // -------- style --------
    let style = document.createElement("style") // 创建style标签
    style.rel = "stylesheet"        // 设置属性
    if (init.style == null) {
        init.style = {}
    }
    let init_s = init.style
    let ob = Object.keys(init_s) // 获取对象属性
    let default_style = {
        scale: 1.5, // 缩放
        color: "#0d6efd", // 颜色
        letterSpacing: 2, // 字间距
        transition: 0.2, // 滚动时间
        size: 20, // 字体大小
        lineHight: 50, // 行高
        cb: 'ease-in-out', // 缓动函数
    }
    init_s = default_style
    for (let i = 0; i < ob.length; i++) {
        let user_style = init.style
        if (typeof ob[i] != "undefind") {
            init_s[ob[i]] = user_style[ob[i]]
        }

    }
    style.innerHTML = getStyle(init_s)
    // 生成随机id
    let id = Math.random().toString(36).substring(2, 7)
    style.id = id
    document.head.appendChild(style)

    // -------- main --------

    let audio = document.querySelector(init.audio) // 获取音频元素
    let lyric = document.querySelector(init.lyric)// 获取歌词容器
    lyric.toggleAttribute(v) // 添加属性
    lyric.classList.add("ml-main")// 添加样式
    lyric.insertAdjacentHTML("afterbegin", `<div class="lyric"></div>`)// 添加歌词容器

    let lrc// 歌词数组
    //audio.currentTime = 0.1// 初始化时间
    let main = lyric.children[0]// 歌词容器
    main.toggleAttribute(v)// 添加属性

    let nlrc = init.lyricText // 歌词文本
    nlrc = nlrc.split("\n")// 歌词文本分割
    if (nlrc[nlrc.length - 1] === "") { // 去除最后一个元素
        nlrc.pop()
    }
    let index = 0// 歌词索引
    lrc = nlrc.map(function (item) {// 歌词文本分割
        let nitem = item.split("]")// 歌词文本分割
        let time = nitem[0].slice(1)
        let text = nitem[1]
        // 将时间转换为秒
        time = time.split(":")// 歌词文本分割
        time = parseInt(time[0]) * 60 + parseFloat(time[1])
        time = time * 1000
        time = time
        time = parseInt(time)
        return {
            time: time,
            text: text,
            id: index++
        }
    })
    for (let i = 0; i < lrc.length; i++) {
        main.insertAdjacentHTML("beforeend", `<p ${v} data-id="${lrc[i].id}">${lrc[i].text}</p>`)
    }
    //console.log(lrc)
    goCenter(lrc[0].id)// 初始化

    //audio.currentTime = 0.0001 // 初始化时间

    let nowEle = -1
    audio.addEventListener("timeupdate", f)
    //setInterval(f, 100) // 每秒执行100次
    function f() {// 监听时间变化
        let nowTime = (audio.currentTime); // 当前时间
        // 转换为毫秒
        nowTime = nowTime * 1000;// 当前时间
        //console.log(nowTime);
        let lrcs = []// 歌词数组
        for (let i = 0; i < lrc.length; i++) {// 遍历歌词
            if (nowTime >= lrc[i].time) {
                lrcs.push(lrc[i])
            }
        }

        if (lrcs.length > 0) {
            if (nowEle != lrcs[lrcs.length - 1].id) {// 判断是否为当前歌词
                if (func) {
                    func(lrcs[lrcs.length - 1].text)
                }
                renderLyric(lrcs)
                //console.log(lrcs[lrcs.length - 1].id, lrcs[lrcs.length - 1].text);

            }
            nowEle = lrcs[lrcs.length - 1].id


            //console.log(lrcs);
        }
        if (timeupdate) {
            timeupdate(audio.duration, audio.currentTime)// 回调函数
        }
    }

    //if (lrcs.length > 0) {
    //    lastId = lrcs[lrcs.length - 2].id
    //    if (lastId !== lrcs[lrcs.length - 1].id) {
    //        //console.log(lrcs[lrcs.length - 1].text);
    //        //main.insertAdjacentHTML("beforeend", `<p>${lrcs[lrcs.length - 1].text}</p>`)
    //        //console.log(lrcs[lrcs.length - 1].id,lastId);
    //
    //        let nowEle = getEle(lrcs[lrcs.length - 1].id)
    //        let lastEle = getEle(lastId)
    //        console.log(nowId, lastId);
    //        console.log(nowEle, lastEle);
    //        nowEle.ele.classList.add("ml-max")
    //        lastEle.ele.classList.remove("ml-max")
    //        //nowId = nowEle.eleList[nowEle.eleList.length - 2].getAttribute("data-id")
    //        if (nowEle.eleList.length > 1) {
    //            nowId = nowEle.eleList[nowEle.eleList.length - 2].getAttribute("data-id")
    //        } else {
    //            nowId = nowEle.eleList[nowEle.eleList.length - 1].getAttribute("data-id")
    //        }
    //        goCenter(lastId)
    //        // console.log(lrcs[lrcs.length - 1].text);
    //        // document.title = lrcs[lrcs.length - 1].text
    //        // document.getElementById("text").innerHTML = lrcs[lrcs.length - 1].text
    //        if (func) {
    //            func(lrcs[lrcs.length - 1].text)
    //        }
    //
    //    }
    //
    //
    //}
    //
    //if (timeupdate) {
    //    timeupdate(audio.duration, e.target.currentTime)// 回调函数
    //}



    function renderLyric(lrc) {
        goCenter(lrc[lrc.length - 1].id)
        let lyricList = lyric.children[0].children
        //console.log(lyricList);
        for (let i = 0; i < lyricList.length; i++) {
            if (lyricList[i].classList.contains("ml-max")) {
                lyricList[i].classList.remove("ml-max")
            }
        }
        lyricList[lrc.length - 1].classList.add("ml-max")

    }

    function getEle(id) {
        let eleList = []
        // 获取在lyric.children[0].children数组中索引比id小的所有元素

        if (typeof id == "undefined" || id === 0) {
            // console.log(lyric.children[0].children);
            return {
                ele: eleList[0],
                eleList: [lyric.children[0].children[0]]
            }
        }

        for (let i = 0; i < id; i++) {
            eleList.push(lyric.children[0].children[i])
        }
        return {
            ele: lyric.children[0].children[id],
            eleList: eleList
        }
        //let ele = lyric.children[0]
        //let eleList = []
        //if (typeof id == "undefined") {
        //    eleList.push(ele.children[0])
        //    return {
        //        ele: eleList[0],
        //        eleList: eleList
        //    }
        //}
        //for (let i = 0; i < ele.children.length; i++) {
        //    let dataId = ele.children[i].getAttribute("data-id")
        //    eleList.push(ele.children[i])
        //    if (dataId === id) {
        //        return {
        //            ele: eleList[i],
        //            eleList: eleList
        //        }
        //    }
        //}
    }

    function goCenter(id) {
        let ele = getEle(id)
        //console.log(ele);
        let main = document.querySelector(init.lyric)
        let lyric = main.children[0]

        let mainHeight = main.offsetHeight / 2
        //if (id == 0) {
        //    let eh = lyric.children[0].offsetHeight
        //    lyric.style.marginTop = `${(mainHeight - (eh / 2))}px`
        //    return
        //}
        let everyEleHeight = ele.eleList[0].offsetHeight



        let eleHeight = (ele.eleList.length) * everyEleHeight + (everyEleHeight / 2)
        let set = eleHeight - mainHeight


        lyric.style.marginTop = `${-set}px`

    }

    function getStyle(obj) {
        let style = `
.ml-max[${v}] {
    transform: scale(${obj.scale});
    -webkit-transform: scale(${obj.scale});
    font-weight: 700;
    font-size: 17px;
}
.ml-main[${v}] {
    transition: ${obj.transition}s;
    z-index: 1;
    cursor: default;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.ml-main[${v}]::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
}
.ml-main[${v}] {
    scrollbar-width: none;
    /* firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow: hidden;
}
.ml-main[${v}] .lyric {
    width: 100%;
    height: 100%;
    transition: all ${obj.transition}s ease-in;
    -webkit-transition: all ${obj.transition}s ease-in;
    z-index: 0;
}
.ml-main[${v}] p {
    font-size: ${obj.size}px;
    text-align: center;
    line-height: ${obj.lineHight}px;
    transition: ${obj.transition}s ${obj.cb};
    -webkit-transition: ${obj.transition}s ${obj.cb};
    height: ${obj.lineHight}px;
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 当文本溢出时显示省略号 */
    /*white-space: nowrap;*/
    /* 禁止文本换行 */
    margin: 0;
    opacity: 0.7;
    font-size: 15px
    
}`
        return style
    }

    return {
        lrc: lrc,
        style: init_s,
        changeStyle: (obj) => {
            let style = document.getElementById(id)
            // init_s和obj合并
            let new_s = Object.assign({}, init_s, obj)
            style.innerHTML = getStyle(new_s)
            init_s = new_s
            main.style.animationPlayState = "paused"
            setTimeout(() => {
                goCenter(nowEle)
                main.style.animationPlayState = "running"
            }, new_s.transition * 1000)

        },
        cancel: (cancel) => {
            //audio.pause()
            // 取消事件监听
            audio.removeEventListener("timeupdate", f)
            // 删除样式
            document.getElementById(id).remove()
            //删除歌词dom
            document.querySelector(init.lyric).innerHTML = ""
            // 移除v
            document.querySelector(init.lyric).removeAttribute(v)
            // 删除audio元素
            //document.querySelector(init.audio).remove()
            if (cancel) { // 回调函数
                cancel()
            }
        },
        tooglePlay() {//切换播放状态
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
            isPlay(audio.paused)
            return audio.paused
        },
        setPlay(time) {//设置播放时间
            audio.currentTime = time
        },
        volume() {//获取音量
            return audio.volume
        },
        raiseVolume() {// 增加音量
            if (audio.volume >= 1) {
                return
            }
            audio.volume += 0.1
        },
        turnDownVolume() {// 减少音量
            if (audio.volume <= 0) {
                return
            }
            audio.volume -= 0.1
        },
        setVolume(volume) {// 设置音量
            if (volume > 1) {
                volume = 1
                return
            } else if (volume < 0) {
                volume = 0
                return
            }
            audio.volume = volume
        },
        toogleVolume() {// 切换音量
            if (audio.volume === 0) {
                audio.volume = 1
            } else if (audio.volume > 0) {
                audio.volume = 0
            }
        }

    }
}

export default musicLyric