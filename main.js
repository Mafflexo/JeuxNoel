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

function preload() {
  // Charger les bulles rouges et bleues
  this.load.image('bubbleBlue', 'assets/bubble_blue.png');
  this.load.image('bubbleRed', 'assets/bubble_red.png');
}

function create() {
  score = 0;
  timeLeft = 30;

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
        // Fin de partie
        this.scene.pause();
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Partie terminée !', {
          fontSize: '48px',
          fill: '#ff0000'
        }).setOrigin(0.5);
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'Cliquez pour rejouer', {
          fontSize: '24px',
          fill: '#000'
        }).setOrigin(0.5);
        this.input.once('pointerdown', () => this.scene.restart());
      }
    },
    loop: true
  });

  // Génération des bulles
  this.time.addEvent({
    delay: 700, // Toutes les 700 ms
    callback: () => {
      const x = Phaser.Math.Between(50, this.scale.width - 50); // Position X aléatoire
      const y = Phaser.Math.Between(50, this.scale.height - 50); // Position Y aléatoire

      // Générer une bulle rouge ou bleue aléatoirement
      const isBlue = Phaser.Math.Between(0, 1) === 0; // 50% de chance
      const bubble = this.add.image(x, y, isBlue ? 'bubbleBlue' : 'bubbleRed').setScale(0.2);

      // Interaction tactile / clic
      bubble.setInteractive();
      bubble.on('pointerdown', () => {
        bubble.destroy();

        if (isBlue) {
          // Bulle bleue : Ajoute des points et du temps
          score += 10;
          timeLeft += 2;
        } else {
          // Bulle rouge : Enlève des points et réduit le temps
          score -= 5;
          timeLeft -= 3;
        }

        // Mise à jour des affichages
        scoreText.setText(`Score: ${score}`);
        timerText.setText(`Temps: ${timeLeft}s`);
      });

      // Animation de disparition
      this.tweens.add({
        targets: bubble,
        alpha: 0,
        duration: 3000, // La bulle reste visible 3 secondes
        onComplete: () => bubble.destroy()
      });
    },
    loop: true
  });
}

function update() {
  // Pas d'update spécifique pour ce jeu
}
