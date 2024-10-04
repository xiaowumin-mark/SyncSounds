const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./database.js');
// 假设这是你的私钥，实际使用中请保密并妥善管理  
const SECRET_KEY = require("./config").jwt.secret;

// JWT 生成函数  
function generateToken(userId, expiresIn = '365d') {
    try {
        const payload = {
            userId, // 你可以在这里添加更多用户信息  
            // 可以在payload中添加其他自定义字段  
        };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn });
        return token;
    } catch (error) {
        throw new Error('Failed to generate JWT token', error);
    }
}

function verifyToken(token) {
    /* try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        throw new Error('Invalid JWT token', error);
    } */
    return new Promise((resolve, reject) => {
        const decoded = jwt.verify(token, SECRET_KEY);
        User.findOne({ where: { id: decoded.userId } }).then(user => {
            if (user) {
                resolve(user);
            } else {
                reject('用户不存在');
            }
        }).catch(() => {
            reject('用户不存在');
        });
    })
}

module.exports = {
    generateToken,
    verifyToken,
};