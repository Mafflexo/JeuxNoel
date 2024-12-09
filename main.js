// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: '100%',
      height: '100%'
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
let timeLeft = 30;
let bubbleTimer;
let isGameStarted = false;
let bubbleSpawnDelay = 1500; // Commence plus lentement
let difficultyIncreaseInterval = 5; // Accélère toutes les 5 secondes

function preload() {
    this.load.image('bubble', 'https://cdn-icons-png.flaticon.com/512/102/102344.png');
    this.load.image('startButton', 'https://cdn-icons-png.flaticon.com/512/0/375.png');
}

function create() {
    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Réinitialisation des variables
    score = 0;
    timeLeft = 30;
    isGameStarted = false;
    bubbleSpawnDelay = 1500;

    // Bouton de démarrage
    const startButton = this.add.image(screenWidth/2, screenHeight/2, 'startButton')
        .setScale(0.3)
        .setInteractive()
        .on('pointerdown', () => {
            startButton.destroy();
            startGame.call(this);
        });

    // Texte du score (en haut à gauche)
    scoreText = this.add.text(10, 10, `Score: ${score}`, { 
        fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
        fill: '#000',
        visible: false
    });

    // Texte du timer (en haut à gauche)
    timerText = this.add.text(10, 50, `Temps: ${timeLeft}s`, { 
        fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
        fill: '#000',
        visible: false
    });
}

function startGame() {
    // Rendre les textes visibles
    scoreText.setVisible(true);
    timerText.setVisible(true);

    // Timer principal
    this.time.addEvent({
        delay: 1000,
        callback: () => {
            timeLeft--;
            timerText.setText(`Temps: ${timeLeft}s`);

            // Augmentation de la difficulté
            if (timeLeft % difficultyIncreaseInterval === 0 && timeLeft > 0) {
                bubbleSpawnDelay = Math.max(300, bubbleSpawnDelay - 200);
                // Détruire l'ancien timer et en créer un nouveau
                if (bubbleTimer) bubbleTimer.remove();
                createBubbleSpawner.call(this);
            }

            if (timeLeft <= 0) {
                endGame.call(this);
            }
        },
        loop: true
    });

    // Première création du spawner de bulles
    createBubbleSpawner.call(this);
}

function createBubbleSpawner() {
    // Créer un nouveau timer pour les bulles avec le délai actuel
    bubbleTimer = this.time.addEvent({
        delay: bubbleSpawnDelay,
        callback: () => {
            const screenWidth = this.scale.width;
            const screenHeight = this.scale.height;

            const x = Phaser.Math.Between(50, screenWidth - 50);
            const y = Phaser.Math.Between(50, screenHeight - 50);
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

function endGame() {
    // Arrêter le timer des bulles
    if (bubbleTimer) bubbleTimer.remove();

    // Mettre en pause la scène
    this.scene.pause();

    const screenWidth = this.scale.width;
    const screenHeight = this.scale.height;

    // Texte de fin
    const endText = this.add.text(screenWidth/2, screenHeight/2, 'Partie terminée !', { 
        fontSize: `${Math.min(screenWidth, screenHeight) * 0.1}px`, 
        fill: '#ff0000',
        origin: 0.5
    });

    const scoreEndText = this.add.text(screenWidth/2, screenHeight/2 + 100, `Score final : ${score}`, { 
        fontSize: `${Math.min(screenWidth, screenHeight) * 0.06}px`, 
        fill: '#000',
        origin: 0.5
    });

    const replayText = this.add.text(screenWidth/2, screenHeight/2 + 200, 'Cliquez pour rejouer', { 
        fontSize: `${Math.min(screenWidth, screenHeight) * 0.05}px`, 
        fill: '#000',
        origin: 0.5
    });

    // Redémarrage du jeu au clic
    this.input.once('pointerdown', () => this.scene.restart());
}

function update() {
    // Pas d'update spécifique pour ce jeu
}