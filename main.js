// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.RESIZE, // Adapte le jeu dynamiquement
      autoCenter: Phaser.Scale.CENTER_BOTH, // Centre le jeu dans le viewport
      width: '100%', // Largeur dynamique
      height: '100%' // Hauteur dynamique
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
  let timer;
  let timeLeft = 30; // Durée du jeu en secondes
  
  function preload() {
    this.load.image('bubble', 'https://cdn-icons-png.flaticon.com/512/102/102344.png'); // URL ou image locale
  }
  
  function create() {
    // Réinitialisation des variables
    score = 0;
    timeLeft = 30;

    // Calcul de la taille dynamique pour les éléments
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;
  
    // Texte du score
    scoreText = this.add.text(10, 10, `Score: ${score}`, { 
      fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
      fill: '#000' 
    });
  
    // Texte du timer
    timerText = this.add.text(10, 50, `Temps: ${timeLeft}s`, { 
      fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
      fill: '#000' 
    });
  
    // Générer des bulles régulièrement
    this.time.addEvent({
      delay: 1000, // Une seconde
      callback: () => {
        timeLeft--;
        timerText.setText(`Temps: ${timeLeft}s`);
  
        if (timeLeft <= 0) {
          this.scene.pause();
          const endText = this.add.text(screenWidth/2, screenHeight/2, 'Partie terminée !', { 
            fontSize: `${Math.min(screenWidth, screenHeight) * 0.1}px`, 
            fill: '#ff0000',
            origin: 0.5
          });
          const replayText = this.add.text(screenWidth/2, screenHeight/2 + 50, 'Cliquez pour rejouer', { 
            fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
            fill: '#000',
            origin: 0.5
          });
          this.input.once('pointerdown', () => this.scene.restart());
        }
      },
      loop: true
    });
  
    // Ajoute des bulles
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const x = Phaser.Math.Between(50, screenWidth - 50); // Position X aléatoire
        const y = Phaser.Math.Between(50, screenHeight - 50); // Position Y aléatoire
        const bubbleSize = Math.min(screenWidth, screenHeight) * 0.1;
        const bubble = this.add.image(x, y, 'bubble').setScale(bubbleSize / 512);
  
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