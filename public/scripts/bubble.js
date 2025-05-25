(function () {
  const params = new URLSearchParams(window.location.search);
  const agentId = params.get('id');

  console.log('Agent ID:', agentId);

  // Create the chat bubble icon
  const bubbleIcon = document.createElement('iframe');
  bubbleIcon.src = './v1/bubble'; // Replace with the correct path to your chat bubble iframe
  bubbleIcon.width = '70';
  bubbleIcon.height = '70';
  bubbleIcon.style.border = 'none';
  bubbleIcon.style.position = 'fixed';
  bubbleIcon.style.bottom = '20px';
  bubbleIcon.style.right = '20px';
  bubbleIcon.style.borderRadius = '50%';
  bubbleIcon.style.zIndex = '9999';
  bubbleIcon.style.overflow = 'hidden';
  document.body.appendChild(bubbleIcon);

  // Create the chat window iframe (initially hidden)
  const chatWindow = document.createElement('iframe');
  chatWindow.src = `./v1/bubble-window/${agentId}`; // Replace with the correct path to your chat window iframe
  chatWindow.width = '100%';
  chatWindow.height = '100%';
  chatWindow.style.border = 'none';
  chatWindow.style.position = 'fixed';
  chatWindow.style.top = '0px';
  chatWindow.style.left = '0px';
  chatWindow.style.backgroundColor = 'black';
  chatWindow.style.zIndex = '9999';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.opacity = '0';
  chatWindow.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  chatWindow.style.transform = 'translateY(100vh)'; // Off-screen initially
  document.body.appendChild(chatWindow);

  // Listen for the postMessage from the parent or other iframes
  window.addEventListener('message', event => {
    // Check if the message is coming from a trusted source (optional, add your domain)

    // Open or close the chat based on the message
    if (event.data.message === 'openChat') {
      chatWindow.style.opacity = '1'; // Make the chat window visible
      chatWindow.style.transform = 'translateY(0)'; // Slide the chat window in
      console.log('trying to open chat ');
    } else if (event.data.message === 'closeChat') {
      chatWindow.style.opacity = '0'; // Make the chat window invisible
      chatWindow.style.transform = 'translateY(100vh)'; // Slide the chat window out
      console.log('trying to close it ');
    }
  });

  // Send a message when the bubble icon is clicked
  bubbleIcon.addEventListener('click', () => {
    window.postMessage({ message: 'openChat' }, '*'); // Open the chat
    console.log('bawni gali hadi makanch , es ce que sah ? ');
  });
})();
