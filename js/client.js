

document.addEventListener('DOMContentLoaded', function () {
  const socket = io('http://localhost:8000');
  console.log('Attempting to connect to the server...');

  const form = document.getElementById('send-container');
  const messageInput = document.getElementById('messageInp');
  const messageContainer = document.querySelector('.container');
  const sendButton = document.querySelector('.btn');
  var audio=new Audio('ting_iphone.mp3');



 
  


 
  const append = (message, position) => {
    
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);


    const timestampElement = document.createElement('span');
    timestampElement.innerText = ` ${new Date().toLocaleTimeString()}`;
    timestampElement.style.fontSize = '12px';  
    timestampElement.style.color = 'black'; 
    messageElement.appendChild(timestampElement);





    
  
    
    if (position === 'left') {
      sendButton.addEventListener('click', () => {
        audio.play().catch(error => {
          console.error('Error playing audio:', error.message);
        });
      });
    }
  };
  

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
  });



  function reactToMessage(messageId, reaction) {
    const reactionData = {
      messageId: messageId,
      reaction: reaction,
    };

    socket.emit('react', reactionData);
  }



  const name1 = prompt('Enter the name to join');
  socket.emit('new-user', name1);

  socket.on('user-joined', (name1) => {
    console.log(`${name1} joined the chat`);
    append(`${name1} joined the chat`, 'right');
  });

  socket.on('receive', (data) => {
    console.log(`${data.name}: ${data.message}`);
    append(`${data.name}: ${data.message} `, 'left');
  });

  socket.on('left', (name) => {
    console.log(`${name} left the chat`);
    append(`${name} left the chat`, 'right');
  });



  socket.on('message-reaction', (reactionData) => {
    // Handle message reactions on the client side
    // Update the UI to display the reaction
    console.log(`${reactionData.reaction} reaction received for message ${reactionData.messageId}`);
  });
});




