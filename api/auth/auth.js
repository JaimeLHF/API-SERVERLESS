const { pbkdf2Sync } = require('crypto')
const { buildResponse } = require('../util')
const { sign, verify } = require("jsonwebtoken")

function createToken(username, id) {
    const token = sign({ username, id }, process.env.JWT_SECRET, {
        audience: 'alura_serverless',
        expiresIn: '24h'
    })

    return token
}

function authorize(event) {
    const { authorization } = event.headers
    if (!authorization) {
        return buildResponse(401, { error: 'Missing Auth!' })
    }

    const [type, token] = authorization.split(' ')
    if (type !== 'Bearer' || !token) {
        return buildResponse(401, { error: 'Unsuported Auth Type!' })
    }

    const decoded = verify(token, process.env.JWT_SECRET, {
        audience: 'alura_serverless'
    })

    if (!decoded) {
        return buildResponse(401, { error: 'Invalid Token!' })
    }

    return decoded;
}


function makeHash (password) {
 return pbkdf2Sync(password, process.env.SALT, 100000, 64, 'sha512').toString('hex')

}

module.exports = {
    authorize,
    createToken,
    makeHash
}
