const users = []

function joinUser(id, username, room){
    const user = {id , username, room}
    users.push(user)
    console.log("user ", user)
    return user
}

function getCurrentUser(id){
    return users.find((user) => user.id === id)
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id)
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

function getRoomUsers(room){
    return users.filter(user => user.room === room)
}
module.exports = {joinUser, getCurrentUser, userLeave, getRoomUsers}