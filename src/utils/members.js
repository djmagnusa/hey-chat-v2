const members = []

const addMember = ({ id, room, nickname }) => {
    // nickname = nickname[0].toUpperCase()
    // room = room[0].toUpperCase()
    nickname = nickname.trim()
    room = room.trim()

    if (!room || !nickname) {
        return { 
            error: "Please provide nickname and room name"
        }
    }

    const memberAlready = members.find((member) => {
        if(member.nickname.toUpperCase() === nickname.toUpperCase() && member.room === room ) {  //if user already exists with the same name in the same room
            return true;  //toUpperCase to match the two strings irrespective of case sensitive
        }
    })

    if(memberAlready) {
        return {
            error: 'Member already exists'
        }
    }

     //When the user is ready to be stored

     const member = { id, room, nickname }
     members.push(member)
     return { member }
}

const kickMember = (id) => {
    const pos = members.findIndex((member) => {
        return member.id === id
    }) //-1 if no match, 0 or greater if match

    if(pos !== -1) {
        return members.splice(pos, 1)[0] //remving one item from the index pos
                                         // we remve 1 user and get back the array and then extract individual item which is the member object of the member which was removed
    }
}

const getMember = (id) => {
    const userDetail = members.find((member) => {
        return member.id === id  
    })

    return userDetail
}

const getAvailableMembers = (room) => {
   // room = room.trim().toLowerCase()
    const membersInRoom = members.filter((member) => {
        return member.room === room
    })

    return membersInRoom //an array
}




//testing code commented

// addMember({
//     id: 53,
//     room: 'Dx',
//     nickname: 'Pratush'
// })

// addMember({
//     id: 58,
//     room: 'Dx',
//     nickname: 'Matt'
// })

// addMember({
//     id: 51,
//     room: 'Dx',
//     nickname: 'Tyler'
// })



// // console.log(members)

// // const res = addMember({
// //     id: 42,
// //     room: 'Dx',
// //     nickname: 'pratush'
// // })

// // console.log(res)

// //const kickedMember = kickMember(53)

// // console.log(kickedMember)
// // console.log(members)

// const user = getMember(53)
// console.log(user)

// const membersList = getAvailableMembers('Dx')
// console.log(membersList)

module.exports = {
    addMember,
    kickMember,
    getMember,
    getAvailableMembers
}
