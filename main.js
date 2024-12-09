// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
  let timer;
  let timeLeft = 30; // Durée du jeu en secondes
  
  function preload() {
    this.load.image('bubble', 'https://cdn-icons-png.flaticon.com/512/102/102344.png'); // URL ou image locale
  }
  
  function create() {
    score = 0;
    timeLeft = 30;
  
    // Texte du score
    scoreText = this.add.text(10, 10, `Score: ${score}`, { fontSize: '32px', fill: '#000' });
  
    // Texte du timer
    timerText = this.add.text(10, 50, `Temps: ${timeLeft}s`, { fontSize: '32px', fill: '#000' });
  
    // Générer des bulles régulièrement
    this.time.addEvent({
      delay: 1000, // Une seconde
      callback: () => {
        timeLeft--;
        timerText.setText(`Temps: ${timeLeft}s`);
  
        if (timeLeft <= 0) {
          this.scene.pause();
          this.add.text(300, 250, 'Partie terminée !', { fontSize: '48px', fill: '#ff0000' });
          this.add.text(300, 300, 'Cliquez pour rejouer', { fontSize: '24px', fill: '#000' });
          this.input.once('pointerdown', () => this.scene.restart());
        }
      },
      loop: true
    });
  
    // Ajoute des bulles
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const x = Phaser.Math.Between(50, 750); // Position X aléatoire
        const y = Phaser.Math.Between(50, 550); // Position Y aléatoire
        const bubble = this.add.image(x, y, 'bubble').setScale(0.1);
  
        // Animation de disparition
        this.tweens.add({
          targets: bubble,
          alpha: 0,
          duration: 2000,
          onComplete: () => bubble.destroy()
        });
  
        // Interaction tactile / clic
        bubble.setInteractive();
        bubble.on('pointerdown', () => {
          bubble.destroy();
          score += 10;
          scoreText.setText(`Score: ${score}`);
        });
      },
      loop: true
    });
  }
  
  function update() {
    // Pas d'update spécifique pour ce jeu
  }
  