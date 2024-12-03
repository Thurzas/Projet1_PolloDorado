window.addEventListener('load', () => {
    const audio = document.querySelector('audio');
        
    // Définit le volume à 50% (0.5)
    audio.volume = 0.5;

    // Ajoute un délai de 5 secondes avant de lancer la lecture
    setTimeout(() => {
        audio.play().catch(error => {
            console.error('Erreur de lecture audio:', error);
        });
    }, 5000); 
});