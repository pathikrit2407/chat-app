const users = []

// addUser
//add user with info->username,id,room
const addUser = ({id,username,room})=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error:"UserName and Room required"
        }
    }

    //to check if the user is present with same username  in the same room 
     const ExistingUser = users.find((user)=>{
        return room==user.room.trim().toLowerCase() && username==user.username.trim().toLowerCase()
    })

    if(!ExistingUser){
        const user ={id,username,room}
        users.push(user)
        return { user }
    }else {
        return {
            error:"Username is in use in this room"
        }
    }

}


//removeUser
//remove user using id 
const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return id ===user.id
    })

    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

//getUser
const getUser = (id)=>{
    const index = users.findIndex((user)=>{
        return id===user.id
    })
    if(index===-1){
        return
    }else{
        return users[index];
    }
}

//getUserInRoom
const getUserInRoom =(room)=>{
   const roomUser = users.filter((user)=>{
       return user.room === room.trim().toLowerCase()
   })

   return roomUser;
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}


addUser({
    username:"pathikrit",
    id:23,
    room:"N"
})
addUser({
    username:"pathik",
    id:1223,
    room:"N"
})
addUser({
    username:"pathit",
    id:2322,
    room:"N"
})

console.log(getUserInRoom('NITS'))

// let user = getUser(2322);
// console.log(user)
// console.log(users)