// player.js
let player;

export function createPlayer(scene) {
  player = scene.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);

  scene.anims.create({
    key: 'walk_down',
    frames: scene.anims.generateFrameNumbers('player', { start: 18, end: 23 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: 'walk_right',
    frames: scene.anims.generateFrameNumbers('player', { start: 24, end: 29 }),
    frameRate: 10,
    repeat: -1,
  });
  scene.anims.create({
    key: 'walk_up',
    frames: scene.anims.generateFrameNumbers('player', { start: 30, end: 35 }),
    frameRate: 10,
    repeat: -1,
  });

  return player;
}

export function getPlayer() {
  return player;
}

// handlePlayerMovement expects cursors as parameter:
export function handlePlayerMovement(cursors, state) {
  if (state !== 'world') return;

  const speed = 200;
  player.setVelocity(0);
  let moving = false;

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
    player.setFlipX(true);
    player.anims.play('walk_right', true);
    moving = true;
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.setFlipX(false);
    player.anims.play('walk_right', true);
    moving = true;
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
    player.anims.play('walk_up', true);
    moving = true;
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
    player.anims.play('walk_down', true);
    moving = true;
  }

  if (!moving) player.anims.stop();
}
