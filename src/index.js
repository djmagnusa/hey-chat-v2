//this file being used on server 

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const webServer = http.createServer(app)
const io = socketio(webServer)

const { messageObjectFunction, locationMessageObjectFunction } = require('./utils/messagesObjects')
const { addMember, kickMember, getMember, getAvailableMembers } = require('./utils/members')

const port = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, '../public')))

//when a client connects 
io.on('connection', (socket) => {
    console.log('A new connection')

    //socket.emit('msg', 'Hey user! Welcome to the app')  //sending to this particular connection


    //socket.broadcast.emit('msg', 'New user appeared!') //emitting to every connection except the present one

    //socket.broadcast.emit('msg', messageObjectFunction('New user appeared!'))

    socket.on('join', ({ nickname, room }, callback) => {
        
        const { error, member } = addMember({ id: socket.id, room, nickname }) //destructuring if there is an error or a member returned from addMember
        
        if (error) {
            return callback(error) //return to stop the function execution
        }

        socket.join(member.room)

        socket.emit('msg', messageObjectFunction('Hey Chat',`Hey ${nickname}! Welcome to the app`))
        socket.broadcast.to(member.room).emit('msg', messageObjectFunction('Hey Chat',`${member.nickname} appeared!`))

        io.to(member.room).emit('roomInfo', {
            room: member.room,
            members: getAvailableMembers(member.room)

        })

        callback()
    })

    socket.on('sendMessage', (yourMessage, callback) => {
       // io.emit('msg', yourMessage)
        const member = getMember(socket.id) //getting user detail of that particular connection using socket.id
        io.to(member.room).emit('msg', messageObjectFunction(member.nickname, yourMessage))
        callback('Message delivered!')
    })

    socket.on('shareLocation', (coordinates, callback) => {
       // io.emit('locationMessage', `https://google.com/maps?q=${coordinates.lat},${coordinates.lon}`) //turning into a link
       const member = getMember(socket.id)
       const locationURL = `https://google.com/maps?q=${coordinates.lat},${coordinates.lon}`
       io.to(member.room).emit('locationMessage', locationMessageObjectFunction(member.nickname,locationURL))
       callback()
    })

    socket.on('disconnect', () => {
        //io.emit('msg', 'A user disconnected')
        const member = kickMember(socket.id)

        if (member) {
            io.to(member.room).emit('msg', messageObjectFunction('Hey Chat',`${member.nickname} disconnected`))
            io.to(member.room).emit('roomInfo', {
                room: member.room,
                members: getAvailableMembers(member.room)
            })
        }

        // io.emit('msg', messageObjectFunction('A user disconnected'))
    })
})


webServer.listen(port, () => {
    console.log(`Live on port ${port}`)
})
