
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const chatFile = document.querySelector('.input-file')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const socket = io();

socket.emit('joinRoom', { username: 'User', room: 'Users' })

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

function outputMessage(message) {
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.user} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `
    document.querySelector('.chat-messages').appendChild(div);

    if (message.image) {
        div.innerHTML = `
            <p class="meta">${message.user} <span>${message.time}</span></p>
            <p class="text">${message.text}</p>
            <img class="image" src="${message.image}">
        `
        document.querySelector('.chat-messages').appendChild(div);
    }
}

const outputRoomName = (room) => {
    roomName.innerText = room;
}

const outputUsers = (users) => {
    console.log(users)
    userList.innerHTML = `
    ${users.map(user => `
        <div class="list__one-user">
            <img class="avatar-img" src="${`https://ui-avatars.com/api/?name=${user.username}&background=random`}">
            <div class="list__one-user__name">${user.username}</div>
        </div>
    `).join('')}`;
}

const handleUpload = async (event) => {
    event.preventDefault();
    try {

        const message = event.target.elements.msg.value;
        const uploadFile = event.target.elements.file.files[0];

        if (message == '' && uploadFile == null) {
            return
        }

        console.log(event)
        console.log(uploadFile)

        if (uploadFile) {
            const toDataURL = (uploadFile) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(uploadFile);
            });

            const dataUrl = await toDataURL(uploadFile);
            socket.emit('chatMessage', {message, dataUrl})
            console.log('PAYLOAD 1 >>> ', dataUrl);

            event.target.elements.msg.value = '';
            event.target.elements.file.value = '';
            return
        }

        console.log('PAYLOAD 2 >>> ', message);
        const msg = {
            message
        }
        
        socket.emit('chatMessage', msg)

        event.target.elements.msg.value = '';
        event.target.elements.file.value = '';
        event.target.elements.msg.focus();

    } catch (e) {
      console.log(e);
    }
  };

  chatForm.addEventListener('submit', (e) => handleUpload(e))