// lab.js
export function createLabInterface(scene, backgroundSprite) {
  const labZones = [
    {
      name: 'Meeting Intelligence App',
      x: 75,
      y: 245,
      width: 120,
      height: 120,
      rotation: 0.03,
      description: 'Full-stack AI meeting summarization tool. Generates structured summaries, per-person action items, and risk flags from raw notes. Built with Next.js, PostgreSQL, Prisma, OpenAI API, deployed on Vercel.',
      url: 'https://meeting-intelligence-app.vercel.app/'
    },
    {
      name: 'GIS Analysis of Northwest Georgia (1830–1850)',
      x: 100,
      y: 470,
      width: 175,
      height: 215,
      rotation: 0,
      description: 'Analyzed 8 census and land-use datasets using ArcGIS to map demographic and infrastructure changes surrounding the 1838 Cherokee Removal. Produced 14 visualizations for a cross-disciplinary research paper.',
      url: "assets/files/Lau_HIST_DCS_Project.pdf"
    },
    {
      name: 'Financial Portfolio Analytics Dashboard',
      x: 265,
      y: 248,
      width: 120,
      height: 120,
      rotation: 0,
      description: 'Interactive Tableau dashboard with 2 years of daily market data across 6 asset classes. Python pipeline computes Sharpe ratio, max drawdown, rolling volatility. Streamlit app with OpenAI generates investment commentary.',
      url: 'https://finrisk-radar.streamlit.app/'
    },
    {
      name: 'Predicting Ecological Trends with ML',
      x: 500,
      y: 48,
      width: 68,
      height: 70,
      rotation: 0,
      description: 'Built and evaluated a Random Forest model (78.4% accuracy) on 47k+ ecological records. Engineered features, cleaned noisy datasets, and analyzed model interpretability using Python (Pandas, scikit-learn, Matplotlib).',
      url: 'https://medium.com/@zoeexelbert/understanding-bird-populations-through-denmarks-emissions-8014fd834d8f'
    },
    {
      name: 'AI-Powered Personal Portfolio',
      x: 710,
      y: 0,
      width: 70,
      height: 280,
      rotation: 0,
      description: 'Full-stack portfolio with AI chatbot, retrieval pipeline, and custom knowledge base. Built with FastAPI, LangChain, OpenAI API, and deployed on GitHub Pages. (You\'re exploring it right now!)',
      url: 'https://wingkiulau.github.io'
    },
    {
      name: 'Only Go Frogward',
      x: 540,
      y: 245,
      width: 120,
      height: 120,
      rotation: 0,
      description: '2D platformer built with C# and Unity. Guide the frog — but only forward!',
      url: 'https://3rooks.itch.io'
    },
    {
      name: 'Checkmaze',
      x: 730,
      y: 248,
      width: 120,
      height: 120,
      rotation: 0,
      description: '3D logic puzzle game built with C# and Unity. Navigate the maze using chess-piece movement rules.',
      url: 'https://3rooks.itch.io/checkmaze'
    },
    {
      name: 'Claw & Order',
      x: 620,
      y: 60,
      width: 130,
      height: 90,
      rotation: 0,
      description: '48-hour game jam entry. Multiplayer claw machine mayhem built with C# and Unity.',
      url: 'https://3rooks.itch.io'
    }
  ];

  drawLabThumbnails(scene);

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

function drawLabThumbnails(scene) {
  const W = 120;
  const H = 120;

  // Aligned with meeting (x=75) and financial (x=265) hitbox centers
  const meetingX = 75 - W / 2;   // 15
  const meetingY = 245 - H / 2;  // 185
  const financeX = 265 - W / 2;  // 205
  const financeY = 248 - H / 2;  // 188

  // --- Meeting Intelligence App ---
  const mg = scene.add.graphics().setDepth(1);
  mg.fillStyle(0xeef2fb); mg.fillRect(meetingX, meetingY, W, H);
  mg.lineStyle(1, 0x99aac4); mg.strokeRect(meetingX, meetingY, W, H);
  mg.lineStyle(1, 0xbbc8de);
  for (let i = 0; i < 5; i++) mg.lineBetween(meetingX + 10, meetingY + 30 + i * 13, meetingX + W - 10, meetingY + 30 + i * 13);
  mg.fillStyle(0xff3333); mg.fillCircle(meetingX + W - 12, meetingY + 10, 6);
  scene.interactiveObjects.push(mg);

  const mcx = 75;
  [
    scene.add.text(mcx, meetingY + 5,      'MEETING #9,847',      { fontSize: '8px',  color: '#334466', fontStyle: 'bold', align: 'center' }).setOrigin(0.5, 0).setDepth(2),
    scene.add.text(mcx, meetingY + H - 32, 'z  z  z',             { fontSize: '13px', color: '#7788aa', align: 'center' }).setOrigin(0.5, 0).setDepth(2),
    scene.add.text(mcx, meetingY + H - 16, "could've been\nan email", { fontSize: '7px', color: '#556688', align: 'center' }).setOrigin(0.5, 0).setDepth(2),
  ].forEach(o => scene.interactiveObjects.push(o));

  // --- Financial Portfolio Analytics ---
  const fg = scene.add.graphics().setDepth(1);
  fg.fillStyle(0x050f05); fg.fillRect(financeX, financeY, W, H);
  fg.lineStyle(1, 0x0d2a0d);
  for (let i = 1; i < 4; i++) fg.lineBetween(financeX, financeY + (H / 4) * i, financeX + W, financeY + (H / 4) * i);
  for (let i = 1; i < 4; i++) fg.lineBetween(financeX + (W / 4) * i, financeY, financeX + (W / 4) * i, financeY + H);
  const pts = [
    [financeX + 8,     financeY + H - 18],
    [financeX + 22,    financeY + H - 38],
    [financeX + 35,    financeY + H - 30],
    [financeX + 48,    financeY + H - 55],
    [financeX + 58,    financeY + H - 48],
    [financeX + 70,    financeY + H - 72],
    [financeX + 82,    financeY + H - 65],
    [financeX + W - 6, financeY + 14],
  ];
  fg.lineStyle(2, 0x00e844);
  for (let i = 0; i < pts.length - 1; i++) fg.lineBetween(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  fg.fillStyle(0x00e844); fg.fillCircle(pts[pts.length - 1][0], pts[pts.length - 1][1], 3);
  scene.interactiveObjects.push(fg);

  const fcx = 265;
  [
    scene.add.text(fcx, financeY + 5,      'STONKS',       { fontSize: '12px', color: '#00e844', fontStyle: 'bold', align: 'center' }).setOrigin(0.5, 0).setDepth(2),
    scene.add.text(fcx, financeY + H - 14, 'NUMBER GO UP', { fontSize: '7px',  color: '#44cc66', align: 'center' }).setOrigin(0.5, 0).setDepth(2),
  ].forEach(o => scene.interactiveObjects.push(o));
}