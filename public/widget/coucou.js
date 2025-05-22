(function () {
  const root = document.createElement('div');
  root.id = 'coucou-chat-root';
  Object.assign(root.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
  });

  const launcher = document.createElement('iframe');
  launcher.src = '../../app/chat/iframe/bubble';
  launcher.style.width = '60px';
  launcher.style.height = '60px';
  launcher.style.border = 'none';
  launcher.style.borderRadius = '50%';

  const full = document.createElement('iframe');
  full.src = '../../app/chat/iframe/fullchat';
  Object.assign(full.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'none',
    border: 'none',
    zIndex: '10000',
  });

  document.body.appendChild(root);
  root.appendChild(launcher);
  document.body.appendChild(full);

  window.addEventListener('message', event => {
    if (event.data === 'open-chat') {
      full.style.display = 'block';
    }
    if (event.data === 'close-chat') {
      full.style.display = 'none';
    }
  });
})();
