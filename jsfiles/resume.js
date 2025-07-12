// resume.js
export function createResumeDownload(scene) {
  // Create a parchment rectangle with interactive pointer cursor
  const parchment = scene.add.rectangle(390, 490, 500, 90, 0xf4e4bc, 0).setInteractive({ cursor: 'pointer' });

  // On click, trigger resume download
  parchment.on('pointerdown', downloadResume);

  // Add this interactive object to the scene's interactiveObjects list for cleanup
  scene.interactiveObjects.push(parchment);
}

function downloadResume() {
  const link = document.createElement('a');
  link.href = 'assets/files/WingKiuLau_Resume.pdf';
  link.download = 'WingKiuLau_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
