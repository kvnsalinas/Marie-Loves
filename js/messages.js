const viewMessagesBtn = document.getElementById('view-messages');
const messagesSection = document.getElementById('messages-section');
const sendMessageBtn = document.getElementById('send-message');
const messageTitle = document.getElementById('message-title');
const messageContent = document.getElementById('message-content');
const messagesList = document.getElementById('messages-list');
const tabButtons = document.querySelectorAll('.tab-btn');
const kevinMessageForm = document.getElementById('kevin-message-form');

let currentFilter = 'all';

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-author');
        loadMessages();
    });
});

function isKevin() {
    return localStorage.getItem('isKevin') === 'true';
}

function checkUserAndShowForm() {
    if (isKevin()) {
        kevinMessageForm.style.display = 'block';
    } else {
        kevinMessageForm.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', checkUserAndShowForm);

sendMessageBtn?.addEventListener('click', () => {
    const title = messageTitle.value.trim();
    const content = messageContent.value.trim();
    if (!title || !content) {
        alert('Please enter both a title and message content.');
        return;
    }
    const message = {
        from: "Kevin",
        to: "Marie",
        title: title,
        content: content,
        date: new Date().toISOString().split('T')[0],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
    };
    db.collection('messages').add(message)
        .then(() => {
            messageTitle.value = '';
            messageContent.value = '';
            alert('Message sent to Marie! ❤️');
            loadMessages();
        })
        .catch(error => {
            alert('Error sending message: ' + error.message);
        });
});

function loadMessages() {
    let query = db.collection('messages').orderBy('timestamp', 'desc');
    if (currentFilter === 'unread') {
        query = query.where('read', '==', false);
    } else if (currentFilter === 'read') {
        query = query.where('read', '==', true);
    }
    query.get()
        .then(querySnapshot => {
            messagesList.innerHTML = '';
            if (querySnapshot.empty) {
                messagesList.innerHTML = '<p class="no-messages">No messages yet. Kevin will send you sweet notes here!</p>';
                return;
            }
            querySnapshot.forEach(doc => {
                const message = doc.data();
                const messageCard = document.createElement('div');
                messageCard.className = `message-card ${message.read ? 'read' : 'unread'}`;
                messageCard.dataset.id = doc.id;
                messageCard.textContent = `${message.title} - ${message.date}`;
                messagesList.appendChild(messageCard);
            });
        })
        .catch(() => {
            messagesList.innerHTML = '<p class="error">Error loading messages. Please try again later.</p>';
        });
}
document.addEventListener('DOMContentLoaded', loadMessages);