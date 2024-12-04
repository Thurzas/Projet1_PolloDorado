window.addEventListener('load', () => {
    const audio = document.querySelector('audio');
    const mute = document.querySelector('#mute');
    const abort = document.querySelector('#abort');        
    // Définit le volume à 50% (0.5)
    audio.volume = 0.3;

    // Ajoute un délai de 5 secondes avant de lancer la lecture
    setTimeout(() => {
        if(PermissionStatus.audio)
        {
            audio.play().catch(error => {
                console.error('Erreur de lecture audio:', error);
            });
        }
    }, 6000); 

    mute.addEventListener('click', () => {
        audio.muted =!audio.muted;
    });

    abort.addEventListener('click', (e) => {
        const title = document.querySelector('#title');
        const intro = document.querySelector('#intro');
        const board = document.querySelector("#board");
        const content = document.querySelector('#content');
        const outros = document.querySelectorAll('.pop-in');
        const body = document.querySelector('body');
        const abort = document.querySelector('#abort');

        console.log(outros);
        outros.forEach((item)=>{
            item.classList.remove('pop-in');
            item.classList.add('pop-in-now');
        })
        body.style.overflow = "scroll";
        title.style.animation = "none";
        intro.style.animation = "none";
        board.style.animation = "none";        
        content.style.animation = "none";
        audio.muted = !audio.muted;
        abort.style.opacity = 0;
    });    

});
