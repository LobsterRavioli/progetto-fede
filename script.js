document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-music');
    let musicStarted = false;

    function playMusic() {
        if (!musicStarted) {
            // Imposta il volume un po' più basso per non essere invadente
            audio.volume = 0.3;
            audio.play().then(() => {
                musicStarted = true;
            }).catch(error => {
                console.error("Errore nella riproduzione audio:", error);
            });
        }
    }

    // Tenta di far partire la musica alla prima interazione dell'utente
    document.body.addEventListener('click', playMusic, { once: true });
    document.body.addEventListener('touchstart', playMusic, { once: true });
});
