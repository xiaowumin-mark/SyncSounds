const { sequelize, User, Rooms, Songs } = require('./database.js');
const config = require('./config.js');
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Password, ComparePassword } = require('./crypto.js');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const { generateToken, verifyToken } = require('./jwt.js');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const mtpy = require('multiparty');
const { search, song_detail, lyric, song_download_url } = require('NeteaseCloudMusicApi');
const axios = require('axios');

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, 'static')));
let server = http.createServer(app);
let io = require('socket.io')(server);

app.post("/api/user/register", async (req, res) => {
    //解析body中的json
    let d = req.body;

    try {
        let user = await User.create({
            username: d.username,
            password: Password(d.password),
            introduction: d.introduction,
            email: d.email,
        })
        res.json({
            code: 200,
            msg: "注册成功",
            data: null,
            token: generateToken(user.id)
        })
    }
    catch (e) {
        console.log(e);
        res.json({
            code: 500,
            msg: "注册失败",
            data: null
        })
    }
})

app.post("/api/user/login", async (req, res) => {
    let d = req.body;
    try {
        let user = await User.findOne({
            where: {
                username: d.username,
            }
        })
        if (user) {
            if (ComparePassword(d.password, user.password)) {
                res.json({
                    code: 200,
                    msg: "登录成功",
                    data: user,
                    token: generateToken(user.id),
                })
            }
            else {
                res.json({
                    code: 500,
                    msg: "密码错误",
                    data: null
                })
            }
        }
    }
    catch (e) {
        res.json({
            code: 500,
            msg: "登录失败",
            data: null
        })
    }
})

app.post("/api/user/upload", (req, res) => {
    const fd = new mtpy.Form();
    fd.uploadDir = path.join(__dirname, 'static', "ua");
    fd.encoding = 'utf-8';
    fd.parse(req, async function (err, fields, files) {


        verifyToken(fields.token[0]).then(user => {

            try {

                // 更新头像路径
                user.update({
                    avatar: "/static/ua/" + spPath(files.file[0].path)
                });

                res.json({
                    code: 200,
                    msg: "查询成功",
                    data: user
                })
            }
            catch (e) {
                res.json({
                    code: 500,
                    msg: "用户不存在",
                    data: null
                })
            }
        }).catch(err => {
            res.json({
                code: 500,
                msg: "token错误",
                data: null
            })
        });



        /* res.json({
            code: 200,
            msg: "上传成功",
            data: null
        }) */



    })

});

app.get("/api/user/info", async (req, res) => {

    verifyToken(req.body.token).then(async tokendata => {
        let userid = tokendata.userId;
        // 在user表中查询
        let user = await User.findOne({
            where: {
                id: userid
            }
        });
        res.json({
            code: 200,
            msg: "查询成功",
            data: user
        })
    }).catch(err => {
        res.json({
            code: 500,
            msg: "token错误",
            data: null
        })
    });



})

app.get("/api/user/info/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let user = await User.findOne({
            where: {
                id: id
            }
        });
        res.json({
            code: 200,
            msg: "查询成功",
            data: {
                username: user.username,
                avatar: user.avatar,
                introduction: user.introduction,
                email: user.email,
                id: user.id
            }
        })
    }
    catch (e) {
        res.json({
            code: 500,
            msg: "查询失败",
            data: null
        })
    }


})

app.get("/api/song/search", async (req, res) => {
    let name = req.query.name; // 搜索的名称
    search({
        keywords: name,
        type: 1,
    }).then(data => {
        res.json({
            code: 200,
            msg: "搜索成功",
            data: data.body.result.songs
        })
    }).catch(e => {
        console.log(e);
        res.json({
            code: 500,
            msg: "搜索失败",
            data: null
        })
    });
})


app.post("/api/song/addData", async (req, res) => {
    let d = req.body;
    verifyToken(d.token).then(async user => {
        let songid = d.id;
        song_detail({
            ids: `${songid}`
        }).then(async data => {
            /* res.json({
                code: 200,
                msg: "添加成功",
                data: data.body.songs[0]
            }) */
            let song = data.body.songs[0];
            let fee = song.fee;
            /* fee: enum,
              0: 免费或无版权
              1: VIP 歌曲
              4: 购买专辑
              8: 非会员可免费播放低音质，会员可播放高音质及下载 */
            if (fee == 1) {

                res.json({
                    code: 500,
                    msg: "该歌曲为付费歌曲",
                    data: null
                })
                return
            } else if (fee == 4) { // 付费专辑
                res.json({
                    code: 500,
                    msg: "该歌曲为付费专辑",
                    data: null
                })
                return
            }




            // 判断是否已经存在
            let song_exist = await Songs.findOne({
                where: {
                    id: song.id
                }
            });
            if (!song_exist) { // 不存在
                console.log({
                    music_id: String(song.id),
                    name: song.name,
                    singer: song.ar[0].name,
                    all_time: song.dt,
                    image: song.al.picUrl,
                    is_public: true
                });

                let Song = await Songs.create({
                    music_id: String(song.id),
                    name: song.name,
                    singer: song.ar[0].name,
                    all_time: song.dt,
                    image: song.al.picUrl,
                    is_public: 1,
                    file: ""
                });
                res.json({
                    code: 200,
                    msg: "添加成功",
                    data: Song
                })

                lyric({
                    id: song.id
                }).then(data => {
                    let lyric = data.body.lrc.lyric;
                    Song.update({
                        lyric: lyric
                    });
                    song_download_url({
                        id: song.id
                    }).then(data => {
                        console.log(data);

                        let url = data.body.data.url;
                        console.log(url);
                        let file = path.resolve(__dirname, "static/music/" + song.id + "." + data.body.data.encodeType);
                        /* Song.update({
                            file: url
                        }); */
                        downloadFile(url, file, (e) => {
                            console.log(e);
                        }).then(() => {
                            console.log("下载完成");
                            Song.update({
                                file: "/static/music/" + song.id + "." + data.body.data.encodeType // 文件地址
                            });

                        }).catch((e) => { // 下载失败
                            console.log(e);
                        });
                        // websocket 通知
                    })
                });

            } else { // 存在
                res.json({
                    code: 200,
                    msg: "已存在",
                    data: song_exist
                })
            }
        }).catch(e => {
            console.log(e);
            res.json({
                code: 500,
                msg: "添加失败",
                data: null
            })
        });
    }).catch(err => {
        res.json({
            code: 500,
            msg: "token错误",
            data: null
        })
    });
})

app.get("/api/song", async (req, res) => {
    let songs = await Songs.findAll({
        where: {
            is_public: 1
        }
    });
    res.json({
        code: 200,
        msg: "获取成功",
        data: songs
    });
})

app.post("/api/room/new", async (req, res) => {
    // name,instruction,allow_peeople_num,ispublic,password,songs
    let d = req.body;
    verifyToken(d.token).then(async user => {
        try {
            let room = await Rooms.create({
                name: d.name,
                intronduction: d.intronduction,
                allow_peoples_num: d.allow_peoples_num,
                is_public: d.ispublic,
                password: d.ispublic ? "" : Password(d.password),
                songs: d.songs,
                owner_id: user.id,
                // 用unix时间戳作为房间号
                room_id: Math.floor(Date.now() / 1000)
            });
            res.json({
                code: 200,
                msg: "创建成功",
                data: room
            })
        }
        catch (e) {
            res.json({
                code: 500,
                msg: "创建失败",
                data: null
            })
        }
    }).catch(err => {
        res.json({
            code: 500,
            msg: "token错误",
            data: null
        })
    });
})

app.post("/api/room/remove", async (req, res) => {
    let d = req.body;
    verifyToken(d.token).then(async user => {
        let room = await Rooms.findOne({
            where: {
                room_id: d.id,
                owner_id: user.id
            }
        });
        if (room) {
            await room.destroy();
            res.json({
                code: 200,
                msg: "删除成功",
                data: null
            })
            return
        } else {
            res.json({
                code: 500,
                msg: "删除失败",
                data: null
            })
            return
        }
    }).catch(err => {
        res.json({
            code: 500,
            msg: "token错误",
            data: null
        })
    });

})

//有新的客户端连接时触发
io.on('connection', function (socket) {
    //接收到消息时触发
    socket.on('message', function (data) {
        console.log('服务端收到 : ', data);
        //注意send()方法其实是发送一个 'message' 事件
        //客户端要通过on('message')来响应
        socket.send('你好客户端, ' + data);
    });
    //发生错误时触发
    socket.on('error', function (err) {
        console.log(err);
    });
});

server.listen(config.redis.port);


function spPath(path) {
    let l = path.split("\\");
    return l[l.length - 1];
}

// 下载文件的函数
const downloadFile = async (url, destination, callback) => {
    const writer = fs.createWriteStream(destination); // 创建一个写入流

    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream', // 将响应类型设置为流
        onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.floor((loaded * 100) / total); // 计算下载百分比
            if (callback) {
                callback(percentage);
            }
        },
    });

    response.data.pipe(writer); // 将数据流写入文件

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve); // 下载完成触发
        writer.on('error', reject); // 下载失败触发
    });
};