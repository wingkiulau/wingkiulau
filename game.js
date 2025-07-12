//game.js
import { createPlayer, getPlayer, handlePlayerMovement } from './jsfiles/player.js';
import { createLibraryBooks } from './jsfiles/library.js';
import { isWritingMessage, createMailboxInterface, closeMessageInterface, handleKeyInput, showSavedMessage, hideSavedMessage} from './jsfiles/mail.js';
import { createResumeDownload } from './jsfiles/resume.js';
import { createSchoolInterface } from './jsfiles/school.js';
import { createLabInterface } from './jsfiles/lab.js';
import { createWizardInterface } from './jsfiles/wizard.js';

let buildings;
let buildingSprites = [];
let interactionText;
let backgroundSprite;
let backButton;
let currentState = 'world';
let currentBuilding = null;
let player;
let cursors;
let waterTiles = [];
let bridgeTiles = [];
let gameStarted = false;
let startButton;
let startOverlay;

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-container',
  backgroundColor: '#222',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  dom: {
    createContainer: true, 
  },
  scene: { preload, create, update },
};

let game;
game = new Phaser.Game(config);

window.currentGame = game;

function createStartScreen() {
  // Create a semi-transparent overlay
  startOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
  startOverlay.setInteractive();
  
  startButton = this.add.image(400, 300, 'start_button').setOrigin(0.5);
  startButton.setInteractive();
  startButton.on('pointerdown', () => {
    startGame.call(this);
  });
  
  startButton.on('pointerover', () => {
    startButton.setScale(1.1);
  });
  startButton.on('pointerout', () => {
    startButton.setScale(1.0);
  });
}

function startGame() {
  gameStarted = true;
  startOverlay.setVisible(false);
  startButton.setVisible(false);
  
  // Enable game input
  if (this.input && this.input.keyboard) {
    this.input.keyboard.enabled = true;
  }
}

function preload() {
  this.load.image('start_button', 'assets/start-button.png');
  this.load.image('grass', 'assets/grass.png');
  this.load.image('lab_full', 'assets/exteriors/lab.png');
  this.load.image('school_full', 'assets/exteriors/school.png');
  this.load.image('library_full', 'assets/exteriors/library.png');
  this.load.image('resumeshack_full', 'assets/exteriors/resume_shack.png');
  this.load.image('wizard_full', 'assets/exteriors/wizard.png');
  this.load.image('mailbox_full', 'assets/exteriors/mailbox.png');
  this.load.image('lab_bg', 'assets/backgrounds/lab-int.png');
  this.load.image('school_bg', 'assets/backgrounds/school-int.png');
  this.load.image('school_bg_open', 'assets/backgrounds/school2-int.png');
  this.load.image('library_bg', 'assets/backgrounds/library-int.png');
  this.load.image('resumeshack_bg', 'assets/backgrounds/resume-shack-int.png');
  this.load.image('wizard_bg', 'assets/backgrounds/wizard-int.png');
  this.load.image('mailbox_bg', 'assets/backgrounds/mail-int.png');
  
  this.load.spritesheet('player', 'assets/Player.png', {
    frameWidth: 32,
    frameHeight: 32,
  });
  this.load.spritesheet('grass_complex', 'assets/grass_complex.png', {
    frameWidth: 16,
    frameHeight: 16,
  });
  
  this.load.spritesheet('water', 'assets/water.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('bridge', 'assets/bridge.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
  const tileSize = 16;
  const cols = Math.ceil(800 / tileSize);
  const rows = Math.ceil(600 / tileSize);
  this.waterGroup = this.physics.add.staticGroup();
  this.worldSprites = []; //Store world-only sprites
  
  // Create the world background tiles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const texture = Math.random() < 0.5 ? 'grass_complex' : 'grass';
      const tile = this.add.image(x * tileSize, y * tileSize, texture).setOrigin(0);
      this.worldSprites.push(tile);
    }
  }
  
  // Create a background sprite for building interiors (initially hidden)
  backgroundSprite = this.add.image(400, 300, 'lab_bg').setOrigin(0.5);
  backgroundSprite.setDisplaySize(800, 600);
  backgroundSprite.setVisible(false); // Hide initially - world tiles show instead
  
  const selectedWaterFrame = 376;
  const waterChunks = [
    {
      originX: 0,
      originY: 1,
      width: 5,
      height: 10,
      extras: [
        { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 },
        { x: 0, y: 10 }, { x: 0, y: 11 }, { x: 5, y: 0 },
      ],
    },
    {
      originX: 25,
      originY: 8,
      width: 10,
      height: 4,
      extras: [
        { x: 1, y: -1 }, { x: 2, y: -1 }, { x: 3, y: -1 },
        { x: 4, y: -1 }, { x: 5, y: -1 }, { x: 6, y: -1 },
        { x: 9, y: 4 }, { x: 8, y: 4 }, { x: 7, y: 4 },
        { x: 6, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 4 },
        { x: 3, y: 4 }, { x: 2, y: 4 }, { x: 5, y: 5 },
        { x: 6, y: 5 }, { x: 4, y: 5 },
      ],
    },
    {
      originX: 3,
      originY: 33,
      width: 20,
      height: 5,
      extras: [
        { x: 2, y: -1 }, { x: 3, y: -1 }, { x: 4, y: -1 },
        { x: 5, y: -1 }, { x: 6, y: -1 }, { x: 7, y: -1 },
        { x: 8, y: -1 }, { x: 9, y: -1 }, { x: 10, y: -1 },
        { x: 11, y: -1 }, { x: -1, y: 1 }, { x: -1, y: 2 },
        { x: -1, y: 3 }, { x: -1, y: 4 }, { x: -2, y: 3 },
        { x: -2, y: 4 }, { x: -3, y: 3 }, { x: -3, y: 4 },
        { x: 20, y: 1 }, { x: 20, y: 2 }, { x: 20, y: 3 },
      ],
    },
  ];
  
  waterChunks.forEach(chunk => {
    for (let x = 0; x < chunk.width; x++) {
      for (let y = 0; y < chunk.height; y++) {
        const tileX = chunk.originX + x;
        const tileY = chunk.originY + y;
        const pixelX = tileX * tileSize;
        const pixelY = tileY * tileSize;
        const waterTile = this.add.image(pixelX, pixelY, 'water', selectedWaterFrame).setOrigin(0);
        this.worldSprites.push(waterTile); // Add to world sprites
        const waterCollider = this.add.rectangle(pixelX + tileSize / 2, pixelY + tileSize / 2, tileSize, tileSize, 0x0000ff, 0);
        this.physics.add.existing(waterCollider, true);
        this.waterGroup.add(waterCollider);
      }
    }
    chunk.extras.forEach(tile => {
      const tileX = chunk.originX + tile.x;
      const tileY = chunk.originY + tile.y;
      const pixelX = tileX * tileSize;
      const pixelY = tileY * tileSize;
      const waterTile = this.add.image(pixelX, pixelY, 'water', selectedWaterFrame).setOrigin(0);
      this.worldSprites.push(waterTile); // Add to world sprites
      const waterCollider = this.add.rectangle(pixelX + tileSize / 2, pixelY + tileSize / 2, tileSize, tileSize, 0x0000ff, 0);
      this.physics.add.existing(waterCollider, true);
      this.waterGroup.add(waterCollider);
    });
  });
  
  // Continue with original game setup
  this.registry.set('backgroundSprite', backgroundSprite);
  player = createPlayer(this);
  cursors = this.input.keyboard.createCursorKeys();
  buildings = this.physics.add.staticGroup();
  this.interactiveObjects = [];
  this.physics.add.collider(getPlayer(), this.waterGroup);
  
  const cropData = {
    lab: cropBuildingTexture(this, 'lab_full', 'lab', 10, 5, 120, 160),
    school: cropBuildingTexture(this, 'school_full', 'school', 25, 25, 80, 120),
    library: cropBuildingTexture(this, 'library_full', 'library', 10, 10, 140, 160),
    resumeshack: cropBuildingTexture(this, 'resumeshack_full', 'resumeshack', 7, 8, 70, 100),
    wizard: cropBuildingTexture(this, 'wizard_full', 'wizard', 2, 0, 25, 30),
    mailbox: cropBuildingTexture(this, 'mailbox_full', 'mailbox', 5, 5, 20, 20),
  };
  
  const buildingConfigs = [
    { name: 'Lab', key: 'lab', backgroundKey: 'lab_bg', x: 400, y: 400 },
    { name: 'School', key: 'school', backgroundKey: 'school_bg', x: 300, y: 100 },
    { name: 'Library', key: 'library', backgroundKey: 'library_bg', x: 670, y: 250 },
    { name: 'Resume Shack', key: 'resumeshack', backgroundKey: 'resumeshack_bg', x: 150, y: 300 },
    { name: 'Wizard Tower', key: 'wizard', backgroundKey: 'wizard_bg', x: 150, y: 100 },
    { name: 'Mailbox', key: 'mailbox', backgroundKey: 'mailbox_bg', x: 650, y: 500 }
  ];
  
  buildingConfigs.forEach(cfg => {
    const size = cropData[cfg.key];
    cfg.width = size.width;
    cfg.height = size.height;
    createBuilding.call(this, cfg);
  });
  
  this.enterKey = this.input.keyboard.addKey('ENTER');
  this.escKey = this.input.keyboard.addKey('ESC');
  this.input.keyboard.on('keydown', handleKeyInput);
  
  interactionText = this.add.text(400, 550, '', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 },
    align: 'center'
  }).setOrigin(0.5).setVisible(false);
  
  backButton = this.add.text(50, 50, 'Press ESC to go back', {
    fontSize: '16px',
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 10, y: 5 }
  }).setVisible(false);
  
  this.physics.add.collider(getPlayer(), buildings);
  createStartScreen.call(this);

  // Initially disable keyboard input
  if (this.input && this.input.keyboard) {
    this.input.keyboard.enabled = false;
  }
}

function update() {
  // Don't run game logic until started
  if (!gameStarted) return;
  if (this.escKey.isDown) {
    if (isWritingMessage) return closeMessageInterface.call(this);
    if (currentState === 'building') return returnToWorld.call(this);
  }
  
  handlePlayerMovement(cursors, currentState);
  checkBuildingInteractions.call(this);
}

function createBuilding(config) {
  const { x, y, width, height, name, key, backgroundKey } = config;
  
  // Visible rectangle to debug collision boxes
  const collisionBox = this.add.rectangle(x, y, width, height, 0x00ff00, 0).setOrigin(0.5);
  this.physics.add.existing(collisionBox, true);
  collisionBox.buildingName = name;
  collisionBox.buildingKey = key;
  collisionBox.backgroundKey = backgroundKey;
  buildings.add(collisionBox);
  
  const image = this.add.image(x, y, key).setOrigin(0.5);
  buildingSprites.push(image);
}

function checkBuildingInteractions() {
  // Only check for nearby buildings if in the world state
  if (currentState !== 'world') {
    interactionText.setVisible(false);
    return;
  }
  
  let nearby = null;
  const threshold = 100;
  const player = getPlayer();
  
  buildings.children.entries.forEach(b => {
    if (Phaser.Math.Distance.Between(player.x, player.y, b.x, b.y) < threshold) {
      nearby = b;
    }
  });
  
  if (nearby) {
    interactionText.setText(`Press ENTER to enter ${nearby.buildingName}`);
    interactionText.setVisible(true);
    if (this.enterKey.isDown) handleBuildingInteraction.call(this, nearby);
  } else {
    interactionText.setVisible(false);
  }
}

function handleBuildingInteraction(building) {
  currentState = 'building';
  currentBuilding = building;
  
  // Hide all world sprites (grass, water, etc.)
  this.worldSprites.forEach(sprite => sprite.setVisible(false));
  
  // Show the background sprite with the building's interior texture
  backgroundSprite.setTexture(building.backgroundKey);
  backgroundSprite.setVisible(true);
  
  getPlayer().setVisible(false);
  backButton.setVisible(true);
  interactionText.setVisible(false);
  buildingSprites.forEach(sprite => sprite.setVisible(false));
  buildings.children.entries.forEach(b => b.setVisible(false));
  
  // Clear existing interactive objects first
  clearInteractiveObjects.call(this);
  // Create new interactive objects for the building
  createInteractiveObjects.call(this, building.buildingKey);
  
  // Show saved message when entering mailbox
  if (building.buildingKey === 'mailbox') {
    showSavedMessage();
  }
}

function returnToWorld() {
  currentState = 'world';
  currentBuilding = null;
  
  // Hide the background sprite to show the world tiles
  backgroundSprite.setVisible(false);
  
  // Show all world sprites (grass, water, etc.) again
  this.worldSprites.forEach(sprite => sprite.setVisible(true));
  
  getPlayer().setVisible(true);
  backButton.setVisible(false);
  buildingSprites.forEach(sprite => sprite.setVisible(true));
  buildings.children.entries.forEach(b => b.setVisible(true));
  
  // Hide saved message when leaving any building
  hideSavedMessage();
  
  // Close chat popup when leaving wizard
  if (document.getElementById('chat-popup')) {
    window.closeChatPopup();
  }
  
  clearInteractiveObjects.call(this);
}

function createInteractiveObjects(key) {
  if (key === 'library') createLibraryBooks(this);
  else if (key === 'resumeshack') createResumeDownload(this);
  else if (key === 'mailbox') createMailboxInterface(this);
  else if (key === 'school') createSchoolInterface(this, backgroundSprite);
  else if (key === 'lab') createLabInterface(this, backgroundSprite);
  else if (key === 'wizard') createWizardInterface(this);
}

function clearInteractiveObjects() {
  this.interactiveObjects.forEach(obj => obj.destroy());
  this.interactiveObjects = [];
  closeMessageInterface();
}

function cropBuildingTexture(scene, sourceKey, newKey, cropX = 0, cropY = 0, cropWidth = 150, cropHeight = 150) {
  const src = scene.textures.get(sourceKey).getSourceImage();
  const canvas = scene.textures.createCanvas(`${newKey}_canvas`, cropWidth, cropHeight).getSourceImage();
  const ctx = canvas.getContext('2d');
  ctx.drawImage(src, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  scene.textures.addCanvas(newKey, canvas);
  return { width: cropWidth, height: cropHeight };
}