//Client 

const socket = io()

const $msgForm = document.getElementById("msg-form")
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $shareLocationBtn = document.getElementById('share-location')
const $messages = document.getElementById("messages")

const msgTemplate = document.getElementById("message-template").innerHTML
const locationTemplate = document.getElementById("location-template").innerHTML
const membersTemplate = document.getElementById("members-template").innerHTML

const { nickname, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('msg', (message) => {
    console.log(message)
    const html = Mustache.render(msgTemplate, {
        nickname: message.nickname,
        message: message.msg,  //socket.emit is passing a function which has an object
        //createdAt: message.createdAt
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

socket.on('locationMessage', (locationFunction) => {
    //console.log(locationURL)
    console.log(locationFunction)
    const html = Mustache.render(locationTemplate, {
        nickname: locationFunction.nickname,
        locationURL: locationFunction.locationURL,
        createdAt: moment(locationFunction.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('roomInfo', ({ room, members }) => {
    // console.log(room)
    // console.log(members)
    const html = Mustache.render(membersTemplate, {
        room,
        members
    })
    document.getElementById('members-list-panel').innerHTML = html
})


$msgForm.addEventListener('submit', (e) => {
    e.preventDefault() //full page refresh

    $msgFormButton.setAttribute('disabled', 'disabled')

    const yourMessage = e.target.elements.msg.value

    socket.emit('sendMessage', yourMessage, (message) => {
       
        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()

        if(!message) {
            console.log("Message was not sent. Check your internet connection")
        }
        console.log(message)
    })
})

$shareLocationBtn.addEventListener('click', () => {
    
    $shareLocationBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        //console.log(position)
        socket.emit('shareLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, () => {
            $shareLocationBtn.removeAttribute('disabled')
            console.log('Location successful shared')
        })
    })
})

socket.emit('join', { nickname, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'  //redirecting the user to the join page i.e the root
    }
})