const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  backgroundColor: '#87CEEB',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let timerText;
let timeLeft = 30; // Durée de la partie en secondes
let gameStarted = false; // Indique si le jeu a démarré

function preload() {
  // Charger toutes les photos
  this.load.image('Alix', 'assets/Alix.png');
  this.load.image('Charline', 'assets/Charline.png');
  this.load.image('Steevens', 'assets/Steevens.png');
  this.load.image('coco', 'assets/coco.png');
  this.load.image('Julia', 'assets/Julia.png');
  this.load.image('Dodo', 'assets/dodo.png');
  this.load.image('Matt', 'assets/Matt.png');
  this.load.image('Anaelle', 'assets/Anaelle.png');
  this.load.image('Lea', 'assets/lea.png');
  this.load.image('Mel', 'assets/Mel.png');
}

function create() {
  score = 0;
  timeLeft = 30;

  // Afficher le bouton "Start"
  const startButton = this.add.text(this.scale.width / 2, this.scale.height / 2, 'START', {
    fontSize: '48px',
    fill: '#fff',
    backgroundColor: '#000',
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  // Lancer le jeu au clic sur le bouton "Start"
  startButton.on('pointerdown', () => {
    startButton.destroy(); // Supprimer le bouton "Start"
    startGame.call(this); // Démarrer le jeu
  });
}

function startGame() {
  gameStarted = true;

  // Texte du score
  scoreText = this.add.text(10, 10, `Score: ${score}`, { fontSize: '32px', fill: '#000' });

  // Texte du timer
  timerText = this.add.text(10, 50, `Temps: ${timeLeft}s`, { fontSize: '32px', fill: '#000' });

  // Timer pour réduire le temps
  this.time.addEvent({
    delay: 1000, // Une seconde
    callback: () => {
      timeLeft--;
      timerText.setText(`Temps: ${timeLeft}s`);

      if (timeLeft <= 0) {
        endGame.call(this); // Fin du jeu
      }
    },
    loop: true
  });

  // Générer des photos en boucle avec variation de taille
  this.time.addEvent({
    delay: 700, // Toutes les 700 ms
    callback: () => {
      const x = Phaser.Math.Between(50, this.scale.width - 50); // Position X aléatoire
      const y = Phaser.Math.Between(50, this.scale.height - 50); // Position Y aléatoire

      // Liste des noms des images chargées
      const photos = [
        'Alix', 'Charline', 'Steevens', 'coco',
        'Julia', 'Dodo', 'Matt', 'Anaelle',
        'Lea', 'Mel'
      ];
      const randomPhoto = Phaser.Utils.Array.GetRandom(photos); // Choisir une photo aléatoire

      // Ajouter une photo aléatoire avec une variation de taille
      const randomScale = Phaser.Math.FloatBetween(0.2, 0.6); // Échelle entre 20% et 60%
      const photo = this.add.image(x, y, randomPhoto).setScale(randomScale);

      // Appliquer un filtre aléatoire (bleu ou rouge)
      const isBlue = Phaser.Math.Between(0, 1) === 0; // 50% de chance d'être bleu ou rouge
      photo.setTint(isBlue ? 0x0000ff : 0xff0000); // Bleu ou rouge

      // Interaction tactile / clic
      photo.setInteractive();
      photo.on('pointerdown', () => {
        photo.destroy();

        if (isBlue) {
          // Photo bleue : Ajoute des points et du temps
          score += 10;
          timeLeft += 2;
        } else {
          // Photo rouge : Enlève des points et réduit le temps
          score -= 5;
          timeLeft -= 3;
        }

        // Mise à jour des affichages
        scoreText.setText(`Score: ${score}`);
        timerText.setText(`Temps: ${timeLeft}s`);
      });

      // Animation de disparition
      this.tweens.add({
        targets: photo,
        alpha: 0, // Rendre transparent
        duration: 3000, // La photo reste visible 3 secondes
        onComplete: () => photo.destroy()
      });
    },
    loop: true
  });
}

function endGame() {
  // Afficher le message de fin de partie
  this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Partie terminée !', {
    fontSize: '48px',
    fill: '#ff0000'
  }).setOrigin(0.5);
  this.add.text(this.scale.width / 2, this.scale.height / 2, 'Cliquez pour rejouer', {
    fontSize: '24px',
    fill: '#000'
  }).setOrigin(0.5);

  // Attendre un clic pour redémarrer le jeu
  this.input.once('pointerdown', () => {
    this.scene.restart(); // Redémarrer la scène
  });
}

function update() {
  // Pas de mise à jour spécifique pour ce jeu
}
