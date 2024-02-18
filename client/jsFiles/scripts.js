document.addEventListener("DOMContentLoaded", function () {
    var loadingPage = document.querySelector('.loading-page');
    var loadingLogo = document.querySelector('.loading-logo');
  
    // Simulate a delay (you can replace this with your actual loading logic)
    setTimeout(function () {
        // Add the "loaded" class to trigger the zoom and fade animation
        loadingLogo.classList.add('loaded');
  
        // Fade out the loading page and its background
        loadingPage.style.transition = 'opacity 0.5s ease';
        loadingPage.style.opacity = '0';
  
        // Remove the loading page from the DOM after the animation is complete
        setTimeout(function () {
            loadingPage.style.display = 'none';
        }, 500); // Adjust the duration of the fade-out transition
    }, 400); // Adjust the simulated delay time
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    // ... your existing code ...
  
    // Add this function to open the chatbox
    function openChatbox(friendName) {
        document.getElementById("selectedFriendName").textContent = friendName;
        document.querySelector('.chatbox-container').style.display = 'block';
    }
  
    // Add this function to close the chatbox
    function closeChatbox() {
        document.querySelector('.chatbox-container').style.display = 'none';
    }
  
    // Add this function to send a message (you can customize this part)
    function sendMessage() {
        var chatInput = document.getElementById('chatInput').value;
        // Logic to send the message, e.g., append it to the chatbox-content
        // This is just a basic example, you might want to use a proper chat library
        var chatContent = document.querySelector('.chatbox-content');
        var messageElement = document.createElement('div');
        messageElement.textContent = chatInput;
        chatContent.appendChild(messageElement);
        // Clear the input field
        document.getElementById('chatInput').value = '';
    }
  });
  
  
    // Function to close the chatbox
    window.closeChatbox = function () {
        var chatbox = document.getElementById('chatbox');
        chatbox.style.display = 'none';
    };
  
    // Function to send a message
    window.sendMessage = function () {
        var chatInput = document.getElementById('chatInput');
        var chatboxContent = document.querySelector('.chatbox-content');
  
        // Get the message from the input
        var message = chatInput.value.trim();
  
        if (message !== '') {
            // Create a new message element
            var messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.textContent = message;
  
            // Append the message to the chatbox content
            chatboxContent.appendChild(messageElement);
  
            // Clear the input
            chatInput.value = '';
        }
    };
  
  var loadFile = function (event) {
      var image = document.getElementById("output");
      image.src = URL.createObjectURL(event.target.files[0]);
  };