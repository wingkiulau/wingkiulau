emailjs.init('a09jTrmkkmn9Ht1r1');

let messageInterface = null;
let messageText = '';
let messageTitle = '';
let messageName = '';
export let isWritingMessage = false;
let savedMessageText = '';
let savedMessageTitle = '';
let savedMessageName = '';
let savedMessageDisplay = null;
let cursorTimer = null;
let sendWarningText = null;

export function createMailboxInterface(scene) {
  createLinkBoxes(scene);
  const paper = scene.add.rectangle(300, 300, 380, 380, 0xfffff0, 0).setInteractive({ cursor: 'pointer' });
  paper.on('pointerdown', () => openMessageInterface(scene));
  scene.interactiveObjects.push(paper);

  savedMessageDisplay = scene.add.text(130, 150, '', {
    fontSize: '14px',
    fill: '#333',
    wordWrap: { width: 340 }
  });

  // Initially hide the saved message display
  savedMessageDisplay.setVisible(false);

  const sendButtonBox = scene.add.rectangle(285, 554, 180, 47, 0x28a745, 1)
    .setOrigin(0.5)
    .setStrokeStyle(2, 0x28a745)       // 2px green outline
    .setFillStyle(0xffffff, 0)         // transparent fill
    .setInteractive({ cursor: 'pointer' });

  sendButtonBox.on('pointerdown', () => {
    if (savedMessageTitle.trim() && savedMessageName.trim() && savedMessageText.trim()) {
      sendMessageToEmail(savedMessageTitle, savedMessageName, savedMessageText);
      savedMessageText = '';
      savedMessageTitle = '';
      savedMessageName = '';
      if (savedMessageDisplay) savedMessageDisplay.setText('');
    } else {
      showSendWarning(scene, 'Please fill out title, name, and message before sending.');
    }
  });

  scene.interactiveObjects.push(sendButtonBox);
}
// Replace your handleKeyInput function with this:
export function handleKeyInput(event) {
  if (!isWritingMessage || !messageInterface) return;

  // Handle ESC key to close interface
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMessageInterface();
    return;
  }

  event.preventDefault();

  if (event.key === 'Backspace') {
    if (messageInterface.activeField === 'title') {
      messageTitle = messageTitle.slice(0, -1);
    } else if (messageInterface.activeField === 'name') {
      messageName = messageName.slice(0, -1);
    } else {
      messageText = messageText.slice(0, -1);
    }
  } else if (event.key === 'Tab') {
    const fields = ['title', 'name', 'message'];
    const current = fields.indexOf(messageInterface.activeField);
    messageInterface.activeField = fields[(current + 1) % fields.length];
  } else if (event.key === 'Enter') {
    // Enter now just saves and closes, doesn't send
    closeMessageInterface();
    return;
  } else if (event.key.length === 1) {
    if (messageInterface.activeField === 'title' && messageTitle.length < 50) {
      messageTitle += event.key;
    } else if (messageInterface.activeField === 'name' && messageName.length < 50) {
      messageName += event.key;
    } else if (messageInterface.activeField === 'message' && messageText.length < 200) {
      messageText += event.key;
    }
  }

  updateDisplay();
}

function openMessageInterface(scene) {
  if (isWritingMessage) return;
  isWritingMessage = true;
  messageText = '';
  messageTitle = '';
  messageName = '';

  const overlay = scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
  const box = scene.add.rectangle(400, 300, 500, 400, 0xffffff);

  // Create clickable input areas
  const titleInputArea = scene.add.rectangle(320, 180, 200, 25, 0xf0f0f0, 0.5)
    .setInteractive({ cursor: 'text' });
  const nameInputArea = scene.add.rectangle(320, 220, 200, 25, 0xf0f0f0, 0.5)
    .setInteractive({ cursor: 'text' });
  const messageInputArea = scene.add.rectangle(320, 320, 200, 80, 0xf0f0f0, 0.5)
    .setInteractive({ cursor: 'text' });

  const titleLabel = scene.add.text(160, 180, 'Title:', { fontSize: '16px', fill: '#333' });
  const titleInput = scene.add.text(220, 180, '', { fontSize: '16px', fill: '#000' });
  
  const nameLabel = scene.add.text(160, 220, 'Name:', { fontSize: '16px', fill: '#333' });
  const nameInput = scene.add.text(220, 220, '', { fontSize: '16px', fill: '#000' });

  const messageLabel = scene.add.text(160, 260, 'Message:', { fontSize: '16px', fill: '#333' });
  const messageDisplay = scene.add.text(220, 290, '', {
    fontSize: '14px',
    fill: '#333',
    wordWrap: { width: 260, useAdvancedWrap: true }
  });

  // Add SEND button inside the interface
  const sendButton = scene.add.rectangle(350, 420, 80, 30, 0x28a745)
    .setInteractive({ cursor: 'pointer' })
    .setStrokeStyle(2, 0x28a745);
  
  const sendButtonText = scene.add.text(350, 420, 'SEND', {
    fontSize: '14px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  // Add CLOSE button
  const closeButton = scene.add.rectangle(450, 420, 80, 30, 0x6c757d)
    .setInteractive({ cursor: 'pointer' })
    .setStrokeStyle(2, 0x6c757d);
  
  const closeButtonText = scene.add.text(450, 420, 'CLOSE', {
    fontSize: '14px',
    fill: '#fff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  const note = scene.add.text(400, 470,
    'Click fields to edit, TAB to switch, ESC or CLOSE to cancel',
    {
      fontSize: '12px',
      fill: '#666',
      align: 'center',
      wordWrap: { width: 400 }
    }
  ).setOrigin(0.5);

  // Button handlers
  sendButton.on('pointerdown', () => {
    const currentTitle = messageTitle.trim();
    const currentName = messageName.trim();
    const currentText = messageText.trim();
    
    if (currentTitle && currentName && currentText) {
      sendMessageToEmail(currentTitle, currentName, currentText);
      
      // Save the message for display
      savedMessageText = currentText;
      savedMessageTitle = currentTitle;
      savedMessageName = currentName;
      
      // Clear and close
      messageText = '';
      messageTitle = '';
      messageName = '';
      closeMessageInterface();
      
      // Show success 
      setTimeout(() => {
        showSendWarning(scene, 'Message sent successfully!');
      }, 100);
    } else {
      // Show error within interface
      const errorText = scene.add.text(400, 450, 'Please fill all fields!', {
        fontSize: '12px',
        fill: '#ff4444',
        backgroundColor: '#000000',
        padding: { x: 5, y: 2 }
      }).setOrigin(0.5);
      
      setTimeout(() => {
        if (errorText) errorText.destroy();
      }, 2000);
    }
  });

  closeButton.on('pointerdown', () => {
    closeMessageInterface();
  });

  // Add click handlers for field switching
  titleInputArea.on('pointerdown', () => {
    messageInterface.activeField = 'title';
    updateDisplay();
  });

  nameInputArea.on('pointerdown', () => {
    messageInterface.activeField = 'name';
    updateDisplay();
  });

  messageInputArea.on('pointerdown', () => {
    messageInterface.activeField = 'message';
    updateDisplay();
  });

  messageInterface = {
    overlay,
    box,
    titleInputArea,
    nameInputArea,
    messageInputArea,
    titleLabel,
    titleInput,
    nameLabel,
    nameInput,
    messageLabel,
    messageDisplay,
    sendButton,
    sendButtonText,
    closeButton,
    closeButtonText,
    note,
    activeField: 'title',
    showCursor: true,
  };

  updateDisplay();

  // Start blinking cursor
  cursorTimer = setInterval(() => {
    if (!messageInterface) return;
    messageInterface.showCursor = !messageInterface.showCursor;
    updateDisplay();
  }, 500);
}

function updateDisplay() {
  if (!messageInterface) return;
  const cursor = messageInterface.showCursor ? '|' : '';

  // Update input field backgrounds to show active field
  messageInterface.titleInputArea.setAlpha(messageInterface.activeField === 'title' ? 1 : 0.5);
  messageInterface.nameInputArea.setAlpha(messageInterface.activeField === 'name' ? 1 : 0.5);
  messageInterface.messageInputArea.setAlpha(messageInterface.activeField === 'message' ? 1 : 0.5);

  messageInterface.titleInput.setText(
    messageInterface.activeField === 'title' ? messageTitle + cursor : messageTitle
  );
  messageInterface.nameInput.setText(
    messageInterface.activeField === 'name' ? messageName + cursor : messageName
  );
  messageInterface.messageDisplay.setText(
    messageInterface.activeField === 'message' ? messageText + cursor : messageText
  );
}

window.addEventListener('keydown', handleKeyInput);

export function closeMessageInterface() {
  if (!messageInterface) return;

  Object.values(messageInterface).forEach(obj => {
    if (obj && obj.destroy) obj.destroy();
  });
  messageInterface = null;

  clearInterval(cursorTimer);

  savedMessageText = messageText.trim();
  savedMessageTitle = messageTitle.trim();
  savedMessageName = messageName.trim();

  messageText = '';
  messageTitle = '';
  messageName = '';
  isWritingMessage = false;

  // Display the complete saved message in the white rectangle
  if (savedMessageDisplay && (savedMessageTitle || savedMessageName || savedMessageText)) {
    let displayText = '';
    if (savedMessageTitle) displayText += `Title: ${savedMessageTitle}\n\n`;
    if (savedMessageName) displayText += `From: ${savedMessageName}\n\n`;
    if (savedMessageText) displayText += `Message:\n${savedMessageText}`;
    
    savedMessageDisplay.setText(displayText);
    savedMessageDisplay.setVisible(true); // Show the message when saved
  }
}

// Add function to show saved message (call when entering mailbox scene)
export function showSavedMessage() {
  if (savedMessageDisplay && (savedMessageTitle || savedMessageName || savedMessageText)) {
    savedMessageDisplay.setVisible(true);
  }
}

// Add function to hide saved message (call when leaving mailbox scene)
export function hideSavedMessage() {
  if (savedMessageDisplay) {
    savedMessageDisplay.setVisible(false);
  }
}

function sendMessageToEmail(title, name, message) {
  const serviceID = 'service_9laevzi';
  const templateID = 'template_f7mgqqk';

  const templateParams = {
    title,
    name,
    message,
  };

  emailjs.send(serviceID, templateID, templateParams)
    .then(response => {
      console.log('✅ Message sent!', response.status, response.text);
    })
    .catch(err => {
      console.error('❌ Failed to send message:', err);
    });
}

function createLinkBoxes(scene) {
  const linkBoxesData = [
    { x: 670, y: 132, width: 172, height: 98, color: 0x0077ff, url: 'https://wingkiulau.github.io/wingkiulau/', label: 'Portfolio Website' },
    { x: 702, y: 322, width: 172, height: 100, color: 0xff7700, url: 'https://www.linkedin.com/in/wingkiulau/', label: 'LinkedIn' },
    { x: 700, y: 505, width: 175, height: 100, color: 0x00aa00, url: 'https://github.com/wingkiulau', label: 'Github' },
  ];

  linkBoxesData.forEach(box => {
    const rect = scene.add.rectangle(box.x, box.y, box.width, box.height, box.color, 1)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ cursor: 'pointer' })
      .setAlpha(0.01); // Modify to change opacity

    rect.on('pointerdown', () => {
      window.open(box.url, '_blank');
    });

    scene.interactiveObjects.push(rect);
  });
}

function showSendWarning(scene, message) {
  // If warning is already showing, reset timer
  if (sendWarningText) {
    sendWarningText.destroy();
    sendWarningText = null;
  }

  sendWarningText = scene.add.text(400, 570, message, {
    fontSize: '16px',
    fill: '#ff4444',
    backgroundColor: '#000000',
    padding: { x: 10, y: 5 },
    align: 'center',
  }).setOrigin(0.5);

  // Remove after 3 seconds
  setTimeout(() => {
    if (sendWarningText) {
      sendWarningText.destroy();
      sendWarningText = null;
    }
  }, 3000);
}
