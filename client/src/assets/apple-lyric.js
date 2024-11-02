class AppleLyric {
    constructor(lrcContainerSelector, audioDom, lyricsText, style = {
        fontSize: 40,
        ifBlur: true,
        ifTrainsion: true,
        scale: 1.2,
        interval: 10,
        ifInner: false,
        animateionOffsetTime: 5

    }, func) {
        this.lrcContainer = document.querySelector(lrcContainerSelector);
        this.audio = audioDom;
        this.lyricsText = lyricsText;
        this.lrcList = [];
        this.offsetH = 90;
        this.lastLrc = -1;
        this.style = style;
        this.gFunc = () => {
            this.updateLrc();
        }
        this.func = func;
        this.init();

    }

    init() {
        this.lrcContainer.innerHTML = '';
        this.lrcList = this.parseLrc(this.lyricsText);
        for (let i = 0; i < this.lrcList.length; i++) {
            this.lrcContainer.appendChild(this.lrcList[i].dom);

        }
        this.nextLrc(0, this.lrcList, true);

        this.audio.addEventListener('timeupdate', this.gFunc);
        // 这里可以删掉 ----------------------------------------------------------------------------------------
        /*document.body.addEventListener('click', () => {
            if (this.audio.paused) {
                this.audio.play();
            } else {
                this.audio.pause();
            }
        });*/
        // ----------------------------------------------------------------------------------------
    }

    parseLrc(text) {
        let arr = text.split('\n');
        let res = [];

        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].substring(1);
            let arrTL = arr[i].split(']');
            let arrTime = arrTL[0].split(':');
            let doTime = arrTime[1].split('.');
            const p = document.createElement('p');
            p.innerText = arrTL[1];
            p.style.fontSize = this.style.fontSize + 'px';
            p.style.paddingBottom = this.style.interval + 'px';
            p.style.position = 'absolute';
            p.classList.add('apple_lyric_p');
            const time = (Number(arrTime[0]) * 60 * 1000) + (Number(doTime[0]) * 1000) + Number(doTime[1]);
            p.addEventListener('click', () => {
                this.audio.currentTime = time / 1000;
                this.lrcContainer.scroll({
                    top: 0,
                    behavior: 'smooth'
                })
            });
            res.push({
                time: time,
                lrc: arrTL[1],
                index: i,
                dom: p
            });
        }
        return res;
    }

    nextLrc(i = 0, data, isinit = false) {
        if (isinit) {
            for (let j = 0; j < data.length; j++) {
                data[j].dom.style.top = this.getTopHeight(i, j, data) + 'px';
            }
            return;
        }
        for (let j = 0; j < data.length; j++) {
            if (this.style.ifBlur) {
                data[j].dom.style.filter = `blur(${Math.abs(j - i)}px)`
            }
            data[j].dom.style.color = (i === j) ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, .25)';
            data[j].dom.style.transform = (i === j) ? 'scale(' + this.style.scale + ')' : 'scale(1)';

            const n = Math.abs(j - i)
            const ah = n * 70 - n * this.style.animationOffsetTime
            //console.log(n, ah);

            if (i < j && this.style.ifTrainsion) {

                if (this.style.ifInner) {
                    if (this.isElementVisible(data[j].dom)) {
                        setTimeout(() => {
                            window.requestAnimationFrame(() => {
                                data[j].dom.style.top = this.getTopHeight(i, j, data) + 'px';
                                // 使用transform 动画
                                //data[j].dom.style.transform = `translateY(${this.getTopHeight(i, j, data)}px)`;
                            });
                        }, ah);
                    } else {
                        data[j].dom.style.top = this.getTopHeight(i, j, data) + 'px';

                        //data[j].dom.style.transform = `translateY(${this.getTopHeight(i, j, data)}px)`;
                    }
                } else {
                    setTimeout(() => {
                        window.requestAnimationFrame(() => {
                            data[j].dom.style.top = this.getTopHeight(i, j, data) + 'px';
                            // 使用transform 动画
                            //data[j].dom.style.transform = `translateY(${this.getTopHeight(i, j, data)}px)`;
                        });
                    }, ah);
                }


            } else {
                data[j].dom.style.top = this.getTopHeight(i, j, data) + 'px';
                //data[j].dom.style.transform = `translateY(${this.getTopHeight(i, j, data)}px)`;
            }
        }
    }


    getTopHeight(now, to, data) {
        let res = 0;
        /*for (let i = now; i < to; i++) {
            res += data[i].dom.offsetHeight;
        }
        for (let i = now; i > to; i--) {
            res -= data[i].dom.offsetHeight;
        }*/

        // 判断滚动方向
        if (to > now) { // 向下滚动
            for (let i = now; i < to; i++) {
                res += data[i].dom.offsetHeight + this.style.interval;
            }
        } else { // 向上滚动
            for (let i = now; i > to; i--) {
                res -= data[i - 1].dom.offsetHeight + this.style.interval;
            }
        }

        // 使用偏移值作为初始位置，确保歌词居中或位于正确位置
        return res + this.offsetH;
    }

    updateLrc() {
        //if (!this.lrcList) return; // 检查 lrcList 是否为 null

        const cTime = this.audio.currentTime * 1000;
        let lList = [];
        for (let i = 0; i < this.lrcList.length; i++) {
            if (cTime >= this.lrcList[i].time) {
                lList.push(this.lrcList[i]);
            }
        }
        if (lList.length === 0) return;
        if (this.lastLrc !== lList[lList.length - 1].index) {
            this.nextLrc(lList[lList.length - 1].index, this.lrcList);
            this.lastLrc = lList[lList.length - 1].index;
            if (this.func) this.func(lList[lList.length - 1].index, lList[lList.length - 1].lrc);
        }
    }


    isElementVisible(el) {
        const rect = el.getBoundingClientRect()
        const vWidth = window.innerWidth || document.documentElement.clientWidth
        const vHeight = window.innerHeight || document.documentElement.clientHeight


        if (
            rect.right < 0 ||
            rect.bottom < 0 ||
            rect.left > vWidth ||
            rect.top > vHeight
        ) {
            return false
        }

        return true
    }

    cancel() {
        // 取消监听
        this.audio.removeEventListener('timeupdate', this.gFunc, false);
        this.lrcList = null;
        this.lastLrc = null;
        this.lrcContainer.innerHTML = '';
    }

}

export default AppleLyric;