const crypto = require('crypto')
function Password(str){
    return crypto.createHash('md5').update(str).digest("hex")
}

function ComparePassword(str, hash){
    return Password(str) === hash
}
module.exports = {Password, ComparePassword}
