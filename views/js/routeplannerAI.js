document.getElementById('chatbot-icon').addEventListener('click', function() {
  $('#chatbot-modal').modal('show');
  getAnswer("", 1).then(botResponse => {
    addMultiLineMessage(botResponse, 'bot');
  }).catch(error => {
    console.error('Hata:', error);
  });
});

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  var userInput = document.getElementById('user-input').value;
  if (userInput.trim() !== '') {
    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';
    
    // Show typing indicator
    addTypingIndicator();

    getAnswer(userInput, 0).then(botResponse => {
      removeTypingIndicator();
      addMultiLineMessage(botResponse, 'bot');
    }).catch(error => {
      removeTypingIndicator();
      console.error('Hata:', error);
    });
  }
}

function addMessage(message, sender) {
  var chatBox = document.getElementById('chat-box');
  var messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender);
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addMultiLineMessage(message, sender) {
  var chatBox = document.getElementById('chat-box');
  
  // Create a single div element for the entire message
  var messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', sender);

  // Process the message to apply formatting
  message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Kalın yazı
  message = message.replace(/\*/g, '-');

  // Set innerHTML of the single element
  messageElement.innerHTML = message.trim().replace(/\n/g, '<br>'); // Replace newline with <br> for line breaks

  chatBox.appendChild(messageElement); // Append the single element to the chat box

  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom of the chat box
}

function addTypingIndicator() {
  var chatBox = document.getElementById('chat-box');
  var typingIndicator = document.createElement('div');
  typingIndicator.classList.add('chat-message', 'bot', 'typing-indicator');
  typingIndicator.id = 'typing-indicator';
  chatBox.appendChild(typingIndicator);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  var typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function getAnswer(question, flag) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', `/get_AI_Data?userQuestion=${question}&isFirst=${flag}`);
    request.onload = () => {
      if (request.status === 200) {
        const responseData = JSON.parse(request.responseText);
        resolve(responseData); // İşlem tamamlandığında Promise'i çöz
      } else {
        reject(`İstek başarısız. Hata kodu: ${request.status}`);
      }
    };
    request.onerror = () => {
      reject('Ağ hatası: İstek gönderilemedi');
    };
    request.send();
  });
}
