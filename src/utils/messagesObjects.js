const messageObjectFunction = (nickname, msg) => {
    return {
        nickname: nickname,
        msg: msg,
        createdAt: new Date().getTime() //returns no of milliseconds since 1st Janauary 1970 (Unix Epoch)
    }
}

const locationMessageObjectFunction = (nickname, locationURL) => {
    return {
        nickname: nickname,
        locationURL: locationURL,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    messageObjectFunction,
    locationMessageObjectFunction
}