// school.js

export function createSchoolInterface(scene, backgroundSprite) {
  const bookHitArea = scene.add.rectangle(415, 324, 255, 240);
  bookHitArea.setOrigin(0.5);
  bookHitArea.setStrokeStyle(3, 0xffffff, 0); // optional outline
  bookHitArea.setInteractive({ cursor: 'pointer' });

  bookHitArea.on('pointerdown', () => {
    backgroundSprite.setTexture('school_bg_open'); // flip to open book
    bookHitArea.destroy(); // remove book cover hitbox
    
    // Now enable education and experience zones
    createBookPages(scene);
  });

  scene.interactiveObjects.push(bookHitArea);
}

function createBookPages(scene) {
  const pages = [
    {
      name: 'Education',
      x: 190,
      y: 316,
      width: 225,
      height: 236,
      rotation: -6.22,
      entries: [
        {
          date: '2022-2026',
          description: 'Bachelor of Arts in Computer Science & History from Bowdoin College'
        }
      ]
    },
    {
      name: 'Experience',
      x: 420,
      y: 320,
      width: 220,
      height: 240,
      rotation: -6.28,
      entries: [
        {
          date: 'Summer 2025',
          description: 'DevOps Engineer Intern, Oak AI (Innovate for Maine Fellowship)'
        },
        {
          date: '2024-Present',
          description: 'Writing Assistant, Bowdoin College'
        },
        {
          date: 'Spring 2024/Fall 2025',
          description: 'Intro to Computer Science Learning Assistant, Bowdoin College'
        },
        {
          date: '2022-Present',
          description: 'Public Services Assistant, Bowdoin Hawthorne-Longfellow Library'
        },
        {
          date: '2021',
          description: 'Intern, Caprikon Education (EdTech Startup)'
        },
        {
          date: '2019',
          description: 'Intern, Liker Land (FinTech Startup)'
        }
      ]
    }
  ];

  pages.forEach((page, index) => {
    const pageZone = scene.add.rectangle(page.x, page.y, page.width, page.height);
    pageZone.setOrigin(0.5);
    pageZone.setRotation(page.rotation);
    pageZone.setStrokeStyle(2, 0xffffff, 0);
    pageZone.setInteractive({ cursor: 'pointer' });

    pageZone.on('pointerdown', () => {
      showPagePopup(scene, page.name, page.entries);
    });

    scene.interactiveObjects.push(pageZone);
  });
}

function showPagePopup(scene, title, entries) {
  // Destroy existing popups
  destroyExistingPopup(scene);

  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;
  
  // Create container to hold all text objects
  scene.currentPopupElements = [];
  
  // Create title
  const titleText = scene.add.text(centerX, centerY - 180, `${title}:`, {
    fontSize: '20px',
    color: '#000000',
    fontStyle: 'bold',
    align: 'center'
  }).setOrigin(0.5).setDepth(11);
  
  scene.currentPopupElements.push(titleText);
  
  // Calculate total height needed
  let currentY = centerY - 150;
  const lineHeight = 25;
  const entrySpacing = 25;
  
  // Create text objects for each entry
  entries.forEach((entry, index) => {
    // Bold date text
    const dateText = scene.add.text(centerX, currentY, entry.date, {
      fontSize: '16px',
      color: '#000066', // Dark blue for dates
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5).setDepth(11);
    
    scene.currentPopupElements.push(dateText);
    currentY += lineHeight;
    
    // Regular description text
    const descText = scene.add.text(centerX, currentY, entry.description, {
      fontSize: '14px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5).setDepth(11);
    
    scene.currentPopupElements.push(descText);
    
    // Move to next entry position
    const descHeight = descText.getBounds().height;
    currentY += descHeight + entrySpacing;
  });
  
  // Calculate total bounds for background box
  const topY = titleText.getBounds().top;
  const bottomY = Math.max(...scene.currentPopupElements.map(el => el.getBounds().bottom));
  const totalHeight = bottomY - topY + 40; // Add padding
  const totalWidth = 400;
  
  // Create background box
  const infoBox = scene.add.rectangle(centerX, (topY + bottomY) / 2, totalWidth, totalHeight, 0xffffff)
    .setOrigin(0.5)
    .setDepth(10)
    .setStrokeStyle(2, 0x000000, 1);
  
  scene.currentPopupElements.push(infoBox);

  // Set up click-to-close functionality
  if (!scene._hasPopupCloseListener) {
    scene.input.on('pointerdown', (pointer, gameObjects) => {
      const isClickInside = gameObjects.some(obj => scene.interactiveObjects.includes(obj));
      if (isClickInside) return;

      // Check if click is outside popup area
      const bounds = infoBox.getBounds();
      if (!bounds.contains(pointer.x, pointer.y)) {
        destroyExistingPopup(scene);
      }
    });
    scene._hasPopupCloseListener = true;
  }
}

function destroyExistingPopup(scene) {
  if (scene.currentPopupElements) {
    scene.currentPopupElements.forEach(element => {
      if (element && element.destroy) {
        element.destroy();
      }
    });
    scene.currentPopupElements = [];
  }
  
  // Legacy cleanup for old popup system
  if (scene.currentInfoBox) {
    scene.currentInfoBox.destroy();
    scene.currentInfoBox = null;
  }
  if (scene.currentInfoText) {
    scene.currentInfoText.destroy();
    scene.currentInfoText = null;
  }
}