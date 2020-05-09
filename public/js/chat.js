var socket = io();


//elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $messages = document.querySelector('#messages')


//templete
const $messageTemplete = document.querySelector('#message-templete').innerHTML
const $locationTemplete = document.querySelector("#location-templete").innerHTML
const $sidebarTemplete = document.querySelector("#sidebar-template").innerHTML


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //disable
    $messageFormButton.setAttribute('disabled','disabled');


    var string = document.querySelector('#msg').value;
    
    socket.emit('msgToServer',string,(mssg)=>{
        //enable
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = ' ';
        $messageFormInput.focus();

        console.log(mssg);
    });

})

//elements
const $location = document.querySelector("#Location")


    $location.addEventListener('click',()=>{
    if(!navigator.geolocation)
    return alert("Your Browser Doesnot Have This Feature");
    
        //disable
        $location.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((pos)=>{
            var location = {lati:pos.coords.latitude,long:pos.coords.longitude};
            socket.emit('location',location,(msg)=>{
                //enabled
                $location.removeAttribute('disabled')

                console.log("Location shared");
            });
    })
})

//important:the backend result to client
socket.on('locationMessage',(msg)=>{
    console.log(msg);
    const link = Mustache.render($locationTemplete,{url:msg.url,createdAt:moment(msg.CreatedAt).format("hh:mm:ss a"),username:msg.username})
    $messages.insertAdjacentHTML('beforeend',link)
})


socket.on('sendMsgToClient',(msg)=>{
    console.log(msg);
    const html = Mustache.render($messageTemplete,{msg:msg.text,createdAt:moment(msg.CreatedAt).format("hh:mm:ss a"),username:msg.username})
    $messages.insertAdjacentHTML('beforeend',html)
})


//options
const { username , room } = Qs.parse(location.search,{ ignoreQueryPrefix : true})

socket.emit('Join',{username,room},(error)=>{
if(error){
    alert(error);
    location.href='/'
}
})

socket.on('RoomData',({room,users})=>{
    console.log(room)
    console.log(users)
    const html = Mustache.render($sidebarTemplete,{
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html;
})