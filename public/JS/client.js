const socket=io();

var username;
var chats=document.querySelector(".chats");
var users_list=document.querySelector(".user-list");
var users_count=document.querySelector(".users-count");
var msg_send=document.querySelector("#user-send");
var user_msg=document.querySelector("#user-msg");
var audio=new Audio('Audio/ting_received.mp3');
var audio1=new Audio('Audio/ting_sent.mp3');

do{
    username=prompt("Enter your name: ");
}while(!username);

socket.emit("new-user-joined",username);
socket.on('user-connected',(socket_name)=>{
    userJoinLeft(socket_name,'joined');
});

function userJoinLeft(name, status)
{
    let div=document.createElement("div");
    div.classList.add('user-join');
    let content=`<p><b>${name}</b> ${status} the chat </p>`;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
});

socket.on('user-list',(users)=>{
    users_list.innerHTML="";
    users_arr=Object.values(users);
    for(i=0; i<users_arr.length; i++){
        let p=document.createElement('p');
        p.innerText=users_arr[i];
        users_list.appendChild(p);
        
    }
    users_count.innerHTML=users_arr.length;
});

msg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg: user_msg.value
    };
    if(user_msg.value!=''){
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        audio1.play();
        user_msg.value='';
    }
});

function appendMessage(data,status){
    let div=document.createElement('div');
    div.classList.add('message',status);
    let content=`
      <h5>${data.user}</h5>
      <p>${data.msg}</p>
    `;
    let content1=`
      <h5>You</h5>
      <p>${data.msg}</p>
    `;
    if(status=='outgoing'){
        div.innerHTML=content1;
    }
    else{
        div.innerHTML=content;
    }
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight; 
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
    audio.play();
});
// const form=document.getElementById('send-container');
// const messageInput=document.getElementById('messageInp')
// const messageContainer=documnet.querySelector(".container")

// const mess=prompt("Enter your name to join");
// socket.emit('new-user-joined',mess);