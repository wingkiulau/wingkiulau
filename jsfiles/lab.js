// lab.js
export function createLabInterface(scene, backgroundSprite) {
  const labZones = [
    {
      name: ‘Meeting Intelligence App’,
      x: 75,
      y: 245,
      width: 120,
      height: 120,
      rotation: 0.03,
      description: ‘Full-stack AI meeting summarization tool. Generates structured summaries, per-person action items, and risk flags from raw notes. Built with Next.js, PostgreSQL, Prisma, OpenAI API, deployed on Vercel.’,
      url: ‘https://meeting-intelligence-app.vercel.app/’
    },
    {
      name: ‘GIS Analysis of Northwest Georgia (1830–1850)’,
      x: 100,
      y: 470,
      width: 175,
      height: 215,
      rotation: 0,
      description: ‘Analyzed 8 census and land-use datasets using ArcGIS to map demographic and infrastructure changes surrounding the 1838 Cherokee Removal. Produced 14 visualizations for a cross-disciplinary research paper.’,
      url: "assets/files/Lau_HIST_DCS_Project.pdf"
    },
    {
      name: ‘Financial Portfolio Analytics Dashboard’,
      x: 265,
      y: 248,
      width: 120,
      height: 120,
      rotation: 0,
      description: ‘Interactive Tableau dashboard with 2 years of daily market data across 6 asset classes. Python pipeline computes Sharpe ratio, max drawdown, rolling volatility. Streamlit app with OpenAI generates investment commentary.’,
      url: ‘https://finrisk-radar.streamlit.app/’
    },
    {
      name: ‘Predicting Ecological Trends with ML’,
      x: 500,
      y: 48,
      width: 68,
      height: 70,
      rotation: 0,
      description: ‘Built and evaluated a Random Forest model (78.4% accuracy) on 47k+ ecological records. Engineered features, cleaned noisy datasets, and analyzed model interpretability using Python (Pandas, scikit-learn, Matplotlib).’,
      url: ‘https://medium.com/@zoeexelbert/understanding-bird-populations-through-denmarks-emissions-8014fd834d8f’
    },
    {
      name: ‘AI-Powered Personal Portfolio’,
      x: 710,
      y: 0,
      width: 70,
      height: 280,
      rotation: 0,
      description: ‘Full-stack portfolio with AI chatbot, retrieval pipeline, and custom knowledge base. Built with FastAPI, LangChain, OpenAI API, and deployed on GitHub Pages. (You\’re exploring it right now!)’,
      url: ‘https://wingkiulau.github.io’
    }
  ];

  labZones.forEach((zone) => {
    const hitArea = scene.add.rectangle(zone.x, zone.y, zone.width, zone.height);
    hitArea.setOrigin(0.5);
    hitArea.setRotation(zone.rotation);
    hitArea.setStrokeStyle(2, 0x00ffff, 0);
    hitArea.setInteractive({ cursor: 'pointer' });

    hitArea.on('pointerdown', () => {
      showLabPopup(scene, zone.name, zone.description, zone.url);
    });

    scene.interactiveObjects.push(hitArea);
  });
}

function showLabPopup(scene, title, description, url) {
  destroyExistingPopup(scene);

  const centerX = scene.cameras.main.width / 2;
  const centerY = scene.cameras.main.height / 2;

  scene.currentPopupElements = [];

  // Create text elements first to measure their dimensions
  const titleText = scene.add.text(centerX, centerY, title, {
    fontSize: '20px',
    color: '#000000',
    fontStyle: 'bold',
    align: 'center'
  }).setOrigin(0.5).setDepth(11);

  const descText = scene.add.text(centerX, centerY, description, {
    fontSize: '14px',
    color: '#000000',
    wordWrap: { width: 360 },
    align: 'center'
  }).setOrigin(0.5).setDepth(11);

  const button = scene.add.text(centerX, centerY, '🔗 View Project', {
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#0000aa',
    padding: { x: 10, y: 6 }
  }).setOrigin(0.5).setDepth(11).setInteractive({ cursor: 'pointer' });

  button.on('pointerdown', () => {
    window.open(url, '_blank');
  });

  // Calculate dynamic dimensions
  const padding = 30;
  const spacing = 20;
  
  const titleHeight = titleText.height;
  const descHeight = descText.height;
  const buttonHeight = button.height;
  
  const totalContentHeight = titleHeight + descHeight + buttonHeight + (spacing * 2);
  const totalHeight = totalContentHeight + (padding * 2);
  
  const maxWidth = Math.max(titleText.width, descText.width, button.width);
  const totalWidth = Math.max(420, maxWidth + (padding * 2)); // Min width of 420

  // Create background with calculated dimensions
  const box = scene.add.rectangle(centerX, centerY, totalWidth, totalHeight, 0xffffff)
    .setStrokeStyle(2, 0x000000)
    .setDepth(10)
    .setOrigin(0.5);

  // Position elements relative to the box
  const startY = centerY - (totalHeight / 2) + padding + (titleHeight / 2);
  
  titleText.setY(startY);
  descText.setY(startY + (titleHeight / 2) + spacing + (descHeight / 2));
  button.setY(startY + (titleHeight / 2) + spacing + descHeight + spacing + (buttonHeight / 2));

  scene.currentPopupElements.push(box, titleText, descText, button);

  if (!scene._hasPopupCloseListener) {
    scene.input.on('pointerdown', (pointer, gameObjects) => {
      const isClickInside = gameObjects.some(obj => scene.interactiveObjects.includes(obj));
      if (isClickInside) return;

      const bounds = box.getBounds();
      if (!bounds.contains(pointer.x, pointer.y)) {
        destroyExistingPopup(scene);
      }
    });
    scene._hasPopupCloseListener = true;
  }
}

function destroyExistingPopup(scene) {
  if (scene.currentPopupElements) {
    scene.currentPopupElements.forEach(el => el.destroy && el.destroy());
    scene.currentPopupElements = [];
  }
}