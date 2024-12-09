// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
let bubbleSpawnDelay = 1500;
let difficultyIncreaseInterval = 5;

function preload() {
    this.load.image('bubble', 'https://cdn-icons-png.flaticon.com/512/102/102344.png');
    this.load.image('startButton', 'https://cdn-icons-png.flaticon.com/512/0/375.png');
}

function create() {
    // Réinitialisation des variables
    score = 0;
    timeLeft = 30;
    isGameStarted = false;
    bubbleSpawnDelay = 1500;

    // Bouton de démarrage
    const startButton = this.add.image(400, 300, 'startButton')
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            startButton.destroy();
            startGame.call(this);
        });

    // Texte du score
    scoreText = this.add.text(10, 10, `Score: ${score}`, { 
        fontSize: '32px', 
        fill: '#000',
        visible: false
    });

    // Texte du timer
    timerText = this.add.text(10, 50, `Temps: ${timeLeft}s`, { 
        fontSize: '32px', 
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
    bubbleTimer = this.time.addEvent({
        delay: bubbleSpawnDelay,
        callback: () => {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
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

function endGame() {
    // Arrêter le timer des bulles
    if (bubbleTimer) bubbleTimer.remove();

    // Mettre en pause la scène
    this.scene.pause();

    // Texte de fin
    this.add.text(250, 250, 'Partie terminée !', { 
        fontSize: '48px', 
        fill: '#ff0000'
    });

    const scoreEndText = this.add.text(250, 350, `Score final : ${score}`, { 
        fontSize: '32px', 
        fill: '#000'
    });

    const replayText = this.add.text(250, 400, 'Cliquez pour rejouer', { 
        fontSize: '24px', 
        fill: '#000'
    });

    // Redémarrage du jeu au clic
    this.input.once('pointerdown', () => this.scene.restart());
}

function update() {
    // Pas d'update spécifique pour ce jeu
}