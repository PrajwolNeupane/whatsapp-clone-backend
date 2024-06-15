const socket = io();

socket.on('connect', () => {
    console.log(`Connected with server. Socket ID: ${socket.id}`);
});

let userName = prompt("Your Name");

socket.emit("join", { userName });

const messageInput = document.getElementById('message-input');
let typingTimeout;

messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit("send-message", { message, userName });
        }
        messageInput.value = '';
        e.preventDefault(); // Prevent the default newline behavior
    }
});

messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("typing-send", { userName, isTyping: false });
    }, 500);
    socket.emit("typing-send", { userName, isTyping: true });
});

var isFirstMessage = true;
var messageContainer = document.getElementById("message-container");

function showNotification(data) {
    // Check if the browser supports notifications and the user has granted permission
    if (Notification.permission === 'granted') {
        new Notification('New Message', {
            body: data
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('New Message', {
                    body: data
                });
            }
        });
    }
}

socket.on('receive-message', (data) => {
    if (isFirstMessage) {
        if (data.userName === userName) {
            messageContainer.innerHTML = `<p>You: ${data.message}</p>`;
        } else {
            messageContainer.innerHTML = `<p>${data.userName}: ${data.message}</p>`;
            showNotification(data.message);
        }
    } else {
        if (data.userName === userName) {
            messageContainer.innerHTML += `<p>You: ${data.message}</p>`;
        } else {
            messageContainer.innerHTML += `<p>${data.userName}: ${data.message}</p>`;
            showNotification(data.message);
        }
    }
    isFirstMessage = false;
});

socket.on('receive-typing', (data) => {
    var doc = document.getElementById("typing-box")
    if (data.isTyping && userName != data.userName) {
        doc.innerText = `${data.userName} is typing`
    } else {
        doc.innerText = ``
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // The tab has become active
    } else {
        // The tab has become inactive
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});