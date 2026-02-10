document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-music');
    const musicButton = document.getElementById('music-toggle-btn');

    if (musicButton && audio) {
        // Imposta il volume un po' più basso per non essere invadente
        audio.volume = 0.3;

        musicButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(error => {
                    console.error("Errore nella riproduzione audio:", error);
                });
                musicButton.textContent = '⏸️'; // Cambia in icona pausa
            } else {
                audio.pause();
                musicButton.textContent = '▶️'; // Cambia in icona play
            }
        });

        // Opzionale: se la musica finisce, resetta l'icona del bottone
        audio.addEventListener('ended', () => {
            musicButton.textContent = '▶️';
        });
    }
});
