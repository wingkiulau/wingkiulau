// library.js

export function createLibraryBooks(scene) {
  const bookCategories = [
    { name: '🗣️ Lexicon', x: 136, y: 290, width: 45, height: 108 },
    { name: '💻 Codecraft', x: 350, y: 287, width: 74, height: 110 },
    { name: 'TechTome', x: 194, y: 470, width: 227, height: 28 },
    { name: '👩‍💻 Everyday', x: 660, y: 186, width: 131, height: 32 },
    { name: '🧠 Field Notes', x: 324, y: 185, width: 166, height: 32 }
  ];

  bookCategories.forEach(book => {
    const bookHitArea = scene.add.rectangle(book.x, book.y, book.width, book.height);
    bookHitArea.setOrigin(0.5);
    bookHitArea.setStrokeStyle(4, 0xffffff, 0); // white outline + opacity
    bookHitArea.setInteractive({ cursor: 'pointer' });

    bookHitArea.on('pointerdown', () => {
      showBookCategory(scene, book.name);
    });

    scene.interactiveObjects.push(bookHitArea);
  });
}

function showBookCategory(scene, category) {
  const categoryInfo = {
    '🗣️ Lexicon': 'English (Native), Mandarin (Intermediate), Cantonese (Advanced)',
    '💻 Codecraft': 'Python (NumPy, Pandas, scikit-learn), Java, TypeScript/JavaScript, C, C#, SQL, HTML/CSS',
    'TechTome':
      '🔧 Backend & Infrastructure:\n' +
      'FastAPI, PostgreSQL, Docker, OAuth 2.0, REST APIs\n\n' +
      '🤖 AI & Data:\n' +
      'LangChain, OpenAI API, ML modeling, data engineering, feature engineering, model evaluation\n\n' +
      '🛠️ Tools & Methods:\n' +
      'Git, Agile/Scrum, Test Automation, Concurrency, ArcGIS, Streamlit, Tableau, Prisma, Next.js',
    '👩‍💻 Everyday': 'Microsoft Office Suite, Google Workspace, Slack, Notion, Atlassian Confluence',
    '🧠 Field Notes': 
      'A log of current thoughts...\n\n' +
      'Your alarm sound is technically your theme song, since it plays at the start of every episode.\n\n'
  };

  // Destroy previous
  if (scene.currentInfoBox) scene.currentInfoBox.destroy();
  if (scene.currentInfoText) scene.currentInfoText.destroy();

  const content = `${category}: \n\n${categoryInfo[category]}`;

  // Create text first
  const infoText = scene.add.text(0, 0, content, {
    fontSize: '16px',
    color: '#000000',
    align: 'left',
    wordWrap: { width: 400 }
  });
  infoText.setOrigin(0.5);

  // Measure text and set box size with padding
  const padding = 20;
  const textBounds = infoText.getBounds();
  const boxWidth = textBounds.width + padding * 2;
  const boxHeight = textBounds.height + padding * 2;

  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;

  // Create background box after knowing text size
  const infoBox = scene.add.rectangle(centerX, centerY, boxWidth, boxHeight, 0xffffff);
  infoBox.setOrigin(0.5);
  infoBox.setDepth(10);
  infoText.setPosition(centerX, centerY);
  infoText.setDepth(11);

  scene.currentInfoBox = infoBox;
  scene.currentInfoText = infoText;

  // Only set close listener once
  if (!scene._hasPopupCloseListener) {
    scene.input.on('pointerdown', (pointer, gameObjects) => {
      const isClickOnBook = gameObjects.some(obj => scene.interactiveObjects.includes(obj));
      if (isClickOnBook) return;

      if (scene.currentInfoBox && !scene.currentInfoBox.getBounds().contains(pointer.x, pointer.y)) {
        scene.currentInfoBox.destroy();
        scene.currentInfoText.destroy();
        scene.currentInfoBox = null;
        scene.currentInfoText = null;
      }
    });
    scene._hasPopupCloseListener = true;
  }
}
