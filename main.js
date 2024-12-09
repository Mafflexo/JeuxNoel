// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT, // Adapte la scène à l'écran
      autoCenter: Phaser.Scale.CENTER_BOTH, // Centre le jeu
      width: window.innerWidth, // Largeur dynamique
      height: window.innerHeight // Hauteur dynamique
    },
    backgroundColor: '#87CEEB', // Fond bleu clair
    audio: {
      disableWebAudio: true // Désactive complètement l'audio
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  let score = 0; // Score du joueur
  let scoreText; // Texte affichant le score
  let timerText; // Texte affichant le temps restant
  let timeLeft = 30; // Durée de la partie en secondes
  
  // Précharge les ressources nécessaires au jeu
  function preload() {
    // Charge l'image des bulles
    this.load.image('bubble', 'https://cdn-icons-png.flaticon.com/512/102/102344.png');
  }
  
  // Crée les éléments de la scène
  function create() {
    const fontSize = Math.max(16, Math.floor(window.innerWidth / 20)); // Taille dynamique des textes (min 16px)
  
    // Affiche le score
    scoreText = this.add.text(10, 10, `Score: ${score}`, {
      fontSize: `${fontSize}px`,
      fill: '#000' // Couleur noire
    }).setOrigin(0, 0);
  
    // Affiche le temps restant
    timerText = this.add.text(10, fontSize + 20, `Temps: ${timeLeft}s`, {
      fontSize: `${fontSize}px`,
      fill: '#000' // Couleur noire
    }).setOrigin(0, 0);
  
    // Timer principal pour réduire le temps restant
    this.time.addEvent({
      delay: 1000, // Une seconde
      callback: () => {
        timeLeft--; // Réduit le temps
        timerText.setText(`Temps: ${timeLeft}s`); // Met à jour l'affichage
  
        if (timeLeft <= 0) {
          // Fin de la partie
          this.scene.pause(); // Pause la scène
          this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Partie terminée !', {
            fontSize: `${fontSize * 1.5}px`,
            fill: '#ff0000' // Rouge
          }).setOrigin(0.5);
          this.add.text(window.innerWidth / 2, (window.innerHeight / 2) + fontSize * 2, 'Cliquez pour rejouer', {
            fontSize: `${fontSize}px`,
            fill: '#000' // Noir
          }).setOrigin(0.5);
          this.input.once('pointerdown', () => this.scene.restart()); // Redémarre le jeu au clic
        }
      },
      loop: true
    });
  
    // Génère des bulles à intervalles réguliers
    this.time.addEvent({
      delay: 500, // Toutes les 500ms
      callback: () => {
        const bubbleSize = Math.floor(window.innerWidth / 15); // Taille des bulles proportionnelle à l'écran
        const x = Phaser.Math.Between(50, window.innerWidth - 50); // Position X aléatoire
        const y = Phaser.Math.Between(50, window.innerHeight - 50); // Position Y aléatoire
  
        const bubble = this.add.image(x, y, 'bubble')
          .setScale(bubbleSize / 256) // Ajuste la taille
          .setInteractive();
  
        // Interaction : clic ou toucher pour détruire la bulle
        bubble.on('pointerdown', () => {
          bubble.destroy(); // Détruit la bulle
          score += 10; // Augmente le score
          scoreText.setText(`Score: ${score}`); // Met à jour l'affichage
        });
  
        // Animation de disparition
        this.tweens.add({
          targets: bubble,
          alpha: 0, // Rend la bulle transparente
          duration: 2000, // 2 secondes
          onComplete: () => bubble.destroy() // Détruit la bulle après l'animation
        });
      },
      loop: true
    });
  }
  
  // Met à jour les éléments de la scène à chaque frame (non utilisé ici)
  function update() {
    // Pas de mise à jour nécessaire pour ce jeu
  }
  
  // Redimensionne le jeu en cas de changement de taille d'écran
  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight); // Redimensionne la scène
    const fontSize = Math.max(16, Math.floor(window.innerWidth / 20)); // Calcule la taille du texte
    scoreText.setFontSize(fontSize); // Met à jour la taille du texte du score
    timerText.setFontSize(fontSize); // Met à jour la taille du texte du temps
  });
  