(function () {
  const FRONT_END_URL = 'http://localhost:3000';
  let agentId = null;

  const currentScript = document.currentScript;
  if (currentScript) {
    agentId = currentScript.getAttribute('data-agent-id');
  }

  if (!agentId) {
    const params = new URLSearchParams(window.location.search);
    agentId = params.get('id');
  }

  if (!agentId) {
    console.error('❌ Agent ID not found.');
    return;
  }

  const isMobile = () => window.innerWidth <= 500;
  const bubbleSize = isMobile() ? 70 : 70;

  // Create Chat Bubble Icon
  const bubbleIcon = document.createElement('iframe');
  bubbleIcon.src = `${FRONT_END_URL}/v1/bubble`;
  bubbleIcon.width = bubbleSize;
  bubbleIcon.height = bubbleSize;
  bubbleIcon.style.position = 'fixed';
  bubbleIcon.style.bottom = '20px';
  bubbleIcon.style.right = '20px';
  bubbleIcon.style.border = 'none';
  bubbleIcon.style.borderRadius = '50%';
  bubbleIcon.style.zIndex = '9999';
  bubbleIcon.style.overflow = 'hidden';
  document.body.appendChild(bubbleIcon);

  // Create Chat Window
  const chatWindow = document.createElement('iframe');
  chatWindow.src = `${FRONT_END_URL}/v1/bubble-window/${agentId}`;
  chatWindow.style.border = 'none';
  chatWindow.style.position = 'fixed';
  chatWindow.style.zIndex = '9999';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.opacity = '0';
  chatWindow.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

  if (isMobile()) {
    // Mobile: full screen
    chatWindow.style.top = '0';
    chatWindow.style.left = '0';
    chatWindow.style.width = '100%';
    chatWindow.style.height = '100%';
    chatWindow.style.transform = 'translateY(100vh)';
  } else {
    // Desktop: floating above bubble
    chatWindow.style.width = '200px';
    chatWindow.style.height = '300px';
    chatWindow.style.right = '50px';
    chatWindow.style.bottom = `${bubbleSize + 35}px`;
    chatWindow.style.borderRadius = '12px';
    chatWindow.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
    chatWindow.style.transform = 'translateY(20px)';
  }

  document.body.appendChild(chatWindow);

  // Message listener for open/close
  window.addEventListener('message', event => {
    if (event.data.message === 'openChat') {
      chatWindow.style.opacity = '1';
      chatWindow.style.transform = 'translateY(0)';
    } else if (event.data.message === 'closeChat') {
      chatWindow.style.opacity = '0';
      if (isMobile()) {
        chatWindow.style.transform = 'translateY(100vh)';
      } else {
        chatWindow.style.transform = 'translateY(20px)';
      }
    }
  });

  // Click bubble to open
  bubbleIcon.addEventListener('click', () => {
    window.postMessage({ message: 'openChat' }, '*');
  });
})();
