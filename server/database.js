const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('sync-music', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

//module.exports = sequelize;

const User = sequelize.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false // 密码不能为空
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    intronduction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    love_music: {
        type: DataTypes.STRING,
        allowNull: true
    },
    songs_list: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_show_songs: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    in_room: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
});


const Rooms = sequelize.define('rooms', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    allow_peoples_num: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    peoples_num: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    room_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    intronduction: {
        type: DataTypes.STRING,
        allowNull: true
    },
    songs: {
        type: DataTypes.STRING,
        allowNull: true
    },
    messages: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    theme_color: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true,
});

const Songs = sequelize.define('songs', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    singer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    file: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lyric: {
        allowNull: true,
        type: DataTypes.TEXT('long')



    },
    peoples_num: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    all_time: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    music_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true,
});



(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database or sync the models:', error);
    }
})();

// 导出sequalize和mUser
module.exports = { sequelize, User, Rooms, Songs };