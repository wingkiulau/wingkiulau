export function createWizardInterface(scene) {
  // Speech bubble on entry
  const bubble = scene.add.graphics();
  const text = scene.add.text(600, 140, 'Hmm, that glowing magical orb sure looks like it’s hiding some secrets… curious to click on it?', {
    fontFamily: 'serif',
    fontSize: '20px',
    color: '#000',
    align: 'center',
    wordWrap: { width: 250 }
  }).setOrigin(0.5);

  bubble.fillStyle(0xffffff, 1);
  bubble.fillRoundedRect(475, 90, 250, 100, 20);
  bubble.beginPath();
  bubble.moveTo(455, 120);
  bubble.lineTo(475, 110);
  bubble.lineTo(475, 130);
  bubble.closePath();
  bubble.fillPath();

  scene.interactiveObjects.push(bubble, text);

  scene.time.delayedCall(3000, () => {
    if (bubble && !bubble.destroyed) bubble.destroy();
    if (text && !text.destroyed) text.destroy();
  });

  // Magical orb with pulsing and glow
  const orb = scene.add.circle(570, 335, 95, 0x8888ff, 0.7);
  orb.setInteractive({ cursor: 'pointer' });

  const orbPulseTween = scene.tweens.add({
    targets: orb,
    scaleX: 1.1,
    scaleY: 1.1,
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  const glow = scene.add.circle(570, 335, 105, 0x8888ff, 0.3);
  scene.tweens.add({
    targets: glow,
    alpha: 0.1,
    duration: 1500,
    yoyo: true,
    repeat: -1,
    ease: 'Power2'
  });

  scene.interactiveObjects.push(orb, glow);

  // ✅ SAFE BIND: Wait until popup exists in DOM
  const waitForPopup = setInterval(() => {
    const chatPopup = document.getElementById('game-chat-popup');
    if (chatPopup && window.openChatPopup) {
      clearInterval(waitForPopup);
      orb.on('pointerdown', () => {
        window.openChatPopup();
        orbPulseTween.restart();
      });
    }
  }, 100);

  // ESC key handling — only set once
  if (!scene._hasEscapeListener) {
    scene.input.keyboard.on('keydown-ESC', () => {
      if (window.closeChatPopup) {
        window.closeChatPopup();
        return;
      }
      if (scene.currentInfoBox) {
        scene.currentInfoBox.destroy();
        scene.currentInfoText.destroy();
        scene.currentInfoBox = null;
        scene.currentInfoText = null;
        return;
      }
      scene.scene.stop();
    });

    scene._hasEscapeListener = true;
  }
}
