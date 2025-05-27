(function () {
  // Try to get agent ID from data attribute on the script tag
  const FRONT_END_URL = 'http://localhost:3000';
  let agentId = null;
  const currentScript = document.currentScript;
  if (currentScript) {
    console.log('i got it from the script tag');
    agentId = currentScript.getAttribute('data-agent-id');
  }

  // Fallback: if no data attribute, try to get it from URL query parameter
  if (!agentId) {
    console.log('i got it from the URL');
    const params = new URLSearchParams(window.location.search);
    agentId = params.get('id');
  }

  // Final fallback: handle missing ID
  if (!agentId) {
    console.error('❌ Agent ID not found. Please provide it in the script tag or URL.');
    return;
  }

  console.log('✅ Using Agent ID:', agentId);

  // Create the chat bubble icon
  const bubbleIcon = document.createElement('iframe');
  bubbleIcon.src = `http://localhost:3000/v1/bubble`;
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
  chatWindow.src = `${FRONT_END_URL}/v1/bubble-window/${agentId}`;
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
  chatWindow.style.transform = 'translateY(100vh)';
  document.body.appendChild(chatWindow);

  // Listen for postMessages
  window.addEventListener('message', event => {
    if (event.data.message === 'openChat') {
      chatWindow.style.opacity = '1';
      chatWindow.style.transform = 'translateY(0)';
    } else if (event.data.message === 'closeChat') {
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(100vh)';
    }
  });

  // Bubble click opens chat
  bubbleIcon.addEventListener('click', () => {
    window.postMessage({ message: 'openChat' }, '*');
  });
})();
