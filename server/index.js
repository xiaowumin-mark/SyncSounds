const {sequelize, User, Rooms, Songs} = require('./database.js');
const config = require('./config.js');
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {Password, ComparePassword} = require('./crypto.js');
const storage = multer.memoryStorage()
const upload = multer({storage: storage})
const {generateToken, verifyToken} = require('./jwt.js');
const {v4: uuid} = require('uuid');
const fs = require('fs');
const mtpy = require('multiparty');
const {
    search, song_detail, lyric, song_download_url, user_account, user_playlist, playlist_track_all
} = require('NeteaseCloudMusicApi');
const axios = require('axios');

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'app')));
let server = http.createServer(app);
let io = require('socket.io')(server);

app.post("/api/user/register", async (req, res) => {
    //解析body中的json
    let d = req.body;

    try {
        let user = await User.create({
            username: d.username, password: Password(d.password), introduction: d.introduction, email: d.email,
        })
        res.json({
            code: 200, msg: "注册成功", data: {
                id: user.id,
            }, token: generateToken(user.id)
        })
    } catch (e) {
        console.log(e);
        res.json({
            code: 500, msg: "注册失败", data: null
        })
    }
})

app.post("/api/user/login", async (req, res) => {
    let d = req.body;
    try {
        let user = await User.findOne({
            where: {
                email: d.email,
            }
        })
        if (user) {
            if (ComparePassword(d.password, user.password)) {
                res.json({
                    code: 200, msg: "登录成功", data: user, token: generateToken(user.id),
                })
            } else {
                res.json({
                    code: 500, msg: "密码错误", data: null
                })
            }
        }
    } catch (e) {
        res.json({
            code: 500, msg: "登录失败", data: null
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
                    code: 200, msg: "查询成功", data: user
                })
            } catch (e) {
                res.json({
                    code: 500, msg: "用户不存在", data: null
                })
            }
        }).catch(err => {
            res.json({
                code: 500, msg: "token错误", data: null
            })
        });


        /* res.json({
            code: 200,
            msg: "上传成功",
            data: null
        }) */


    })

});

app.post("/api/user/info", async (req, res) => {

    verifyToken(req.body.token).then(async user => {
        res.json({
            code: 200, msg: "查询成功", data: user
        })
    }).catch(err => {
        res.json({
            code: 500, msg: "token错误", data: null
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
            code: 200, msg: "查询成功", data: {
                username: user.username,
                avatar: user.avatar,
                introduction: user.introduction,
                email: user.email,
                id: user.id
            }
        })
    } catch (e) {
        res.json({
            code: 500, msg: "查询失败", data: null
        })
    }


})

app.get("/api/song/search", async (req, res) => {
    let name = req.query.name; // 搜索的名称
    search({
        keywords: name, type: 1,
    }).then(data => {
        res.json({
            code: 200, msg: "搜索成功", data: data.body.result.songs
        })
    }).catch(e => {
        console.log(e);
        res.json({
            code: 500, msg: "搜索失败", data: null
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
                    code: 500, msg: "该歌曲为付费歌曲", data: null
                })
                return
            } else if (fee == 4) { // 付费专辑
                res.json({
                    code: 500, msg: "该歌曲为付费专辑", data: null
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
                            res.json({
                                code: 200, msg: "添加成功", data: Song
                            })
                        }).catch((e) => { // 下载失败
                            console.log(e);
                            res.json({
                                code: 500, msg: "添加失败", data: null
                            })
                        });
                        // websocket 通知
                    })
                });

            } else { // 存在
                res.json({
                    code: 200, msg: "已存在", data: song_exist
                })
            }
        }).catch(e => {
            console.log(e);
            res.json({
                code: 500, msg: "添加失败", data: null
            })
        });
    }).catch(err => {
        res.json({
            code: 500, msg: "token错误", data: null
        })
    });
})

app.post("/api/song/addMoreMusic", (req, res) => {
    const fd = new mtpy.Form();
    fd.uploadDir = path.join(__dirname, 'static', "music");
    fd.encoding = 'utf-8';
    fd.parse(req, async function (err, fields, files) {
        verifyToken(fields.token[0]).then(async user => {

            try {
                let songid = fields.id[0];
                song_detail({
                    ids: `${songid}`
                }).then(async data => {
                    /* res.json({
                        code: 200,
                        msg: "添加成功",
                        data: data.body.songs[0]
                    }) */
                    let song = data.body.songs[0];
                    //let fee = song.fee;
                    /* fee: enum,
                      0: 免费或无版权
                      1: VIP 歌曲
                      4: 购买专辑
                      8: 非会员可免费播放低音质，会员可播放高音质及下载 */
                    /*                     if (fee == 1) {
                    
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
                                        } */


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
                            file: "/static/music/" + spPath(files.file[0].path)
                        });
                        res.json({
                            code: 200, msg: "添加成功", data: Song
                        })

                        lyric({
                            id: song.id
                        }).then(data => {
                            let lyric = data.body.lrc.lyric;
                            Song.update({
                                lyric: lyric
                            });
                        });

                    } else { // 存在
                        res.json({
                            code: 200, msg: "已存在", data: song_exist
                        })
                    }
                }).catch(e => {
                    console.log(e);
                    res.json({
                        code: 500, msg: "添加失败", data: null
                    })
                });
            } catch (e) {
                res.json({
                    code: 500, msg: "用户不存在", data: null
                })
            }
        }).catch(err => {
            res.json({
                code: 500, msg: "token错误", data: null
            })
        });


        /* res.json({
            code: 200,
            msg: "上传成功",
            data: null
        }) */


    })


});

app.get("/api/song", async (req, res) => {
    let limit = req.query.limit ? Number(req.query.limit) : 10;
    let offset = req.query.offset ? Number(req.query.offset) : 0;
    // 分页查询
    let songs = await Songs.findAll({
        limit: limit, offset: offset
    });

    res.json({
        code: 200, msg: "获取成功", data: songs, count: await Songs.count(), limit: limit, offset: offset,
    });
})

app.get("/api/room/info/:id", async (req, res) => {
    let id = req.params.id;
    Rooms.findOne({
        where: {
            id: id
        },
    }).then(async d => {
        let sj = JSON.parse(d.songs);
        const sd = await Songs.findAll({
            where: {
                id: sj
            }
        })
        let peos = await User.findAll({
            where: {
                id: JSON.parse(d.peoples)
            }
        })
        let peolesData = []
        const adminP = JSON.parse(d.admin)
        for (let i = 0; i < peos.length; i++) {
            console.log(peos[i]);
            let isAD = false;
            // 检查d.admin是否存在当前用户id
            if (adminP.includes(peos[i].id)) {
                isAD = true
            }
            peolesData.push({
                name: peos[i].username,
                id: peos[i].id,
                is_room_admin: isAD,
                avatar: peos[i].avatar,
                introduction: peos[i].introduction,
                in_room: peos[i].in_room,
                is_admin: peos[i].is_admin,
            })
        }
        const songdata = await Songs.findOne({
            where: {
                id: d.now_playing
            }
        });
        res.json({
            code: 200, msg: "获取成功", data: {
                admin: JSON.parse(d.admin),
                allow_peoples_num: d.allow_peoples_num,
                createdAt: d.createdAt,
                id: d.id,
                image: d.image,
                intronduction: d.intronduction,
                is_public: d.is_public,
                messages: JSON.parse(d.messages),
                name: d.name,
                owner_id: d.owner_id,
                peoples: peolesData,
                peoples_num: d.peoples_num,
                songs: sd,
                theme_color: d.theme_color,
                now_playing: songdata,
                updatedAt: d.updatedAt,
                play_progress: d.play_progress,
                play_mode: d.play_mode,
                paused: d.paused,

            }
        })


    }).catch(e => {
        console.log(e)
        res.json({
            code: 500, msg: "该房间不存在", data: null
        })
    });
})

app.get("/api/room", async (req, res) => {
    let limit = req.query.limit ? Number(req.query.limit) : 15;
    let offset = req.query.offset ? Number(req.query.offset) : 1;
    let rooms = await Rooms.findAll({
        where: {
            is_public: 1
        },
        order: [["id", "DESC"]],
        limit: limit,
        offset: limit * (offset - 1),
        attributes: ["id", "name", "intronduction", "allow_peoples_num", "is_public", "image", "theme_color", "peoples_num", "createdAt", "owner_id", "songs"],
    });

    res.json({
        code: 200,
        msg: "获取成功",
        data: rooms,
        pages: Math.ceil(await Rooms.count() / limit),
        limit: limit,
        offset: offset,
        count: await Rooms.count()
    })
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
                password: (function () {

                    if (d.ispublic) {
                        console.log("public")
                        return ""
                    } else {
                        let p = Password(d.password)
                        console.log(p)
                        return p
                    }
                }()),
                songs: d.songs,
                owner_id: user.id, // 用unix时间戳作为房间号
                room_id: Math.floor(Date.now() / 1000),
                peoples: "[]",
                admin: JSON.stringify([user.id]),
                messages: "[]"
            });
            res.json({
                code: 200, msg: "创建成功", data: room
            })
        } catch (e) {
            res.json({
                code: 500, msg: "创建失败", data: null
            })
        }
    }).catch(err => {
        res.json({
            code: 500, msg: "token错误", data: null
        })
    });
})

app.post("/api/room/remove", async (req, res) => {
    let d = req.body;
    verifyToken(d.token).then(async user => {
        let room = await Rooms.findOne({
            where: {
                room_id: d.id, owner_id: user.id
            }
        });
        if (room) {
            await room.destroy();
            res.json({
                code: 200, msg: "删除成功", data: null
            })
            return
        } else {
            res.json({
                code: 500, msg: "删除失败", data: null
            })
            return
        }
    }).catch(err => {
        res.json({
            code: 500, msg: "token错误", data: null
        })
    });

})

app.post("/api/wy/user_info", async (req, res) => {
    let cookie = req.body.cookie;
    user_account({
        cookie: cookie
    }).then(data => {
        res.json({
            code: 200, msg: "获取成功", data: data.body
        })
    }).catch(err => {
        console.log(err);
        res.json({
            code: 500, msg: "获取失败", data: null
        })
    });

})

app.post("/api/wy/songlist", async (req, res) => {
    let cookie = req.body.cookie;
    let uid = req.query.uid;
    user_playlist({
        cookie: cookie, uid: uid
    }).then(data => {
        res.json({
            code: 200, msg: "获取成功", data: data.body
        })

    }).catch(err => {
        console.log(err);
        res.json({
            code: 500, msg: "获取失败", data: null
        })
    })
})

app.post("/api/wy/songListAllMysic", async (req, res) => {
    let cookie = req.body.cookie;
    let id = req.query.id;
    playlist_track_all({
        cookie: cookie, id: id
    }).then(data => {
        res.json({
            code: 200, msg: "获取成功", data: data.body
        })
    }).catch(err => {
        console.log(err);
        res.json({
            code: 500, msg: "获取失败", data: null
        })
    });

})


//有新的客户端连接时触发
io.on('connection', function (socket) {

    console.log("有新的客户端连接了 ");
    //发生错误时触发
    socket.on('error', function (err) {
        console.log(err);
    });
});

io.on("disconnect", function () {

    console.log("有客户端断开了 ");
})

const chatSpace = io.of("/chat");
let RoomsData = {}
chatSpace.on("connection", function (s) {
    s.on("join", (data) => {
        console.log("join")
        verifyToken(data.token).then(async user => {
            /*
            * {
            *   token
            *   roomId
            * }*/
            Rooms.findOne({
                where: {
                    id: data.roomId,
                }
            }).then(async udata => {
                RoomsData[String(data.roomId)] = {
                    playCompleteNum: 0,
                }
                //console.log(udata)
                if ((udata.peoples_num + 1) > udata.allow_peoples_num) {

                    s.emit("error", {
                        code: 500, msg: "房间已满",
                    })
                    return
                }
                if (!udata.is_public && !ComparePassword(data.password, udata.password)) {
                    s.emit("error", {
                        code: 500, msg: "密码错误",
                    });
                    return;
                }

                let peoples = JSON.parse(udata.peoples);
                // 如果id在peoples中，则直接加入
                if (peoples.indexOf(user.id) > -1) {
                    s.emit("error", {
                        code: 500, msg: "已加入房间",
                    })
                    return
                }
                peoples.push(user.id);
                // 更新peoples
                udata.update({
                    peoples: JSON.stringify(peoples), peoples_num: udata.peoples_num + 1,
                });
                user.update({
                    in_room: data.roomId
                });
                const adminP = JSON.parse(udata.admin)
                let peos = await User.findAll({
                    where: {
                        id: peoples
                    }
                });
                s.join(data.roomId);
                // 给除了自己之外的所有用户发送加入房间的消息

                s.to(data.roomId).emit("join", {
                    code: 200, msg: user.username + " 加入房间", data: {
                        peoples: peoples, peoples_num: udata.peoples_num, user: {
                            name: user.username,
                            avatar: user.avatar,
                            id: user.id,
                            is_admin: user.is_admin,
                            email: user.email,
                            introduction: user.introduction,
                        }, is_room_admin: adminP.includes(user.id),
                    }
                })


                let peolesData = []

                for (let i = 0; i < peos.length; i++) {
                    console.log(peos[i]);
                    let isAD = false;
                    // 检查d.admin是否存在当前用户id
                    if (adminP.includes(peos[i].id)) {
                        isAD = true
                    }
                    peolesData.push({
                        name: peos[i].username,
                        id: peos[i].id,
                        is_room_admin: isAD,
                        avatar: peos[i].avatar,
                        introduction: peos[i].introduction,
                        in_room: peos[i].in_room,
                        is_admin: peos[i].is_admin,
                    })
                }
                s.emit("people", peolesData)
            })

        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误",
            })
        })
    })
    s.on("quit", (data) => {
        verifyToken(data.token).then(async user => {
            Rooms.findOne({
                where: {
                    id: user.in_room
                }
            }).then(udata => {
                let peoples = JSON.parse(udata.peoples);
                //去除id
                if (peoples.indexOf(user.id) > -1) {
                    let index = peoples.indexOf(user.id);
                    peoples.splice(index, 1);
                } else {
                    s.emit("error", {
                        code: 500, msg: "未加入房间",
                    })
                    return
                }
                // 更新peoples
                udata.update({
                    peoples: JSON.stringify(peoples), peoples_num: udata.peoples_num - 1,
                });
                s.to(user.in_room).emit("quit", {
                    id: user.id, code: 200, msg: user.username + " 退出房间",
                })
            })
        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误",
            })
        })
    })
    s.on("message", (data) => {
        verifyToken(data.token).then(async user => {
            Rooms.findOne({
                where: {
                    id: user.in_room,
                }
            }).then(udata => {
                let msg = JSON.parse(udata.messages);
                let msd = {
                    text: data.text, user: {
                        name: user.username,
                        avatar: user.avatar,
                        id: user.id,
                        is_admin: user.is_admin,
                        email: user.email,
                        introduction: user.introduction,
                    }, time: new Date().toISOString(),

                }
                msg.push(msd);

                chatSpace.to(user.in_room).emit("message", {
                    code: 200, msg: "发送成功", data: msd
                })

                udata.update({
                    messages: JSON.stringify(msg),
                });
            })
            //chatSpace.to(user.in_room).emit("message", data)
        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误",
            })
        })
    });

    s.on("force_exit", (data) => {
        verifyToken(data.token)
            .then(async user => {
                const Room = await Rooms.findOne({
                    where: {
                        id: user.in_room,
                    }
                })
                // 查看用户是否为房间管理员
                const adminP = JSON.parse(Room.admin)
                if (!adminP.includes(user.id)) {
                    s.emit("error", {
                        code: 500, msg: "没有权限",
                    })
                    return
                }
                // 向用户所在房间内广播退出消息，包含自己
                chatSpace.to(user.in_room).emit("force_exit", {
                    code: 200, msg: "管理员强制退出", data: {
                        id: data.id,
                    },
                })

            })
            .catch(err => {
                s.emit("error", {
                    code: 500, msg: "token错误",
                })
            });
    });
    s.on("complete", (data) => {
        verifyToken(data.token).then(async user => {
            RoomsData[String(user.in_room)].playCompleteNum += 1;
            const RoomD = await Rooms.findOne({
                where: {
                    id: user.in_room,
                }
            })
            if (RoomD.peoples_num == RoomsData[String(user.in_room)].playCompleteNum) {
                // 下一首歌曲
                // 广播，包含自己
                RoomsData[String(user.in_room)].playCompleteNum = 0;
                chatSpace.to(user.in_room).emit("next", {
                    code: 200, msg: "播放完成",
                })
            }

            console.log(RoomsData)
        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误"

            })

        })
    })

    s.on("change", (data) => {
        verifyToken(data.token).then(async user => {
            Rooms.findOne({
                where: {
                    id: user.in_room,
                }
            }).then(async udata => {
                udata.update({
                    now_playing: data.id, play_progress: 0,
                }).then(async () => {
                    // 更新播放列表
                    Songs.findOne({
                        where: {
                            id: data.id,
                        }
                    }).then(async song => {
                        // 广播，包含自己
                        chatSpace.to(user.in_room).emit("change", {
                            code: 200, msg: "切换成功", data: song
                        })
                    }).catch(err => {
                        s.emit("error", {
                            code: 500, msg: "歌曲不存在"
                        })
                    })
                }).catch(err => {
                    s.emit("error", {
                        code: 500, msg: "更新播放列表失败"
                    })
                })


            })
        })
            .catch(err => {
                s.emit("error", {
                    code: 500, msg: "token错误"

                })
            });
    })

    s.on("update_progress", (data) => {
        verifyToken(data.token).then(async user => {
            console.log("更新")
            Rooms.findOne({
                where: {
                    id: user.in_room,
                }
            }).then(async udata => {
                udata.update({
                    play_progress: data.progress,
                });
            })
        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误"

            })
        })
    })

    s.on("paused", (data) => {
        verifyToken(data.token).then(async user => {
            Rooms.findOne({
                where: {
                    id: user.in_room,
                }
            }).then(async udata => {
                udata.update({
                    paused: data.paused,
                }).then(async () => {
                    // 广播，不包含自己
                    s.to(user.in_room).emit("paused", {
                        code: 200, msg: "更新成功", data: {
                            paused: data.paused,
                        }
                    })
                }).catch(err => {
                    s.emit("error", {
                        code: 500, msg: "更新播放列表失败"
                    })
                })
            })
        }).catch(err => {
            s.emit("error", {
                code: 500, msg: "token错误"

            })
        })
    })
})

server.listen(config.redis.port);


function spPath(path) {
    let l = path.split("\\");
    return l[l.length - 1];
}

// 下载文件的函数
const downloadFile = async (url, destination, callback) => {
    const writer = fs.createWriteStream(destination); // 创建一个写入流

    const response = await axios({
        method: 'GET', url: url, responseType: 'stream', // 将响应类型设置为流
        onDownloadProgress: (progressEvent) => {
            const {loaded, total} = progressEvent;
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